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

//shuffleArray function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Generate a random index from 0 to i

        // Swap array[i] and array[j]
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

//Adds consent form to timeline
import { pushConsentForm } from '../consent.js';
pushConsentForm(jsPsych, timeline, config.experimentName);


//LEARNING TASK START
//EXPERIMENT CONTENT GOES HERE
var learningInstructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: config.learningInstructions,
    choices: ['Continue']
};


//Preload images so loading them doesn't cause delays during the actual task
var learningPreload = {
    type: jsPsychPreload,
    images: config.imageList.map(function (item) {
        return "images/" + item;
    })
};

timeline.push(learningPreload, learningInstructions);

//Return array stimuli based on pairingFunction provided in config
var learningTaskStimuli = config.pairingFunction();

//Image display
var image = {
    type: jsPsychHtmlButtonResponse,
    stimulus: jsPsych.timelineVariable('stimulus'),
    choices: ["Next"],
    on_finish: function(data){
        // Determine whether to show feedback page.
        if(data.rt < 2000){
            data.feedback = true;
        } else {
            data.feedback = false; 
        }
    }
};


var learningFeedback = {
    type: jsPsychHtmlKeyboardResponse,
    trial_duration: 2000,
    stimulus: "<h1>Please spend more time on each image.</h1>",
    choices: "NO_KEYS",
};

var learningFeedbackNode = {
    timeline: [learningFeedback],
    conditional_function: function(){
        var playingFeedback = jsPsych.data.get().last(1).values()[0].feedback;
        if(playingFeedback){
          return true;
        } else {
          return false;
        }
    }
}

//Combined learning task
var learningTask = {
    timeline: [image,learningFeedbackNode],
    timeline_variables: learningTaskStimuli,
    sample: {
        type: 'without-replacement',
        size: 2 
    },
};
timeline.push(learningTask);
//LEARNING TASK END

//SEMANTIC TASK START

//Replace images with relevant ones for experiment
var congruent = ['images/white/w1.png', 'images/white/w2.png', 'images/white/w3.png'];

var incongruent = ['images/black/b1.png', 'images/black/b2.png', 'images/black/b3.png'];

var traits1  =['trustworthy', 'youthful', 'old'] //Customizable

var traits2 =  ['mean', 'energetic', 'cringe'] //have congruent, incongruent, traits1, traits2 be the same length
congruent = shuffleArray(congruent)
incongruent = shuffleArray(incongruent)
traits1 = shuffleArray(traits1)
traits2 = shuffleArray(traits2)


var labels = ['GOOD', 'BAD']; //Customizable

var semanticPreload = {
    type: jsPsychPreload,
    images:congruent, incongruent
};


var semanticInstructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: config.semanticInstructions,
    choices: ['Continue']
};

timeline.push(semanticPreload,semanticInstructions);

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
        timeline.push(ImageSimTask);
        timeline.push(createFixationCross());
        timeline.push(createBlank());
        timeline.push(TraitSimTask);
        timeline.push(createTooSlow());
        timeline.push(createTooFast());
}

//SEMANTIC TASK END

//PHYSIOGNOMIC SCALE START
var physioOptions = ["1 (strongly disagree)",
    "2",
    "3",
    "4 (neither disagree or agree)",
    "5",
    "6",
    "7 (strongly agree)",];

var PhysiognomicBeliefScale = {
type: jsPsychSurveyMultiChoice,
data: {trial_name: 'physiognomic_belief'},
questions: [
{
prompt: "I can learn something about a person\'s personality just from looking at his or her face",
name: "PBS_1",
options: physioOptions,
required: true,
// horizontal: true,
},
{
prompt: "I do not believe that the person\'s personality is reflected in their face",
name: "PBS_2",
options: physioOptions,
required: true,
// horizontal: true,
},
{
prompt: "My first impression of the person\'s personality, \n just from looking at his or her face, is accurate",
name: "PBS_3",
options: physioOptions,
required: true,
// horizontal: true,
},
],
};
timeline.push(PhysiognomicBeliefScale);

//PHYSIOGNOMIC SCALE END

//IAT START

//IAT END

//END OF EXPERIMENT CONTENT

//Adds demographics survey to timeline
import { pushDemographicSurvey } from '../demographics.js';
pushDemographicSurvey(timeline);

//Run
jsPsych.run(timeline);
