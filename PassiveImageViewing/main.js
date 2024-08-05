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
// for info on how to save on the server, please contact me: gjf2118@columbia.edu
var timeline = [];

//Import config file
import config from "./config.js";

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

timeline.push(preload, instructions);

var test_stimuli = config.imageList.map(function (item) {
    return { stimulus: ["images/" + item] };
});

var blank = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '',
    choices: "NO_KEYS",
    trial_duration: function(){
        return jsPsych.randomization.randomInt(2000, 6000);
    },
};
  
var image = {
    type: jsPsychImageKeyboardResponse,
    stimulus: jsPsych.timelineVariable('stimulus'),
    choices: "ALL_KEYS",
    trial_duration: 2000,
    response_ends_trial: false
};
var test = {
    timeline: [blank, image],
    timeline_variables: test_stimuli,
    sample: {
        type: 'fixed-repetitions',
        size: 5,
    }
}
timeline.push(test);
//END OF EXPERIMENT CONTENT

//Adds demographics survey to timeline
import { pushDemographicSurvey } from '../demographics.js'
pushDemographicSurvey(timeline);

//Run
jsPsych.run(timeline);
