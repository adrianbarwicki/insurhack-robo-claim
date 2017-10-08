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

    return res.send({
        "@odata.context": "http://gw.api.insurhack.com/pc/service/odata.svc$metadata#zde.entities.PolicyPeriod/$entity",
        "UNLineExists": false,
        "GeneralTermsAndConditions_ZDE": "",
        "GEBLineExists": false,
        "BranchNumber": 1,
        "CancellationDate": null,
        "JobCompletionTitle": "Submission Bound",
        "UWCompanyCode": "tc_21",
        "DepositAmount": null,
        "TermType": "tc_Annual",
        "CustomBilling": false,
        "PolicyNumber": "900000000169",
        "MSLineExists": false,
        "UWIssuesActiveOnly": [],
        "TermEndDate_ZDE": "2018-11-01",
        "PeriodDisplayStatus": "Scheduled",
        "CooperationKeyValue": null,
        "EditEffectiveDate": "2017-11-01",
        "PolicyStartDate": "2017-11-01",
        "MainDueDateAsStr_ZDE": "01.11.",
        "UpdateTime": "2017-10-05T13:50:22Z",
        "RSLineExists": false,
        "HRLineExists": false,
        "HALineExists": true,
        "Status": "tc_Bound",
        "Canceled": false,
        "CreateTime": "2017-10-05",
        "AltBillingAccountNumber": null,
        "PublicID": "pc:207",
        "PriorLosses": [
            {
                "Peril_ZDE": null,
                "PolicyLinePatternCode": "HALine",
                "TotalCompensation_ZDE": {
                    "Amount": 47.99,
                    "Currency": "tc_eur"
                },
                "LineName_ZDE": "Liability for private life risk",
                "InsuredRisk": "Liability for holder of retired horses",
                "QuantityElementaryDamage_ZDE": null,
                "TotalElCompensation_ZDE": null,
                "TypeString_ZDE": "HA_THVRetiredHorseCov",
                "QuantityDamage_ZDE": 1,
                "AccidentCause_ZDE": null,
                "PublicID": "pc:221",
                "ODataCustomRemove": null
            },
            {
                "Peril_ZDE": null,
                "PolicyLinePatternCode": "HALine",
                "TotalCompensation_ZDE": {
                    "Amount": 0,
                    "Currency": "tc_eur"
                },
                "LineName_ZDE": "Liability for private life risk",
                "InsuredRisk": "Liability for holder of horses",
                "QuantityElementaryDamage_ZDE": null,
                "TotalElCompensation_ZDE": null,
                "TypeString_ZDE": "HA_THVHorseCov",
                "QuantityDamage_ZDE": 0,
                "AccidentCause_ZDE": null,
                "PublicID": "pc:220",
                "ODataCustomRemove": null
            },
            {
                "Peril_ZDE": null,
                "PolicyLinePatternCode": "HALine",
                "TotalCompensation_ZDE": {
                    "Amount": 500.42,
                    "Currency": "tc_eur"
                },
                "LineName_ZDE": "Liability for private life risk",
                "InsuredRisk": "Liability for holder of dogs",
                "QuantityElementaryDamage_ZDE": null,
                "TotalElCompensation_ZDE": null,
                "TypeString_ZDE": "HA_THVDogCov",
                "QuantityDamage_ZDE": 1,
                "AccidentCause_ZDE": null,
                "PublicID": "pc:219",
                "ODataCustomRemove": null
            }
        ],
        "Submission": {
            "JobNumber": "0000905212",
            "DisplayStatus": "Bound",
            "UpdateTime": "2017-10-05T13:50:22Z",
            "PolicyNumberOrJobNumber": "900000000169",
            "DisplayName": "0000905212",
            "DisplayType": "Submission",
            "PublicID": "pc:207",
            "IsReplacementJob_ZDE": false,
            "OrderValidityDate_ZDE": "2017-11-01",
            "ReplacementPolicies_ZDE": [],
            "SalesProcessState_ZDE": "tc_order"
        },
        "PolicyContactRoles": [
            {
                "@odata.type": "#zde.entities.PolicyPriNamedInsured",
                "DateOfBirth": "1975-02-14",
                "FirstName": "John",
                "MaritalStatus": null,
                "CompanyName": null,
                "DisplayName": "John Smith",
                "LastName": "Smith",
                "PublicID": "pc:207",
                "ODataCustomRemove": null
            }
        ]
    });

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

    if (message.toLowerCase().indexOf("hello") > -1) {
        return res.send({
            intend: 'other',
            args: null,
            text: 'Hello! I am here to help you process your claim. Please provide your policy number.'
        });
    }

    if (message.toLowerCase().indexOf("9000123") > -1) {
        return res.send({
            intend: 'other',
            args: null,
            text: 'I could not find the policy number in our database. Please try again.'
        });
    }

    

    // here a watson call happens

    // policyId not detected
    /**
    res.send({
        intend: 'other',
        args: null,
        text: 'Could you provide more informations?'
    });
    */

    if (message.toLowerCase().indexOf("my policy number") > -1 || message.toLowerCase().indexOf("900") > -1) {
        res.send({
            intend: 'policyProvided',
            args: {
                policyId: 900000002064
            },
            text: 'Thank you, your message has been submitted to the insurance agent.'
        });
    } else {
        return res.send({
            intend: 'other',
            args: null,
            text: 'I could not recognise the policy number.'
        });
    }
});

app.get('/', (req, res) => {
    res.send('Up and running');
});
 
app.listen(3000, () => {
    console.log('RoboClaim API running at port 3000');
});
