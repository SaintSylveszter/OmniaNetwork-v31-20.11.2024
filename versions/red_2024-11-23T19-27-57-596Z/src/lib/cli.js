#!/usr/bin/env node
import { saveVersion, listVersions, restoreVersion } from './versioning.js';

const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
  case 'save':
    if (!arg) {
      console.error('Please provide a version name');
      process.exit(1);
    }
    const dir = saveVersion(arg);
    console.log(`Version saved in ${dir}`);
    break;
    
  case 'list':
    const versions = listVersions();
    if (versions.length === 0) {
      console.log('No versions found');
    } else {
      console.log('Available versions:');
      versions.forEach(v => console.log(`- ${v}`));
    }
    break;
    
  case 'restore':
    if (!arg) {
      console.error('Please provide a version directory');
      process.exit(1);
    }
    try {
      restoreVersion(arg);
      console.log('Version restored successfully');
    } catch (error) {
      console.error('Failed to restore version:', error.message);
      process.exit(1);
    }
    break;
    
  default:
    console.log(`
Usage:
  node cli.js save <name>     Save current state as a new version
  node cli.js list            List all saved versions
  node cli.js restore <dir>   Restore a specific version
    `);
}