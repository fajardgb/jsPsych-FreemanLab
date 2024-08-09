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
            return `<div style='position:absolute; top: 15%; left: 50%; transform: translate(-50%, -50%);'><p style='margin-right: 150px; display: inline-block'>${config.left_category_key} = ${key_e}</p><p style='margin-left: 150px; display: inline-block'>${config.right_category_key} = ${key_i}</p></div>`
        },
        choices: [config.left_category_key, config.right_category_key],
        prompt: "<p style='position:absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);'><font size='24'><strong>" + trait + "</strong></font></p>",
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

//SEMANTIC TASK END

//PHYSIOGNOMIC SCALE START

var pbsInstructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: "You are almost done! In this final task, please indicate your agreement/disagreement with each of the following statements.<br><br>You will rate the sentences on a 7-point scale (1-Strongly disagree; 7-Strongly agree). <br><br>Pay close attention to the questions as they may not always ask for your judgment about a statement.",
    choices: ['Continue']
};
timeline.push(pbsInstructions);


var physioOptions = ["1 (strongly disagree)",
                "2",
                "3",
                "4 (neither disagree or agree)",
                "5",
                "6",
                "7 (strongly agree)",];

var PhysiognomicBeliefScale_1 = {
    type: jsPsychSurveyMultiChoice,
    data: {trial_name: 'physiognomic_belief_1'},
    questions: [
        {
            prompt: "I can learn something about a person\'s personality just from looking at his or her face",
            name: "PBS_1",
            options: physioOptions,
            required: true,
            // horizontal: true,
        },]}

var PhysiognomicBeliefScale_2 = {
    type: jsPsychSurveyMultiChoice,
    data: {trial_name: 'physiognomic_belief_2'},
    questions: [
        {
            prompt: "I do not believe that the person\'s personality is reflected in their face",
            name: "PBS_2",
            options: physioOptions,
            required: true,
            // horizontal: true,
                },]}
var PhysiognomicBeliefScale_3 = {
    type: jsPsychSurveyMultiChoice,
    data: {trial_name: 'physiognomic_belief_3'},
    questions: [
            {
            prompt: "My first impression of the person\'s personality, \n just from looking at his or her face, is accurate",
            name: "PBS_3",
            options: physioOptions,
            required: true,
            // horizontal: true,
        },
    ],
};
timeline.push(PhysiognomicBeliefScale_1, PhysiognomicBeliefScale_2, PhysiognomicBeliefScale_3);

//PHYSIOGNOMIC SCALE END

//IAT START

var iatInstructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: config.iatInstructions,
    choices: ['Continue']
};

var identities   = ['European Americans', 'African Americans'];
var labels = ['GOOD', 'BAD'];

// manually preload images due to presenting them with timeline variables
var images1 = ['images/white/w1.png', 'images/white/w2.png', 'images/white/w3.png', 'images/white/w4.png', 'images/white/w5.png', 'images/white/w6.png',];

var images2 = ['images/black/b1.png', 'images/black/b2.png', 'images/black/b3.png', 'images/black/b4.png', 'images/black/b5.png', 'images/black/b6.png'];


var traits1 = ["Enjoy","Smiling","Glorious","Beautiful","Fantastic","Friend","Cheer","Joyous"];

var traits2 = ["Awful","Bothersome","Pain", "Nasty","Hurtful","Rotten","Evil", "Annoy" ];

timeline.push(iatInstructions);
// randomize which key for which category
var rand1 = Math.floor(Math.random() * 2) + 1;
//console.log('trial 1 rand:'+ rand1);
var key_e1, key_i1;
if (rand1 ==1) {
    key_e1 = identities[0];
    key_i1 = identities[1];
} else {
    key_e1 = identities[1];
    key_i1 = identities[0];
}

//changed timeline variables so they are not hard coded
function createTimelineVariables(leftstimuli, rightstimuli, trialnum){
    var timelineVariables = []
    for(var i = 0; i < leftstimuli.length; i++){
        if (trialnum == 3 || trialnum == 6){
            if(leftstimuli[i].includes(".png")){
                //check if image so can push image correctly
                timelineVariables.push({stimulus: "<img src="+ leftstimuli[i] +" ></img>", stim_key_association: "left"})
            }
            else{
                timelineVariables.push({stimulus: leftstimuli[i], stim_key_association: "left"})
            }
        }
        else{
            timelineVariables.push({stimulus: leftstimuli[i], stim_key_association: "left"})
        }

    }
    for(var i = 0; i < rightstimuli.length; i++){
        if (trialnum == 3 || trialnum == 6){
            if(rightstimuli[i].includes(".png")){
                timelineVariables.push({stimulus: "<img src="+ rightstimuli[i] +" ></img>", stim_key_association: "right"})
            }
            else{
                timelineVariables.push({stimulus: rightstimuli[i], stim_key_association: "right"})
            }
        }
        else{
            timelineVariables.push({stimulus: rightstimuli[i], stim_key_association: "right"})
        }

    }
    return timelineVariables;
}


