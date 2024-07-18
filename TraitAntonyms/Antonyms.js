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

//preload stimuli
var pictureArray = traitArray.map(function (trait) {
    return "pictures/" + trait + ".png";
});
var preload = {
    type: jsPsychPreload,
    images: pictureArray,
};
timeline.push(preload);


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Generate a random index from 0 to i

        // Swap array[i] and array[j]
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

traitArray = shuffleArray(traitArray); //randomize order of traits
function createTraitTask(trait) {
    //img directory for trait stimuli (scale)
    var img =
        '<img src="pictures/' + trait + '.png" style="width:800px;"></img>';

    //free response task - provide the antonym
    var taskAntonym = {
        type: jsPsychSurveyText,
        preamble: img,
        data: { trait: trait },
        questions: [
            {
                prompt:
                    "If you were asked to rate someone's personality on the following 1-7 scale, with 7 being <strong>" +
                    trait +
                    "</strong>, what trait word best represents the opposite of being <strong>" +
                    trait +
                    "</strong> that you'd expect to see on the opposite side of the scale? It can only be a SINGLE word.",
            },
        ],
    };

    //rate confidence in antonym task
    var taskRate = {
        type: jsPsychHtmlSliderResponse,
        stimulus: function () {
            var lastTrialData = jsPsych.data.getLastTrialData();
            var previousResponse = lastTrialData.values()[0].response.Q0;
            return (
                '<div style="width:500px;"> <p>How strongly do you feel that <strong>' +
                previousResponse +
                "</strong> is a good fit for the opposite side of the <strong>" +
                trait +
                "</strong> scale?</p></div>"
            );
        },
        require_movement: config.require_movement,
        data: { trait: trait },
        min: config.min,
        max: config.max,
        step: config.step,
        slider_start: config.slider_start,
        labels: config.labels,
    };

    //return both tasks
    return [taskAntonym, taskRate];
}

// Loop through the traitArray and create tasks for each trait
for (var i = 0; i < traitArray.length; i++) {
    var trait = traitArray[i];

    // Create a task for the current trait
    var [antonymTask, rateTask] = createTraitTask(trait);

    // Add tasks to the timeline
    timeline.push(antonymTask);
    timeline.push(rateTask);
}

//END OF EXPERIMENT CONTENT

//Adds demographics survey to timeline
import { pushDemographicSurvey } from '../demographics.js'
pushDemographicSurvey(timeline);

//Run
jsPsych.run(timeline);