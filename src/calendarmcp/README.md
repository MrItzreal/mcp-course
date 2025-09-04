# Google Calendar MCP Server

A Model Context Protocol (MCP) server that provides secure access to Google Calendar functionality through OAuth2 authentication. This server enables reading calendar events and creating new events programmatically.

## Acknowledgments

This project was inspired by and built upon the foundational concepts learned from this tutorial:

**"MCP Server Tutorial | Build your first MCP Server with TypeScript SDK":**

- **Tutorial**: [https://www.youtube.com/watch?v=XC49e0pliEE](https://www.youtube.com/watch?v=XC49e0pliEE)
- **Original Repository**: [https://github.com/logicbaselabs/mcp-tutorial](https://github.com/logicbaselabs/mcp-tutorial)

### What I Learned vs. What I Enhanced

**From the Tutorial**:

- Basic MCP server structure and implementation
- Google Calendar API integration concepts
- TypeScript usage with MCP SDK
- Reading calendar events using public calendar access

**My Enhancements**:

- **OAuth2 Authentication**: Upgraded from public calendar access to secure private calendar access
- **Write Functionality**: Added calendar event creation capabilities (tutorial was read-only)
- **Production Security**: Implemented proper token management and credential handling
- **Advanced Error Handling**: Added comprehensive error handling and user feedback
- **Enterprise Patterns**: Following industry-standard authentication and security practices
- **Complete Documentation**: Created comprehensive setup and troubleshooting guides

## Table of Contents

- [Acknowledgments](#acknowledgments)
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Google Cloud Console Setup](#google-cloud-console-setup)
- [OAuth2 Authentication Setup](#oauth2-authentication-setup)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [Troubleshooting](#troubleshooting)
- [Security Considerations](#security-considerations)

## Overview

This project implements a professional-grade MCP server that integrates with Google Calendar API using OAuth2 authentication. It demonstrates modern software engineering practices including secure authentication, proper error handling, TypeScript implementation, and adherence to the Model Context Protocol specification.

### What is MCP?

Model Context Protocol (MCP) is a standardized protocol that enables AI assistants and other tools to securely access external data sources and services. This server acts as a bridge between MCP clients and Google Calendar.

## Features

- **🔐 OAuth2 Authentication**: Secure, industry-standard authentication flow
- **📅 Read Calendar Events**: Retrieve events for specific dates
- **➕ Create Calendar Events**: Add new events with full details
- **🛡️ Secure Token Management**: Automatic token refresh and secure storage
- **📝 TypeScript Support**: Full type safety and modern development practices
- **🔧 Error Handling**: Comprehensive error handling and user feedback
- **🚀 Production Ready**: Following enterprise-level security patterns

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   MCP Client    │◄──►│   MCP Server     │◄──►│ Google Calendar │
│   (Any Agent)   │    │  (This Project)  │    │      API        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────┐
                       │ OAuth2 Tokens│
                       │  (token.json) │
                       └──────────────┘
```

## Prerequisites

Before setting up this project, ensure you have:

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **Google Account** with Google Calendar access
- **Google Cloud Console** account (free)

## Installation

1. **Clone the repository** (if not already done):

   ```bash
   git clone <your-repo-url>
   cd mcp-course
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Install additional required packages**:
   ```bash
   npm install googleapis
   ```

## Google Cloud Console Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Enter project name: `mcp-calendar-server`
4. Click **"Create"**

### Step 2: Enable Google Calendar API

1. In your project, go to **APIs & Services** → **Library**
2. Search for **"Google Calendar API"**
3. Click on it and press **"Enable"**

### Step 3: Configure OAuth Consent Screen

1. Navigate to **APIs & Services** → **OAuth consent screen**
2. Choose **"External"** user type (unless you have Google Workspace)
3. Fill in required information:
   - **App name**: `Izzy Calendar MCP Server`
   - **User support email**: Your Gmail address
   - **Developer contact information**: Your Gmail address
4. Click **"Save and Continue"**

### Step 4: Add Scopes

1. Click **"Add or Remove Scopes"**
2. Add the following scope:
   ```
   https://www.googleapis.com/auth/calendar
   ```
3. Click **"Update"** → **"Save and Continue"**

### Step 5: Add Test Users

⚠️ **CRITICAL STEP** - Without this, you'll get "Access blocked" errors:

1. In the **"Test users"** section, click **"Add Users"**
2. Add your email address (the one you want to access calendar for):
   ```
   your-email@gmail.com
   ```
3. Click **"Save"**

### Step 6: Create OAuth2 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. Select **"Desktop application"**
4. Name: `MCP Calendar Client`
5. Click **"Create"**
6. **Download the JSON file** and save it as `credentials.json` in your project root

## OAuth2 Authentication Setup

### Understanding OAuth2 Flow

Here's how it works in this project:

1. **Authorization Request**: App requests permission to access user's calendar
2. **User Consent**: User reviews and grants permissions
3. **Authorization Code**: Google provides a temporary code
4. **Token Exchange**: Code is exchanged for access tokens
5. **API Access**: Tokens are used to make authenticated API calls
6. **Token Refresh**: Expired tokens are automatically refreshed

### Step 1: Place Credentials File

Ensure your `credentials.json` file is in the project root:

```
mcp-course/
├── credentials.json  ← Downloaded from Google Cloud Console
├── src/
├── package.json
└── ...
```

### Step 2: Run Authentication Setup

```bash
npm run calendarmcp:auth:setup
```

This will:

1. Generate a unique authorization URL
2. Open your browser to Google's authorization page
3. Prompt you to grant calendar permissions
4. Ask you to paste the authorization code
5. Create `token.json` with your access tokens

### Step 3: Complete Authorization Flow

1. **Copy the URL** displayed in your terminal
2. **Open it in your browser**
3. **Sign in** with your Google account
4. **Grant permissions** to access your calendar
5. **Copy the code** from the redirected URL (after `code=`)
6. **Paste it** in your terminal when prompted

Example redirected URL:

```
http://localhost/?code=4/0AeanS0ZS9-ABC123...&scope=https://www.googleapis.com/auth/calendar
```

Copy: `4/0AeanS0ZS9-ABC123...` (everything between `code=` and `&scope`)

## Configuration

### Environment Variables

Create a `.env` file in your project root:

```env
# Your Google API key (for additional services if needed)
GEMINI_API_KEY=your_gemini_api_key_here

# Your calendar ID (usually your Gmail address)
CALENDAR_ID=your-email@gmail.com
```

### Security Files

Add these files to your `.gitignore`:

```gitignore
# OAuth2 credentials and tokens - NEVER commit these!
credentials.json
token.json

# Environment variables
.env

# Dependencies
node_modules/

# Build output
build/
```

## Usage

### Build the Project

```bash
npm run server:build
```

### Start the MCP Server

```bash
npm run calendarmcp:server:dev
```

### Available Tools

#### 1. Get Calendar Events

**Tool**: `getMyCalendarDataByDate`

**Parameters**:

- `date` (string): Date in YYYY-MM-DD format

**Example**:

```json
{
  "date": "2024-09-07"
}
```

**Response**:

```json
{
  "meetings": [
    "Team Meeting at 2024-09-07T10:00:00-04:00 - Weekly sync meeting",
    "Lunch with Client at 2024-09-07T12:00:00-04:00"
  ]
}
```

#### 2. Create Calendar Event

**Tool**: `createCalendarEvent`

**Parameters**:

- `title` (string): Event title
- `startDateTime` (string): Start time in ISO format
- `endDateTime` (string): End time in ISO format
- `description` (string, optional): Event description

**Example**:

```json
{
  "title": "Project Review",
  "startDateTime": "2024-09-08T14:00:00",
  "endDateTime": "2024-09-08T15:30:00",
  "description": "Quarterly project review meeting"
}
```

**Response**:

```json
{
  "success": true,
  "eventId": "abc123def456ghi789"
}
```

### Testing with MCP Inspector

```bash
npm run calendarmcp:server:inspect
```

This opens a web interface where you can test your tools interactively.

## Project Structure

```
mcp-course/
├── src/
│   ├── calendarmcp/
│   │   ├── server.ts          # Main MCP server implementation
│   │   ├── auth-setup.ts      # OAuth2 setup script
│   │   └── README.md          # This documentation
│   └── usermcp/               # Other MCP server example
├── build/                     # Compiled JavaScript output
├── .vscode/
│   └── mcp.json              # VS Code MCP configuration
├── credentials.json          # OAuth2 app credentials (Git ignored)
├── token.json               # User access tokens (Git ignored)
├── .env                     # Environment variables (Git ignored)
├── package.json             # Node.js dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

### Key Files Explained

- **`server.ts`**: Main server implementing MCP protocol and Google Calendar integration
- **`auth-setup.ts`**: One-time authentication setup script
- **`credentials.json`**: OAuth2 application credentials from Google Cloud Console
- **`token.json`**: User's access and refresh tokens (created during auth setup)
- **`mcp.json`**: Configuration for VS Code MCP extension

## Dependencies

### Core Dependencies

```json
{
  "@modelcontextprotocol/sdk": "^1.12.3", // MCP protocol implementation
  "googleapis": "^150.0.1", // Google APIs client library
  "zod": "^3.25.64" // Schema validation
}
```

### Development Dependencies

```json
{
  "typescript": "^5.x", // TypeScript compiler
  "tsx": "^4.x" // TypeScript execution
}
```

## Troubleshooting

### Common Issues

#### 1. "Access blocked" Error

**Problem**: `Error 403: access_denied` when authorizing

**Solution**:

- Ensure your email is added as a test user in Google Cloud Console
- Check OAuth consent screen configuration
- Verify the correct Google account is being used

#### 2. "Cannot find module 'bignumber.js'"

**Problem**: Missing dependency for googleapis

**Solution**:

```bash
RE-INSTALL googleapis package
```

#### 3. "No authentication token found"

**Problem**: `token.json` doesn't exist or is invalid

**Solution**:

```bash
# Remove old token and re-authenticate
rm token.json
npm run calendarmcp:auth:setup
```

#### 4. "Calendar access error"

**Problem**: Invalid calendar ID or permissions

**Solution**:

- Check `CALENDAR_ID` in `.env` matches your Google account
- Verify OAuth2 scope includes calendar access
- Ensure calendar API is enabled in Google Cloud Console

### Debug Steps

1. **Check file existence**:

   ```bash
   ls -la credentials.json token.json
   ```

2. **Verify server logs**:

   ```bash
   npm run calendarmcp:server:dev
   # Check terminal output for errors
   ```

3. **Test authentication**:
   ```bash
   npm run calendarmcp:auth:setup
   # Re-run if needed
   ```

## Security Considerations

### 🔐 OAuth2 Best Practices

1. **Never commit credentials**: `credentials.json` and `token.json` contain sensitive data
2. **Use HTTPS in production**: All OAuth2 flows should use secure connections
3. **Rotate credentials**: If accidentally exposed, regenerate in Google Cloud Console
4. **Limit scopes**: Only request calendar access, no additional permissions
5. **Token security**: Tokens are stored locally and auto-refreshed securely

### 🛡️ Production Deployment

For production environments:

1. **Use environment variables** for all sensitive data
2. **Implement token encryption** at rest
3. **Add rate limiting** to prevent API abuse
4. **Monitor API usage** through Google Cloud Console
5. **Use service accounts** for server-to-server authentication

### 📝 Privacy Notes

- This server only accesses calendars you explicitly authorize
- Tokens are stored locally on your machine
- No data is sent to third parties
- You can revoke access anytime in your Google Account settings

## Contributing

When contributing to this project:

1. Never commit sensitive files (`credentials.json`, `token.json`, `.env`)
2. Follow TypeScript best practices
3. Add proper error handling for new features
4. Update this README for any new functionality
5. Test OAuth2 flows thoroughly

## License

This project is for educational purposes. Please ensure compliance with Google's API Terms of Service when using their Calendar API.

---

**Built using TypeScript, Google Calendar API, and the Model Context Protocol**