var timeline_variables1;
if (key_e1 ==identities[0]) {
    var leftstimuli = images1
    var rightstimuli = images2
    timeline_variables1 = createTimelineVariables(leftstimuli, rightstimuli, 1)

}
else {
    var leftstimuli = images2
    var rightstimuli = images1
    timeline_variables1 = createTimelineVariables(leftstimuli, rightstimuli, 1)
}


var instructions_block = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<div style='position: absolute; top: 18%; left: 20%'><p>Press e for:<br><strong>"+key_e1+"</strong></p></div>" +
        "<div style='position: absolute; top: 18%; right: 20%'><p>Press i for:<br><strong>"+key_i1+"</strong></p></div>" +
        "<div style='position: relative; top: 42%; margin-left: auto; margin-right: auto'>Put a left finger on the <strong>e</strong> key for items that belong to the "+key_e1+" People category. Put a right finger on the " +
        "<strong>i</strong> key for items that belong to the "+key_i1+" People " +
        "category. Items will appear one at a time.<br><br>" + "If you " +
        "make a mistake, a red X will appear. Press the keys listed below " +
        "to continue. Go as fast as you can while being accurate.<br><br> " +
        "Press the any key when you are ready to start.</div>",
};


//changed trial block to be customizable in configs
var trial_block = {
    timeline: [
        {
            type: jsPsychIatImage,
            stimulus: jsPsych.timelineVariable('stimulus'),
            stim_key_association: jsPsych.timelineVariable('stim_key_association'),
            html_when_wrong: config.html_when_wrong,
            bottom_instructions: config.bottom_instructions,
            force_correct_key_press: config.force_correct_key_press,
            display_feedback: config.display_feedback,
            trial_duration: config.trial_duration,
            left_category_key: config.left_category_key,
            right_category_key: config.right_category_key,
            left_category_label:[key_e1],
            right_category_label: [key_i1],
            response_ends_trial: config.response_ends_trial,
            data: { iat_type: 'practice', rand: rand1 } //Add this data to the data collected by the plugin
        }
    ],

    timeline_variables: timeline_variables1,
    randomize_order: true,
    repetitions: 2
};

// -------------------------- TRIAL 2 --------------------------

var rand2 = Math.floor(Math.random() * 2) + 1;
//console.log('trial 2 rand:'+ rand2);
var key_e2, key_i2;
if (rand2 ==1) {
    key_e2 = labels[0];
    key_i2 = labels[1];
} else {
    key_e2 = labels[1];
    key_i2 = labels[0];
}

var timeline_variables2;
if (key_e2 ==labels[0]) {

    var leftstimuli = traits1
    var rightstimuli = traits2
    timeline_variables2 = createTimelineVariables(leftstimuli, rightstimuli,2)

}
else {
    var leftstimuli = traits2
    var rightstimuli = traits1
    timeline_variables2 = createTimelineVariables(leftstimuli, rightstimuli,2)

}

var instructions_block2 = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<div style='position: absolute; top: 18%; left: 20%'>Press E for:<br><strong>"+key_e2+"</strong></div>" +
        "<div style='position: absolute; top: 18%; right: 20%'>Press I for:<br><strong>"+key_i2+"</strong></div>" +
        "<div style='position: relative; top: 42%; margin-left: auto; margin-right: auto'>Put a left finger on the <strong>e</strong> key for items that " +
        "belong to the "+key_e2+" category. Put a right finger on the " +
        "<strong>i</strong> key for items that belong to the "+key_i2+
        " category. Items will appear one at a time.<br><br>" + "If you " +
        "make a mistake, a red X will appear. Press the keys listed below " +
        "to continue. Go as fast as you can while being accurate.<br><br> " +
        "Press the any key when you are ready to start.</div>",
};

