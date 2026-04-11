import User from "../models/User.js";
import {
  generateToken,
  setTokenCookie,
  clearTokenCookie,
} from "../utils/jwt.js";
import { generateOTP, getOTPExpiry } from "../utils/otp.js";
import { sendOTPEmail } from "../config/nodemailer.js";
import { sendSMSOTP, formatPhoneNumber } from "../utils/sms.js";
import bcrypt from "bcryptjs";

// Register User
export const register = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Validate phone number
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTPs
    const otp = generateOTP();
    const otpExpires = getOTPExpiry();

    // Format phone number
    const formattedPhone = formatPhoneNumber(phone);

    // Create user
    const user = await User.create({
      name,
      email,
      phone: formattedPhone,
      password,
      role: "user",
      address,
      otp,
      otpExpires,
      smsOTP: otp, // Same OTP for both email and SMS
      smsOTPExpires: otpExpires,
      isVerified: false,
    });

    console.log("Sending OTP to:", user.email, "and", user.phone);

    // Send OTP email
    const emailSent = await sendOTPEmail(user.email, otp, user.name);

    // Send SMS OTP
    const smsSent = await sendSMSOTP(user.phone, otp, user.name);

    if (!emailSent.success) {
      console.error("Email sending failed:", emailSent.error);
    }

    if (!smsSent.success) {
      console.error("SMS sending failed:", smsSent.error);
    }

    if (!emailSent.success && !smsSent.success) {
      return res.status(500).json({
        message: "User created but failed to send verification codes",
      });
    }

    res.status(201).json({
      message:
        "Registration successful! Please check your email and phone for OTP verification.",
      userId: user._id,
    });
  } catch (error) {
    console.log("Register error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { userId, otp, method = 'email' } = req.body;

    if (!userId || userId.trim() === '') {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId).select("+otp +otpExpires +smsOTP +smsOTPExpires");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    let isValidOTP = false;

    // Check OTP based on method
    if (method === 'sms') {
      if (user.smsOTP !== otp) {
        return res.status(400).json({ message: "Invalid SMS OTP" });
      }
      if (user.smsOTPExpires < Date.now()) {
        return res.status(400).json({ message: "SMS OTP has expired" });
      }
      isValidOTP = true;
    } else {
      // Default to email OTP
      if (user.otp !== otp) {
        return res.status(400).json({ message: "Invalid email OTP" });
      }
      if (user.otpExpires < Date.now()) {
        return res.status(400).json({ message: "Email OTP has expired" });
      }
      isValidOTP = true;
    }

    if (isValidOTP) {
      // Verify user
      user.isVerified = true;
      user.otp = undefined;
      user.otpExpires = undefined;
      user.smsOTP = undefined;
      user.smsOTPExpires = undefined;
      await user.save();

      const token = generateToken(user._id, user.role);

      // Set token in cookie
      setTokenCookie(res, token);

      res.status(200).json({
        message: "Account verified successfully!",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          address: user.address,
        },
      });
    }
  } catch (error) {
    console.log("Verify OTP error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Resend OTP
export const resendOTP = async (req, res) => {
  try {
    const { userId, email, method = 'both' } = req.body;

    let user;
    if (userId) {
      user = await User.findById(userId);
    } else if (email) {
      user = await User.findOne({ email });
    } else {
      return res
        .status(400)
        .json({ message: "Please provide userId or email to resend OTP" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    const otp = generateOTP();
    const otpExpires = getOTPExpiry();

    user.otp = otp;
    user.otpExpires = otpExpires;
    user.smsOTP = otp;
    user.smsOTPExpires = otpExpires;
    await user.save();

    let emailSent = { success: false };
    let smsSent = { success: false };

    if (method === 'email' || method === 'both') {
      emailSent = await sendOTPEmail(user.email, otp, user.name);
    }

    if (method === 'sms' || method === 'both') {
      smsSent = await sendSMSOTP(user.phone, otp, user.name);
    }

    if (!emailSent.success && !smsSent.success) {
      return res.status(500).json({ message: "Failed to send OTP via both email and SMS" });
    }

    const sentMethods = [];
    if (emailSent.success) sentMethods.push('email');
    if (smsSent.success) sentMethods.push('SMS');

    res.status(200).json({
      message: `OTP resent successfully via ${sentMethods.join(' and ')}`
    });
  } catch (error) {
    console.log("Resend OTP error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res
        .status(401)
        .json({ message: "Please verify your account first" });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id, user.role);

    // Set token in cookie
    setTokenCookie(res, token);

    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
      },
    });
  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Logout User
export const logout = async (req, res) => {
  try {
    // Clear token cookie
    clearTokenCookie(res);

    res.status(200).json({ message: "Logout successful!" });
  } catch (error) {
    console.log("Logout error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get current user (Me)
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.log("GetMe error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
