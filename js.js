
const fetch = require('node-fetch');
// const cheerio = require('cheerio');
// const fs = require('fs');


async function a() {
const response = await fetch('https://tlp-ab.ru/bureau/');
let html = await response.text();
console.log(html)
}


hh


a()



// const url = 'https://tlp-ab.ru/bureau/'; // Замените на нужный URL
// fetchAndParse(url);