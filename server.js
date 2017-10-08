const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Up and running');
});

app.get('/api/policy/:policyId', (req, res) => {
    res.send(require('./test-data/policy.json'));
});

app.post('/api/message', (req, res) => {
    // this should be submitted to Watson
    const message = req.body.text;

    // here a watson call happens

    // policyId not detected
    /**
    res.send({
        intend: 'other',
        args: null,
        text: 'Could you provide more informations?'
    });
    */

    // policyId detected in the message
    // we need to keep the "policyProvided" code, as it is already integrated in the client
    res.send({
        intend: 'policyProvided',
        args: {
            policyId: 123
        },
        text: 'Thank you, your message has been submitted to the insurance agent.'
    });
});

app.get('/', (req, res) => {
    res.send('Up and running');
});
 
app.listen(3000, () => {
    console.log('RoboClaim API running at port 3000');
});
