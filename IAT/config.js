const config = {
    //The name of the experiment, which will show in the welcome message
    experimentName: "Implicit Association Test (IAT)",

    //The instructions to be shown before the experiment begins
    instructions: '<p>You will use the "e" and "i" computer keys ' + 'to categorize items into groups as fast as you can. ' +
        'These are the four groups and the items that belong to each:<br><br>' +
        '<strong>Good</strong>:<br>' + 'Enjoy, Smiling, Glorious, Beautiful, Fantastic, ' +
        'Friend, Cheer, Joyous<br><br>' + '<strong>Bad</strong>:<br>' + 'Awful, ' +
        'Bothersome, Pain, Nasty, Hurtful, Rotten, Evil, Annoy<br><br>' +
        '<strong>African Americans</strong>:<br>' + "<img src='img/black/b1.png'></img>  " +
        "<img src='img/black/b2.png'></img>  " + "<img src='img/black/b3.png'></img>  " +
        "<img src='img/black/b4.png'></img>  " + "<img src='img/black/b5.png'></img>  " +
        "<img src='img/black/b6.png'></img><br><br>" + '<strong>European Americans</strong>:<br>' +
        "<img src='img/white/w1.png'></img>  " + "<img src='img/white/w2.png'></img>  " +
        "<img src='img/white/w3.png'></img>  " + "<img src='img/white/w4.png'></img>  " +
        "<img src='img/white/w5.png'></img>  " + "<img src='img/white/w6.png'></img><br><br>" +
        "There are seven parts. The instructions change for each part. Pay attention!<br><br>" +
        "</p>",

    //Can customize these variables for jsPsych IAT HTML or image instance
    html_when_wrong: '<span style="color: red; font-size: 80px">X</span>',
    bottom_instructions: '<p>If you press the wrong key, a red X will appear. Press the other key to continue</p>',
    force_correct_key_press: true,
    display_feedback: true,
    trial_duration: 3000,
    left_category_key: 'e',
    right_category_key: 'i',
    response_ends_trial: true,

}

export default config;