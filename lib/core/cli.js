const { program } = require('commander');
const config = require('./config');
const chalk = require('chalk');

/**
 * Main CLI Interface for bruvtools
 */
class CLI {
  constructor() {
    this.providers = new Map();
    this.loadProviders();
  }

  loadProviders() {
    // Load CapRover provider
    try {
      const CapRoverProvider = require('../providers/caprover');
      this.providers.set('caprover', CapRoverProvider);
    } catch (err) {
      console.warn('⚠️  CapRover provider not available:', err.message);
    }

    // Future: Load other providers dynamically
    // const AWSProvider = require('../providers/aws');
    // this.providers.set('aws', AWSProvider);
  }

  getProvider(providerName = null) {
    const name = providerName || config.getDefaultProvider();
    const ProviderClass = this.providers.get(name);
    
    if (!ProviderClass) {
      throw new Error(`Provider "${name}" not found. Available: ${Array.from(this.providers.keys()).join(', ')}`);
    }

    const providerConfig = config.getProviderConfig(name);
    return new ProviderClass(providerConfig);
  }

  setupCommands() {
    program
      .name('bruvtools')
      .description('Universal Cloud Deployment CLI - Deploy Anywhere, Manage Everything')
      .version('0.1.0');

    // Init command
    program
      .command('init')
      .description('Initialize bruvtools in current directory')
      .option('-p, --provider <name>', 'Provider to use', 'caprover')
      .action(async (options) => {
        try {
          console.log(chalk.blue('🚀 Initializing bruvtools...'));
          
          const success = config.init(options.provider);
          if (success) {
            console.log(chalk.green('✅ bruvtools initialized successfully!'));
            console.log(chalk.gray(`   Provider: ${options.provider}`));
            console.log(chalk.gray(`   Config: bruvtools.yml`));
          }
        } catch (err) {
          console.error(chalk.red('❌ Initialization failed:'), err.message);
          process.exit(1);
        }
      });

    // Deploy command
    program
      .command('deploy <appName>')
      .description('Deploy application')
      .option('-p, --provider <name>', 'Override provider')
      .option('-d, --dir <path>', 'Source directory', '.')
      .option('--port <port>', 'Container port', '80')
      .option('--scale <replicas>', 'Number of replicas', '1')
      .action(async (appName, options) => {
        try {
          console.log(chalk.blue(`🚀 Deploying ${appName}...`));
          
          const provider = this.getProvider(options.provider);
          const result = await provider.deploy(appName, options);
          
          if (result.success) {
            console.log(chalk.green('🎉 Deployment completed successfully!'));
            if (result.url) {
              console.log(chalk.blue(`🌐 Available at: ${result.url}`));
            }
          }
        } catch (err) {
          console.error(chalk.red('❌ Deployment failed:'), err.message);
          process.exit(1);
        }
      });

    // Create command
    program
      .command('create <appName>')
      .description('Create a new application')
      .option('-p, --provider <name>', 'Override provider')
      .option('--persistent', 'Enable persistent data', false)
      .action(async (appName, options) => {
        try {
          console.log(chalk.blue(`📦 Creating app ${appName}...`));
          
          const provider = this.getProvider(options.provider);
          await provider.create(appName, options);
          
          console.log(chalk.green(`✅ App "${appName}" created successfully!`));
        } catch (err) {
          console.error(chalk.red('❌ App creation failed:'), err.message);
          process.exit(1);
        }
      });

    // Delete command
    program
      .command('delete <appName>')
      .description('Delete an application')
      .option('-p, --provider <name>', 'Override provider')
      .option('-f, --force', 'Skip confirmation', false)
      .action(async (appName, options) => {
        try {
          if (!options.force) {
            console.log(chalk.yellow(`⚠️  This will permanently delete "${appName}"`));
            // TODO: Add confirmation prompt with inquirer
          }
          
          console.log(chalk.blue(`🗑️  Deleting app ${appName}...`));
          
          const provider = this.getProvider(options.provider);
          await provider.delete(appName, options);
          
          console.log(chalk.green(`✅ App "${appName}" deleted successfully!`));
        } catch (err) {
          console.error(chalk.red('❌ App deletion failed:'), err.message);
          process.exit(1);
        }
      });

    // Scale command
    program
      .command('scale <appName> <replicas>')
      .description('Scale application')
      .option('-p, --provider <name>', 'Override provider')
      .action(async (appName, replicas, options) => {
        try {
          const replicaCount = parseInt(replicas);
          if (isNaN(replicaCount) || replicaCount < 0) {
            throw new Error('Replicas must be a non-negative number');
          }
          
          console.log(chalk.blue(`📈 Scaling ${appName} to ${replicaCount} replicas...`));
          
          const provider = this.getProvider(options.provider);
          await provider.scale(appName, replicaCount, options);
          
          console.log(chalk.green(`✅ App "${appName}" scaled successfully!`));
        } catch (err) {
          console.error(chalk.red('❌ Scaling failed:'), err.message);
          process.exit(1);
        }
      });

    // Logs command
    program
      .command('logs <appName>')
      .description('View application logs')
      .option('-p, --provider <name>', 'Override provider')
      .option('-f, --follow', 'Follow log output', false)
      .action(async (appName, options) => {
        try {
          const provider = this.getProvider(options.provider);
          await provider.logs(appName, options);
        } catch (err) {
          console.error(chalk.red('❌ Failed to fetch logs:'), err.message);
          process.exit(1);
        }
      });

    // Status command
    program
      .command('status <appName>')
      .description('Check application status')
      .option('-p, --provider <name>', 'Override provider')
      .action(async (appName, options) => {
        try {
          const provider = this.getProvider(options.provider);
          await provider.status(appName, options);
        } catch (err) {
          console.error(chalk.red('❌ Failed to get status:'), err.message);
          process.exit(1);
        }
      });

    // Test command
    program
      .command('test <appName>')
      .description('Test application connectivity')
      .option('-p, --provider <name>', 'Override provider')
      .option('--https', 'Use HTTPS', false)
      .option('--url <url>', 'Custom URL to test')
      .action(async (appName, options) => {
        try {
          console.log(chalk.blue(`🧪 Testing ${appName}...`));
          
          const provider = this.getProvider(options.provider);
          await provider.test(appName, options);
          
          console.log(chalk.green('✅ Test completed!'));
        } catch (err) {
          console.error(chalk.red('❌ Test failed:'), err.message);
          process.exit(1);
        }
      });

    // List command
    program
      .command('list')
      .description('List applications')
      .option('-p, --provider <name>', 'Override provider')
      .action(async (options) => {
        try {
          const provider = this.getProvider(options.provider);
          await provider.list(options);
        } catch (err) {
          console.error(chalk.red('❌ Failed to list apps:'), err.message);
          process.exit(1);
        }
      });

    // Env command
    program
      .command('env <appName> <key> [value]')
      .description('Manage environment variables')
      .option('-p, --provider <name>', 'Override provider')
      .action(async (appName, key, value, options) => {
        try {
          const provider = this.getProvider(options.provider);
          
          if (value) {
            console.log(chalk.blue(`🔧 Setting ${key}=${value} for ${appName}...`));
            await provider.setEnv(appName, key, value, options);
            console.log(chalk.green('✅ Environment variable set!'));
          } else {
            await provider.getEnv(appName, key, options);
          }
        } catch (err) {
          console.error(chalk.red('❌ Environment operation failed:'), err.message);
          process.exit(1);
        }
      });

    // Config commands
    program
      .command('config')
      .description('Manage configuration')
      .option('--list', 'List current configuration', false)
      .option('--providers', 'List available providers', false)
      .action((options) => {
        if (options.list) {
          console.log(chalk.blue('📋 Current configuration:'));
          console.log(JSON.stringify(config.getConfig(), null, 2));
        } else if (options.providers) {
          console.log(chalk.blue('🔌 Available providers:'));
          this.providers.forEach((_, name) => {
            const isDefault = name === config.getDefaultProvider();
            console.log(`  ${name}${isDefault ? chalk.green(' (default)') : ''}`);
          });
        } else {
          console.log(chalk.yellow('Use --list or --providers'));
        }
      });
  }

  run() {
    this.setupCommands();
    program.parse();
  }
}

module.exports = CLI; 