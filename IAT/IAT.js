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
});
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

// manually preload images due to presenting them with timeline variables
var images = ['img/white/w1.png', 'img/white/w2.png', 'img/white/w3.png', 'img/white/w4.png', 'img/white/w5.png', 'img/white/w6.png',
    'img/black/b1.png', 'img/black/b2.png', 'img/black/b3.png', 'img/black/b4.png', 'img/black/b5.png', 'img/black/b6.png'];

var preload = {
    type: jsPsychPreload,
    images: images
};

timeline.push(instructions);
timeline.push(preload)


//Adds demographics survey to timeline
import { pushDemographicSurvey } from '../demographics.js'
pushDemographicSurvey(timeline);

//Run
jsPsych.run(timeline);