# RoboClaim

RoboClaim is a tool developed at insurhack2017 that uses mining techniques to identify bottlenecks and improve efficiencies and conformance with standard claims processes.

## Abstract
Customers often submit claims by email. The initial actions of the insurance agent after receiving such a claim message are the following:
* extract the name and policy number from the text
* match it with an existing entry in the customer database in a unique manner
* check if the claim is covered by the the insurance policy
<br />
One observers that the customers often forget to include the insurance policy number in the request or use name abbriviation. This often makes it hard to uniquely identify the customer and requires a reply with clarification request.
Every claim submission is also connected with a check of the claim validity, i.e if the claim is covered by the insurance agreement.
<br />
We propose a solution that automates the way of validating the email request, i.e if it has complete information, allows to match the the automatically extracted information with entries in the database and allows to detect invalid claim.

<br />

## Solution
We developed a tool scanning text, in particular e-mail messages containing a claim submission. The tool extracts entities like Names and Policy Numbers. If the extraction fails, an auto-reply message is generated with a hyperlink to chat where the customer is requested to enter specific informations at a time. 


## Installation & Start
```
    npm install -g live-server

    npm install

    live-server ./app
```

## Technology
NodeJS, AngularJS, IBM Watson

## TODO
@todo


