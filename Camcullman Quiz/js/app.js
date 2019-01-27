// State object
var state = {
  

  // The variable created above refers to the state - i.e. which question the user is on. The 5 questions are below. Text outlines the question itself. Choice outlines the options to choose form for an answer. 
  //Correct choice index shows which answer is correct (minus 1, since 0 = the first option)

  questions: [
    {
      text: "What does it mean to shred the gnar?",
      choices: ["It means to eat a lot", "shred paper", "ski/board in an extreme fashion", "take a nap"],
      correctChoiceIndex: 2
    },
    {
      text: "Before going off a jump, what are you most likely to tell you fellow ski buddies",
      choices: ["I'm gunna send it", "I can't stop thinking about work", "What's the weather tomorrow?", "Can we go home?"],
      correctChoiceIndex: 0
    },
    {
      text: "How many skis are there in a pair of skis?",
      choices: ["1", "2", "3", "4"],
      correctChoiceIndex: 1,
    },
    {
      text: "What might a skier call video of sweet moves",
      choices: ["tape", "flipboard", "footy", "snap"],
      correctChoiceIndex: 2,
    },
    {
      text: "A less than gnarly dude could be called a...",
      choices: ["Shredder", "Awesome guy", "Stud", "Gaper"],
      correctChoiceIndex: 3,
    },
    {
      text: "What's the best way to get down the mountain?",
      choices: ["Fast", "Very fast", "Super fast", "not last so the round isn't on you"],
      correctChoiceIndex: 3,
    }
  ],
  
  //Here we've listed potential correct responses (chosen at random) to tell the user when they got an answer right
  correctResponses : [
    "Oh yeah! You could say you cleared the landing there",
    "Nice air! You've got some moves",
    "You're low key skilled, huh?",
  ],

    //Here we've listed potential incorrect responses (chosen at random) to tell the user when they got an answer wrong
  incorrectAnswers: [
    "You ate it...",
    "Yard sale... No bueno.",
    "Oooof - wipeout."
  ],
  
  //Sets the starting state of the quiz. These states will be updated as the quiz progress and user the user takes action by undergoing events. 
  
  //starting score
  score: 0,
  
  //Question starts at (0=first question)
  currentQuestionIndex: 0,
  
  //specifies starting point (of start quiz from the first page)
  route: 'start',
  

  // determines if 'ast answer was true or false - doesn't matter which you put to start with
  lastAnswerCorrect: true,
  

  feedbackRandom: 0
};

// State modification functions




//creates our "set the route" function with 2 arguments: state and route
function setRoute(state, route) {
  state.route = route;
};

// Function to restart the game (offered at the end of the game) by bringing us back to the homepage
function resetGame(state) {
  state.score = 0;
  state.currentQuestionIndex = 0;
  setRoute(state, 'start');
};

// Creates the answer question function with arguments of state and answer. 
function answerQuestion(state, answer) {
  //Determines the variable of which question is currently being looked at
  var currentQuestion = state.questions[state.currentQuestionIndex];
  //Determines if the chosen answer is correct
  state.lastAnswerCorrect = currentQuestion.correctChoiceIndex === answer;
  
  //outlines ithat if the correct answer is chosen, the score incriments 1 (shows how many questions you've gotten correct)
  if (state.lastAnswerCorrect) {
    state.score++;
  }
  
  //Determines moving onto the answer feedback page
  selectFeedback(state);
  setRoute(state, 'answer-feedback');
};

// Determines the feedback state (right or wrong) to give (using random answers from the correct set)
function selectFeedback(state) {
  state.feedbackRandom = Math.random();
};

//Function outlines advancing the state to move forwards. 
//Outlines that if you've gone through all the questions (current question = total number of questions) then final feedback is given.
//Otherwise, you move onto the next question. 
function advance(state) {
  state.currentQuestionIndex++;
  if (state.currentQuestionIndex === state.questions.length) {
    setRoute(state, 'final-feedback');
  }
  else {
    setRoute(state, 'question');
  }
};



// Render functions


//This function outlines which stage of the quiz to render depending on the arguments of state and elements (start page, question page, answer feedback page, or final feedback page)
function renderApp(state, elements) {


  // default to hiding all routes, then show (render) the current route pending state and route using if/else conditions
  Object.keys(elements).forEach(function(route) {
    elements[route].hide();
  });
  elements[state.route].show();

  //if the state is the start page, show start page
  if (state.route === 'start') {
      renderStartPage(state, elements[state.route]);
  }
  
  //if at question state, show the question
  else if (state.route === 'question') {
      renderQuestionPage(state, elements[state.route]);
  }
  
  //If at feedback state, show feedback page
  else if (state.route === 'answer-feedback') {
    renderAnswerFeedbackPage(state, elements[state.route]);
  }
  
  // if at final feedback state, show final feedback
  else if (state.route === 'final-feedback') {
    renderFinalFeedbackPage(state, elements[state.route]);
  }
};

//This function renders the correct question page by determining the question count, the text (question itself) and choices (potential answers)
//we see that we look at the 
function renderQuestionPage(state, element) {
  renderQuestionCount(state, element.find('.question-count'));
  renderQuestionText(state, element.find('.question-text'));
  renderChoices(state, element.find('.choices'));
};

//This function renders the correct answer feedback page by determining the header (right or wrong), text (additional comments) and button (move on or see how you did in final feedback page)
function renderAnswerFeedbackPage(state, element) {
  renderAnswerFeedbackHeader(state, element.find(".feedback-header"));
  renderAnswerFeedbackText(state, element.find(".feedback-text"));
  renderNextButtonText(state, element.find(".see-next"));
};

