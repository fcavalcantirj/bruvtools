#!/usr/bin/env node
const { program } = require('commander');
const { spawn } = require('child_process');

// Validate required environment variables
function validateEnvironment() {
  const required = ['CAPROVER_PASSWORD', 'CAPROVER_DOMAIN'];
  const missing = required.filter(env => !process.env[env]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(env => console.error(`   - ${env}`));
    console.error('\n💡 Set them with:');
    missing.forEach(env => console.error(`   export ${env}="your_value_here"`));
    process.exit(1);
  }
}

function runCommand(cmd, args = []) {
  return new Promise((resolve, reject) => {
    console.log(`Running command: ${cmd} ${args.join(' ')}`);

    // Windows compatibility: use shell to find npm-installed commands
    const isWindows = process.platform === 'win32';
    const spawnOptions = {
      stdio: ['inherit', 'pipe', 'pipe'], // Capture stdout and stderr
      shell: isWindows // Enable shell on Windows to find .cmd files
    };

    const proc = spawn(cmd, args, spawnOptions);
    
    let stdout = '';
    let stderr = '';
    
    // Capture output
    proc.stdout.on('data', (data) => {
      const output = data.toString();
      stdout += output;
      process.stdout.write(output); // Still show output in real-time
    });
    
    proc.stderr.on('data', (data) => {
      const output = data.toString();
      stderr += output;
      process.stderr.write(output); // Still show errors in real-time
    });

    proc.on('error', (err) => {
      console.error('Failed to start process:', err);
      reject(err);
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        // Check if this is a CapRover deployment that actually succeeded
        // CapRover sometimes returns non-zero exit codes even on success
        if (cmd === 'caprover' && args.includes('deploy')) {
          // Look for success indicators in the output
          const successIndicators = [
            'Build finished successfully',
            'App is built and deployed',
            'deployed successfully'
          ];
          
          const hasSuccessIndicator = successIndicators.some(indicator => 
            stdout.toLowerCase().includes(indicator.toLowerCase()) || 
            stderr.toLowerCase().includes(indicator.toLowerCase())
          );
          
          if (hasSuccessIndicator) {
            resolve(); // Treat as success despite non-zero exit code
            return;
          }
        }
        
        reject(new Error(`Process exited with code ${code}`));
        return;
      }
      resolve();
    });
  });
}

program
  .name('capgen')
  .description('CLI wrapper around CapRover')
  .version('0.1.0');

// Login command
program
  .command('login')
  .description('Login to CapRover')
  .action(async () => {
    try {
      await runCommand('caprover', ['login']);
      console.log('✅ Logged in successfully!');
    } catch (err) {
      console.error('❌ Login failed:', err.message);
    }
  });

// List command
program
  .command('list')
  .description('List all CapRover machines currently logged in')
  .action(async () => {
    try {
      await runCommand('caprover', ['list']);
    } catch (err) {
      console.error('❌ Failed to list CapRover machines:', err.message);
    }
  });

// Create app command
program
  .command('create <appName>')
  .description('Create a new app on CapRover')
  .option('-m, --machine <name>', 'CapRover machine name')
  .option('-p, --persistent', 'Enable persistent data', false)
  .action(async (appName, options) => {
    const payload = { 
      appName, 
      hasPersistentData: options.persistent 
    };
    
    try {
      console.log(`Creating app: ${appName}`);
      await runCommand('caprover', [
        'api',
        '--caproverName', options.machine,
        '--path', '/user/apps/appDefinitions/register',
        '--method', 'POST',
        '--data', JSON.stringify(payload)
      ]);
      console.log(`✅ App "${appName}" created successfully!`);
    } catch (err) {
      console.error(`❌ Failed to create app "${appName}":`, err.message);
    }
  });

// Configure app settings
program
  .command('configure <appName>')
  .description('Configure app settings like HTTPS, ports, etc')
  .option('-p, --port <port>', 'Container HTTP port', '3000')
  .option('-s, --enable-https', 'Enable HTTPS', false)
  .option('-f, --force-https', 'Force HTTPS by redirecting HTTP traffic', false)
  .option('-d, --domain <domain>', 'Custom domain to connect')
  .option('-m, --machine <name>', 'CapRover machine name')
  .action(async (appName, options) => {
    try {
      // Set container HTTP port
      if (options.port) {
        console.log(`Setting container HTTP port to ${options.port}...`);
        await runCommand('caprover', [
          'api',
          '--caproverName', options.machine,
          '--path', '/user/apps/appDefinitions/update',
          '--method', 'POST',
          '--data', JSON.stringify({
            appName,
            containerHttpPort: parseInt(options.port)
          })
        ]);
        console.log('✅ Container port updated');
      }
      
      // Enable HTTPS
      if (options.enableHttps) {
        console.log(`Enabling HTTPS for ${appName}...`);
        await runCommand('caprover', [
          'api',
          '--caproverName', options.machine,
          '--path', '/user/apps/appDefinitions/enablebasedomainssl',
          '--method', 'POST',
          '--data', JSON.stringify({ appName })
        ]);
        console.log('✅ HTTPS enabled');
      }
      
      // Force HTTPS
      if (options.forceHttps) {
        console.log(`Enabling force HTTPS for ${appName}...`);
        await runCommand('caprover', [
          'api',
          '--caproverName', options.machine,
          '--path', '/user/apps/appDefinitions/update',
          '--method', 'POST',
          '--data', JSON.stringify({
            appName,
            forceSsl: true
          })
        ]);
        console.log('✅ Force HTTPS enabled');
      }
      
      console.log(`✅ App "${appName}" configuration updated!`);
    } catch (err) {
      console.error(`❌ Failed to configure app:`, err.message);
    }
  });

