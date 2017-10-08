
const app = angular.module('app', [ ]);

/**
 * @param {'self'|'other'} type
 * @param {string} text
 */
const NewMessage = function(type, text) {
    return {
        type,
        text,
        timestamp: new Date()
    };
};

const Participants = {
    robot: {
        profileImgUrl: './img/robo-icon.svg'
    },
    self: {
        profileImgUrl: 'https://i.imgur.com/HYcn9xO.png'
    },
    other: {
        profileImgUrl: 'https://i.imgur.com/DY6gND0.png'
    }
};

app.factory('messageExchangeService', function() {
    var cbs = {
        'client-messages': null
    };

    const registerListener = function(eventCode, lCb) {
        if (!cbs[eventCode])
            cbs[eventCode] = lCb;
    };

    const messageSent = function(eventCode, message) {
        if (cbs[eventCode])
            cbs[eventCode](message);
    };

    return {
        registerListener,
        messageSent
    };
});

app.factory('apiService', function($http) {
    const API_URL = 'http://localhost:3000';

    const checkPolicyNo = function(policyId) {
        return $http.get(API_URL + '/api/policy/' + policyId);
    }

    const sendMessage = function(message) {
        return $http.post(API_URL + '/api/message', {
            text: message.text
        });
    };

    return {
        checkPolicyNo,
        sendMessage
    };
});

app.controller('clientChatController', function(messageExchangeService, apiService) {
    const chat = this;

    chat.chatName = 'Client';

    chat.participants = Participants;

    chat.messages = [
        NewMessage('self', 'hey!'),
        NewMessage('other', 'hey! How can I help you?')
    ];

    chat.submitMessage = function(message) {
        if (!message) {
            return;
        }

        const newMessage = NewMessage('self', message);

        chat.messages.push(newMessage);

        chat.newMessage = '';

        // here the api call happens, go fedor go!
        apiService
        .sendMessage(newMessage)
        .then(function(response) {
            const policyId = response.data.args.policyId;

            if (response.data.intend === 'policyProvided') {
                return apiService
                .checkPolicyNo(newMessage)
                .then(function(policyResponse) {

                    messageExchangeService
                    .messageSent('client-messages', newMessage);

                    messageExchangeService
                    .messageSent('robot-to-insurer-messages', policyResponse.data);
                });
            } else {
                chat.messages.push(
                    NewMessage('robot', 'Unfortunately, we could not find the correct insurance policy. Is the policy number ' + policyId + ' correct?')
                );
            }
        }, function(err) {
            if (err.status === -1) {
                return alert('Could not establish connection. Is the server working?')
            }

            return alert(typeof err === 'object' ? JSON.stringify(err) : err);
        });
    };

    chat.lookupPolicy = function(policyNumber) {
        if (!policyNumber)
        {
            // TODO react properly on missing policy number
            return;
        }
        var url = "https://api.insurhack.com/gi/PolicyPeriod_Set('pc:" + policyNumber + "')?$expand=Submission,PolicyContactRoles,PriorLosses";
        console.log(url);
        $http({
            method: 'GET',
            url: url,
            headers: {
                'keyid': 'b4d1ee3b-3abf-41bb-97c7-80ba3a34fa87'
            }
        }).then(function successCallback(response) {
            console.log("everything is fine!");
        }, function errorCallback(response) {
            debugger;
            console.error("bad things happened: " + response);
        });
    };

    messageExchangeService
    .registerListener('insurer-messages', function(message) {
        chat.messages.push(message);
    });
});

app.controller('insurerChatController', function(messageExchangeService) {
    const chat = this;

    chat.chatName = 'Insurance Agent';

    chat.participants = Participants;

    chat.messages = [
        NewMessage('self', 'Hey, my name is Andrew! My policy nr is 1000.'),
        NewMessage('other', 'I found the insuree in our database... I could also find the policy insurance. More details here: <link>')
    ];

    chat.submitMessage = function(message) {
        if (!message) {
            return;
        }

        const newMessage = NewMessage('self', message);

        chat.messages.push(newMessage);

        chat.newMessage = '';


        // this will create a message on the insurer side
        messageExchangeService
        .messageSent('insurer-messages', newMessage);

        // it does not matter what the insurance agent does here...
    };


    messageExchangeService
    .registerListener('client-messages', function(message) {
        chat.messages.push(message);
    });
});

app.controller('roboClaimControlller', function() {
    const roboClaim = this;
});
