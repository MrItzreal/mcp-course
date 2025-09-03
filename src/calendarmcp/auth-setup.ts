import fs from "fs";
import path from "path";
import { createInterface } from "readline";

const { google } = require("googleapis");

// OAuth2 config
const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");
const TOKEN_PATH = path.join(process.cwd(), "token.json");

async function setupAuth() {
  if (fs.existsSync(TOKEN_PATH)) {
    console.log("Authentication already set up!");
    return;
  }
  
}
