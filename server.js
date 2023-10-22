const express = require('express');
const pug = require('pug');
const { MongoClient, ObjectId } = require("mongodb");
const elasticlunr = require("elasticlunr");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use('/css', express.static(__dirname + '/styles'));
app.use('/images', express.static(__dirname + '/images'));
app.set('/views', __dirname + '/views');
app.set('view engine', 'pug');
app.set('json spaces', 2)
const port = 3000;

const mongourl = "mongodb+srv://johnwscaife:databasepassword@cluster0.qpyexxh.mongodb.net/?retryWrites=true&w=majority";
const DBName = "pagesDB";

const personalCollectionName = "personalPages";
const fruitCollectionName = "pages";

const client = new MongoClient(mongourl, { useNewUrlParser: true, useUnifiedTopology: true });

let personalPages = [];
let fruitPages = [];

const personalPagesSearch = elasticlunr(function () {
    this.addField('title');
    this.addField('paragraphs');
    this.addField('id');
    this.setRef('id');
});

const fruitPagesSearch = elasticlunr(function () {
    this.addField('title');
    this.addField('paragraphs');
    this.addField('id');
    this.setRef('id');
});

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to database.");

        db = client.db(DBName);

        const personalCollection = db.collection(personalCollectionName);
        const fruitCollection = db.collection(fruitCollectionName);

        personalPages = await personalCollection.find({}).toArray();
        fruitPages = await fruitCollection.find({}).toArray();

        personalPages.forEach(function (p) {
            p.pagerank = { '$numberDouble': '0.001' }
            index.addDoc({
                id: p._id.toString(),
                title: p.title || '',
                paragraphs: p.paragraphs || ''
            });
        });
        fruitPages.forEach(function (p) {
            p.pagerank = { '$numberDouble': '0.001' }
            index.addDoc({
                id: p._id.toString(),
                title: p.title || '',
                paragraphs: p.paragraphs || ''
            });
        });
    } catch (err) {
        console.error("Error connecting to the database:", err);
    }
}

connectToDatabase();

console.log(fruitPages[0]);
console.log(personalPages[0]);




// Render the home page
app.get('/', function (req, res) {
    res.status(200).render('app'); 
});

// Render the search page
app.get('/search', function (req, res) {
    res.status(200).render('app', {search: true}); 
});

// Search results for personal collection
app.get('/personal', function (req, res) {

    // Get query parameters
    let q = req.query.q;
    let boost = req.query.boost;
    let limit = req.query.limit;

    // Initialize variables
    let results = [];
    let page_list = [];

    // Search the collection
    if (boost == 'true') {
        console.log('boost = true');
        page_list = personalPages.slice(0,parseInt(limit));
    } else {
        results = personalPagesSearch.search(q, {expand: true}).slice(0,parseInt(limit));
        console.log(results);
        results.forEach((result) => {
            p = personalPages.find(page => page._id.toString() == (result.ref));
            p.score = result.score;
            page_list.push(p);
        });
    }
    res.status(200).render('app', {results: page_list, type: 'personal'}); 
});

// Search results for personal collection in JSON
app.get('/personal/JSON', function (req, res) {
    // TODO: Get results based on the search parameters
    // TODO: add group members names to the json render
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(fruitPages);
});

// View specific page data from personal collection
app.get('/personal/:id', function (req, res) {
    // TODO: retrieve the page based on id
    res.status(200).render('app', {page: fruitPages[0], type: 'personal'}); 
});

// View specific page data from personal collection in JSON
app.get('/personal/:id/JSON', function (req, res) {
    // TODO: retrieve the page based on id
    // TODO: add group members names to the json render
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(fruitPages[0]);
}); 

// Search results for fruits collection
app.get('/fruits', function (req, res) {
    // TODO: Get results based on the search parameters
    res.status(200).render('app', {results: fruitPages, type: 'fruits'}); 
});

// Search results for fruits collection in JSON
app.get('/fruits/JSON', function (req, res) {
    // TODO: Get results based on the search parameters
    // TODO: add group members names to the json render
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(fruitPages);
});

// View specific page data from fruits collection
app.get('/fruits/:id', function (req, res) {
    // TODO: retrieve the page based on id
    res.status(200).render('app', {page: fruitPages[0], type: 'fruits'}); 
});

// View specific page data from fruits collection in JSON
app.get('/fruits/:id/JSON', function (req, res) {
    // TODO: retrieve the page based on id
    // TODO: add group members names to the json render
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(fruitPages[0]);
});

//Start the server
app.listen(port, () => {
    console.log(`Now listening on port ${port}`); 
});
