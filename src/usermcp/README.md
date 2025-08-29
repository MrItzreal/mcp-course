# UserMCP Project Documentation

## 1. Project Overview

**UserMCP** is a Model Context Protocol (MCP) demonstration project that showcases how to build a modular, AI-friendly system for managing user data. The project is split into two main parts: a server (the MCP server) and a client (the MCP client). Together, they form a system where the client can interact with the server to query, create, and manipulate user data in a structured, discoverable way.

**MCP** stands for **Model Context Protocol**. It is a protocol designed to make data, tools, and prompts easily accessible to AI agents and other clients. MCP servers expose resources (like user lists), tools (like user creation), and prompts (like generating fake users) in a way that is self-describing and easy for both humans and AI to use.

The UserMCP project demonstrates:

- How to define and expose resources (user data)
- How to create tools for modifying data (e.g., creating users)
- How to use prompts for AI-driven data generation
- How to build a client that interacts with these capabilities

## 2. Core Components: Client and Server

### Client

**Role:**

- Acts as the user interface for interacting with the MCP server.
- Handles user input via command-line prompts.
- Presents available tools, resources, and prompts to the user.
- Sends requests to the server and displays responses.

**Responsibilities:**

- Discover available resources, tools, and prompts from the server.
- Allow the user to select and interact with these capabilities.
- Handle the flow of data between the user and the server.

**General Structure:**

- Initializes a connection to the server using a transport layer (stdio).
- Lists available tools, resources, and prompts.
- Provides a menu-driven interface for the user to select actions.
- Handles input collection, request sending, and response display.

### Server

**Role:**

- Acts as the backend, exposing user data and operations via the MCP protocol.
- Provides resources (user lists, user profiles), tools (create user, create random user), and prompts (generate fake user).
- Processes requests from the client and returns structured responses.

**Responsibilities:**

- Serve user data from a JSON file as resources.
- Implement tools for creating and manipulating user data.
- Normalize and validate data to ensure consistency.
- Handle AI-driven data generation via prompts and sampling.

**General Structure:**

- Defines resources and resource templates for user data.
- Implements tools for user creation and random user generation.
- Uses a normalization function to ensure all user data follows a consistent schema.
- Handles file I/O for persistent data storage.

## 3. Key Dependencies

- **@modelcontextprotocol/sdk**: The core SDK for building MCP servers and clients. Provides abstractions for resources, tools, prompts, and transport layers.
- **zod**: A TypeScript-first schema validation library. Used for validating tool input parameters.
- **@ai-sdk/google**: Integrates Google AI models (like Gemini) for text generation and sampling.
- **ai**: Provides utility functions for AI-driven text generation and tool integration.
- **@inquirer/prompts**: Used in the client for interactive command-line prompts.
- **typescript**: Enables type safety and modern JavaScript features.
- **tsx**: Allows running TypeScript files directly without pre-compilation.
- **@modelcontextprotocol/inspector**: (Dev dependency) Provides a web-based inspector for exploring and debugging MCP servers.

## 4. Client-Server Interaction

### Communication Protocol

- The client and server communicate using the **stdio** transport, which allows them to exchange structured messages over standard input/output streams.
- The MCP protocol defines how resources, tools, and prompts are described, discovered, and invoked.

### Data Flow

1. **Initialization**: The client starts and connects to the server using stdio. The server announces its capabilities (resources, tools, prompts).
2. **Discovery**: The client queries the server for available resources, tools, and prompts. This information is presented to the user.
3. **User Action**: The user selects an action (e.g., list users, create user, generate fake user) via the client interface.
4. **Request**: The client sends a structured request to the server (e.g., read a resource, call a tool, invoke a prompt).
5. **Processing**: The server processes the request:
   - For resources: Reads and returns user data from the JSON file.
   - For tools: Validates input, normalizes data, updates the JSON file, and returns a result.
   - For prompts: Uses AI models to generate data or responses.
6. **Response**: The server sends a structured response back to the client.
7. **Display**: The client displays the result to the user.

### Example Interactions

- **Listing all users**: The client requests the `users://all` resource; the server returns the full user list.
- **Getting a user profile**: The client requests a specific user profile resource (e.g., `users://3/profile`); the server returns that user's data.
- **Creating a user**: The client calls the `create-user` tool with user details; the server normalizes and saves the new user.
- **Generating a random user**: The client calls the `create-random-user` tool; the server uses AI to generate and save a new user.

---

This documentation should provide a clear, offline-friendly reference for understanding and working with the UserMCP project. For further details, refer to the code or experiment with the client and server directly!
