#!/usr/bin/env node

//  https://wordpress.org/support/plugin/eventprime-event-calendar-management/

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

        let span = ".topic-resolved-indicator"
		let span_element = await pg.$(span);
        if (span_element == undefined) {
            console.log(link)
            continue;
        }
        console.log("* "+link)

        var data = {}

        let header = ".page-title"; // div tag class
		await pg.waitForSelector(header); // wait for selector
		let element = await pg.$(header); // select the div tag
		let value = await pg.evaluate(el => el.textContent, element);

        data["topic"] = value;

	    // select an element with class name given by `text`
		let text = ".bbp-topic-content"; // div tag class
		await pg.waitForSelector(text); // wait for selector
		element = await pg.$(text); // select the div tag
		value = await pg.evaluate(el => el.textContent, element);

        data["content"] = value;

		// Dispose context once it's no longer needed.
        text = ".bbp-reply-content"; // div tag class
		await pg.waitForSelector(text); // wait for selector
		element = await pg.$$eval(text, reply => reply.map(r=>r.textContent)); // select the div tag
        data["reply"] = new Array();

        for(let elem of element) {
            data["reply"].push(elem);
        }
        fs.appendFileSync("out.txt", JSON.stringify(data)+"\n", 'utf-8');

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


