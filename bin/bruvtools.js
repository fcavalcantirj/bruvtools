#!/usr/bin/env node

/**
 * bruvtools - Universal Cloud Deployment CLI
 * Deploy Anywhere, Manage Everything
 */

const CLI = require('../lib/core/cli');

// Handle uncaught exceptions gracefully
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚫 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the CLI
try {
  const cli = new CLI();
  cli.run();
} catch (err) {
  console.error('💀 Fatal error:', err.message);
  process.exit(1);
} 