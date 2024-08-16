// https://github.com/puppeteer/puppeteer/issues/1837
const puppeteer = require('puppeteer');
const rimraf = require('del');

// const PATHS = {
//     win32: {
//         executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
//         userDataDir: 'C:\\Users\\<USERNAME>\\AppData\\Local\\Temp\\puppeteer_user_data',
//     },
//     linux: {
//         executablePath: "/mnt/c/Program Files/Google/Chrome/Application/chrome.exe",
//         userDataDir: '/mnt/c/Users/<USERNAME>/AppData/Local/Temp/puppeteer_user_data',
//     },
// }

const USER_DATA_DIR = 'D:\\temp\\puppeteer_user_data';
const USER_DATA_DIR_WSL = '/mnt/d/temp/puppeteer_user_data';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/mnt/c/Program Files/Google/Chrome/Application/chrome.exe',
    userDataDir: USER_DATA_DIR
  });
  const page = await browser.newPage();
  await page.goto('https://google.com');
  

  await browser.close();
})().finally(() => rimraf(USER_DATA_DIR_WSL));
// async function main() {
//   const browser = await puppeteer.launch({
//       executablePath: PATHS[process.platform].executablePath,
//       userDataDir: PATHS.linux.userDataDir,
//       headless: true,
//   });
  
//   const page = await browser.newPage();
//   await page.goto('https://www.edx.org/search?q=python&tab=course');

//   await browser.close();
// }

// main().finally(async () => {
//   await rimraf(PATHS[process.platform].userDataDir, {force: true})
// }).catch(err => {
//   console.error(err);
//   process.exit(1);
// });


module.exports = {};