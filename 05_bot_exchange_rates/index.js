const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const NodeCache = require("node-cache");

const BOT_TOKEN = process.env.BOT_TOKEN;

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const cache = new NodeCache({ stdTTL: 10000, checkperiod: 12000 });

// env $(cat .env.sample | xargs) node index.js

async function fetchData() {
  try {
    const response = await axios.get("https://api.monobank.ua/bank/currency");
    const success = cache.set("rates", response.data, 10000);
    if (!success) console.log("Some error occured during caching");
  } catch (err) {
    console.log(err);
  }
}

const back_button = (message, text) => {
  bot.sendMessage(message.chat.id, text, {
    reply_markup: {
      keyboard: [["Назад"]],
      resize_keyboard: true,
    },
    parse_mode: "Markdown",
  });
}

async function getUsdExchangeRate(message) {
  const rate = cache.get("rates");
  if (rate == undefined) {
    await fetchData();
  }
  try {
    const rates = cache.get("rates");
    const text = `*Курс гривні відносно USD на ${new Date(
      rates[0].date * 1000
    ).toLocaleString()}*\nЦіна покупки: ${rates[0].rateBuy}\nЦіна продажу: ${
      rates[0].rateSell
    }`;

    back_button(message, text);
  } catch (err) {
    console.log(err);
  }
}

async function getEurExchangeRate(message) {
  const rate = cache.get("rates");
  if (rate == undefined) {
    await fetchData();
  }
  try {
    const rates = cache.get("rates");
    const text = `*Курс гривні відносно EUR на ${new Date(
      rates[1].date * 1000
    ).toLocaleString()}*\nЦіна покупки: ${rates[1].rateBuy}\nЦіна продажу: ${
      rates[1].rateSell
    }`;

    back_button(message, text);
  } catch (err) {
    console.log(err);
  }
}

bot.on("message", async (message) => {
  const chatId = message.chat.id;
  const text = message.text;

  switch (text) {
    case "/start": {
      bot.sendMessage(
        chatId,
        `Привіт, ${message.chat.first_name}! Я можу показати курси обміну гривні`,
        {
          reply_markup: {
            keyboard: [["Показати курси валют"]],
            resize_keyboard: true,
          },
        }
      );
      break;
    }
    case "Назад":
    case "Показати курси валют": {
      bot.sendMessage(chatId, `Обери валюту`, {
        reply_markup: {
          keyboard: [["USD"], ["EUR"]],
          resize_keyboard: true,
        },
      });
      break;
    }
    case "USD": {
      await getUsdExchangeRate(message);
      break;
    }
    case "EUR": {
      await getEurExchangeRate(message);
      break;
    }
  }
});

bot.on("polling_error", console.log);