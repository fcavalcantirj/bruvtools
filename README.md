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
bruvtools --version  # Should show: 0.2.2
```

### 2. Configure (Interactive)
```bash
bruvtools init
# Asks everything: provider, credentials, project settings
# Creates bruvtools.yml and .env automatically
```

### 3. Test Deploy
```bash
# Create a simple test app
mkdir test-app && cd test-app

# Create a working Node.js server
cat > app.js << 'EOF'
console.log("Hello bruvtools!");
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end("Hello from bruvtools!");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
EOF

# Deploy it
bruvtools deploy my-test
```

**That's it!** Your app is live. Check it with `bruvtools services`

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

# Deploy app  
bruvtools deploy <app-name>

# List services
bruvtools services

# View logs
bruvtools logs <app-name>

# Reconfigure
bruvtools configure
```

## 🛠️ Providers

- ✅ **CapRover** (ready)
- 🔄 **AWS, GCP, Railway** (coming soon)

## 🆘 Need Help?

- **Issues**: [GitHub Issues](https://github.com/username/bruvtools/issues)
- **Docs**: Interactive help with `bruvtools --help`

---

**Requirements**: Node.js 16+ • **License**: MIT
