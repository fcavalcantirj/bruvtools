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

## 🚀 Quick Start: Your Private Platform in 5 Minutes

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
bruvtools --version  # Should show: 0.2.11
```

### Step 3: Configure & Deploy (2 minutes)

```bash
# Clone and test the working example
git clone https://github.com/fcavalcantirj/bruvtools.git
cd bruvtools/examples/hello-world

# Setup bruvtools (one time)
bruvtools init
# Enter your CapRover domain and credentials

# Deploy with smart auto-creation and collision detection
bruvtools deploy my-app
# ✅ Checks if app exists
# ✅ Auto-creates app if needed  
# ✅ Handles name collisions (my-app-1, my-app-2, etc.)
# ✅ Deploys with clear step-by-step progress
# ✅ Your app is live with HTTPS!
```

**🎯 That's it!** Your private app platform is ready. Your app is now live at `https://my-app.yourdomain.com` with automatic SSL.

## 🎯 Enhanced Developer Experience (v0.2.11)

**🚀 Smart Deployment with Auto-Healing**

bruvtools now includes intelligent deployment verification and auto-fixing:

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
```

### 📊 **Improved Services Dashboard**
```bash
bruvtools services
# 📦 my-app
#    URL: https://my-app.yourdomain.com
#    Status: ✅ Healthy (200)
#    Instances: 0 ⚠️  CRITICAL - No instances running!
#    💡 Fix with: bruvtools scale my-app 1
```

**🎯 Result**: From "deploy and pray" to "deploy with confidence"!

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
bruvtools --version  # Should show: 0.2.11
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

---

**Requirements**: Node.js 16+ • **License**: MIT • **Version**: 0.2.11

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