const webPush =  require('web-push');
const vapidKeys = {
   "publicKey": "BEnLS2TVt4B6It1HvUrG5STb94eTrF-6RAqn4wgxSKT-drgBWXcEHHs3RKx8tC2_5i6LUnsgLL3pHDBFI_YM-lQ",
   "privateKey": "nFV3CNc0I1jsbsdxxi71S2-me-eoRRYz6V69Lc7okDQ"
};
 
 
webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
const pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/dYkaK49jKkY:APA91bHj2Jc_8toq5wmS9uv7ck21bGXB_FUahaRXttLLVApe90myohNiEWpAYB1h1Zg_B3Gx_VLhbAI8ekWNGJDI4bVO-Io9CcbXMKpLZontEHQs7i--HZ2PKnDHbM0zRE9cohC-CgTF",
   "keys": {
       "p256dh": "BI9GdRPAtWocsFqWEX7VdUrFFMUvGhX8RmwmU2hDAUqhGqZsATqtsaZM06BJ913hyrbpFesUCw7He1qVmXpixUY=",
       "auth": "Lir8UuX4K9zrW2UdwSFrpA=="
   }
};
const payload = 'Submission 2 Football PWA';
 
const options = {
   gcmAPIKey: '377328385962',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);