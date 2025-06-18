
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
const bot = new TelegramBot(token, { polling: true });

const token_log = '7976555095:AAHZf67DUebTusNoJu74NH1uNtkOjtwenG4'
const bot_log = new TelegramBot(token_log, { polling: true });

const chatId = 735407518;

const link_1 = 'https://tlp-ab.ru/bureau/'
const link_2 = 'https://kleinewelt.ru/bureau/#team'
const link_3 = 'https://k-s-m-s.com/office'

let h_1 = 'Alert\n ---------------------------------------------- \ntlp_check_team\nhttps://tlp-ab.ru/bureau/\n\n';
let h_2 = 'Alert\n ---------------------------------------------- \nklwt_team_check\nhttps://kleinewelt.ru/bureau/#team\n';
let h_3 = 'Alert\n ---------------------------------------------- \nksms_team_check\nhttps://k-s-m-s.com/office\n\n';

let NAMES = ''
// setInterval(() => {
//   console.log('1')
// }, 1000);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);

    st()
    function st() {
        tlp_team_check();
        klwt_team_check();
        ksms_team_check();
    setTimeout(st, 120000)
    }


 


bot.on('message', (msg) => {
  bot.sendMessage(chatId, 'Привет!');
  bot.sendDocument(chatId, './h.html')
});

// setInterval(() => {
//   bot.sendMessage(chatId, 'Прошло 10 секунд');
//   console.log('1')
// }, 1000);


// При получении любого текста — бот отвечает "Привет!"


})

async function ksms_team_check() {
    console.log('ksms_team_check')
    const response = await fetch(link_3);
    let html = await response.text();

    // fs.writeFileSync('h.html', html, 'utf8');

    const $ = cheerio.load(html);

    const result = [];

// Парсим `.items_master`
$('.items_master .block_item').each((i, el) => {
  const name = $(el).find('.item_name').text().trim();

  const photoStyle = $(el).find('.item_photo').attr('style') || '';
  const photoMatch = photoStyle.match(/url\((.*?)\)/);
  const photo = photoMatch ? photoMatch[1] : null;

  const href = $(el).attr('href') || null;

  result.push({
    name,
    photo,
    cv: href,
    section: 'master',
  });
});

// Парсим `.items_slave`
$('.items_slave .group_title').each((i, el) => {
  const group = $(el).text().trim();
  const $groupItems = $(el).next('.group_items');

  $groupItems.find('.item_name').each((i, el) => {
    const name = $(el).text().trim();
    result.push({
      name,
      photo: null,
      cv: null,
      section: group.toLowerCase(), // Например: 'recurring collaborations with' или 'previously'
    });
  });
});

    let prev =  JSON.parse(fs.readFileSync('ksms_names.json', 'utf8'));
    comparePeopleLists(prev,result);

    fs.writeFileSync('ksms_names.json', JSON.stringify(result, null, 2), 'utf8');
// console.log(result);

    //  bot.sendMessage(chatId, h_3+'ksms_team:\n' + JSON.stringify(result, null, 2));
}

function comparePeopleLists(oldList, newList) {
  const normalize = (list) =>
    list.reduce((acc, person) => {
      acc[person.name] = person;
      return acc;
    }, {});

  const oldMap = normalize(oldList);
  const newMap = normalize(newList);

  const added = [];
  const removed = [];
  const moved = [];

  // Найти добавившихся
  for (const name in newMap) {
    if (!oldMap[name]) {
      added.push(newMap[name]);
    }
  }

  // Найти ушедших
  for (const name in oldMap) {
    if (!newMap[name]) {
      removed.push(oldMap[name]);
    }
  }

  // Найти тех, у кого изменился section
  for (const name in newMap) {
    if (oldMap[name] && oldMap[name].section !== newMap[name].section) {
      moved.push({
        name,
        from: oldMap[name].section,
        to: newMap[name].section,
      });
    }
  }

  // Вывод результата
  if (!added.length && !removed.length && !moved.length) {
    console.log('✅ Нет изменений.');
    let msg = 'ksms_team_check. no changes'
        bot_log.sendMessage(chatId, msg);
  } else {
    if (added.length) {
      console.log('📌 Добавлены:');
    //   added.forEach((p) =>
    //     console.log(`— ${p.name} (${p.section})`)
    //   );
      let msg = '📌 Добавлены:'
      added.forEach((p) =>
        msg += `— ${p.name} (${p.section})`
      );
      bot.sendMessage(chatId, h_3+msg);
      bot.sendDocument(chatId, './ksms_names.json')
    }

    if (removed.length) {
      console.log('❌ Ушли:');
    //   removed.forEach((p) =>
    //     console.log(`— ${p.name} (${p.section})`)
    //   );
      let msg = '📌 Ушли:'
      removed.forEach((p) =>
        msg += `— ${p.name} (${p.section})`
      );
      bot.sendMessage(chatId, h_3+msg);
      bot.sendDocument(chatId, './ksms_names.json')
    }

    if (moved.length) {
      console.log('🔄 Изменили раздел:');
    //   moved.forEach((p) =>
    //     console.log(`— ${p.name}: ${p.from} → ${p.to}`)
    //   );
       let msg =  '🔄 Изменили раздел:'
     moved.forEach((p) =>
        msg += `— ${p.name}: ${p.from} → ${p.to}`
      );
      bot.sendMessage(chatId, h_3+msg);
      bot.sendDocument(chatId, './ksms_names.json')
    }
  }

  return { added, removed, moved };
}





