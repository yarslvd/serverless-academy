const readline = require("readline");

class Cli {
  #wordsError = "\nThere are no words in an input!\n";
  #digitsError = "\nThere are no digits in a input!\n";

  constructor() {
    this.input = [];
    this.words = [];
    this.numbers = [];
    this.readline = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  // clear data after performing sorting
  #clearData() {
    this.input = [];
    this.words = [];
    this.numbers = [];
  }

  // perform option based on input
  #chooseOption(option) {
    switch (option) {
      case "1": // sorting words by name (from A to Z)
        console.log(
          this.words.length !== 0
            ? this.words.sort((a, b) => {
              if(a.toLowerCase() < b.toLowerCase()) return -1;
              if(a.toLowerCase() > b.toLowerCase()) return 1;
              return 0;
            })
            : this.#wordsError
        );
        break;
      case "2": // sorting numbers from the smallest
        console.log(
          this.numbers.length !== 0
            ? this.numbers.sort((a, b) => a - b)
            : this.#digitsError
        );
        break;
      case "3": // sorting numbers from the biggest
        console.log(
          this.numbers.length !== 0
            ? this.numbers.sort((a, b) => b - a)
            : this.#digitsError
        );
        break;
      case "4": // sorting words by quantity of letters
        console.log(
          this.words.length !== 0
            ? this.words.sort((a, b) => a.length - b.length)
            : this.#wordsError
        );
        break;
      case "5": // showing only unique words
        console.log(
          this.words.length !== 0
            ? [...new Set(this.words)]
            : this.#wordsError
        );
        break;
      case "6":
        console.log([...new Set(this.input)]);
        break;
      case "exit":
        console.log("\nGoodbye! Come back again!\n");
        this.readline.close();
        return;
      default:
        console.log("Invalid choice. Please select (1 - 5) or 'exit'.");
        this.choooseOption();
    }
    this.#clearData();
    this.startCli();
  }

  // separating input into words and digits
  #separateInput(input) {
    this.input = input.trim().split(" ").filter((el) => el.length >= 1);
    this.input.forEach((el) => {
      if (!isNaN(+el)) this.numbers.push(+el);
      else this.words.push(el);
    });
  }

  // choosing an option
  async choooseOption() {
    console.log(
      "\nHow would you like to sort values:" +
        "\n1. Words by name (from A to Z)." +
        "\n2. Display numbers from the smallest." +
        "\n3. Display numbers from the biggest." +
        "\n4. Words by quantity of letters." +
        "\n5. Only unique words." +
        "\n6. Only unique values from the input."
    );
    const option = await new Promise((resolve) => {
      this.readline.question("\nSelect (1 - 5) and press ENTER: ", resolve);
    });
    if (option) {
      this.#chooseOption(option);
    }
  }

  // getting input and separating it into words and digits
  async startCli() {
    const input = await new Promise((resolve) => {
      this.readline.question(
        "Hello! Enter words or digits dividing them with spaces: ",
        resolve
      );
    });

    if (input) {
      if(input === 'exit') {
        console.log("\nGoodbye! Come back again!\n");
        this.readline.close();
        return;
      }
      try {
        this.#separateInput(input);
        this.choooseOption();
      } catch (err) {
        console.log("Something went wrong. Please try again.");
        this.readline.close();
        return;
      }
    } else {
      console.log("\nYou have to enter something, try again!\n");
      this.startCli();
    }
  }
}

(async function main() {
  const cli = new Cli();
  cli.startCli();
})();

// harmful peanut unfortunate cupboard crime crime systematic load variety apparatus kitchen 20 23234.234 123 2
// man 22 apple table 100 93 18 apple nice grass smartphone 100293 go understandable woman 341 43.5 man 111 204 Dnipro city
