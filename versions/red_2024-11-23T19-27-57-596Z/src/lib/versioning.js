import fs from 'fs';
import path from 'path';

export function saveVersion(name) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const versionDir = path.join('versions', `${name}_${timestamp}`);
  
  // Create versions directory if it doesn't exist
  if (!fs.existsSync('versions')) {
    fs.mkdirSync('versions');
  }
  
  // Create new version directory
  fs.mkdirSync(versionDir);
  
  // Copy all files except node_modules and versions directory
  copyFiles('.', versionDir);
  
  return versionDir;
}

export function listVersions() {
  if (!fs.existsSync('versions')) {
    return [];
  }
  return fs.readdirSync('versions');
}

export function restoreVersion(versionDir) {
  if (!fs.existsSync(versionDir)) {
    throw new Error('Version not found');
  }
  
  // Copy files back to root directory
  copyFiles(versionDir, '.');
}

function copyFiles(src, dest) {
  const items = fs.readdirSync(src);
  
  items.forEach(item => {
    if (item === 'node_modules' || item === 'versions') {
      return;
    }
    
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath);
      }
      copyFiles(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}