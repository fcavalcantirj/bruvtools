# Contributing to bruvtools 🚀

Thank you for your interest in contributing to bruvtools! This project follows the **"Never Give Up!"** motto - we believe in persistence, thorough testing, and making deployment simple for everyone.

## 🎯 Project Vision

bruvtools aims to be the **universal deployment CLI** that works with any language, any cloud provider, with zero vendor lock-in. We want developers to deploy microservices as easily as running `bruvtools deploy my-app`.

## 🤝 How to Contribute

### 1. Types of Contributions

We welcome all types of contributions:

- 🐛 **Bug fixes** - Help us squash deployment issues
- ✨ **New features** - Add support for new cloud providers or languages
- 📚 **Documentation** - Improve README, add examples, write guides
- 🧪 **Testing** - Add tests, verify deployments work across platforms
- 🔧 **Improvements** - Performance, UX, error handling enhancements

### 2. Getting Started

```bash
# Fork and clone the repository
git clone https://github.com/YOUR-USERNAME/bruvtools.git
cd bruvtools

# Install dependencies
npm install

# Link for local development
npm link

# Test the CLI
bruvtools --version  # Should show your local version
```

### 3. Development Workflow

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes
# ... code, test, iterate ...

# Test thoroughly (this is critical!)
cd examples/hello-world
bruvtools deploy test-your-feature

# Commit with clear messages
git commit -m "feat: add support for XYZ provider"

# Push and create PR
git push origin feature/your-feature-name
```

## 🧪 Testing Guidelines

**Testing is CRITICAL** - bruvtools deploys real applications to real servers. Follow these guidelines:

### 1. Test Locally First
```bash
# Always test the example app locally
cd examples/hello-world
node server.js &
curl http://localhost:3000  # Should work
kill %1
```

### 2. Test Full Deployment
```bash
# Test complete deployment workflow
bruvtools init  # Configure with test settings
bruvtools deploy test-app-$(date +%s)  # Use unique names
```

### 3. Verify Live Deployment
```bash
# Always verify the deployed app works
curl http://your-test-app.your-domain.com
# Should return expected response
```

### 4. Clean Up Test Apps
```bash
# Remove test apps after testing
# (Document cleanup steps for your provider)
```

## 📋 Code Standards

### 1. Code Style
- Use **clear, descriptive variable names**
- Add **comments for complex logic**
- Follow **existing code patterns**
- Use **async/await** instead of callbacks

### 2. Error Handling
```javascript
// ✅ Good - Clear error messages with recovery suggestions
throw new Error(`App "${appName}" does not exist. Create it first with: bruvtools create ${appName}`);

// ❌ Bad - Vague error messages
throw new Error('App not found');
```

### 3. User Experience
```javascript
// ✅ Good - Step-by-step progress
console.log('Step 1: Checking if app exists...');
console.log('Step 2: Creating deployment package...');
console.log('✅ App deployed successfully!');

// ❌ Bad - Silent or confusing output
console.log('Done');
```

## 🏗️ Architecture Guidelines

### 1. Provider Pattern
All cloud providers should follow the same interface:

```javascript
class YourProvider {
  async init(config) { /* Setup provider */ }
  async createApp(appName) { /* Create app */ }
  async deployApp(appName, packagePath) { /* Deploy app */ }
  async getAppStatus(appName) { /* Get status */ }
  async getAppLogs(appName) { /* Get logs */ }
}
```

### 2. Configuration
- Use `bruvtools.yml` for project settings
- Use `.env` for secrets (never commit!)
- Support environment variable overrides

### 3. CLI Commands
- Keep commands simple and intuitive
- Provide helpful error messages
- Support `--help` for all commands

## 🐛 Bug Reports

When reporting bugs, include:

1. **bruvtools version**: `bruvtools --version`
2. **Operating system**: Windows/Mac/Linux
3. **Node.js version**: `node --version`
4. **Steps to reproduce**
5. **Expected vs actual behavior**
6. **Full error output** (use code blocks)

## ✨ Feature Requests

For new features, please:

1. **Check existing issues** first
2. **Describe the use case** - why is this needed?
3. **Propose the interface** - how should it work?
4. **Consider alternatives** - are there other ways to solve this?

## 🚀 Adding New Cloud Providers

To add support for a new cloud provider:

### 1. Create Provider Class
```bash
# Create new provider file
touch lib/providers/your-provider/index.js
```

### 2. Implement Required Methods
```javascript
// lib/providers/your-provider/index.js
class YourProvider {
  async init(config) {
    // Initialize provider with config
  }
  
  async createApp(appName) {
    // Create app on your platform
  }
  
  async deployApp(appName, packagePath) {
    // Deploy app package
  }
  
  // ... other required methods
}

module.exports = YourProvider;
```

### 3. Register Provider
```javascript
// lib/core/providers.js
const providers = {
  caprover: require('../providers/caprover'),
  yourprovider: require('../providers/your-provider'),  // Add this line
};
```

### 4. Add Configuration Support
```javascript
// Update lib/core/config.js to support your provider's settings
```

### 5. Test Thoroughly
- Test app creation
- Test deployment
- Test status checking
- Test with different app types
- Document any provider-specific requirements

## 📚 Documentation

When adding features:

1. **Update README.md** with new commands/options
2. **Add examples** in `examples/` directory
3. **Update CHANGELOG.md** with your changes
4. **Add inline code comments** for complex logic

## 🔄 Pull Request Process

1. **Fork the repository**
2. **Create a feature branch** from `main`
3. **Make your changes** following the guidelines above
4. **Test thoroughly** - this cannot be overstated!
5. **Update documentation** as needed
6. **Submit pull request** with clear description

### PR Description Template
```markdown
## What does this PR do?
Brief description of the changes

## How to test?
Step-by-step testing instructions

## Checklist
- [ ] Tested locally
- [ ] Tested full deployment
- [ ] Updated documentation
- [ ] Added/updated tests
- [ ] Follows code standards
```

## 🏆 Recognition

Contributors will be:
- **Listed in README.md** contributors section
- **Mentioned in CHANGELOG.md** for their contributions
- **Credited in release notes**

## 💬 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and ideas
- **Email**: felipecavalcantirj@gmail.com for direct contact

## 🎯 Current Priorities

Help us with these high-priority items:

1. **AWS Provider** - Add support for AWS deployment
2. **GCP Provider** - Add support for Google Cloud Platform
3. **Railway Provider** - Add support for Railway.app
4. **Kubernetes Provider** - Add support for Kubernetes clusters
5. **Testing Framework** - Add automated testing suite
6. **CI/CD Pipeline** - Add GitHub Actions for testing

## 📜 Code of Conduct

- **Be respectful** and inclusive
- **Help others learn** - we're all here to grow
- **Test thoroughly** - broken deployments affect real users
- **Document your work** - help others understand your changes
- **Never give up!** - persistence leads to great solutions

---

**Remember**: Every contribution, no matter how small, makes bruvtools better for developers worldwide. Thank you for being part of this journey! 🚀 