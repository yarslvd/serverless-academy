const fs = require("fs");
const data = require("./data.json");

function restructureVacations(data) {
  const res = [];

  data.map((el) => {
    const index = res.findIndex((item) => item.userId === el.user._id);
    if (index !== -1) existUser(el, res, index);
    else newUser(el, res);
  });

  fs.writeFile("result.json", JSON.stringify(res), (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });
}

function newUser(el, res) {
  const obj = {};
  obj.userId = el.user._id;
  obj.userName = el.user.name;
  obj.vacations = [
    {
      startDate: el.startDate,
      endDate: el.endDate,
      ...(el.status && { status: "approved" }),
    },
  ];
  res.push(obj);
}

function existUser(el, res, index) {
  const found = res[index].vacations.find(
    (item) => item.startDate === el.startDate || item.startDate === el.startDate
  );
  if (!found) {
    const obj = {
      startDate: el.startDate,
      endDate: el.endDate,
      ...(el.status && { status: "approved" }),
    };
    res[index].vacations.push(obj);
  }
}

restructureVacations(data);
