const { program } = require('commander');
const config = require('./config');
const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

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

  async interactiveInit() {
    console.log(chalk.blue('🚀 Welcome to bruvtools interactive setup!'));
    console.log(chalk.gray('This will create bruvtools.yml and .env files for you.\n'));

    // Provider selection
    const providerChoices = Array.from(this.providers.keys()).map(name => ({
      name: name === 'caprover' ? `${name} (recommended)` : name,
      value: name
    }));

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'provider',
        message: 'Which cloud provider do you want to use?',
        choices: providerChoices,
        default: 'caprover'
      }
    ]);

    let providerConfig = {};
    let envVars = {};

    // Provider-specific configuration
    if (answers.provider === 'caprover') {
      console.log(chalk.blue('\n📦 CapRover Configuration'));
      console.log(chalk.gray('You can find this information in your CapRover dashboard.\n'));

      const capRoverAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'machine',
          message: 'CapRover machine name:',
          default: 'caprover1133onubuntu2204-s-1vcpu-2gb-amd-sfo3-01',
          validate: input => input.trim() !== '' || 'Machine name is required'
        },
        {
          type: 'input',
          name: 'domain',
          message: 'Your domain (without https://):',
          default: 'bruvbot.com.br',
          validate: input => input.trim() !== '' || 'Domain is required'
        },
        {
          type: 'password',
          name: 'password',
          message: 'CapRover password:',
          mask: '*',
          validate: input => input.trim() !== '' || 'Password is required for deployments'
        }
      ]);

      providerConfig = {
        machine: capRoverAnswers.machine,
        domain: capRoverAnswers.domain
      };

      envVars.CAPROVER_PASSWORD = capRoverAnswers.password;
    }

    // Project configuration
    console.log(chalk.blue('\n🏗️ Project Configuration'));
    
    const projectAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        default: path.basename(process.cwd()),
        validate: input => input.trim() !== '' || 'Project name is required'
      },
      {
        type: 'list',
        name: 'defaultPort',
        message: 'Default application port:',
        choices: [
          { name: '80 (CapRover/production default)', value: 80 },
          { name: '3000 (Node.js default)', value: 3000 },
          { name: '8080 (Common alternative)', value: 8080 },
          { name: '5000 (Python Flask default)', value: 5000 },
          { name: 'Custom', value: 'custom' }
        ],
        default: 80
      }
    ]);

    let port = projectAnswers.defaultPort;
    if (port === 'custom') {
      const customPortAnswer = await inquirer.prompt([
        {
          type: 'input',
          name: 'customPort',
          message: 'Enter custom port:',
          validate: input => {
            const num = parseInt(input);
            return (num > 0 && num < 65536) || 'Port must be between 1 and 65535';
          }
        }
      ]);
      port = parseInt(customPortAnswer.customPort);
    }

    // Additional environment variables
    console.log(chalk.blue('\n🔧 Environment Variables (Optional)'));
    console.log(chalk.gray('Add any additional environment variables your app needs.\n'));
    
    let addMoreEnvVars = true;
    while (addMoreEnvVars) {
      const envAnswer = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'addEnvVar',
          message: 'Add an environment variable?',
          default: false
        }
      ]);

      if (envAnswer.addEnvVar) {
        const envVarDetails = await inquirer.prompt([
          {
            type: 'input',
            name: 'key',
            message: 'Environment variable name:',
            validate: input => input.trim() !== '' || 'Variable name is required'
          },
          {
            type: 'input',
            name: 'value',
            message: 'Environment variable value:',
            validate: input => input.trim() !== '' || 'Variable value is required'
          }
        ]);
        
        envVars[envVarDetails.key] = envVarDetails.value;
      } else {
        addMoreEnvVars = false;
      }
    }

    return {
      provider: answers.provider,
      providerConfig,
      projectName: projectAnswers.projectName,
      port,
      envVars
    };
  }

  createEnvFile(envVars) {
    const envPath = path.join(process.cwd(), '.env');
    const lines = Object.entries(envVars).map(([key, value]) => `${key}=${value}`);
    
    // Add helpful comments
    const content = [
      '# bruvtools Environment Variables',
      '# Generated by: bruvtools init',
      '# Keep this file secure and never commit to version control!',
      '',
      ...lines,
      ''
    ].join('\n');

    fs.writeFileSync(envPath, content, 'utf8');
    console.log(chalk.green(`✅ Created ${envPath}`));
  }

  createBruvtoolsConfig(provider, providerConfig, projectName, port) {
    const configContent = {
      default_provider: provider,
      providers: {
        [provider]: providerConfig
      },
      projects: {
        [projectName]: {
          provider: provider,
          port: port
        }
      }
    };

    return config.saveProjectConfig(configContent);
  }

  setupCommands() {
    program
      .name('bruvtools')
      .description('Universal Cloud Deployment CLI - Deploy Anywhere, Manage Everything')
      .version('0.2.3');

    // Enhanced interactive init command
    program
      .command('init')
      .description('Interactive setup - creates bruvtools.yml and .env files')
      .option('--non-interactive', 'Skip interactive mode and use defaults')
      .option('-p, --provider <name>', 'Provider to use (non-interactive)', 'caprover')
      .action(async (options) => {
        try {
          if (options.nonInteractive) {
            // Original basic init for CI/CD or scripting
            console.log(chalk.blue('🚀 Initializing bruvtools (non-interactive)...'));
            
            const success = config.init(options.provider);
            if (success) {
              console.log(chalk.green('✅ bruvtools initialized successfully!'));
              console.log(chalk.gray(`   Provider: ${options.provider}`));
              console.log(chalk.gray(`   Config: bruvtools.yml`));
              console.log(chalk.yellow('⚠️  Remember to create .env file with CAPROVER_PASSWORD'));
            }
          } else {
            // Interactive setup
            const setup = await this.interactiveInit();
            
            // Create .env file
            if (Object.keys(setup.envVars).length > 0) {
              this.createEnvFile(setup.envVars);
            }
            
            // Create bruvtools.yml
            const configSuccess = this.createBruvtoolsConfig(
              setup.provider, 
              setup.providerConfig, 
              setup.projectName, 
              setup.port
            );
            
            if (configSuccess) {
              console.log(chalk.green('\n🎉 bruvtools setup completed successfully!'));
              console.log(chalk.blue('\n📋 What was created:'));
              console.log(chalk.gray(`   ✅ bruvtools.yml - Project configuration`));
              if (Object.keys(setup.envVars).length > 0) {
                console.log(chalk.gray(`   ✅ .env - Environment variables (keep secure!)`));
              }
              
              console.log(chalk.blue('\n🚀 Next steps:'));
              console.log(chalk.gray(`   1. Deploy your app: ${chalk.white('bruvtools deploy ' + setup.projectName)}`));
              console.log(chalk.gray(`   2. Check services: ${chalk.white('bruvtools services')}`));
              console.log(chalk.gray(`   3. View help: ${chalk.white('bruvtools --help')}`));
            }
          }
        } catch (err) {
          console.error(chalk.red('❌ Initialization failed:'), err.message);
          process.exit(1);
        }
      });

    // Configure command for reconfiguring existing setup
    program
      .command('configure')
      .description('Reconfigure bruvtools settings (updates existing files)')
      .option('--provider-only', 'Only reconfigure provider settings')
      .option('--env-only', 'Only reconfigure environment variables')
      .action(async (options) => {
        try {
          console.log(chalk.blue('🔧 Reconfiguring bruvtools...'));
          
          if (options.providerOnly) {
            // Only reconfigure provider
            const setup = await this.interactiveInit();
            this.createBruvtoolsConfig(setup.provider, setup.providerConfig, setup.projectName, setup.port);
          } else if (options.envOnly) {
            // Only reconfigure environment variables
            console.log(chalk.blue('🔧 Environment Variables Configuration'));
            
            let envVars = {};
            let addMoreEnvVars = true;
            while (addMoreEnvVars) {
              const envAnswer = await inquirer.prompt([
                {
                  type: 'confirm',
                  name: 'addEnvVar',
                  message: 'Add an environment variable?',
                  default: false
                }
              ]);

              if (envAnswer.addEnvVar) {
                const envVarDetails = await inquirer.prompt([
                  {
                    type: 'input',
                    name: 'key',
                    message: 'Environment variable name:',
                    validate: input => input.trim() !== '' || 'Variable name is required'
                  },
                  {
                    type: 'input',
                    name: 'value',
                    message: 'Environment variable value:',
                    validate: input => input.trim() !== '' || 'Variable value is required'
                  }
                ]);
                
                envVars[envVarDetails.key] = envVarDetails.value;
              } else {
                addMoreEnvVars = false;
              }
            }
            
            if (Object.keys(envVars).length > 0) {
              this.createEnvFile(envVars);
            }
          } else {
            // Full reconfiguration
            const setup = await this.interactiveInit();
            
            if (Object.keys(setup.envVars).length > 0) {
              this.createEnvFile(setup.envVars);
            }
            
            this.createBruvtoolsConfig(setup.provider, setup.providerConfig, setup.projectName, setup.port);
          }
          
          console.log(chalk.green('✅ Configuration updated successfully!'));
        } catch (err) {
          console.error(chalk.red('❌ Configuration failed:'), err.message);
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

    // Services command - show all deployed services with URLs
    program
      .command('services')
      .description('Show all deployed services with URLs and status')
      .option('-p, --provider <name>', 'Override provider')
      .action(async (options) => {
        try {
          console.log(chalk.blue('🚀 bruvtools - Deployed Services\n'));
          
          const provider = this.getProvider(options.provider);
          await provider.services(options);
          
        } catch (err) {
          console.error(chalk.red('❌ Failed to get services:'), err.message);
          process.exit(1);
        }
      });
  }

  run() {
    this.setupCommands();
    program.parse();
  }
}

module.exports = CLI; 