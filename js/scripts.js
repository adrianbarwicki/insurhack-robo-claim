
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

app.controller('clientChatController', function($http) {
    const chat = this;

    chat.chatName = 'Client';

    chat.participants = {
        self: {
            profileImgUrl: 'https://i.imgur.com/HYcn9xO.png'
        },
        other: {
            profileImgUrl: 'https://i.imgur.com/DY6gND0.png'
        }
    };

    chat.messages = [
        // NewMessage('self', 'hey!'),
        // NewMessage('other', 'hey! How can I help you?')
    ];

    chat.submitMessage = function(message) {
        if (!message) {
            return;
        }

        const newMessage = NewMessage('self', message);

        chat.messages.push(newMessage);

        chat.newMessage = '';

        chat.lookupPolicy("207");
        // here the api call happens, go fedor go!
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
});

app.controller('insurerChatController', function() {
    const chat = this;

    chat.chatName = 'Insurance Agent';

    chat.participants = {
        self: {
            profileImgUrl: 'https://i.imgur.com/HYcn9xO.png'
        },
        other: {
            profileImgUrl: 'https://i.imgur.com/DY6gND0.png'
        }
    };

    chat.messages = [
        // NewMessage('self', 'Hey, my name is Andrew! My policy nr is 1000.'),
        // NewMessage('other', 'I found the insuree in our database... I could also find the policy insurance. More details here: <link>')
    ];

    chat.submitMessage = function(message) {
        if (!message) {
            return;
        }

        const newMessage = NewMessage('self', message);

        chat.messages.push(newMessage);

        chat.newMessage = '';

        // it does not matter what the insurance agent does here...
    };
});

app.controller('roboClaimControlller', function() {
    const roboClaim = this;
});

