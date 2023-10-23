//Required module (install via NPM)
const Crawler = require("crawler");
const url = require("url");
const { MongoClient } = require('mongodb');
const DBname = "pagesDB";
const {Matrix} = require("ml-matrix");
const cheerio = require('cheerio');

//Connection URL
const mongourl = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.6";

//Create a MongoClient instance
const client = new MongoClient(mongourl, { useNewUrlParser: true, useUnifiedTopology: true });

let visitedLinksPersonal = new Set();
let visitedTitlesPersonal = new Set();
let pageCounterPersonal = 0;
let tempDataPersonal = [];
let visited = new Set();
let n = 0;
//Initialize the database
async function databaseInit() {
  try {
    //Connect to MongoDB server
    await client.connect();
    console.log("Connected to database.");

    //Access the database using client.db(DBname)
    const db = client.db(DBname);

    //Drop the existing database if it exists
    await db.dropCollection("personalPages");
    try {
        await db.dropCollection("personalPages");
        console.log("Dropped collection.");
    } catch (err) {
        console.log("Failed to drop collection: " + err.message);
    }

    //Create the 'pages' collection
    const pagesCollection = db.collection("personalPages");
    const result = await pagesCollection.insertMany(tempDataPersonal);
    console.log("Pages added to the database!")

  } catch (err) {
    console.error("Error connecting to the database:", err);
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
    maxConnections : 10, //use this for parallel, rateLimit for individual
    rateLimit: 1000,

    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(n>=500){
            crawler.queue=[];
            crawler.emit("drain")
            return;
        }
        
        if(error) {
            console.log(error);
        } else {
            const $ = res.$; //get cheerio data, see cheerio docs for info

            const curLink = res.request.uri.href;
            //console.log(curLink)
            const curTitle = $('title').text().trim();
            //console.log(curTitle)

            let curParentLinkArr = res.request.path.split("/").slice(2);
            let curParentLink = "https://en.wikipedia.org/wiki/Main_Page" + "/" + curParentLinkArr.join("/");
            
            if (!visited.has(curParentLink) && !visitedTitlesPersonal.has(curTitle)) {
                visited.add(curParentLink);
                visitedTitlesPersonal.add(curTitle)
                n++;
                // visit everything (bfs)
                console.log(n)
                const summary = $('p').text()
                let connectedPages = new Set();
                $("a").each(function (i, link) {
                    let curLink = $(link).attr("href");
                    if (!curLink) {
                        return;
                    }
                    if (curLink.startsWith("/wiki/") && !curLink.startsWith("/wiki/File:")) {
                        curLink = "https://en.wikipedia.org/" + curLink;

                        connectedPages.add(curLink); 
                        if (!visited.has(curLink) && n < 500) {
                            crawler.queue(curLink);
                            // n++
                        }
                    }
                });
                curData = {
                    url: curLink,
                    title: curTitle,
                    paragraphs: summary,
                    outgoingLinks: connectedPages
                }
                tempDataPersonal.push(curData);
            /*if ((!visitedTitlesPersonal.has(curTitle) || !visitedLinksPersonal.has(curLink))) {
                visitedLinksPersonal.add(curLink);
                visitedTitlesPersonal.add(curTitle);
                const summary = $('p').text()
                //console.log(summary)
                let connectedPages = [];
                pageCounterPersonal++;
                console.log(pageCounterPersonal)
                $("a").each(function (i, link) {
                    //console.log(link)
                    const href = $(link).attr("href");
                    if (!curLink) {
                        return;
                    }
                    //if(href.includes("/wiki/") && !ignore.has(href) && !href.includes("/Template") && !href.includes(".jpg") && !href.includes("/File")&& !href.includes("/Help") && !href.includes("/Special") && !href.includes("/Wikipedia")){
                        //clear out  unwanted links
                    //console.log(href)
                    if(!ignore.has(href) &&
                    !href.startsWith("/wiki/File:")){
                        //console.log(href)
                        const absoluteUrl = url.resolve(res.request.uri.href, href);
                        crawler.queue(absoluteUrl)
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
            }*/
        }
        }
        done();
    }
});

//Perhaps a useful event
//Triggered when the queue becomes empty
//There are some other events, check crawler docs
crawler.on('drain', async function(){
    try {
        console.log("Done!");
        console.log(`We have crawled through ${n} pages...`);
    
        //Initialize 
        const a = 0.1;

        //Transition probability matrix
        
        //before initializing the database we must create an incoming link collection
        //so we iterate over the tempCollection
        for(i=0;i<tempDataPersonal.length;i++){
            //console.log(temp[i].url)
            tempDataPersonal[i].incomingLinks=[]
            for(j=0;j<tempDataPersonal.length;j++){
                if(i==j){
                    continue;
                }
                let a = new Set(tempDataPersonal[j].outgoingLinks)
                if(a.has(tempDataPersonal[i].url)){
                    incoming=true 
                    tempDataPersonal[i].incomingLinks.push(tempDataPersonal[j].url)
                }
                //console.log(temp[j].url)
                //if(temp[i].url = temp[j].outgoingLinks)
            }
        }
        console.log('Initializing Database...');
        await databaseInit();
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