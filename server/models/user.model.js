import mongoose from "mongoose";

// Address sub-schema with India-specific validation
const addressSchema = new mongoose.Schema(
  {
    street: {
      type: String,
      required: [true, "Street address is required"],
      trim: true,
      minlength: [5, "Street address must be at least 5 characters"],
      maxlength: [100, "Street address cannot exceed 100 characters"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      minlength: [2, "City name must be at least 2 characters"],
      maxlength: [50, "City name cannot exceed 50 characters"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
      minlength: [2, "State name must be at least 2 characters"],
      maxlength: [50, "State name cannot exceed 50 characters"],
      enum: {
        values: [
          "Maharashtra",
          "Tamil Nadu",
          "Gujarat",
          "Karnataka",
          "Uttar Pradesh",
          "West Bengal",
          "Telangana",
        ],
        message:
          "Please select a valid Indian state (top 7 states by GDP only)",
      },
    },
    zipCode: {
      type: String,
      required: [true, "PIN code is required"],
      trim: true,
      match: [
        /^[1-9][0-9]{5}$/,
        "Please enter a valid 6-digit PIN code (e.g., 400001)",
      ],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
      default: "India",
      enum: {
        values: ["India"],
        message: "Only Indian addresses are allowed",
      },
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

// User profile schema
const userProfileSchema = new mongoose.Schema(
  {
    // Link to better-auth user
    authUserId: {
      type: String,
      required: [true, "Auth user ID is required"],
      unique: true,
      index: true,
    },

    // Personal Information (from better-auth)
    firstName: {
      type: String,
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name cannot exceed 50 characters"],
      match: [
        /^[a-zA-Z\s'-]+$/,
        "First name can only contain letters, spaces, hyphens, and apostrophes",
      ],
    },
    lastName: {
      type: String,
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
      maxlength: [50, "Last name cannot exceed 50 characters"],
      match: [
        /^[a-zA-Z\s'-]+$/,
        "Last name can only contain letters, spaces, hyphens, and apostrophes",
      ],
    },

    // Contact Information
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },

    // Addresses
    addresses: {
      type: [addressSchema],
      default: [],
      validate: {
        validator: function (addresses) {
          // Ensure only one default address
          const defaultAddresses = addresses.filter((addr) => addr.isDefault);
          return defaultAddresses.length <= 1;
        },
        message: "Only one address can be set as default",
      },
    },

    // Account Settings
    preferences: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      marketingEmails: {
        type: Boolean,
        default: false,
      },
      orderUpdates: {
        type: Boolean,
        default: true,
      },
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true,
    },

    // Timestamps
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
userProfileSchema.index({ email: 1 });
userProfileSchema.index({ "addresses.isDefault": 1 });

// Pre-save middleware to ensure only one default address
userProfileSchema.pre("save", function (next) {
  if (this.addresses && this.addresses.length > 0) {
    const defaultAddresses = this.addresses.filter((addr) => addr.isDefault);
    if (defaultAddresses.length > 1) {
      return next(new Error("Only one address can be set as default"));
    }
  }
  next();
});

// Instance method to get default address
userProfileSchema.methods.getDefaultAddress = function () {
  return this.addresses.find((addr) => addr.isDefault) || null;
};

// Instance method to set default address
userProfileSchema.methods.setDefaultAddress = function (addressId) {
  // Remove default from all addresses
  this.addresses.forEach((addr) => {
    addr.isDefault = false;
  });

  // Set the specified address as default
  const address = this.addresses.id(addressId);
  if (address) {
    address.isDefault = true;
  }

  return this.save();
};

// Static method to find by auth user ID
userProfileSchema.statics.findByAuthUserId = function (authUserId) {
  return this.findOne({ authUserId });
};

// Static method to create or update profile from better-auth data
userProfileSchema.statics.createOrUpdateFromAuth = function (authUser) {
  return this.findOneAndUpdate(
    { authUserId: authUser.id },
    {
      authUserId: authUser.id,
      email: authUser.email,
      firstName: authUser.firstName || authUser.name?.split(" ")[0] || "",
      lastName:
        authUser.lastName || authUser.name?.split(" ").slice(1).join(" ") || "",
      lastLogin: new Date(),
    },
    {
      new: true,
      upsert: true,
      runValidators: false,
    }
  );
};

export const UserProfile = mongoose.model("UserProfile", userProfileSchema);
