const yauzl = require('yauzl');
const fs = require('fs');
const path = require('path');

const zipPath = 'free-react-tailwind-admin-dashboard-main (1).zip';

yauzl.open(zipPath, { lazyEntries: true }, (err, zipfile) => {
  if (err) {
    console.error('Error opening zip file:', err);
    process.exit(1);
  }

  zipfile.readEntry();
  
  zipfile.on('entry', (entry) => {
    if (/\/$/.test(entry.fileName)) {
      // Directory entry
      const dirPath = entry.fileName;
      fs.mkdirSync(dirPath, { recursive: true });
      zipfile.readEntry();
    } else {
      // File entry
      const filePath = entry.fileName;
      const dirPath = path.dirname(filePath);
      
      // Ensure directory exists
      fs.mkdirSync(dirPath, { recursive: true });
      
      zipfile.openReadStream(entry, (err, readStream) => {
        if (err) {
          console.error('Error reading entry:', err);
          return;
        }
        
        const writeStream = fs.createWriteStream(filePath);
        readStream.pipe(writeStream);
        
        writeStream.on('close', () => {
          zipfile.readEntry();
        });
      });
    }
  });
  
  zipfile.on('end', () => {
    console.log('Extraction complete!');
  });
});