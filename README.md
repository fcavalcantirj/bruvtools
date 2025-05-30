# bruvtools 🚀

> **Universal Cloud Deployment CLI - Deploy Anywhere, Manage Everything**

bruvtools is a unified command-line interface that provides consistent deployment workflows across multiple cloud providers. No more vendor lock-in, no more switching between different tools - just one CLI to rule them all.

## ⚡ Quick Demo

```bash
# Deploy a Go application
bruvtools deploy cnpj-enricher --dir /path/to/your/go-app

# View all deployed services
bruvtools services

# Scale your application
bruvtools scale cnpj-enricher 3

# Check service status
bruvtools status cnpj-enricher
```

**Live Example**: We successfully deployed a Go CNPJ enricher API that scrapes Brazilian company data:
- 🌐 **Live URL**: `https://cnpj-enricher.bruvbot.com.br`
- 🔍 **API Endpoint**: `https://cnpj-enricher.bruvbot.com.br/ficha?cnpj=11222333000181`
- ⚡ **Health Check**: `https://cnpj-enricher.bruvbot.com.br/` 

## ⚠️ Critical Setup Requirements

### 1. Environment Variables (REQUIRED!)

**⚠️ IMPORTANT**: The `.env` file with `CAPROVER_PASSWORD` is **REQUIRED** for bruvtools to work. Without it, commands will hang or fail silently.

Create a `.env` file from the example and set your credentials:

```bash
# Copy the example
cp .env.example .env

# Edit .env and set your CapRover password
CAPROVER_PASSWORD=your_actual_caprover_password
```

**Why this matters**: 
- Without `CAPROVER_PASSWORD`, the `services` command will **hang indefinitely**
- CapRover API calls will timeout waiting for authentication
- Deployments will fail silently or with cryptic authentication errors
- The CLI validates these before any API calls to prevent issues

**Common symptoms of missing password**:
- `./bin/bruvtools.js services` hangs and times out
- CapRover API calls prompt for interactive input
- Silent authentication failures during deployment

### 2. Configuration

Configure your provider settings in `bruvtools.yml`:

```yaml
default_provider: caprover
providers:
  caprover: 
    machine: caprover1133onubuntu2204-s-1vcpu-2gb-amd-sfo3-01
    domain: bruvbot.com.br
projects:
  bruvtools:
    provider: caprover
```

### 3. Docker Cache Optimization

bruvtools generates **production-ready Dockerfiles** with optimizations:

- ✅ **Smart layer ordering**: Dependencies installed before copying source code
- ✅ **Alpine Linux base**: Smaller images (~20MB vs 200MB+), faster builds
- ✅ **Security hardened**: Non-root user, minimal attack surface
- ✅ **Signal handling**: Proper process management with dumb-init
- ✅ **Production optimized**: Uses `npm ci`, proper caching, health checks
- ✅ **Multi-stage builds**: Clean separation of build and runtime environments

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
- **Git** (for source installation)

### Quick Install (Recommended)

**🎯 Option 1: One-line install script (easiest)**
```bash
curl -fsSL https://raw.githubusercontent.com/fcavalcantirj/bruvtools/main/install.sh | bash
```
*This script automatically checks requirements, downloads, and installs bruvtools globally.*

**📦 Option 2: npm global install (when published to npm)**
```bash
npm install -g bruvtools
```
*Note: Not yet published to npm registry. Use Option 1 or 3 for now.*

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
# ✅ Should show: /usr/local/bin/bruvtools (or similar)

# Test the CLI version
bruvtools --version
# ✅ Should show: 0.1.0

# Test help command
bruvtools --help
# ✅ Should show: Usage: bruvtools [options] [command]
```

### ⚙️ Initial Setup

After successful installation, configure bruvtools for your projects:

```bash
# 1. Navigate to your project directory
cd /path/to/your/project

# 2. Create environment file with your CapRover credentials
cp .env.example .env
# Edit .env and set: CAPROVER_PASSWORD=your_actual_password

# 3. Create bruvtools configuration
cat > bruvtools.yml << EOF
default_provider: caprover
providers:
  caprover: 
    machine: your-caprover-machine-name
    domain: your-domain.com
projects:
  $(basename $(pwd)):
    provider: caprover
EOF

# 4. Test the setup
bruvtools services
# ✅ Should show: 📦 CapRover Services Dashboard
```

### 🆘 Troubleshooting Installation

**Command not found: bruvtools**
```bash
# Check if npm bin directory is in PATH
echo $PATH | grep npm

# Add npm bin to PATH (add to ~/.bashrc or ~/.zshrc)
export PATH="$(npm bin -g):$PATH"

# Or reinstall with sudo (if needed)
sudo npm install -g bruvtools
```

**Permission denied during installation**
```bash
# Option 1: Use npm prefix (recommended)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
npm install -g bruvtools

# Option 2: Use sudo (if necessary)
sudo npm install -g bruvtools
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

### ✅ Completed
- CapRover provider with full feature set
- Docker image optimization and caching
- Environment variable validation
- Services dashboard command
- Real-world Go application deployment
- Production-ready Dockerfile generation

### 🔄 In Progress
- Enhanced error handling and recovery
- Configuration validation and migration
- Provider health checks

### 📋 Planned
- **AWS Provider**: ECS, Lambda, App Runner support
- **GCP Provider**: Cloud Run, GKE integration  
- **Railway Provider**: Simple deployments
- **Kubernetes Provider**: Generic K8s deployments
- **CI/CD Integration**: GitHub Actions, GitLab CI templates
- **Monitoring**: Built-in metrics and alerting
- **Database Management**: Provider-agnostic database operations

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