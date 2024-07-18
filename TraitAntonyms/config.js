const config = {
    //The name of the experiment, which will show in the welcome message
    experimentName: "Antonyms",

    //The instructions to be shown before the experiment begins
    instructions: "Thank you for your participation. In this study, you will be shown a word. Your task is to type the word that has the most opposite meaning to the given word.\n" +
        "        Please only type a single word. Do not type multiple words.",

    //Can customize the following values
    require_movement: true,

    min: 1,
    max: 7,
    step: 1,
    slider_start: 4,
    labels: ["1", "2", "3", "4", "5", "6", "7"],
}

export default config;