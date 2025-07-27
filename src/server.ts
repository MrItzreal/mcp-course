import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

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

// Run server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();
