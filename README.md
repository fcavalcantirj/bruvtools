# bruvtools 🚀

[![npm version](https://badge.fury.io/js/bruvtools.svg)](https://www.npmjs.com/package/bruvtools)
[![npm downloads](https://img.shields.io/npm/dm/bruvtools.svg)](https://www.npmjs.com/package/bruvtools)
[![npm bundle size](https://img.shields.io/bundlephobia/min/bruvtools)](https://www.npmjs.com/package/bruvtools)
[![Node.js version](https://img.shields.io/node/v/bruvtools)](https://www.npmjs.com/package/bruvtools)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Your Private App Platform - Deploy microservices anywhere, any language, one CLI**

Deploy Node.js, Go, Python, Java, PHP, Ruby, or any containerizable application to CapRover, AWS, GCP, or Kubernetes with the same simple commands. Zero vendor lock-in.

## 🎯 What is bruvtools?

**bruvtools** transforms any cloud server into your **private app platform** - like having your own Heroku, Vercel, or Railway. Combined with [CapRover](https://caprover.com), you get:

✅ **Push to deploy** - `bruvtools deploy my-app` and you're live  
✅ **Auto SSL certificates** - HTTPS enabled automatically  
✅ **Any language** - Node.js, Python, Go, Java, PHP, Ruby, Docker  
✅ **Zero downtime deployments** - Rolling updates built-in  
✅ **Auto scaling** - Scale apps up/down as needed  
✅ **Private & secure** - Your own server, your own rules  
✅ **Cost effective** - $5/month vs $25+ on other platforms  

### 🔌 MCP Integration (Cursor.com) - 🤯 MIND-BLOWING EXPERIENCE

With Model Context Protocol (MCP) support, you get a **revolutionary development experience** - deploy directly from Cursor.com without ever leaving your editor:

- 📋 **List all apps** - See your entire infrastructure from within your IDE
- 📊 **Pull logs in real-time** - Debug without switching windows  
- 🚀 **Deploy with AI assistance** - Just ask Claude: "Deploy this to production"
- 📈 **Monitor status live** - App health, metrics, and scaling from your editor
- 🔄 **Rollback instantly** - "Rollback to previous version" - done!
- 🎯 **Smart suggestions** - AI recommends optimizations based on your code

**🤯 The Experience:**
```
You: "Deploy this Node.js app to my-api-v2"
Claude: ✅ Deploying to CapRover...
        ✅ App created with collision detection  
        ✅ Building Docker image...
        ✅ Live at https://my-api-v2.yourdomain.com
        ✅ SSL certificate auto-configured
        
You: "Show me the logs"
Claude: [Real-time logs streaming in your editor]

You: "Scale this to 3 replicas"  
Claude: ✅ Scaled to 3 replicas, load balanced automatically
```

**This is the future of development** - your AI pair programmer that can actually deploy and manage your infrastructure. No context switching, no separate terminals, no deployment dashboards. Just code, ask, and it's live.

*The combination of bruvtools + CapRover + MCP + Cursor.com creates the most seamless development-to-production experience ever built.*

## 🔌 MCP Setup for Cursor.com (5 minutes)

**Transform your Cursor.com editor into a deployment powerhouse!**

### Step 1: Install bruvtools MCP Server

```bash
# Install bruvtools globally (if not already installed)
npm install -g bruvtools

# Verify MCP server is available
bruvtools --version  # Should show: 0.2.15
```

### Step 2: Configure Cursor.com MCP Settings

1. **Open Cursor.com Settings**:
   - Press `Cmd/Ctrl + ,` to open settings
   - Search for "MCP" or go to Extensions → Model Context Protocol

2. **Add bruvtools MCP Server**:
   ```json
   {
     "mcpServers": {
       "bruvtools": {
         "command": "bruvtools",
         "args": ["mcp"],
         "env": {
           "CAPROVER_PASSWORD": "your-caprover-password",
           "CAPROVER_DOMAIN": "your-domain.com"
         }
       }
     }
   }
   ```

3. **Alternative: Use Local Configuration**:
   If you have `bruvtools.yml` and `.env` files in your project:
   ```json
   {
     "mcpServers": {
       "bruvtools": {
         "command": "bruvtools",
         "args": ["mcp"],
         "cwd": "${workspaceFolder}"
       }
     }
   }
   ```

### Step 3: Restart Cursor.com

- Close and reopen Cursor.com
- The bruvtools MCP server will automatically connect
- You'll see "bruvtools" in the MCP servers list

### Step 4: Test the Integration

Open any project in Cursor.com and try these commands with Claude:

```
You: "List all my deployed apps"
Claude: [Shows your CapRover apps with URLs and status]

You: "Deploy this project as my-new-app"
Claude: [Deploys your current project to CapRover]

You: "Show me the logs for my-app"
Claude: [Streams real-time logs from your app]

You: "Scale my-app to 3 replicas"
Claude: [Scales your app and confirms the change]
```

### 🎯 **What You Get**

- **🚀 Deploy from chat**: Just ask Claude to deploy your code
- **📊 Real-time monitoring**: App status, logs, and metrics in your editor
- **🔧 Infrastructure management**: Scale, restart, configure apps via chat
- **🧠 AI-powered insights**: Claude analyzes your code and suggests optimizations
- **⚡ Zero context switching**: Everything happens in your editor

### 🔧 **Troubleshooting MCP Setup**

**❌ "bruvtools MCP server not found"**
```bash
# Make sure bruvtools is globally installed
npm list -g bruvtools
# If not found, reinstall:
npm install -g bruvtools@latest
```

**❌ "Authentication failed"**
```bash
# Check your environment variables
echo $CAPROVER_PASSWORD
echo $CAPROVER_DOMAIN
# Or verify your .env file exists in the project
```

**❌ "MCP server disconnected"**
- Restart Cursor.com
- Check that your CapRover server is accessible
- Verify your `bruvtools.yml` configuration

### 🎉 **Ready to Deploy!**

Once MCP is set up, you have the most powerful development experience ever created. Just code, ask Claude, and watch your apps go live instantly!

## 🚀 Quick Start: Your Private Platform in 5 Minutes

**🔌 Want the ultimate experience?** Set up [MCP Integration](#-mcp-setup-for-cursorcom-5-minutes) first to deploy directly from Cursor.com!

### Step 1: Create Your CapRover Server (2 minutes)

The **easiest way** to get started is with DigitalOcean's one-click CapRover deployment:

[![Deploy to DigitalOcean](https://www.deploytodo.com/do-btn-blue.svg)](https://marketplace.digitalocean.com/apps/caprover?action=deploy)

**What this gives you:**
- ✅ **$5/month server** with CapRover pre-installed
- ✅ **$100 free credit** for new DigitalOcean users (2 months free!)
- ✅ **Docker & firewall** configured automatically
- ✅ **Ready to deploy** in minutes

**Alternative setup:** Follow the [CapRover Getting Started Guide](https://caprover.com/docs/get-started.html) for manual installation on any cloud provider.

### Step 2: Install bruvtools (30 seconds)

```bash
npm install -g bruvtools
bruvtools --version  # Should show: 0.2.15
```

### Step 3: Configure & Deploy (2 minutes)

```bash
# Clone and test the working example
git clone https://github.com/fcavalcantirj/bruvtools.git
cd bruvtools/examples/hello-world

# Setup bruvtools (one time)
bruvtools init
# This creates:
# - bruvtools.yml (configuration: machine names, domains, projects)
# - .env (secrets: passwords, API keys)
# ⚠️  IMPORTANT: Never commit bruvtools.yml or .env to version control!

# Deploy with smart auto-creation and collision detection
bruvtools deploy my-app
# ✅ Checks if app exists
# ✅ Auto-creates app if needed  
# ✅ Handles name collisions (my-app-1, my-app-2, etc.)
# ✅ Deploys with clear step-by-step progress
# ✅ Your app is live with HTTPS!
```

**🎯 That's it!** Your private app platform is ready. Your app is now live at `https://my-app.yourdomain.com` with automatic SSL.

## 🎯 Enhanced Developer Experience (v0.2.15)

**🚀 Smart Deployment with Auto-Healing & Environment Variable Intelligence**

bruvtools now includes intelligent deployment verification, auto-fixing, and advanced environment variable handling:

### ✅ **Post-Deployment Health Verification**
```bash
bruvtools deploy my-app
# ✅ Step 1: Creating app...
# ✅ Step 2: Packaging...  
# ✅ Step 3: Deploying...
# ✅ Step 4: Enabling SSL...
# 🔍 Step 5: Verifying deployment health...
#    ✅ Instance count: 1
#    ✅ App is responding correctly!
# 🎉 Deployment completed successfully!
```

### 🔧 **Auto-Fixing Common Issues**
- **Instance Count = 0**: Automatically scales to 1 instance
- **Port Mismatches**: Detects server.js vs Dockerfile port conflicts
- **SSL Issues**: Provides clear guidance for certificate problems
- **Container Crashes**: Shows debugging steps and common solutions

### 🔐 **Intelligent Environment Variable Handling**

**🚨 Large Environment Variable Detection & Auto-Splitting** ⚠️ **EXPERIMENTAL**

bruvtools can detect when environment variables exceed platform limits and offers smart solutions (currently experimental):

```bash
bruvtools init
# 🔍 Analyzing environment variables...
# ⚠️  Large environment variable detected: JWT_TOKEN (1083 characters)
# 💡 CapRover has ~1000 character limits on environment variables
# 
# ⚠️  EXPERIMENTAL: Auto-splitting feature is in development
# 💡 For now, manually split large variables or embed in code
```

**🔄 Manual Token Reconstruction** ✅ **WORKING**

You can manually implement split environment variables using this pattern:

```javascript
// Universal function (manually add to your project)
function getEnvVar(varName) {
  // First try to get the variable directly
  if (process.env[varName]) {
    return process.env[varName];
  }
  
  // If not found, try to reconstruct from split parts
  let reconstructed = '';
  let partIndex = 1;
  
  while (true) {
    const partName = `${varName}_${partIndex}`;
    const part = process.env[partName];
    
    if (part) {
      reconstructed += part;
      partIndex++;
    } else {
      break;
    }
  }
  
  return reconstructed || undefined;
}

// Use in your app
const JWT_TOKEN = getEnvVar('JWT_TOKEN'); // Works with both single and split tokens!
```

### 🛡️ **Enhanced Security Checks**

bruvtools analyzes your code for potential deployment issues:

```bash
bruvtools deploy my-app
# 🔍 Security Analysis:
#    ✅ No hardcoded secrets detected
#    ⚠️  Large environment variable detected (JWT_TOKEN: 1083 chars)
#    💡 Recommendation: Manually split tokens or embed in code (auto-split experimental)
#    ✅ Environment variable reconstruction pattern found
#    ✅ Security headers implemented
```

### 🚨 **Enhanced Error Messages**
When deployments fail, you get actionable guidance:
```bash
❌ Deployment failed: Container not responding

🔍 Debugging tips:
   1. Check app logs: bruvtools logs my-app
   2. Check app status: bruvtools status my-app  
   3. View all services: bruvtools services
   4. Common issues:
      • Port mismatch (server.js vs Dockerfile EXPOSE)
      • Instance count = 0 (check services output)
      • Missing dependencies in package.json
      • App crashes on startup (check logs)
      • Environment variables too large (>1000 chars)
```

### 📊 **Improved Services Dashboard**
```bash
bruvtools services
# 📦 my-app
#    URL: https://my-app.yourdomain.com
#    Status: ✅ Healthy (200)
#    Instances: 0 ⚠️  CRITICAL - No instances running!
#    💡 Fix with: bruvtools scale my-app 1
#    🔑 Environment: 5 variables, 1 reconstructed from parts
```

**🎯 Result**: From "deploy and pray" to "deploy with confidence"!

## 🔧 Configuration Files

bruvtools uses a clean separation between configuration and secrets:

### 📄 **bruvtools.yml** - Configuration (Non-Secrets)
```yaml
default_provider: caprover
providers:
  caprover: 
    machine: your-caprover-machine-name
    domain: your-domain.com
projects:
  my-app:
    provider: caprover
    port: 80
```

### 🔐 **.env** - Secrets Only
```bash
# CapRover Authentication
CAPROVER_PASSWORD=your-caprover-password

# Optional: App secrets
DATABASE_URL=postgresql://user:pass@host:port/db
API_KEY=your-api-key
```

**⚠️ Security**: Both files are automatically added to `.gitignore` and should NEVER be committed to version control.

## 🏗️ CapRover Setup Details

CapRover is the recommended platform for bruvtools. Here's what you need:

### Prerequisites
- **Domain name** ($2/year) - for wildcard DNS (`*.yourdomain.com`)
- **Server with public IP** ($5/month) - DigitalOcean, Vultr, Linode, etc.
- **Docker installed** - included in one-click deployment

### DNS Configuration
Set up a wildcard A record in your DNS:
- **Type**: A record
- **Host**: `*.captain` (or `*.apps`, `*.dev`, etc.)
- **Points to**: Your server's IP address
- **TTL**: 300 (or default)

This allows unlimited subdomains: `my-app.captain.yourdomain.com`, `api.captain.yourdomain.com`, etc.

### Server Requirements
- **Minimum**: 1GB RAM, 1 CPU core
- **Recommended**: 2GB RAM for building larger apps
- **OS**: Ubuntu 22.04+ (tested and recommended)
- **Docker**: Version 25.x+ (auto-installed with one-click)

For detailed setup instructions, see the [CapRover Getting Started Guide](https://caprover.com/docs/get-started.html).

## 🚀 What Just Happened

1. ✅ **Smart App Check**: Verified app availability on CapRover
2. ✅ **Auto-Creation**: Created app automatically if needed
3. ✅ **Collision Detection**: Used `-1` suffix if name was taken
4. ✅ **Packaging**: Created optimized deployment package
5. ✅ **Deployment**: Deployed with Docker build process
6. ✅ **SSL Setup**: Automatic HTTPS certificate via Let's Encrypt
7. ✅ **Live App**: Your app is now accessible worldwide

**✅ Live Examples**: 
- [hello-world-fixed.bruvbot.com.br](http://hello-world-fixed.bruvbot.com.br)
- [hello-world-fixed-1.bruvbot.com.br](http://hello-world-fixed-1.bruvbot.com.br)

### 🔧 Deploy Your Own App

Copy the working example structure:
```bash
# Copy proven working files to your project
cp examples/hello-world/package.json your-project/
cp examples/hello-world/captain-definition your-project/
cp examples/hello-world/Dockerfile your-project/

# Modify server.js for your needs (keep PORT environment variable handling!)
# Then deploy:
bruvtools deploy your-app-name
```

## 🪟 Windows PowerShell Support

✅ **Fully Supported!** bruvtools works seamlessly on Windows PowerShell.

**✅ What Works Out of the Box:**
- ✅ All `bruvtools` commands (`init`, `create`, `deploy`, `status`, `services`)
- ✅ CapRover integration (after installing CapRover CLI)
- ✅ Full deployment workflow (identical to Mac/Linux)
- ✅ Smart auto-creation and collision detection

**📦 Quick Windows Setup:**
```powershell
# 1. Install both tools
npm install -g bruvtools caprover

# 2. Verify installation
bruvtools --version  # Should show: 0.2.15
caprover --version   # Should show: 2.x.x

# 3. Deploy normally (same as Mac/Linux)
bruvtools init
bruvtools deploy my-app
```

## 🔧 Supported Languages

| Language | Auto-Detection | Status |
|----------|----------------|--------|
| **Node.js** | package.json | ✅ Fully Tested |
| **Go** | go.mod | ✅ Ready |
| **Python** | requirements.txt | ✅ Ready |
| **Java** | pom.xml, build.gradle | ✅ Ready |
| **PHP** | composer.json | ✅ Ready |
| **Ruby** | Gemfile | ✅ Ready |
| **Any** | Dockerfile | ✅ Ready |

## 🌐 Live Examples

🔍 **Production APIs deployed with bruvtools:**
- **Hello World**: [hello-world-fixed.bruvbot.com.br](http://hello-world-fixed.bruvbot.com.br)
- **CNPJ Enricher**: [cnpj-enricher.bruvbot.com.br](http://cnpj-enricher.bruvbot.com.br)
- **Kommo Integration**: [kommo-final.bruvbot.com.br](http://kommo-final.bruvbot.com.br)

**Try the CNPJ API live:**
```bash
# Get Brazilian company information by CNPJ (tax ID)
curl "http://cnpj-enricher.bruvbot.com.br/ficha?cnpj=11222333000181"
# Returns: JSON with company details, revenue, address, partners, etc.
```

## 📋 Common Commands

**🔌 With MCP Integration**: Just ask Claude in Cursor.com: "Deploy this project" or "Show me my apps"

```bash
# Interactive setup (one time)
bruvtools init

# View all deployed apps/services
bruvtools services     # Show all deployed apps with URLs
bruvtools apps         # Same as services (alias)
bruvtools deployed     # Same as services (alias)  
bruvtools dashboard    # Same as services (alias)

# Deploy and manage apps
bruvtools deploy <app-name>    # Deploy with smart auto-creation
bruvtools create <app-name>    # Create app manually (optional)
bruvtools status <app-name>    # Check app status
bruvtools logs <app-name>      # View app logs
bruvtools scale <app> <count>  # Scale app replicas
bruvtools test <app-name>      # Test app connectivity
```

## 🚀 Advanced Features

### Smart Collision Detection
```bash
bruvtools deploy my-app
# ✅ App "my-app" created and deployed

bruvtools deploy my-app  
# ⚠️  App "my-app" already exists, using "my-app-1" instead
# ✅ App "my-app-1" created and deployed

bruvtools deploy my-app
# ⚠️  App "my-app" already exists, using "my-app-2" instead  
# ✅ App "my-app-2" created and deployed
```

### Multi-Environment Deployment
```bash
# Deploy to different environments
bruvtools deploy my-app-dev     # Development
bruvtools deploy my-app-staging # Staging  
bruvtools deploy my-app-prod    # Production
```

### Scaling and Management
```bash
# Scale your app
bruvtools scale my-app 3        # Scale to 3 replicas

# Monitor your app
bruvtools status my-app         # Check status
bruvtools logs my-app           # View logs
bruvtools test my-app           # Test connectivity
```

## 💰 Cost Comparison

| Platform | Monthly Cost | Features |
|----------|-------------|----------|
| **bruvtools + CapRover** | **$5** | Unlimited apps, SSL, scaling, your server |
| Heroku | $25+ | Limited apps, SSL extra, shared resources |
| Vercel Pro | $20+ | Limited functions, bandwidth limits |
| Railway | $20+ | Limited usage, shared infrastructure |
| AWS/GCP | $50+ | Complex setup, hidden costs |

**💡 With DigitalOcean's $100 credit, you get 20 months free!**

## 🛠️ Troubleshooting

### Common Issues

**❌ "CapRover CLI not found"**
```bash
npm install -g caprover
# Restart terminal and try again
```

**❌ "App name not allowed"**
```bash
# Use lowercase letters and hyphens only
bruvtools deploy my-app-name  # ✅ Good
bruvtools deploy MyAppName    # ❌ Bad
```

**❌ "Authentication failed"**
```bash
# Check your .env file has correct CAPROVER_PASSWORD
cat .env | grep CAPROVER_PASSWORD
```

**❌ Shows default CapRover page**
```bash
# Wait 2-3 minutes for deployment to complete, then try:
curl http://your-app.your-domain.com
```

## ⚠️ Environment Variable Caveats & Limitations

### 🚨 **Large Environment Variables (>1000 characters)**

**The Problem**: CapRover and many cloud platforms have strict limits on environment variable sizes:
- **CapRover**: ~1000 character limit per environment variable
- **Heroku**: 32KB total for all environment variables
- **AWS Lambda**: 4KB total for all environment variables
- **Docker**: No hard limit, but performance degrades with very large values

**Common Culprits**:
- 🔑 **JWT Tokens**: Often 1000+ characters (especially with extensive claims)
- 🔐 **Private Keys**: RSA/ECDSA keys can be 1600+ characters
- 📄 **JSON Configs**: Large configuration objects
- 🌐 **Base64 Encoded Data**: Images, certificates, or binary data

### ✅ **bruvtools Solutions**

**1. Automatic Detection & Splitting** ⚠️ **EXPERIMENTAL - NOT FULLY WORKING**
```bash
bruvtools init
# Detection works, but automatic splitting is experimental
# Currently shows warnings but doesn't auto-generate split code
# Manual implementation required (see below)
```

**2. Manual Splitting** ✅ **WORKING** (recommended approach)
```bash
# Split a 1083-character JWT token manually
export JWT_TOKEN_1="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjIwMzQ3ZWI1OWY0NzE5NmJjZGM4OTU4OWY5YTFjOGNkMjU3Y2QyYTM3YTE0MTE0YWFhY2FhZTEzYjBkYTZjN2NhYTExZTFmYTY5OWZhNzVlIn0.eyJhdWQiOiJkZGQ3MjM4MC02NTNjLTQ5MTctYTRiYi01YjMxOTU0ZTNhY2EiLCJqdGkiOiIyMDM0N2ViNTlmNDcxOTZiY2RjODk1ODlmOWExYzhjZDI1N2NkMmEzN2ExNDExNGFhYWNhYWUxM2IwZGE2YzdjYWExMWUxZmE2OTlmYTc1ZSIsImlhdCI6MTc0ODQ4NDY4NSwibmJmIjoxNzQ4NDg0Njg1LCJleHAiOjE4Nzc5MDQwMDAsInN1YiI6IjEzMDIzOTY0IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxNjM3NTUxLCJiYXNlX2RvbWFpbiI6ImtvbW1vLmNvbSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiNjU5NDAxNGYtMTgzNS00ZmEwLTgxOGUtYzViYzk5Y2QxYWY4IiwiYXBpX2RvbWFpbiI6ImFwaS1nLmtvbW1vLmNvbSJ9.D1Yh6cVMqUdqBoeDR2NLX4EgFHbe5g0g1w_4__3Akg6m7jCFSKoWkbw-HFQuylayBuW4MEIzrkBeNTpM9JIj5ccFedCEpR303mZf4tpe_pUlE6Knk8cpvYGhZY1T0P-SWhO9khWxpiv1mxnhsQs53czvfwTjze0IonM7Mx3yvALbcXvwiW-j75aYUfwvU1xqHRFLjQ9BhHDVpk8vMAsEgrlzSnHUcGjD-Fj5FuwnH8_Dv7aueW-yWOJFGI9o7QTpttxIRZ2lbiqLmw6E1BXyQifZzZPNb1JWVehZX_vKjudZWLumHsej62yGdUe2eeyVLgLgtfRjgqzmVar7Ac62bw"
export JWT_TOKEN_2="second_part_here"
export JWT_TOKEN_3="third_part_here"

# Add getEnvVar() function to your code (manual implementation)
# Use getEnvVar('JWT_TOKEN') to reconstruct automatically
```

**3. Alternative Solutions** ✅ **WORKING** (often better than splitting)
```bash
# Option 1: Store in files (for very large data)
echo "large_private_key_content" > /app/private.key
# Then read in your app: fs.readFileSync('/app/private.key', 'utf8')

# Option 2: Use external secret management
# - AWS Secrets Manager
# - HashiCorp Vault  
# - Azure Key Vault
# - Google Secret Manager

# Option 3: Embed in code (for non-sensitive config)
const config = {
  // Large configuration object directly in code
  // Good for: API endpoints, feature flags, non-secret settings
  // Bad for: passwords, tokens, private keys
};
```

### 🚨 **What NOT to Do**

**❌ Don't ignore the warnings**
```bash
# This WILL fail on CapRover:
export HUGE_JWT_TOKEN="very_long_token_over_1000_chars..."
bruvtools deploy my-app  # ❌ Deployment fails silently
```

**❌ Don't commit split tokens to git**
```bash
# NEVER do this in your .env file:
JWT_TOKEN_1=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6...
JWT_TOKEN_2=second_part_of_secret_token...
# This exposes your secrets in version control!
```

**❌ Don't use environment variables for binary data**
```bash
# This is problematic:
export CERTIFICATE_FILE="LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0t..."  # Base64 encoded
# Better: Store as file or use secret management service
```

### ✅ **Best Practices**

**1. For large environment variables (current recommended approach)**
- **Detection**: bruvtools will warn you about large variables ✅
- **Auto-splitting**: Currently experimental, manual implementation required ⚠️
- **Manual splitting**: Use the `getEnvVar()` function pattern shown above ✅
- **Alternative**: Embed credentials in code for non-sensitive configs ✅

**2. Keep secrets out of git**
```bash
# Always in .gitignore:
.env
.env.local
.env.production
bruvtools.yml
```

**3. Use appropriate storage for data type**
- **Short secrets** (<500 chars): Environment variables ✅
- **Long tokens** (500-2000 chars): Split environment variables ✅
- **Very long data** (>2000 chars): Files or secret management ✅
- **Binary data**: Files, never environment variables ❌

**4. Test your reconstruction**
```javascript
// Always test that your tokens work after reconstruction
const token = getEnvVar('JWT_TOKEN');
console.log(`Token length: ${token ? token.length : 0} characters`);
if (!token || token.length < 100) {
  throw new Error('JWT token reconstruction failed!');
}
```

### 📋 **Platform-Specific Limits**

| Platform | Per Variable | Total Limit | Notes |
|----------|-------------|-------------|-------|
| **CapRover** | ~1000 chars | No total limit | Hard limit, fails silently |
| **Heroku** | 32KB | 32KB total | Includes variable names |
| **AWS Lambda** | No per-var limit | 4KB total | Very restrictive |
| **Docker** | No hard limit | Memory dependent | Performance impact |
| **Kubernetes** | 1MB | No total limit | Base64 encoded in etcd |

### 🔧 **Debugging Split Variables**

```bash
# Check if variables are properly set (manual verification)
echo "JWT_TOKEN_1 length: ${#JWT_TOKEN_1}"
echo "JWT_TOKEN_2 length: ${#JWT_TOKEN_2}"
echo "JWT_TOKEN_3 length: ${#JWT_TOKEN_3}"

# Test reconstruction locally (if you implemented getEnvVar function)
node -e "
const getEnvVar = require('./your-getEnvVar-file'); // Your manual implementation
console.log('Token length:', getEnvVar('JWT_TOKEN')?.length || 0);
"

# Check deployment logs for reconstruction errors
bruvtools logs my-app | grep -i "token\|env\|reconstruction"

# Note: bruvtools configure --env-only is experimental for auto-detection
```

---

**Requirements**: Node.js 16+ • **License**: MIT • **Version**: 0.2.15

## 🤝 Contributing

We welcome contributions! This is a serious open-source project focused on making deployment simple and reliable.

1. Fork the repository
2. Create a feature branch
3. Test your changes thoroughly  
4. Submit a pull request

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/fcavalcantirj/bruvtools/issues)
- **Documentation**: [GitHub Wiki](https://github.com/fcavalcantirj/bruvtools/wiki)
- **Email**: felipecavalcantirj@gmail.com

---

**Made with ❤️ by the bruvtools team** • **Never Give Up!** 🚀