# bruvtools MCP Server for Cursor

Deploy applications directly from Cursor using natural language commands! This Model Context Protocol (MCP) server integrates bruvtools with Cursor, allowing you to deploy to CapRover, AWS, GCP, and Kubernetes without leaving your editor.

## 🚀 What This Enables

Instead of switching to terminal, you can now:

- **"Initialize bruvtools for this Node.js project"** → Automatically creates `bruvtools.yml` and `.env`
- **"Deploy my app called 'my-api' to CapRover"** → Runs complete deployment pipeline
- **"Show me all my deployed services"** → Lists all running applications with URLs
- **"Scale my app to 3 replicas"** → Adjusts application scaling
- **"Check the logs for my-api"** → Displays real-time application logs

## 📦 Installation

### Quick Setup

```bash
# 1. Clone or download the MCP server files
curl -O https://raw.githubusercontent.com/fcavalcantirj/bruvtools/main/mcp-server.js
curl -O https://raw.githubusercontent.com/fcavalcantirj/bruvtools/main/setup-mcp.sh

# 2. Run the setup script
chmod +x setup-mcp.sh
./setup-mcp.sh

# 3. Set your environment variables
export CAPROVER_PASSWORD="your-caprover-password"
export CAPROVER_DOMAIN="your-domain.com"
export CAPROVER_MACHINE="your-machine-name"

# 4. Restart Cursor
```

### Manual Setup

1. **Install Dependencies**
   ```bash
   npm install -g bruvtools
   npm install @modelcontextprotocol/sdk yaml
   ```

2. **Configure Cursor MCP**
   
   **For all projects (Global):**
   ```bash
   mkdir -p ~/.cursor
   cat > ~/.cursor/mcp.json << 'EOF'
   {
     "mcpServers": {
       "bruvtools": {
         "command": "node",
         "args": ["path/to/mcp-server.js"],
         "env": {
           "CAPROVER_PASSWORD": "${CAPROVER_PASSWORD}",
           "CAPROVER_DOMAIN": "${CAPROVER_DOMAIN}",
           "CAPROVER_MACHINE": "${CAPROVER_MACHINE}"
         }
       }
     }
   }
   EOF
   ```

   **For specific project only:**
   ```bash
   mkdir -p .cursor
   cat > .cursor/mcp.json << 'EOF'
   {
     "mcpServers": {
       "bruvtools": {
         "command": "node",
         "args": ["mcp-server.js"],
         "env": {
           "CAPROVER_PASSWORD": "${CAPROVER_PASSWORD}",
           "CAPROVER_DOMAIN": "${CAPROVER_DOMAIN}",
           "CAPROVER_MACHINE": "${CAPROVER_MACHINE}"
         }
       }
     }
   }
   EOF
   ```

3. **Set Environment Variables**
   ```bash
   export CAPROVER_PASSWORD="your-caprover-password"
   export CAPROVER_DOMAIN="your-domain.com"
   export CAPROVER_MACHINE="your-machine-name"
   ```

4. **Restart Cursor** to load the MCP server

## 🎯 Usage Examples

### Initialize a New Project

**You say:** *"Set up bruvtools for this project with CapRover"*

**Cursor will:** Use `bruvtools_init` tool to create configuration files using your environment variables

### Deploy an Application

**You say:** *"Deploy this Node.js app as 'my-api' to CapRover"*

**Cursor will:** 
1. Use `bruvtools_create` to create the app
2. Use `bruvtools_deploy` to deploy the code
3. Show you the live URL

### Monitor and Scale

**You say:** *"Show me all my deployed services and scale my-api to 2 replicas"*

**Cursor will:**
1. Use `bruvtools_services` to list all apps
2. Use `bruvtools_scale` to adjust replicas

### Debug Issues

**You say:** *"Check the status and logs of my-api, it's not responding"*

**Cursor will:**
1. Use `bruvtools_status` to check app health
2. Use `bruvtools_logs` to show recent logs
3. Use `bruvtools_test` to verify the endpoint

## 🛠️ Available Tools

| Tool | Description | Example Usage |
|------|-------------|---------------|
| `bruvtools_init` | Initialize project configuration | "Set up bruvtools with my CapRover settings" |
| `bruvtools_create` | Create new application | "Create a new app called 'my-api'" |
| `bruvtools_deploy` | Deploy application | "Deploy this directory as 'my-api'" |
| `bruvtools_status` | Check application status | "What's the status of my-api?" |
| `bruvtools_logs` | View application logs | "Show me the logs for my-api" |
| `bruvtools_services` | List all deployed services | "Show me all my deployed apps" |
| `bruvtools_scale` | Scale application replicas | "Scale my-api to 3 replicas" |
| `bruvtools_test` | Test application endpoint | "Test if my-api is responding" |

## 🔧 Configuration

### Environment Variables

