#!/usr/bin/env node

const puppeteer = require("puppeteer");
const fs = require("fs")
const process = require("process")

function displayHelp() {
  console.log('Usage: node index.js --playlist playlist_link');
}


var url = "https://theeventprime.com/category/wordpress-event-tutorials/page/"
var pages = [1,2,3,4,5,6];
async function run(plink) {
    const browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage();
    console.log("Getting your page");
    let link = plink+"4/";
    console.log(link);
    await page.goto(link);
    const title = await page.evaluate(() => document.head);
    console.log(title)


    // fs.writeFileSync(title.replace(" ","_").toLowerCase()+".txt", csv, "utf-8");
    await browser.close()

}


function main() {
    run(url);

}

main()


