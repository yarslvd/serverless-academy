const axios = require("axios");

const endpoints = [
  "https://jsonbase.com/sls-team/json-793",
  "https://jsonbase.com/sls-team/json-793",
  "https://jsonbase.com/sls-team/json-955",
  "https://jsonbase.com/sls-team/json-231",
  "https://jsonbase.com/sls-team/json-931",
  "https://jsonbase.com/sls-team/json-93",
  "https://jsonbase.com/sls-team/json-342",
  "https://jsonbase.com/sls-team/json-770",
  "https://jsonbase.com/sls-team/json-491",
  "https://jsonbase.com/sls-team/json-281",
  "https://jsonbase.com/sls-team/json-718",
  "https://jsonbase.com/sls-team/json-310",
  "https://jsonbase.com/sls-team/json-806",
  "https://jsonbase.com/sls-team/json-469",
  "https://jsonbase.com/sls-team/json-258",
  "https://jsonbase.com/sls-team/json-516",
  "https://jsonbase.com/sls-team/json-79",
  "https://jsonbase.com/sls-team/json-706",
  "https://jsonbase.com/sls-team/json-521",
  "https://jsonbase.com/sls-team/json-350",
  "https://jsonbase.com/sls-team/json-64"
];

function searchProp(obj, key) {
  if (obj.hasOwnProperty(key)) {
    return obj;
  } else {
    for (let i = 0; i < Object.keys(obj).length; i++) {
      const name = Object.keys(obj)[i];
      if (typeof obj[name] == "object") {
        const found = searchProp(obj[name], key);
        if (found) {
          return found;
        }
      }
    }
  }
}

function getEndpoints(endpoints) {
  const values = {
    trueVals: 0,
    falseVals: 0,
  };

  (async () => {
    for (let el of endpoints) {
      for (let i = 1; i <= 3; i++) {
        try {
          const res = await axios.get(el);
          const { data } = res;
          const obj = searchProp(data, "isDone");
          console.log(
            `[Success] ${el}: isDone - ${
              obj.isDone.toString().charAt(0).toUpperCase() +
              obj.isDone.toString().slice(1)
            }`
          );
          if (obj.isDone === true) values.trueVals++;
          else values.falseVals++;
          break;
        } catch (err) {
          //uncomment the line below to see tries of reconnecting
          // console.error(`[Fail] ${el}, Try ${i}: The endpoint is unavailable`);
          if (i == 3) {
            console.error(`[Fail] ${el}: The endpoint is unavailable`);
            break;
          }
          continue;
        }
      }
    }

    console.log("\nFound True values: " + values.trueVals);
    console.log("Found False values: " + values.falseVals);
  })();
}

getEndpoints(endpoints);
