#!/usr/bin/env ts-node
/**
 * Migration script to convert MDX files to JSON format
 * Run with: npx ts-node scripts/migrate-to-json.ts
 */

import fs from 'fs';
import path from 'path';
import { migrateMDXToJSON } from '../lib/mdx-to-json';

const dataDir = path.join(process.cwd(), 'data');
const outputDir = path.join(process.cwd(), 'data-json');

function migrateDirectory(dir: string, baseOutput: string = outputDir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    if (file === '_meta.json' || file.startsWith('.')) {
      continue;
    }
    
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      const subDir = path.join(baseOutput, file);
      if (!fs.existsSync(subDir)) {
        fs.mkdirSync(subDir, { recursive: true });
      }
      migrateDirectory(fullPath, subDir);
    } else if (file.endsWith('.mdx')) {
      const relativePath = path.relative(dataDir, fullPath);
      const outputPath = path.join(baseOutput, file.replace('.mdx', '.json'));
      
      console.log(`Migrating: ${relativePath} -> ${path.relative(process.cwd(), outputPath)}`);
      const success = migrateMDXToJSON(fullPath, outputPath);
      
      if (success) {
        console.log(`✓ Successfully migrated ${file}`);
      } else {
        console.log(`✗ Failed to migrate ${file}`);
      }
    }
  }
}

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('Starting migration from MDX to JSON...\n');
migrateDirectory(dataDir);
console.log('\nMigration complete!');

