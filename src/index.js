const { Telegraf } = require('telegraf');
require('dotenv').config();

const { sign } = require('./sign');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
bot.help((ctx) =>
  ctx.reply('All i know how to do is approve your kids health. just tell me to /sign it and i will...')
);
bot.hears('/sign', async (ctx) => {
  ctx.reply("👍 I'm on it");
  await sign(ctx);
  await ctx.replyWithPhoto({ source: '/Users/yoadl/kids-health-statement/done.png' });
  await ctx.reply('done. enjoy your day...');
});
bot.launch();
