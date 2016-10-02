/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.
    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
        http://aws.amazon.com/apache2.0/
    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This sample shows how to create a Lambda function for handling Alexa Skill requests that:
 *
 * - Custom slot type: demonstrates using custom slot types to handle a finite set of known values
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Minecraft Helper how to make paper."
 *  Alexa: "(reads back recipe for paper)"
 */

'use strict';

var AlexaSkill = require('./AlexaSkill'),
    stances = require('./stances');

var APP_ID = undefined; //OPTIONAL: replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

/**
 * MinecraftHelper is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var CandidateStance = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
CandidateStance.prototype = Object.create(AlexaSkill.prototype);
CandidateStance.prototype.constructor = CandidateStance;

CandidateStance.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechText = "Welcome to the Political Wiki. This project is still in development. You can ask mostly anything on the political candidates for 2016. What would you like to know?";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For instructions on what you can say, please say help me. Otherwise, what would you like to know?";
    response.ask(speechText, repromptText);
};

CandidateStance.prototype.intentHandlers = {
    "CollegeTuitonIntent": function (intent, session, response) {
        var candidateSlot = intent.slots.Candidate,
            candidateName;
        if (candidateSlot && candidateSlot.value){
            candidateName = candidateSlot.value.toLowerCase();
        }

        var cardTitle = candidateName +". ",
            stance = stances[candidateName + " College_Tuition"],
            speechOutput,
            repromptOutput;
        if (stance) {
            speechOutput = {
                speech: stance,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.tell(speechOutput);
        } else {
            var speech;
            if (candidateName) {
                speech = "I'm sorry, I currently do not know the stance for " + candidateName + ". What else can I help with?";
            } else {
                speech = "I'm sorry, I currently do not know that info. What else can I help with?";
            }
            speechOutput = {
                speech: speech,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            repromptOutput = {
                speech: "What else can I help with?",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.ask(speechOutput, repromptOutput);
        }
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "You can ask questions such as, what's the recipe, or, you can say exit... Now, what can I help you with?";
        var repromptText = "You can say things like, what's the recipe, or you can say exit... Now, what can I help you with?";
        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: repromptText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    }
};

exports.handler = function (event, context) {
    var candidateStance = new CandidateStance();
    candidateStance.execute(event, context);
};
