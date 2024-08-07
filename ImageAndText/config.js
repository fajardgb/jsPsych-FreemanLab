var jsPsych = initJsPsych();

const config = {
    //The name of the experiment, which will show in the welcome message
    experimentName: "Image And Text Viewing",

    //The instructions to be shown before the experiment begins
    instructions: "You will be shown a series of images. Press 1 if an image repeats twice in a row.",

    scannerPageInstructions: "Waiting for scanner. Press 5 to continue",

    //List of images used (should be in images folder)
    imageList: ['test1.png','test2.png'],

    textList: ['Test 1', 'Test 2'],

    //Number of probe tasks where image is shown twice in a row
    numProbeTasks: 1,

    //Key to pass waiting for scanner page
    waitingForScannerKey: "5",

    //Duration of ISIs
    blankDuration: function(){
        return jsPsych.randomization.sampleWithReplacement([2000,4000,6000], 1, [4,2,1])[0];
    },

    //Duration for images to be shown
    imageDuration: 2000,

    //Key(s) to record during ISIs
    blankKey: "1",

    //Key(s) to record when images are shown
    imageKey: "1",
}

export default config;