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
    client: {
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

    chat.messages = [];

    chat.submitMessage = function(message) {
        if (!message) {
            return;
        }

        const newMessage = NewMessage('client', message);

        chat.messages.push(newMessage);

        chat.newMessage = '';

        // here the api call happens, go fedor go!
        apiService
        .sendMessage(newMessage)
        .then(function(response) {
            const policyId = response.data.args ? response.data.args.policyId : null;

            if (response.data.intend === 'policyProvided') {
                return apiService
                .checkPolicyNo(policyId)
                .then(function(policyResponse) {
                    chat.messages.push(NewMessage('robot', 'Thank you. I have successfully transfered the message to your insurance agent.'));
                   
                    const joinedMessage = chat.messages
                    .filter(function(_) { return _.type === 'client'})
                    .map(function(_) { return _.text}).join('. ')

                    messageExchangeService
                    .messageSent('client-messages', NewMessage('client', joinedMessage));

                    messageExchangeService
                    .messageSent('robot-to-insurer-messages', 'We could match the customer data with an entry in database: John Smith, Data of Birth: 1975-02-14');
                }, function(errorResponse) {
                    chat.messages.push(
                        NewMessage('robot', response.data.text)
                    );
                });
            } else {
                if (response.data.text) {
                    chat.messages.push(
                        NewMessage('robot', response.data.text)
                    );
                }
            }
        }, function(err) {
            if (err.status === -1) {
                return alert('Could not establish connection. Is the server working?')
            }

            return alert(typeof err === 'object' ? JSON.stringify(err) : err);
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

    chat.messages = [];

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

    messageExchangeService
    .registerListener('robot-to-insurer-messages', function(foundPolicy) {
        var message = '';

        const strifiedPolicy = JSON.stringify(foundPolicy);

        chat.messages.push(NewMessage('robot', strifiedPolicy));
    });
});

app.controller('roboClaimControlller', function() {
    const roboClaim = this;
});
