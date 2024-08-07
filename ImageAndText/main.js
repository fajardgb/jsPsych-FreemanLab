//Initialize
var sub_id = Math.random().toString().substr(2, 6); // generate random 6 digit number
export var jsPsych = initJsPsych({
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
    stimulus: config.scannerPageInstructions,
    choices: config.waitingForScannerKey
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
var i = 0;
var test_stimuli = config.imageList.map(function (item) {
    let stim = { stimulus: `<img src="images/${item}"><br><h1>${config.textList[i]}</h1>` };
    i++;
    return stim;
    
});

//Blank between images
var blank = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '',
    choices: config.blankKey,
    trial_duration: config.blankDuration
};

//Image display
var image = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: jsPsych.timelineVariable('stimulus'),
    choices: config.imageKey,
    trial_duration: config.imageDuration,
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
                    ...order.slice(0, probe),
                    probeImg,
                    ...order.slice(probe)
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
