
'use strict';

const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

const YOUR_NAME = process.env.name; // TODO replace with your name, ie 'Jenny'
const YOUR_PHONE_NUMBER = process.env.number; // TODO replace with your 11 digit number with country code, ie '+18558675309'
const SKILL_NAME = `Ask ${YOUR_NAME}`;
const RESPONSE = `Ok.`;
const SET_NAME_MESSAGE = `Set your name by saying, my name is "So and So"`;
const HELP_MESSAGE = `Ask ${YOUR_NAME} anything by asking a question, for example ask ${YOUR_NAME} when are you coming home?  What would you like to ask?`;
const HELP_REPROMPT = `Try, how are you doing?`;
const STOP_MESSAGE = 'Goodbye!';

//setup DynamoDB connection
const dynamodb = new AWS.DynamoDB();
const tableName = `Ask${YOUR_NAME}`;

//create SNS client
const sns = new AWS.SNS({ apiVersion: '2010-03-31' });

// IoT Service

var config = {};
config.IOT_BROKER_ENDPOINT      = "a34hla6atspgwh.iot.us-east-1.amazonaws.com".toLowerCase();
config.IOT_BROKER_REGION        = "us-east-1";
config.IOT_THING_NAME           = "onscreen";

var iotData = new AWS.IotData({endpoint: config.IOT_BROKER_ENDPOINT});

// functions to handle userId to name mapping
const getName = (UserId, message, self, cb) => {
    var params = {
        Key: {
            "UserId": {
                S: UserId
            }
        },
        TableName: tableName
    };
    dynamodb.getItem(params, function (err, data) {
        if (err) {
            console.log(err);
            cb('There was an issue with geting your name', self)
        }
        else {
            if (!data.Item) {
                self.emit(':ask', SET_NAME_MESSAGE, SET_NAME_MESSAGE);
            } else {
                const name = data.Item.Name.S;
                const msg = `${name}: ${message}`;
                cb(msg, self)
            }
        }
    });
}

const putName = (UserId, name, self, callback) => {
    var params = {
        Item: {
            "UserId": {
                S: UserId
            },
            "Name": {
                S: name
            },
        },
        ReturnConsumedCapacity: "TOTAL",
        TableName: tableName
    };
    dynamodb.putItem(params, function (err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
        }
        else {
            console.log(data);           // successful response
            callback(self);
        }
    });
}

const updateIoT = (text) => {
    var payloadObj={ "state":{ "desired": {"speak":text} } };
    //Prepare the parameters of the update call

    var paramsUpdate = {
        "thingName" : config.IOT_THING_NAME,
        "payload" : JSON.stringify(payloadObj)
    };

    //Update Device Shadow
    iotData.updateThingShadow(paramsUpdate, function(err, data) {
      if (err){
       console.log(err);
      }
      else {
        console.log(data);

      }   
    });
}

const handlers = {
    'LaunchRequest': function () {
        this.emit(':ask', HELP_MESSAGE, HELP_REPROMPT);
    },
    'AskQuestion': function () {
        //Let's see if I have stored the user's name in Dynamo
        getName(this.event.session.user.userId, this.event.request.intent.slots.Question.value, this, function (message, self) {
            updateIoT(message);
            var params = {
                Message: message, /* required */
                MessageAttributes: {
                    'AWS.SNS.SMS.MaxPrice': {
                        DataType: 'Number', /* required */
                        StringValue: `1.00`
                    },
                    'AWS.SNS.SMS.SMSType': {
                        DataType: 'String', /* required */
                        StringValue: `Promotional`
                    }
                },
                PhoneNumber: `${YOUR_PHONE_NUMBER}`,
                Subject: `Ask ${YOUR_NAME}`
            };
            sns.publish(params, function (err, data) {
                if (err) {
                    self.emit(':tellWithCard', `An error occured trying to send ${YOUR_NAME} a question`, SKILL_NAME, message);
                }
                else {
                    self.emit(':tellWithCard', RESPONSE, SKILL_NAME, message);
                }
            });

        });
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', HELP_MESSAGE, HELP_REPROMPT);
    },
    'SetName': function () {
        const name = this.event.request.intent.slots.UserName.value;
        const message = `Setting your name to ${name}. ${HELP_MESSAGE}`;
        putName(this.event.session.user.userId, name, this, function(self) { 
            self.emit(':ask', message, HELP_REPROMPT);
        });
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.registerHandlers(handlers);
    alexa.execute();
};
