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
    stimulus: jsPsych.timelineVariable("stimulus"),
    height: config.videoHeight,
    width: config.videoWidth,
    prompt: "<p>" + config.videoInstructions + "</p>",
    labels: config.sliderLabels,
    min: config.minSlider,
    max: config.maxSlider,
    slider_start: config.startSlider,
    autoplay: config.autoplay,
    controls: config.controls,
    rate: config.rate,
    response_allowed_while_playing: config.midResponse,
    require_movement: config.needMovement,
    trial_ends_after_video: config.autoEnd,
    response_ends_trial: true
};

var trial = {
    timeline: [showVideo],
    timeline_variables: test_stimuli,
    randomize_order: config.randomize,
};

timeline.push(preload, instructions, trial);
//END OF EXPERIMENT CONTENT

//Adds demographics survey to timeline
import { pushDemographicSurvey } from '../demographics.js'
pushDemographicSurvey(timeline);

//Run
jsPsych.run(timeline);