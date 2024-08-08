var jsPsych = initJsPsych();

const config = {
    //The name of the experiment, which will show in the welcome message
    experimentName: "Your Study Name Here",

    //The instructions to be shown before the experiment begins
    learningInstructions: "You will be shown a series of images paired with a text description. Press next once you have viewed each image for a time.",

    imageList: ['trustworthy1.png','untrustworthy1.png'],

    //List of trustworthy images used (should be in images folder)
    trustImageList: ['trustworthy1.png'],

    untrustImageList: ['untrustworthy1.png'],

    //List of text strings corresponding to each image
    trustTextList: ['Trustworthy'],

    untrustTextList: ['Untrustworthy'],

    //Function to pair images with text and generate stimuli
    pairingFunction: function () {
        let pairings = [];
        for (let image of this.trustImageList) {
            let random = jsPsych.randomization.randomInt(1, 10);
            let pairing;
            if(random<9) {
                pairing = {
                    image: image,
                    text: jsPsych.randomization.sampleWithReplacement(this.untrustTextList, 1)[0]
                }
            }
            else {
                pairing = {
                    image: image,
                    text: jsPsych.randomization.sampleWithReplacement(this.trustTextList, 1)[0]
                }
            }
            pairings.push(pairing);
        }
        for (let image of this.untrustImageList) {
            let random = jsPsych.randomization.randomInt(1, 10);
            let pairing;
            if(random<9) {
                pairing = {
                    image: image,
                    text: jsPsych.randomization.sampleWithReplacement(this.trustTextList, 1)[0]
                }
            }
            else {
                pairing = {
                    image: image,
                    text: jsPsych.randomization.sampleWithReplacement(this.untrustTextList, 1)[0]
                }
            }
            pairings.push(pairing);
        }

        console.log(pairings)
        let stimuli = pairings.map(function (item) {
            let stim = { stimulus: `<img src="images/${item.image}" style="${config.imageCSS}"><br><${config.textTag} style="${config.textCSS}">${item.text}</${config.textTag}>` };
            return stim;
            
        })

        console.log(stimuli)

        return stimuli;
    },

    //HTML tag to use for text display
    textTag: "h1",

    //CSS for image display
    imageCSS: "",

    //CSS for text display
    textCSS: "font-size: 40px",


    //Semantic Decision Task config

    //The instructions to be shown before the experiment begins
    semanticInstructions: "You will be shown a series of words. After each word is shown, you will be asked to categorize the words with a key press.",

    image_key: "NO_KEYS", //prime image does not need responsettggtggfft
    prime_duration: 200, //how long the prime will be shown
    left_category_key: 'e',
    right_category_key: 'i',
    response_ends_trial: true,
}

export default config;