var trial_block2 = {
    timeline: [
        {
            type: jsPsychIatHtml,
            stimulus: jsPsych.timelineVariable('stimulus'),
            stim_key_association: jsPsych.timelineVariable('stim_key_association'),
            html_when_wrong: config.html_when_wrong,
            bottom_instructions: config.bottom_instructions,
            force_correct_key_press: config.force_correct_key_press,
            display_feedback: config.display_feedback,
            trial_duration: config.trial_duration, //Only if display_feedback is false
            left_category_key: config.left_category_key,
            right_category_key: config.right_category_key,
            left_category_label:[key_e2],
            right_category_label: [key_i2],
            response_ends_trial: config.response_ends_trial,
            data: { iat_type: 'practice' }
        }
    ],
    timeline_variables: timeline_variables2,
    randomize_order: true,
    repetitions: 2
};

// -------------------------- TRIAL 3 & 4-------------------------

var key_e34 = key_e1 +" or "+ key_e2;
var key_i34 = key_i1 +" or "+ key_i2;

// console.log('key_e34:'+ key_e34);
// console.log('key_i34:'+ key_i34);

var timeline_variables34;


// if WG is for key E
if (key_e34 == identities[0] +" or "+ labels[0]) {
    var leftstimuli1 = images1
    var leftstimuli2 = traits1
    var leftstimuli = leftstimuli1.concat(leftstimuli2)
    var rightstimuli1 = images2
    var rightstimuli2 = traits2
    var rightstimuli = rightstimuli1.concat(rightstimuli2)
    timeline_variables34 = createTimelineVariables(leftstimuli, rightstimuli,3)

}

// if WG is for key I
if (key_i34 == identities[0] +" or "+ labels[0]) {

    var rightstimuli1 = images1
    var rightstimuli2 = traits1
    var rightstimuli = rightstimuli1.concat(rightstimuli2)
    var leftstimuli1 = images2
    var leftstimuli2 = traits2
    var leftstimuli = leftstimuli1.concat(leftstimuli2)
    timeline_variables34 = createTimelineVariables(leftstimuli, rightstimuli,3)

}

// if BG is for key E
if (key_e34 == identities[1] +" or "+ labels[0]) {

    var leftstimuli1 = images2
    var leftstimuli2 = traits1
    var leftstimuli = leftstimuli1.concat(leftstimuli2)
    var rightstimuli1 = images1
    var rightstimuli2 = traits2
    var rightstimuli = rightstimuli1.concat(rightstimuli2)
    timeline_variables34 = createTimelineVariables(leftstimuli, rightstimuli,3)

}

// if BG for key I
if (key_i34 == identities[1] +" or "+ labels[0]) {

    var rightstimuli1 = images2
    var rightstimuli2 = traits1
    var rightstimuli = rightstimuli1.concat(rightstimuli2)
    var leftstimuli1 = images1
    var leftstimuli2 = traits2
    var leftstimuli = leftstimuli1.concat(leftstimuli2)
    timeline_variables34 = createTimelineVariables(leftstimuli, rightstimuli,3)


}


var instructions_block3 = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<div style='position: absolute; top: 18%; left: 20%'>Press e for:<br> " +
        "<strong>"+key_e34.split(" or ")[0]+"</strong><br>" + "or<br>" + "<strong>"+key_e34.split(" or ")[1]+"</strong></div>" + "<div style='position: absolute; top: 18%; right: 20%'>" +
        "Press i for:<br>" + "<strong>"+key_i34.split(" or ")[0]+"</strong><br>" + "or<br>" + "<strong>"+key_i34.split(" or ")[1]+"</strong></div>" +
        "<div style='position: relative; top: 42%; margin-left: auto; margin-right: auto'>Use <strong>e</strong> for "+key_e34+
        ". Use <strong>i</strong> for "+key_i34+" <br>" +
        "Each item belongs to only one category.<br><br>" + "If you " +
        "make a mistake, a red X will appear. Press the keys listed below " +
        "to continue. Go as fast as you can while being accurate.<br><br> " +
        "Press any key when you are ready to start.</div>"
};

