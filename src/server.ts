import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "node:fs/promises";
import path from "node:path";

// Creates an MCP server
const server = new McpServer({
  name: "mcp-tutorial",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
    prompts: {},
  },
});

// Tool config
server.tool(
  "create-user",
  "Create a new user in the database",
  {
    name: z.string(),
    email: z.string(),
    address: z.string(),
    phone: z.string(),
  },
  {
    title: "Create User",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  async (params) => {
    try {
      const id = await createUser(params);
      return {
        content: [
          {
            type: "text",
            text: `User ${id} created successfully`,
          },
        ],
      };
    } catch {
      return {
        content: [
          {
            type: "text",
            text: "Failed to save user",
          },
        ],
      };
    }
  }
);

// Create new user
async function createUser(user: {
  name: string;
  email: string;
  address: string;
  phone: string;
}) {
  try {
    const usersFilePath = path.join(__dirname, "data", "users.json");
    const usersData = await fs.readFile(usersFilePath, "utf-8");
    const users = JSON.parse(usersData);

    const id = users.length + 1;
    users.push({ id, ...user });

    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
    return id;
  } catch (error) {
    console.error("Error in createUser:", error);
    throw error;
  }
}

// Run server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();
