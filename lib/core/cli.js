const { program } = require('commander');
const config = require('./config');
const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

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
      // Check if CapRover CLI is installed
      console.log(chalk.yellow('\n🔍 Checking CapRover CLI installation...'));
      const capRoverCheck = await this.checkCapRoverCLI();
      
      if (!capRoverCheck.installed) {
        console.log(chalk.red('❌ CapRover CLI is not installed or not accessible.'));
        console.log(chalk.yellow('\n📦 To fix this, install CapRover CLI:'));
        console.log(chalk.cyan('npm install -g caprover'));
        console.log(chalk.gray('\nThen run this command again: bruvtools init'));
        
        const continueAnswer = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'continue',
            message: 'Continue setup anyway? (You can install CapRover CLI later)',
            default: false
          }
        ]);
        
        if (!continueAnswer.continue) {
          console.log(chalk.yellow('\n👋 Setup cancelled. Install CapRover CLI and try again!'));
          process.exit(0);
        }
        
        console.log(chalk.yellow('\n⚠️  Warning: Some bruvtools commands will not work without CapRover CLI.'));
      } else {
        console.log(chalk.green(`✅ CapRover CLI found: ${capRoverCheck.version}`));
      }

      console.log(chalk.blue('\n📦 CapRover Configuration'));
      console.log(chalk.gray('You can find this information in your CapRover dashboard.\n'));

      const capRoverAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'machine',
          message: 'CapRover machine name:',
          validate: input => input.trim() !== '' || 'Machine name is required'
        },
        {
          type: 'input',
          name: 'domain',
          message: 'Your domain (without https://):',
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
        
        // Check if the value is too large for CapRover (>500 chars)
        const value = envVarDetails.value;
        const key = envVarDetails.key;
        
        if (value.length > 500) {
          console.log(chalk.yellow(`\n⚠️  Large environment variable detected!`));
          console.log(chalk.gray(`   ${key}: ${value.length} characters`));
          console.log(chalk.gray(`   CapRover has limits around 1000 characters per environment variable.`));
          
          const splitAnswer = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'shouldSplit',
              message: 'Would you like to automatically split this into smaller parts?',
              default: true
            }
          ]);
          
          if (splitAnswer.shouldSplit) {
            // Split the value into 400-character chunks
            const maxSize = 400;
            let partIndex = 1;
            
            console.log(chalk.blue(`\n🔪 Splitting ${key} into parts (max ${maxSize} chars each):`));
            
            for (let i = 0; i < value.length; i += maxSize) {
              const chunk = value.slice(i, i + maxSize);
              const partKey = `${key}_${partIndex}`;
              envVars[partKey] = chunk;
              console.log(chalk.gray(`   📦 ${partKey}: ${chunk.length} chars`));
              partIndex++;
            }
            
            console.log(chalk.green(`✅ Split into ${partIndex - 1} parts. Your app can reconstruct using getEnvVar('${key}').`));
            console.log(chalk.gray(`💡 Make sure your app uses the getEnvVar() function to automatically reconstruct split variables.`));
          } else {
            // Store as-is but warn
            envVars[key] = value;
            console.log(chalk.yellow(`⚠️  Stored as single variable. May cause deployment issues if too large.`));
          }
        } else {
          // Normal size, store as-is
          envVars[key] = value;
        }
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
    
    // Check if there are any split environment variables
    const splitVars = new Set();
    Object.keys(envVars).forEach(key => {
      const match = key.match(/^(.+)_(\d+)$/);
      if (match) {
        splitVars.add(match[1]);
      }
    });
    
    // Add helpful comments
    const content = [
      '# bruvtools Environment Variables',
      '# Generated by: bruvtools init',
      '# Keep this file secure and never commit to version control!',
      ''
    ];
    
    // Add split variable instructions if any exist
    if (splitVars.size > 0) {
      content.push('# 🔧 Split Environment Variables Detected');
      content.push('# Some large environment variables have been automatically split into parts.');
      content.push('# Your app should use the getEnvVar() function to automatically reconstruct them:');
      content.push('#');
      content.push('# function getEnvVar(varName) {');
      content.push('#   if (process.env[varName]) return process.env[varName];');
      content.push('#   let reconstructed = \'\';');
      content.push('#   let partIndex = 1;');
      content.push('#   while (true) {');
      content.push('#     const part = process.env[`${varName}_${partIndex}`];');
      content.push('#     if (part) { reconstructed += part; partIndex++; }');
      content.push('#     else break;');
      content.push('#   }');
      content.push('#   return reconstructed || undefined;');
      content.push('# }');
      content.push('#');
      splitVars.forEach(varName => {
        content.push(`# Usage: const ${varName.toLowerCase()} = getEnvVar('${varName}');`);
      });
      content.push('');
    }
    
    content.push(...lines);
    content.push('');

    fs.writeFileSync(envPath, content.join('\n'), 'utf8');
    console.log(chalk.green(`✅ Created ${envPath}`));
    
    if (splitVars.size > 0) {
      console.log(chalk.blue(`💡 Split variables detected: ${Array.from(splitVars).join(', ')}`));
      console.log(chalk.gray(`   Use getEnvVar('VARIABLE_NAME') in your app to reconstruct them.`));
    }
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
      .version('0.2.15');

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
                
                // Check if the value is too large for CapRover (>500 chars)
                const value = envVarDetails.value;
                const key = envVarDetails.key;
                
                if (value.length > 500) {
                  console.log(chalk.yellow(`\n⚠️  Large environment variable detected!`));
                  console.log(chalk.gray(`   ${key}: ${value.length} characters`));
                  console.log(chalk.gray(`   CapRover has limits around 1000 characters per environment variable.`));
                  
                  const splitAnswer = await inquirer.prompt([
                    {
                      type: 'confirm',
                      name: 'shouldSplit',
                      message: 'Would you like to automatically split this into smaller parts?',
                      default: true
                    }
                  ]);
                  
                  if (splitAnswer.shouldSplit) {
                    // Split the value into 400-character chunks
                    const maxSize = 400;
                    let partIndex = 1;
                    
                    console.log(chalk.blue(`\n🔪 Splitting ${key} into parts (max ${maxSize} chars each):`));
                    
                    for (let i = 0; i < value.length; i += maxSize) {
                      const chunk = value.slice(i, i + maxSize);
                      const partKey = `${key}_${partIndex}`;
                      envVars[partKey] = chunk;
                      console.log(chalk.gray(`   📦 ${partKey}: ${chunk.length} chars`));
                      partIndex++;
                    }
                    
                    console.log(chalk.green(`✅ Split into ${partIndex - 1} parts. Your app can reconstruct using getEnvVar('${key}').`));
                    console.log(chalk.gray(`💡 Make sure your app uses the getEnvVar() function to automatically reconstruct split variables.`));
                  } else {
                    // Store as-is but warn
                    envVars[key] = value;
                    console.log(chalk.yellow(`⚠️  Stored as single variable. May cause deployment issues if too large.`));
                  }
                } else {
                  // Normal size, store as-is
                  envVars[key] = value;
                }
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
      .option('--skip-security-check', 'Skip pre-deployment security analysis', false)
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
          
          // Provide helpful debugging guidance
          console.log(chalk.yellow('\n🔍 Debugging tips:'));
          console.log(chalk.gray('   1. Check app logs: ') + chalk.white(`bruvtools logs ${appName}`));
          console.log(chalk.gray('   2. Check app status: ') + chalk.white(`bruvtools status ${appName}`));
          console.log(chalk.gray('   3. View all services: ') + chalk.white('bruvtools services'));
          console.log(chalk.gray('   4. Check CapRover dashboard: ') + chalk.blue('https://captain.your-domain.com'));
          console.log(chalk.gray('   5. Common issues:'));
          console.log(chalk.gray('      • Port mismatch (server.js vs Dockerfile EXPOSE)'));
          console.log(chalk.gray('      • Instance count = 0 (check services output)'));
          console.log(chalk.gray('      • Missing dependencies in package.json'));
          console.log(chalk.gray('      • App crashes on startup (check logs)'));
          
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

    // Clear command - delete multiple apps
    program
      .command('clear')
      .description('Delete multiple applications')
      .option('-p, --provider <name>', 'Override provider')
      .option('--unhealthy-only', 'Only delete unhealthy apps (502 errors, not deployed, timeouts)', false)
      .option('--placeholder-only', 'Only delete apps showing CapRover placeholder page', false)
      .option('-f, --force', 'Skip confirmation', false)
      .action(async (options) => {
        try {
          console.log(chalk.blue('🔍 Scanning deployed apps...'));
          
          const provider = this.getProvider(options.provider);
          
          // Get apps and their health status (reuse logic from services command)
          const { spawn } = require('child_process');
          const isWindows = process.platform === 'win32';
          
          const checkProcess = spawn('caprover', [
            'api',
            '--caproverName', provider.machine,
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
            console.log(chalk.gray('📭 No apps found to clear'));
            return;
          }
          
          // Health check function (same as services command)
          const checkAppHealth = async (url) => {
            return new Promise((resolve) => {
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
                
                if (output.includes('Your app will be here!') || 
                    output.includes('Go ahead and deploy your app now!') ||
                    output.includes('Powered by CapRover')) {
                  resolve('not-deployed');
                  return;
                }
                
                if (output.includes('NGINX 502 Error') || 
                    output.includes('502 Bad Gateway')) {
                  resolve('502-error');
                  return;
                }
                
                if (output.includes('404') || output.includes('Not Found')) {
                  resolve('not-found');
                  return;
                }
                
                if (output.trim().length > 0) {
                  resolve('healthy');
                } else {
                  resolve('empty-response');
                }
              });
              
              setTimeout(() => {
                curlProcess.kill();
                resolve('timeout');
              }, 5000);
            });
          };
          
          // Check health for all apps
          console.log(chalk.gray('🔍 Checking app health...'));
          const healthChecks = apps.map(async (app) => {
            const appName = app.appName;
            const isHttps = app.forceSsl || app.hasDefaultSubDomainSsl;
            const protocol = isHttps ? 'https' : 'http';
            const url = `${protocol}://${appName}.${provider.domain}`;
            
            const health = await checkAppHealth(url);
            return { app, health };
          });
          
          const results = await Promise.all(healthChecks);
          
          // Filter apps to delete based on options
          let appsToDelete = [];
          
          if (options.unhealthyOnly) {
            appsToDelete = results.filter(r => 
              r.health === '502-error' || 
              r.health === 'not-deployed' || 
              r.health === 'timeout' ||
              r.health === 'not-found' ||
              r.health === 'empty-response'
            );
          } else if (options.placeholderOnly) {
            appsToDelete = results.filter(r => r.health === 'not-deployed');
          } else {
            // Delete all apps
            appsToDelete = results;
          }
          
          if (appsToDelete.length === 0) {
            if (options.unhealthyOnly) {
              console.log(chalk.green('✅ No unhealthy apps found to clear!'));
            } else if (options.placeholderOnly) {
              console.log(chalk.green('✅ No placeholder apps found to clear!'));
            } else {
              console.log(chalk.gray('📭 No apps found to clear'));
            }
            return;
          }
          
          // Show what will be deleted
          console.log(chalk.yellow(`\n⚠️  Found ${appsToDelete.length} app${appsToDelete.length === 1 ? '' : 's'} to delete:\n`));
          
          appsToDelete.forEach(({ app, health }) => {
            let statusText;
            switch (health) {
              case 'healthy': statusText = '✅ Healthy'; break;
              case '502-error': statusText = '❌ 502 Error'; break;
              case 'not-deployed': statusText = '⚠️  Placeholder'; break;
              case 'timeout': statusText = '⏱️  Timeout'; break;
              case 'not-found': statusText = '⚠️  404'; break;
              case 'empty-response': statusText = '❓ Empty'; break;
              default: statusText = '❓ Unknown'; break;
            }
            console.log(`   📦 ${chalk.cyan(app.appName)} - ${statusText}`);
          });
          
          // Confirmation
          if (!options.force) {
            console.log(chalk.red('\n🚨 This will PERMANENTLY DELETE these apps!'));
            
            const confirmation = await inquirer.prompt([
              {
                type: 'confirm',
                name: 'proceed',
                message: `Are you sure you want to delete ${appsToDelete.length} app${appsToDelete.length === 1 ? '' : 's'}?`,
                default: false
              }
            ]);
            
            if (!confirmation.proceed) {
              console.log(chalk.yellow('👋 Clear operation cancelled'));
              return;
            }
          }
          
          // Delete apps
          console.log(chalk.blue(`\n🗑️  Deleting ${appsToDelete.length} app${appsToDelete.length === 1 ? '' : 's'}...`));
          
          let deleted = 0;
          let failed = 0;
          
          for (const { app } of appsToDelete) {
            try {
              console.log(chalk.gray(`   Deleting ${app.appName}...`));
              await provider.delete(app.appName, { force: true });
              deleted++;
              console.log(chalk.green(`   ✅ ${app.appName} deleted`));
            } catch (err) {
              failed++;
              console.log(chalk.red(`   ❌ Failed to delete ${app.appName}: ${err.message}`));
            }
          }
          
          console.log(chalk.green(`\n🎉 Clear completed! ${deleted} deleted, ${failed} failed`));
          
        } catch (err) {
          console.error(chalk.red('❌ Clear operation failed:'), err.message);
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

    // SSL command
    program
      .command('ssl <appName>')
      .description('Enable HTTPS with automatic SSL certificate for an existing app')
      .option('-p, --provider <name>', 'Override provider')
      .action(async (appName, options) => {
        try {
          console.log(chalk.blue(`🔒 Enabling HTTPS for ${appName}...`));
          
          const provider = this.getProvider(options.provider);
          await provider.runCapgen(['ssl', appName, '--machine', provider.machine]);
          
          console.log(chalk.green('✅ HTTPS enabled successfully!'));
          console.log(chalk.gray(`🌐 Your app is now available at: https://${appName}.${provider.domain}`));
        } catch (err) {
          console.error(chalk.red('❌ SSL enablement failed:'), err.message);
          process.exit(1);
        }
      });

    // List command - also add aliases for clarity
    program
      .command('list')
      .alias('ls')
      .description('List applications (raw output from provider - use "services" for formatted view)')
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

    // Help command with common usage patterns
    program
      .command('help-commands')
      .alias('commands')
      .alias('usage')
      .description('Show common command patterns and usage examples')
      .action(() => {
        console.log(chalk.blue('🚀 bruvtools - Common Commands\n'));
        
        console.log(chalk.green('📋 View Deployed Apps/Services:'));
        console.log(chalk.gray('   bruvtools services     # Show all deployed apps with URLs'));
        console.log(chalk.gray('   bruvtools apps         # Same as services (alias)'));
        console.log(chalk.gray('   bruvtools deployed     # Same as services (alias)'));
        console.log(chalk.gray('   bruvtools dashboard    # Same as services (alias)'));
        
        console.log(chalk.green('\n🚀 Deploy & Manage Apps:'));
        console.log(chalk.gray('   bruvtools init         # Setup bruvtools in current project'));
        console.log(chalk.gray('   bruvtools create <app> # Create new app on CapRover'));
        console.log(chalk.gray('   bruvtools deploy <app> # Deploy app from current directory'));
        console.log(chalk.gray('   bruvtools status <app> # Check app status'));
        console.log(chalk.gray('   bruvtools logs <app>   # View app logs'));
        
        console.log(chalk.green('\n⚖️ Scale & Test:'));
        console.log(chalk.gray('   bruvtools scale <app> <replicas> # Scale app'));
        console.log(chalk.gray('   bruvtools test <app>             # Test app connectivity'));
        
        console.log(chalk.green('\n🔧 Configuration:'));
        console.log(chalk.gray('   bruvtools configure    # Reconfigure settings'));
        console.log(chalk.gray('   bruvtools config --list # Show current config'));
        
        console.log(chalk.cyan('\n💡 Tip: Use "bruvtools services" to see all your deployed apps!'));
      });

    // Services command - show all deployed services with URLs
    program
      .command('services')
      .alias('apps')
      .alias('deployed')
      .alias('dashboard')
      .description('Show all deployed services/apps with URLs and status (aliases: apps, deployed, dashboard)')
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

  /**
   * Check if CapRover CLI is installed and accessible
   */
  async checkCapRoverCLI() {
    return new Promise((resolve) => {
      const isWindows = process.platform === 'win32';
      const proc = spawn('caprover', ['--version'], { 
        stdio: 'pipe',
        shell: isWindows 
      });

      let output = '';
      proc.stdout.on('data', (data) => {
        output += data.toString();
      });

      proc.on('close', (code) => {
        if (code === 0 && output.trim()) {
          resolve({ installed: true, version: output.trim() });
        } else {
          resolve({ installed: false });
        }
      });

      proc.on('error', () => {
        resolve({ installed: false });
      });

      // Timeout after 5 seconds
      setTimeout(() => {
        proc.kill();
        resolve({ installed: false });
      }, 5000);
      });
  }

  run() {
    this.setupCommands();
    program.parse();
  }
}

module.exports = CLI; 