//Rates SINGLE image on MULTIPLE traits, ONE TRAIT at a time

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
//If want to rate images with sliders, import from "./sliderconfig.js"
//If want to rate images with buttons, import from "./buttonconfig.js"
import config from "./sliderconfig.js"


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

timeline.push(instructions);
timeline.push(preload);

var test_stimuli = config.imageList.map(function (item) {
    return { stimulus: ["images/" + item] };
});



//Can change the strings in this list to be any trait
var traitArray = [
    "trustworthy",
    "condescending",
    "articulate",
    "affectionate",
    "dignified",
    "combative",
    "self-critical",
    "persistent",
    "prejudiced",
    "sensitive",
    "clever",
    "prudish",
    "unobservant",
    "healthy",
    "ambitious",
    "optimistic",
    "grumpy",

];
function createTaskSlider(trait){
    var showImage = {
        type: jsPsychImageSliderResponse,
        stimulus: "images/test1.png", //file of image to be used
        prompt: "<p>" + "How " + trait + " is this person?" + "</p>",
        labels: config.sliderLabels,
        min: config.min,
        max: config.max,
        slider_start: config.slider_start,
        response_ends_trial: true
    };
    return showImage;
}

function createTaskButton(trait){
    var showImage = {
        type: jsPsychImageButtonResponse,
        stimulus: "images/test1.png", //file of image to be used
        prompt: "<p>" + "How " + trait + " is this person?" + "</p>",
        choices: config.Labels,
        response_ends_trial: true
    };
    return showImage;
}

function shuffleArray(array) {
    for (var i = traitArray.length - 1; i > 0; i--) {

        // Generate random number
        var j = Math.floor(Math.random() * (i + 1));

        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

//randomize
traitArray = shuffleArray(traitArray);

//Loop through traits for single image
for (var i = 0; i < traitArray.length; i=i+1) {

    var trait = traitArray[i];
    var task = createTaskSlider(trait) //change to createTaskButton(trait) if using buttons
    timeline.push(task);

}




//Adds demographics survey to timeline
import { pushDemographicSurvey } from '../demographics.js'
pushDemographicSurvey(timeline);

//Run
jsPsych.run(timeline);