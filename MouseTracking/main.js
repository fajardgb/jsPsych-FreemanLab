//Debug mode
var debug = true;

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

var fullscreen = {
    type: jsPsychFullscreen,
    fullscreen_mode: true
}

var instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: config.instructions,
    choices: ['Continue']
};

var preload = {
    type: jsPsychPreload,
    images: config.imageList.map(function (item) {
        return "images/" + item;
    })
};

timeline.push(fullscreen, instructions, preload)

var stimuli = config.imageList.map(function (item) {
    if (config.imgWidth == 0 || config.imgHeight == 0) {
        return { stimulus: [`<img src='images/${item}' style='position:absolute; bottom: 5%; left: 50%; transform: translateX(-50%);'>`] };
    } else {
        return { stimulus: [`<img src='images/${item}' style='position:absolute; bottom: 5%; left: 50%; transform: translateX(-50%); width: ${config.imgWidth}px; height: ${config.imgHeight}px'>`] };
    }
});

var prepare = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<button class="jspsych-btn" style='position: absolute; top: 10vw; left: 25vw; transform: translate(-50%, -50%);'>BLACK</button> <button class="jspsych-btn" style='position: absolute; top: 10vw; left: 75vw; transform: translate(-50%, -50%);'>WHITE</button>`,
    choices: ["START"],
    button_html: `<button class="jspsych-btn" style='position:absolute; top: 90%; left: 50%; transform: translate(-50%, -50%);'>%choice%</button>`,
};

var mouseTrack = {
    type: jsPsychHtmlButtonResponse,
    stimulus: jsPsych.timelineVariable('stimulus'),
    choices: ["BLACK", "WHITE"],
    button_html: [
        `<button class="jspsych-btn" style='position: absolute; top: 10vw; left: 25vw; transform: translate(-50%, -50%);'>%choice%</button>`,
        `<button class="jspsych-btn" style='position: absolute; top: 10vw; left: 75vw; transform: translate(-50%, -50%);'>%choice%</button>`
    ],
    extensions: [
        {type: jsPsychExtensionMouseTracking}
    ],
    on_finish: function(data){
        console.log("RT: " + data.rt)
        data.tooFast = false;
        data.tooSlow = false;
        if (data.rt < config.minRT){
            data.tooFast = true;
        } else if (data.rt > config.maxRT) {
            data.tooFast = false;
            data.tooSlow = true; 
        }
    },
    data: {trialName: 'mouseTrackQuestion'}
};

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

var fullTrial = {
    timeline: [prepare, mouseTrack, checkTooFast(), checkTooSlow()],
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

//Run
jsPsych.run(timeline);