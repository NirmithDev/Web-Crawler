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

let tempFruits = [{"_id":{"$oid":"6532fb177bf980d168b12553"},"url":"https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-0.html","title":"N-0","keywords":null,"description":null,"paragraphs":"\nbanana\napple\nbanana\napple\ncoconut\ncoconut\nbanana\nbanana\npeach\npeach\napple\nbanana\nbanana\npear\napple\nbanana\nbanana\nbanana\npear\ncoconut\nbanana\nbanana\npeach\npeach\ncoconut\napple\napple\napple\npear\napple\ncoconut\npeach\nbanana\npeach\nbanana\npeach\napple\npeach\npear\npeach\npear\napple\nbanana\napple\npear\ncoconut\npear\npeach\napple\npear\npear\ncoconut\npeach\napple\napple\nbanana\nbanana\npeach\ncoconut\napple\nbanana\npeach\ncoconut\npear\napple\nbanana\npeach\napple\nbanana\npeach\nbanana\nbanana\npeach\npeach\napple\nbanana\napple\nbanana\npear\napple\nbanana\napple\nbanana\ncoconut\npear\npear\npear\n","connectedPages":["https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-3.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-39.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-60.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-104.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-124.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-157.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-174.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-176.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-198.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-231.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-266.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-334.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-387.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-423.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-472.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-823.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-854.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-877.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-937.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-1.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-13.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-20.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-33.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-42.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-66.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-83.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-100.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-108.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-142.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-167.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-175.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-288.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-346.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-391.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-567.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-912.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-945.html"],"outgoingLinks":{"$numberInt":"37"},"incomingLinks":{"$numberInt":"37"},"pagerank":{"$numberDouble":"0.001"},"pageRank":{"$numberDouble":"0.01045874703458462"}},{"_id":{"$oid":"6532fb177bf980d168b12553"},"url":"https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-0.html","title":"N-0","keywords":null,"description":null,"paragraphs":"\nbanana\napple\nbanana\napple\ncoconut\ncoconut\nbanana\nbanana\npeach\npeach\napple\nbanana\nbanana\npear\napple\nbanana\nbanana\nbanana\npear\ncoconut\nbanana\nbanana\npeach\npeach\ncoconut\napple\napple\napple\npear\napple\ncoconut\npeach\nbanana\npeach\nbanana\npeach\napple\npeach\npear\npeach\npear\napple\nbanana\napple\npear\ncoconut\npear\npeach\napple\npear\npear\ncoconut\npeach\napple\napple\nbanana\nbanana\npeach\ncoconut\napple\nbanana\npeach\ncoconut\npear\napple\nbanana\npeach\napple\nbanana\npeach\nbanana\nbanana\npeach\npeach\napple\nbanana\napple\nbanana\npear\napple\nbanana\napple\nbanana\ncoconut\npear\npear\npear\n","connectedPages":["https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-3.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-39.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-60.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-104.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-124.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-157.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-174.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-176.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-198.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-231.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-266.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-334.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-387.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-423.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-472.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-823.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-854.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-877.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-937.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-1.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-13.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-20.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-33.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-42.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-66.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-83.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-100.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-108.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-142.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-167.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-175.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-288.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-346.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-391.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-567.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-912.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-945.html"],"outgoingLinks":{"$numberInt":"37"},"incomingLinks":{"$numberInt":"37"},"pagerank":{"$numberDouble":"0.001"},"pageRank":{"$numberDouble":"0.01045874703458462"}},{"_id":{"$oid":"6532fb177bf980d168b12553"},"url":"https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-0.html","title":"N-0","keywords":null,"description":null,"paragraphs":"\nbanana\napple\nbanana\napple\ncoconut\ncoconut\nbanana\nbanana\npeach\npeach\napple\nbanana\nbanana\npear\napple\nbanana\nbanana\nbanana\npear\ncoconut\nbanana\nbanana\npeach\npeach\ncoconut\napple\napple\napple\npear\napple\ncoconut\npeach\nbanana\npeach\nbanana\npeach\napple\npeach\npear\npeach\npear\napple\nbanana\napple\npear\ncoconut\npear\npeach\napple\npear\npear\ncoconut\npeach\napple\napple\nbanana\nbanana\npeach\ncoconut\napple\nbanana\npeach\ncoconut\npear\napple\nbanana\npeach\napple\nbanana\npeach\nbanana\nbanana\npeach\npeach\napple\nbanana\napple\nbanana\npear\napple\nbanana\napple\nbanana\ncoconut\npear\npear\npear\n","connectedPages":["https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-3.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-39.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-60.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-104.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-124.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-157.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-174.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-176.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-198.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-231.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-266.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-334.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-387.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-423.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-472.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-823.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-854.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-877.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-937.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-1.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-13.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-20.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-33.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-42.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-66.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-83.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-100.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-108.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-142.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-167.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-175.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-288.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-346.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-391.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-567.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-912.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-945.html"],"outgoingLinks":{"$numberInt":"37"},"incomingLinks":{"$numberInt":"37"},"pagerank":{"$numberDouble":"0.001"},"pageRank":{"$numberDouble":"0.01045874703458462"}},{"_id":{"$oid":"6532fb177bf980d168b12553"},"url":"https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-0.html","title":"N-0","keywords":null,"description":null,"paragraphs":"\nbanana\napple\nbanana\napple\ncoconut\ncoconut\nbanana\nbanana\npeach\npeach\napple\nbanana\nbanana\npear\napple\nbanana\nbanana\nbanana\npear\ncoconut\nbanana\nbanana\npeach\npeach\ncoconut\napple\napple\napple\npear\napple\ncoconut\npeach\nbanana\npeach\nbanana\npeach\napple\npeach\npear\npeach\npear\napple\nbanana\napple\npear\ncoconut\npear\npeach\napple\npear\npear\ncoconut\npeach\napple\napple\nbanana\nbanana\npeach\ncoconut\napple\nbanana\npeach\ncoconut\npear\napple\nbanana\npeach\napple\nbanana\npeach\nbanana\nbanana\npeach\npeach\napple\nbanana\napple\nbanana\npear\napple\nbanana\napple\nbanana\ncoconut\npear\npear\npear\n","connectedPages":["https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-3.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-39.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-60.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-104.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-124.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-157.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-174.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-176.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-198.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-231.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-266.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-334.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-387.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-423.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-472.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-823.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-854.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-877.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-937.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-1.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-13.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-20.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-33.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-42.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-66.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-83.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-100.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-108.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-142.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-167.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-175.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-288.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-346.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-391.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-567.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-912.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-945.html"],"outgoingLinks":{"$numberInt":"37"},"incomingLinks":{"$numberInt":"37"},"pagerank":{"$numberDouble":"0.001"},"pageRank":{"$numberDouble":"0.01045874703458462"}},{"_id":{"$oid":"6532fb177bf980d168b12553"},"url":"https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-0.html","title":"N-0","keywords":null,"description":null,"paragraphs":"\nbanana\napple\nbanana\napple\ncoconut\ncoconut\nbanana\nbanana\npeach\npeach\napple\nbanana\nbanana\npear\napple\nbanana\nbanana\nbanana\npear\ncoconut\nbanana\nbanana\npeach\npeach\ncoconut\napple\napple\napple\npear\napple\ncoconut\npeach\nbanana\npeach\nbanana\npeach\napple\npeach\npear\npeach\npear\napple\nbanana\napple\npear\ncoconut\npear\npeach\napple\npear\npear\ncoconut\npeach\napple\napple\nbanana\nbanana\npeach\ncoconut\napple\nbanana\npeach\ncoconut\npear\napple\nbanana\npeach\napple\nbanana\npeach\nbanana\nbanana\npeach\npeach\napple\nbanana\napple\nbanana\npear\napple\nbanana\napple\nbanana\ncoconut\npear\npear\npear\n","connectedPages":["https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-3.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-39.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-60.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-104.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-124.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-157.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-174.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-176.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-198.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-231.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-266.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-334.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-387.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-423.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-472.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-823.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-854.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-877.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-937.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-1.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-13.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-20.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-33.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-42.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-66.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-83.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-100.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-108.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-142.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-167.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-175.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-288.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-346.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-391.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-567.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-912.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-945.html"],"outgoingLinks":{"$numberInt":"37"},"incomingLinks":{"$numberInt":"37"},"pagerank":{"$numberDouble":"0.001"},"pageRank":{"$numberDouble":"0.01045874703458462"}},{"_id":{"$oid":"6532fb177bf980d168b12553"},"url":"https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-0.html","title":"N-0","keywords":null,"description":null,"paragraphs":"\nbanana\napple\nbanana\napple\ncoconut\ncoconut\nbanana\nbanana\npeach\npeach\napple\nbanana\nbanana\npear\napple\nbanana\nbanana\nbanana\npear\ncoconut\nbanana\nbanana\npeach\npeach\ncoconut\napple\napple\napple\npear\napple\ncoconut\npeach\nbanana\npeach\nbanana\npeach\napple\npeach\npear\npeach\npear\napple\nbanana\napple\npear\ncoconut\npear\npeach\napple\npear\npear\ncoconut\npeach\napple\napple\nbanana\nbanana\npeach\ncoconut\napple\nbanana\npeach\ncoconut\npear\napple\nbanana\npeach\napple\nbanana\npeach\nbanana\nbanana\npeach\npeach\napple\nbanana\napple\nbanana\npear\napple\nbanana\napple\nbanana\ncoconut\npear\npear\npear\n","connectedPages":["https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-3.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-39.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-60.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-104.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-124.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-157.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-174.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-176.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-198.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-231.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-266.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-334.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-387.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-423.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-472.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-823.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-854.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-877.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-937.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-1.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-13.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-20.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-33.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-42.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-66.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-83.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-100.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-108.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-142.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-167.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-175.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-288.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-346.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-391.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-567.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-912.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-945.html"],"outgoingLinks":{"$numberInt":"37"},"incomingLinks":{"$numberInt":"37"},"pagerank":{"$numberDouble":"0.001"},"pageRank":{"$numberDouble":"0.01045874703458462"}},{"_id":{"$oid":"6532fb177bf980d168b12553"},"url":"https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-0.html","title":"N-0","keywords":null,"description":null,"paragraphs":"\nbanana\napple\nbanana\napple\ncoconut\ncoconut\nbanana\nbanana\npeach\npeach\napple\nbanana\nbanana\npear\napple\nbanana\nbanana\nbanana\npear\ncoconut\nbanana\nbanana\npeach\npeach\ncoconut\napple\napple\napple\npear\napple\ncoconut\npeach\nbanana\npeach\nbanana\npeach\napple\npeach\npear\npeach\npear\napple\nbanana\napple\npear\ncoconut\npear\npeach\napple\npear\npear\ncoconut\npeach\napple\napple\nbanana\nbanana\npeach\ncoconut\napple\nbanana\npeach\ncoconut\npear\napple\nbanana\npeach\napple\nbanana\npeach\nbanana\nbanana\npeach\npeach\napple\nbanana\napple\nbanana\npear\napple\nbanana\napple\nbanana\ncoconut\npear\npear\npear\n","connectedPages":["https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-3.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-39.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-60.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-104.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-124.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-157.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-174.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-176.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-198.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-231.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-266.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-334.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-387.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-423.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-472.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-823.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-854.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-877.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-937.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-1.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-13.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-20.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-33.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-42.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-66.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-83.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-100.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-108.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-142.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-167.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-175.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-288.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-346.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-391.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-567.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-912.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-945.html"],"outgoingLinks":{"$numberInt":"37"},"incomingLinks":{"$numberInt":"37"},"pagerank":{"$numberDouble":"0.001"},"pageRank":{"$numberDouble":"0.01045874703458462"}},{"_id":{"$oid":"6532fb177bf980d168b12553"},"url":"https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-0.html","title":"N-0","keywords":null,"description":null,"paragraphs":"\nbanana\napple\nbanana\napple\ncoconut\ncoconut\nbanana\nbanana\npeach\npeach\napple\nbanana\nbanana\npear\napple\nbanana\nbanana\nbanana\npear\ncoconut\nbanana\nbanana\npeach\npeach\ncoconut\napple\napple\napple\npear\napple\ncoconut\npeach\nbanana\npeach\nbanana\npeach\napple\npeach\npear\npeach\npear\napple\nbanana\napple\npear\ncoconut\npear\npeach\napple\npear\npear\ncoconut\npeach\napple\napple\nbanana\nbanana\npeach\ncoconut\napple\nbanana\npeach\ncoconut\npear\napple\nbanana\npeach\napple\nbanana\npeach\nbanana\nbanana\npeach\npeach\napple\nbanana\napple\nbanana\npear\napple\nbanana\napple\nbanana\ncoconut\npear\npear\npear\n","connectedPages":["https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-3.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-39.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-60.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-104.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-124.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-157.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-174.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-176.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-198.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-231.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-266.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-334.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-387.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-423.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-472.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-823.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-854.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-877.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-937.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-1.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-13.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-20.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-33.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-42.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-66.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-83.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-100.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-108.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-142.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-167.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-175.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-288.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-346.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-391.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-567.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-912.html","https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-945.html"],"outgoingLinks":{"$numberInt":"37"},"incomingLinks":{"$numberInt":"37"},"pagerank":{"$numberDouble":"0.001"},"pageRank":{"$numberDouble":"0.01045874703458462"}}];
// console.log(tempFruits);

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
    // TODO: Get results based on the search parameters
    res.status(200).render('app', {results: tempFruits, type: 'personal'}); 
});

