import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "fs";
import path from "path";

const { google } = require("googleapis");
process.loadEnvFile();

// OAuth2 config
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const SCOPES = ["https://www.googleapis.com/auth/calendar"];

// Creates an MCP server
const server = new McpServer({
  name: "Izzy's Calendar",
  version: "1.0.0",
});

// Get authenticated OAuth2 client
async function getAuthenticatedClient() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
  const { client_id, client_secret, redirect_uris } = credentials.installed;

  // Init a client w/ the credentials
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Load existing token
  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
    oAuth2Client.setCredentials(token);

    // Refresh tokens when expire
    oAuth2Client.on("tokens", (tokens: any) => {
      if (tokens.refresh_token) {
        // Store new fresh token
        const existingTokens = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
        const updatedTokens = { ...existingTokens, ...tokens };
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(updatedTokens));
      }
    });
    return oAuth2Client;
  }
  throw new Error(
    "No authentication token found. Please run the authorization flow first."
  );
}

// Function to GET calendar events
async function getMyCalendarDataByDate(date: string): Promise<{
  meetings?: string[];
  error?: string;
}> {
  try {
    const auth = await getAuthenticatedClient();
    const calendar = google.calendar({ version: "v3", auth });

    // Calculate the start/end of given date (UTC)
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);

    const res = await calendar.events.list({
      calendarId: process.env.CALENDAR_ID,
      timeMin: start.toISOString(),
      timeMax: end.toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = res.data.items || [];
    const meetings = events.map((event: any) => {
      const startTime = event.start?.dateTime || event.start?.date;
      const description = event.description ? `- ${event.description}` : "";
      return `${event.summary} at ${startTime}${description}`;
    });

    return {
      meetings: meetings.length > 0 ? meetings : [],
    };
  } catch (err: any) {
    return {
      error: `Calendar access error: ${err.message}`,
    };
  }
}

// Function to create events
async function createCalendarEvent(
  title: string,
  startDateTime: string,
  endDateTime: string,
  description?: string
): Promise<{
  success?: boolean;
  eventId?: string;
  error?: string;
}> {
  try {
    const auth = await getAuthenticatedClient();
    const calendar = google.calendar({ version: "v3", auth });

    const event = {
      summary: title,
      description: description || "",
      start: {
        dateTime: startDateTime,
        timeZone: "America/New_York",
      },
      end: {
        dateTime: endDateTime,
        timeZone: "America/New_York",
      },
    };

    const res = await calendar.events.insert({
      calendarId: process.env.CALENDAR_ID,
      requestBody: event,
    });

    return { success: true, eventId: res.data.id || undefined };
  } catch (err: any) {
    return { error: `Unable to create event: ${err.message}` };
  }
}

// Tool config
server.tool(
  "getMyCalendarDataByDate",
  "Get calendar events for a specific date",
  {
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format. Please provide a valid date string.",
    }),
  },
  async ({ date }: { date: string }) => {
    const result = await getMyCalendarDataByDate(date);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }
);

// Tool config
server.tool(
  "createCalendarEvent",
  "Create a new calendar event",
  {
    title: z.string().describe("Event title/summary"),
    startDateTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message:
        "Invalid start date format. Please provide ISO string (YYYY-MM-DDTHH:mm:ss).",
    }),
    endDateTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message:
        "Invalid end date format. Please provide ISO string (YYYY-MM-DDTHH:mm:ss).",
    }),
    description: z.string().optional().describe("Optional event description"),
  },
  async ({
    title,
    startDateTime,
    endDateTime,
    description,
  }: {
    title: string;
    startDateTime: string;
    endDateTime: string;
    description?: string;
  }) => {
    const result = await createCalendarEvent(
      title,
      startDateTime,
      endDateTime,
      description
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }
);

// Run server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();

/*
MCP server tool definition pattern:
server.tool(name, description, Zod schema, handler function)

Long example:
title: "Going for dinner w/ wife",
startDateTime: "2025-09-23T18:00:00",
endDateTime: "2025-09-23T20:00:00",
description: "Have dinner at fav restaurant."

Natural language:
#createCalendarEvent 
Going for dinner with my wife on September 23 from 6pm to 8pm
*/
