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
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Generate a random index from 0 to i

        // Swap array[i] and array[j]
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

//Replace images with relevant ones for experiment
var congruent = ['img/white/w1.png', 'img/white/w2.png', 'img/white/w3.png'];

var incongruent = ['img/black/b1.png', 'img/black/b2.png', 'img/black/b3.png'];

var traits1  =['trustworthy', 'youthful', 'old'] //Customizable

var traits2 =  ['mean', 'energetic', 'cringe'] //have congruent, incongruent, traits1, traits2 be the same length
congruent = shuffleArray(congruent)
incongruent = shuffleArray(incongruent)
traits1 = shuffleArray(traits1)
traits2 = shuffleArray(traits2)


var labels = ['GOOD', 'BAD']; //Customizable

//Adds consent form to timeline
import { pushConsentForm } from '../consent.js';
pushConsentForm(jsPsych, timeline, config.experimentName);

var preload = {
    type: jsPsychPreload,
    images:congruent, incongruent
};

//EXPERIMENT CONTENT GOES HERE
var instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: config.instructions,
    choices: ['Continue']
};

timeline.push(instructions);
timeline.push(preload)

//create trait pairs of congruent faces with traits, incongruent faces with traits
function createTaskPairs(congruent, incongruent, traits1, traits2){
    var pairs = [];
    for (let i =0; i < incongruent.length; i++){
        var pair = [congruent[i], traits1[i]];
        pairs.push(pair)
    }
    for (let i = 0; i < incongruent.length; i++){
        var pair = [incongruent[i], traits2[i]];
        pairs.push(pair)
    }

    return pairs
}
function createImageSimTask(image){
    //display prime images

    var simTask = {
        type: jsPsychImageKeyboardResponse,
        stimulus: image,
        choices: config.image_key,
        trial_duration: config.prime_duration,

    };
    return [simTask];


}

function createFixationCross(){
    let fixation = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: '<div style="font-size:60px;">+</div>',
        choices: "NO_KEYS",
        trial_duration: 500,
    };
    return fixation;
}

function createBlank(){
    let blank = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: '',
        choices: "NO_KEYS",
        trial_duration: 100,
    };
    return blank;
}

function createTraitSimTask(trait){

    var simTask = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function(){
            // randomize which key for which category
            var rand = Math.floor(Math.random() * 2) + 1;

            var key_e, key_i;
            if (rand ==1) {
                key_e = labels[0];
                key_i = labels[1];
            } else {
                key_e = labels[1];
                key_i = labels[0];
            }
            return `<div style='margin-bottom: 300px'><p style='margin-right: 150px; display: inline-block'>${config.left_category_key} = ${key_e}</p><p style='margin-left: 150px; display: inline-block'>${config.right_category_key} = ${key_i}</p></div>`
        },
        choices: [config.left_category_key, config.right_category_key],
        prompt: "<font size='24'><strong>" + trait + "</strong></font>",
        on_finish: function(data){
            // Determine whether to show feedback page.
            if(data.rt < 200){
                data.tooFast = true;
                data.tooSlow = false; 
            } else if (data.rt > 3000) {
                data.tooFast = false;
                data.tooSlow = true; 
            } else {
                data.tooFast = false;
                data.tooSlow = false; 
            }
            
        }
    };
    return [simTask];

}

function createTooSlow(){
    var feedback = {
        type: jsPsychHtmlKeyboardResponse,
        trial_duration: 2000,
        choices: "NO_KEYS",
        stimulus: "<h1>Please make your decision more quickly.</h1>"
    };
    
    var feedbackNode = {
        timeline: [feedback],
        conditional_function: function(){
            var playingFeedback = jsPsych.data.get().last(1).values()[0].tooSlow;
            if(playingFeedback){
              return true;
            } else {
              return false;
            }
        }
    }
    return feedbackNode;
}

function createTooFast(){
    var feedback = {
        type: jsPsychHtmlKeyboardResponse,
        trial_duration: 2000,
        choices: "NO_KEYS",
        stimulus: "<h1>Please spend more time making a decision.</h1>"
    };
    
    var feedbackNode = {
        timeline: [feedback],
        conditional_function: function(){
            var playingFeedback = jsPsych.data.get().last(1).values()[0].tooFast;
            if(playingFeedback){
              return true;
            } else {
              return false;
            }
        }
    }
    return feedbackNode;
}

var traitPairs = createTaskPairs(congruent, incongruent, traits1, traits2)
traitPairs = shuffleArray(traitPairs)

for(var i = 0; i <traitPairs.length; i = i+1)
{

        // Create a task for the current (image, trait) pair
        console.log(traitPairs[i][0], traitPairs[i][1])
        var [ImageSimTask] = createImageSimTask(traitPairs[i][0]);
        var [TraitSimTask] = createTraitSimTask(traitPairs[i][1]);
        timeline.push(createFixationCross());
        timeline.push(ImageSimTask);
        timeline.push(createBlank());
        timeline.push(TraitSimTask);
        timeline.push(createTooSlow());
        timeline.push(createTooFast());
}



//END OF EXPERIMENT CONTENT

//Adds demographics survey to timeline
import { pushDemographicSurvey } from '../demographics.js'
pushDemographicSurvey(timeline);

//Run
jsPsych.run(timeline);