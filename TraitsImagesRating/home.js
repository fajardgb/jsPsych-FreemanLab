//rating on SINGLE trait

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

var instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: sliderconfig.instructions, //sliderconfig if using sliders, buttonconfig if using buttons
    choices: ['Continue']
};

timeline.push(instructions);

//Adds consent form to timeline
import { pushConsentForm } from '../consent.js';
pushConsentForm(jsPsych, timeline, config.experimentName);

var preload = {
    type: jsPsychPreload,
    images: config.imageList.map(function (item) {
        return "images/" + item;
    })
};
timeline.push(preload)

var test_stimuli = config.imageList.map(function (item) {
    return { stimulus: ["images/" + item] };
});

//EXPERIMENT CONTENT GOES HERE


//Can change the strings in this list to be any trait
var traitArray = [
    "Trustworthy",
    "Condescending",
    "Articulate",
    "Affectionate",
    "Dignified",
    "Combative",
    "Self-critical",
    "Persistent",
    "Prejudiced",
    "Sensitive",
    "Clever",
    "Prudish",
    "Unobservant",
    "Healthy",
    "Ambitious",
    "Optimistic",
    "Grumpy",
    "Passive",
    "Sociable",
    "Mature",
    "Skeptical",
    "Religious",
    "Easygoing",
    "Courageous",
    "Happy",
    "Intellectual",
    "Charismatic",
    "Consistent",
    "Patient",
    "Independent",
    "Submissive",
    "Beautiful",
    "Sincere",
    "Weird",
    "Competent",
    "Ethical",
    "Enthusiastic",
    "Responsible",
    "Punctual",
    "Flexible",
    "Mean",
    "Youthful",
    "Abusive",
    "Bossy",
    "Rebellious",
    "Careful",
    "Ignorant",
    "Helpful",
    "Cruel",
    "Critical",
    "Aggressive",
    "Self-pitying",
    "Conscientious",
    "Thoughtful",
    "Empathetic",
    "Confident",
    "Compulsive",
    "Humble",
    "Practical",
    "Defensive",
    "Reasonable",
    "Anxious",
    "Agreeable",
    "Natural",
    "Disorderly",
    "Open-minded",
    "Angry",
    "Well-educated",
    "Intense",
    "Feminine",
    "Strong",
    "Manipulative",
    "Curious",
    "Traditional",
    "Outspoken",
    "Strict",
    "Emotional",
    "Determined",
    "Atypical",
    "Jealous",
    "Energetic",
    "Serious",
    "Creative",
    "Wise",
  ];


function createTask(trait){

    var showImage = {
        type: jsPsychImageSliderResponse, //if using slider
        // type:  jsPsychImageButtonResponse //if using buttons 
        stimulus: jsPsych.timelineVariable("stimulus"),
        prompt: "<p>" + "How" + trait + "is this person?" + "</p>",
        labels: sliderconfig.sliderLabels, //if using slider
        //choices: buttonconfig.Labels //if using buttons
        min: sliderconfig.min, //not necessary if using buttons
        max: sliderconfig.max, //not necessary if using buttons
        slider_start: sliderconfig.start_slider, //not necessary if using buttons
        response_ends_trial: true
    };
    return [showImage];
}

//loop over traits
for (var i = 0; i < traitArray.length; i=i+1) {

    var trait = traitArray[i];
    var task = createTask(trait);
    timeline.push(task);
}



//loop over images 
var trait = traitArray[0] //can change index to index of whatever trait you want
for(var i = 0; i < test_stimuli.length; i = i+1){
    var task = createTask(trait);
    timeline.push(task);
}


var trial = {
    timeline: [showImage],
    timeline_variables: test_stimuli,
    randomize_order: config.randomize,
};

timeline.push(trial);

//END OF EXPERIMENT CONTENT

//Adds demographics survey to timeline
import { pushDemographicSurvey } from '../demographics.js'
pushDemographicSurvey(timeline);

//Run
jsPsych.run(timeline);
