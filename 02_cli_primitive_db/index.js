import inquirer from "inquirer";
import fs from "fs";

class PrimitiveDB {
  // questions for data array
  #questionsCreation = [
    {
      type: "list",
      name: "gender",
      message: "Choose your gender:",
      choices: ["male", "female"],
    },
    {
      type: "input",
      name: "age",
      message: "Enter your age:",
      validate: this.#validateAge,
    },
  ];

  // validate age
  async #validateAge(input) {
    if ((!isNaN(+input) && +input >= 1 && +input <= 120) || input === '') return true;
    return "Input correct age (1 - 120)";
  }

  // validate name
  async #validateName(input) {
    const nameRegex = /^[A-Za-z\s'-]+$/;
    if (nameRegex.test(input) || input === "") {
      return true;
    }
    return "Input correct name";
  }

  // write data into .txt file
  #writeData(answers) {
    if (!fs.existsSync("db.txt")) fs.writeFileSync("db.txt", "[]");
    const fileData = JSON.parse(fs.readFileSync("db.txt"));
    fileData.push(answers);

    fs.writeFileSync("db.txt", JSON.stringify(fileData), (err) =>
      console.error(err)
    );
  }

  // searching for matches throught DB
  async #searchDB() {
    const search = await inquirer.prompt([
      {
        type: "confirm",
        name: "search",
        message: "Would you like to search value in DB?",
      },
    ]);

    if (search.search === true) {
      try {
        const data = JSON.parse(fs.readFileSync("db.txt"));

        // Uncomment the line below to display all data from the file
        // console.log(data);

        const search = await inquirer.prompt([
          {
            type: "input",
            name: "name",
            message: "Enter user's name you want to find in the DB:",
          },
        ]);

        if(search.name === '') {
          console.log('\nYou must enter some data to search!')
          return;
        }

        const found = data.filter(
          (el) => el.user.toLowerCase() === search.name.toLowerCase()
        );

        if (found) {
          console.log(`\nSuch data was found with '${search.name}' query: `)
          console.log(found);
        }
        else
          console.log(
            `\nThere is no such user in DB with the name ${search.search}`
          );
        return;
      } catch (err) {
        console.log("\nNo data exists in the DB. Please add some.");
      }
    } else {
      console.log("\nThanks Goodbye");
      return;
    }
  }

  // create new users
  async #createUsers() {
    const user = await inquirer.prompt([
      {
        type: "input",
        name: "user",
        message: "Enter the user's name. To cancel press ENTER:",
        validate: this.#validateName,
      },
    ]);
    if (user.user === "") return;

    await inquirer
      .prompt(this.#questionsCreation)
      .then(async (answers) => {
        answers.user = user.user;
        if(answers.age === '') delete answers.age;
        this.#writeData(answers);
        await this.#createUsers();
      })
      .catch((error) => {
        console.log("Some error have occured" + error);
      });
  }

  //driver method
  async start() {
    await this.#createUsers();
    await this.#searchDB();
  }
}

(function main() {
  const db = new PrimitiveDB();
  db.start();
})();
