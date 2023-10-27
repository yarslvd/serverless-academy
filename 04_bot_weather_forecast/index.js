const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const lat = "50.005";
const lon = "36.232";

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// env $(cat .env.sample | xargs) node index.js

async function fetchWeather() {
  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&cnt=8&units=metric`
    );
    return { data: data.list, city: data.city };
  } catch (err) {
    console.log(err);
    return {};
  }
}

function dataToStr(data) {
  const text = [];
  data.map((el) => {
    const date = new Date(el.dt * 1000).toLocaleString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const str = `*${date}*\n${el.weather[0].main} ${Math.round(
      el.main.temp
    )}°C\n`;
    text.push(str);
  });

  return text.join("\n");
}

async function get3HrsWeather(message) {
  const { data } = await fetchWeather();

  try {
    const heading = `Here is the weather in *Kharkiv* for the next 24 hours with 3 hours interval:\n\n`;
    const text = dataToStr(data);
    bot.editMessageText(heading.concat(text), {
      chat_id: message.chat.id,
      message_id: message.message_id,
      reply_markup: {
        inline_keyboard: [
          [{ text: "Show on map", callback_data: "get_map" }],
          [{ text: "Back", callback_data: "get_forecast" }],
        ],
      },
      parse_mode: "Markdown",
    });
  } catch (err) {
    console.log(err);
  }
}

async function get6HrsWeather(message) {
  const { data, city } = await fetchWeather();

  try {
    const weather = data?.filter((el, index) => {
      if (index % 2 === 0) return el;
    });

    const heading =
      "Here is the weather in *Kharkiv* for the next 24 hours with 3 hours interval:\n\n";
    const text = dataToStr(weather);

    bot.editMessageText(heading.concat(text), {
      chat_id: message.chat.id,
      message_id: message.message_id,
      reply_markup: {
        inline_keyboard: [
          [{ text: "Show on map", callback_data: "get_map" }],
          [{ text: "Back", callback_data: "get_forecast" }],
        ],
      },
      parse_mode: "Markdown",
    });
  } catch (err) {
    console.log(err);
  }
}

bot.onText(/\/start/, (message) => {
  bot.sendMessage(
    message.chat.id,
    `Hello, ${message.chat.first_name}! This is a Weather Bot. I can return you a forecast each 3 or 6 hours.`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Forecast in Kharkiv", callback_data: "get_forecast" }],
        ],
      },
    }
  );
});

bot.on("callback_query", async (query) => {
  switch (query.data) {
    case "get_3hrs":
      await get3HrsWeather(query.message);
      break;
    case "get_6hrs":
      await get6HrsWeather(query.message);
      break;
    case "get_forecast":
      bot.editMessageText(`Please, choose the option below:`, {
        chat_id: query.message.chat.id,
        message_id: query.message.message_id,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Weather forecast with 3hrs gap",
                callback_data: "get_3hrs",
              },
            ],
            [
              {
                text: "Weather forecast with 6hrs gap",
                callback_data: "get_6hrs",
              },
            ],
          ],
        },
      });
      break;
    case "get_map":
      bot.sendLocation(query.message.chat.id, lat, lon);
      break;
  }
});

bot.on("polling_error", console.log);
