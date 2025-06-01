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
        cwd: process.cwd(),
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

      if (options.skipSecurityCheck) {
        args.push('--skip-security-check');
      }

      await this.runCapgen(args);
      
      const url = this.getAppUrl(appName);
      // Don't duplicate success messages - capgen already shows them
      
      return { success: true, url };
    } catch (err) {
      // Only show error if it's not already shown by capgen
      if (!err.message.includes('Quick deployment failed')) {
        this.log(`Deployment failed: ${err.message}`, 'error');
      }
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
      
      // Get real apps from CapRover API
      console.log(chalk.yellow('\n🔍 Deployed Services:'));
      console.log(chalk.gray('   Fetching live data from CapRover...'));
      
      try {
        const { spawn } = require('child_process');
        const isWindows = process.platform === 'win32';
        
        const checkProcess = spawn('caprover', [
          'api',
          '--caproverName', this.machine,
          '--path', '/user/apps/appDefinitions',
          '--method', 'GET',
          '--data', '{}'
        ], { 
          stdio: ['inherit', 'pipe', 'pipe'],
          shell: isWindows 
        });
        
        let stdout = '';
        let stderr = '';
        
        checkProcess.stdout.on('data', (data) => {
          stdout += data.toString();
        });
        
        checkProcess.stderr.on('data', (data) => {
          stderr += data.toString();
        });
        
        const apps = await new Promise((resolve, reject) => {
          checkProcess.on('close', (code) => {
            if (code !== 0) {
              reject(new Error(`Failed to fetch apps: ${stderr}`));
              return;
            }
            
            try {
              // Extract JSON from the output (CapRover CLI adds extra text)
              const jsonMatch = stdout.match(/\{[\s\S]*\}/);
              if (!jsonMatch) {
                resolve([]);
                return;
              }
              
              const response = JSON.parse(jsonMatch[0]);
              const appDefinitions = response.appDefinitions || [];
              resolve(appDefinitions);
            } catch (parseErr) {
              resolve([]);
            }
          });
        });
        
        if (apps.length === 0) {
          console.log(chalk.gray('   📭 No apps deployed yet'));
          console.log(chalk.gray('   💡 Deploy your first app with: ') + chalk.yellow('bruvtools deploy <app-name>'));
        } else {
          console.log(chalk.green(`   ✅ Found ${apps.length} deployed app${apps.length === 1 ? '' : 's'}:\n`));
          console.log(chalk.gray('   🔍 Checking app health...'));
          
          // Helper function to check app health
          const checkAppHealth = async (url) => {
            return new Promise((resolve) => {
              const { spawn } = require('child_process');
              const curlProcess = spawn('curl', [
                '-s',
                '--max-time', '5',
                '--connect-timeout', '3',
                url
              ], { stdio: ['ignore', 'pipe', 'ignore'] });
              
              let output = '';
              curlProcess.stdout.on('data', (data) => {
                output += data.toString();
              });
              
              curlProcess.on('close', (code) => {
                if (code !== 0) {
                  resolve('timeout');
                  return;
                }
                
                // Check for CapRover placeholder page
                if (output.includes('Your app will be here!') || 
                    output.includes('Go ahead and deploy your app now!') ||
                    output.includes('Powered by CapRover')) {
                  resolve('not-deployed');
                  return;
                }
                
                // Check for CapRover 502 error page
                if (output.includes('NGINX 502 Error') || 
                    output.includes('502 Bad Gateway')) {
                  resolve('502-error');
                  return;
                }
                
                // Check for other error pages
                if (output.includes('404') || output.includes('Not Found')) {
                  resolve('not-found');
                  return;
                }
                
                // If we get here and have content, it's likely healthy
                if (output.trim().length > 0) {
                  resolve('healthy');
                } else {
                  resolve('empty-response');
                }
              });
              
              // Timeout after 5 seconds
              setTimeout(() => {
                curlProcess.kill();
                resolve('timeout');
              }, 5000);
            });
          };
          
          // Check health for all apps in parallel
          const healthChecks = apps.map(async (app) => {
            const appName = app.appName;
            const isHttps = app.forceSsl || app.hasDefaultSubDomainSsl;
            const protocol = isHttps ? 'https' : 'http';
            const url = `${protocol}://${appName}.${this.domain}`;
            
            const health = await checkAppHealth(url);
            return { app, url, health, isHttps };
          });
          
          const results = await Promise.all(healthChecks);
          
          console.log(''); // Add spacing
          
          results.forEach((result, index) => {
            const { app, url, health, isHttps } = result;
            const appName = app.appName;
            
            console.log(chalk.green(`   📦 ${appName}`));
            console.log(`      URL: ${chalk.blue(url)}`);
            
            // Show real health status
            let statusText, statusColor;
            switch (health) {
              case 'healthy':
                statusText = '✅ Healthy (200)';
                statusColor = chalk.green;
                break;
              case '502-error':
                statusText = '❌ App Error (502)';
                statusColor = chalk.red;
                break;
              case 'not-found':
                statusText = '⚠️  Not Found (404)';
                statusColor = chalk.yellow;
                break;
              case 'redirect':
                statusText = '🔄 Redirect (3xx)';
                statusColor = chalk.cyan;
                break;
              case 'timeout':
                statusText = '⏱️  Timeout';
                statusColor = chalk.gray;
                break;
              case 'not-deployed':
                statusText = '⚠️  Not Deployed (Placeholder)';
                statusColor = chalk.yellow;
                break;
              case 'empty-response':
                statusText = '❓ Empty Response';
                statusColor = chalk.gray;
                break;
              default:
                statusText = '❓ Unknown';
                statusColor = chalk.gray;
            }
            
            console.log(`      Status: ${statusColor(statusText)}`);
            console.log(`      Container: ${app.isAppBuilding ? chalk.yellow('Building') : chalk.green('Running')}`);
            console.log(`      SSL: ${isHttps ? chalk.green('Enabled') : chalk.gray('Disabled')}`);
            
            // Highlight critical instance count issues
            const instanceCount = app.instanceCount || 0;
            if (instanceCount === 0) {
              console.log(`      Instances: ${chalk.red('0 ⚠️  CRITICAL - No instances running!')}`);
              console.log(`      ${chalk.yellow('💡 Fix with:')} ${chalk.white(`bruvtools scale ${appName} 1`)}`);
            } else {
              console.log(`      Instances: ${chalk.cyan(instanceCount)}`);
            }
            
            if (app.containerHttpPort && app.containerHttpPort !== 80) {
              console.log(`      Port: ${chalk.cyan(app.containerHttpPort)}`);
            }
            
            if (index < results.length - 1) console.log('');
          });
        }
        
      } catch (apiErr) {
        console.log(chalk.yellow('   ⚠️  Could not fetch live app data'));
        console.log(chalk.gray('   Reason: ') + apiErr.message);
        console.log(chalk.gray('   💡 Check your CapRover connection and try again'));
      }
      
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