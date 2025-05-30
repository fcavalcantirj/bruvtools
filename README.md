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

## 🏗️ Deploy Your Existing Projects

Got a real project with proper dependencies, builds, and tests? Here's how to deploy it with bruvtools:

### 📁 Project Structure Examples

**Node.js/Express API** (`~/my-projects/expense-tracker-api/`)
```
expense-tracker-api/
├── package.json          # Dependencies: express, prisma, joi
├── package-lock.json      # Lock file for reproducible builds  
├── src/
│   ├── server.js         # Main server file
│   ├── routes/           # API routes
│   └── models/           # Database models
├── prisma/
│   └── schema.prisma     # Database schema
├── tests/                # Jest test suite
├── .env.example          # Environment template
└── Dockerfile            # Optional: custom Docker setup
```

**Go REST API** (`~/my-projects/user-management-go/`)
```
user-management-go/
├── go.mod                # Go dependencies
├── go.sum                # Dependency checksums
├── main.go               # Entry point
├── internal/
│   ├── handlers/         # HTTP handlers  
│   ├── models/           # Data models
│   └── database/         # DB connection
├── migrations/           # Database migrations
├── tests/                # Unit tests
└── Makefile              # Build automation
```

**Python FastAPI** (`~/my-projects/ml-prediction-service/`)
```
ml-prediction-service/
├── requirements.txt      # Python dependencies
├── requirements-dev.txt  # Development dependencies
├── main.py              # FastAPI application
├── app/
│   ├── models/          # Pydantic models
│   ├── routers/         # API routes
│   └── services/        # Business logic
├── tests/               # Pytest test suite
├── alembic/             # Database migrations
└── docker-compose.yml   # Local development
```

### 🚀 Deploy Existing Projects

#### 1. Navigate to Your Project
```bash
# Go to your existing, well-structured project
cd ~/my-projects/expense-tracker-api

# Verify it's properly set up
ls -la  # Should see package.json, src/, tests/, etc.
npm test  # Run tests to ensure everything works
```

#### 2. Initialize bruvtools
```bash
# Interactive setup in your project directory
bruvtools init

# It will ask:
# ✅ Provider: CapRover (recommended)
# ✅ Machine: your-caprover-server
# ✅ Domain: your-domain.com  
# ✅ Password: (secure input)
# ✅ Project name: expense-tracker-api
# ✅ Port: 3000 (or your app's port)
# ✅ Environment variables: DATABASE_URL, JWT_SECRET, etc.
```

#### 3. Build & Deploy
```bash
# bruvtools handles everything automatically:
bruvtools deploy expense-tracker-api

# What happens:
# 🔍 Detects: Node.js project (package.json found)
# 📦 Builds: npm install, npm run build (if available)
# 🐳 Dockerizes: Optimized multi-stage Dockerfile
# 🚀 Deploys: To CapRover with your settings
# 🌐 URL: https://expense-tracker-api.your-domain.com
```

#### 4. Test Deployment
```bash
# Check status
bruvtools services

# Test endpoints
curl https://expense-tracker-api.your-domain.com/health
curl https://expense-tracker-api.your-domain.com/api/expenses

# View logs
bruvtools logs expense-tracker-api --follow

# Check specific app status  
bruvtools status expense-tracker-api
```

### 🔧 Advanced Project Deployment

#### Go Project with Custom Build
```bash
cd ~/my-projects/user-management-go

# Ensure proper Go setup
go mod tidy
go test ./...
go build -o main .

# Deploy with custom settings
bruvtools deploy user-management --port 8080

# bruvtools auto-detects:
# 📦 Go modules (go.mod found)
# 🔨 Build: go build with optimizations
# 🐳 Alpine-based Docker image  
# ⚡ Efficient binary deployment
```

#### Python with Dependencies
```bash
cd ~/my-projects/ml-prediction-service

# Verify Python setup
pip install -r requirements.txt
python -m pytest tests/
python main.py  # Test locally

# Deploy
bruvtools deploy ml-service --port 8000

# Auto-handled:
# 🐍 Python environment setup
# 📦 pip install requirements.txt
# 🧪 Optional: run tests before deploy
# 🚀 Uvicorn server configuration
```

#### Complex Project with Database
```bash
cd ~/my-projects/expense-tracker-api

# Set database environment
bruvtools env expense-tracker-api DATABASE_URL "postgresql://user:pass@db:5432/expenses"
bruvtools env expense-tracker-api REDIS_URL "redis://redis:6379"
bruvtools env expense-tracker-api JWT_SECRET "your-super-secret-key"

# Deploy with all dependencies
bruvtools deploy expense-tracker-api

# Scale for production
bruvtools scale expense-tracker-api 3
```

### 📊 Real-World Deployment Examples