async function klwt_team_check() {
    console.log('klwt_team_check')
    const response = await fetch(link_2);
    let html = await response.text();


    const $ = cheerio.load(html);

    const people = [];
    $('ul.bureau-page__team li').each((i, el) => {
    const name = $(el).find('span').text().trim();

    const position = $(el)
        .find('.bureau-page__team-position')
        .text()
        .trim();

    const img = $(el).find('img').attr('src') || null;

    people.push({
        name,
        position,
        img,
    });
    });

    let prev = JSON.parse(fs.readFileSync('klwt_names.json', 'utf8'));
    printPeopleChanges(prev, people)

    fs.writeFileSync('klwt_names.json', JSON.stringify(people, null, 2), 'utf8');
    // bot.sendMessage(chatId, h_2+'kwlt_team:\n' + JSON.stringify(people, null, 2));
}

function printPeopleChanges(oldList, newList) {
  const oldMap = new Map();
  const newMap = new Map();

  oldList.forEach(person => oldMap.set(person.name, person));
  newList.forEach(person => newMap.set(person.name, person));

  const added = [];
  const removed = [];
  const changedPosition = [];

  // Найти добавленных и с изменённой должностью
  newList.forEach(person => {
    const newPosition = (person.position || '').trim();

    if (!oldMap.has(person.name)) {
      added.push({ name: person.name, position: newPosition });
    } else {
      const oldPerson = oldMap.get(person.name);
      const oldPosition = (oldPerson.position || '').trim();
      if (oldPosition !== newPosition) {
        changedPosition.push({
          name: person.name,
          from: oldPosition,
          to: newPosition,
        });
      }
    }
  });

  // Найти удалённых
  oldList.forEach(person => {
    if (!newMap.has(person.name)) {
      removed.push({
        name: person.name,
        position: (person.position || '').trim(),
      });
    }
  });

  // Вывод
  if (added.length === 0 && removed.length === 0 && changedPosition.length === 0) {
    console.log('Изменений нет.');
    let msg = 'kw_team_check. no changes'
        bot_log.sendMessage(chatId, msg);
    return;
  }

  if (added.length > 0) {
    console.log('Добавлены:');
    let msg = h_2 + '\nДобавлен: '
    added.forEach(p => msg += `+ ${p.name} (${p.position})`);
    bot.sendMessage(chatId, msg);
    bot.sendDocument(chatId, './klwt_names.json')
    // added.forEach(p => console.log(`+ ${p.name} (${p.position})`));
  }

  if (removed.length > 0) {
    console.log('Удалены:');
    let msg =  h_2 + '\nУдалены: '
    added.forEach(p => msg += `+ ${p.name} (${p.position})`);
     bot.sendMessage(chatId, msg);
     bot.sendDocument(chatId, './klwt_names.json')
    // removed.forEach(p => console.log(`– ${p.name} (${p.position})`));
  }

  if (changedPosition.length > 0) {
    console.log('Изменена должность:');
    let msg =  h_2 + '\nИзменена должность: '
    changedPosition.forEach(({ name, from, to }) => {
      msg += `~ ${name}: ${from} → ${to}`;
    });
     bot.sendMessage(chatId, msg);
     bot.sendDocument(chatId, './klwt_names.json')
    // changedPosition.forEach(({ name, from, to }) => {
    //   console.log(`~ ${name}: ${from} → ${to}`);
    // });
  }
}




async function tlp_team_check() {
    console.log('tlp_team_check')
    const response = await fetch(link_1);
    let html = await response.text();

    const $ = cheerio.load(html);

    let t = $('.person-grid').text()
    const names = t
    .split('\n')             
    .map(line => line.trim())
    .filter(Boolean);    

    let prev = JSON.parse(fs.readFileSync('tlp_names.json', 'utf8'));

    NAMES = names
    console.log(checkForNameChanges(prev, names))

    fs.writeFileSync('tlp_names.json', JSON.stringify(names, null, 2), 'utf8');
}


function checkForNameChanges(oldList, newList) {
    const oldSet = new Set(oldList);
    const newSet = new Set(newList);

    const added = [...newSet].filter(name => !oldSet.has(name));
    const removed = [...oldSet].filter(name => !newSet.has(name));

    if (added.length === 0 && removed.length === 0) {
        console.log('Изменений нет.');
        let msg = 'tl_team_check. no changes'
        bot_log.sendMessage(chatId, msg);
        return;
    }

    if (added.length > 0) {
        console.log('Добавлены:');
        let msg = h_1+'Добавлен: ' 
        added.forEach(name => msg += `+ ${name}`)
        bot.sendMessage(chatId, msg);
        // bot.sendMessage(chatId, h_1+'tlp_team:\n' + JSON.stringify(NAMES, null, 2));
        bot.sendDocument(chatId, './tlp_names.json')
        
    }

    if (removed.length > 0) {
        console.log('Удалены:');
        let msg = h_1+'Удален: '
        removed.forEach(name => msg += `- ${name}`)
        bot.sendMessage(chatId, msg);
        bot.sendDocument(chatId, './tlp_names.json')
        // bot.sendMessage(chatId, h_1+'tlp_team:\n' + JSON.stringify(NAMES, null, 2));
    }
}
