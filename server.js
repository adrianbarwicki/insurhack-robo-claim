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

app.get('/api/policy/:policyNumber', (req, res) => {
    var policyNumber = req.params.policyNumber;
    if (!policyNumber) {
        res.status(404).send("Policy number not provided");
        return;
    }
    var url = "https://api.insurhack.com/gideep/PolicyPeriod_Set?$expand=PolicyContactRoles&$filter=PolicyNumber eq '" + policyNumber + "'";
    var options = {
        url: url,
        headers: {
            // 'keyid': 'b4d1ee3b-3abf-41bb-97c7-80ba3a34fa87'
            'keyid': 'bdaca0c0-4ed7-4600-86e4-e3bb45453fa7',
            'content-type': 'application/json',
            method: 'GET'
        }
    };
    console.log(url);
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("everything is fine!");
            console.log(body);
            res.send(body);
        } else {
            console.error("bad things happened: " + response);
            res.status(404).send("Policy number not found");
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
            policyId: 900000002064
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
