var welcome = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "Welcome to OUR-TASK-NAME-HERE! Press any key to continue.",
};

var questions = {
    type: jsPsychSurvey,
    pages: [
        [
            {
                //capture prolific ID manually
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
};

//function to add tasks to timeline
export function pushConsentForm(timeline) {
    timeline.push(welcome, questions);
}