import { input, select } from "@inquirer/prompts";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { error } from "node:console";

// Creates an MCP client
const mcp = new Client(
  {
    name: "mcp-client-tutorial",
    version: "1.0.0",
  },
  { capabilities: { sampling: {} } }
);

const transport = new StdioClientTransport({
  command: "node",
  args: ["build/server.js"],
  stderr: "ignore", // blocks server errors from showing in client.
});

async function main() {
  await mcp.connect(transport);
  const [{ tools }, { prompts }, { resources }, { resourceTemplates }] =
    await Promise.all([
      mcp.listTools(),
      mcp.listPrompts(),
      mcp.listResources(),
      mcp.listResourceTemplates(),
    ]);

  // @inquirer/prompts config
  console.log("You are connected!");
  while (true) {
    const option = await select({
      message: "What would you like to do?",
      choices: ["Query", "Tools", "Resources", "Prompts"],
    });

    switch (option) {
      case "Tools":
        const toolName = await select({
          message: "Select a tool",
          choices: tools.map((tool) => ({
            name: tool.annotations?.title || tool.name,
            value: tool.name,
            description: tool.description,
          })),
        });
        const tool = tools.find((t) => t.name === toolName);
        if (tool == null) {
          console.error("Tool not found", error);
        } else {
          await handleTool(tool);
        }
        break;
    }
  }
}

async function handleTool(tool: Tool) {
  // 1- Loops through each param defined in the server:
  const args: Record<string, string> = {};
  for (const [key, value] of Object.entries(
    tool.inputSchema.properties ?? {}
  )) {
    // 2- Asks user for input: key/value:
    args[key] = await input({
      message: `Enter value for ${key} (${(value as { type: string }).type}):`,
    });
  }

  const res = await mcp.callTool({
    name: tool.name,
    arguments: args,
  });
  console.log((res.content as [{ text: string }])[0].text);
}

main();

/*
Notes:
stderr: "ignore" is used because we are using a node.js experimental feature to access users.json in the server.
*/
