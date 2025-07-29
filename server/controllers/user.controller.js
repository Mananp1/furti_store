import { UserProfile } from "../models/user.model.js";
import {
  validateAddress,
  getCitiesByState,
  getIndianStates,
} from "../utils/addressValidation.js";

export const getUserProfile = async (req, res) => {
  try {
    const { authUserId, session } = req.user;

    let userProfile = await UserProfile.findByAuthUserId(authUserId);

    if (!userProfile) {
      const firstName =
        session.user.firstName || session.user.name?.split(" ")[0] || "";
      const lastName =
        session.user.lastName ||
        session.user.name?.split(" ").slice(1).join(" ") ||
        "";

      userProfile = await UserProfile.createOrUpdateFromAuth({
        id: authUserId,
        email: session.user.email,
        firstName,
        lastName,
        name: session.user.name,
      });
    } else {
      const betterAuthFirstName =
        session.user.firstName || session.user.name?.split(" ")[0] || "";
      const betterAuthLastName =
        session.user.lastName ||
        session.user.name?.split(" ").slice(1).join(" ") ||
        "";

      if (
        !userProfile.firstName &&
        !userProfile.lastName &&
        (betterAuthFirstName || betterAuthLastName)
      ) {
        userProfile.firstName = betterAuthFirstName;
        userProfile.lastName = betterAuthLastName;
        userProfile.email = session.user.email;
        userProfile.lastLogin = new Date();

        await userProfile.save();
      }
    }

    res.json({
      success: true,
      data: userProfile,
    });
  } catch (error) {
    console.error("❌ Get user profile error:", error);
    res.status(500).json({
      error: "Failed to fetch user profile",
      message: error.message,
    });
  }
};

export const createUserProfile = async (req, res) => {
  try {
    const { authUserId, session } = req.user;
    const profileData = req.body;

    const existingProfile = await UserProfile.findByAuthUserId(authUserId);
    if (existingProfile) {
      return res.status(400).json({
        error: "Profile already exists",
        message: "User profile has already been created",
      });
    }

    if (profileData.addresses && profileData.addresses.length > 0) {
      for (let i = 0; i < profileData.addresses.length; i++) {
        const address = profileData.addresses[i];
        const validation = await validateAddress(address);

        if (!validation.isValid) {
          return res.status(400).json({
            error: "Invalid address",
            message: `Address ${i + 1} is not valid`,
            suggestions: validation.suggestions,
            field: `addresses.${i}`,
          });
        }

        if (validation.standardizedAddress) {
          profileData.addresses[i] = {
            ...validation.standardizedAddress,
            isDefault: address.isDefault,
          };
        }
      }
    }

    const newProfile = new UserProfile({
      ...profileData,
      authUserId,
      email: session.user.email,
      firstName:
        profileData.firstName ||
        session.user.firstName ||
        session.user.name?.split(" ")[0] ||
        "",
      lastName:
        profileData.lastName ||
        session.user.lastName ||
        session.user.name?.split(" ").slice(1).join(" ") ||
        "",
    });

    const savedProfile = await newProfile.save();

    res.status(201).json({
      success: true,
      message: "User profile created successfully",
      data: savedProfile,
    });
  } catch (error) {
    console.error("Create user profile error:", error);

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        error: "Validation failed",
        message: validationErrors.join(", "),
      });
    }

    res.status(500).json({
      error: "Failed to create user profile",
      message: error.message,
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { authUserId } = req.user;
    const updateData = req.body;

    const userProfile = await UserProfile.findByAuthUserId(authUserId);
    if (!userProfile) {
      return res.status(404).json({
        error: "User profile not found",
        message: "Please create your profile first",
      });
    }

    if (updateData.addresses && updateData.addresses.length > 0) {
      for (let i = 0; i < updateData.addresses.length; i++) {
        const address = updateData.addresses[i];
        const validation = await validateAddress(address);

        if (!validation.isValid) {
          return res.status(400).json({
            error: "Invalid address",
            message: `Address ${i + 1} is not valid`,
            suggestions: validation.suggestions,
            field: `addresses.${i}`,
          });
        }

        if (validation.standardizedAddress) {
          updateData.addresses[i] = {
            ...validation.standardizedAddress,
            isDefault: address.isDefault,
          };
        }
      }
    }

    const updatedProfile = await UserProfile.findByIdAndUpdate(
      userProfile._id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      success: true,
      message: "User profile updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Update user profile error:", error);

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        error: "Validation failed",
        message: validationErrors.join(", "),
      });
    }

    res.status(500).json({
      error: "Failed to update user profile",
      message: error.message,
    });
  }
};

