/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a sample skill built with Amazon Alexa Skills nodejs
 * skill development kit.
 * This sample supports multiple languages (en-US, en-GB, de-GB).
 * The Intent Schema, Custom Slot and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-howto
 **/

'use strict';

const Alexa = require('alexa-sdk');
const recipes = require('./recipes');

const APP_ID = "amzn1.ask.skill.d5a45154-b2f3-4dd5-bfd5-f916840e2b1f";
let recipe;
let itemName;

const handlers = {
    'NewSession': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'RecipeIntent': function () {
        this.attributes.i = 0;
        let itemSlot = this.event.request.intent.slots.Item;

        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
        }

        if (itemName == 'windsor' | itemName == 'full windsor' | itemName == 'full windsor knot' | itemName == 'double windsor' | itemName == 'double windsor knot') {
            itemName = 'windsor knot';
        } else if (itemName == 'half windsor' | itemName == 'single windsor' | itemName == 'single windsor knot') {
            itemName = 'half windsor knot';
        } else if (itemName == 'pratt' | itemName == 'shelby' | itemName == 'shelby knot' | itemName == 'pratt shelby' | itemName == 'pratt shelby knot') {
            itemName = 'pratt knot';
        } else if (itemName == '4 in hand' | itemName == '4 in hand knot' | itemName == 'four in hand' | itemName == 'simple' | itemName == 'simple knot' | itemName == 'schoolboy' | itemName == 'schoolboy knot') {
            itemName = 'four in hand knot';
        }

        const myRecipes = this.t('RECIPES');
        recipe = myRecipes[itemName];

        this.emit('GetRecipe');
    },
    'GetRecipe': function () {
        if (recipe) {
            let i = this.attributes.i;
            if (recipe[i]) {
                this.attributes.speechOutput = recipe[i];
                this.attributes.repromptSpeech = this.t('RECIPE_REPEAT_MESSAGE');
                this.emit(':ask', recipe[i], this.attributes.repromptSpeech);
            } else if (i == recipe.length){
                const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), itemName);
                this.attributes.i = 0;
                this.emit(':tell', this.t('RECIPE_COMPLETE') + itemName); // cardTitle, cardContent, imageObj
            } else {
                this.emit(':ask', this.t('NO_STEP') + ' ' + this.t('HELP_MESSAGE'), this.t('HELP_REPROMPT'));
                // this.emit('NewSession');
            }
        } else {
            let speechOutput = this.t('RECIPE_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('RECIPE_NOT_FOUND_REPROMPT');
            if (itemName) {
                speechOutput += this.t('RECIPE_NOT_FOUND_WITH_ITEM_NAME', itemName);
            } else {
                speechOutput += this.t('RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME');
            }
            speechOutput += repromptSpeech;

            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }
    },
    'NextStepIntent': function () {
        this.attributes.i++;
        this.emit('GetRecipe');
    },
    'StartOverIntent': function () {
        this.attributes.i = 0;
        this.emit('GetRecipe');
    },
    'MainMenuIntent': function () {
        this.emit('NewSession');
    },
    'GoToIntent': function () {
        this.attributes.i = this.event.request.intent.slots.Number.value - 1;
        this.emit('GetRecipe');
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

const languageStrings = {
    'en-US': {
        translation: {
            RECIPES: recipes.RECIPE_EN_US,
            CARDS: recipes.CARDS,
            SKILL_NAME: 'Necktie',
            WELCOME_MESSAGE: "Welcome to %s. You can ask a question like, how do I tie a windsor knot? ... Now, what can I help you with.",
            WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: '%s  - Instructions for %s.',
            HELP_MESSAGE: "You can ask questions such as, how do I tie a windsor knot, or, you can say exit...Now, what can I help you with?",
            HELP_REPROMPT: "You can say things like, how do I tie a windsor knot, or you can say exit...Now, what can I help you with?",
            STOP_MESSAGE: 'Goodbye!',
            RECIPE_REPEAT_MESSAGE: 'You can say repeat to hear the step again, or next to move on.',
            RECIPE_NOT_FOUND_MESSAGE: "I\'m sorry, I currently do not know ",
            RECIPE_NOT_FOUND_WITH_ITEM_NAME: 'the recipe for %s. ',
            RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME: 'that recipe. ',
            RECIPE_NOT_FOUND_REPROMPT: 'What else can I help with?',
            RECIPE_COMPLETE: 'Congratulations, you have tied a ',
            NO_STEP: 'I\'m sorry, that is not a valid step.'
        }
    }
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
