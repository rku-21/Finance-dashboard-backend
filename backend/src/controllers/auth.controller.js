import { loginUser, registerUser } from "../services/auth.service.js";
import { generateToken } from "../utils/helpers.js";


export const login = async (req, res) => {
  try {
    const { email,password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    const user = await loginUser(req.body);
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "login successfully",
      token,
      user,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};


export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const user = await registerUser(req.body);
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "register successfully",
      token,
      user,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};