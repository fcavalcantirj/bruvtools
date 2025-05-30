# bruvtools 🚀

[![npm version](https://badge.fury.io/js/bruvtools.svg)](https://www.npmjs.com/package/bruvtools)
[![npm downloads](https://img.shields.io/npm/dm/bruvtools.svg)](https://www.npmjs.com/package/bruvtools)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Deploy microservices anywhere, any language, one CLI**

Deploy Node.js, Go, Python, Java, PHP, Ruby, or any containerizable application to CapRover, AWS, GCP, or Kubernetes with the same simple commands. Zero vendor lock-in.

## 🎯 3-Step Setup

### 1. Install
```bash
npm install -g bruvtools
bruvtools --version  # Should show: 0.2.3
```

### 2. Configure (Interactive)
```bash
bruvtools init
# Asks everything: provider, credentials, project settings
# Creates bruvtools.yml and .env automatically
```

### 3. Test Deploy (Manual - Working Method)

**⚠️ Note**: bruvtools deploy has packaging issues. Use this manual method until fixed.

```bash
# Get the working example
git clone https://github.com/fcavalcantirj/bruvtools.git
cd bruvtools/examples/hello-world

# Test locally first 
node server.js
# curl http://localhost:3000  # Should show: 🎉 HELLO FROM BRUVTOOLS - ACTUALLY WORKING!

# Deploy steps that actually work:
bruvtools create my-hello-app
tar -czf deploy.tar.gz .
caprover deploy --caproverName your-caprover-machine --appName my-hello-app --tarFile deploy.tar.gz
```

**✅ Live Example**: [final-hello.bruvbot.com.br](http://final-hello.bruvbot.com.br)  
**📁 Working Code**: [examples/hello-world/](examples/hello-world/)

**🎯 Result**: Your app will be live and responding! This method is proven to work.

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

🔍 **API**: [cnpj-enricher.bruvbot.com.br](https://cnpj-enricher.bruvbot.com.br)  
*Real production microservice deployed with bruvtools*

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
- ✅ **Manual deployment** working (tar + caprover CLI)
- ❌ **Auto deployment** broken (`bruvtools deploy` has packaging issues)
- 🔄 **AWS, GCP, Railway** coming soon

**Workaround**: Use manual deployment method shown above until `bruvtools deploy` is fixed.

## 🆘 Need Help?

- **Issues**: [GitHub Issues](https://github.com/username/bruvtools/issues)
- **Docs**: Interactive help with `bruvtools --help`

---

**Requirements**: Node.js 16+ • **License**: MIT
