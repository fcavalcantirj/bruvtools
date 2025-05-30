# bruvtools 🚀

[![npm version](https://badge.fury.io/js/bruvtools.svg)](https://www.npmjs.com/package/bruvtools)
[![npm downloads](https://img.shields.io/npm/dm/bruvtools.svg)](https://www.npmjs.com/package/bruvtools)
[![npm bundle size](https://img.shields.io/bundlephobia/min/bruvtools)](https://www.npmjs.com/package/bruvtools)
[![Node.js version](https://img.shields.io/node/v/bruvtools)](https://www.npmjs.com/package/bruvtools)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Deploy microservices anywhere, any language, one CLI**

Deploy Node.js, Go, Python, Java, PHP, Ruby, or any containerizable application to CapRover, AWS, GCP, or Kubernetes with the same simple commands. Zero vendor lock-in.

## 🎯 3-Step Setup

### 1. Install
```bash
npm install -g bruvtools
bruvtools --version  # Should show: 0.2.9
```

> 🆕 **v0.2.9 Updates**: Fixed Windows PowerShell compatibility! Validates CapRover CLI during init!
> ✅ **New**: Validates CapRover CLI installation during `bruvtools init` to prevent deployment issues.

### 2. Configure (Interactive)
```bash
bruvtools init
# Now checks if CapRover CLI is installed first!
# Asks everything: provider, credentials, project settings
# Creates bruvtools.yml and .env automatically
```

### 3. Complete Deployment Guide

**Deploy the working hello world example step by step:**

```bash
# Step 1: Get the proven working example
git clone https://github.com/fcavalcantirj/bruvtools.git
cd bruvtools/examples/hello-world

# Step 2: Test locally to verify it works
node server.js &
sleep 2 && curl http://localhost:3000  # Should show: 🎉 HELLO FROM BRUVTOOLS - ACTUALLY WORKING!
kill %1  # Stop local server

# Step 3: Setup bruvtools configuration
bruvtools init
# Choose: CapRover (recommended)
# Enter: Your CapRover machine name (e.g., captain-01)
# Enter: Your domain (e.g., mydomain.com)
# Enter: Your CapRover password
# Enter: App name (e.g., my-hello-app)
# Choose: Port 80 (CapRover default)

# Step 4: Create app on CapRover (required first step)
bruvtools create my-hello-app

# Step 5: Deploy using manual method (until bruvtools deploy is fixed)
tar -czf deploy.tar.gz .
bruvtools deploy --caproverName YOUR-CAPROVER-MACHINE --appName my-hello-app --tarFile deploy.tar.gz

# Step 6: Test your live deployment
curl http://my-hello-app.YOUR-DOMAIN.com
# Should show: 🎉 HELLO FROM BRUVTOOLS - ACTUALLY WORKING!
```

**🎯 Complete Success!** Your app is now live and accessible on the internet.

### 🚀 What You Just Did

1. ✅ Downloaded working example code
2. ✅ Tested locally to verify it works
3. ✅ Configured bruvtools with CapRover settings
4. ✅ Created app on CapRover server
5. ✅ Deployed using proven manual method
6. ✅ Verified live deployment works

**✅ Live Example**: [final-hello.bruvbot.com.br](http://final-hello.bruvbot.com.br)  
**📁 Source Code**: [examples/hello-world/](examples/hello-world/)

### 🔧 Need Your Own App?

Copy the working example structure:
```bash
# Copy the working files to your project
cp examples/hello-world/package.json your-project/
cp examples/hello-world/captain-definition your-project/
# Modify server.js for your needs (keep PORT handling!)
```

## 🪟 Windows PowerShell Support

✅ **Fixed in v0.2.9!** bruvtools now works seamlessly on Windows PowerShell.

**✅ What Works Out of the Box:**
- ✅ All `bruvtools` commands (`init`, `create`, `status`, `test`, `services`)
- ✅ CapRover integration (after installing CapRover CLI)
- ✅ Configuration and setup (identical to Mac/Linux)
- ✅ App creation and management

**📦 Quick Windows Setup:**
```powershell
# 1. Install both tools
npm install -g bruvtools caprover

# 2. Verify installation
bruvtools --version  # Should show: 0.2.9
caprover --version   # Should show: 2.x.x

# 3. Use normally (same as Mac/Linux)
bruvtools init
bruvtools create my-app
```

**⚠️ Manual Deployment (until bruvtools deploy is fixed):**
```powershell
# For deployments, still use manual method:
Compress-Archive -Path . -DestinationPath deploy.zip
# Then upload via CapRover dashboard
```

**🔧 If Still Having Issues:**
- Restart PowerShell after installing npm packages
- Use `npx caprover --version` to test CapRover CLI
- Check that both tools are in PATH: `where bruvtools caprover`

**❌ "spawn caprover ENOENT" (Windows - Fixed in v0.2.9)**
```powershell
# If still occurring, ensure CapRover CLI is installed:
npm install -g caprover
# Restart PowerShell and try again
```

**❌ "curl: command not found" (Windows)**
```powershell
# bruvtools test command should work in v0.2.9
# But for manual testing, use PowerShell:
Invoke-WebRequest http://your-app.your-domain.com

# Or install curl for Windows:
# Download from: https://curl.se/windows/
```

**❌ "tar: command not found" (Windows)**
```powershell
# Use PowerShell Compress-Archive instead:
Compress-Archive -Path . -DestinationPath deploy.zip
# Then upload deploy.zip via CapRover dashboard
```

**❌ Shows default CapRover page instead of your app**
```bash
# Wait 2-3 minutes for deployment to complete, then try again
curl http://your-app.your-domain.com
```

---

**Requirements**: Node.js 16+ • **License**: MIT

## 🔧 Supported Languages

| Language | Auto-Detection |
|----------|----------------|
| **Node.js** | package.json |
| **Go** | go.mod |
| **Python** | requirements.txt |
| **Java** | pom.xml, build.gradle |
| **PHP** | composer.json |
| **Ruby** | Gemfile |
| **Any** | Dockerfile |

## 🌐 Live Example

🔍 **API**: [cnpj-enricher.bruvbot.com.br](http://cnpj-enricher.bruvbot.com.br)  
*Real production microservice deployed with bruvtools*

**Try it live:**
```bash
# Get company information by CNPJ (Brazilian tax ID)
curl "http://cnpj-enricher.bruvbot.com.br/ficha?cnpj=11222333000181"

# Example response: JSON with company details, revenue, address, partners, etc.
```

## 📋 Common Commands

```bash
# Interactive setup
bruvtools init

# Deploy app (experimental)
bruvtools deploy <app-name>

# List services
bruvtools services

# View logs (interactive)
bruvtools logs <app-name>

# Reconfigure
bruvtools configure
```

## 🛠️ Current Status

- ✅ **CapRover provider** implemented and working
- ✅ **Interactive setup** working (`bruvtools init`) 
- ✅ **Services dashboard** working (`bruvtools services`)
- ✅ **App creation** working (`bruvtools create`)
- ✅ **App management** working (`bruvtools status`, `bruvtools test`, `bruvtools list`)
- ✅ **Windows PowerShell** fully supported (v0.2.9+)
- ✅ **CapRover CLI validation** during init (v0.2.9+)
- ✅ **Manual deployment** working (tar + caprover CLI)
- ❌ **Auto deployment** broken (`bruvtools deploy` has packaging issues)
- 🔄 **AWS, GCP, Railway** coming soon

**Workaround**: Use manual deployment method shown above until `bruvtools deploy` is fixed.

## 🆘 Need Help?

- **Issues**: [GitHub Issues](https://github.com/fcavalcantirj/bruvtools/issues)
- **Docs**: Interactive help with `bruvtools --help`

## 🔧 Troubleshooting

**❌ "bruvtools: command not found"**
```bash
npm install -g bruvtools  # Install globally
which bruvtools           # Should show path
```

**❌ "app does not exist on this CapRover machine"**
```bash
# You forgot step 4! Create the app first:
bruvtools create your-app-name
```

**❌ "Captain Definition file does not exist"**
```bash
# Make sure you have all 3 files:
ls -la package.json server.js captain-definition
```

**❌ "spawn caprover ENOENT" (Windows - Fixed in v0.2.9)**
