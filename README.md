# Introduction
Welcome! [jsPsych](https://www.jspsych.org/7.3/) is a great tool for conducting online (and in person) experiments. More and more psychologists have begun using it - it’s almost at 1k stars on GitHub! Implementing it on our server is also super straightforward and easy to use (and already set up). 

Our lab’s current way of running online experiments is very outdated (Jon hired a software engineer to set it up around 2012). Some scripts don’t run anymore, certain links are broken, and there is no documentation - making it hard to fix bugs/issues and customize parameters. Not to mention, you can’t use ChatGPT/Copilot 😅. 

When writing these scripts, please make sure they are **well-commented and easily customizable**. **Try not to hard code any parameters/settings** - make sure things are easily changeable. Here are some concrete examples of what I mean: 

- **Example 1**: when setting the image height/wide, make this changeable at the top of the script. 
- **Example 2**: when rating images, make it loop through a list/array of images/image_names - don’t make it so you have to call an image every time. 
- **Example 3**: When you say “this experiment takes {XXX} minutes to complete” in the instructions page, make sure that XXX is a variable at the top of your script

This is so folks who join the lab and are not as technologically inclined as you have an easier time setting up their own scripts 😀. 

As with any good psychology experiment, randomization is a must. Make sure there is an easy way to randomize your experiments, whether that be through jsPsych or creating a function that randomizes an array of image names. 

There are many great ready-to-go scripts and examples available [online](https://github.com/jspsych/jsPsych/tree/main/examples). Feel free to use them - there is no need to start everything from scratch! 


# Getting Started
1. Go through the jsPsych [tutorials](https://www.jspsych.org/7.3/tutorials/hello-world/). 
2. Indicate on **Slack which project you are working** on! We don’t want 2 people working on the same thing, and there is lots to choose from!
3. To start a script, use this function: 
```javascript
var sub_id = Math.random().toString().substr(2, 6); // generate random 6 digit number

var jsPsych = initJsPsych({
      show_progress_bar: true,
      on_finish: function () {
        console.log("End of experiment");
        jsPsych.data.get(localSave("csv", "sub-" + sub_id + "_data.csv"));
      },
    });
```
3. Include brief **Instructions, Consent, and Demographics** in all scripts! 
   1. maybe create own js script and call it? 
4. Name each trial with an intuitive name. For data saving later
   1. E.g: don't call a raiting trial simply 'Task'
5. Additinoal scripts to preprocess/clean/analyze the data would be great but not necessary at the moment :)... just something to think about!
6. Once done, push scripts to the github page!

# Projects
Ordered roughly by difficulty

## Survey: Demographics

## Survey: Instructions

## Survey: MRS, SPS, NFCS, RES, FT
Simple surveys, if interested in working on them let me know and I'll show you what the questions for them are! We have them implemented on Qualtrics, but not everyone has access to Qualtrics. 

## Survey: Consent Page
See example on Github

Importantly, we need the script to exit/quit if the user answers the political party **attention_check** question wrong. 




