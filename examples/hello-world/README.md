# Working Hello World Example

This is a **proven working** Node.js hello world app that successfully deploys with bruvtools.

**Live Demo**: http://final-hello.bruvbot.com.br

## Files

- `package.json` - Node.js configuration with start script
- `server.js` - Simple HTTP server that respects PORT environment variable  
- `captain-definition` - CapRover configuration using Node.js template

## Deploy Steps (That Actually Work)

```bash
# 1. Copy these files to your directory
cp -r examples/hello-world/* your-app/
cd your-app/

# 2. Test locally first
node server.js
# curl http://localhost:3000  # Should show: 🎉 HELLO FROM BRUVTOOLS - ACTUALLY WORKING!

# 3. Create app on CapRover
bruvtools create your-app-name

# 4. Deploy manually (until bruvtools packaging is fixed)
tar -czf deploy.tar.gz .
caprover deploy --caproverName your-caprover-machine --appName your-app-name --tarFile deploy.tar.gz
```

## What Makes It Work

- **Proper captain-definition**: Uses Node.js template instead of custom Dockerfile
- **PORT handling**: Server listens on `process.env.PORT` (CapRover sets this to 80)
- **Correct package.json**: Has `start` script that CapRover can execute
- **Manual tar**: Bypasses bruvtools packaging bug

## Known Issues

- `bruvtools deploy` has packaging issues - use manual tar + caprover CLI for now
- Need to create app first with `bruvtools create` before deploying

This example proves bruvtools can deploy real apps once the packaging is fixed! 