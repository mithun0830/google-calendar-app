const fs = require('fs');
const path = require('path');

class Logger {
  constructor(options = {}) {
    this.logDir = options.logDir || 'logs';
    this.logFile = path.join(this.logDir, 'app.log');
    this.maxSize = options.maxSize || 5 * 1024 * 1024; // 5MB default
    this.maxFiles = options.maxFiles || 5;

    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir);
    }
  }

  log(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} [${level}] ${message} ${JSON.stringify(meta)}\n`;

    this.writeLog(logEntry);
  }

  writeLog(logEntry) {
    fs.appendFile(this.logFile, logEntry, (err) => {
      if (err) {
        console.error('Error writing to log file:', err);
      } else {
        this.rotateLogIfNeeded();
      }
    });
  }

  rotateLogIfNeeded() {
    fs.stat(this.logFile, (err, stats) => {
      if (err) {
        console.error('Error checking log file stats:', err);
        return;
      }

      if (stats.size >= this.maxSize) {
        this.rotateLog();
      }
    });
  }

  rotateLog() {
    for (let i = this.maxFiles - 1; i > 0; i--) {
      const oldFile = path.join(this.logDir, `app.${i}.log`);
      const newFile = path.join(this.logDir, `app.${i + 1}.log`);

      if (fs.existsSync(oldFile)) {
        fs.renameSync(oldFile, newFile);
      }
    }

    fs.renameSync(this.logFile, path.join(this.logDir, 'app.1.log'));
  }

  error(message, meta = {}) {
    this.log('ERROR', message, meta);
  }

  info(message, meta = {}) {
    this.log('INFO', message, meta);
  }

  debug(message, meta = {}) {
    this.log('DEBUG', message, meta);
  }
}

module.exports = new Logger();
