const config = {
    //The name of the experiment, which will show in the welcome message
    experimentName: "Video Experiment",

    //The instructions to be shown before the experiment begins
    instructions: "You will be shown a series of videos. Please rate each one.",

    //The instructions to be shown below each video
    videoInstructions: "Rate this video using the slider.",

    //Videos to be displayed (place them in the videos folder)
    videoList: ['video1.mp4', 'video2.mp4'],

    //Should the video autoplay? (true = autoplay, false = need to press play)
    autoplay: true,

    //What rate should the video play (ex: 1.5 = 1.5x speed)
    rate: 1,

    //Video height in pixels (null = use original height)
    videoHeight: null,

    //Video width in pixels (null = use original width)
    videoWidth: null,

    //Should the videos be shown in a random order? (true = random, false = not random)
    randomize: true,

    //Labels displayed at equidistant locations along the slider
    sliderLabels: ['0', '50', '100'],

    //Minimum value of the slider
    minSlider: 0,

    //Maximum value of the slider
    maxSlider: 100,
}

export default config;