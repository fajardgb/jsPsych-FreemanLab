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
});
var timeline = [];
jsPsych.data.addProperties({ subject_id: sub_id });

//Import config file
import config from "./config.js"

//Adds consent form to timeline
import { pushConsentForm } from '../consent.js';
if (!debug) {
    pushConsentForm(jsPsych, timeline, config.experimentName);
}

//EXPERIMENT CONTENT GOES HERE
var preload = {
    type: jsPsychPreload,
    videos: config.videoList.map(function (item) {
        return "videos/" + item;
    })
};

var test_stimuli = config.videoList.map(function (item) {
    return { stimulus: ["videos/" + item] };
});

var instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: config.instructions,
    choices: ['Continue']
};

var showVideo = {
    type: jsPsychVideoSliderContinuousResponse,
    data: { trial_name: 'video' },
    stimulus: jsPsych.timelineVariable("stimulus"),
    height: config.videoHeight,
    width: config.videoWidth,
    prompt: "<p>" + config.videoInstructions + "</p>",
    labels: config.sliderLabels,
    min: config.minSlider,
    max: config.maxSlider,
    slider_start: config.startSlider,
    autoplay: config.autoplay,
    controls: false,
    rate: config.rate,
    response_allowed_while_playing: true,
    require_movement: false,
    trial_ends_after_video: true,
    response_ends_trial: true
};

var sampleTask = {
    type: jsPsychHtmlButtonResponse,
    stimulus: "Sample task",
    choices: ['Continue']
};


var trial = {
    timeline: [],
};

for (var i = 0; i < test_stimuli.length; i++) {
    trial.timeline.push({
        timeline: [showVideo],
        timeline_variables: [test_stimuli[i]],
        randomize_order: config.randomize,
    });

    // Insert additional trial after each video trial, except for the last one
    if (i < test_stimuli.length - 1) {
        trial.timeline.push(sampleTask);
    }
}

timeline.push(preload, instructions, trial);
//END OF EXPERIMENT CONTENT

//Adds demographics survey to timeline
import { pushDemographicSurvey } from '../demographics.js'
if (!debug) {
    pushDemographicSurvey(timeline);
}

//Run
jsPsych.run(timeline);