import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Smart Water Supply System - File Cataloger
 * Scans Backend and Frontend directories to extract project source code.
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function catalogFiles(basePath) {
  console.log("=".repeat(80));
  console.log("SMART WATER SUPPLY SYSTEM PROJECT FILE CATALOG");
  console.log("=".repeat(80));

  // Define scan targets based on your actual folder structure
  const scanTargets = [
    { category: "Backend Core", relPath: "Backend/src", extensions: [".js"] },
    { category: "Backend Config", relPath: "Backend/src/config", extensions: [".js"] },
    { category: "Backend Controllers", relPath: "Backend/src/controllers", extensions: [".js"] },
    { category: "Backend Models", relPath: "Backend/src/models", extensions: [".js"] },
    { category: "Backend Routes", relPath: "Backend/src/routes", extensions: [".js"] },
    { category: "Backend Utils", relPath: "Backend/src/utils", extensions: [".js"] },
    { category: "Frontend Core", relPath: "Frontend/src", extensions: [".jsx", ".js"] },
    { category: "Frontend Components", relPath: "Frontend/src/components", extensions: [".jsx", ".js"] },
    { category: "Frontend Services", relPath: "Frontend/src/components/services", extensions: [".js"] },
    { category: "Frontend Utils", relPath: "Frontend/src/components/utils", extensions: [".js", ".jsx"] }
  ];

  const allFiles = [];

  for (const target of scanTargets) {
    const fullPath = path.join(basePath, target.relPath);

    try {
      await fs.access(fullPath);
      console.log(`\n${"=".repeat(80)}`);
      console.log(`📁 ${target.category} (${target.relPath})`);
      console.log(`${"=".repeat(80)}`);

      const filesInDir = await getFiles(fullPath, target.extensions, basePath);
      
      if (filesInDir.length === 0) {
        console.log("   ⚠️  No matching files found");
        continue;
      }

      for (const fileInfo of filesInDir) {
        try {
          const content = await fs.readFile(fileInfo.fullPath, 'utf-8');
          const lines = content.split('\n').length;

          console.log(`\n📄 ${fileInfo.name} (${lines} lines)`);
          console.log(`   Path: ${fileInfo.relPath}`);

          allFiles.push({
            path: fileInfo.relPath,
            category: target.category,
            lines: lines,
            content: content
          });
        } catch (err) {
          console.error(`   ❌ Error reading: ${fileInfo.name}`, err.message);
        }
      }
    } catch (err) {
      // Directory might not exist in the local environment
    }
  }

  // Display contents for extraction
  console.log("\n\n" + "=".repeat(80));
  console.log("FILE CONTENTS FOR EXTRACTION");
  console.log("=".repeat(80));

  allFiles.sort((a, b) => a.path.localeCompare(b.path)).forEach(file => {
    console.log(`\n${"#".repeat(80)}`);
    console.log(`# FILE: ${file.path}`);
    console.log(`# Category: ${file.category}`);
    console.log(`${"#".repeat(80)}\n`);
    console.log(file.content);
    console.log("\n");
  });

  console.log(`\n✅ Cataloging complete! Total files: ${allFiles.length}`);
}

async function getFiles(dir, extensions, basePath) {
  let results = [];
  try {
    const list = await fs.readdir(dir, { withFileTypes: true });

    for (const item of list) {
      const res = path.resolve(dir, item.name);
      // Skip node_modules if they accidentally appear in scan path
      if (item.name === 'node_modules') continue;

      if (item.isDirectory()) {
        results = results.concat(await getFiles(res, extensions, basePath));
      } else {
        const isMatch = extensions.some(ext => item.name.endsWith(ext));
        if (isMatch) {
          results.push({
            name: item.name,
            fullPath: res,
            relPath: path.relative(basePath, res)
          });
        }
      }
    }
  } catch (e) { /* Path error handling */ }
  return results;
}

const targetPath = process.argv[2] || process.cwd();
catalogFiles(targetPath).catch(err => console.error("Fatal Error:", err));