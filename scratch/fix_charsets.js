import fs from 'fs';
import path from 'path';

const filesToFix = [
  'client/src/pages/auth/LoginPage.jsx',
  'client/src/pages/auth/RegisterPage.jsx',
];

for (const relPath of filesToFix) {
  const fullPath = path.resolve(relPath);
  if (fs.existsSync(fullPath)) {
    const raw = fs.readFileSync(fullPath);
    // write back strictly as utf-8
    fs.writeFileSync(fullPath, raw.toString('utf8'), 'utf8');
    console.log(`Normalized ${relPath} to utf8`);
  }
}
