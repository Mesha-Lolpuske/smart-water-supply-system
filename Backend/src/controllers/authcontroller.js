import User from "../models/User.js";
import {
  generateToken,
  setTokenCookie,
  clearTokenCookie,
} from "../utils/jwt.js";
import { generateOTP, getOTPExpiry } from "../utils/otp.js";
import { sendOTPEmail } from "../config/nodemailer.js"; 
import bcrypt from "bcryptjs";

// Register User
export const register = async (req, res) => {
  try {
    // 1. Extracted supplyArea from the request body
    const { name, email, password, address, phone, supplyArea } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Validate phone number
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // 2. Added validation for the new supplyArea field
    if (!supplyArea) {
      return res.status(400).json({ message: "Please select your water supply area" });
    }

    // Generate OTPs
    const otp = generateOTP();
    const otpExpires = getOTPExpiry();

    // 3. Saved user to the database (Passing plain password to avoid double-hashing bug)
    const user = await User.create({
      name,
      email,
      phone,
      password: password, 
      role: "user",
      address,
      supplyArea, 
      otp,
      otpExpires,
      isVerified: false,
    });

    console.log("Sending Maji Track verification code to:", user.email);

    // Send OTP via email 
    const emailResult = await sendOTPEmail(user.email, otp, user.name);
    
    // Check if email failed - we block if email fails as it's our primary channel
    if (!emailResult.success) {
      console.error("Email sending failed:", emailResult.error);
      return res.status(500).json({
        message: "User created but failed to send verification email",
      });
    }

    res.status(201).json({
      message: "Registration successful! Please check your email for OTP verification.",
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
    const { userId, otp } = req.body;

    if (!userId || userId.trim() === '') {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId).select("+otp +otpExpires");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    // Check if the provided OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid verification code" });
    }
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Verification code has expired" });
    }

    // Verify user
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
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
        supplyArea: user.supplyArea, // 4. Included supplyArea in the verified response
      },
    });
  } catch (error) {
    console.log("Verify OTP error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Resend OTP
export const resendOTP = async (req, res) => {
  try {
    const { userId, email } = req.body;

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
    await user.save();

    // Attempt to resend to email only
    const emailResult = await sendOTPEmail(user.email, otp, user.name);

    if (!emailResult.success) {
      return res.status(500).json({ message: "Failed to send OTP via email" });
    }

    res.status(200).json({
      message: `Maji Track OTP resent successfully to your email`
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
        supplyArea: user.supplyArea, // 5. Included supplyArea in the login response
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