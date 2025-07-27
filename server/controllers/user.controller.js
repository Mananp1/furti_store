import { UserProfile } from "../models/user.model.js";
import {
  validateAddress,
  getCitiesByState,
  getIndianStates,
} from "../utils/addressValidation.js";

// GET /api/users/profile - Get current user's profile
export const getUserProfile = async (req, res) => {
  try {
    const { authUserId, session } = req.user; // From auth middleware

    let userProfile = await UserProfile.findByAuthUserId(authUserId);

    // If no profile exists, create one from better-auth data
    if (!userProfile) {
      userProfile = await UserProfile.createOrUpdateFromAuth(session.user);
    }

    res.json({
      success: true,
      data: userProfile,
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({
      error: "Failed to fetch user profile",
      message: error.message,
    });
  }
};

// POST /api/users/profile - Create user profile (now handles better-auth data automatically)
export const createUserProfile = async (req, res) => {
  try {
    const { authUserId, session } = req.user;
    const profileData = req.body;

    // Check if profile already exists
    const existingProfile = await UserProfile.findByAuthUserId(authUserId);
    if (existingProfile) {
      return res.status(400).json({
        error: "Profile already exists",
        message: "User profile has already been created",
      });
    }

    // Validate addresses if provided
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

        // Use standardized address if validation passed
        if (validation.standardizedAddress) {
          profileData.addresses[i] = {
            ...validation.standardizedAddress,
            isDefault: address.isDefault,
          };
        }
      }
    }

    // Create new profile with better-auth data
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

// PUT /api/users/profile - Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { authUserId } = req.user;
    const updateData = req.body;

    console.log("Update profile request:", { authUserId, updateData });

    const userProfile = await UserProfile.findByAuthUserId(authUserId);
    if (!userProfile) {
      console.log("User profile not found for authUserId:", authUserId);
      return res.status(404).json({
        error: "User profile not found",
        message: "Please create your profile first",
      });
    }

    console.log("Found user profile:", userProfile);

    // Validate addresses if being updated
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

        // Use standardized address if validation passed
        if (validation.standardizedAddress) {
          updateData.addresses[i] = {
            ...validation.standardizedAddress,
            isDefault: address.isDefault,
          };
        }
      }
    }

    // Update profile
    const updatedProfile = await UserProfile.findByIdAndUpdate(
      userProfile._id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    console.log("Profile updated successfully:", updatedProfile);

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

// POST /api/users/addresses - Add new address (replaces existing addresses)
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

    // Validate the new address
    const validation = await validateAddress(newAddress);
    if (!validation.isValid) {
      return res.status(400).json({
        error: "Invalid address",
        message: "The provided address is not valid",
        suggestions: validation.suggestions,
      });
    }

    // Use standardized address and make it the default
    const standardizedAddress = {
      ...validation.standardizedAddress,
      isDefault: true, // Always make it default since it's the only address
    };

    // Replace all existing addresses with the new one
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

// PUT /api/users/addresses/:addressId - Update specific address
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

    // Validate the updated address
    const validation = await validateAddress(updateData);
    if (!validation.isValid) {
      return res.status(400).json({
        error: "Invalid address",
        message: "The provided address is not valid",
        suggestions: validation.suggestions,
      });
    }

    // Update address with standardized data and ensure it remains default
    Object.assign(address, {
      ...validation.standardizedAddress,
      isDefault: true, // Always keep it as default since it's the only address
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

// DELETE /api/users/addresses/:addressId - Delete specific address
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

    // Remove address
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

// PUT /api/users/addresses/:addressId/default - Set address as default
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

// GET /api/users/states - Get all Indian states
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

// GET /api/users/cities/:state - Get cities for a specific state
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

// DELETE /api/users/profile - Delete user account
export const deleteUserAccount = async (req, res) => {
  try {
    const { authUserId } = req.user;

    console.log("Delete account request for authUserId:", authUserId);

    const userProfile = await UserProfile.findByAuthUserId(authUserId);
    if (!userProfile) {
      console.log("User profile not found for deletion:", authUserId);
      return res.status(404).json({
        error: "User profile not found",
        message: "User profile does not exist",
      });
    }

    console.log("Found user profile for deletion:", userProfile._id);

    // Delete the user profile first
    await UserProfile.findByIdAndDelete(userProfile._id);
    console.log("User profile deleted successfully:", userProfile._id);

    // Return success - the Better Auth user will be deleted by the client
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
