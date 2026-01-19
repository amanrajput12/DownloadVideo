const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../logs.txt');

const logger = {
  info: (msg) => {
    console.log(msg);
    fs.appendFileSync(logFile, `[INFO] ${new Date().toISOString()} - ${msg}\n`);
  },

  error: (msg) => {
    console.error(msg);
    fs.appendFileSync(logFile, `[ERROR] ${new Date().toISOString()} - ${msg}\n`);
  }
};

module.exports = logger;
