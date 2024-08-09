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


//Import config file
import config from "./config.js"

//Adds consent form to timeline
import {pushConsentForm} from '../consent.js';


//EXPERIMENT CONTENT GOES HERE
var instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: config.instructions,
    choices: ['Continue']
};

var timeline = []
pushConsentForm(jsPsych, timeline, config.experimentName);

var identities   = ['European Americans', 'African Americans'];
var labels = ['GOOD', 'BAD'];

// manually preload images due to presenting them with timeline variables
var images1 = ['img/white/w1.png', 'img/white/w2.png', 'img/white/w3.png', 'img/white/w4.png', 'img/white/w5.png', 'img/white/w6.png',];

var images2 = ['img/black/b1.png', 'img/black/b2.png', 'img/black/b3.png', 'img/black/b4.png', 'img/black/b5.png', 'img/black/b6.png'];


var traits1 = ["Enjoy","Smiling","Glorious","Beautiful","Fantastic","Friend","Cheer","Joyous"];

var traits2 = ["Awful","Bothersome","Pain", "Nasty","Hurtful","Rotten","Evil", "Annoy" ];

var preload = {
    type: jsPsychPreload,
    images: images1, images2
};

timeline.push(instructions);
timeline.push(preload)
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
    timeline_variables5 = createTimelineVariables(leftstimuli, rightstimuli, 5)

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


timeline.push(preload);
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


//Adds demographics survey to timeline
import { pushDemographicSurvey } from '../demographics.js'
pushDemographicSurvey(timeline);

//Run
jsPsych.run(timeline);