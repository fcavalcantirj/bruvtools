# bruvtools 🚀

[![npm version](https://badge.fury.io/js/bruvtools.svg)](https://www.npmjs.com/package/bruvtools)
[![npm downloads](https://img.shields.io/npm/dm/bruvtools.svg)](https://www.npmjs.com/package/bruvtools)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Deploy microservices anywhere, any language, one CLI**

**bruvtools** eliminates cloud vendor lock-in with a unified deployment experience. Deploy Node.js, Go, Python, Java, or any containerizable application to CapRover, AWS, GCP, or Kubernetes with the same simple commands.

## 📦 Installation

**Requirements**: Node.js 16+ ([download](https://nodejs.org/))

```bash
# Install bruvtools globally
npm install -g bruvtools

# Verify installation
bruvtools --version  # Should show: 0.2.0
```

## ⚡ Quick Start

```bash
# 1. Interactive setup (creates all config files)
bruvtools init

# 2. Deploy your app
bruvtools deploy my-app

# 3. Check your services
bruvtools services
```

**🎯 That's it!** bruvtools handles Docker builds, environment variables, and deployment automatically.

## 🔧 Supported Languages & Frameworks

| Language | Frameworks | Auto-Detection |
|----------|------------|----------------|
| **Node.js** | Express, Fastify, NestJS, Next.js | ✅ package.json |
| **Go** | Gin, Echo, Chi, Fiber | ✅ go.mod |
| **Python** | FastAPI, Flask, Django | ✅ requirements.txt |
| **Java** | Spring Boot, Quarkus | ✅ pom.xml, build.gradle |
| **PHP** | Laravel, Symfony | ✅ composer.json |
| **Ruby** | Rails, Sinatra | ✅ Gemfile |
| **Any** | Custom Dockerfile | ✅ Dockerfile |

## ✨ Why bruvtools?

✅ **Language Agnostic** - Deploy Node.js, Go, Python, Java, PHP, Ruby, .NET  
✅ **Cloud Agnostic** - CapRover, AWS, GCP, Kubernetes, Railway  
✅ **Zero Lock-in** - Switch providers without changing your workflow  
✅ **Production Ready** - Optimized Dockerfiles, security hardening, scaling  
✅ **Interactive Setup** - No manual configuration files needed  
✅ **🎯 Environment Validation**: Prevents deployment failures early

## 🌐 Live Examples

🔍 **Go API**: [cnpj-enricher.bruvbot.com.br](https://cnpj-enricher.bruvbot.com.br)  
🎯 **Try API**: [cnpj-enricher.bruvbot.com.br/ficha?cnpj=11222333000181](https://cnpj-enricher.bruvbot.com.br/ficha?cnpj=11222333000181)  

*Real production microservice deployed with bruvtools*

## 🌟 Core Features

### Universal Deployment Commands
- **Multi-Provider Support**: CapRover (ready), AWS, GCP, Railway, Kubernetes (coming soon)
- **Unified Interface**: Same commands work across all providers
- **Zero Vendor Lock-in**: Switch providers without changing your workflow

### Service Management
- **📊 Services Dashboard**: View all deployed applications with `bruvtools services`
- **⚡ Real-time Status**: Check individual service health and metrics
- **🔄 Scaling**: Horizontal scaling with simple commands
- **📝 Logs**: Stream application logs in real-time

### Development Workflow
- **🐳 Smart Dockerization**: Auto-generates optimized Dockerfiles
- **🔧 Configuration Management**: Global and project-specific configs
- **🔌 Plugin Architecture**: Easy to extend with new providers
- **🎯 Environment Validation**: Prevents deployment failures early

## 🚀 Installation & Setup

### Prerequisites

bruvtools requires:
- **Node.js** >= 16.0.0 ([download here](https://nodejs.org/))
- **npm** (comes with Node.js)

### Quick Install (Recommended)

**🎯 Option 1: npm global install (recommended - now live!)**
```bash
npm install -g bruvtools
```
*bruvtools is now officially published on npm! This is the fastest and most reliable installation method.*

**⚡ Option 2: One-line install script**
```bash
curl -fsSL https://raw.githubusercontent.com/fcavalcantirj/bruvtools/main/install.sh | bash
```
*Alternative installation method that downloads and installs from source.*

**🔧 Option 3: From source (for developers)**
```bash
# Clone the repository
git clone https://github.com/fcavalcantirj/bruvtools.git
cd bruvtools

# Install dependencies
npm install

# Install globally
npm install -g .

# Clean up (optional)
cd .. && rm -rf bruvtools
```

### 🔍 Verify Installation

```bash
# Check bruvtools is available globally
which bruvtools
# ✅ Should show: /usr/local/bin/bruvtools (or similar npm global path)

# Test the CLI version
bruvtools --version
# ✅ Should show: 0.2.0

# Test help command
bruvtools --help
# ✅ Should show: Usage: bruvtools [options] [command]

# Verify npm package info
npm list -g bruvtools
# ✅ Should show: bruvtools@0.2.0
```

### ⚡ Quick Start (2 minutes)

Once installed, get started immediately with interactive setup:

```bash
# 1. Create a new directory for testing
mkdir my-test-app && cd my-test-app

# 2. Create a simple Node.js app
echo 'console.log("Hello bruvtools!"); const http = require("http"); const server = http.createServer((req, res) => { res.writeHead(200, {"Content-Type": "text/plain"}); res.end("Hello from bruvtools!"); }); const PORT = process.env.PORT || 3000; server.listen(PORT, () => console.log(`Server running on port ${PORT}`));' > app.js

# 3. Interactive setup (creates both bruvtools.yml AND .env automatically!)
bruvtools init

# The init command will ask you:
# ✅ Which cloud provider? (CapRover recommended)
# ✅ CapRover machine name and domain
# ✅ CapRover password (stored securely in .env)
# ✅ Project name and default port
# ✅ Any additional environment variables

# 4. Deploy your app (everything is configured!)
bruvtools deploy my-test-app

# 5. Check your deployed services
bruvtools services
```

**🎯 Pro tip**: The interactive `bruvtools init` eliminates all manual configuration! No more:
- ❌ Manually creating `.env` files
- ❌ Manually creating `bruvtools.yml` files  
- ❌ Copying configuration examples
- ❌ Forgetting required environment variables

Just run `bruvtools init` and answer the prompts! 🚀

### ⚙️ Initial Setup

After successful installation, bruvtools offers two setup methods:

**🎯 Option 1: Interactive Setup (Recommended)**
```bash
# Navigate to your project directory
cd /path/to/your/project

# Run interactive setup - creates everything automatically
bruvtools init

# ✅ Automatically creates:
#    - bruvtools.yml (project configuration)
#    - .env (environment variables with CAPROVER_PASSWORD)
#    - Validates all required settings
#    - Provides helpful defaults

# Test the setup immediately
bruvtools services
# ✅ Should show: 📦 CapRover Services Dashboard
```

**🔧 Option 2: Manual Setup (Advanced)**
For automation, CI/CD, or custom setups:
```bash
# 1. Non-interactive init (creates basic bruvtools.yml)
bruvtools init --non-interactive

# 2. Manually create .env file
cp .env.example .env
# Edit .env and set: CAPROVER_PASSWORD=your_actual_password

# 3. Manually edit bruvtools.yml if needed
# provider settings, custom domains, etc.
```

**🔄 Reconfiguration**
Need to change settings later?
```bash
# Reconfigure everything interactively
bruvtools configure

# Or reconfigure specific parts:
bruvtools configure --provider-only  # Just provider settings
bruvtools configure --env-only       # Just environment variables
```

### 🆘 Troubleshooting Installation

**Command not found: bruvtools**
```bash
# Option 1: Reinstall from npm (recommended)
npm uninstall -g bruvtools
npm install -g bruvtools

# Option 2: Check if npm bin directory is in PATH
echo $PATH | grep npm

# Option 3: Add npm bin to PATH (add to ~/.bashrc or ~/.zshrc)
export PATH="$(npm bin -g):$PATH"

# Option 4: Use sudo if needed (macOS/Linux)
sudo npm install -g bruvtools
```

**Permission denied during npm installation**
```bash
# Option 1: Configure npm to use different directory (recommended)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
npm install -g bruvtools

# Option 2: Use sudo (if necessary)
sudo npm install -g bruvtools

# Option 3: Use npx for one-time usage
npx bruvtools --help
```

**Package not found on npm**
```bash
# Verify bruvtools is available on npm
npm view bruvtools

# ✅ Should show package info including:
# bruvtools@0.2.0 | MIT | deps: 5 | versions: 2
# Universal Cloud Deployment CLI - Deploy Anywhere, Manage Everything
```

**Node.js version too old**
```bash
# Check current version
node --version

# Install latest Node.js from https://nodejs.org/
# Or use node version manager:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install node
nvm use node
```

## 📖 Command Reference

### Setup & Configuration
```bash
# Interactive setup (creates bruvtools.yml and .env)
bruvtools init

# Non-interactive setup for automation
bruvtools init --non-interactive

# Reconfigure existing setup
bruvtools configure

# Reconfigure only provider settings
bruvtools configure --provider-only

# Reconfigure only environment variables
bruvtools configure --env-only

# View current configuration
bruvtools config --list

# List available providers
bruvtools config --providers
```

### Service Management
```bash
# View all deployed services with dashboard
bruvtools services

# Check individual service status
bruvtools status <app-name>

# View service logs
bruvtools logs <app-name> [--follow]

# Test service health
bruvtools test <app-name>
```

### Deployment Operations
```bash
# Deploy from current directory
bruvtools deploy <app-name>

# Deploy from specific directory
bruvtools deploy <app-name> --dir /path/to/app

# Deploy with custom port
bruvtools deploy <app-name> --port 3000

# Deploy with scaling
bruvtools deploy <app-name> --scale 3
```

### Application Management
```bash
# Create new application
bruvtools create <app-name>

# Scale application
bruvtools scale <app-name> <replicas>

# Restart application
bruvtools restart <app-name>

# Delete application
bruvtools delete <app-name>

# Set environment variables
bruvtools env <app-name> <key> <value>
```

## 🎯 Real-World Usage Examples

### Example 1: Go API Service (CNPJ Enricher)
```bash
# Deploy a Go application that serves Brazilian company data
bruvtools deploy cnpj-enricher --dir /Users/username/go-projects/cnpj-enricher

# The app automatically:
# ✅ Detects Go 1.23.0 environment
# ✅ Builds optimized Docker image with Alpine Linux
# ✅ Configures PORT environment variable (defaults to 80 for CapRover)
# ✅ Sets up health endpoints
# ✅ Deploys to https://cnpj-enricher.bruvbot.com.br

# Test the deployed API
curl https://cnpj-enricher.bruvbot.com.br/ficha?cnpj=11222333000181
```

### Example 2: Node.js Application
```bash
# Deploy a Node.js app with environment variables
bruvtools deploy my-api --port 3000
bruvtools env my-api NODE_ENV production
bruvtools env my-api DATABASE_URL postgresql://...

# Scale for production load
bruvtools scale my-api 5
```

### Example 3: Development Workflow
```bash
# Check what's currently deployed
bruvtools services

# Output:
# 📦 CapRover Services Dashboard
#    Connected to: caprover1133onubuntu2204-s-1vcpu-2gb-amd-sfo3-01
#    Domain: bruvbot.com.br
#    Dashboard: https://captain.bruvbot.com.br
# 
# 🔍 Known Services:
#    📦 cnpj-enricher
#       URL: https://cnpj-enricher.bruvbot.com.br
#       API: https://cnpj-enricher.bruvbot.com.br/ficha?cnpj=XXXXXXX
#       Description: Brazilian company data API

# Deploy updates
bruvtools deploy cnpj-enricher

# Monitor logs
bruvtools logs cnpj-enricher --follow
```

## 🏗️ Architecture & Design

### Provider Plugin System
```
bruvtools/
├── lib/
│   ├── core/           # Core CLI framework
│   ├── providers/      # Provider implementations
│   │   ├── caprover/   # CapRover provider (fully implemented)
│   │   ├── aws/        # AWS provider (coming soon)
│   │   ├── gcp/        # GCP provider (coming soon)
│   │   └── base.js     # Base provider interface
│   └── utils/          # Shared utilities
```

### Configuration Hierarchy
1. **Global config**: `~/.bruvtools/config.yml`
2. **Project config**: `./bruvtools.yml`
3. **Environment variables**: `.env` file
4. **Command arguments**: CLI flags

### Docker Generation
bruvtools generates optimized Dockerfiles based on detected project type:

```dockerfile
# Example generated Dockerfile for Go project
FROM golang:1.23.0-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .
EXPOSE 80
ENV PORT=80
CMD ["./main"]
```

## 🔧 Advanced Configuration

### Custom Provider Settings
```yaml
# bruvtools.yml
providers:
  caprover:
    machine: your-caprover-machine-name
    domain: your-domain.com
    timeout: 300
  aws:
    region: us-east-1
    profile: production
```

### Project-Specific Overrides
```yaml
# Per-project settings
projects:
  my-api:
    provider: caprover
    scale: 3
    port: 3000
    env:
      NODE_ENV: production
```

## 🔒 Security Best Practices

- **Environment Variables**: Never commit `.env` files to version control
- **Minimal Images**: Alpine Linux base images reduce attack surface
- **Non-Root Execution**: Containers run as non-privileged users
- **Secrets Management**: Use provider-native secret management when possible
- **Access Control**: Configure proper IAM/RBAC for each provider

## ⚠️ CapRover Environment Variable Gotchas

### The Problem
CapRover can have issues with environment variables not being properly passed to containers or being overridden by platform defaults. This can cause applications to fail silently or behave unexpectedly in production.

### The Solution: Defensive Programming
**Your applications should always have sensible hardcoded defaults** while still respecting environment variables when available:

```go
// ✅ GOOD: Go example with fallback
port := os.Getenv("PORT")
if port == "" {
    port = "80"  // CapRover default
}
log.Printf("Starting server on port %s", port)
```

```javascript
// ✅ GOOD: Node.js example with fallback
const port = process.env.PORT || 3000;
const dbUrl = process.env.DATABASE_URL || "sqlite://./local.db";
console.log(`Server starting on port ${port}`);
```

```python
# ✅ GOOD: Python example with fallback
import os
port = int(os.environ.get('PORT', 5000))
debug = os.environ.get('DEBUG', 'false').lower() == 'true'
```

### Common CapRover Issues
- **PORT conflicts**: CapRover expects port 80 by default, but your app might default to 8080
- **Missing variables**: Environment variables set in CapRover UI might not reach the container
- **Override behavior**: CapRover might override your environment variables
- **Container restart**: Variables might be lost during container restarts
- **⚠️ Long token truncation**: Long environment variable values (JWT tokens, API keys, connection strings) may get cut off silently, causing mysterious authentication failures

### Token Length Workarounds
```bash
# ❌ PROBLEMATIC: Very long tokens might get truncated
JWT_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

# ✅ BETTER: Split long values or use files
JWT_TOKEN_PART1=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
JWT_TOKEN_PART2=eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ
JWT_TOKEN_PART3=SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

# ✅ BEST: Use file mounting for very long secrets
# Set in your application:
# token := os.Getenv("JWT_TOKEN_PART1") + os.Getenv("JWT_TOKEN_PART2") + os.Getenv("JWT_TOKEN_PART3")
```

### Debugging Environment Variables
```bash
# ✅ Test environment variables are properly set
bruvtools env my-app TEST_VAR "hello world"

# ✅ Check if long tokens are being truncated
bruvtools logs my-app | grep -i "token\|auth\|env"

# ✅ Compare local vs deployed environment
echo $MY_LONG_TOKEN | wc -c    # Local character count
# vs checking in container logs
```

### bruvtools Mitigation
bruvtools helps by:
- ✅ **Auto-detecting** application defaults and adjusting for CapRover
- ✅ **Validating** environment variables before deployment
- ✅ **Generating** Dockerfiles with proper environment setup
- ✅ **Setting** CapRover-compatible defaults (e.g., PORT=80)

### Deployment Best Practices
```bash
# ✅ Test locally with different PORT values
PORT=8080 go run main.go    # Should work
PORT=3000 go run main.go    # Should work  
go run main.go              # Should default to 80 or 8080

# ✅ Deploy with bruvtools (handles PORT automatically)
bruvtools deploy cnpj-enricher

# ✅ Set additional environment variables if needed
bruvtools env cnpj-enricher DEBUG true
bruvtools env cnpj-enricher API_KEY your-key-here
```

## 🚧 Roadmap

### ✅ Completed (v0.2.0 - Interactive Setup Revolution!)
- **🎯 Interactive CLI Setup**: Revolutionary `bruvtools init` with guided prompts
- **🤖 Automatic File Generation**: Creates both bruvtools.yml AND .env files automatically
- **🔧 Professional Configuration**: Provider selection, validation, environment variables
- **⚙️ Reconfiguration Support**: `bruvtools configure` for updating existing setups
- **✨ Official npm Package**: Published to npm registry as `bruvtools@0.2.0`
- **🌍 Global Availability**: Anyone can install with `npm install -g bruvtools`
- **🏷️ Professional Branding**: npm badges, comprehensive documentation, security audit passed
- CapRover provider with full feature set
- Docker image optimization and caching
- Environment variable validation and debugging guides
- Services dashboard command with beautiful CLI output
- Real-world Go application deployment (live at cnpj-enricher.bruvbot.com.br)
- Production-ready Dockerfile generation with Alpine Linux and security hardening
- Global CLI installation with professional user experience
- Comprehensive documentation with live examples and troubleshooting

### 🔄 In Progress (v0.2.0)
- Enhanced error handling and recovery
- Configuration validation and migration  
- Provider health checks
- Automated testing and CI/CD pipeline

### 📋 Planned (Future Versions)
- **AWS Provider**: ECS, Lambda, App Runner support
- **GCP Provider**: Cloud Run, GKE integration  
- **Railway Provider**: Simple deployments
- **Kubernetes Provider**: Generic K8s deployments
- **CI/CD Integration**: GitHub Actions, GitLab CI templates
- **Monitoring**: Built-in metrics and alerting
- **Database Management**: Provider-agnostic database operations
- **Plugin Marketplace**: Community-contributed providers

## 🤝 Contributing

bruvtools uses a plugin architecture that makes adding new providers straightforward:

1. Extend the `BaseProvider` class
2. Implement required methods (`deploy`, `scale`, `delete`, etc.)
3. Add provider-specific configuration
4. Submit a pull request

See `lib/providers/caprover/index.js` for a complete implementation example.

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

- **Documentation**: Visit the CapRover dashboard at `https://captain.your-domain.com`
- **Issues**: Report bugs and feature requests on GitHub
- **Community**: Join our discussions for help and best practices

---

**Deploy Anywhere, Manage Everything** - bruvtools makes cloud deployment simple, consistent, and vendor-agnostic. 