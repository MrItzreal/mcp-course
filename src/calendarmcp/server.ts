import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const { google } = require("googleapis");
process.loadEnvFile();

// Creates an MCP server
const server = new McpServer({
  name: "Izzy's Calendar",
  version: "1.0.0",
});

// Tool function to GET calendar events
async function getMyCalendarDataByDate(date: string): Promise<{
  meetings?: string[];
  error?: string;
}> {
  const calendar = google.calendar({
    version: "v3",
    auth: process.env.GOOGLE_PUBLIC_API_KEY,
  });

  // Calculate the start/end of given date (UTC)
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  try {
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

    if (meetings.length > 0) {
      return {
        meetings,
      };
    } else {
      return {
        meetings: [],
      };
    }
  } catch (err: any) {
    return {
      error: err.message,
    };
  }
}

// Tool function to create events
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
  const calendar = google.calendar({
    version: "v3",
    auth: process.env.GOOGLE_PUBLIC_API_KEY,
  });

  try {
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
    return { error: err.message };
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
    description: z.string().optional().describe("Optional event description"),
    title: z.string().describe("Event title/summary"),
    startDateTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message:
        "Invalid start date format. Please provide ISO string (YYYY-MM-DDTHH:mm:ss).",
    }),
    endDateTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message:
        "Invalid end date format. Please provide ISO string (YYYY-MM-DDTHH:mm:ss).",
    }),
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
