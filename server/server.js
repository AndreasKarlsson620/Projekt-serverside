const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 2468;

const { getAllBoats, getBoat, addBoat, deleteBoat, search } = require('./database.js');

//MIDDLEWARE
app.use( express.static(__dirname + '/../frontend') )
app.use( (req, res, next) => {
	console.log(`${req.method} ${req.url}`);
	next()
} )
app.use( bodyParser.urlencoded({ extended: true }) )
app.use( bodyParser.json() )

//ROUTES
app.get('/', (req, res) => {
	console.log('GET /  (index.html)');
    res.sendFile(__dirname + '/frontend/index.html');
})
/*level up
app.get('/assets/', (req, res) => {
	console.log('GET /  assets');
})
*/
app.get('/boats/', (req, res) => {
	getAllBoats(dataOrError => {
		res.send(dataOrError)
	});
})
app.get('/boat/:id', (req, res) => {
	getBoat(req.params.id, dataOrError => {
		res.send(dataOrError)
	})
})
app.post('/boat/', (req, res) => {
	addBoat(req.body, dataOrError => {
		res.send(dataOrError)
	})
})
app.delete('/boat/:id', (req, res) => {
	deleteBoat(req.params.id, dataOrError => {
		res.send(dataOrError)
	})
})
/*level up
app.put('/boat/', (req, res) => {
	console.log('PUT /  boat');
})
*/
//SEARCH
app.get('/search/', (req, res) => {
	console.log('Search route');
	search(req.query, dataOrError => {
		res.send(dataOrError)
	})
})

//START WEB SERVER
app.listen(port, () =>
{
    console.log("Web server listening on localhost:" + port);
})
