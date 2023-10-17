const Crawler = require("crawler");
const url = require("url");
const { MongoClient } = require('mongodb');

const dbName = "fruitDB";
const dbUrl = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.6";

const client = new MongoClient(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

//this is for the fruits
let visitedUrls = new Set();
let visitedTitles = new Set();
let pageCount = 0;

//same as before an alternative to it so something like fruits
let visitedUrlsAmazon = new Set();
let visitedTitlesAmazon = new Set();
let pageCountAmazon = 0;

const seedLinks = [
    'https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-0.html',
    'https://www.amazon.ca/MAXPOWER-Three-Layer-Multi-Function-Organizer-Dividers/dp/B096TGB757/?_encoding=UTF8&pd_rd_w=Oi4It&content-id=amzn1.sym.0606cc44-75bd-471a-a861-3925e60effe6%3Aamzn1.symc.e5c80209-769f-4ade-a325-2eaec14b8e0e&pf_rd_p=0606cc44-75bd-471a-a861-3925e60effe6&pf_rd_r=25R3BMXYKNB9VJ755MT3&pd_rd_wg=3Hpau&pd_rd_r=91a8964d-6582-4f8c-ae34-6e46187358ad&ref_=pd_gw_ci_mcx_mr_hp_atf_m&th=1'
    // Add more seed links here
  ];


let tempCollection =[]
//keeping a counter that will keep upto date the number of pages I visit
//let fruitSitePagesCrawled = 0;
let chosenSitePagesCrawled = 0;
//const maxFruitSitePages = 1000;
const minChosenSitePages = 500;

const crawler = new Crawler({
    maxConnections: 10,
    callback: async function (error, res, done) {
        try {
            if (error) {
                console.error(error);
                return;
            }

            const $ = res.$;
            const title = $("title").text().trim();
            currentURL = res.request.uri.href
            if (currentURL.startsWith('https://people.scs.carleton.ca')) {
                if (!visitedUrls.has(res.request.uri.href) || !visitedTitles.has(title)) {
                    visitedUrls.add(res.request.uri.href);
                    visitedTitles.add(title);
                    const linksText = [];
                    const incomingLinks = []; // Initialize for incoming links
    
                    $("a").each(function (i, link) {
                        const href = $(link).attr("href");
                        if (href) {
                            const absoluteUrl = url.resolve(res.request.uri.href, href);
                            crawler.queue(absoluteUrl);
    
                            // Record the URL of the current page as an outgoing link
                            linksText.push(absoluteUrl);
    
                            // Record the URL of the current page as an incoming link for the linked page
                            incomingLinks.push(absoluteUrl);
                        }
                    });
                    // Output the extracted content
                    //console.log("URL: " + res.request.uri.href);
                    const pageData = {
                        url: res.request.uri.href,
                        title: title,
                        keywords: $("meta[name=Keywords]").attr("content"),
                        description: $("meta[name=Description]").attr("content"),
                        paragraphs: $("p").text(),
                        linksText: linksText,
                        incomingLinks: incomingLinks,
                        size:incomingLinks.length // Store incoming links
                    };
                    tempCollection.push(pageData);
    
                    pageCount++;
                }
            }else{
                //this will be the other chosen seedLink
                console.log("THIS IS A RANDOM LINK")
                console.log(title)
                if(!visitedUrlsAmazon.has(res.request.uri.href) || !visitedTitlesAmazon.has(title)){
                    visitedUrlsAmazon.add(res.request.uri.href);
                    visitedTitlesAmazon.add(title);
                    console.log(res.$)
                    const pageDataforAmazon = {
                        url: res.request.uri.href,
                        title: title,
                        keywords: $("meta[name=Keywords]").attr("content"),
                        description: $("meta[name=Description]").attr("content"),
                        paragraphs: $("p").text()
                    };
                    console.log(pageDataforAmazon)
                }
            }
            
        } catch (err) {
            console.error("Error during crawling:", err);
        } finally {
            done();
        }
    },
});


crawler.on('drain', async function () {
    try {
        console.log(`Crawling is complete. Total pages crawled: ${pageCount}`);
        await insertDataDB();
    } catch (err) {
        console.error("Error during data insertion:", err);
    } finally {
        await client.close();
    }
});

async function insertDataDB() {
    try {
        await client.connect();
        const db = client.db(dbName);
        await db.dropDatabase();
        console.log("Dropped 'fruitDB' database.");
        const collection = db.collection("fruitsData");
        const result = await collection.insertMany(tempCollection);

        console.log(`Inserted ${result.insertedCount} documents into the database.`);
    } catch (err) {
        console.error("Error inserting data into MongoDB:", err);
    }
}


seedLinks.forEach((dataLink)=>{
    crawler.queue(dataLink)
})
//crawler.queue('https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-0.html');
