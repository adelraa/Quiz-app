let countSpan = document.querySelector(".count span");

let bulletsSpanContainer = document.querySelector(".bullets .spans");
let bullets = document.querySelector(".bullets");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButtom = document.querySelector(".submit-button");
let results = document.querySelector(".results");
let currentIndex = 0;
let rightAnswers = 0;
let countdowninterval = 0;
let countDownElement = document.querySelector(".countdown");

function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionObject = JSON.parse(this.responseText);
      let qCount = questionObject.length;
  
      //set questioncount
      createBullets(qCount);

      // to add question data
      addQuestionData(questionObject[currentIndex], qCount);

      countDown(5, qCount);

      submitButtom.onclick = () => {
        //get the right anwer
        let theRightAnswer = questionObject[currentIndex]["right_answer"];
        currentIndex++;
        checkAnswer(theRightAnswer, qCount);

        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        addQuestionData(questionObject[currentIndex], qCount);

        handleClassesBullets();
        clearInterval(countdowninterval);
        countDown(5, qCount);
        showResults(qCount);
      };
    }
  };

  myRequest.open("Get", "question.json", true);
  myRequest.send();
}
getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;

  //create span
  for (let i = 0; i < num; i++) {
    let Bullet = document.createElement("span");
    if (i === 0) {
      Bullet.className = "on";
    }
    bulletsSpanContainer.appendChild(Bullet);
  }
}

function addQuestionData(obj, count) {
  // create the question tilte
  if (currentIndex < count) {
    let questionTitle = document.createElement("h2");
    let questionText = document.createTextNode(obj["title"]);
    questionTitle.appendChild(questionText);
    quizArea.appendChild(questionTitle);
    //create the answers
    for (let i = 1; i <= 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";

      let radioInput = document.createElement("input");
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];
      // make the first answer checked by defalult
      if (i === 1) {
        radioInput.checked = "true";
      }
      // create label
      let theLabel = document.createElement("label");
      theLabel.htmlFor = `answer_${i}`;
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);
      theLabel.appendChild(theLabelText);
      // append input and lable in div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);
      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");

  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
    if (rAnswer === theChoosenAnswer) {
      rightAnswers++;
    }
  }
}

function handleClassesBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResults;

  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButtom.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class ="good">Good</span> , ${rightAnswers} from ${count} Is Good.`;
    } else if (rightAnswers === count) {
      theResults = `<span class ="perfect">Perfect</span> , ${rightAnswers} from ${count} Is Perfect.`;
    } else {
      theResults = `<span class ="bad">Bad</span> , ${rightAnswers} from ${count} Is Bad.`;
    }

    results.innerHTML = theResults;
  }
}

function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdowninterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minute;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      countDownElement.innerHTML = `${minutes} : ${seconds}`;
      if (--duration < 0) {
        clearInterval(countdowninterval);
        submitButtom.click();
      }
    }, 1000);
  }
}
