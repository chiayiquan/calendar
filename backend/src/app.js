import express from "express";
import cors from "cors";
import routes from "./routes";

const corsOpts = {
  origin: "*",

  methods: ["GET", "POST"],

  allowedHeaders: ["Content-Type", "Authorization"],
};

const app = express();
app.use(cors(corsOpts));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

routes(app);

export default app;
