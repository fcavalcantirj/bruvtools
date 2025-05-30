const BaseProvider = require('../base');
const { spawn } = require('child_process');
const path = require('path');

/**
 * CapRover Provider
 * Wraps our battle-tested capgen.js functionality
 */
class CapRoverProvider extends BaseProvider {
  constructor(config = {}) {
    super(config);
    this.capgenPath = path.join(__dirname, 'capgen.js');
    this.machine = config.machine || 'caprover1133onubuntu2204-s-1vcpu-2gb-amd-sfo3-01';
    this.domain = config.domain || 'bruvbot.com.br';
  }

  async runCapgen(args) {
    return new Promise((resolve, reject) => {
      this.log(`Running: node capgen.js ${args.join(' ')}`);
      
      const proc = spawn('node', [this.capgenPath, ...args], { 
        stdio: 'inherit',
        cwd: __dirname
      });

      proc.on('error', (err) => {
        this.log(`Process error: ${err.message}`, 'error');
        reject(err);
      });

      proc.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Process exited with code ${code}`));
          return;
        }
        resolve();
      });
    });
  }

  async deploy(appName, options = {}) {
    try {
      const args = ['quick-deploy', appName];
      
      if (options.dir) {
        args.push('--dir', options.dir);
      }
      
      if (options.port && options.port !== '80') {
        args.push('--port', options.port);
      }
      
      if (options.scale && options.scale !== '1') {
        args.push('--scale', options.scale);
      }

      await this.runCapgen(args);
      
      const url = this.getAppUrl(appName);
      this.log(`App deployed successfully!`, 'success');
      this.log(`Available at: ${url}`);
      
      return { success: true, url };
    } catch (err) {
      this.log(`Deployment failed: ${err.message}`, 'error');
      throw err;
    }
  }

  async create(appName, options = {}) {
    try {
      const args = ['create', appName];
      
      if (options.persistent) {
        args.push('--persistent');
      }

      await this.runCapgen(args);
      this.log(`App "${appName}" created successfully!`, 'success');
      
      return { success: true };
    } catch (err) {
      this.log(`App creation failed: ${err.message}`, 'error');
      throw err;
    }
  }

  async delete(appName, options = {}) {
    try {
      await this.runCapgen(['delete', appName]);
      this.log(`App "${appName}" deleted successfully!`, 'success');
      
      return { success: true };
    } catch (err) {
      this.log(`App deletion failed: ${err.message}`, 'error');
      throw err;
    }
  }

  async scale(appName, replicas, options = {}) {
    try {
      await this.runCapgen(['scale', appName, replicas.toString()]);
      this.log(`App "${appName}" scaled to ${replicas} replicas!`, 'success');
      
      return { success: true };
    } catch (err) {
      this.log(`Scaling failed: ${err.message}`, 'error');
      throw err;
    }
  }

  async restart(appName, options = {}) {
    try {
      await this.runCapgen(['restart', appName]);
      this.log(`App "${appName}" restarted successfully!`, 'success');
      
      return { success: true };
    } catch (err) {
      this.log(`Restart failed: ${err.message}`, 'error');
      throw err;
    }
  }

  async setEnv(appName, key, value, options = {}) {
    try {
      await this.runCapgen(['env', appName, key, value]);
      this.log(`Environment variable ${key} set successfully!`, 'success');
      
      return { success: true };
    } catch (err) {
      this.log(`Failed to set environment variable: ${err.message}`, 'error');
      throw err;
    }
  }

  async logs(appName, options = {}) {
    try {
      const args = ['logs', appName];
      
      if (options.follow) {
        args.push('--follow');
      }

      await this.runCapgen(args);
      return { success: true };
    } catch (err) {
      this.log(`Failed to fetch logs: ${err.message}`, 'error');
      throw err;
    }
  }

  async status(appName, options = {}) {
    try {
      await this.runCapgen(['status', appName]);
      return { success: true };
    } catch (err) {
      this.log(`Failed to get status: ${err.message}`, 'error');
      throw err;
    }
  }

  async test(appName, options = {}) {
    try {
      const args = ['test', appName];
      
      if (options.https) {
        args.push('--https');
      }
      
      if (options.url) {
        args.push('--url', options.url);
      }

      await this.runCapgen(args);
      return { success: true };
    } catch (err) {
      this.log(`Test failed: ${err.message}`, 'error');
      throw err;
    }
  }

  async list(options = {}) {
    try {
      await this.runCapgen(['list']);
      return { success: true };
    } catch (err) {
      this.log(`Failed to list apps: ${err.message}`, 'error');
      throw err;
    }
  }

  getAppUrl(appName) {
    return `https://${appName}.${this.domain}`;
  }

  async validate() {
    try {
      this.log('Validating CapRover configuration...');
      
      // Check if capgen.js exists
      const fs = require('fs');
      if (!fs.existsSync(this.capgenPath)) {
        throw new Error('capgen.js not found');
      }
      
      // Try to run a simple command
      await this.runCapgen(['list']);
      
      this.log('CapRover provider configuration is valid!', 'success');
      return true;
    } catch (err) {
      this.log(`CapRover validation failed: ${err.message}`, 'error');
      return false;
    }
  }
}

module.exports = CapRoverProvider; 