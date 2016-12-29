# MultiGCM
Node.JS module to send GCM Push Notifications for both iOS &amp; Android

#Installation

`npm install -g multi-gcm` (Latest available version `1.0.2`)

#How To Use
```js
var gcm = require('multi-gcm');
var MultiGCM = new gcm.MultiGCM('AIza...');

var messageAndroid = new gcm.GCMMessage({
  registration_ids:['your_registration_ids'],
  type: 'device type', //Android or iOS
  data: {
    'Your own payload.'
  }
});

MultiGCM.send(messageAndroid,function(err,response){
    if(err){
        console.error(err);
    }else{
        console.log(response); //Containing the custom result object of this Library
        console.log(response.result); //Containing the JSON object response from GCM
    }
});
```
    
#Message Object - Properties
`registration_ids`(array of Strings): Array containing the GCM Tokens to send the notifications.

`type`: The type of devices (iOS,Android). Needed to make checks on the `notification` payload properties. (Some properties are required when sending to Android using `notification`, so it needs to be checked before sending it.)

`notification`(object): Notification object payload.

`data`(object): Data object payload.

`collapse_key`(string): Collapse_key, if not applicable it will not get sent.

`dry_run`(boolean): Dry_run, if not applicable it will not get sent.

`time_to_live`(number): Time_to_live, if not applicable it will not get sent.

`delay_while_idle`(boolean): Delay_while_idle, if not applicable it will not get sent.

`priority`(number): Priority, if not applicable it will not get sent.

`content_available`(boolean): Content_available (iOS only). Used in APNS payload to wake the client app.

`restricted_package_name`(string): Restricted_package_name, if not applicable it will not get sent.

For more information on the properties of `notification` or the message, visit: [GCM Connection Server Reference](https://developers.google.com/cloud-messaging/server-ref)

#Notification Payload - Properties
`body`(string): Notification body text.

`sound`(string): By default `default` is only supported.

`title`(string): Required when sending a notification to Android devices. (Throws error if not sent, before sending).

`icon`(string): Required when sending a notification to Android devices. (Throws error if not sent, before sending).On Android: sets value to `myicon` for drawable resource `myicon.png`.

#Result Object - Properties
`code`(number): Response status code.

`error`(string): Human readable error message. If the request was successful it will be `null`.

`result`(object): The raw GCM response body.

`multicastId`(string): The multicast_id of the sent Push Notification.

`numOfSuccesses`(number): Number of successful deliveries.

`numOfFailures`(number): Number of failed deliveries.

`numOfCanonicalIds`(number): Number of canonical ids.

`errors`(array of objects): Custom error objects containing the error message and the error position from the GCM result. Will be `null` if there are no errors.

`errorPositions`(array of numbers): Array containing the error positions. Will be `null` if there are no errors.

`deletablePositions`(array of numbers): Array containing positions for deletable GCM tokens, if the error received is `NotRegistered`. Will be `null` if there are no errors.

`canonicalIdsPositions`(array of numbers): Array containing positions of Canonical Ids, if there are any. Will be `null` if there are no Canonical Ids.

`canonicalIds`(array of strings): Array containing the Canonical Ids, if there are any. Will be `null` if there are no Canonical Ids.

`messageIds`(array of strings): Array containing the Message Ids. Useful to check things with `GCM Diagnostics` in Play Store.

`deletableTokens`(array of strings): Array containing the GCM Tokens that you can delete from your server. These GCM Tokens are either derived from Canonical Ids or errors with `NotRegistered` message.

Credits
=======
Author : Pavlos-Petros Tournaris (p.tournaris@gmail.com)

Google+ : [+Pavlos-Petros Tournaris](https://plus.google.com/u/0/+PavlosPetrosTournaris/)

Facebook : [Pavlos-Petros Tournaris](https://www.facebook.com/pavlospt)

LinkedIn : [Pavlos-Petros Tournaris](https://www.linkedin.com/pub/pavlos-petros-tournaris/44/abb/218)

(In case you use this in your app let me know to make a list of apps that use it! )


License
=======

    Copyright 2015 Pavlos-Petros Tournaris

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    
       http://www.apache.org/licenses/LICENSE-2.0
    
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.


