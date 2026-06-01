import { Router } from "express";
import {
  getPosts,
  deletePost,
  createPost,
  updatePost,
} from "../controllers/postController.js";

const router = Router();

router.get("/", getPosts);
router.get("/:id", getPosts);

router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;
