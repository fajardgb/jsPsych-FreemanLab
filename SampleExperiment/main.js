//Debug mode - enable this to skip consent and demogrphic forms
var debug = false;

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
            jsPsych.endExperiment(`<p>Unfortunately, you are not eligible for the study.</p>`);
            console.log("Experiment terminated early")
        }
    },
});
// for info on how to save on the server, please contact gjf2118@columbia.edu
var timeline = [];

//Import config file
import config from "./config.js"

//Adds consent form to timeline
import { pushConsentForm } from '../consent.js';
if (!debug) {
    pushConsentForm(jsPsych, timeline, config.experimentName)
}

//EXPERIMENT CONTENT GOES HERE

var instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: config.instructions,
    choices: ['Continue']
};

var task = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "This is an example task. Press any key."
};

timeline.push(instructions, task);

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
