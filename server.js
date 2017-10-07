const express = require('express')
const app = express()
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Up and running');
});

app.get('/api/policy/:policyId', (req, res) => {
    res.send(require('./test-data/policy.json'));
});

app.post('/api/message', (req, res) => {
    res.send({ ok: 'ok' });
});

app.get('/', (req, res) => {
    res.send('Up and running');
});
 
app.listen(3000, () => {
    console.log('RoboClaim API running at port 3000');
});
