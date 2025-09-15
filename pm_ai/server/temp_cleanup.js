const fs = require('fs');
const path = require('path');

const filesToDelete = [
  'package-lock.json',
  'package-lock.json.backup',
  'package-lock.json.new'
];

filesToDelete.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`Deleted: ${file}`);
    } else {
      console.log(`File not found: ${file}`);
    }
  } catch (error) {
    console.error(`Error deleting ${file}:`, error.message);
  }
});

console.log('Cleanup completed');