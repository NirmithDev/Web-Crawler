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

let visitedLinks = new Set();
let visitedTitles = new Set();
let pageCounter = 0;
let tempData = [];

let visitedLinksPersonal = new Set();
let visitedTitlesPersonal = new Set();
let pageCounterPersonal = 0;
let tempDataPersonal = [];

//Initialize the database
async function databaseInit() {
  try {
    //Connect to MongoDB server
    await client.connect();
    console.log("Connected to database.");

    //Access the database using client.db(DBname)
    const db = client.db(DBname);

    //Drop the existing database if it exists
    await db.dropDatabase();
    console.log("Dropped database.");

    //Create the 'pages' collection
    const pagesCollection = db.collection("pages");
    const result = await pagesCollection.insertMany(tempData);
    console.log("Pages added to the database!")

  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
}

const crawler = new Crawler({
    maxConnections : 10, //use this for parallel, rateLimit for individual
    //rateLimit: 10000,

    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            const $ = res.$; //get cheerio data, see cheerio docs for info

            const curLink = res.request.uri.href;
            const curTitle = $('title').text().trim();
            if (curLink.startsWith('https://people.scs.carleton.ca')) {
                if (!visitedTitles.has(curTitle) || !visitedLinks.has(curLink)) {
                    visitedLinks.add(curLink);
                    visitedTitles.add(curTitle);
                    // console.log('\nNew page has been added:');
                    // console.log('Link: ' + curLink);
                    // console.log('Title: ' + curTitle);
                    // console.log('\n');

                    let connectedPages = [];
                    $('a').each(function (i, link) {
                        const newPageLink = $(link).attr('href');
                        if (newPageLink) {
                            const absoluteUrl = url.resolve(res.request.uri.href, newPageLink);
                            connectedPages.push(absoluteUrl);
                            crawler.queue(absoluteUrl);
                        }
                    });

                    pageCounter++;
                    curData = {
                        url: res.request.uri.href,
                        title: curTitle,
                        keywords: $("meta[name=Keywords]").attr("content"),
                        description: $("meta[name=Description]").attr("content"),
                        paragraphs: $("p").text(),
                        connectedPages: connectedPages,
                        outgoingLinks: connectedPages.length,
                        incomingLinks: connectedPages.length
                    }
                    tempData.push(curData);
                    // console.log('\n Added New Page');
                    // console.log(JSON.stringify(curData));
                    // console.log('\n')
                }
            }else{
                const $ = res.$; //get cheerio data, see cheerio docs for info

                const curLink = res.request.uri.href;
                const curTitle = $('title').text().trim();
                const $title = $('.fDTGTb');
                //console.log($title.first().contents())
                //const $paragraph = $('.iUikZB .ipc-html-content-inner-div');
                const title = $title.first().contents().filter(function() {
                    return this.type === 'text';
                }).text().trim();

                link=res.request.uri.href
                const urlObject = new URL(link);

                // Remove the query parameters
                urlObject.search = '';

                // Convert it back to a string
                const strippedUrl = urlObject.toString();
                if ((!visitedTitlesPersonal.has(title) || !visitedLinksPersonal.has(strippedUrl)) && visitedLinksPersonal.size<500) {
                    //if(pageCounterPersonal<500){
                    visitedLinksPersonal.add(strippedUrl);
                    visitedTitlesPersonal.add(title);
                    console.log(visitedLinksPersonal)
                    //console.log(title)
                    //console.log(typeof(title))
                    //console.log(visitedLinksPersonal)
                    const genres = [];
                    $('.ipc-chip-list__scroller .ipc-chip--on-baseAlt .ipc-chip__text').each(function(i, element) {
                        const genre = $(element).text();
                        genres.push(genre);
                    });
                    //console.log(genres)
                    //const dateReleased = $('.iwmAVw .ipc-link').first().contents().filter(function(){
                    //    return this.type === 'text';
                    //});
                    //console.log(dateReleased[0].data)
                    let connectedPages = [];
                    //const imdbRating = $('span[itemProp="ratingValue"]').text();
                    //const poster = $('div.poster a img').attr('src');
                    const summary = $('p').text()
                    //console.log(summary);
                    //const summaryLink = $('.gUCZcO .ipc-inline-list__item .ipc-link')
                    pageCounterPersonal++;
                    console.log(pageCounterPersonal)
                    //console.log(summaryLink)
                    $(".celwidget .ipc-poster-card a.ipc-lockup-overlay").each(function (i, link) {
                        const href = $(link).attr("href");
                        if (href) {
                            const absoluteUrl = url.resolve(res.request.uri.href, href);
                            
                            crawler.queue(absoluteUrl);
                                
                            //console.log(absoluteUrl)
                            // Record the URL of the current page as an outgoing link
                            connectedPages.push(absoluteUrl);
                            // Record the URL of the current page as an incoming link for the linked page
                            //incomingLinks.push(absoluteUrl);
                        }
                    });
                    //console.log(connectedPages)
                }
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
        console.log(`We have crawled through ${pageCounter} pages...`);
    
        //Initialize 
        const a = 0.1;

        //Transition probability matrix
        let P = Matrix.zeros(pageCounter, pageCounter);
        for (const pageData of tempData) {
            pageData.pagerank = 1 / pageCounter;
            //pageData.adjacencyMatrix = new Array(N).fill(0);
        }
        for (let i = 0; i < pageCounter; i++) {
            let numOnes = 0;
            for (let j = 0; j < pageCounter; j++) {
                let currentPage = tempData[i];
                let comparedPage = tempData[j];
                if (currentPage.connectedPages.includes(comparedPage.url)) {
                    P.set(i,j,1);
                    numOnes += 1;
                } else {
                    P.set(i,j,0);
                }
            }
            if (numOnes <= 0) {
                for (let j = 0; j < pageCounter; j++) {
                    P.set(i,j,(1/pageCounter));
                }
            } else {
                for (let j = 0; j < pageCounter; j++) {
                    //check if i!=j then proceed
                    P.set(i,j,(P.get(i,j)/numOnes));
                }
            }
        }
        //I changed the 1-a for the dampin factor
        P = Matrix.mul(P, (1-a));
        P = Matrix.add(P, Matrix.mul(Matrix.ones(pageCounter, pageCounter),(a/pageCounter))); //see if you can change

        //Initial PageRank vector
        x0 = Matrix.zeros(1,pageCounter);
        x0.set(0,0,1);
        let curVector = x0;
        let lastVector = null;

        let eud = 1;
        let iteration = 0;
        while (eud > 0.0001 && iteration < 1000) {

            lastVector = curVector;
            curVector = curVector.mmul(P);

            eud = 0;
            for (let i = 0; i < pageCounter; i++) {
                for (let j = 0; j < pageCounter; j++) {
                    eud += (curVector.get(0,i)-lastVector.get(0,j)) * (curVector.get(0,i)-lastVector.get(0,j));
                }
            }
            eud = Math.sqrt(eud);
            iteration += 1;
            // console.log(`Iteration: ${iteration},       eud: ${eud}`);
        }

        for (let i = 0; i < pageCounter; i++) {
            tempData[i].pageRank = curVector.get(0,i);
        }
/*
        let top25 = tempData.slice();
        top25.sort((a, b) => b.pageRank - a.pageRank);
        top25 = top25.slice(0, 25);
        
        for (i = 0; i < top25.length; i++) {
            let page = top25[i];
            console.log(`#${i+1}. (${page.pageRank.toFixed(10)}) ${page.url}`);
        }
*/
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
    'https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-0.html',
    //'https://m.imdb.com/title/tt0107290/',
    //'https://m.imdb.com/title/tt0383574/?ref_=tt_sims_tt_i_1',
];
seedLinks.forEach((dataLink)=>{
    crawler.queue(dataLink)
})