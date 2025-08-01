"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prompts_1 = require("@inquirer/prompts");
const index_js_1 = require("@modelcontextprotocol/sdk/client/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/client/stdio.js");
const node_console_1 = require("node:console");
// Creates an MCP client
const mcp = new index_js_1.Client({
    name: "mcp-client-tutorial",
    version: "1.0.0",
}, { capabilities: { sampling: {} } });
const transport = new stdio_js_1.StdioClientTransport({
    command: "node",
    args: ["build/server.js"],
    stderr: "ignore", // blocks server errors from showing in client.
});
async function main() {
    await mcp.connect(transport);
    const [{ tools }, { prompts }, { resources }, { resourceTemplates }] = await Promise.all([
        mcp.listTools(),
        mcp.listPrompts(),
        mcp.listResources(),
        mcp.listResourceTemplates(),
    ]);
    // @inquirer/prompts config
    console.log("You are connected!");
    while (true) {
        const option = await (0, prompts_1.select)({
            message: "What would you like to do?",
            choices: ["Query", "Tools", "Resources", "Prompts"],
        });
        switch (option) {
            case "Tools":
                const toolName = await (0, prompts_1.select)({
                    message: "Select a tool",
                    choices: tools.map((tool) => ({
                        name: tool.annotations?.title || tool.name,
                        value: tool.name,
                        description: tool.description,
                    })),
                });
                const tool = tools.find((t) => t.name === toolName);
                if (tool == null) {
                    console.error("Tool not found", node_console_1.error);
                }
                else {
                    await handleTool(tool);
                }
                break;
        }
    }
}
async function handleTool(tool) {
    // 1- Loops through each param defined in the server:
    const args = {};
    for (const [key, value] of Object.entries(tool.inputSchema.properties ?? {})) {
        // 2- Asks user for input: key/value:
        args[key] = await (0, prompts_1.input)({
            message: `Enter value for ${key} (${value.type}):`,
        });
    }
    const res = await mcp.callTool({
        name: tool.name,
        arguments: args,
    });
    console.log(res.content[0].text);
}
main();
/*
Notes:
stderr: "ignore" is used because we are using a node.js experimental feature to access users.json in the server.
*/