var trial_block3 = {
    timeline: [
        {
            // type: jsPsych.timelineVariable('type'),
            type: jsPsychIatHtml,
            stimulus: jsPsych.timelineVariable('stimulus'),
            stim_key_association: jsPsych.timelineVariable('stim_key_association'),
            html_when_wrong: config.html_when_wrong,
            bottom_instructions: config.bottom_instructions,
            force_correct_key_press: config.force_correct_key_press,
            display_feedback: config.display_feedback,
            trial_duration: config.trial_duration, //Only if display_feedback is false
            left_category_key: config.left_category_key,
            right_category_key: config.right_category_key,
            response_ends_trial: config.response_ends_trial,
            left_category_label: [key_e34.split(" or ")[0], key_e34.split(" or ")[1]],
            right_category_label: [key_i34.split(" or ")[0], key_i34.split(" or ")[1]],
            data: { iat_type: 'practice', key_e3: key_e34, key_i3: key_i34 }
        }
    ],

    timeline_variables: timeline_variables34,
    randomize_order: true,
    repetitions: 1
};

// -------------------------- TRIAL 4 (same as 3) --------------------------

var instructions_block4 = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<div style='position: absolute; top: 18%; left: 20%'>Press e for:<br> " +
        "<strong>"+key_e34.split(" or ")[0]+"</strong><br>" + "or<br>" + "<strong>"+key_e34.split(" or ")[1]+"</strong></div>" + "<div style='position: absolute; top: 18%; right: 20%'>" +
        "Press i for:<br>" + "<strong>"+key_i34.split(" or ")[0]+"</strong><br>" + "or<br>" + "<strong>"+key_i34.split(" or ")[1]+"</strong></div>" +
        "<div style='position: relative; top: 42%; margin-left: auto; margin-right: auto'>Use <strong>e</strong> for "+key_e34+
        ". Use <strong>i</strong> for "+key_i34+" <br>" +
        "Each item belongs to only one category.<br><br>" + "If you " +
        "make a mistake, a red X will appear. Press the keys listed below " +
        "to continue. Go as fast as you can while being accurate.<br><br> " +
        "Press any key when you are ready to start.</div>",
};

var trial_block4 = {
    timeline: [
        {
            // type: jsPsych.timelineVariable('type'),
            type: jsPsychIatHtml,
            stimulus: jsPsych.timelineVariable('stimulus'),
            stim_key_association: jsPsych.timelineVariable('stim_key_association'),
            html_when_wrong: config.html_when_wrong,
            bottom_instructions: config.bottom_instructions,
            force_correct_key_press: config.force_correct_key_press,
            display_feedback: config.display_feedback,
            trial_duration: config.trial_duration, //Only if display_feedback is false
            left_category_key: config.left_category_key,
            right_category_key: config.right_category_key,
            response_ends_trial: config.response_ends_trial,
            left_category_label: [key_e34.split(" or ")[0], key_e34.split(" or ")[1]],
            right_category_label: [key_i34.split(" or ")[0], key_i34.split(" or ")[1]],
            data: { iat_type: key_e34 + key_i34, key_e34: key_e34, key_i34: key_i34 }
        }
    ],

    timeline_variables: timeline_variables34,
    randomize_order: true,
    repetitions: 2
};

// -------------------------- TRIAL 5 --------------------------

var key_e5, key_i5;
// if this, then use the other!
if (key_e34 == identities[0] +" or "+ labels[0]) {
    key_e5 = identities[1];
    key_i5 = identities[0];
}

if (key_e34 == identities[0] +" or "+ labels[1]) {
    key_e5 = identities[1];
    key_i5 = identities[0];
}

if (key_e34 == identities[1] +" or "+ labels[0]) {
    key_e5 = identities[0];
    key_i5 = identities[1];
}

if (key_e34 == identities[1] +" or "+ labels[1]) {
    key_e5 = identities[0];
    key_i5 = identities[1];
}

// make timeline variables
var timeline_variables5;
if (key_e5 == identities[0]) {

    var leftstimuli = images1
    var rightstimuli = images2
    timeline_variables5 = createTimelineVariables(leftstimuli, rightstimuli, 5)

}
else {

    var leftstimuli = images2
    var rightstimuli = images1
    timeline_variables1 = createTimelineVariables(leftstimuli, rightstimuli, 5)

}


var instructions_block5 = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<div style='position: absolute; top: 18%; left: 20%'>Press e for:<br>" + "<strong>"+key_e5+"</strong></div>" +
        "<div style='position: absolute; top: 18%; right: 20%'>Press i for:<br>" + "<strong>"+key_i5+"</strong></div>" +
        "<div style='position: relative; top: 42%; margin-left: auto; margin-right: auto'>Watch out, the labels have changed positions!<br>" +
        "Use <strong>e</strong> for "+key_e5+" People<br>" + "Use <strong>i</strong> for "+key_i5+" People<br><br>" +
        "If you make a mistake, a red X will appear. Press the keys listed below " +
        "to continue. Go as fast as you can while being accurate.<br><br> " +
        "Press the any key when you are ready to start.</div>"
};

