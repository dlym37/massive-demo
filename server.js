const express = require('express');
const bodyParser = require('body-parser');
const massive = require('massive');

const connectionString = 'postgres://ipifdlwyivkefi:e9303c08b640b48d86354b3d8ad385892bac48548e4385a47b015c0b6c79e64f@ec2-54-235-123-153.compute-1.amazonaws.com:5432/d370s34hjcbvr2?ssl=true';



const app = express();
app.use(bodyParser.json());

const port = 3000;

app.get('/', (req, res) => {
  const db = req.app.get('db');
  db.getAllInjuries().then(injuries => {
    res.send(injuries);
  });

});

app.get('/incidents', (req, res) => {
  const db = req.app.get('db');
  const state = req.query.state;
  if (state) {
    db.getIncidentsByState([state]).then(incidents => {
      res.send(incidents);
    })
  } else {
    db.getAllIncidents().then(incidents => {
      res.send(incidents);
    })
  }


});

app.post('/incidents', (req, res) => {
  const incident = req.body;
  const db = req.app.get('db');
  db.createIncident([
    incident.state,
    incident.injuryid,
    incident.causeid
  ]).then(results => {
    res.send(results[0]);
  });
});

app.patch('/incidents/:id', (req, res) => {
  const id = req.params.id;
  const fields = req.body;
  const db = req.app.get('db' );

 db.updateIncidents([fields.state, id]).then(results => {
    res.send(results);
  });
});

massive(connectionString).then(db => {
  app.set('db', db);
  app.listen(port, () => {
    console.log('Started server on port', port);
  });
});


