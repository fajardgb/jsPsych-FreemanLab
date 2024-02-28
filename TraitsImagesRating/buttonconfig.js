const config = {
    //The name of the experiment, which will show in the welcome message
    experimentName: "Rating Images",

    //The instructions to be shown before the experiment begins
    instructions: "You will be shown a series of images along with a trait. Please rate each image on the basis of each trait.",

    //Labels displayed at equidistant locations along the slider
    //Customizability: to add more numbers to the slider, add more numbers as strings
    sliderLabels: ['1', '2', '3', '4', '5', '6', '7'],

    randomize: true,
    
    imageList: ['test1.png', 'test2.png'], //Change to be whatever images you want to rate
}

export default config;