var trial_block5 = {
    timeline: [
        {
            type: jsPsychIatImage,
            stimulus: jsPsych.timelineVariable('stimulus'),
            stim_key_association: jsPsych.timelineVariable('stim_key_association'),
            html_when_wrong: config.html_when_wrong,
            bottom_instructions: config.bottom_instructions,
            force_correct_key_press: config.force_correct_key_press,
            display_feedback: config.display_feedback,
            trial_duration: config.trial_duration, //Only if display_feedback is false
            left_category_key: config.left_category_key,
            right_category_key: config.right_category_key,
            response_ends_trial: config.response_ends_trial,
            left_category_label: [key_e5],
            right_category_label: [key_i5],
            data: { iat_type: 'practice' }
        }
    ],
    timeline_variables: timeline_variables5,
    randomize_order: true,
    repetitions: 2
};

// -------------------------- TRIAL 6 --------------------------
var key_e67, key_i67;

if (key_e34 == identities[0] +" or "+ labels[0]) {
    key_e67 = identities[1] +" or "+ labels[0];
    key_i67 = identities[0] +" or "+ labels[1];
}

if (key_e34 == identities[0] +" or "+ labels[1]) {
    key_e67 = identities[1] +" or "+ labels[1];
    key_i67 = identities[0] +" or "+ labels[0];
}

if (key_e34 == identities[1] +" or "+ labels[0]) {
    key_e67 = identities[0] +" or "+ labels[0];
    key_i67 = identities[1] +" or "+ labels[1];
}

if (key_e34 == identities[1] +" or "+ labels[1]) {
    key_e67 = identities[0] +" or "+ labels[1];
    key_i67 = identities[1] +" or "+ labels[0];
}

// console.log('key_e67: '+key_e67);
// console.log('key_i67: '+key_i67);

var timeline_variables67;

// if WG is for key E
if (key_e67 == identities[0] +" or "+ labels[0]) {
    var leftstimuli1 = images1
    var leftstimuli2 = traits1
    var leftstimuli = leftstimuli1.concat(leftstimuli2)
    var rightstimuli1 = images2
    var rightstimuli2 = traits2
    var rightstimuli = rightstimuli1.concat(rightstimuli2)
    timeline_variables67 = createTimelineVariables(leftstimuli, rightstimuli,6)


}

// if WG is for key I
if (key_i67 == identities[0] +" or "+ labels[0]) {
    var rightstimuli1 = images1
    var rightstimuli2 = traits1
    var rightstimuli = rightstimuli1.concat(rightstimuli2)
    var leftstimuli1 = images2
    var leftstimuli2 = traits2
    var leftstimuli = leftstimuli1.concat(leftstimuli2)
    timeline_variables67 = createTimelineVariables(leftstimuli, rightstimuli, 6)

}

// if BG is for key E
if (key_e67 == identities[1] +" or "+ labels[0]) {
    var leftstimuli1 = images2
    var leftstimuli2 = traits1
    var leftstimuli = leftstimuli1.concat(leftstimuli2)
    var rightstimuli1 = images1
    var rightstimuli2 = traits2
    var rightstimuli = rightstimuli1.concat(rightstimuli2)
    timeline_variables67 = createTimelineVariables(leftstimuli, rightstimuli,6)
}

// if BG for key I
if (key_i67 == identities[1] +" or "+ labels[0]) {
    var rightstimuli1 = images2
    var rightstimuli2 = traits1
    var rightstimuli = rightstimuli1.concat(rightstimuli2)
    var leftstimuli1 = images1
    var leftstimuli2 = traits2
    var leftstimuli = leftstimuli1.concat(leftstimuli2)
    timeline_variables67 = createTimelineVariables(leftstimuli, rightstimuli,6)
}


var instructions_block6 = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<div style='position: absolute; top: 18%; left: 20%'>Press e for:<br> <strong>"+key_e67.split(" or ")[0]+"</strong><br>" + "or<br>" +
        "<strong>"+key_e67.split(" or ")[1]+"</strong></div>" + "<div style='position: absolute; top: 18%; right: 20%'>Press i for:<br>" + "<strong>"+key_i67.split(" or ")[0]+"</strong><br>" + "or<br>" +
        "<strong>"+key_i67.split(" or ")[1]+"</strong></div>" +
        "<div style='position: relative; top: 42%; margin-left: auto; margin-right: auto'>Use <strong>e</strong> for "+key_e67+"<br>" +
        "Use <strong>i</strong> for "+key_i67+" <br><br>" +
        "If you make a mistake, a red X will appear. Press the keys listed below " +
        "to continue. Go as fast as you can while being accurate.<br><br> " +
        "Press the any key when you are ready to start.</div>"
};

