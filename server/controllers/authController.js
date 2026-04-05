const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Profile = require("../models/Profile");
const crypto = require("crypto");
const mongoose = require("mongoose");
const { sendOtp } = require("../utils/mailer");
const otpStorage = new Map();

// user/USER REGISTRATION
exports.signup = async (req, res) => {
  const { name, email, phone, password, confirmPassword } = req.body;
  try {
    // Validation
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email or phone" });
    }

    const user = await User.create({ name, email, phone, password, role: "user" });
    res.status(201).json({ message: "Registration successful! Please login to continue." });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

// ADMIN REGISTRATION (Separate endpoint)
exports.adminSignup = async (req, res) => {
  const { name, email, phone, password, confirmPassword } = req.body;

  try {

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const adminExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists with this email or phone" });
    }

    const admin = await User.create({ name, email, phone, password, role: "admin" });
    res.status(201).json({ message: "Admin registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: 'Error creating admin', error: error.message });
  }
};

// LOGIN (Both user & Admin)
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid  password credentials' });
        }

        // Generate OTP
        const otp = crypto.randomInt(100000, 999999).toString(); 
        otpStorage.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

        // Send OTP
        await sendOtp(email, otp);

        res.status(200).json({ 
            message: "OTP sent to your email.", 
            email, 
            role: user.role 
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error , message: "Server Error" });
    }
};

// VERIFY OTP AND COMPLETE LOGIN
exports.verifyOtpAndLogin = async (req, res) => {
  const { email, userOtp } = req.body;

  try {
      const storedOtpData = otpStorage.get(email);

      if (!storedOtpData) {
          return res.status(400).json({ message: "No OTP request found for this email." });
      }

      if (Date.now() > storedOtpData.expiresAt) {
          otpStorage.delete(email);
          return res.status(400).json({ message: "OTP expired. Please request a new one." });
      }

      if (storedOtpData.otp !== userOtp) {
          return res.status(400).json({ message: "Invalid OTP." });
      }

      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      // Check if profile exists for users
      let profileExists = false;
      if (user.role === 'user') {
          const profile = await Profile.findOne({ userId: user._id });
          profileExists = !!profile;
      }

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" });
      otpStorage.delete(email);

      res.status(200).json({ 
          token, 
          user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              phone: user.phone,
              isProfileComplete: user.role === 'admin' ? true : profileExists
          }
      });
  } catch (error) {
      res.status(500).json({ message: "Error verifying OTP", error: error.message });
  }
};

// CREATE/UPDATE user PROFILE
exports.createProfile = async (req, res) => {
    try {
        const { id,education, skills, sector_interests, preferred_locations, language } = req.body;

        // Check if user is user
        const user = await User.findById(id);
        if (!user || user.role !== 'user') {
            return res.status(403).json({ message: "Only users can create profiles" });
        }

        // Check if profile already exists
        let profile = await Profile.findOne({ userId : id });

        console.log("Existing profile:", profile);
        
        if (profile) {
            // Update existing profile
            profile.education = education;
            profile.skills = skills;
            profile.sector_interests = sector_interests;
            profile.preferred_locations = preferred_locations;
            profile.language = language;
            profile.name = user.name; // Keep name synced
            
            await profile.save();
            
            // Update user's profile completion status
            user.isProfileComplete = true;
            await user.save();
            
            res.status(200).json({ 
                message: "Profile updated successfully!", 
                profile: {
                    id: profile._id,
                    name: profile.name,
                    education: profile.education,
                    skills: profile.skills,
                    sector_interests: profile.sector_interests,
                    preferred_locations: profile.preferred_locations,
                    language: profile.language
                }
            });
        } else {
            // Create new profile
            profile = await Profile.create({
                userId: user._id,
                name: user.name,
                education,
                skills,
                sector_interests,
                preferred_locations,
                language: language || 'en-IN'
            });
            console.log("New profile created:", profile);
            // Update user's profile completion status
            user.isProfileComplete = true;
            await user.save();
            
            res.status(201).json({ 
                message: "Profile created successfully!", 
                profile: {
                    id: profile._id,
                    name: profile.name,
                    education: profile.education,
                    skills: profile.skills,
                    sector_interests: profile.sector_interests,
                    preferred_locations: profile.preferred_locations,
                    language: profile.language
                }
            });
        }
    } catch (error) {
        console.error("Error managing profile:", error);
        res.status(500).json({ message: "Error managing profile", error: error.message });
    }
};

