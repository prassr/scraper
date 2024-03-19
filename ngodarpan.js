#!/usr/bin/env node

// https://ngodarpan.gov.in/index.php/home/statewise_ngo/28319/27/1?per_page=100

const puppeteer = require("puppeteer");
const fs = require("fs")
const process = require("process")

function displayHelp() {
  console.log('Usage: node wp_scraper.js --page pageLink');
}



async function run(sLink){
  // Launch a headless browser
    const browser = await puppeteer.launch({headless:"new"});
    const page = await browser.newPage();

  // Navigate to a webpage
    await page.goto(sLink);
    const selector = "table.Tax";
    const table = await page.$(selector);
    
    const data = await page.evaluate(() => {
    const tds = Array.from(document.querySelectorAll('table tr td'))
    return tds.map(td => td.innerText)
  });

    console.log(data);
    

    // Close the browser
  await browser.close();
};



function main() {
    const args = process.argv.slice(2)
    // Check for the presence of -playlist argument
    const siteIndex = args.indexOf('--page');

    if (siteIndex !== -1 && siteIndex + 1 < args.length) {
        const siteLink = args[siteIndex + 1];
        if (siteLink.length == 0) {
            return
        }
        run(siteLink);
    // Add your logic to process the playlist link here
    } else {
    // Display help if -playlist argument is not found
        displayHelp();
    }
}

main();


