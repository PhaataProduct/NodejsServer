import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from "http";
import { ConnectSocket } from "./config/Socket.js";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const app = express();
const server = createServer(app);
const PORT = 4000;

ConnectSocket(server);

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

server.listen(PORT, () => {
  console.log(`app run on port ${PORT}`);
});
