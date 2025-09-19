"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const readline_1 = require("readline");
const { google } = require("googleapis");
// OAuth2 config
const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const CREDENTIALS_PATH = path_1.default.join(process.cwd(), "credentials.json");
const TOKEN_PATH = path_1.default.join(process.cwd(), "token.json");
async function setupAuth() {
    if (fs_1.default.existsSync(TOKEN_PATH)) {
        console.log("Authentication already set up!");
        return;
    }
    const credentials = JSON.parse(fs_1.default.readFileSync(CREDENTIALS_PATH, "utf8"));
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    // Init a client w/ the credentials
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
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
    const rl = (0, readline_1.createInterface)({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question("Paste authorization code here: ", (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) {
                console.error("Error retrieving access token: ", err);
                return;
            }
            fs_1.default.writeFileSync(TOKEN_PATH, JSON.stringify(token));
            console.log("Authentication successful!");
            console.log(`Token saved to: ${TOKEN_PATH}`);
            console.log("Your MCP server is now ready to access your calendar!");
        });
    });
}
setupAuth().catch(console.error);