// GET USER PROFILE
exports.getUserProfile = async (req, res) => {
  try {
      const userId = new mongoose.Types.ObjectId(req.params.id);// From JWT middleware
      const user = await User.findById(userId).select('-password');

      if (!user) return res.status(404).json({ message: 'User not found' });

      let responseData = {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isProfileComplete: user.isProfileComplete
      };

      // If user, also get profile data
      if (user.role === 'user') {
          const profile = await Profile.findOne({ userId: user._id });
          if (profile) {
              responseData.profile = {
                  candidate_id: profile.candidate_id,
                  name: profile.name,
                  education: profile.education,
                  skills: profile.skills,
                  sector_interests: profile.sector_interests,
                  preferred_locations: profile.preferred_locations,
                  language: profile.language
              };
          }
      }

      res.json(responseData);
  } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
  }
};

// ENABLE/DISABLE EMAIL NOTIFICATIONS
exports.toggleNotificationPreference = async (req, res) => {
  try {
    const { enabled } = req.body;
    const userId = req.params.id;

    // Update notification preference in profile
    const updatedProfile = await Profile.findOneAndUpdate(
      { userId },
      { notificationsEnabled: enabled },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json({ 
      message: `Email notifications ${enabled ? 'enabled' : 'disabled'} successfully`,
      notificationsEnabled: enabled,
      type: 'email'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating notification preferences', 
      error: error.message 
    });
  }
};

// GET EMAIL NOTIFICATION STATUS
exports.getNotificationStatus = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    const profile = await Profile.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hasEmail = !!(user.email);
    const notificationsEnabled = !!(profile && profile.notificationsEnabled);

    res.status(200).json({
      hasEmail,
      email: user.email,
      notificationsEnabled,
      notificationType: 'email',
      status: hasEmail && notificationsEnabled ? 'enabled' : 'disabled'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error getting notification status', 
      error: error.message 
    });
  }
};



// ADMIN ONLY - Get all users
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }

    const users = await User.find({ role: 'user' }).select('-password');
    const usersWithProfiles = await Promise.all(
        users.map(async (user) => {
            const profile = await Profile.findOne({ userId: user._id });
            return {
                ...user.toObject(),
                profile: profile ? {
                    candidate_id: profile.candidate_id,
                    education: profile.education,
                    skills: profile.skills,
                    sector_interests: profile.sector_interests,
                    preferred_locations: profile.preferred_locations,
                    language: profile.language
                } : null
            };
        })
    );

    res.json(usersWithProfiles);
  } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
  }
};

// ADMIN ONLY - Delete user
exports.deleteUser = async (req, res) => {
  try {
      if (req.user.role !== 'admin') {
          return res.status(403).json({ message: 'Admin access required' });
      }

      const userId = new mongoose.Types.ObjectId(req.params.id);
      
      // Delete profile first
      await Profile.findOneAndDelete({ userId: userId });
      
      // Delete user
      const user = await User.findByIdAndDelete(userId);
      if (!user) return res.status(404).json({ message: 'user not found' });
      
      res.json({ message: 'user deleted successfully' });
  }
  catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
  }
};

let otp;

exports.otp = async (req, res) => {
  try {
      const { email } = req.body;
  
      // Generate a random OTP
      otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
  
      try {

          // Send the OTP to the user's email
          await sendOtp(email, otp);

          res.status(200).json({ message: 'OTP sent to your email.' });
      } catch (error) {
          console.error("Error sending email:", error);
          res.status(500).json({ message: 'Error sending OTP.' });
      }
  }
  catch (error) {
      res.status(500).json({ message: 'Error generating OTP', error });
  }
}

exports.verifyOtp = async (req, res) => {
  try {
      const { userOtp } = req.body;
  
      if (userOtp === otp) {
          res.status(200).json({ message: 'OTP verified successfully.' });
      } else {
          res.status(400).json({ message: 'Invalid OTP.' });
      }
  } catch (error) {
      res.status(500).json({ message: 'Error verifying OTP', error });
  }
}

exports.changePassword = async (req, res) => {
  const { email, currentPassword, newPassword, otp } = req.body;

  if (otp !== req.body.otp) {
      return res.status(400).json({ message: 'Invalid OTP.' });
  }

  try {
      // Find the user by email
      const user = await User.findOne({ email });
      
      if (!user) {
          return res.status(404).json({ message: 'User not found.' });
      }

      // Verify current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
          return res.status(400).json({ message: 'Current password is incorrect.' });
      }

      // Update the user's password
      user.password = newPassword; // Hashing will be handled in pre-save hook
      await user.save();

      res.status(200).json({ message: 'Password changed successfully!' });
  } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ message: 'Error changing password.' });
  }
};
