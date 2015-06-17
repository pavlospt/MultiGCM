var _ = require('underscore');

function GCMMessage(message){

    if(!message)
        message = {};

    if(!message.type)
        throw Error("Undefined Message type.[iOS,Android,Chrome]");

    if(!(this instanceof GCMMessage)) {
        return new GCMMessage(message);
    }

    if(message.registration_ids){
        this.registration_ids = message.registration_ids;
        if(this.registration_ids.length == 1){
            this.to = this.registration_ids[0];
            delete this.registration_ids;
        }
    } else
        throw Error("You have to define 'registration_ids' to send a GCM message.");

    if(message.type)
        this.type = message.type;
    else
        this.type = undefined;

    if(message.notification)
        this.notification = message.notification;
    else
        this.notification = undefined;

    if(message.data)
        this.data = message.data;
    else
        this.data = undefined;

    if(message.collapse_key)
        this.collapse_key = message.collapse_key;
    else
        this.collapse_key = undefined;

    if(message.dry_run)
        this.dry_run = message.dry_run;
    else
        this.dry_run = undefined;

    if(message.delay_while_idle)
        this.delay_while_idle = message.delay_while_idle;
    else
        this.delay_while_idle = undefined;

    if(message.time_to_live)
        this.time_to_live = message.time_to_live;
    else
        this.time_to_live = undefined;

    if(message.priority)
        this.priority = message.priority;
    else
        this.priority = undefined;

    if(message.content_available){
        if(this.type == 'iOS'){
            this.content_available = message.content_available;
        }else{
            this.content_available = undefined;
        }
    } else {
        this.content_available = undefined;
    }

    if(message.restricted_package_name)
        this.restricted_package_name = message.restricted_package_name;
    else
        this.restricted_package_name = undefined;

    if(this.notification){
        this.notification.sound = 'default';
        if(this.type == 'Android'){
            if(!this.notification.title){
                throw Error("Property 'title' is required in Android when using 'notification'.");
            }
            if(!this.notification.icon){
                throw Error("Property 'icon' is required in Android when using 'notification'.");
            }
            if(this.notification.badge){
                delete this.notification.badge;
                console.log("Android 'notification' can not contain 'badge' property." +
                            "Therefore it was deleted before sending the message.");
            }
            if(this.notification.body_loc_key){
                delete this.notification.body_loc_key;
                console.log("Android 'notification' can not contain 'body_loc_key' property." +
                            "Therefore it was deleted before sending the message.");
            }
            if(this.notification.body_loc_args){
                delete this.notification.body_loc_args;
                console.log("Android 'notification' can not contain 'body_loc_args' property." +
                            "Therefore it was deleted before sending the message.");
            }
            if(this.notification.title_loc_args){
                delete this.notification.title_loc_args;
                console.log("Android 'notification' can not contain 'title_loc_args' property." +
                            "Therefore it was deleted before sending the message.");
            }
            if(this.notification.title_loc_key){
                delete this.notification.title_loc_key;
                console.log("Android 'notification' can not contain 'title_loc_key' property." +
                            "Therefore it was deleted before sending the message.");
            }
        }else if(this.type == 'iOS'){
            if(this.notification.icon){
                delete this.notification.icon;
                console.log("iOS 'notification' can not contain 'icon' property." +
                            "Therefore it was deleted before sending the message.");
            }
            if(this.notification.tag){
                delete this.notification.tag;
                console.log("iOS 'notification' can not contain 'tag' property." +
                            "Therefore it was deleted before sending the message.");
            }
            if(this.notification.color){
                delete this.notification.color;
                console.log("iOS 'notification' can not contain 'color' property." +
                            "Therefore it was deleted before sending the message.");
            }
        }
    }
}

GCMMessage.ANDROID = 'Android';
GCMMessage.IOS = 'iOS';
GCMMessage.CHROME = 'Chrome';

GCMMessage.prototype.toJson = function(){

    var keys = _.keys(this);
    var self = this;
    var definedKeys = keys.filter(function(key){
        return typeof self[key] !== 'undefined';
    });

    var jsonResult = {};
    _.forEach(definedKeys,function(definedKey){
        jsonResult[definedKey] = self[definedKey];
    });

    delete jsonResult.type;
    return jsonResult;
};

module.exports = GCMMessage;