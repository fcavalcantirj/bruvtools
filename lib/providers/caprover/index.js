const BaseProvider = require('../base');
const { spawn } = require('child_process');
const path = require('path');
const chalk = require('chalk');

/**
 * CapRover Provider
 * Wraps our battle-tested capgen.js functionality
 */
class CapRoverProvider extends BaseProvider {
  constructor(config = {}) {
    super(config);
    this.capgenPath = path.join(__dirname, 'capgen.js');
    this.machine = config.machine;
    this.domain = config.domain;
  }

  async runCapgen(args) {
    return new Promise((resolve, reject) => {
      this.log(`Running: node capgen.js ${args.join(' ')}`);
      
      const proc = spawn('node', [this.capgenPath, ...args], { 
        stdio: 'inherit',
        cwd: __dirname,
        env: { 
          ...process.env, 
          CAPROVER_DOMAIN: this.domain 
        }
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
      const args = ['quick-deploy', appName, '--machine', this.machine];
      
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
      const args = ['create', appName, '--machine', this.machine];
      
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
      await this.runCapgen(['delete', appName, '--machine', this.machine]);
      this.log(`App "${appName}" deleted successfully!`, 'success');
      
      return { success: true };
    } catch (err) {
      this.log(`App deletion failed: ${err.message}`, 'error');
      throw err;
    }
  }

  async scale(appName, replicas, options = {}) {
    try {
      await this.runCapgen(['scale', appName, replicas.toString(), '--machine', this.machine]);
      this.log(`App "${appName}" scaled to ${replicas} replicas!`, 'success');
      
      return { success: true };
    } catch (err) {
      this.log(`Scaling failed: ${err.message}`, 'error');
      throw err;
    }
  }

  async restart(appName, options = {}) {
    try {
      await this.runCapgen(['restart', appName, '--machine', this.machine]);
      this.log(`App "${appName}" restarted successfully!`, 'success');
      
      return { success: true };
    } catch (err) {
      this.log(`Restart failed: ${err.message}`, 'error');
      throw err;
    }
  }

  async setEnv(appName, key, value, options = {}) {
    try {
      await this.runCapgen(['env', appName, key, value, '--machine', this.machine]);
      this.log(`Environment variable ${key} set successfully!`, 'success');
      
      return { success: true };
    } catch (err) {
      this.log(`Failed to set environment variable: ${err.message}`, 'error');
      throw err;
    }
  }

  async logs(appName, options = {}) {
    try {
      const args = ['logs', appName, '--machine', this.machine];
      
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
      await this.runCapgen(['status', appName, '--machine', this.machine]);
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

  async services(options = {}) {
    try {
      console.log(chalk.green('📦 CapRover Services Dashboard'));
      console.log(chalk.gray('   Connected to: ') + chalk.cyan(this.machine));
      console.log(chalk.gray('   Domain: ') + chalk.cyan(this.domain));
      console.log(chalk.gray('   Dashboard: ') + chalk.blue(`https://captain.${this.domain}`));
      
      console.log(chalk.yellow('\n🔍 Known Services:'));
      console.log(chalk.gray('   Based on our deployment history, you may have these services:'));
      
      // Show some known services based on common patterns
      const knownServices = [
        { name: 'hello-world', url: `https://hello-world.${this.domain}`, description: 'Test application' },
        { name: 'cnpj-enricher', url: `https://cnpj-enricher.${this.domain}`, description: 'Brazilian company data API', api: '/ficha?cnpj=XXXXXXX' },
        { name: 'kommo-final', url: `https://kommo-final.${this.domain}`, description: 'Kommo integration service' },
        { name: 'kommo-bruvtools', url: `https://kommo-bruvtools.${this.domain}`, description: 'Kommo service deployed with bruvtools' }
      ];
      
      knownServices.forEach((service, index) => {
        console.log(chalk.green(`   📦 ${service.name}`));
        console.log(`      URL: ${chalk.blue(service.url)}`);
        if (service.api) {
          console.log(`      API: ${chalk.blue(service.url + service.api)}`);
        }
        console.log(`      Description: ${chalk.gray(service.description)}`);
        if (index < knownServices.length - 1) console.log('');
      });
      
      console.log(chalk.cyan('\n💡 For real-time service status and management:'));
      console.log(chalk.gray('   • Visit the CapRover dashboard: ') + chalk.blue(`https://captain.${this.domain}`));
      console.log(chalk.gray('   • Use individual commands: ') + chalk.yellow('bruvtools status <app-name>'));
      console.log(chalk.gray('   • Deploy new services: ') + chalk.yellow('bruvtools deploy <app-name>'));
      
      return { success: true };
    } catch (err) {
      this.log(`Failed to get services: ${err.message}`, 'error');
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