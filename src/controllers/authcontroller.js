import User from "../models/User.js";
import {
  generateToken,
  setTokenCookie,
  clearTokenCookie,
} from "../utils/jwt.js";
import { generateOTP, getOTPExpiry } from "../utils/otp.js";
import { sendOTPEmail } from "../config/nodemailer.js";

// Register User
export const register = async (req, res) => {
  try {
    const { name, email, password, role, address } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Validate role
    if (role && !["user", "admin"].includes(role)) {
      return res
        .status(400)
        .json({ message: 'Invalid role. Must be either "user" or "admin"' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = getOTPExpiry();

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || "user",
      address,
      otp,
      otpExpires,
    });

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp, name);

    if (!emailSent) {
      return res.status(500).json({
        message: "User created but failed to send OTP email",
      });
    }

    res.status(201).json({
      message:
        "Registration successful! Please check your email for OTP verification.",
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

    const user = await User.findById(userId).select("+otp +otpExpires");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
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

    const emailSent = await sendOTPEmail(user.email, otp, user.name);

    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    res.status(200).json({ message: "OTP resent successfully" });
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
