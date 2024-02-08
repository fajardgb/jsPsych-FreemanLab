//get demo info
//free resp: age
//mult choice: religion, gender, hispanic, race, sexOrientation, education
var taskAge = {
    type: jsPsychSurveyText,
    questions: [{ prompt: "What is your age?", name: "age" }],
};

//race demo question
var TaskDemoRace = {
    type: jsPsychSurveyMultiChoice,
    questions: [
        {
            prompt: "With which race/ethnicity do you most identify?",
            name: "race",
            options: [
                "American Indian or Alaska Native",
                "Asian",
                "Black or African-American",
                "Native Hawaiian or Other Pacific Islander",
                "White",
                "Other",
            ],
            required: true,
        },
    ],
};

//demo questions
var taskDemo = {
    type: jsPsychSurveyMultiChoice,
    questions: [
        {
            prompt: "Do you consider yourself to be Hispanic or Latino?",
            name: "hispanic",
            options: [
                "Hispanic or Latino",
                "Not Hispanic or Latino",
                "I do not wish to provide this information",
            ],
            required: true,
        },
        {
            prompt: "With which gender do you most identify?",
            name: "gender",
            options: [
                "Male",
                "Female",
                "Not otherwise specified",
                "I do not with to provide this information",
            ],
            required: true,
        },
        {
            prompt: "With which sexual orientation do you most identify?",
            name: "sexOrientation",
            options: [
                "Heterosexual or straight",
                "Gay or lesbian",
                "Bisexual",
                "Not otherwise specified",
                "I do not with to provide this information",
            ],
            required: true,
        },
        {
            prompt: "What is the highest level of school that you completed?",
            name: "education",
            options: [
                "No schooling completed",
                "Some Highschool",
                "Highschool",
                "GED",
                "Some College",
                "Associates degree",
                "Bachelor's degree",
                "Master's degree",
                "Professional degree",
                "Doctorate degree",
            ],
            required: true,
        },
    ]
};

//function to add tasks to timeline
export function pushDemographicSurvey(timeline) {
    timeline.push(taskAge, TaskDemoRace, taskDemo);
}