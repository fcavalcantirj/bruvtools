# bruvtools 🚀

> **Universal Cloud Deployment CLI - Deploy Anywhere, Manage Everything**

bruvtools is a unified command-line interface that provides consistent deployment workflows across multiple cloud providers. No more vendor lock-in, no more switching between different tools - just one CLI to rule them all.

## ⚠️ Critical Setup Requirements

### Environment Variables

Before using bruvtools, you **MUST** set these environment variables:

```bash
# CapRover Authentication
export CAPROVER_PASSWORD="your_caprover_password_here"
```

**Why this matters**: Without proper environment variables, deployments will fail silently or with cryptic authentication errors. The CLI will now validate these before any API calls.

### Docker Cache Optimization

bruvtools generates optimized Dockerfiles that prevent common cache issues:

- ✅ **Layer ordering**: Dependencies are installed before copying source code
- ✅ **Alpine Linux**: Smaller images, faster builds
- ✅ **Security**: Non-root user for container execution
- ✅ **Signal handling**: Proper process management with dumb-init
- ✅ **Production optimized**: Uses `npm ci` instead of `npm install`

## 🌟 Features

- **Multi-Provider Support**: CapRover, AWS, GCP, Railway, Kubernetes (coming soon)
- **Unified Interface**: Same commands work across all providers
- **Configuration Management**: Global and project-specific configs
- **Plugin Architecture**: Easy to extend with new providers
- **Zero Vendor Lock-in**: Switch providers without changing your workflow

## 🔥 Quick Start

```bash
# Install dependencies
npm install

# Initialize in your project
./bin/bruvtools.js init

# Deploy your app
./bin/bruvtools.js deploy my-app

# Scale your app
./bin/bruvtools.js scale my-app 3

# Check logs
./bin/bruvtools.js logs my-app
```

## 📋 Commands

### Core Operations
- `bruvtools deploy <app>` - Deploy application
- `bruvtools create <app>` - Create new application
- `bruvtools delete <app>` - Delete application
- `bruvtools scale <app> <replicas>` - Scale application

### Management
- `bruvtools status <app>` - Check application status
- `bruvtools logs <app>` - View application logs
- `bruvtools test <app>` - Test application connectivity
- `bruvtools list` - List all applications

### Configuration
- `bruvtools env <app> <key> [value]` - Manage environment variables
- `bruvtools config --list` - Show current configuration
- `bruvtools config --providers` - List available providers

### Setup
- `bruvtools init` - Initialize bruvtools in current directory

## 🔧 Configuration

bruvtools uses a hierarchical configuration system:

1. **Project config** (`bruvtools.yml`) - Takes precedence
2. **Global config** (`~/.bruvtools/config.yml`) - User defaults
3. **Built-in defaults** - Fallback values

### Example Configuration

```yaml
# bruvtools.yml
default_provider: caprover

providers:
  caprover:
    machine: my-caprover-machine
    domain: example.com
  
  aws:
    region: us-east-1
    cluster: my-cluster

projects:
  my-app:
    provider: caprover
    port: 3000
    replicas: 2
```

## 🔌 Providers

### CapRover (✅ Ready)
Battle-tested provider wrapping our proven `capgen.js` functionality.

```bash
bruvtools deploy my-app --provider caprover
```

### AWS ECS (🚧 Coming Soon)
Deploy to Amazon Elastic Container Service.

### Google Cloud Run (🚧 Coming Soon)
Deploy to Google Cloud Run serverless platform.

### Railway (🚧 Coming Soon)
Deploy to Railway hosting platform.

### Kubernetes (🚧 Coming Soon)
Deploy to any Kubernetes cluster.

## 🏗️ Architecture

```
bruvtools/
├── bin/                 # Executable entry point
├── lib/
│   ├── core/           # Core CLI logic
│   │   ├── cli.js      # Main CLI interface
│   │   └── config.js   # Configuration management
│   └── providers/      # Provider implementations
│       ├── base.js     # Base provider class
│       ├── caprover/   # CapRover provider
│       ├── aws/        # AWS provider (coming soon)
│       └── gcp/        # GCP provider (coming soon)
└── config/             # Configuration templates
```

## 🚀 Development

### Adding a New Provider

1. Create provider directory: `lib/providers/myprovider/`
2. Implement provider class extending `BaseProvider`
3. Register in `lib/core/cli.js`

```javascript
// lib/providers/myprovider/index.js
const BaseProvider = require('../base');

class MyProvider extends BaseProvider {
  async deploy(appName, options) {
    // Implementation
  }
  
  // ... implement other required methods
}

module.exports = MyProvider;
```

### Running Tests

```bash
npm test
```

## 💡 Why bruvtools?

**The Problem**: Every cloud provider has different tools, APIs, and workflows. Switching providers means relearning everything and rewriting deployment scripts.

**The Solution**: bruvtools provides a unified interface that abstracts away provider-specific differences while leveraging proven, battle-tested implementations.

**The Result**: 
- 🎯 Consistent workflow across all providers
- 🔄 Easy provider switching
- 📈 Reduced learning curve
- 🛡️ No vendor lock-in

## 🤝 Contributing

We welcome contributions! See our roadmap for planned providers and features.

### Roadmap
- [ ] AWS ECS Provider
- [ ] Google Cloud Run Provider  
- [ ] Railway Provider
- [ ] Kubernetes Provider
- [ ] Interactive deployment wizard
- [ ] Deployment templates
- [ ] Multi-environment support

## 📄 License

MIT License - see LICENSE file for details.

## 🙋‍♂️ Support

- 📖 Documentation: [bruvtools.dev](https://bruvtools.dev)
- 🐛 Issues: [GitHub Issues](https://github.com/bruvtools/bruvtools/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/bruvtools/bruvtools/discussions)

---

**Made with ❤️ by the bruvtools team** 