#!/bin/bash

# bruvtools Installation Script
# Install bruvtools globally for easy CLI access

set -e

echo "🚀 Installing bruvtools - Universal Cloud Deployment CLI"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    echo "   Please install Node.js (>=16.0.0) from https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
MIN_VERSION="16.0.0"

if [ "$(printf '%s\n' "$MIN_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$MIN_VERSION" ]; then
    echo "❌ Node.js version $NODE_VERSION is not supported."
    echo "   Please upgrade to Node.js >= $MIN_VERSION"
    exit 1
fi

echo "✅ Node.js $NODE_VERSION detected"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is required but not found."
    echo "   Please install npm (usually comes with Node.js)"
    exit 1
fi

echo "✅ npm detected"
echo ""

# Option 1: Install from npm (if published)
echo "🔄 Installing bruvtools globally..."

# For now, install from local directory
# TODO: Change this to 'npm install -g bruvtools' when published to npm
if [ -f "package.json" ]; then
    echo "📦 Installing from local directory..."
    npm install -g .
else
    echo "📦 Cloning from repository..."
    TEMP_DIR=$(mktemp -d)
    git clone https://github.com/fcavalcantirj/bruvtools.git "$TEMP_DIR"
    cd "$TEMP_DIR"
    npm install
    npm install -g .
    cd - > /dev/null
    rm -rf "$TEMP_DIR"
fi

echo ""
echo "🎉 bruvtools installed successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Set up your environment:"
echo "      cp .env.example .env"
echo "      # Edit .env with your CapRover password"
echo ""
echo "   2. Configure your provider in bruvtools.yml"
echo ""
echo "   3. Start deploying:"
echo "      bruvtools services"
echo "      bruvtools deploy my-app"
echo ""
echo "💡 For help: bruvtools --help"
echo "📚 Documentation: https://github.com/fcavalcantirj/bruvtools"
echo ""
echo "🚀 Deploy Anywhere, Manage Everything!" 