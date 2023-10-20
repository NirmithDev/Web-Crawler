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
const port = 3000;

/* TODO:
const mongourl = "________________________________";
const dbName = "_______________";

const fruitsCollectionName = "_______________";
const movieCollection = "_______________";

const client = new MongoClient(mongourl, { useNewUrlParser: true, useUnifiedTopology: true });

let fruitPages;
let moviePages;

const index = elasticlunr(function () {
    this.addField('title');
    this.addField('body');
    this.addField('paragraphs');
    this.addField('id');
    this.setRef('id');
});

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to database.");

        db = client.db(dbName);

        const pagesCollection = db.collection(pagesCollectionName);
        pages = await pagesCollection.find({}).toArray();
        pages.forEach(function (p) {
            index.addDoc({
            id: p._id.toString(),
            url: p.url || '', 
            title: p.title || '',
            paragraphs: p.paragraphs || '', 
            outgoingLinks: p.outgoingLinks || 0
            });
        });
    } catch (err) {
        console.error("Error connecting to the database:", err);
    }
}

connectToDatabase();

*/






app.get('/', function (req, res) {
    res.status(200).render('app'); 
});

app.get('/search', function (req, res) {
    res.status(200).render('app', {search: true}); 
});

//Start the server
app.listen(port, () => {
    console.log(`Now listening on port ${port}`); 
});
