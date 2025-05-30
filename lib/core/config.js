const fs = require('fs');
const path = require('path');
const os = require('os');
const YAML = require('yaml');

/**
 * Configuration Management for bruvtools
 */
class Config {
  constructor() {
    this.configDir = path.join(os.homedir(), '.bruvtools');
    this.configFile = path.join(this.configDir, 'config.yml');
    this.projectConfigFile = path.join(process.cwd(), 'bruvtools.yml');
    this._config = null;
  }

  /**
   * Get configuration with merging priority:
   * 1. Project config (bruvtools.yml in current directory)
   * 2. Global config (~/.bruvtools/config.yml)
   * 3. Default config
   */
  getConfig() {
    if (this._config) {
      return this._config;
    }

    const defaultConfig = this.getDefaultConfig();
    const globalConfig = this.loadGlobalConfig();
    const projectConfig = this.loadProjectConfig();

    // Merge configs (project overrides global overrides default)
    this._config = this.mergeConfigs(defaultConfig, globalConfig, projectConfig);
    return this._config;
  }

  getDefaultConfig() {
    return {
      default_provider: 'caprover',
      providers: {
        caprover: {
          machine: 'caprover1133onubuntu2204-s-1vcpu-2gb-amd-sfo3-01',
          domain: 'bruvbot.com.br'
        }
      },
      projects: {},
      settings: {
        auto_cleanup: true,
        default_port: 80,
        default_replicas: 1
      }
    };
  }

  loadGlobalConfig() {
    try {
      if (fs.existsSync(this.configFile)) {
        const content = fs.readFileSync(this.configFile, 'utf8');
        return YAML.parse(content) || {};
      }
    } catch (err) {
      console.warn(`⚠️  Failed to load global config: ${err.message}`);
    }
    return {};
  }

  loadProjectConfig() {
    try {
      if (fs.existsSync(this.projectConfigFile)) {
        const content = fs.readFileSync(this.projectConfigFile, 'utf8');
        return YAML.parse(content) || {};
      }
    } catch (err) {
      console.warn(`⚠️  Failed to load project config: ${err.message}`);
    }
    return {};
  }

  mergeConfigs(...configs) {
    const result = {};
    for (const config of configs) {
      this.deepMerge(result, config);
    }
    return result;
  }

  deepMerge(target, source) {
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key]) target[key] = {};
        this.deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }

  saveGlobalConfig(config) {
    try {
      // Ensure config directory exists
      if (!fs.existsSync(this.configDir)) {
        fs.mkdirSync(this.configDir, { recursive: true });
      }

      const yamlContent = YAML.stringify(config);
      fs.writeFileSync(this.configFile, yamlContent, 'utf8');
      
      console.log(`✅ Global config saved to ${this.configFile}`);
      return true;
    } catch (err) {
      console.error(`❌ Failed to save global config: ${err.message}`);
      return false;
    }
  }

  saveProjectConfig(config) {
    try {
      const yamlContent = YAML.stringify(config);
      fs.writeFileSync(this.projectConfigFile, yamlContent, 'utf8');
      
      console.log(`✅ Project config saved to ${this.projectConfigFile}`);
      return true;
    } catch (err) {
      console.error(`❌ Failed to save project config: ${err.message}`);
      return false;
    }
  }

  getProviderConfig(providerName) {
    const config = this.getConfig();
    return config.providers[providerName] || {};
  }

  getProjectConfig(projectName) {
    const config = this.getConfig();
    return config.projects[projectName] || {};
  }

  getDefaultProvider() {
    const config = this.getConfig();
    return config.default_provider || 'caprover';
  }

  setDefaultProvider(providerName) {
    const config = this.getConfig();
    config.default_provider = providerName;
    this._config = config;
    return this.saveGlobalConfig(config);
  }

  addProvider(name, providerConfig) {
    const config = this.getConfig();
    if (!config.providers) config.providers = {};
    config.providers[name] = providerConfig;
    this._config = config;
    return this.saveGlobalConfig(config);
  }

  addProject(name, projectConfig) {
    const config = this.getConfig();
    if (!config.projects) config.projects = {};
    config.projects[name] = projectConfig;
    this._config = config;
    return this.saveProjectConfig({ projects: { [name]: projectConfig } });
  }

  listProviders() {
    const config = this.getConfig();
    return Object.keys(config.providers || {});
  }

  listProjects() {
    const config = this.getConfig();
    return Object.keys(config.projects || {});
  }

  reset() {
    this._config = null;
  }

  // Initialize bruvtools in current directory
  init(providerName = 'caprover', options = {}) {
    const projectConfig = {
      default_provider: providerName,
      providers: {
        [providerName]: options
      },
      projects: {
        [path.basename(process.cwd())]: {
          provider: providerName,
          ...options
        }
      }
    };

    return this.saveProjectConfig(projectConfig);
  }
}

module.exports = new Config(); 