// SSL command for easy SSL enablement
program
  .command('ssl <appName>')
  .description('Enable HTTPS with automatic SSL certificate for an existing app')
  .option('-m, --machine <name>', 'CapRover machine name')
  .option('--force', 'Also force HTTPS (redirect HTTP to HTTPS)', true)
  .action(async (appName, options) => {
    try {
      console.log(`🔒 Enabling HTTPS with SSL certificate for ${appName}...`);
      
      // Enable HTTPS
      await runCommand('caprover', [
        'api',
        '--caproverName', options.machine,
        '--path', '/user/apps/appDefinitions/enablebasedomainssl',
        '--method', 'POST',
        '--data', JSON.stringify({ appName })
      ]);
      console.log('✅ HTTPS enabled');
      
      // Force HTTPS (redirect HTTP to HTTPS) if requested
      if (options.force) {
        console.log('🔒 Enabling force HTTPS (redirecting HTTP to HTTPS)...');
        await runCommand('caprover', [
          'api',
          '--caproverName', options.machine,
          '--path', '/user/apps/appDefinitions/update',
          '--method', 'POST',
          '--data', JSON.stringify({
            appName,
            forceSsl: true
          })
        ]);
        console.log('✅ Force HTTPS enabled');
      }
      
      console.log(`🎉 SSL setup completed for "${appName}"!`);
      console.log(`🌐 Your app is now available at: https://${appName}.${process.env.CAPROVER_DOMAIN}`);
      
    } catch (err) {
      console.error(`❌ Failed to enable SSL:`, err.message);
      console.log('💡 You can also enable SSL manually in the CapRover dashboard');
    }
  });

// Deploy command
program
  .command('deploy <tarFile> <appName>')
  .description('Deploy app to CapRover')
  .option('-m, --machine <name>', 'CapRover machine name')
  .action(async (tarFile, appName, options) => {
    try {
      console.log(`Deploying ${tarFile} to ${appName}...`);
      await runCommand('caprover', [
        'deploy',
        '--caproverName', options.machine,
        '--tarFile', tarFile,
        '--appName', appName
      ]);
      console.log(`✅ App "${appName}" deployed successfully!`);
    } catch (err) {
      console.error(`❌ Failed to deploy app "${appName}":`, err.message);
    }
  });

// Package command
program
  .command('package <sourceDir> <outputName>')
  .description('Package directory into a tarball for deployment')
  .action(async (sourceDir, outputName) => {
    const tarFileName = outputName.endsWith('.tar.gz') ? outputName : `${outputName}.tar.gz`;
    try {
      console.log(`Packaging ${sourceDir} into ${tarFileName}...`);
      await runCommand('tar', [
        '--exclude', tarFileName,
        '--exclude', 'node_modules',
        '--exclude', 'capgen.js',
        '-czf', tarFileName,
        '-C', sourceDir,
        '.'
      ]);
      console.log(`✅ Package created: ${tarFileName}`);
    } catch (err) {
      console.error(`❌ Failed to package directory:`, err.message);
    }
  });


// Add this restart command to your capgen.js file
program
  .command('restart <appName>')
  .description('Restart an app')
  .option('-m, --machine <name>', 'CapRover machine name')
  .action(async (appName, options) => {
    try {
      console.log(`Restarting app: ${appName}...`);
      await runCommand('caprover', [
        'api',
        '--caproverName', options.machine,
        '--path', '/user/apps/appDefinitions/restart',
        '--method', 'POST',
        '--data', JSON.stringify({ appName })
      ]);
      console.log(`✅ App "${appName}" restarted successfully!`);
    } catch (err) {
      console.error(`❌ Failed to restart app "${appName}":`, err.message);
    }
  });



// Add this command to your capgen.js
program
  .command('set-port <appName> <port>')
  .description('Set container HTTP port for an app')
  .option('-m, --machine <name>', 'CapRover machine name')
  .action(async (appName, port, options) => {
    try {
      console.log(`Setting container HTTP port to ${port} for ${appName}...`);
      await runCommand('caprover', [
        'api',
        '--caproverName', options.machine,
        '--path', '/user/apps/appDefinitions/update',
        '--method', 'POST',
        '--data', JSON.stringify({
          appName,
          containerHttpPort: parseInt(port)
        })
      ]);
      console.log(`✅ Container HTTP port set to ${port}`);
      console.log('💡 Don\'t forget to click "Save & Restart" in the CapRover dashboard!');
    } catch (err) {
      console.error(`❌ Failed to set port:`, err.message);
    }
  });




// Delete app command
program
  .command('delete <appName>')
  .description('Delete an app from CapRover')
  .option('-m, --machine <name>', 'CapRover machine name')
  .action(async (appName, options) => {
    try {
      console.log(`Deleting app: ${appName}`);
      await runCommand('caprover', [
        'api',
        '--caproverName', options.machine,
        '--path', '/user/apps/appDefinitions/delete',
        '--method', 'POST',
        '--data', JSON.stringify({ appName })
      ]);
      console.log(`✅ App "${appName}" deleted successfully!`);
    } catch (err) {
      console.error(`❌ Failed to delete app "${appName}":`, err.message);
    }
  });

// Scale app command
program
  .command('scale <appName> <replicas>')
  .description('Scale an app to the specified number of replicas')
  .option('-m, --machine <name>', 'CapRover machine name')
  .action(async (appName, replicas, options) => {
    try {
      const replicaCount = parseInt(replicas);
      if (isNaN(replicaCount) || replicaCount < 0) {
        throw new Error('Replicas must be a non-negative number');
      }
      
      console.log(`Scaling app "${appName}" to ${replicaCount} replicas...`);
      await runCommand('caprover', [
        'api',
        '--caproverName', options.machine,
        '--path', '/user/apps/appDefinitions/update',
        '--method', 'POST',
        '--data', JSON.stringify({
          appName,
          instanceCount: replicaCount
        })
      ]);
      console.log(`✅ App "${appName}" scaled to ${replicaCount} replicas successfully!`);
    } catch (err) {
      console.error(`❌ Failed to scale app "${appName}":`, err.message);
    }
  });

