const fs = require("fs");
const path = require("path");
const readline = require("readline");

const dir = "./words";

const execTime = [];

const calculateExecTime = (start, stop) => {
  const seconds = (stop - start) / 1000;
  const rounded = Number(seconds).toFixed(3);
  execTime.push(+rounded);

  if (execTime.length === 3)
    console.log("Time of execution is: " + Math.max(...execTime));
};

const uniqueValues = () => {
  const start = performance.now();
  let uniqueNum = 0;

  fs.readdir(dir, (err, files) => {
    if (err) {
      console.log("Some error have happened during reading directory", err);
    }

    const readFile = (index) => {
      try {
        const filePath = path.join(dir, files[index]);
        const fileStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
          input: fileStream,
        });
        const unique = new Set();
        const was = new Set();

        rl.on("line", (line) => {
          if (unique.has(line)) {
            unique.delete(line);
            was.add(line);
          } else if (!unique.has(line) && !was.has(line)) unique.add(line);
        });

        rl.on("close", () => {
          uniqueNum += unique.size;
          if (index < files.length - 1) readFile(index + 1);
          else {
            console.log(
              `Number of unique usernames in all files: ${uniqueNum}`
            );
            const stop = performance.now();
            calculateExecTime(start, stop);
          }
        });
      } catch (err) {
        console.log(err);
      }
    };

    readFile(0);
  });
};

const existInAllFiles = () => {
  const start = performance.now();
  const map = new Map();

  fs.readdir(dir, (err, files) => {
    if (err) {
      console.log("Some error have happened during reading directory", err);
    }

    const readFile = (index) => {
      try {
        const filePath = path.join(dir, files[index]);
        const fileStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
          input: fileStream,
        });

        const usernamesInFile = new Set();

        rl.on("line", (line) => {
          usernamesInFile.add(line);
        });

        rl.on("close", () => {
          usernamesInFile.forEach((el) => {
            map.set(el, (map.get(el) || 0) + 1);
          });

          if (index < files.length - 1) {
            readFile(index + 1);
          } else {
            map.forEach((value, key) => {
              if (value < 20) {
                map.delete(key);
              }
            });
            console.log(
              "Number of usernames which occurs in all 20 files: " + map.size
            );
            const stop = performance.now();
            calculateExecTime(start, stop);
          }
        });
      } catch (err) {
        console.log(err);
      }
    };

    readFile(0);
  });
};

const existInAtleastTen = () => {
  const start = performance.now();
  const map = new Map();

  fs.readdir(dir, (err, files) => {
    if (err) {
      console.log("Some error have happened during reading directory", err);
    }

    const readFile = (index) => {
      try {
        const filePath = path.join(dir, files[index]);
        const fileStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
          input: fileStream,
        });

        const usernamesInFile = new Set();

        rl.on("line", (line) => {
          usernamesInFile.add(line);
        });

        rl.on("close", () => {
          usernamesInFile.forEach((el) => {
            map.set(el, (map.get(el) || 0) + 1);
          });

          if (index < files.length - 1) {
            readFile(index + 1);
          } else {
            map.forEach((value, key) => {
              if (value < 10) {
                map.delete(key);
              }
            });
            console.log(
              "Number of usernames which occurs in at least 10 files: " +
                map.size
            );
            const stop = performance.now();
            calculateExecTime(start, stop);
          }
        });
      } catch (err) {
        console.log(err);
      }
    };

    readFile(0);
  });
};

uniqueValues();
existInAllFiles();
existInAtleastTen();
