"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
const promises_1 = __importDefault(require("node:fs/promises"));
// Creates an MCP server
const server = new mcp_js_1.McpServer({
    name: "mcp-tutorial",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
        prompts: {},
    },
});
// Tool config
server.tool("create-user", "Create a new user in the database", {
    name: zod_1.z.string(),
    email: zod_1.z.string(),
    address: zod_1.z.string(),
    phone: zod_1.z.string(),
}, {
    title: "Create User",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
}, async (params) => {
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
    }
    catch {
        return {
            content: [
                {
                    type: "text",
                    text: "Failed to save user",
                },
            ],
        };
    }
});
// Create new user
async function createUser(user) {
    const users = await import("./data/users.json", {
        with: { type: "json" },
    }).then((m) => m.default);
    const id = users.length + 1;
    users.push({ id, ...user });
    await promises_1.default.writeFile("./src/data/users.json", JSON.stringify(users, null, 2));
    return id;
}
// Run server
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
}
main();
