
// const fetch = require('node-fetch');

// server.js

const express = require('express')
const app = express()
const port = 3000
const cheerio = require('cheerio');
const fs = require('fs');

const TelegramBot = require('node-telegram-bot-api');
// const { setInterval } = require('timers/promises');
const token = '7713153382:AAFP7cwmLXWbbZxP2_046MzMOvmEB45vjsg'
const token_log = '7976555095:AAHZf67DUebTusNoJu74NH1uNtkOjtwenG4'
const bot = new TelegramBot(token, { polling: true });

const chatId = 735407518;

const link_1 = 'https://tlp-ab.ru/bureau/'
const linl_2 = 'https://tlp-ab.ru/bureau/'
const linl_3 = 'https://tlp-ab.ru/bureau/'


// setInterval(() => {
//   console.log('1')
// }, 1000);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);

    tlp_team_check();




bot.on('message', (msg) => {
  bot.sendMessage(chatId, 'Привет!');
});

// setInterval(() => {
//   bot.sendMessage(chatId, 'Прошло 10 секунд');
//   console.log('1')
// }, 1000);


// При получении любого текста — бот отвечает "Привет!"


})




async function tlp_team_check() {
const response = await fetch(link_1);
let html = await response.text();
console.log(html.length)
const $ = cheerio.load(html);


let t = $('.person-grid').text()
const names = t
  .split('\n')             // разбиваем по строкам
  .map(line => line.trim())// убираем лишние пробелы и табы
  .filter(Boolean);        // убираем пустые строки


let prev = JSON.parse(fs.readFileSync('tlp_names.json', 'utf8'));

// console.log(arr_comp(names, prev))
console.log(checkForNameChanges(prev, names))
bot.sendMessage(chatId, JSON.stringify(names, null, 2));
fs.writeFileSync('tlp_names.json', JSON.stringify(names, null, 2), 'utf8');
}


function checkForNameChanges(oldList, newList) {
  const oldSet = new Set(oldList);
  const newSet = new Set(newList);

  const added = [...newSet].filter(name => !oldSet.has(name));
  const removed = [...oldSet].filter(name => !newSet.has(name));

  if (added.length === 0 && removed.length === 0) {
    console.log('Изменений нет.');
    return;
  }

  if (added.length > 0) {
    console.log('Добавлены:');
    let msg = 'Добавлен: ' 
    added.forEach(name => msg += `+ ${name}`)
    bot.sendMessage(chatId, msg);
    
  }

  if (removed.length > 0) {
    console.log('Удалены:');
    let msg = 'Удален: '
    removed.forEach(name => msg += `- ${name}`)
    bot.sendMessage(chatId, msg);
  }
}
