import express from "express";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/health", (req, res) => {
  return res.status(200).json({
    status: "ok",
    message: "O Server iniciou corretamente!",
  });
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

export default app;
