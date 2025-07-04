var jsPsych;

var welcome = {
    // type: jsPsychHtmlKeyboardResponse,
    type: jsPsychHtmlButtonResponse,
};

// screener questions
var questions = {
    type: jsPsychSurvey,
    data: {trial_name: 'consent'},
    pages: [
        [
            {
                //Capture prolific ID manually
                type: "text",
                prompt: "Please enter your Prolific ID accurately.",
            },
            {
                //Screener task english - need more screeners... check demoSurvey
                type: "multi-choice",
                prompt: "Are you fluent in English?",
                name: "Eng",
                options: ["Yes", "No"],
                required: true,
                horizontal: true,
            },
            {
                type: "multi-choice",
                prompt: 'Please read the following instructions: Recent research on decision making has shown that choices are affected by political party affiliation. To help us understand how people from different backgrounds make decisions, we are interested in information about you. Specifically, we want to know if you actually read any of the instructions we give at the beginning of our survey; if not, some results may not tell us very much about decision making and perception in the real world. To show that you have read the instructions, please ignore the questions about political party affiliation below and simply select "Other" at the bottom. For which political party do you typically vote?',
                options: [
                    "Democratic",
                    "Republican",
                    "Independent",
                    "Libertarian",
                    "Green Party",
                    "Other",
                ],
                name: "attention_check",
            },
        ]
    ],
    button_label_finish: 'Continue',
    on_finish: function(data) {
        //Ends experiment early if failed english or attention check
        if(data.response.Eng == "No" || data.response.attention_check != "Other") {
            jsPsych.endExperiment();
        }
    }
};



//function to add tasks to timeline
export function pushConsentForm(jsPsychInstance, timeline, name) {
    welcome.stimulus = "Welcome to " + name + ". Press the 'Consent' button to continue.";
    // ADD your consent form here!
    welcome.choices = ['Consent']
    timeline.push(welcome, questions);
    jsPsych = jsPsychInstance;
};
