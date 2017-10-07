
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

app.factory('messageExchangeService', function() {
    var cb = null;

    const registerListener = function(lCb) {
        cb = lCb;
    };

    const messageSent = function(message) {
        cb(message);
    };

    return {
        registerListener,
        messageSent
    };
});

app.factory('apiService', function() {
    return {};
});

app.controller('clientChatController', function() {
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
        // ...

        // this will create a message on the insurer side
        /**
        messageExchangeService
        .messageSent(newMessage);
        */
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

        // it does not matter what the insurance agent does here...
    };

    /**
    messageExchangeService
    .registerListener(function(message) {
        chat.messages.push(newMessage);
    });
    */
});

app.controller('roboClaimControlller', function() {
    const roboClaim = this;
});
