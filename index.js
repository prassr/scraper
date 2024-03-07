#!/usr/bin/env node

const puppeteer = require("puppeteer");
const fs = require("fs")
const process = require("process")

function displayHelp() {
  console.log('Usage: node index.js --playlist playlist_link');
}



async function run(plink) {
    const browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage();
    await page.goto(plink)

    // await page.screenshot({path: "example.png", fullPage: true})

    // await page.screenshot({path: "example.pdf", format:"A4"})
    //
    const title = await page.evaluate(() => document.title);
    console.log(title)
    // console.log(title)
    // const html = await page.content() A // html content
    // console.log(html)
    
    // const text = await page.evaluate(() => document.body.innerText);
    // console.log(text)
    //

    // get all links 
    // const links = await page.evaluate(() => Array.from(document.querySelectorAll('a'), (e) => e.href));
    // console.log(links)
    //

    // get all links by classes

    // const channel = await page.$("div.ytd-playlist-header-renderer")
    // console.log(channel.innerText)
    const links = await page.$$("a#video-title.yt-simple-endpoint.ytd-playlist-video-renderer");

    const data = [];

    for (const link of links) {
        const ttle = await page.evaluate(elem => elem.title, link)
        const href = await page.evaluate(elem => elem.href, link)

        data.push(href.split("&")[0]+", "+ttle);
        // console.log({
        //     title:title,
        //     href: href.split("&")[0]
        // })
    }
    const csv = data.join("\n");

    fs.writeFileSync(title.replace(" ","_").toLowerCase()+".txt", csv, "utf-8");
    await browser.close()

}


function main() {
    const args = process.argv.slice(2)
    // Check for the presence of -playlist argument
    const playlistIndex = args.indexOf('--playlist');

    if (playlistIndex !== -1 && playlistIndex + 1 < args.length) {
        const playlistLink = args[playlistIndex + 1];
        if (playlistLink.length == 0) {
            return
        }
        run(playlistLink);
    // Add your logic to process the playlist link here
    } else {
    // Display help if -playlist argument is not found
        displayHelp();
    }

}

main()


