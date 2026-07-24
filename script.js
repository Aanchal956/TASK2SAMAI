/* ============================
   Quiz Application - Script
   ============================ */

// ---- Quiz Data (realistic general knowledge questions) ----
const quizData = [
  {
    question: "What is the capital of India?",
    options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"],
    correctIndex: 1,
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Jupiter", "Mars", "Saturn"],
    correctIndex: 2,
  },
  {
    question: "Who developed the theory of relativity?",
    options: ["Isaac Newton", "Albert Einstein", "Nikola Tesla", "Galileo Galilei"],
    correctIndex: 1,
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctIndex: 3,
  },
  {
    question: "Which language is primarily used for styling web pages?",
    options: ["HTML", "CSS", "Python", "SQL"],
    correctIndex: 1,
  },
  {
    question: "In which year did India gain independence?",
    options: ["1945", "1947", "1950", "1952"],
    correctIndex: 1,
  },
  {
    question: "What is the chemical symbol for Gold?",
    options: ["Gd", "Go", "Au", "Ag"],
    correctIndex: 2,
  },
  {
    question: "Which is the smallest prime number?",
    options: ["0", "1", "2", "3"],
    correctIndex: 2,
  },
  {
    question: "Who wrote the Indian National Anthem?",
    options: ["Bankim Chandra Chatterjee", "Rabindranath Tagore", "Sarojini Naidu", "Subhas Chandra Bose"],
    correctIndex: 1,
  },
  {
    question: "Which data structure works on the LIFO principle?",
    options: ["Queue", "Array", "Stack", "Linked List"],
    correctIndex: 2,
  },
];

const TIME_PER_QUESTION = 15; // seconds

// ---- State ----
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = []; // stores selected option index (or null if unanswered) per question
let timeLeft = TIME_PER_QUESTION;
let timerInterval = null;

// ---- DOM References ----
const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");

const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");

const questionCounter = document.getElementById("questionCounter");
const timerEl = document.getElementById("timer");
const progressFill = document.getElementById("progressFill");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");

const finalScoreEl = document.getElementById("finalScore");
const scoreMessageEl = document.getElementById("scoreMessage");
const reviewList = document.getElementById("reviewList");

// ---- Event Listeners ----
startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", goToNextQuestion);
restartBtn.addEventListener("click", restartQuiz);

// ---- Start Quiz ----
function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  userAnswers = new Array(quizData.length).fill(null);

  startScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");

  loadQuestion();
}

// ---- Load a Question ----
function loadQuestion() {
  const currentQuestion = quizData[currentQuestionIndex];

  // Update header
  questionCounter.textContent = `Question ${currentQuestionIndex + 1} / ${quizData.length}`;
  progressFill.style.width = `${((currentQuestionIndex + 1) / quizData.length) * 100}%`;

  // Update question text
  questionText.textContent = currentQuestion.question;

  // Build options
  optionsContainer.innerHTML = "";
  currentQuestion.options.forEach((optionText, index) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = optionText;
    btn.addEventListener("click", () => selectOption(index));
    optionsContainer.appendChild(btn);
  });

  nextBtn.disabled = true;
  nextBtn.textContent =
    currentQuestionIndex === quizData.length - 1 ? "Submit Quiz" : "Next Question";

  startTimer();
}

// ---- Handle Option Selection ----
function selectOption(selectedIndex) {
  // Prevent changing answer after selection
  if (userAnswers[currentQuestionIndex] !== null) return;

  userAnswers[currentQuestionIndex] = selectedIndex;
  stopTimer();
  highlightAnswer(selectedIndex);
  nextBtn.disabled = false;
}

// ---- Highlight Correct / Incorrect Options ----
function highlightAnswer(selectedIndex) {
  const currentQuestion = quizData[currentQuestionIndex];
  const optionButtons = optionsContainer.querySelectorAll(".option-btn");

  optionButtons.forEach((btn, index) => {
    btn.disabled = true;

    if (index === currentQuestion.correctIndex) {
      btn.classList.add("correct");
    } else if (index === selectedIndex && selectedIndex !== currentQuestion.correctIndex) {
      btn.classList.add("incorrect");
    }
  });

  if (selectedIndex === currentQuestion.correctIndex) {
    score++;
  }
}

// ---- Timer Logic ----
function startTimer() {
  timeLeft = TIME_PER_QUESTION;
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      stopTimer();
      handleTimeUp();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function updateTimerDisplay() {
  timerEl.textContent = `${timeLeft}s`;
  timerEl.classList.toggle("warning", timeLeft <= 5);
}

// ---- Handle Time Running Out (auto-move, marks as unanswered) ----
function handleTimeUp() {
  if (userAnswers[currentQuestionIndex] === null) {
    // No answer selected — show correct answer, count as wrong
    const currentQuestion = quizData[currentQuestionIndex];
    const optionButtons = optionsContainer.querySelectorAll(".option-btn");

    optionButtons.forEach((btn, index) => {
      btn.disabled = true;
      if (index === currentQuestion.correctIndex) {
        btn.classList.add("correct");
      }
    });
  }
  nextBtn.disabled = false;
}

// ---- Move to Next Question or Show Results ----
function goToNextQuestion() {
  stopTimer();
  currentQuestionIndex++;

  if (currentQuestionIndex < quizData.length) {
    loadQuestion();
  } else {
    showResults();
  }
}

// ---- Show Final Results ----
function showResults() {
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  finalScoreEl.textContent = score;
  scoreMessageEl.textContent = getScoreMessage(score);

  buildReviewList();
}

function getScoreMessage(finalScore) {
  const percentage = (finalScore / quizData.length) * 100;

  if (percentage === 100) return "Perfect score! Excellent work.";
  if (percentage >= 70) return "Great job! You know your stuff.";
  if (percentage >= 40) return "Not bad — a little more practice will help.";
  return "Keep learning — try again to improve your score.";
}

// ---- Build Answer Review Section ----
function buildReviewList() {
  reviewList.innerHTML = "";

  quizData.forEach((q, index) => {
    const userAnswerIndex = userAnswers[index];
    const isCorrect = userAnswerIndex === q.correctIndex;

    const item = document.createElement("div");
    item.className = `review-item ${isCorrect ? "correct-answer" : "wrong-answer"}`;

    const questionEl = document.createElement("div");
    questionEl.className = "review-question";
    questionEl.textContent = `${index + 1}. ${q.question}`;

    const answerEl = document.createElement("div");
    answerEl.className = "review-answer";

    const userAnswerText =
      userAnswerIndex !== null ? q.options[userAnswerIndex] : "Not answered";
    const correctAnswerText = q.options[q.correctIndex];

    answerEl.textContent = isCorrect
      ? `Your answer: ${userAnswerText} (Correct)`
      : `Your answer: ${userAnswerText} | Correct answer: ${correctAnswerText}`;

    item.appendChild(questionEl);
    item.appendChild(answerEl);
    reviewList.appendChild(item);
  });
}

// ---- Restart Quiz ----
function restartQuiz() {
  resultScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
}