export const addAddress = async (req, res) => {
  try {
    const { authUserId } = req.user;
    const newAddress = req.body;

    const userProfile = await UserProfile.findByAuthUserId(authUserId);
    if (!userProfile) {
      return res.status(404).json({
        error: "User profile not found",
        message: "Please create your profile first",
      });
    }

    const validation = await validateAddress(newAddress);
    if (!validation.isValid) {
      return res.status(400).json({
        error: "Invalid address",
        message: "The provided address is not valid",
        suggestions: validation.suggestions,
      });
    }

    const standardizedAddress = {
      ...validation.standardizedAddress,
      isDefault: true,
    };

    userProfile.addresses = [standardizedAddress];
    await userProfile.save();

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: userProfile.addresses[0],
    });
  } catch (error) {
    console.error("Add address error:", error);
    res.status(500).json({
      error: "Failed to add address",
      message: error.message,
    });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { authUserId } = req.user;
    const { addressId } = req.params;
    const updateData = req.body;

    const userProfile = await UserProfile.findByAuthUserId(authUserId);
    if (!userProfile) {
      return res.status(404).json({
        error: "User profile not found",
        message: "Please create your profile first",
      });
    }

    const address = userProfile.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({
        error: "Address not found",
        message: "The specified address does not exist",
      });
    }

    const validation = await validateAddress(updateData);
    if (!validation.isValid) {
      return res.status(400).json({
        error: "Invalid address",
        message: "The provided address is not valid",
        suggestions: validation.suggestions,
      });
    }

    Object.assign(address, {
      ...validation.standardizedAddress,
      isDefault: true,
    });

    await userProfile.save();

    res.json({
      success: true,
      message: "Address updated successfully",
      data: address,
    });
  } catch (error) {
    console.error("Update address error:", error);
    res.status(500).json({
      error: "Failed to update address",
      message: error.message,
    });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { authUserId } = req.user;
    const { addressId } = req.params;

    const userProfile = await UserProfile.findByAuthUserId(authUserId);
    if (!userProfile) {
      return res.status(404).json({
        error: "User profile not found",
        message: "Please create your profile first",
      });
    }

    const address = userProfile.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({
        error: "Address not found",
        message: "The specified address does not exist",
      });
    }

    userProfile.addresses.pull(addressId);
    await userProfile.save();

    res.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Delete address error:", error);
    res.status(500).json({
      error: "Failed to delete address",
      message: error.message,
    });
  }
};

export const setDefaultAddress = async (req, res) => {
  try {
    const { authUserId } = req.user;
    const { addressId } = req.params;

    const userProfile = await UserProfile.findByAuthUserId(authUserId);
    if (!userProfile) {
      return res.status(404).json({
        error: "User profile not found",
        message: "Please create your profile first",
      });
    }

    await userProfile.setDefaultAddress(addressId);

    res.json({
      success: true,
      message: "Default address updated successfully",
      data: userProfile.getDefaultAddress(),
    });
  } catch (error) {
    console.error("Set default address error:", error);
    res.status(500).json({
      error: "Failed to set default address",
      message: error.message,
    });
  }
};

export const getStates = async (req, res) => {
  try {
    const states = await getIndianStates();
    res.json({
      success: true,
      data: states,
    });
  } catch (error) {
    console.error("Get states error:", error);
    res.status(500).json({
      error: "Failed to get states",
      message: error.message,
    });
  }
};

export const getCities = async (req, res) => {
  try {
    const { state } = req.params;
    const cities = await getCitiesByState(state);
    res.json({
      success: true,
      data: cities,
    });
  } catch (error) {
    console.error("Get cities error:", error);
    res.status(500).json({
      error: "Failed to get cities",
      message: error.message,
    });
  }
};

export const deleteUserAccount = async (req, res) => {
  try {
    const { authUserId } = req.user;

    const userProfile = await UserProfile.findByAuthUserId(authUserId);
    if (!userProfile) {
      return res.status(404).json({
        error: "User profile not found",
        message: "User profile does not exist",
      });
    }

    await UserProfile.findByIdAndDelete(userProfile._id);

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete user account error:", error);
    res.status(500).json({
      error: "Failed to delete account",
      message: error.message,
    });
  }
};
