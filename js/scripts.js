
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
    const clientChat = this;

    clientChat.chatName = 'Client';

    clientChat.participants = {
        self: {
            profileImgUrl: 'https://i.imgur.com/HYcn9xO.png'
        },
        other: {
            profileImgUrl: 'https://i.imgur.com/DY6gND0.png'
        }
    };

    clientChat.messages = [
        NewMessage('self', 'hey!'),
        NewMessage('other', 'hey! How can I help you?')
    ];
});