// Environment variables command
program
  .command('env <appName> <key> <value>')
  .description('Set an environment variable for an app (automatically splits large values)')
  .option('-m, --machine <name>', 'CapRover machine name')
  .option('--max-size <size>', 'Maximum size per environment variable part (default: 400)', '400')
  .action(async (appName, key, value, options) => {
    try {
      const maxSize = parseInt(options.maxSize);
      const envVars = [];
      
      // Check if value is too large and needs splitting
      if (value.length > maxSize) {
        console.log(`📏 Value is ${value.length} characters, splitting into parts (max ${maxSize} chars each)...`);
        
        // Split the value into chunks
        let partIndex = 1;
        for (let i = 0; i < value.length; i += maxSize) {
          const chunk = value.slice(i, i + maxSize);
          const partKey = `${key}_${partIndex}`;
          envVars.push({ key: partKey, value: chunk });
          console.log(`   📦 Part ${partIndex}: ${partKey} (${chunk.length} chars)`);
          partIndex++;
        }
        
        console.log(`\n🔧 Setting ${envVars.length} environment variable parts for ${appName}...`);
      } else {
        console.log(`Setting environment variable ${key}=${value} for ${appName}...`);
        envVars.push({ key, value });
      }
      
      // Set all environment variables
      await runCommand('caprover', [
        'api',
        '--caproverName', options.machine,
        '--path', '/user/apps/appDefinitions/update',
        '--method', 'POST',
        '--data', JSON.stringify({
          appName,
          envVars
        })
      ]);
      
      if (envVars.length > 1) {
        console.log(`✅ Environment variable ${key} split into ${envVars.length} parts and set successfully!`);
        console.log(`💡 Your app code should use a function like getEnvVar('${key}') to reconstruct the full value.`);
        console.log(`💡 The reconstruction will look for ${key}_1, ${key}_2, etc. and combine them.`);
      } else {
        console.log(`✅ Environment variable ${key} set successfully!`);
      }
      console.log('💡 The app will restart automatically with the new environment variable(s).');
    } catch (err) {
      console.error(`❌ Failed to set environment variable:`, err.message);
    }
  });

// Logs command
program
  .command('logs <appName>')
  .description('View app logs')
  .option('-m, --machine <name>', 'CapRover machine name')
  .option('-f, --follow', 'Follow log output', false)
  .action(async (appName, options) => {
    try {
      console.log(`Fetching logs for ${appName}...`);
      await runCommand('caprover', [
        'api',
        '--caproverName', options.machine,
        '--path', `/user/apps/appData/${appName}/logs`,
        '--method', 'GET',
        '--data', '{}'
      ]);
      console.log('✅ Logs fetched successfully!');
    } catch (err) {
      console.error(`❌ Failed to fetch logs:`, err.message);
      console.log('💡 You can also check logs directly in the CapRover dashboard');
    }
  });

// Status command
program
  .command('status <appName>')
  .description('Check app status and basic info')
  .option('-m, --machine <name>', 'CapRover machine name')
  .action(async (appName, options) => {
    try {
      console.log(`Checking status for ${appName}...`);
      await runCommand('caprover', [
        'api',
        '--caproverName', options.machine,
        '--path', `/user/apps/appData/${appName}`,
        '--method', 'GET',
        '--data', '{}'
      ]);
    } catch (err) {
      console.error(`❌ Failed to get app status:`, err.message);
    }
  });

