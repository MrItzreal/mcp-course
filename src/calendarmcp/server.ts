import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Creates an MCP server
const server = new McpServer({
  name: "Izzy's Calendar",
  version: "1.0.0",
  capabilities: {},
});