//This function renders the final feedback page
function renderFinalFeedbackPage(state, element) {
  renderFinalFeedbackText(state, element.find('.results-text'));
};

//This function renders the question count by showing which question the user is currently on, then the "/" sign, the the total length of questions 
function renderQuestionCount(state, element) {
  var text = (state.currentQuestionIndex + 1) + "/" + state.questions.length;
  element.text(text);
};

//This function renders the correct question text asked based on the state of which question the user is on
function renderQuestionText(state, element) {
  var currentQuestion = state.questions[state.currentQuestionIndex];
  element.text(currentQuestion.text);
};

//This function renders the proper choices given based on the state of which question the user is on
//It also shows how the choices are laid out in a list & that an answer is 
function renderChoices(state, element) {
  //The variable of the current question is determined by the state of the question index that incriments by 1 (which question user is on)
  var currentQuestion = state.questions[state.currentQuestionIndex];
  
  //This variable of choices outlines the possible answers to the question. The function returns the possible answers as list items.  
  var choices = currentQuestion.choices.map(function(choice, index) {
    return (
      '<div>' +
        //Input type radio refers to the button type that the user can click on to fill in to select. 
        //The advantage of radio buttons in this context is only one of them can be selected - so the user can only choose one answer. 
        '<input type="radio" name="user-answer" value="' + index + '" required>' +
        '<label>' + choice + '</label>' +
      '</div>'
    );
  });
  //This final line refers to the proper choices to be rendered in HTML based on the above
  element.html(choices);
};

//This function determines the header of the feedback (which outlines whether the answer was correct or wrong)
//The functions arguments are state and element - meaning the HTML rendered refelcts whether the user's last pick was right or wrong
function renderAnswerFeedbackHeader(state, element) {
  var html = state.lastAnswerCorrect ?
      "<h1 class='user-was-correct'>Correctomundo!</h1>" :
      "<h1 class='user-was-incorrect'>Oh, that wasn't right...</>";
  element.html(html);
};

//This function determines the feedback state - aka the line of text that goes below the "right" or "wrong" line- all based on whether the last answer was right or wrong.
function renderAnswerFeedbackText(state, element) {
  var choices = state.lastAnswerCorrect ? state.correctResponses : state.incorrectAnswers;
  //Determines that the text feedback given is randomly selected from the options stated in "correct answers" vs "incorrect answers"
  var text = choices[Math.floor(state.feedbackRandom * choices.length)];
  element.text(text);
};

//This button states that when the current question index equals the number of questions total in the quiz
//i.e. that when you're on the last question, that the button that renders communicates to the user they can click it to see their final results. 
function renderNextButtonText(state, element) {
    var text = state.currentQuestionIndex < state.questions.length - 1 ?
      "Next" : "Show me how I did!";
  element.text(text);
};

//This finction renders the final feedback text - which tells the user how many questions they got right
//This is accomplished by placing the incrimented state of the score between strings explaining how the user did
function renderFinalFeedbackText(state, element) {
  var text = "You totally nailed " + state.score + " outa " +
    state.questions.length + " questions.";
  element.text(text);
};

// Event handlers section



//Outlines the page elements as the 4 potential pages the user can see: the start page, the question page, the question feedback page, and the final feedback page. 
//Questions on first and last sections here

var PAGE_ELEMENTS = {
  'start': $('.start-page'),
  'question': $('.question-page'),
  'answer-feedback': $('.answer-feedback-page'),
  'final-feedback': $('.final-feedback-page')
};

//This event handler says the app listens for the submit event to occur on the start game button
//Then when the event occurs the call back function occurs (callback functions are in the render fuction section above)
//We use .submit to bind the event handler to the submit event (clicking the submit button)
$("form[name='game-start']").submit(function(event) {
  //We use prevent default here because when the user tries to submit a form in HTML, the default behavior is to submit the form to a server. In this case we don't want this, so we use prevent default.
  event.preventDefault();
  //This line binds the submit event to the setroute function first outlined on line 80 (and used in many spots in the render functions)
  setRoute(state, 'question');
  //binds the submit event to the renderApp function first outlined on line 132
  renderApp(state, PAGE_ELEMENTS);
});

//This event handler states that when the event of the restart game button being clicked occurs, the game restarts. 
//We use .click to bind the event handler to the click event
$(".restart-game").click(function(event){
  //We use prevent default here because when the user tries to submit a form in HTML, the default behavior is to submit the form to a server. In this case we don't want this, so we use prevent default.
  event.preventDefault();
  //This line states to bind to the reset game state function noted on line 85- which puts state score at 0, question index at 0, and brings the user to the start page
  resetGame(state);
  //binds the click event to the renderApp function on line 132
  renderApp(state, PAGE_ELEMENTS);
});

//This section outlines listening to the submit button event and the functions bound to it that are followed when the event occurs
$("form[name='current-question']").submit(function(event) {
  //We use prevent default here because when the user tries to submit a form in HTML, the default behavior is to submit the form to a server. In this case we don't want this, so we use prevent default.
  event.preventDefault();
  // THe below outlines all the functions this event (when user submits answer) is bound to 
  var answer = $("input[name='user-answer']:checked").val();
  answer = parseInt(answer, 10);
  answerQuestion(state, answer);
  renderApp(state, PAGE_ELEMENTS);
});

//The below outlines the functions bound to the "see next" button that occur after the event of the button being clicked occurs
$(".see-next").click(function(event) {
  advance(state);
  renderApp(state, PAGE_ELEMENTS);
});


$(function() { renderApp(state, PAGE_ELEMENTS); });