#### SaaS Application Stack
```bash
# Deploy multiple related services
cd ~/my-saas-project/

# API Backend
cd api/
bruvtools deploy saas-api --port 3000

# Frontend  
cd ../frontend/
bruvtools deploy saas-web --port 80

# Worker Service
cd ../workers/
bruvtools deploy saas-workers --port 3001

# Check all services
bruvtools services
# Result:
# 📦 saas-api: https://saas-api.your-domain.com
# 📦 saas-web: https://saas-web.your-domain.com  
# 📦 saas-workers: https://saas-workers.your-domain.com
```

#### Microservices Architecture
```bash
# Deploy each microservice independently
bruvtools deploy auth-service --dir ./auth --port 3001
bruvtools deploy payment-service --dir ./payments --port 3002  
bruvtools deploy notification-service --dir ./notifications --port 3003
bruvtools deploy user-service --dir ./users --port 3004

# Scale critical services
bruvtools scale payment-service 5
bruvtools scale auth-service 3
```

### 🎯 Pro Tips for Existing Projects

#### Optimize for Production
```bash
# Set production environment
bruvtools env my-app NODE_ENV production
bruvtools env my-app DEBUG false

# Configure resource limits (in bruvtools.yml)
# projects:
#   my-app:
#     resources:
#       memory: "512Mi"
#       cpu: "500m"
```

#### Database Migrations
```bash
# Deploy with database setup
bruvtools deploy my-app
bruvtools env my-app RUN_MIGRATIONS true

# Or run migrations separately  
bruvtools logs my-app | grep migration
```

#### Zero-Downtime Deployment
```bash
# Deploy new version while keeping old running
bruvtools deploy my-app --strategy rolling

# Health check before switching traffic
bruvtools test my-app --health-check /health
```

### 📋 Project Checklist

Before deploying your existing project, ensure you have:

✅ **Dependencies**: `package.json`, `go.mod`, `requirements.txt`, etc.  
✅ **Build Scripts**: `npm run build`, `make build`, or similar  
✅ **Environment Template**: `.env.example` with required variables  
✅ **Health Endpoint**: `/health` or `/ping` for monitoring  
✅ **Tests**: Unit tests that pass (`npm test`, `go test`, `pytest`)  
✅ **Port Configuration**: Respects `PORT` environment variable  
✅ **Production Ready**: Error handling, logging, graceful shutdown  

**💡 Recommendation**: Start with a well-structured project that already works locally with proper dependency management, build processes, and tests. bruvtools will handle the rest! 🚀

## 🔨 Build & Package Process

bruvtools automatically handles building and packaging based on your project type:

### 📦 Auto-Detection & Build

**Node.js Projects**
```bash
# bruvtools automatically runs:
npm install                    # Install dependencies
npm run build                  # If build script exists
npm test                       # Optional: run tests
# Then packages into optimized Docker image
```

**Go Projects** 
```bash
# Auto-build process:
go mod download               # Download dependencies  
go build -ldflags="-w -s" .  # Optimized binary build
# Creates minimal Alpine-based container
```

**Python Projects**
```bash
# Build process:
pip install -r requirements.txt  # Install dependencies
python -m pytest                # Run tests (if available)
# Packages with Python runtime
```

### 🗜️ Custom Build & Archive

For complex projects with custom build processes:

```bash
# Create build archive manually (optional)
cd ~/my-projects/complex-app

# Build your project locally
npm run build:production
go build -o dist/app .
make build-optimized

# Create deployment archive
tar -czf app-v1.2.3.tar.gz dist/ config/ migrations/

# Deploy from archive
bruvtools deploy my-app --archive app-v1.2.3.tar.gz
```

### ⚙️ Custom Build Configuration

Create `bruvtools.build.js` for custom build steps:

```javascript
module.exports = {
  // Pre-build steps
  prebuild: [
    "npm run lint",
    "npm run test:unit", 
    "npm run generate-docs"
  ],
  
  // Build command (overrides default)
  build: "npm run build:production",
  
  // Post-build optimization
  postbuild: [
    "npm run optimize",
    "rm -rf src/ tests/ docs/"  // Remove dev files
  ],
  
  // Files to include in deployment
  include: ["dist/", "package.json", "config/"],
  
  // Files to exclude  
  exclude: ["*.test.js", "coverage/", ".env.local"]
};
```

### 🚀 Advanced Build Examples

**Multi-Stage Build (Automatic)**
```bash
# bruvtools creates optimized multi-stage Dockerfile:

# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Runtime  
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

**Custom Docker Build**
```bash
# If you have existing Dockerfile, bruvtools uses it:
cd ~/my-projects/my-app

# Your custom Dockerfile will be respected
# bruvtools deploy my-app  # Uses your Dockerfile

# Or specify different Dockerfile
bruvtools deploy my-app --dockerfile Dockerfile.production
```

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
