const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const request=require('request');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Up and running');
});

app.get('/api/policy/:policyId', (req, res) => {
    var policyNumber = req.params.policyId;
    if (!policyNumber) {
        res.status(404).send("Policy id not provided");
        return;
    }
    var url = "https://api.insurhack.com/gi/PolicyPeriod_Set('pc:" + policyNumber + "')?$expand=Submission,PolicyContactRoles,PriorLosses";
    var options = {
        url: url,
        headers: {
            'keyid': 'b4d1ee3b-3abf-41bb-97c7-80ba3a34fa87'
        }
    };
    console.log(url);
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("everything is fine!");
            res.send(body);
        } else {
            console.error("bad things happened: " + response);
            res.status(404).send("Policy id not found");
        }
    }
    request(options, callback);
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
