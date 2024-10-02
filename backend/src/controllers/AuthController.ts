import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

export class AuthController {
  private userRepository = AppDataSource.getRepository(User);

  async signup(req: Request, res: Response): Promise<void | any> {
    try {
      const { username, email, password } = req.body;

      const existingUser = await this.userRepository.findOne({
        where: [{ email }],
      });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = this.userRepository.create({ username, email, password });
      await this.userRepository.save(user);

      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error });
    }
  }

  async login(req: Request, res: Response): Promise<void | any> {
    try {
      const { email, password } = req.body;

      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "1h",
        }
      );
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Use secure cookies in production
          maxAge: 3600000, // 1 hour
        })
        .json({
          token,
          user: { id: user.id, username: user.username, email: user.email },
        });
    } catch (error) {
      res.status(500).json({ message: "Error logging in", error });
    }
  }

  async getUser(req: Request, res: Response): Promise<void | any> {
    try {
      const id = parseInt(req.params.id);
      const user = await this.userRepository.findOne({
        where: { id },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void | any> {
    try {
      const users = await this.userRepository.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void | any> {
    try {
      const id = parseInt(req.params.id);
      const { username, email } = req.body;

      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.username = username || user.username;
      user.email = email || user.email;

      await this.userRepository.save(user);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void | any> {
    try {
      const id = parseInt(req.params.id);
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await this.userRepository.remove(user);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });

      res.json({ message: "Logout successful" });
    } catch (error) {
      res.status(500).json({ message: "Error logging out", error });
    }
  }
}
