//Debug mode
var debug = false;

//Initialize
var sub_id = Math.random().toString().substr(2, 6); // generate random 6 digit number
var jsPsych = initJsPsych({
    show_progress_bar: true,
    on_finish: function () {
        jsPsych.endExperiment(`<p>You've finished the last task. Thanks for participating!</p>
    <p><a href="https://app.prolific.co/submissions/complete?cc=XXXXXX">Click here to return to Prolific and complete the study</a>.</p>`);
        console.log("End of experiment");
        jsPsych.data.get().localSave("csv", "sub-" + sub_id + "_data.csv");
    },
    extensions: [
        {type: jsPsychExtensionMouseTracking}
    ]
});
// for info on how to save on the server, please contact me: gjf2118@columbia.edu
var timeline = [];

//Import config file
import config from "./config.js"

//Adds consent form to timeline
import { pushConsentForm } from '../consent.js';
if (!debug) {
    pushConsentForm(jsPsych, timeline, config.experimentName);
}

//EXPERIMENT CONTENT GOES HERE

//Randomizes button order if specified in config
var buttonOrder = config.randomizeButtons ? jsPsych.randomization.shuffle(config.buttons) : config.buttons;

//Prompts user to enter fullscreen mode
var fullscreen = {
    type: jsPsychFullscreen,
    fullscreen_mode: true
}

//Checks for width and height of browser
var sizeCheck = {
    type: jsPsychBrowserCheck,
    features: ["width", "height"]
}

//Displays instructions
var instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: config.instructions,
    choices: ['Continue']
};

//Preloads images
var preload = {
    type: jsPsychPreload,
    images: config.imageList.map(function (item) {
        return "images/" + item;
    })
};

timeline.push(fullscreen, sizeCheck, instructions, preload)

//Adds styling (position and sizes) to images
var stimuli = config.imageList.map(function (item) {
    return { stimulus: [`<div id="mousetracking-container" style="border:2px solid transparent; border-color: #ccc; position: absolute; width: ${config.boxWidth}px; height: ${config.boxHeight}px; transform: translate(-50%, -50%); top: 50%; left: 50%;"></div><img src='images/${item}' style='position:absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); margin-top: ${config.imageTopMargin}px; width: ${config.imgWidth}px; height: ${config.imgHeight}px'>`] };
});

//Displays start button and choice buttons (for between images)
var prepare = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<div id="mousetracking-container" style="border:2px solid transparent; border-color: #ccc; position: absolute; width: ${config.boxWidth}px; height: ${config.boxHeight}px; transform: translate(-50%, -50%); top: 50%; left: 50%;"></div><button class="jspsych-btn" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); margin-left: -${config.buttonSideMargin}px; margin-top: ${config.buttonTopMargin}px; width: ${config.buttonWidth}px; height: ${config.buttonHeight}px; font-size: ${config.buttonTextSize}px;"'>${buttonOrder[0]}</button><button class="jspsych-btn" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); margin-left: ${config.buttonSideMargin}px; margin-top: ${config.buttonTopMargin}px; width: ${config.buttonWidth}px; height: ${config.buttonHeight}px; font-size: ${config.buttonTextSize}px;"'>${buttonOrder[1]}</button>`,
    choices: ["START"],
    button_html: `<button class="jspsych-btn" style='position:absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); margin-top: ${config.imageTopMargin}px;'>%choice%</button>`,
};

//Key trial that displays image and tracks mouse and response
var mouseTrack = {
    type: jsPsychHtmlButtonResponse,
    stimulus: jsPsych.timelineVariable('stimulus'),
    choices: buttonOrder,
    button_html: [ //HTML styling for each button
        `<button class="jspsych-btn" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); margin-left: -${config.buttonSideMargin}px; margin-top: ${config.buttonTopMargin}px; width: ${config.buttonWidth}px; height: ${config.buttonHeight}px; font-size: ${config.buttonTextSize}px;"'>%choice%</button>`,
        `<button class="jspsych-btn" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); margin-left: ${config.buttonSideMargin}px; margin-top: ${config.buttonTopMargin}px; width: ${config.buttonWidth}px; height: ${config.buttonHeight}px; font-size: ${config.buttonTextSize}px;"'>%choice%</button>`
    ],
    extensions: [
        {type: jsPsychExtensionMouseTracking}
    ],
    on_finish: function(data){
        //Adds too_fast or too_slow data
        console.log("RT: " + data.rt)
        data.too_fast = false;
        data.too_slow = false;
        if (data.rt < config.minRT){
            data.too_fast = true;
        } else if (data.rt > config.maxRT) {
            data.too_fast = false;
            data.too_slow = true; 
        }
    },
    data: {trial_name: 'mouseTrackQuestion', button_order: buttonOrder}
};

//Checks if response was too fast and notifies user if needed
function checkTooFast(){
    var feedback = {
        type: jsPsychHtmlButtonResponse,
        stimulus: `Please spend more time making a decision.`,
        choices: ["Continue"]
    };
    
    var feedbackNode = {
        timeline: [feedback],
        conditional_function: function(){
            var rt = jsPsych.data.get().last(1).values()[0].rt;
            // console.log("Checking if " + rt + " is too fast")
            if(rt < config.minRT){
              return true;
            } else {
              return false;
            }
        }
    }
    return feedbackNode;
}

//Checks if response was too slow and notifies user if needed
function checkTooSlow(){
    var feedback = {
        type: jsPsychHtmlButtonResponse,
        stimulus: `Please make your decision more quickly.`,
        choices: ["Continue"]
    };
    
    var feedbackNode = {
        timeline: [feedback],
        conditional_function: function(){
            var rt = jsPsych.data.get().last(1).values()[0].rt;
            // console.log("Checking if " + rt + " is too slow")
            if(rt > config.maxRT){
              return true;
            } else {
              return false;
            }
        }
    }
    return feedbackNode;
}

//Creates timeline
var fullTrial = {
    timeline: [prepare, mouseTrack, checkTooFast(), checkTooSlow()],
    timeline_variables: stimuli,
    sample: {
        type: 'without-replacement',
        size: 12
    }
}
timeline.push(fullTrial);

//END OF EXPERIMENT CONTENT

//Adds demographics survey to timeline
import { pushDemographicSurvey } from '../demographics.js'
if (!debug) {
    pushDemographicSurvey(timeline);
}

//Run
jsPsych.run(timeline);