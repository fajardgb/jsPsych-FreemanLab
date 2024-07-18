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
var instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: config.instructions,
    choices: ['Continue']
};

timeline.push(instructions)


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Generate a random index from 0 to i

        // Swap array[i] and array[j]
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

var traitArray =['trustworthy', 'youthful', 'old', 'mean', 'energetic', 'cringe'];
traitArray = shuffleArray(traitArray);

function createSimTask(trait1, trait2) {
    //the prompt/question
    //var q = "How likely are <strong>" + trait1 + "</strong> people to be <strong>" + trait2 + "</strong>?";

    var simTask = {
        type: jsPsychSurveyLikert,
        data: { trait1: trait1, trait2: trait2 },
        scale_width: 800,
        questions: [
            {
                prompt: "How likely are <strong>" + trait1 + "</strong> people to be <strong>" + trait2 + "</strong>?",
                required: true,
                labels: [
                    '1 (not at all likely)',
                    '2',
                    '3',
                    '4 (neutral)',
                    '5',
                    '6',
                    '7 (very likely)']
            }
        ]
    };
    return [simTask];

}

// Loop through the traitArray and create trait pairs
// This allows for comparing traits bidirectionally.
var traitPairs = [];
for (var i = 0; i < traitArray.length; i=i+1) {

    var trait1 = traitArray[i];


    for(var j = 0; j < traitArray.length; j = j+1){
        var trait2 = traitArray[j];
        if(trait1 == trait2){
            //Skip if comparing trait with same trait
            continue;
        }

        if(trait2 === undefined){
            continue;
        }
        let pair = [trait1, trait2]


        traitPairs.push(pair)
        //console.log(trait1, trait2)

    }
    //console.log(traitPairs)


}

// This removes reverses of pairs from the array of pairs so that two traits are only compared once
function removeDuplicatePairs(arrayPairs) {
    const seen = new Set();
    const removed = [];

    arrayPairs.forEach(pair => {
        const sortedPair = pair.slice().sort();
        const pairKey = sortedPair.join(',');
        // Check if the reverse pair has been seen
        if (!seen.has(pairKey)) {
            seen.add(pairKey);
            // Remove reverse pairs
            if (pair[0] == sortedPair[1]) {
                removed.push(pair);
            }
        }
    });
    //console.log(seen)
    return seen;
}

traitPairs = removeDuplicatePairs(traitPairs);

//Randomize traits shown
traitPairs = shuffleArray(Array.from(traitPairs))
traitPairs = traitPairs.map(item => item.split(','));
//Set to array conversion

for(var i = 0; i <traitPairs.length; i = i+1){

    // Create a task for the current trait pair
    console.log(traitPairs[i][0], traitPairs[i][1])
    var [simTask] = createSimTask(traitPairs[i][0], traitPairs[i][1]);
    // Add tasks to the timeline
    timeline.push(simTask);

}

//END OF EXPERIMENT CONTENT

//Adds demographics survey to timeline
import { pushDemographicSurvey } from '../demographics.js'
pushDemographicSurvey(timeline);

//Run
jsPsych.run(timeline);