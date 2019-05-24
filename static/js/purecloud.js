// **** Token Implicit Grant (Browser) - UserLogin ****
//let redirectUri = 'https://szlaskidaniel.github.io/purecloud-send-sms/index.html';
redirectUri = 'https://localhost/index.html';
const platformClient = require('platformClient');
const client = platformClient.ApiClient.instance
client.setPersistSettings(true);

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

let clientId = getUrlVars()["clientId"];
let environment = getUrlVars()["environment"];

// Set Environment (in case page reloaded)
client.setEnvironment(environment);

let apiInstance = new platformClient.ConversationsApi();



// Authenticate
client.loginImplicitGrant(clientId, redirectUri)
    .then(() => {
        // Make request to GET /api/v2/users/me?expand=presence
        //return usersApi.getUsersMe({ 'expand': ["presence"] });
    })
    .catch((err) => {
        // Handle failure response
        console.log(err);
    });


//#endregion



function postConversationsMessages(queueId, phoneNumber) {
    console.log('postConversationsMessages');
    return new Promise(function (resolve, reject) {
        try {
            let body = {
                "queueId": queueId,
                "toAddress": phoneNumber,
                "toAddressMessengerType": 'sms',
                "useExistingConversation": true
            }

            apiInstance.postConversationsMessages(body)
                .then((data) => {
                    console.log(`postConversationsMessages success! data: ${JSON.stringify(data, null, 2)}`);
                    resolve(data.id)
                })
                .catch((err) => {
                    console.log('There was a failure calling postConversationsMessages');
                    console.error(err);
                    reject(err);
                });
        } catch (err) {
            console.log(err);
            reject();
        }
    });
}

function getConversationsMessage(messageId) {
    console.log('getConversationsMessage')
    return new Promise(function (resolve, reject) {
        try {
            apiInstance.getConversationsMessage(messageId)
                .then((data) => {
                    console.log(`getConversationsMessage success! data: ${JSON.stringify(data, null, 2)}`);
                    resolve(data.participants[1].peer);
                })
                .catch((err) => {
                    console.log('There was a failure calling getConversationsMessage');
                    console.error(err);
                });
        } catch (err) {
            console.log(err);
            reject();
        }
    });

}

function postConversationsMessageCommunicationMessage(conversationId, communicationId, _body) {
    console.log('postConversationsMessageCommunicationMessage')
    return new Promise(function (resolve, reject) {
        try {

            let body = {
                "textBody": _body
            }

            apiInstance.postConversationsMessageCommunicationMessages(conversationId, communicationId, body)
                .then((data) => {
                    console.log(`postConversationsMessageCommunicationMessages success! data: ${JSON.stringify(data, null, 2)}`);
                    resolve()
                })
                .catch((err) => {
                    console.log('There was a failure calling postConversationsMessageCommunicationMessages');
                    console.error(err);
                    reject(err)
                });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });

}

function postConversationDisconnect(conversationId) {
    console.log('postConversationDisconnect')
    return new Promise(function (resolve, reject) {
        try {
            apiInstance.postConversationDisconnect(conversationId)
                .then((data) => {
                    console.log(`postConversationDisconnect success! data: ${JSON.stringify(data, null, 2)}`);
                    resolve();
                })
                .catch((err) => {
                    console.log('There was a failure calling postConversationDisconnect');
                    console.error(err);
                    reject(err);
                });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });

}

function sendSMS(conversationId, queueId, phoneNumber, body) {
    console.log('sendSMS function');
    return new Promise(function (resolve, reject) {
        postConversationsMessages(queueId, phoneNumber).then(function (messageId) {
            getConversationsMessage(messageId).then(function (peerId) {
                postConversationsMessageCommunicationMessage(messageId, peerId, body).then(function (resp) {
                    postConversationDisconnect(messageId).then(function () {
                        // Done
                        resolve();
                    }).catch(function (err) {
                        console.log(err);
                        reject(err.body.message)
                    })
                }).catch(function (err) {
                    console.log(err);
                    reject(err.body.message)
                })
            }).catch(function (err) {
                console.log(err);
                reject(err.body.message)
            })

        }).catch(function (err) {
            console.log(err);
            reject(err.body.message)
        })
    });
}

