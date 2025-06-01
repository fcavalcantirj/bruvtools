# Working Hello World Example

This is a **proven working** Node.js hello world app that successfully deploys with bruvtools.

**Live Demos**: 
- [hello-world-fixed.bruvbot.com.br](http://hello-world-fixed.bruvbot.com.br)
- [hello-world-fixed-1.bruvbot.com.br](http://hello-world-fixed-1.bruvbot.com.br)

## Files

- `package.json` - Node.js configuration with start script
- `server.js` - Simple HTTP server that respects PORT environment variable  
- `captain-definition` - CapRover configuration using Node.js template
- `Dockerfile` - Docker configuration for containerized deployment

## Deploy in One Command ✅

```bash
# 1. Copy these files to your directory
cp -r examples/hello-world/* your-app/
cd your-app/

# 2. Test locally first (optional)
node server.js &
curl http://localhost:3000  # Should show: 🎉 HELLO FROM BRUVTOOLS - ACTUALLY WORKING!
kill %1

# 3. Setup bruvtools (one time)
bruvtools init

# 4. Deploy with smart auto-creation
bruvtools deploy my-app
# ✅ Checks if app exists
# ✅ Auto-creates app if needed  
# ✅ Handles name collisions (my-app-1, my-app-2, etc.)
# ✅ Deploys with clear step-by-step progress
# ✅ Your app is live!
```

**🎯 That's it!** Your app is now live and accessible on the internet.

## What Makes It Work

- **Smart App Checking**: Automatically verifies app availability on CapRover
- **Auto-Creation**: Creates apps automatically if they don't exist
- **Collision Detection**: Uses `-1`, `-2` suffixes for name conflicts
- **Proper captain-definition**: Uses Node.js template for reliable deployment
- **PORT handling**: Server listens on `process.env.PORT` (CapRover requirement)
- **Correct package.json**: Has `start` script that CapRover executes
- **Docker support**: Includes Dockerfile for containerized deployment

## Advanced Usage

### Deploy Multiple Versions
```bash
bruvtools deploy my-app        # Creates my-app
bruvtools deploy my-app        # Creates my-app-1 (collision detected)
bruvtools deploy my-app        # Creates my-app-2 (collision detected)
```

### Deploy to Different Environments
```bash
bruvtools deploy my-app-dev     # Development
bruvtools deploy my-app-staging # Staging  
bruvtools deploy my-app-prod    # Production
```

### Check Status and Logs
```bash
bruvtools status my-app        # Check app status
bruvtools logs my-app          # View app logs
bruvtools test my-app          # Test connectivity
```

## Troubleshooting

**❌ "App name not allowed"**
```bash
# Use lowercase letters and hyphens only
bruvtools deploy my-app-name  # ✅ Good
bruvtools deploy MyAppName    # ❌ Bad
```

**❌ "Authentication failed"**
```bash
# Check your .env file has correct CAPROVER_PASSWORD
cat .env | grep CAPROVER_PASSWORD
```

**❌ Shows default CapRover page**
```bash
# Wait 2-3 minutes for deployment to complete, then try:
curl http://your-app.your-domain.com
```

## Version History

- **v0.2.10**: ✅ Full deployment system working with auto-creation and collision detection
- **v0.2.9**: ❌ Manual deployment required due to packaging issues
- **v0.2.8**: ❌ App creation working, deployment broken

This example proves bruvtools v0.2.10 delivers on the promise of simple, reliable deployment! 🚀 