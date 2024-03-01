/* eslint-disable no-undef */
import express from "express";
import winston from "winston";
import accounts from "./routes/accounts.routes.js";
import { promises as fs } from "fs";
import cors from "cors";

const { readFile, writeFile } = fs;

const { combine, timestamp, label, printf } = winston.format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

global.jsonFile = "accounts.json";

global.logger = winston.createLogger({
  level: "silly",
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({
      filename: "api-logs.log"
    })
  ],
  format: combine(
    label({ label: "api-logs" }),
    timestamp(),
    myFormat
  )
});

const app = express();
app.use(express.json());
app.use(cors());
app.use("/accounts", accounts);

app.listen(4080, async () => {
  try {
    await readFile(jsonFile);
    logger.info("API started!");
  } catch (err) {
    const initialJson = {
      nextId: 1,
      accounts: [],
    };
    logger.info("JSON file created");
    try {
      await writeFile(jsonFile, JSON.stringify(initialJson));
    } catch (err) {
      logger.error(err.message);
    }
  }
});
