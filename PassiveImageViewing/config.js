const config = {
    //The name of the experiment, which will show in the welcome message
    experimentName: "Passive Image Viewing",

    //The instructions to be shown before the experiment begins
    instructions: "You will be shown a series of images. Press 1 if an image repeats twice in a row.",

    //List of images used (should be in images folder)
    imageList: ['test1.png', 'test2.png'],

    //Number of probe tasks where image is shown twice in a row
    numProbeTasks: 1,
}

export default config;