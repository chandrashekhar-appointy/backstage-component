const fs = require('fs');
const path = require('path');

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate random hex color
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const backgroundColor = getRandomColor();
const timestamp = new Date().toISOString();

// Generate HTML content with random background color
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo Service Build Output</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, ${backgroundColor} 0%, ${backgroundColor}DD 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .container {
            text-align: center;
            padding: 40px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }

        h1 {
            font-size: 3rem;
            margin-bottom: 20px;
        }

        .color-info {
            font-size: 1.5rem;
            margin: 20px 0;
            padding: 15px;
            background: rgba(0,0,0,0.2);
            border-radius: 10px;
        }

        .timestamp {
            font-size: 1rem;
            opacity: 0.8;
            margin-top: 20px;
        }

        .badge {
            display: inline-block;
            padding: 10px 20px;
            background: rgba(255,255,255,0.2);
            border-radius: 25px;
            margin: 10px;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎨 Demo Service Build Output</h1>
        <div class="color-info">
            <strong>Background Color:</strong><br>
            <code>${backgroundColor}</code>
        </div>
        <div class="badge">✅ Build Successful</div>
        <div class="badge">🚀 Deployed to GCS</div>
        <div class="timestamp">
            Generated: ${timestamp}
        </div>
    </div>
</body>
</html>
`;

// Write HTML file
const htmlPath = path.join(outputDir, 'index.html');
fs.writeFileSync(htmlPath, htmlContent, 'utf8');

console.log(`✅ Build output generated successfully!`);
console.log(`📁 Output directory: ${outputDir}`);
console.log(`🎨 Background color: ${backgroundColor}`);
console.log(`📄 Generated file: ${htmlPath}`);
