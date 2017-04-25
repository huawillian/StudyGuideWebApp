var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
const FirebaseREST = require('firebase-rest').default;
var jsonClient = new FirebaseREST.JSONClient('https://studyguidemvp.firebaseio.com/');
var cors = require('cors');

var app = express();

app.use(cors())
app.use(morgan("combined"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// CURRENTLY HOSTED ON HEROKU https://secure-scrubland-91570.herokuapp.com
// e.g. https://secure-scrubland-91570.herokuapp.com/api/cards
// -------------- Handlers ------------------

// get card, req cardid, or card cardname
// respond with card object
app.get('/api/card', function(req, res) {
  console.log('attempting to retrieving card id', req.query.cardid);

  if(req.query.cardid === undefined || req.query.cardid.charAt(0) != "-") {
    res.status(500).send('invalid data to /api/card ' + req.query.cardid)   
    return;
  }

  jsonClient.get('/cards/' + req.query.cardid)
  .then(result => res.status(200).send(result.body));
});

// get cards, no query params
// respond with cards in {data: []}
app.get('/api/cards', function(req, res) {
  console.log('retrieving cards');

  jsonClient.get('/cards')
  .then(result => res.status(200).send(result.body));
});

// create a new card, req body: cardname, carddescription
// respond with card id or null
app.post('/api/card', function(req, res) {
  console.log('attempting to creating new card', req.body);

  if(req.body.cardname === undefined || req.body.carddescription === undefined) {
    res.status(500).send('invalid data to /api/card')
    return;
  }

  jsonClient.post('/cards', req.body)
  .then(result => res.status(res.status || 201).send(result.body));
});

// update a card, req query params: cardid and body: {cardsdescription: "some content"}
// respond with id, or null
app.patch('/api/card', function(req, res) {
  console.log('attempting to update new card', req.query.cardid, 'with', req.body);

  if(req.query.cardid === undefined || req.query.cardid.charAt(0) != "-") {
    res.status(500).send('invalid data to /api/card ' + req.query.cardid)   
    return;
  }

  jsonClient.patch('/cards/' + req.query.cardid, {carddescription: req.body.carddescription})
  .then(result => res.status(201).send(result.body));
});

// remove/delete a card, req query params: cardid
// respond with success or null
app.delete('/api/card', function(req, res) {
  console.log('attempting to delete card', req.query.cardid);

  if(req.query.cardid === undefined || req.query.cardid.charAt(0) != "-") {
    res.status(500).send('invalid data to /api/card ' + req.query.cardid)   
    return;
  }

  jsonClient.delete('/cards/' + req.query.cardid)
  .then(result => res.status(201).send(result.body));
});


// -------------- Listen Init ------------------

app.listen(process.env.PORT || 8000, function() {
  console.log('Shortly is listening on', process.env.PORT || 8000);
});