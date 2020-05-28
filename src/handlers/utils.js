const fs = require('fs');
const path = require('path');

const serveTemplate = function (fileName, res) {
  const pathUrl = path.join(__dirname, `../../templates/${fileName}`);
  fs.readFile(pathUrl, 'utf8', (error, data) => {
    if (error) return res.status(500).send();
    res.send(data);
  });
};

const shuffle = function (array) {
  for (let time = 0; time < 8; time++) {
    array.sort(() => Math.random() - 0.5);
  }
  return array;
};

module.exports = { serveTemplate, shuffle };