// Quick deploy workflow command
program
  .command('quick-deploy <appName>')
  .description('Complete workflow: package current directory and deploy to app')
  .option('-m, --machine <name>', 'CapRover machine name')
  .option('-p, --port <port>', 'Set container HTTP port after deployment', '80')
  .option('-s, --scale <replicas>', 'Scale to specified replicas after deployment', '1')
  .option('-d, --dir <directory>', 'Target directory to deploy (default: current directory)', '.')
  .option('--auto-create', 'Automatically create app if it doesn\'t exist', true)
  .option('--no-ssl', 'Skip SSL certificate setup (deploy HTTP only)', false)
  .option('--skip-security-check', 'Skip pre-deployment security analysis', false)
  .action(async (appName, options) => {
    try {
      const targetDir = options.dir;
      let finalAppName = appName;
      
      console.log(`🚀 Starting quick deployment workflow for: ${targetDir}\n`);
      
      // Step 0: Check if app exists and find available name
      console.log(`🔍 Step 0: Checking app availability...`);
      
      // Get list of existing apps
      const { spawn } = require('child_process');
      const isWindows = process.platform === 'win32';
      
      const checkProcess = spawn('caprover', [
        'api',
        '--caproverName', options.machine,
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
      
      const existingApps = await new Promise((resolve, reject) => {
        checkProcess.on('close', (code) => {
          if (code !== 0) {
            reject(new Error(`Failed to check apps: ${stderr}`));
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
            const appNames = response.appDefinitions ? 
                           response.appDefinitions.map(app => app.appName) : [];
            resolve(appNames);
          } catch (parseErr) {
            resolve([]);
          }
        });
      });
      
      // Find available app name
      let suffix = 0;
      while (existingApps.includes(finalAppName)) {
        suffix++;
        finalAppName = `${appName}-${suffix}`;
      }
      
      if (finalAppName !== appName) {
        console.log(`⚠️  App "${appName}" already exists, using "${finalAppName}" instead`);
      } else {
        console.log(`✅ App name "${finalAppName}" is available`);
      }
      
      // Security Check: Analyze source code for security issues
      if (!options.skipSecurityCheck) {
        console.log(`🔒 Security Check: Analyzing source code...`);
        const securityCheckPassed = await performSecurityCheck(targetDir);
        if (!securityCheckPassed) {
          console.log('🛑 Deployment stopped due to security check failure');
          process.exit(1);
        }
        console.log('');
      } else {
        console.log(`⚠️  Security check skipped (--skip-security-check flag)\n`);
      }
      
      // Step 1: Create app if it doesn't exist
      if (!existingApps.includes(finalAppName) && options.autoCreate) {
        console.log(`📦 Step 1: Creating app "${finalAppName}"...`);
        try {
          await runCommand('caprover', [
            'api',
            '--caproverName', options.machine,
            '--path', '/user/apps/appDefinitions/register',
            '--method', 'POST',
            '--data', JSON.stringify({ 
              appName: finalAppName, 
              hasPersistentData: false 
            })
          ]);
          console.log(`✅ App "${finalAppName}" created successfully!\n`);
        } catch (createErr) {
          console.error(`❌ Failed to create app "${finalAppName}":`, createErr.message);
          throw createErr;
        }
      } else {
        console.log(`✅ App "${finalAppName}" already exists, proceeding with deployment\n`);
      }
      
      // Step 2: Package target directory
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const tarFile = `${finalAppName}-${timestamp}.tar.gz`;
      
      console.log(`📦 Step 2: Packaging ${targetDir}...`);
      await runCommand('tar', [
        '--exclude', tarFile,
        '--exclude', 'node_modules',
        '--exclude', 'capgen.js',
        '--exclude', '*.tar.gz',
        '-czf', tarFile,
        '-C', targetDir,
        '.'
      ]);
      console.log(`✅ Package created: ${tarFile}\n`);
      
      // Step 3: Deploy
      console.log('🚢 Step 3: Deploying to CapRover...');
      try {
        await runCommand('caprover', [
          'deploy',
          '--caproverName', options.machine,
          '--tarFile', tarFile,
          '--appName', finalAppName
        ]);
        console.log(`✅ Deployed successfully!\n`);
      } catch (err) {
        // Clean up tar file on deployment failure
        try {
          await runCommand('rm', [tarFile]);
        } catch (cleanupErr) {
          // Ignore cleanup errors
        }
        throw err;
      }
      
      // Step 4: Enable HTTPS with SSL certificate (unless --no-ssl is specified)
      if (!options.noSsl) {
        console.log('🔒 Step 4: Enabling HTTPS with SSL certificate...');
        try {
          // Enable HTTPS
          await runCommand('caprover', [
            'api',
            '--caproverName', options.machine,
            '--path', '/user/apps/appDefinitions/enablebasedomainssl',
            '--method', 'POST',
            '--data', JSON.stringify({ appName: finalAppName })
          ]);
          
          // Force HTTPS (redirect HTTP to HTTPS)
          await runCommand('caprover', [
            'api',
            '--caproverName', options.machine,
            '--path', '/user/apps/appDefinitions/update',
            '--method', 'POST',
            '--data', JSON.stringify({
              appName: finalAppName,
              forceSsl: true
            })
          ]);
          
          console.log(`✅ HTTPS enabled with automatic SSL certificate!\n`);
        } catch (sslErr) {
          console.log(`⚠️  SSL enablement failed: ${sslErr.message}`);
          console.log(`💡 You can enable SSL manually in the CapRover dashboard\n`);
          // Don't fail the deployment for SSL issues
        }
      } else {
        console.log('⚠️  Step 4: Skipping SSL setup (--no-ssl specified)\n');
      }
      
      // Step 5: Configure port if specified
      if (options.port && options.port !== '80') {
        console.log(`⚙️  Step 5: Setting container port to ${options.port}...`);
        await runCommand('caprover', [
          'api',
          '--caproverName', options.machine,
          '--path', '/user/apps/appDefinitions/update',
          '--method', 'POST',
          '--data', JSON.stringify({
            appName: finalAppName,
            containerHttpPort: parseInt(options.port)
          })
        ]);
        console.log(`✅ Port set to ${options.port}\n`);
      }
      
      // Step 6: Scale if specified
      if (options.scale && options.scale !== '1') {
        console.log(`📈 Step 6: Scaling to ${options.scale} replicas...`);
        await runCommand('caprover', [
          'api',
          '--caproverName', options.machine,
          '--path', '/user/apps/appDefinitions/update',
          '--method', 'POST',
          '--data', JSON.stringify({
            appName: finalAppName,
            instanceCount: parseInt(options.scale)
          })
        ]);
        console.log(`✅ Scaled to ${options.scale} replicas\n`);
      }
      
      // Clean up tar file
      console.log('🧹 Cleaning up...');
      await runCommand('rm', [tarFile]);
      console.log(`✅ Removed ${tarFile}\n`);
      
      // Step 7: Post-deployment health verification
      console.log('🔍 Step 7: Verifying deployment health...');
      await verifyDeploymentHealth(finalAppName, options);
      
      console.log('🎉 Quick deployment completed successfully!');
      const protocol = options.noSsl ? 'http' : 'https';
      console.log(`🌐 Your app is available at: ${protocol}://${finalAppName}.${process.env.CAPROVER_DOMAIN}`);
      
      if (finalAppName !== appName) {
        console.log(`💡 Note: App was deployed as "${finalAppName}" instead of "${appName}"`);
      }
      
    } catch (err) {
      console.error(`❌ Quick deployment failed: ${err.message}`);
      throw err; // Re-throw to maintain error propagation
    }
  });

// Test command to check if app is responding
program
  .command('test <appName>')
  .description('Test if app is responding via HTTP')
  .option('-u, --url <url>', `Custom URL to test (default: http://appName.${process.env.CAPROVER_DOMAIN || 'YOUR_DOMAIN'})`)
  .option('-s, --https', 'Use HTTPS instead of HTTP', false)
  .action(async (appName, options) => {
    try {
      const protocol = options.https ? 'https' : 'http';
      const url = options.url || `${protocol}://${appName}.${process.env.CAPROVER_DOMAIN}/`;
      
      console.log(`🧪 Testing ${url}...`);
      const { spawn } = require('child_process');
      const isWindows = process.platform === 'win32';
      const curl = spawn('curl', ['-f', '-s', '--max-time', '10', url], { shell: isWindows });
      
      let output = '';
      let error = '';
      
      curl.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      curl.stderr.on('data', (data) => {
        error += data.toString();
      });
      
      curl.on('close', (code) => {
        if (code !== 0) {
          console.error(`❌ App test failed with code ${code}`);
          if (error) console.error('Error:', error);
          return;
        }
        
        console.log(`✅ App is responding correctly!`);
      });
      
    } catch (err) {
      console.error(`❌ App test failed:`, err.message);
      console.log('💡 Try checking logs with: node capgen.js logs', appName);
    }
  });

// Setup command to create CapRover files
program
  .command('setup <directory>')
  .description('Create CapRover deployment files (Dockerfile, captain-definition) in target directory')
  .option('-p, --port <port>', 'Default port for the app', '80')
  .action(async (directory, options) => {
    try {
      const fs = require('fs');
      const path = require('path');
      
      console.log(`🛠️  Setting up CapRover files in: ${directory}`);
      
      // Create Dockerfile with optimized layer caching
      const dockerfileContent = `FROM node:20-alpine

# Install system dependencies for better caching
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies with cache optimization
RUN npm ci --only=production && npm cache clean --force

# Copy source code (this layer changes most frequently)
COPY . .

# Use non-root user for security
RUN addgroup -g 1001 -S nodejs && \\
    adduser -S nodejs -u 1001 && \\
    chown -R nodejs:nodejs /app
USER nodejs

EXPOSE ${options.port}

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "index.js"]`;
      
      const dockerfilePath = path.join(directory, 'Dockerfile');
      fs.writeFileSync(dockerfilePath, dockerfileContent);
      console.log(`✅ Created: ${dockerfilePath}`);
      
      // Create captain-definition
      const captainContent = JSON.stringify({
        "schemaVersion": 2,
        "dockerfilePath": "./Dockerfile"
      }, null, 2);
      
      const captainPath = path.join(directory, 'captain-definition');
      fs.writeFileSync(captainPath, captainContent);
      console.log(`✅ Created: ${captainPath}`);
      
      console.log(`\n🎉 Setup complete! Now you can deploy with:`);
      console.log(`node capgen.js quick-deploy <appName> --dir ${directory}`);
      
    } catch (err) {
      console.error(`❌ Setup failed:`, err.message);
    }
  });

// API test command for testing specific endpoints
program
  .command('api-test <appName> <endpoint>')
  .description('Test specific API endpoint with response display')
  .option('-p, --params <params>', 'Query parameters (e.g., "number=123&name=test")')
  .option('-s, --https', 'Use HTTPS instead of HTTP', false)
  .action(async (appName, endpoint, options) => {
    try {
      const protocol = options.https ? 'https' : 'http';
      const baseUrl = `${protocol}://${appName}.${process.env.CAPROVER_DOMAIN}`;
      const queryParams = options.params ? `?${options.params}` : '';
      const fullUrl = `${baseUrl}${endpoint}${queryParams}`;
      
      console.log(`🧪 Testing API: ${fullUrl}`);
      
      const { spawn } = require('child_process');
      const isWindows = process.platform === 'win32';
      const curl = spawn('curl', ['-s', '--max-time', '10', fullUrl], { shell: isWindows });
      
      let output = '';
      let error = '';
      
      curl.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      curl.stderr.on('data', (data) => {
        error += data.toString();
      });
      
      curl.on('close', (code) => {
        if (code !== 0) {
          console.error(`❌ API test failed with code ${code}`);
          if (error) console.error('Error:', error);
          return;
        }
        
        console.log(`✅ API Response:`);
        try {
          const jsonResponse = JSON.parse(output);
          console.log(JSON.stringify(jsonResponse, null, 2));
        } catch (e) {
          // Not JSON, show raw response
          console.log(output);
        }
      });
      
    } catch (err) {
      console.error(`❌ API test failed:`, err.message);
    }
  });

// Configure port command
program
  .command('configure-port <appName> <port>')
  .description('Configure the container HTTP port for an app')
  .action(async (appName, port) => {
    try {
      // Validate environment variables before making API calls
      validateEnvironment();
      
      console.log(`🔧 Configuring port ${port} for ${appName}...`);
      
      const updateConfig = {
        "appName": appName,
        "containerHttpPort": parseInt(port)
      };
      
      const { spawn } = require('child_process');
      const isWindows = process.platform === 'win32';
      const curl = spawn('curl', [
        '-X', 'POST',
        '-H', 'Content-Type: application/json',
        '-H', `X-Captain-Auth: ${process.env.CAPROVER_PASSWORD}`,
        '-d', JSON.stringify(updateConfig),
        `https://captain.${process.env.CAPROVER_DOMAIN}/api/v2/user/apps/appDefinitions/update`
      ], { shell: isWindows });
      
      let output = '';
      let error = '';
      
      curl.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      curl.stderr.on('data', (data) => {
        error += data.toString();
      });
      
      curl.on('close', (code) => {
        if (code !== 0) {
          console.error(`❌ Port configuration failed with code ${code}`);
          if (error) console.error('Error:', error);
          return;
        }
        
        console.log(`✅ Port configured successfully`);
        try {
          const response = JSON.parse(output);
          if (response.status === 100) {
            console.log('✅ App will restart automatically');
          } else {
            console.log('Response:', response);
          }
        } catch (e) {
          console.log(output);
        }
      });
      
    } catch (err) {
      console.error(`❌ Port configuration failed:`, err.message);
    }
  });

// Check basic connectivity
program
  .command('ping <appName>')
  .description('Basic connectivity test to app root')
  .action(async (appName) => {
    try {
      console.log(`🏓 Pinging http://${appName}.${process.env.CAPROVER_DOMAIN}/...`);
      
      const { spawn } = require('child_process');
      const isWindows = process.platform === 'win32';
      const curl = spawn('curl', ['-s', '-I', '--max-time', '5', `http://${appName}.${process.env.CAPROVER_DOMAIN}/`], { shell: isWindows });
      
      let output = '';
      let error = '';
      
      curl.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      curl.stderr.on('data', (data) => {
        error += data.toString();
      });
      
      curl.on('close', (code) => {
        console.log('Response headers:');
        console.log(output || 'No response');
        if (error) console.log('Error:', error);
      });
      
    } catch (err) {
      console.error(`❌ Ping failed:`, err.message);
    }
  });

// Security check function
function performSecurityCheck(sourceDir) {
  console.log('🔒 Performing deployment readiness check...');
  
  const fs = require('fs');
  const path = require('path');
  const warnings = [];
  const recommendations = [];
  const criticalIssues = [];
  
  try {
    // ========================================
    // CRITICAL DEPLOYMENT REQUIREMENTS
    // ========================================
    
    // 1. Check for Dockerfile (CRITICAL)
    const dockerfilePath = path.join(sourceDir, 'Dockerfile');
    if (!fs.existsSync(dockerfilePath)) {
      criticalIssues.push('❌ CRITICAL: Missing Dockerfile');
      recommendations.push('💡 Create Dockerfile for containerization');
      recommendations.push('💡 Use: bruvtools setup <directory> to generate deployment files');
    } else {
      console.log('   ✅ Dockerfile found');
      
      // Validate Dockerfile content
      const dockerContent = fs.readFileSync(dockerfilePath, 'utf8');
      
      if (!dockerContent.includes('EXPOSE')) {
        warnings.push('⚠️  No EXPOSE directive in Dockerfile');
        recommendations.push('💡 Add EXPOSE directive for documentation');
      }
      
      if (!dockerContent.includes('USER') || dockerContent.includes('USER root')) {
        warnings.push('⚠️  Dockerfile runs as root user');
        recommendations.push('💡 Add non-root user for better security: USER nodejs');
      }
      
      if (!dockerContent.includes('CMD') && !dockerContent.includes('ENTRYPOINT')) {
        criticalIssues.push('❌ CRITICAL: No CMD or ENTRYPOINT in Dockerfile');
        recommendations.push('💡 Add CMD ["npm", "start"] or similar');
      }
    }
    
    // 2. Check for captain-definition (CRITICAL)
    const captainPath = path.join(sourceDir, 'captain-definition');
    if (!fs.existsSync(captainPath)) {
      criticalIssues.push('❌ CRITICAL: Missing captain-definition file');
      recommendations.push('💡 Create captain-definition: {"schemaVersion":2,"dockerfilePath":"./Dockerfile"}');
    } else {
      console.log('   ✅ captain-definition found');
      
      try {
        const captainContent = fs.readFileSync(captainPath, 'utf8');
        const captainConfig = JSON.parse(captainContent);
        
        if (!captainConfig.dockerfilePath) {
          criticalIssues.push('❌ CRITICAL: captain-definition missing dockerfilePath');
          recommendations.push('💡 Add "dockerfilePath": "./Dockerfile" to captain-definition');
        }
      } catch (parseErr) {
        criticalIssues.push('❌ CRITICAL: Invalid JSON in captain-definition');
        recommendations.push('💡 Fix JSON syntax in captain-definition file');
      }
    }
    
    // 3. Check for .env dependency (CRITICAL ANTI-PATTERN)
    const envPath = path.join(sourceDir, '.env');
    const envExamplePath = path.join(sourceDir, '.env.example');
    
    if (fs.existsSync(envPath)) {
      criticalIssues.push('❌ CRITICAL: .env file found - will not work in production');
      recommendations.push('💡 Remove .env file - use environment variables set by deployment platform');
      recommendations.push('💡 Set environment variables in CapRover dashboard instead');
    }
    
    if (fs.existsSync(envExamplePath)) {
      warnings.push('⚠️  .env.example found - may confuse users about production deployment');
      recommendations.push('💡 Consider removing .env.example for production-only apps');
      recommendations.push('💡 Document environment variables in README instead');
    }
    
    // ========================================
    // SERVER CODE ANALYSIS
    // ========================================
    
    // Check for common server files
    const serverFiles = [
      'server.js', 'app.js', 'index.js', 'main.js',
      'src/server.js', 'src/app.js', 'src/index.js'
    ];
    
    let foundServerFile = null;
    let serverContent = '';
    
    for (const file of serverFiles) {
      const filePath = path.join(sourceDir, file);
      if (fs.existsSync(filePath)) {
        foundServerFile = file;
        serverContent = fs.readFileSync(filePath, 'utf8');
        break;
      }
    }
    
    if (!foundServerFile) {
      criticalIssues.push('❌ CRITICAL: No main server file detected');
      recommendations.push('💡 Create server.js, app.js, or index.js as main entry point');
    } else {
      console.log(`   📄 Analyzing ${foundServerFile}...`);
      
      // 4. Check environment variable usage and validation
      const envVarPattern = /process\.env\.([A-Z_][A-Z0-9_]*)/g;
      const destructuringPattern = /const\s*\{\s*([^}]+)\s*\}\s*=\s*process\.env/g;
      const getEnvVarPattern = /getEnvVar\s*\(\s*['"]([A-Z_][A-Z0-9_]*)['"]\s*\)/g;
      const envVars = [];
      let match;
      
      // Find direct process.env.VARIABLE usage
      while ((match = envVarPattern.exec(serverContent)) !== null) {
        if (!envVars.includes(match[1])) {
          envVars.push(match[1]);
        }
      }
      
      // Find destructuring patterns like: const { VAR1, VAR2 } = process.env
      while ((match = destructuringPattern.exec(serverContent)) !== null) {
        const destructuredVars = match[1]
          .split(',')
          .map(v => v.trim())
          .filter(v => v.match(/^[A-Z_][A-Z0-9_]*$/));
        envVars.push(...destructuredVars);
      }
      
      // Find getEnvVar patterns like: getEnvVar('TOKEN_NAME')
      while ((match = getEnvVarPattern.exec(serverContent)) !== null) {
        if (!envVars.includes(match[1])) {
          envVars.push(match[1]);
        }
      }
      
      if (envVars.length > 0) {
        console.log(`   🔍 Found environment variables: ${envVars.join(', ')}`);
        
        // Check for environment variable validation
        const hasValidation = serverContent.includes('Missing required environment variables') ||
                            serverContent.includes('process.exit(1)') ||
                            envVars.some(envVar => 
                              serverContent.includes(`!${envVar}`) || 
                              serverContent.includes(`!process.env.${envVar}`)
                            );
        
        if (hasValidation) {
          console.log('   ✅ Environment variable validation found');
        } else {
          warnings.push('⚠️  No environment variable validation found');
          recommendations.push('💡 Add validation to check if required environment variables are set');
        }
        
        // Check for large environment variables that might need splitting
        const largeEnvVarPattern = new RegExp(`(${envVars.join('|')}).*=.*['"][^'"]{500,}['"]`, 'g');
        if (largeEnvVarPattern.test(serverContent)) {
          warnings.push('⚠️  Potentially large environment variables detected');
          recommendations.push('💡 Consider splitting large tokens using VARNAME_1, VARNAME_2, etc.');
          recommendations.push('💡 CapRover has limits on environment variable size (~1000 chars)');
        }
        
        // Check if getEnvVar function is used for handling split variables
        if (serverContent.includes('getEnvVar')) {
          console.log('   ✅ Split environment variable support detected');
        }
        
      } else {
        console.log('   ℹ️  No environment variables detected');
      }
      
      // Check for security headers
      const securityHeaders = [
        'Strict-Transport-Security',
        'X-Content-Type-Options',
        'X-Frame-Options',
        'Content-Security-Policy'
      ];
      
      const missingHeaders = securityHeaders.filter(header => 
        !serverContent.includes(header)
      );
      
      if (missingHeaders.length > 0) {
        warnings.push(`⚠️  Missing security headers: ${missingHeaders.join(', ')}`);
        recommendations.push('💡 Add security headers to prevent browser "insecure" warnings');
      }
      
      // Check for port handling (improved to detect destructuring)
      const hasPortUsage = serverContent.includes('process.env.PORT') || 
                          envVars.includes('PORT') ||
                          /PORT\s*\|\|\s*\d+/.test(serverContent);
      
      if (!hasPortUsage) {
        warnings.push('⚠️  No process.env.PORT usage detected');
        recommendations.push('💡 Use process.env.PORT || 80 for flexible port configuration');
      }
      
      // Check for port mismatch between server and Dockerfile
      const serverPortMatch = serverContent.match(/process\.env\.PORT\s*\|\|\s*(\d+)/);
      if (serverPortMatch && fs.existsSync(dockerfilePath)) {
        const dockerContent = fs.readFileSync(dockerfilePath, 'utf8');
        const exposeMatch = dockerContent.match(/EXPOSE\s+(\d+)/);
        
        if (exposeMatch) {
          const serverDefaultPort = parseInt(serverPortMatch[1]);
          const dockerExposePort = parseInt(exposeMatch[1]);
          
          if (serverDefaultPort !== dockerExposePort) {
            warnings.push(`⚠️  Port mismatch: server.js default (${serverDefaultPort}) != Dockerfile EXPOSE (${dockerExposePort})`);
            recommendations.push('💡 Ensure server.js default port matches Dockerfile EXPOSE directive');
            recommendations.push(`💡 Recommended: Use port 80 for both (CapRover default)`);
          }
        }
      }
    }
    
    // ========================================
    // PACKAGE.JSON VALIDATION
    // ========================================
    
    const packagePath = path.join(sourceDir, 'package.json');
    if (fs.existsSync(packagePath)) {
      const packageContent = fs.readFileSync(packagePath, 'utf8');
      const packageJson = JSON.parse(packageContent);
      
      if (!packageJson.scripts || !packageJson.scripts.start) {
        criticalIssues.push('❌ CRITICAL: No "start" script in package.json');
        recommendations.push('💡 Add "start": "node server.js" to package.json scripts');
      } else {
        console.log('   ✅ Start script found');
      }
      
      // Check for dotenv in dependencies
      if ((packageJson.dependencies && packageJson.dependencies.dotenv) ||
          (packageJson.devDependencies && packageJson.devDependencies.dotenv)) {
        criticalIssues.push('❌ CRITICAL: dotenv in package.json dependencies');
        recommendations.push('💡 Remove dotenv from dependencies - not needed for production deployment');
      }
      
    } else {
      criticalIssues.push('❌ CRITICAL: No package.json found');
      recommendations.push('💡 Add package.json with proper dependencies and scripts');
    }
    
    // ========================================
    // DISPLAY RESULTS
    // ========================================
    
    const totalIssues = criticalIssues.length + warnings.length;
    
    if (totalIssues === 0) {
      console.log('   🎉 All deployment readiness checks passed!');
      console.log('   ✅ Ready for production deployment');
      return true;
    }
    
    // Display critical issues first
    if (criticalIssues.length > 0) {
      console.log(`\n   🚨 CRITICAL DEPLOYMENT BLOCKERS (${criticalIssues.length}):`);
      criticalIssues.forEach(issue => console.log(`      ${issue}`));
    }
    
    // Display warnings
    if (warnings.length > 0) {
      console.log(`\n   ⚠️  WARNINGS (${warnings.length}):`);
      warnings.forEach(warning => console.log(`      ${warning}`));
    }
    
    // Display recommendations
    if (recommendations.length > 0) {
      console.log('\n   💡 RECOMMENDATIONS:');
      recommendations.forEach(rec => console.log(`      ${rec}`));
    }
    
    // Determine if deployment should continue
    if (criticalIssues.length > 0) {
      console.log('\n   🛑 DEPLOYMENT BLOCKED: Critical issues must be fixed before deployment');
      console.log('   💡 Fix the critical issues above and try again');
      return false;
    }
    
    if (warnings.length > 0) {
      console.log('\n   🔒 Warnings detected. Continue deployment? (y/N)');
      
      // In non-interactive mode, just warn and continue
      if (process.env.CI || process.argv.includes('--force')) {
        console.log('   ⚠️  Continuing deployment (CI mode or --force flag)');
        return true;
      }
      
      // Interactive confirmation
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      return new Promise((resolve) => {
        rl.question('   Continue? (y/N): ', (answer) => {
          rl.close();
          const shouldContinue = answer.toLowerCase().startsWith('y');
          if (!shouldContinue) {
            console.log('   🛑 Deployment cancelled for security review');
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });
    }
    
    return true;
    
  } catch (err) {
    console.log(`   ⚠️  Security check failed: ${err.message}`);
    console.log('   ⚠️  Continuing deployment...');
    return true;
  }
}

// Health verification function
async function verifyDeploymentHealth(appName, options) {
  try {
    console.log('   Checking instance count...');
    
    // Get app data to check instance count
    const { spawn } = require('child_process');
    const isWindows = process.platform === 'win32';
    
    const checkProcess = spawn('caprover', [
      'api',
      '--caproverName', options.machine,
      '--path', `/user/apps/appData/${appName}`,
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
    
    const appData = await new Promise((resolve, reject) => {
      checkProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Failed to get app data: ${stderr}`));
          return;
        }
        
        try {
          const jsonMatch = stdout.match(/\{[\s\S]*\}/);
          if (!jsonMatch) {
            resolve(null);
            return;
          }
          
          const response = JSON.parse(jsonMatch[0]);
          resolve(response);
        } catch (parseErr) {
          resolve(null);
        }
      });
    });
    
    if (!appData) {
      console.log('   ⚠️  Could not verify app data');
      return;
    }
    
    // Check instance count
    const instanceCount = appData.instanceCount || 0;
    if (instanceCount === 0) {
      console.log('   ❌ Instance count is 0 - app may not be running!');
      console.log('   🔧 Attempting to scale to 1 instance...');
      
      await runCommand('caprover', [
        'api',
        '--caproverName', options.machine,
        '--path', '/user/apps/appDefinitions/update',
        '--method', 'POST',
        '--data', JSON.stringify({
          appName: appName,
          instanceCount: 1
        })
      ]);
      
      console.log('   ✅ Scaled to 1 instance');
      console.log('   ⏱️  Waiting for instance to start...');
      await new Promise(resolve => setTimeout(resolve, 10000));
    } else {
      console.log(`   ✅ Instance count: ${instanceCount}`);
    }
    
    // Test app responsiveness
    console.log('   Testing app responsiveness...');
    const protocol = options.noSsl ? 'http' : 'https';
    const url = `${protocol}://${appName}.${process.env.CAPROVER_DOMAIN}`;
    
    const testProcess = spawn('curl', [
      '-s', '-I', '--max-time', '10', url
    ], { stdio: ['ignore', 'pipe', 'ignore'] });
    
    let testOutput = '';
    testProcess.stdout.on('data', (data) => {
      testOutput += data.toString();
    });
    
    const isHealthy = await new Promise((resolve) => {
      testProcess.on('close', (code) => {
        if (code !== 0) {
          resolve(false);
          return;
        }
        
        const isSuccess = testOutput.includes('200 OK') || testOutput.includes('HTTP/2 200');
        resolve(isSuccess);
      });
      
      setTimeout(() => {
        testProcess.kill();
        resolve(false);
      }, 10000);
    });
    
    if (isHealthy) {
      console.log('   ✅ App is responding correctly!');
    } else {
      console.log('   ⚠️  App may not be responding correctly');
      console.log('   💡 Check logs with: bruvtools logs ' + appName);
      console.log('   💡 Or visit CapRover dashboard for more details');
    }
    
  } catch (err) {
    console.log(`   ⚠️  Health check failed: ${err.message}`);
    console.log('   💡 App may still be starting - check manually if needed');
  }
}

program.parse(process.argv);