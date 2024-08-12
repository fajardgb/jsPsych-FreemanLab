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
pushConsentForm(jsPsych, timeline, config.experimentName);


//EXPERIMENT CONTENT GOES HERE
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

timeline.push(instructions, preload)

var stimuli = config.imageList.map(function (item) {
    return { stimulus: [`<img src='images/${item}' style='position:absolute; top: 90%; left: 50%; transform: translate(-50%, -50%);'>`] };
});



var prepare = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<div style="position:absolute; top: 10vw; left: 50vw; transform: translate(-50%, -50%);" ><button class="jspsych-btn" style='margin-right: 50vw;'>BLACK</button><button class="jspsych-btn" style='margin-left: 50vw; transform: translate(0, -100%);'>WHITE</button></div>`,
    choices: ["NEXT"],
    button_html: `<button class="jspsych-btn" style='position:absolute; top: 90%; left: 50%; transform: translate(-50%, -50%);'>%choice%</button>`,
};
var mouseTrack = {
    type: jsPsychHtmlButtonResponse,
    stimulus: jsPsych.timelineVariable('stimulus'),
    choices: ["BLACK,WHITE"],
    button_html: `<div style="position:absolute; top: 10vw; left: 50vw; transform: translate(-50%, -50%);" ><button id="button-left" class="jspsych-btn" style='margin-right: 50vw;'>BLACK</button><button id="button-right" class="jspsych-btn" style='margin-left: 50vw; transform: translate(0, -100%);'>WHITE</button></div>`,
    extensions: [
        {type: jsPsychExtensionMouseTracking, params: {targets: ['#button-left','#button-right']}}
    ],
};

var fullTrial = {
    timeline: [prepare, mouseTrack],
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
pushDemographicSurvey(timeline);

//Run
jsPsych.run(timeline);
