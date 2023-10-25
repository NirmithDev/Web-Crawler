//Required module (install via NPM)
const Crawler = require("crawler");
const url = require("url");
const { MongoClient } = require('mongodb');
const DBname = "pagesDB";
const {Matrix} = require("ml-matrix");
const cheerio = require('cheerio');

const mongourl = "mongodb+srv://johnwscaife:databasepassword@cluster0.qpyexxh.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(mongourl, { useNewUrlParser: true, useUnifiedTopology: true });

let visitedLinksPersonal = new Set();
let visitedTitlesPersonal = new Set();
let pageCounterPersonal = 0;
let tempDataPersonal = [];

async function databaseInit() {
  try {
    await client.connect();
    console.log("Connected to database.");

    const db = client.db(DBname);

    try {
        await db.dropCollection("personalPages");
        console.log("Dropped collection.");
    } catch (err) {
        console.log("Failed to drop collection: " + err.message);
    }

    const pagesCollection = db.collection("personalPages");
    const result = await pagesCollection.insertMany(tempDataPersonal);
    console.log("Pages added to the database!")
  } catch (err) {
    console.error("Error connecting to the database: ", err);
  }
}

const ignore = new Set([
    '/wiki/File:',
    '/wiki/Special:',
    '/wiki/Talk:',
    '/wiki/User:',
    '/wiki/Category:',
    '/wiki/Template:',
    '/wiki/Help:',
    '/wiki/Portal:',
]);

const crawler = new Crawler({
    maxConnections : 1,
    rateLimit: 1000,

    callback : function (error, res, done) {
        if(pageCounterPersonal>=500){
            crawler.queue=[];
            crawler.emit("drain")
            return;
        }
        
        if(error){
            console.log(error);
        }else{
            const $ = res.$; //get cheerio data, see cheerio docs for info

            const curLink = res.request.uri.href;
            console.log(curLink)
            const curTitle = $('title').text().trim();
            console.log(curTitle)
            if ((!visitedTitlesPersonal.has(curTitle) || !visitedLinksPersonal.has(curLink))) {
                visitedLinksPersonal.add(curLink);
                visitedTitlesPersonal.add(curTitle);
                const summary = $('p').text()
                let connectedPages = [];
                pageCounterPersonal++;
                console.log(pageCounterPersonal)
                if (res.request.uri.href.endsWith('.jpg')) {
                    console.log(`Skipping image URL: ${res.request.uri.href}`);
                    return;
                }
                $("a").each(function (i, link) {
                    const href = $(link).attr("href");
                    //if(href.includes("/wiki/") && !ignore.has(href) && !href.includes("/Template") && !href.includes(".jpg") && !href.includes("/File")&& !href.includes("/Help") && !href.includes("/Special") && !href.includes("/Wikipedia")){
                        //clear out  unwanted links
                    if(!ignore.has(href)){
                        console.log(href)
                        const absoluteUrl = url.resolve(res.request.uri.href, href);
                        //crawler.queue(absoluteUrl)
                        //connectedPages.push(absoluteUrl)
                        
                    }
                })
                curData = {
                    url: curLink,
                    title: curTitle,
                    paragraphs: summary,
                    outgoingLinks: connectedPages
                }
                tempDataPersonal.push(curData);
            }
        }
        done();
        
    }
});

crawler.on('drain', async function(){
    try {
        console.log("Done!");
        console.log(`We have crawled through ${pageCounterPersonal} pages...`);
    
        const a = 0.1;

        // TODO: Transition probability matrix
        
        //before initializing the database we must create an incoming link collection
        //so we iterate over the tempCollection
        for(i=0; i<tempDataPersonal.length; i++){
            tempDataPersonal[i].incomingLinks=[]

            for(j=0; j<tempDataPersonal.length; j++){
                if(i==j) {
                    continue;
                } else {
                    let a = new Set(tempDataPersonal[j].outgoingLinks)
                    if(a.has(tempDataPersonal[i].url)){
                        incoming = true
                        tempDataPersonal[i].incomingLinks.push(tempDataPersonal[j].url)
                    }
                }
            }
        }

        console.log('Initializing Database...');
        //await databaseInit();
    } catch (err) {
        console.error("Error furing data insertion: " + err.message);
    } finally {
        await client.close();
    }
});

//Queue a URL, which starts the crawl
//switch to imdb
const seedLinks = [
    'https://en.wikipedia.org/wiki/Main_Page',
    
];
seedLinks.forEach((dataLink)=>{
    crawler.queue(dataLink)
})