var trial_block6 = {
    timeline: [
        {
            // type: jsPsych.timelineVariable('type'),
            type: jsPsychIatHtml,
            stimulus: jsPsych.timelineVariable('stimulus'),
            stim_key_association: jsPsych.timelineVariable('stim_key_association'),
            html_when_wrong: config.html_when_wrong,
            bottom_instructions: config.bottom_instructions,
            force_correct_key_press: config.force_correct_key_press,
            display_feedback: config.display_feedback,
            trial_duration: config.trial_duration, //Only if display_feedback is false
            left_category_key: config.left_category_key,
            right_category_key: config.right_category_key,
            response_ends_trial: config.response_ends_trial,
            left_category_label: [key_e67.split(" or ")[0], key_e67.split(" or ")[1]],
            right_category_label: [key_i67.split(" or ")[0], key_i67.split(" or ")[1]],
            data: { iat_type: 'practice', key_e67: key_e67, key_i67: key_i67 }
        }
    ],
    timeline_variables: timeline_variables67,
    randomize_order: true,
    repetitions: 1
};

// -------------------------- TRIAL 7 --------------------------

var instructions_block7 = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<div style='position: absolute; top: 18%; left: 20%'>Press e for:<br> <strong>"+key_e67.split(" or ")[0]+"</strong><br>" + "or<br>" +
        "<strong>"+key_e67.split(" or ")[1]+"</strong></div>" + "<div style='position: absolute; top: 18%; right: 20%'>Press i for:<br>" + "<strong>"+key_i67.split(" or ")[0]+"</strong><br>" + "or<br>" +
        "<strong>"+key_i67.split(" or ")[1]+"</strong></div>" +
        "<div style='position: relative; top: 42%; margin-left: auto; margin-right: auto'>Use <strong>e</strong> for "+key_e67+"<br>" +
        "Use <strong>i</strong> for "+key_i67+" <br><br>" +
        "If you make a mistake, a red X will appear. Press the keys listed below " +
        "to continue. Go as fast as you can while being accurate.<br><br> " +
        "Press the any key when you are ready to start.</div>"
};

var trial_block7 = {
    timeline: [
        {
            // type: jsPsych.timelineVariable('type'),
            type: jsPsychIatHtml,
            stimulus: jsPsych.timelineVariable('stimulus'),
            stim_key_association: jsPsych.timelineVariable('stim_key_association'),
            html_when_wrong: config.html_when_wrong,
            bottom_instructions: config.bottom_instructions,
            force_correct_key_press: config.force_correct_key_press,
            display_feedback: config.display_feedback,
            trial_duration: config.trial_duration, //Only if display_feedback is false
            left_category_key: config.left_category_key,
            right_category_key: config.right_category_key,
            response_ends_trial: config.response_ends_trial,
            left_category_label: [key_e67.split(" or ")[0], key_e67.split(" or ")[1]],
            right_category_label: [key_i67.split(" or ")[0], key_i67.split(" or ")[1]],
            data: { iat_type: key_e67 + key_i67, key_e67: key_e67, key_i67: key_i67 }
        }
    ],
    timeline_variables: timeline_variables67,
    randomize_order: true,
    repetitions: 2
};

var debrief_block = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<p>You're all done! Thank you for participating. Please let the researcher know - do not close any tabs! Remind the researcher if you have not yet received payment.</p>",
};


timeline.push(instructions_block);
timeline.push(trial_block);
timeline.push(instructions_block2);
timeline.push(trial_block2);
timeline.push(instructions_block3);
timeline.push(trial_block3);
timeline.push(instructions_block4);
timeline.push(trial_block4);
timeline.push(instructions_block5);
timeline.push(trial_block5);
timeline.push(instructions_block6);
timeline.push(trial_block6);
timeline.push(instructions_block7);
timeline.push(trial_block7);
timeline.push(debrief_block);
//IAT END

//END OF EXPERIMENT CONTENT

//Adds demographics survey to timeline
import { pushDemographicSurvey } from '../demographics.js';
pushDemographicSurvey(timeline);

//Run
jsPsych.run(timeline);
