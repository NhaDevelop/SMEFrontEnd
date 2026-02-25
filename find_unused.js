import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function kebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

const components = [];
walkDir(path.join(process.cwd(), 'components'), filePath => {
  if (filePath.endsWith('.vue')) {
    components.push({
      path: filePath,
      name: path.basename(filePath, '.vue')
    });
  }
});

const searchDirs = ['pages', 'components', 'layouts', 'app.vue'];
const allFiles = [];

searchDirs.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, f => allFiles.push(f));
    } else {
      allFiles.push(fullPath);
    }
  }
});

console.log(`Checking ${components.length} components across ${allFiles.length} files...`);

const unused = [];

for (const comp of components) {
  const name = comp.name;
  const kebab = kebabCase(name);
  let used = false;

  for (const file of allFiles) {
    if (file === comp.path) continue; // Skip checking the file against itself
    
    const content = fs.readFileSync(file, 'utf8');
    // Regex for component usage
    const regex1 = new RegExp(`\\b${name}\\b`);
    const regex2 = new RegExp(`<${name}\\b`);
    const regex3 = new RegExp(`<${kebab}\\b`);
    
    if (regex1.test(content) || regex2.test(content) || regex3.test(content)) {
      used = true;
      break;
    }
  }
  
  if (!used) {
    unused.push(comp.path);
  }
}

console.log("=== UNUSED COMPONENTS ===");
unused.forEach(u => console.log(u));

const composables = [];
walkDir(path.join(process.cwd(), 'composables'), filePath => {
  if (filePath.endsWith('.ts') || filePath.endsWith('.js')) {
    composables.push({
      path: filePath,
      name: path.basename(filePath).replace(/\.(ts|js)$/, '')
    });
  }
});

const unusedComposables = [];
for (const comp of composables) {
  let used = false;
  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const regex = new RegExp(`\\b${comp.name}\\b`);
    if (regex.test(content)) {
      used = true;
      break;
    }
  }
  if (!used) {
    unusedComposables.push(comp.path);
  }
}

console.log("=== UNUSED COMPOSABLES ===");
unusedComposables.forEach(u => console.log(u));
