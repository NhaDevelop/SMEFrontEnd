const fs = require('fs');
const path = require('path');

const historyDir = path.join(process.env.HOME, 'Library/Application Support/Antigravity/User/History');

if (!fs.existsSync(historyDir)) {
  console.log('No history directory found.');
  process.exit(0);
}

const folders = fs.readdirSync(historyDir);

let restoredCount = 0;

for (const folder of folders) {
  const folderPath = path.join(historyDir, folder);
  if (!fs.statSync(folderPath).isDirectory()) continue;
  
  const entriesPath = path.join(folderPath, 'entries.json');
  if (!fs.existsSync(entriesPath)) continue;
  
  try {
    const data = JSON.parse(fs.readFileSync(entriesPath, 'utf8'));
    const resourceUrl = data.resource;
    if (!resourceUrl || !resourceUrl.startsWith('file:///')) continue;
    
    const filePath = decodeURIComponent(resourceUrl.replace('file://', ''));
    if (!filePath.startsWith('/Users/paypanha/SMEFrontend/')) continue;
    
    // Find the newest entry
    let newestEntry = null;
    let newestTime = 0;
    
    for (const entry of data.entries) {
      if (entry.timestamp > newestTime) {
        newestTime = entry.timestamp;
        newestEntry = entry;
      }
    }
    
    if (newestEntry) {
      const sourceFile = path.join(folderPath, newestEntry.id);
      if (fs.existsSync(sourceFile)) {
        const sourceTime = fs.statSync(sourceFile).mtimeMs;
        const targetTime = fs.existsSync(filePath) ? fs.statSync(filePath).mtimeMs : 0;
        
        // If the local history file is newer than the current file, OR the current file is missing
        // Wait, git checkout -- . might have made the current file's mtime "just now".
        // Instead, we just read the content. If it's different, we ask to restore or just restore.
        const historyContent = fs.readFileSync(sourceFile, 'utf8');
        const currentContent = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
        
        if (historyContent !== currentContent) {
          // Check if we should ignore it if it's too old?
          // Let's only restore if the history entry is from today (last 24 hours)
          if (Date.now() - newestTime < 24 * 60 * 60 * 1000) {
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
            fs.writeFileSync(filePath, historyContent);
            console.log(`Restored: ${filePath}`);
            restoredCount++;
          }
        }
      }
    }
  } catch(e) {
    console.error(`Error processing ${folder}:`, e.message);
  }
}

console.log(`Done. Restored ${restoredCount} files from Antigravity local history.`);
