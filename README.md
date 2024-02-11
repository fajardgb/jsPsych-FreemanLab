# Introduction
Welcome! [jsPsych](https://www.jspsych.org/7.3/) is a great tool for conducting online (and in person) experiments. More and more psychologists have begun using it - it’s almost at 1k stars on GitHub! Implementing it on our server is also super straightforward and easy to use (and already set up). 

Our lab’s current way of running online experiments is very outdated (Jon hired a software engineer to set it up around 2012). Some scripts don’t run anymore, certain links are broken, and there is no documentation - making it hard to fix bugs/issues and customize parameters. Not to mention, you can’t use ChatGPT/Copilot 😅. 

When writing these scripts, please make sure they are **well-commented and easily customizable** (ideally via a config file). **Try not to hard code any parameters/settings** - make sure things are easily changeable. Here are some concrete examples of what I mean: 

- **Example 1**: when setting the image height/wide, make this changeable in the config file. 
- **Example 2**: when rating images, make it loop through a list/array of images/image_names - don’t make it so you have to call an image every time. 
- **Example 3**: When you say “this experiment takes {XXX} minutes to complete” in the instructions page, make sure that XXX is a variable in config.

This is so folks who join the lab and are not as technologically inclined as you have an easier time setting up their own experiments 😀. 

As with any good psychology experiment, randomization is a must. Make sure there is an easy way to randomize your experiments, whether that be through jsPsych or creating a function that randomizes an array of image names. 

There are many great ready-to-go scripts and examples available [online](https://github.com/jspsych/jsPsych/tree/main/examples). Feel free to use them - there is no need to start everything from scratch! 

# Getting Started
1. Go through the jsPsych [tutorials](https://www.jspsych.org/7.3/tutorials/hello-world/). Use **option** 2 (I want to be able to do some customization, but have a simple setup; Download and host jsPsych)
3. Indicate on **Slack which project you are working** on! We don’t want 2 people working on the same thing, and there is lots to choose from!
4. To start a script, clone this repo, then **make a copy of the SampleExperiment folder**. See the [template](#template) section below for more details.
4. Name each trial with an intuitive name (for data saving later)
   1. E.g: don't call a rating trial simply 'Task1'.
5. If you are working on a script that requires images/word_vectors, you can use your own images/words lists, and loop over them for the experiments. 
   1. upload sample images to GitHub?
6. Additional scripts to preprocess/clean/analyze the data would be great but not necessary at the moment :)... just something to think about!
7. Push your folder to the github repo!

# Template
[SampleExperiment](https://github.com/fajardgb/jsPsych-FreemanLab/tree/main/SampleExperiment) serves as a template experiment that does the following:
- Shows the consent form at the beginning (imported from [consent.js](https://github.com/fajardgb/jsPsych-FreemanLab/blob/main/consent.js))
- Shows the demographics survey at the end (imported from [demographics.js](https://github.com/fajardgb/jsPsych-FreemanLab/blob/main/demographics.js))
- Imports variables from a config file
- Saves data as a csv at the end with a random subject ID

You can **make a copy** of the SampleExperiment folder to start your own script! Simply code your trials as normal in the **main.js** file between the `//EXPERIMENT CONTENT GOES HERE` and `//END OF EXPERIMENT CONTENT` comments. You can add any variable to the config file like so:
```javascript
const config = {
      //Comment explaining what the variable does
      exampleVariable: "Something", //don't forget the comma!

      //You can make any variable, not just text!
      numberVariable: 3,
}
```

The config file is already imported into the main file, so you can use those variables in main.js by doing `config.variableName`. Here is an example:
```javascript
var task = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: config.instructions //this uses the variable from config
}
```

# Online vs. Local (+ fMRI)
Need to add instructions on how to make things online (way we are doing it rn) versus hosting the experiments locally (for fMRI sessions)

I think the only thing needed to change is how files are saved - have to make sure they are saved locally. 

Also, for fMRI, need to add 'waiting for scanner' page before each run, fixation, make text bigger, anything else?

# Projects
Ordered roughly by difficulty

## Survey: Demographics
See [template](https://github.com/fajardgb/jsPsych-FreemanLab/blob/main/demographics.js)!

Things that need change: 
1. ~~Make this script be able to be integrated into the end of **ALL** scripts.~~

Completed!

## Survey: MRS, SPS, NFCS, RES, FT
Easy surveys - would be a good start. If interested in working on them let me know and I'll show you what the questions for them are! We have them implemented on Qualtrics, but not everyone has access to Qualtrics. 

![MRS](imgs/MRS.png)

## Survey: Consent Page
See [template](https://github.com/fajardgb/jsPsych-FreemanLab/blob/main/consent.js)!

Things that need change:
1. ~~Make things less hard-coded, more fluid~~
   1. ~~eg: change welcome to add variable for task_name to be defined above!~~
2. ~~Make all the questions show up on the same page~~
   1. ~~Not sure if this is possible? Since different types (eg; mult choice, free responses, etc)~~
3. ~~Make the script exit/quit if the user answers the political party **attention_check** question wrong~~
4. ~~Make the script exit/quit if the user is **not fluent in English.**~~
5. ~~Make this script be able to be integrated at the end of **ALL** scripts.~~

Completed!

## Rating Images: single trait at a time

Implement a script that shows an image, and asks to rate it on a specific trait with 
1. scale (button response)
2. slider

Customizability:
1. be able to easily change traits/words (dimensions you are rating images on)
2. loop over an array of image names for a single trait
3. loop over an array of traits/words for a single image
4. be able to change scale easily (eg: from 1-7 to 1-9)

## Rating Images: two traits at a time

Same as above, but asks particpants to rate an image on 2 traits at a time!

## Rating Images: N traits at a time

Same as above, but with N traits!

## FreeResponse Images/Words: one at a time
This one is already done, but could add more comments/customizability. 

See the [code](https://github.com/fajardgb/jsPsych-FreemanLab/tree/main/GF_antonyms)!

## FreeResponse Rate PairwiseSimilarity

May need this for IAC model project! 

See this [paper](https://www.pnas.org/doi/full/10.1073/pnas.1807222115?doi=10.1073/pnas.1807222115) for a description of the task. 

I implemented this already, see this [example](https://github.com/fajardgb/jsPsych-FreemanLab/tree/main/GF_pairwise_sim). This might already work, but needs to be fleshed out more. 

Needed: 
1. Need each target trait to be compared with each other trait. 

## Passive Viewing of Images (or 1-back)
Passively view images. Each image is shown for 2s, ISI of 2-6s (randomly sampled to start with). 

Needed: 
1. Add probe condition, for 1-back task, so some images are repeated twice in a row. If an image is repeated, the participant should press a button. 

## Mousetracking
Implement any mousetracking script!

## Implicit Association Test (IAT)
I made this one for a post-scan task, but it is embarassingly hard coded. See the [example](https://github.com/fajardgb/jsPsych-FreemanLab/tree/main/IAT). 

Needed: 
1. make things not hard-coded and more customizable



## Videos: Rate at end
Watch a video, rate it after it is over

## Videos: Rate halfway throug
Watch a video, be able to pause/rate it halfway thorugh.

## Videos: FreeResponse (halfway through at end also)
Watch a video, and make it be able to input a word halfway through the video

Make it be pausable? 

## Trust Game

[wikipedia](https://en.wikibooks.org/wiki/Bestiary_of_Behavioral_Economics/Trust_Game)

## Semantic Decision Task

Prime participant with an image, then ask them to respond (categorize) a word (eg: as good or bad)

![SDT](imgs/SDT.png)

## Who-Said-What task

3 phases: encoding, distractor, retrieval

Encoding:
- show face for 3s, 2-4s ISI, 7s face + sentence

Distractor: 
- show X dots on the screen, followed by a number. Respond if the number is less than or more than the number of dots shown prior. 

Retrieval:
- Show sentence, 2-4s ISI, 6s grid
- Make a red box around the grid - they can move it around left to right to make decision about WHO-SAID-WHAT




![WSW](imgs/WSW.png)