The MCP server uses these environment variables:

- `CAPROVER_PASSWORD`: Your CapRover admin password
- `CAPROVER_DOMAIN`: Your CapRover domain (without https://)
- `CAPROVER_MACHINE`: Your CapRover machine name

### Tool Parameters

Each tool accepts specific parameters:

#### bruvtools_init
```json
{
  "provider": "caprover",
  "machine": "captain-01",
  "domain": "myapp.com",
  "projectName": "my-project",
  "port": 80
}
```

**Note:** If `machine` and `domain` are not provided, the MCP server will use the `CAPROVER_MACHINE` and `CAPROVER_DOMAIN` environment variables.

#### bruvtools_deploy
```json
{
  "appName": "my-api",
  "directory": ".",
  "port": 3000,
  "scale": 1
}
```

#### bruvtools_scale
```json
{
  "appName": "my-api",
  "replicas": 3
}
```

## 🎨 Natural Language Examples

The beauty of MCP is that you don't need to remember exact tool names or parameters. Just describe what you want:

### Project Setup
- *"Initialize bruvtools for this React app"*
- *"Set up deployment to my CapRover server"*

### Viewing Deployed Apps/Services
- *"Show me my deployed apps"* → Uses `bruvtools_services`
- *"What services are running?"* → Uses `bruvtools_services`
- *"List all my deployed applications"* → Uses `bruvtools_services`
- *"Show me the dashboard"* → Uses `bruvtools_services`
- *"What apps do I have deployed?"* → Uses `bruvtools_services`

### Deployment
- *"Deploy this Node.js app as 'my-api'"* → Uses `bruvtools_deploy`
- *"Create a new app called 'user-service'"* → Uses `bruvtools_create`
- *"Deploy the current directory as 'frontend'"* → Uses `bruvtools_deploy`

### Monitoring & Management
- *"Check the status of my-api"* → Uses `bruvtools_status`
- *"Show me the logs for user-service"* → Uses `bruvtools_logs`
- *"Scale my-api to 3 replicas"* → Uses `bruvtools_scale`
- *"Test if my-api is working"* → Uses `bruvtools_test`

**💡 LLM-Friendly Design**: The `bruvtools_services` tool is specifically designed to handle various ways of asking about deployed apps, services, or dashboard information.

## 🔍 Troubleshooting

### MCP Server Not Found
```bash
# Check if MCP server is configured
cat ~/.cursor/mcp.json  # or .cursor/mcp.json

# Verify bruvtools is installed
bruvtools --version

# Check Node.js version
node --version  # Should be 16+
```

### Environment Variables Not Set
```bash
# Check current environment
echo $CAPROVER_PASSWORD
echo $CAPROVER_DOMAIN
echo $CAPROVER_MACHINE

# Set them if missing
export CAPROVER_PASSWORD="your-password"
export CAPROVER_DOMAIN="your-domain.com"
export CAPROVER_MACHINE="your-machine-name"
```

### Tool Execution Errors
- Ensure bruvtools is properly configured (`bruvtools.yml` exists)
- Check that CapRover CLI is installed: `npm install -g caprover`
- Verify network connectivity to your CapRover server
- Ensure all three environment variables are set correctly

### Cursor Not Recognizing Tools
1. Restart Cursor completely
2. Check MCP configuration in Cursor settings
3. Verify the MCP server process is running

## 🚀 Advanced Usage

### Custom Deployment Workflows

You can combine multiple tools in natural language:

*"Create a new app called 'api-v2', deploy the current directory to it, then scale it to 2 replicas and test the endpoint"*

Cursor will execute:
1. `bruvtools_create` with appName: "api-v2"
2. `bruvtools_deploy` with appName: "api-v2"
3. `bruvtools_scale` with appName: "api-v2", replicas: 2
4. `bruvtools_test` with appName: "api-v2"

### Multi-Environment Deployments

*"Deploy this to staging first, then if tests pass, deploy to production"*

### Automated Monitoring

*"Check the status of all my apps and show me logs for any that are failing"*

## 🌟 Benefits

1. **No Context Switching**: Deploy without leaving Cursor
2. **Natural Language**: No need to remember exact commands
3. **Integrated Workflow**: Deployment becomes part of your coding flow
4. **Error Handling**: Cursor can interpret errors and suggest fixes
5. **Multi-Step Operations**: Complex deployments in single requests

## 📚 Learn More

- [Model Context Protocol Documentation](https://docs.cursor.com/context/model-context-protocol)
- [bruvtools Documentation](https://github.com/fcavalcantirj/bruvtools)
- [CapRover Documentation](https://caprover.com/docs/)

## 🤝 Contributing

Found a bug or want to add features? 

1. Fork the repository
2. Create your feature branch
3. Add new tools to the MCP server
4. Submit a pull request

## 📄 License

MIT License - see the main bruvtools repository for details. 