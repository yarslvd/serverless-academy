const fs = require("fs");

const { Command } = require("commander");
const program = new Command();

const TelegramBot = require("node-telegram-bot-api");
const token = process.env.token;
const bot = new TelegramBot(token, { polling: false });
process.env.NTBA_FIX_350 = 1;

// TESTS
// env $(cat .env.sample | xargs) node index.js m "Slid with the gang"
// env $(cat .env.sample | xargs) node index.js p (drag image in terminal)

async function getUpdates() {
  try {
    return await bot.getUpdates({ timeout: 1000 });
  } catch (error) {
    console.error("Error fetching updates:", error);
    return [];
  }
}

(async function main() {
  const updates = await getUpdates();
  const chatId = updates[updates.length - 1]?.message?.chat?.id;

  program
    .name("node index.js")
    .description(
      "Send messages and photos directly from the console to Telegram"
    )
    .version("0.0.1");

  // sending messages to user
  program
    .command("m")
    .alias("send-message")
    .description("Send message as Telegram bot to a last chat")
    .argument("<string>", "message content")
    .action(async (str) => {
      try {
        if (updates.length > 0) {
          // gets the last active chatId, so the message will be sent to the last user who sent a message to the bot
          await bot.sendMessage(chatId, str);
        } else {
          console.log("No recent updates found. (Send any message to bot)");
        }
      } catch (error) {
        console.error("Error fetching updates:", error);
      }

      process.exit();
    });

  // sending images to user
  program
    .command("p")
    .alias("send-photo")
    .description("Send photo as Telegram bot to a last chat")
    .argument("<path>", "path to image")
    .action(async (path) => {
      try {
        if (updates.length > 0) {
          var file = fs.readFileSync(path);
          const fileOpts = {
            filename: "image",
            contentType: "image/jpeg",
          };
          await bot.sendPhoto(chatId, file, {}, fileOpts);
          console.log("\nThe photo has been successfully sent!")
        } else {
          console.log("No recent updates found. (Send any message to bot)");
        }
      } catch (error) {
        console.error('Error fetching updates:', error);
      }
      process.exit();
    });

  program.parse();
})();
