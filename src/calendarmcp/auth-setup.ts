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

  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
  const { client_secret, client_id, redirect_uris } = credentials.installed;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  console.log("\n🔐 Setting up Calendar authentication...");
  console.log("\n1. Visit this URL in your browser:");
  console.log(`\n   ${authUrl}\n`);
  console.log("2. Grant permissions to your app");
  console.log("3. Copy the authorization code from the redirected URL\n");

  // rl = readline interface for user input
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Paste authorization code here: ", (code) => {
    rl.close();

    oAuth2Client.getToken(code, (err: any, token: any) => {
      if (err) {
        console.error("Error retrieving access token: ", err);
        return;
      }

      fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
      console.log("Authentication successful!");
      console.log(`Token saved to: ${TOKEN_PATH}`);
      console.log("Your MCP server is now ready to access your calendar!");
    });
  });
}

setupAuth().catch(console.error);
