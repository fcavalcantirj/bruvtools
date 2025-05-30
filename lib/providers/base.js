/**
 * Base Provider Class
 * All cloud providers must extend this class and implement these methods
 */
class BaseProvider {
  constructor(config = {}) {
    this.config = config;
    this.name = this.constructor.name.replace('Provider', '').toLowerCase();
  }

  // Core deployment operations
  async deploy(appName, options = {}) {
    throw new Error(`${this.name} provider must implement deploy()`);
  }

  async create(appName, options = {}) {
    throw new Error(`${this.name} provider must implement create()`);
  }

  async delete(appName, options = {}) {
    throw new Error(`${this.name} provider must implement delete()`);
  }

  // Scaling and management
  async scale(appName, replicas, options = {}) {
    throw new Error(`${this.name} provider must implement scale()`);
  }

  async restart(appName, options = {}) {
    throw new Error(`${this.name} provider must implement restart()`);
  }

  // Environment and configuration
  async setEnv(appName, key, value, options = {}) {
    throw new Error(`${this.name} provider must implement setEnv()`);
  }

  async getEnv(appName, key = null, options = {}) {
    throw new Error(`${this.name} provider must implement getEnv()`);
  }

  // Monitoring and logs
  async logs(appName, options = {}) {
    throw new Error(`${this.name} provider must implement logs()`);
  }

  async status(appName, options = {}) {
    throw new Error(`${this.name} provider must implement status()`);
  }

  async test(appName, options = {}) {
    throw new Error(`${this.name} provider must implement test()`);
  }

  // List operations
  async list(options = {}) {
    throw new Error(`${this.name} provider must implement list()`);
  }

  // Utility methods (can be overridden)
  async validate() {
    console.log(`✅ ${this.name} provider configuration is valid`);
    return true;
  }

  getAppUrl(appName) {
    return `https://${appName}.${this.config.domain || 'localhost'}`;
  }

  log(message, type = 'info') {
    const prefix = `[${this.name.toUpperCase()}]`;
    switch (type) {
      case 'error':
        console.error(`❌ ${prefix} ${message}`);
        break;
      case 'success':
        console.log(`✅ ${prefix} ${message}`);
        break;
      case 'warn':
        console.warn(`⚠️  ${prefix} ${message}`);
        break;
      default:
        console.log(`ℹ️  ${prefix} ${message}`);
    }
  }
}

module.exports = BaseProvider; 