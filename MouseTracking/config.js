const config = {
    //The name of the experiment, which will show in the welcome message
    experimentName: "Mouse Tracking",

    //The instructions to be shown before the experiment begins
    instructions: "You will be shown ???. Please ???.",

    //The text for the two buttons
    buttons: ["BLACK", "WHITE"],

    //Should the button order be randomized? (true = randomized)
    randomizeButtons: true,

    //List of stimuli images
    imageList: ['black/b1.png','black/b2.png','black/b3.png','black/b4.png','black/b5.png','black/b6.png','white/w1.png','white/w2.png','white/w3.png','white/w4.png','white/w5.png','white/w6.png'],

    //Stimuli image size (leave as null to use image's original size)
    imgWidth: null,
    imgHeight: null,

    //Bounding box size
    boxWidth: 800,
    boxHeight: 600,

    //Button and image positioning (pixels from center)
    buttonSideMargin: 200,
    buttonTopMargin: -200,
    imageTopMargin: 200,

    //Button and text size
    buttonWidth: 120,
    buttonHeight: 60,
    buttonTextSize: 20,

    //Minimum response time
    minRT: 200,

    //Maximum response time
    maxRT: 3000
}

export default config;