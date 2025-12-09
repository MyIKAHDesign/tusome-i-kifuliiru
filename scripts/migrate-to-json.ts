#!/usr/bin/env ts-node
/**
 * Migration script to convert MDX files to JSON format
 * Run with: npx ts-node scripts/migrate-to-json.ts
 */

import fs from 'fs';
import path from 'path';
import { migrateMDXToJSON } from '../lib/mdx-to-json';

const dataDir = path.join(process.cwd(), 'data');
const outputDir = path.join(process.cwd(), 'data');

let migratedCount = 0;
let failedCount = 0;

function migrateDirectory(dir: string, baseOutput: string = dataDir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    if (file === '_meta.json' || file.startsWith('.') || file.endsWith('.json')) {
      continue;
    }
    
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      migrateDirectory(fullPath, baseOutput);
    } else if (file.endsWith('.mdx')) {
      const relativePath = path.relative(dataDir, fullPath);
      const outputPath = path.join(baseOutput, relativePath.replace('.mdx', '.json'));
      
      console.log(`Migrating: ${relativePath}`);
      const success = migrateMDXToJSON(fullPath, outputPath);
      
      if (success) {
        migratedCount++;
        console.log(`✓ Successfully migrated ${file}`);
      } else {
        failedCount++;
        console.log(`✗ Failed to migrate ${file}`);
      }
    }
  }
}

console.log('Starting migration from MDX to JSON...\n');
migrateDirectory(dataDir);
console.log(`\nMigration complete!`);
console.log(`✓ Successfully migrated: ${migratedCount} files`);
if (failedCount > 0) {
  console.log(`✗ Failed: ${failedCount} files`);
}
