import express, { json } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();


// POST /api/auth/register
router.post("/register", async (req, res) => {
  // - Validate input
  // - Check if user exists
  // - Hash password
  // - Save user
  // - Return user (without password)

  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name,email,password fields are required" })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password's length should be greqter than 6" })
    }

    const userExists = await User.findOne({ email })

    if (userExists) {
      return res.status(409).json({ message: "User already exist" })
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const user = await User.create({
      name,
      email,
      password: hashedPassword

    })

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,

    }

    res.status(201).json(userResponse)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }





});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  // - Find user
  // - Compare password
  // - Generate JWT
  // - Return token

  try {

    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({ message: "Username or password is invalid" })
    }

    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) {
      return res.status(401).json({ message: "Username or password is invalid" })
    }

    const _token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )

    res.status(200).json({ token: _token })
  } catch (error) {
    res.status(500).json({ error: "Server error" })
  }


});

export default router;