# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.11] - 2025-06-01

### 🚀 Major UX Improvements - "Deploy with Confidence"

**Enhanced Developer Experience:**
- ✅ **Post-Deployment Health Verification**: Automatically checks instance count and app responsiveness after deployment
- ✅ **Auto-Healing**: Detects instance count = 0 and automatically scales to 1 instance
- ✅ **Port Mismatch Detection**: Security check now detects server.js vs Dockerfile EXPOSE port conflicts
- ✅ **Enhanced Error Messages**: Deploy failures now show actionable debugging checklist
- ✅ **Improved Services Dashboard**: Instance count = 0 highlighted as CRITICAL with fix command

**Technical Improvements:**
- Added `verifyDeploymentHealth()` function to quick-deploy workflow
- Enhanced security check with port validation between server.js and Dockerfile
- Improved services command with color-coded warnings and fix suggestions
- Better error handling with specific debugging guidance
- Automatic instance scaling when deployment health check fails

**Developer Impact:**
- Transforms deployment experience from "deploy and pray" to "deploy with confidence"
- Reduces debugging time with proactive issue detection and auto-fixes
- Clearer feedback on deployment status and health
- Actionable guidance when things go wrong

## [0.2.10] - 2025-05-31

### 🚀 Major Features
- **Complete deployment system overhaul** - Full end-to-end deployment now works perfectly
- **Smart app existence checking** - Automatically checks if apps exist before deployment
- **Auto-creation with collision detection** - Creates apps automatically with smart naming (app-1, app-2, etc.)
- **Clean deployment messaging** - Fixed confusing error/success message patterns

### ✅ Fixed
- **Critical deployment bug** - Fixed `cwd: __dirname` issue that caused "Captain Definition file does not exist" errors
- **App existence validation** - Deploy command now properly checks if apps exist before attempting deployment
- **Message duplication** - Eliminated duplicate success/error messages during deployment
- **Working directory context** - Fixed capgen.js to run from project directory instead of library directory

### 🔧 Improved
- **Step-by-step deployment progress** - Clear progress indicators during deployment process
- **Error handling** - Better error messages and recovery suggestions
- **Captain-definition formatting** - Standardized to single-line JSON format
- **Example project structure** - Updated hello-world example with proper Dockerfile and configuration

### 🧪 Tested
- **End-to-end deployment** - Verified complete deployment workflow works
- **Collision detection** - Tested automatic app naming with suffixes
- **Multiple environments** - Confirmed deployment to different app names works
- **Live examples** - All deployed apps are live and accessible

## [0.2.9] - 2024-12-18

### ✅ Fixed
- **Windows PowerShell compatibility** - Fixed spawn errors on Windows systems
- **CapRover CLI validation** - Added validation during `bruvtools init` to prevent deployment issues

### 🔧 Improved
- **Cross-platform support** - Better handling of different shell environments
- **Setup validation** - Checks for required dependencies during initialization

## [0.2.8] - 2024-12-17

### 🚀 Features
- **Interactive setup** - Added `bruvtools init` command for easy configuration
- **Services dashboard** - Added `bruvtools services` to view all deployed apps
- **App management** - Added `bruvtools create`, `bruvtools status`, `bruvtools test` commands

### 🔧 Improved
- **Configuration management** - Automatic creation of bruvtools.yml and .env files
- **CapRover integration** - Better integration with CapRover API
- **Error handling** - Improved error messages and user guidance

## [0.2.7] - 2024-12-16

### 🚀 Features
- **CapRover provider** - Initial implementation of CapRover deployment provider
- **Multi-language support** - Auto-detection for Node.js, Go, Python, Java, PHP, Ruby
- **Docker support** - Support for custom Dockerfiles

### 🔧 Improved
- **CLI interface** - Better command structure and help system
- **Configuration** - YAML-based configuration system

## [0.2.6] - 2024-12-15

### 🚀 Features
- **Initial release** - Basic CLI structure and provider system
- **Universal deployment concept** - Foundation for multi-cloud deployment tool

### 🔧 Technical
- **Commander.js integration** - CLI framework setup
- **Provider architecture** - Extensible provider system for different cloud platforms
- **Configuration system** - Basic configuration management

---

## Live Examples

All versions are tested with live deployments:

- **v0.2.10**: [hello-world-fixed.bruvbot.com.br](http://hello-world-fixed.bruvbot.com.br)
- **v0.2.10**: [hello-world-fixed-1.bruvbot.com.br](http://hello-world-fixed-1.bruvbot.com.br)
- **Production API**: [cnpj-enricher.bruvbot.com.br](http://cnpj-enricher.bruvbot.com.br)

## Contributing

See our [Contributing Guidelines](CONTRIBUTING.md) for information on how to contribute to this project.

## Support

- **Issues**: [GitHub Issues](https://github.com/fcavalcantirj/bruvtools/issues)
- **Documentation**: [GitHub Wiki](https://github.com/fcavalcantirj/bruvtools/wiki)
- **Email**: felipecavalcantirj@gmail.com 