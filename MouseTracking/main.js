//Debug mode
var debug = true;

//Initialize
var sub_id = Math.random().toString().substr(2, 6); // generate random 6 digit number
var completed = false
var jsPsych = initJsPsych({
    show_progress_bar: true,
    on_finish: function () {
        if(completed) {
            // Message for successful completion of study
            jsPsych.endExperiment(`<p>Thanks for participating!</p>
                <p><a href="https://app.prolific.co/submissions/complete?cc=XXXXXX">Click here to return to Prolific and complete the study</a>.</p>`);
            console.log("End of experiment");
            jsPsych.data.get().localSave("csv", "sub-" + sub_id + "_data.csv");
        } else {
            // Message for early termination of study
            jsPsych.endExperiment(`<p>You are not eligible for the study, please return.</p>`);
            console.log("Experiment terminated early")
        }
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
    pushConsentForm(jsPsych, timeline, config.experimentName)
}

//EXPERIMENT CONTENT GOES HERE

//Terminate experiment if user is on mobile or Safari
var mobileCheck = {
  type: jsPsychBrowserCheck,
  features: ["mobile", "browser"],
  inclusion_function: (data) => {
    console.log("Mobile: ", data.mobile)
    console.log("Browser: ", data.browser)
    return data.mobile == false && data.browser != "safari"
  }
};

//Randomizes button order if specified in config
var buttonOrder = config.buttons
var categories = config.categories
if (config.randomizeButtons) {
    var indices = [...Array(buttonOrder.length).keys()];
    indices = jsPsych.randomization.shuffle(indices);
    buttonOrder = indices.map(i => buttonOrder[i]),
    categories = indices.map(i => categories[i])
}

//Prompts user to enter fullscreen mode
var fullscreen = {
    type: jsPsychFullscreen,
    fullscreen_mode: true,
    message: `<p>The experiment will switch to fullscreen mode when you press the button below.</p><p>Please do not exit fullscreen mode until you have completed the study.</p>`
}

//Checks for width and height of browser, terminates experiment if too small
var sizeCheck = {
    type: jsPsychBrowserCheck,
    features: ["width", "height"],
    inclusion_function: (data) => {
        console.log("Screen Size: ", data.width, "x", data.height)
        return data.width > config.boxWidth && data.height > config.boxHeight
    }
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

timeline.push(mobileCheck, fullscreen, sizeCheck, instructions, preload)

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
        {type: jsPsychExtensionMouseTracking, params: {targets: ["#mousetracking-container"]}}
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
        if(!document.fullscreenElement){
            data.fullscreen = false
        } else {
            data.fullscreen = true
        }
    },
    data: {trial_name: 'mouseTrackQuestion', button_order: buttonOrder, categories: categories}
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

//Checks if user is still in full screen mode and prompts user if needed
function checkFullScreen(){
    var reFullscreen = {
        type: jsPsychFullscreen,
        fullscreen_mode: true,
        message: `<p>Please do not exit fullscreen mode.</p><p>Click the button below to return to fullscreen mode.</p>`
    };
    
    var fullscreenNode = {
        timeline: [reFullscreen],
        conditional_function: function(){
            if(!document.fullscreenElement){
                return true;
            } else {
                return false;
            }
        }
    }
    return fullscreenNode;
}

//Creates timeline
var fullTrial = {
    timeline: [prepare, mouseTrack, checkTooFast(), checkTooSlow(), checkFullScreen()],
    timeline_variables: stimuli,
    sample: {
        type: 'without-replacement',
        size: 3
    }
}
timeline.push(fullTrial);

//END OF EXPERIMENT CONTENT

//Adds demographics survey to timeline
import { pushDemographicSurvey } from '../demographics.js'
if (!debug) {
    pushDemographicSurvey(timeline);
}

//Adds final trial to mark successful completion
var completion = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `You've finished the last task. Click the button to end the study.`,
    choices: ["End"],
    on_finish: function () {
        completed = true
    }
}
timeline.push(completion)

//Run
jsPsych.run(timeline);