import express from "express";
import { AuthController } from "../controllers/AuthController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

const authController = new AuthController();

router.post("/signup", authController.signup.bind(authController));
router.post("/login", authController.login.bind(authController));

// Protected routes
router.get(
  "/logout",
  authMiddleware,
  authController.logout.bind(authController)
);
router.get(
  "/users/:id",
  authMiddleware,
  authController.getUser.bind(authController)
);
router.get(
  "/users",
  authMiddleware,
  authController.getAllUsers.bind(authController)
);
router.put(
  "/users/:id",
  authMiddleware,
  authController.updateUser.bind(authController)
);
router.delete(
  "/users/:id",
  authMiddleware,
  authController.deleteUser.bind(authController)
);

export default router;
