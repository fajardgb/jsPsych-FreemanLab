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

var waiting_for_scanner = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: 'Waiting for scanner. Press 5 to continue',
    choices: "5"
};

//Preload images so loading them doesn't cause delays during the actual task
var preload = {
    type: jsPsychPreload,
    images: config.imageList.map(function (item) {
        return "images/" + item;
    })
};

timeline.push(preload, instructions, waiting_for_scanner);

//Return array of image stimuli based on imageList provided in config
var test_stimuli = config.imageList.map(function (item) {
    return { stimulus: ["images/" + item] };
});

//Blank between images
var blank = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '',
    choices: "NO_KEYS",
    trial_duration: function(){
        return jsPsych.randomization.randomInt(2000, 6000);
    },
};

//Image display
var image = {
    type: jsPsychImageKeyboardResponse,
    stimulus: jsPsych.timelineVariable('stimulus'),
    choices: "ALL_KEYS",
    trial_duration: 2000,
    response_ends_trial: false
};

//Combined test with sampling without replacement 
var test = {
    timeline: [blank, image],
    timeline_variables: test_stimuli,
    sample: {
        type: 'custom',
        fn: function(t){
            let order = jsPsych.randomization.shuffle(t);
            //Add random duplicates for probe tasks
            for (let i=0; i<config.numProbeTasks; i++){
                let probe = jsPsych.randomization.randomInt(0, t.length-1);
                let probeImg = order[probe];
                order = [
                    order.slice(0, probe),
                    probeImg,
                    order.slice(probe)
                ];
                
            }
            return order;
        },
    },
}
timeline.push(test);
//END OF EXPERIMENT CONTENT

//Adds demographics survey to timeline
import { pushDemographicSurvey } from '../demographics.js'
pushDemographicSurvey(timeline);

//Run
jsPsych.run(timeline);
