
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
});

app.controller('roboClaimControlller', function() {
    const roboClaim = this;
});