// Search results for personal collection in JSON
app.get('/personal/JSON', function (req, res) {
    // TODO: Get results based on the search parameters
    // TODO: add group members names to the json render
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(tempFruits);
});

// View specific page data from personal collection
app.get('/personal/:id', function (req, res) {
    // TODO: retrieve the page based on id
    res.status(200).render('app', {page: tempFruits[0], type: 'personal'}); 
});

// View specific page data from personal collection in JSON
app.get('/personal/:id/JSON', function (req, res) {
    // TODO: retrieve the page based on id
    // TODO: add group members names to the json render
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(tempFruits[0]);
}); 

// Search results for fruits collection
app.get('/fruits', function (req, res) {
    // TODO: Get results based on the search parameters
    res.status(200).render('app', {results: tempFruits, type: 'fruits'}); 
});

// Search results for fruits collection in JSON
app.get('/fruits/JSON', function (req, res) {
    // TODO: Get results based on the search parameters
    // TODO: add group members names to the json render
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(tempFruits);
});

// View specific page data from fruits collection
app.get('/fruits/:id', function (req, res) {
    // TODO: retrieve the page based on id
    res.status(200).render('app', {page: tempFruits[0], type: 'fruits'}); 
});

// View specific page data from fruits collection in JSON
app.get('/fruits/:id/JSON', function (req, res) {
    // TODO: retrieve the page based on id
    // TODO: add group members names to the json render
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(tempFruits[0]);
});

//Start the server
app.listen(port, () => {
    console.log(`Now listening on port ${port}`); 
});
