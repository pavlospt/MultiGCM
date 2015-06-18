var request = require('request');
var GCMMessage = require('./GCMMessage');

var MultiGCM = function(apiKey) {

    if(!apiKey)
        throw Error("API key should be defined.");
    if(typeof apiKey !== 'string')
        throw Error("API key should be a literal.");
    if(apiKey.length == 0)
        throw Error("API key has 0 length.");

    this.apiKey = apiKey;

    if(!(this instanceof MultiGCM))
        return new MultiGCM(apiKey);
};

MultiGCM.prototype.send = function(message,callback){

    var requestOptions = {
        method: 'POST',
        url: 'https://gcm-http.googleapis.com/gcm/send',
        headers: {
            'Authorization' : 'key=' + this.apiKey,
            'Content-Type' : 'application/json;charset=UTF-8'
        },
        body: message.toJson(),
        json: true
    };

    request(requestOptions,function(err,response,body){

        if(err)
            return callback(err);

        var resultObject = {};

        if(response.statusCode == 200){
            resultObject = {
                code: response.statusCode,
                error: null,
                result: body
            };

            var gcmResponse = body;

            resultObject.multicastId = gcmResponse.multicast_id;
            resultObject.numOfSuccesses = gcmResponse.success;
            resultObject.numOfFailures = gcmResponse.failure;
            resultObject.numOfCanonicalIds = gcmResponse.canonical_ids;

            var results = gcmResponse.results;

            results.forEach(function(result,index){
                if(result.error){
                    if(!resultObject.errors){
                        resultObject.errors = [];
                    }
                    if(!resultObject.errorPositions){
                        resultObject.errorPositions = [];
                    }
                    if(!resultObject.deletablePositions){
                        resultObject.deletablePositions = [];
                    }
                    if(result.error == 'NotRegistered'){
                        resultObject.deletablePositions.push(index);
                    }
                    resultObject.errorPositions.push(index);
                    resultObject.errors.push({
                        message: result.error,
                        position: index
                    });
                }else{
                    if(result.registration_id){
                        if(!resultObject.canonicalIdsPositions){
                            resultObject.canonicalIdsPositions = [];
                        }
                        if(!resultObject.canonicalIds){
                            resultObject.canonicalIds = [];
                        }
                        resultObject.canonicalIds.push(result.registration_id);
                        resultObject.canonicalIdsPositions.push(index);
                    }
                    if(!resultObject.messageIds){
                        resultObject.messageIds = [];
                    }
                    resultObject.messageIds.push(result.message_id);
                }
            });

            if((resultObject.canonicalIdsPositions && resultObject.canonicalIdsPositions.length > 0) ||
                (resultObject.deletablePositions && resultObject.deletablePositions.length > 0)){

                if(!resultObject.deletableTokens){
                    resultObject.deletableTokens = [];
                }

                if(resultObject.canonicalIdsPositions){
                    resultObject.canonicalIdsPositions.forEach(function(index){
                        resultObject.deletableTokens.push(message.registration_ids[index]);
                    });
                }

                if(resultObject.deletablePositions){
                    resultObject.deletablePositions.forEach(function(index){
                        resultObject.deletableTokens.push(message.registration_ids[index]);
                    });
                }

            }

            return callback(null,resultObject);
        }else if(response.statusCode == 400){
            resultObject = {
                code: response.statusCode,
                error: "Error processing the JSON sent in message. Check the result for more info.",
                result: body
            };
            return callback(null,resultObject);
        }else if(response.statusCode == 401){
            resultObject = {
                code: response.statusCode,
                error: "Error authenticating the request with the given API key.",
                result: body
            };
            return callback(null,resultObject);
        }else if(response.statusCode >= 500){
            resultObject = {
                code: response.statusCode,
                error: "An internal server error occurred. Service might be temporary down.",
                result: body
            };
            return callback(null,resultObject);
        }
    });

};

exports.MultiGCM = MultiGCM;
exports.GCMMessage = GCMMessage;