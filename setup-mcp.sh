#!/bin/bash

echo "🚀 Setting up bruvtools MCP Server for Cursor"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if bruvtools is installed
if ! command -v bruvtools &> /dev/null; then
    echo "❌ bruvtools is not installed. Installing..."
    npm install -g bruvtools
fi

echo "✅ bruvtools found: $(bruvtools --version)"

# Check if we're in the bruvtools directory (mcp-server.js should exist)
if [ ! -f "mcp-server.js" ]; then
    echo "❌ mcp-server.js not found in current directory."
    echo "💡 Please run this script from the bruvtools repository directory:"
    echo "   git clone https://github.com/fcavalcantirj/bruvtools.git"
    echo "   cd bruvtools"
    echo "   ./setup-mcp.sh"
    exit 1
fi

echo "✅ MCP server found: mcp-server.js"

# Create .cursor directory if it doesn't exist
mkdir -p .cursor

# Copy MCP configuration
echo "📝 Setting up Cursor MCP configuration..."

# Check if global or project configuration
read -p "Install globally for all projects? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Global installation
    CURSOR_CONFIG_DIR="$HOME/.cursor"
    mkdir -p "$CURSOR_CONFIG_DIR"
    
    # Create global MCP config
    cat > "$CURSOR_CONFIG_DIR/mcp.json" << EOF
{
  "mcpServers": {
    "bruvtools": {
      "command": "node",
      "args": ["$(pwd)/mcp-server.js"],
      "env": {
        "CAPROVER_PASSWORD": "\${CAPROVER_PASSWORD}",
        "CAPROVER_DOMAIN": "\${CAPROVER_DOMAIN}",
        "CAPROVER_MACHINE": "\${CAPROVER_MACHINE}"
      }
    }
  }
}
EOF
    
    echo "✅ Global MCP configuration created at: $CURSOR_CONFIG_DIR/mcp.json"
    
else
    # Project-specific installation
    cat > ".cursor/mcp.json" << EOF
{
  "mcpServers": {
    "bruvtools": {
      "command": "node",
      "args": ["\${workspaceFolder}/mcp-server.js"],
      "env": {
        "CAPROVER_PASSWORD": "\${CAPROVER_PASSWORD}",
        "CAPROVER_DOMAIN": "\${CAPROVER_DOMAIN}",
        "CAPROVER_MACHINE": "\${CAPROVER_MACHINE}"
      }
    }
  }
}
EOF
    echo "✅ Project MCP configuration created at: .cursor/mcp.json"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set environment variables:"
echo "   export CAPROVER_PASSWORD='your-caprover-password'"
echo "   export CAPROVER_DOMAIN='your-domain.com'"
echo "   export CAPROVER_MACHINE='your-machine-name'"
echo ""
echo "2. Restart Cursor to load the MCP server"
echo ""
echo "3. In Cursor chat, you can now use commands like:"
echo "   - 'Initialize bruvtools for this project'"
echo "   - 'Deploy my app to CapRover'"
echo "   - 'Show me the status of my deployed services'"
echo "   - 'Scale my app to 3 replicas'"
echo ""
echo "🔧 Available MCP tools:"
echo "   - bruvtools_init: Initialize project configuration"
echo "   - bruvtools_create: Create new application"
echo "   - bruvtools_deploy: Deploy application"
echo "   - bruvtools_status: Check application status"
echo "   - bruvtools_logs: View application logs"
echo "   - bruvtools_services: List all services"
echo "   - bruvtools_scale: Scale application"
echo "   - bruvtools_test: Test application" 