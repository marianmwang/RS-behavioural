/**
 * @title RS-behavioural
 * @description rule follower shift during exception learning
 * @version 0.1.0
 *
 * @assets assets/cat_stims/flower_stim_0.125/
 */

// You can import stylesheets (.scss or .css).
import "../styles/main.scss";

import FullscreenPlugin from "@jspsych/plugin-fullscreen";
import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";
import PreloadPlugin from "@jspsych/plugin-preload";
import CategorizeImagePlugin from "@jspsych/plugin-categorize-image";
import SurveyMultipleChoicePlugin from "@jspsych/plugin-survey-multi-choice";

import { initJsPsych } from "jspsych";

/**
 * This function will be executed by jsPsych Builder and is expected to run the jsPsych experiment
 *
 * @type {import("jspsych-builder").RunFunction}
 */
export async function run({
  assetPaths,
  input = {},
  environment,
  title,
  version,
}) {
  const jsPsych = initJsPsych();

  const timeline = [];

  // Preload assets
  var preload = {
    type: PreloadPlugin,
    images: assetPaths.images,
  };
  console.log(assetPaths.images);

  // Welcome screen
  var welcome = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: "<p>Welcome to the experiment. Press any key to begin.</p>",
  };

  // Switch to fullscreen
  var configureScreen = {
    type: FullscreenPlugin,
    fullscreen_mode: true,
  };

  var configureScreenEnd = {
    type: FullscreenPlugin,
    fullscreen_mode: false,
  };

  /* define instructions trial */
  var instructions = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
      <p>You will be quizzed on these instructions, so please read carefully! </p>
      <p>In this experiment, you will learn to categorize
      images of flowers.</p><p>If you think the flower grows best in
      sun, press the letter f on the keyboard.</p>
      <p>If you think the flower grows best in shade, press the letter j.</p>
      <p>Please respond as quickly and as accurately as possible. </p>
      <p>Note that this experiment has two parts, spaced two weeks apart.
      <b>You must complete both to receive full credit.</b> </p>
      <p>You will be given the opportunity to take breaks throughout
      the experiment. </p>
      </div>
      <p>Press any key to proceed to the instructions quiz.</p>
  `,
    post_trial_gap: 500,
  };

  /* instructions quiz questions */
  var page_1_options = ["q and p", "f and j", "a and b"];
  var page_2_options = ["Animals", "Geometric Designs", "Flowers"];
  var page_3_options = ["True", "False"];

  /* instructions quiz */
  var multi_choice_block = {
    type: SurveyMultipleChoicePlugin,
    preamble: `
          <p> Please respond to the following questions about this task. 
          If you respond incorrectly, you will be given a second chance to
          review the instructions. </p>
        `,
    questions: [
      {
        prompt: "Which keys will you use to respond?",
        name: "KeyQuestion",
        options: page_1_options,
        required: true,
      },
      {
        prompt: "What are you learning to categorize?",
        name: "FlowerQuestion",
        options: page_2_options,
        required: true,
      },
      {
        prompt: "True or False: this experiment has two parts.",
        name: "TwoPartsQuestion",
        options: page_3_options,
        required: true,
      },
    ],
    data: {
      task: "instrQuiz",
    },
  };

  var warning = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: ` 
              <p>One or more of your answers were incorrect.</p> 
              <p>Please press any key to return to the instructions.</p>
              <p>Please read carefully!</p>`,
  };

  var warning2 = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: ` 
              <p>One or more of your answers were incorrect.</p> 
              <p>Please review these instructions one more time.</p>
              <p>In this experiment, you will learn to categorize
              images of flowers.</p><p>If you think the flower grows best in
              sun, press the letter f on the keyboard.</p>
              <p>If you think the flower grows best in shade, press the letter j.</p>
              <p>Please respond as quickly and as accurately as possible. </p>
              <p>Note that this experiment has two parts, spaced two weeks apart.
              <b>You must complete both to receive full credit.</b> </p>
              <p>You will be given the opportunity to take breaks throughout
              the experiment. </p>
              </div>
              <p>Press any key to proceed to the experiment.</p>
          `,
  };

  var checkQuiz2 = {
    timeline: [warning2],
    conditional_function: function () {
      console.log(reps);
      var isCorrect = jsPsych.data.get().filter({ task: "instrQuiz" });
      var A1 = isCorrect.values()[1]["response"]["KeyQuestion"] == "f and j";
      var A2 = isCorrect.values()[1]["response"]["FlowerQuestion"] == "Flowers";
      var A3 = isCorrect.values()[1]["response"]["TwoPartsQuestion"] == "True";
      var allCorr = A1 && A2 && A3;
      reps++;
      return !allCorr; // Alternate timeline if not all answers correct
    },
  };

  var reps = 0;
  var checkQuiz = {
    timeline: [warning, instructions, multi_choice_block, checkQuiz2],
    conditional_function: function () {
      var isCorrect = jsPsych.data.get().filter({ task: "instrQuiz" });
      var A1 = isCorrect.values()[0]["response"]["KeyQuestion"] == "f and j";
      var A2 = isCorrect.values()[0]["response"]["FlowerQuestion"] == "Flowers";
      var A3 = isCorrect.values()[0]["response"]["TwoPartsQuestion"] == "True";
      var allCorr = A1 && A2 && A3;
      reps++;
      return !allCorr; // Alternate timeline if not all answers correct
    },
  };

  var begin = {
    type: HtmlKeyboardResponsePlugin,
    choices: ["j"],
    stimulus: `
              <p>Thank you for reading the instructions! 
              You are now ready to start the experiment </p>
              <p>Place your index fingers on the 'f' and 'j' keys, 
              and press 'j' to begin </p>`,
    post_trial_gap: 500,
  };
  /* test trials for first learning block*/
  var test_stimuli_lb1 = [
    {
      stimulus: "assets/cat_stims/flower_stim_0.125/flower1_c1r1s1.png",
      correct_response: "f",
      category: "sun",
    },
    {
      stimulus: "assets/cat_stims/flower_stim_0.125/flower1_c1r1s1.png",
      correct_response: "f",
      category: "sun",
    },
  ];

  /* test trials for first learning block*/
  var test_stimuli_lb2 = [
    {
      stimulus: "assets/cat_stims/flower_stim_0.125/flower1_c1r1s1.png",
      correct_response: "f",
      category: "sun",
    },
    {
      stimulus: "assets/cat_stims/flower_stim_0.125/flower1_c1r1s1.png",
      correct_response: "f",
      category: "sun",
    },
  ];

  var test_stimuli_lb3 = [
    {
      stimulus: "flower1_c1r1s1.png",
      correct_response: "f",
      category: "sun",
    },
    {
      stimulus: "flower1_c1r1s1.png",
      correct_response: "f",
      category: "sun",
    },
  ];

  var test_stimuli_nf = [
    {
      stimulus: "flower1_c1r1s1.png",
      correct_response: "f",
      category: "sun",
    },
    {
      stimulus: "flower1_c1r1s1.png",
      correct_response: "f",
      category: "sun",
    },
  ];

  /* This shows focus crosshairs*/
  var fixation = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: '<div style="font-size:60px;">+</div>',
    choices: "NO_KEYS",
    trial_duration: 500, // I think this makes it just always 2s?
    data: {
      task: "fixation",
    },
  };

  var noResp; // to store whether participant responded.

  var categorization_trial = {
    type: CategorizeImagePlugin,
    stimulus: jsPsych.timelineVariable("stimulus"),
    key_answer: jsPsych.timelineVariable("correct_response"),
    text_answer: jsPsych.timelineVariable("category"),
    choices: ["f", "j"],
    correct_text:
      "<p class='prompt';><span style='color:#006600'>Correct</span>, this flower prefers %ANS%.</p>",
    incorrect_text:
      "<p class='prompt'><span style='color:#990000'>Incorrect</span>, this flower prefers %ANS%.</p>",
    prompt: "<p>Press f for sun. Press j for shade.</p>",
    data: {
      task: "response",
      correct_response: jsPsych.timelineVariable("correct_response"),
    },
    on_finish: function (data) {
      data.correct = jsPsych.pluginAPI.compareKeys(
        data.response,
        data.correct_response
      );
      if (data.response == null) {
        noResp = true;
      } else {
        noResp = false;
      }
    },
    show_feedback_on_timeout: false,
    trial_duration: 2000,
  };

  var categorization_trial_nf = {
    type: CategorizeImagePlugin,
    stimulus: jsPsych.timelineVariable("stimulus"),
    key_answer: jsPsych.timelineVariable("correct_response"),
    text_answer: jsPsych.timelineVariable("category"),
    choices: ["f", "j"],
    correct_text: "",
    incorrect_text: "",
    prompt: "<p>Press f for sun. Press j for shade.</p>",
    data: {
      task: "response",
      correct_response: jsPsych.timelineVariable("correct_response"),
    },
    on_finish: function (data) {
      data.correct = jsPsych.pluginAPI.compareKeys(
        data.response,
        data.correct_response
      );
      if (data.response == null) {
        noResp = true;
      } else {
        noResp = false;
      }
    },
    show_feedback_on_timeout: false,
    trial_duration: 2000,
    feedback_duration: 0,
  };

  var respondFaster = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: 'Please press "h" to continue.',
    choices: ["h"],
  };

  var checkPause = {
    timeline: [respondFaster],
    conditional_function: function () {
      return noResp; // Alternate timeline if not all answers correct
    },
  };

  var test_procedure_lb1 = {
    timeline: [fixation, categorization_trial, checkPause],
    timeline_variables: test_stimuli_lb1,
    repetitions: 1,
    randomize_order: false,
  };

  var test_procedure_lb2 = {
    timeline: [fixation, categorization_trial, checkPause],
    timeline_variables: test_stimuli_lb2,
    repetitions: 1,
    randomize_order: false,
  };

  var test_procedure_lb3 = {
    timeline: [fixation, categorization_trial, checkPause],
    timeline_variables: test_stimuli_lb3,
    repetitions: 1,
    randomize_order: false,
  };

  var test_procedure_nf = {
    timeline: [fixation, categorization_trial_nf, checkPause],
    timeline_variables: test_stimuli_nf,
    repetitions: 1,
    randomize_order: false,
  };

  var takeBreak = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: `<p>You have reached the end of this block</p>
                <p>Please take a moment's rest and press "h" when you
                are ready to proceed</p>`,
    choices: ["h"],
  };

  var takeBreakNF = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: `<p>You have reached the end of this block</p>
              <p>In the next series of trials, you will not receive any feedback.</p>
              <p>Again, please try to respond as quickly and as accurately as possible.</p>
              <p>Please take a moment's rest and press "h" when you
              are ready to proceed</p>`,
    choices: ["h"],
  };

  /* define debrief */
  var debrief_block = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: function () {
      var trials = jsPsych.data.get().filter({ task: "response" });
      var correct_trials = trials.filter({ correct: true });
      var accuracy = Math.round(
        (correct_trials.count() / trials.count()) * 100
      );

      return `<p>You responded correctly on ${accuracy}% of the trials.</p>
          <p>Congratulations, you have qualified for the performance bonus!</p>
          <p><b>Note that this is the first part of a two-part study</b></p>
          <p>You must complete Part 2 to receive payment for participation</p>
          <p><b>We will send you an invitation to complete Part 2 within two weeks</b></p>
          <p>Press any key to complete the experiment. Thank you!</p>`;
    },
  };

  /* define timeline of experiment */
  timeline.push(
    preload,
    configureScreen,
    welcome,
    instructions,
    multi_choice_block,
    checkQuiz,
    begin,
    test_procedure_lb1,
    takeBreak,
    test_procedure_lb2,
    takeBreak,
    test_procedure_lb3,
    takeBreakNF,
    test_procedure_nf,
    configureScreenEnd,
    debrief_block
  );

  await jsPsych.run(timeline);

  // Return the jsPsych instance so jsPsych Builder can access the experiment results (remove this
  // if you handle results yourself, be it here or in `on_finish()`)
  return jsPsych;
}
