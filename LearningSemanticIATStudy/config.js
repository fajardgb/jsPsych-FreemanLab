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
            let stim = { stimulus: `<${config.textTag} style="${config.textCSS}">Your Top Text Here</${config.textTag}><img src="images/${item.image}" style="${config.imageCSS}"><${config.textTag} style="${config.textCSS}">${item.text}</${config.textTag}>` };
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

    //Keys for SDT and IAT
    left_category_key: 'e',
    right_category_key: 'i',




    //Semantic Decision Task config
    //The instructions to be shown before the experiment begins
    semanticInstructions: "You will be shown a series of words. After each word is shown, you will be asked to categorize the words with a key press.",
    image_key: "NO_KEYS", //prime image does not need responsettggtggfft
    prime_duration: 200, //how long the prime will be shown
    response_ends_trial: true,


    //IAT config
    //The instructions to be shown before the experiment begins
    iatInstructions: '<p>You will use the "e" and "i" computer keys ' + 'to categorize items into groups as fast as you can. ' +
        'These are the four groups and the items that belong to each:<br><br>' +
        '<strong>Good</strong>:<br>' + 'Enjoy, Smiling, Glorious, Beautiful, Fantastic, ' +
        'Friend, Cheer, Joyous<br><br>' + '<strong>Bad</strong>:<br>' + 'Awful, ' +
        'Bothersome, Pain, Nasty, Hurtful, Rotten, Evil, Annoy<br><br>' +
        '<strong>African Americans</strong>:<br>' + "<img src='images/black/b1.png'></img>  " +
        "<img src='images/black/b2.png'></img>  " + "<img src='images/black/b3.png'></img>  " +
        "<img src='images/black/b4.png'></img>  " + "<img src='images/black/b5.png'></img>  " +
        "<img src='images/black/b6.png'></img><br><br>" + '<strong>European Americans</strong>:<br>' +
        "<img src='images/white/w1.png'></img>  " + "<img src='images/white/w2.png'></img>  " +
        "<img src='images/white/w3.png'></img>  " + "<img src='images/white/w4.png'></img>  " +
        "<img src='images/white/w5.png'></img>  " + "<img src='images/white/w6.png'></img><br><br>" +
        "There are seven parts. The instructions change for each part. Pay attention!<br><br>" +
        "</p>",

    //Can customize these variables for jsPsych IAT HTML or image instance
    html_when_wrong: '<span style="color: red; font-size: 80px">X</span>',
    bottom_instructions: '<p>If you press the wrong key, a red X will appear. Press the other key to continue</p>',
    force_correct_key_press: true,
    display_feedback: true,
    trial_duration: 3000,
    response_ends_trial: true,
}

export default config;