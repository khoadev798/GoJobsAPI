const admin = require("firebase-admin");

const serviceAccount = require("../privatefile.json");

let sendNotification = async (req, res) => {
    if (!admin.apps.length) {
        
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://console.firebase.google.com/u/1/project/gojobs-7d2ee/overview"
        });
     }else {
        admin.app(); // if already initialized, use that one
     }
    
    let token = ['fRB4I1ccR3WTtuGwxdXN2E:APA91bGvguOHXiiQsmXp9Wh5FfvoQYjyuY-BTTNuXRdRSd0lhx_xEEzpYcl8sY8hjJ3S-ZYWZRCF8ip0Nw5rAob-hF8VpXOe1pUTQ7tJZFYqdaRCFVlf--7660DP5JrSzmxDHK5lEIQ9'];
    
    const payload = {
        notification: {
            title: "this is a Notifycation",
            body: "This is the body of the notification message."
        }
    };
    
    const options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    };
    
    admin.messaging().sendToDevice(token, payload, options)
        .then((res) => console.log("Successfully send notify:", res))
        .catch((err) => console.log("Error:", err));
}

module.exports = {
    sendNotification
}

