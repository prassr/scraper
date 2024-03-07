#!/usr/bin/env node

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

  // get all links with class specified by `selector`
    const selector = "a.bbp-topic-permalink";
    const links = await page.$$eval(selector, am => am.filter(e => e.href).map(e => e.href))

    for (let link of links) {
		// Create a new page
		const pg = await browser.newPage();
		// go to new link 
		await pg.goto(link);

        // select an element with class name given by `text`
        let text = ".bbp-topic-content"; // div tag class
        await pg.waitForSelector(text); // wait for selector
        let element = await pg.$(text); // select the div tag
        let value = await pg.evaluate(el => el.textContent, element);
        console.log(value);
		// Dispose context once it's no longer needed.
		await pg.close();
    }
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


