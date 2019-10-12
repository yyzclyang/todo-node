const homeDir = process.env.HOME || require('os').homedir();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(homeDir, '.todo');

const db = {
  read(path = dbPath) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, { flag: 'a+' }, (err, data) => {
        if (err) {
          return reject(err);
        }

        let taskList;
        try {
          taskList = JSON.parse(data);
        } catch (err) {
          taskList = [];
        }
        resolve(taskList);
      });
    });
  },
  write(taskList, path = dbPath) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, JSON.stringify(taskList) + '\n', (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }
};

module.exports = db;
