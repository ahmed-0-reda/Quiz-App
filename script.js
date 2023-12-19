let choosenQuiz,
  currentIndex = 0,
  correctAnswer = 0,
  wrongAnswer = 0,
  countDownInterval;

let nameInput = document.querySelector(".user-name input");

let submitBtn = document.querySelector(".send button"),
  qArea = document.querySelector(".quistions .title"),
  ansArea = document.querySelector(".answers-area"),
  quistionNum = document.querySelector(".quistion-num");

// startSound();
createQ();
clickEvent();
startGame();
nightAndDay();
PlayAgain();

// function startSound() {
//   let sound = document.querySelector(".start-sound");
//   setTimeout(() => {
//     sound.play();
//   }, 3000);
// }

function createQ() {
  let quizsName = ["عن الرسول", "عن الصحابه", "اساله عامه"];
  let quizsFiles = ["Quiz_one.json", "Quiz_two.json", "Quiz_three.json"];
  let qLength = quizsFiles.length;
  let boxDiv = document.querySelector(".logain-page .box");
  //

  for (let i = 0; i < qLength; i++) {
    let div = document.createElement("div");
    div.classList.add("quiz");

    let input = document.createElement("input");
    input.id = `quiz_${i}`;
    input.type = "radio";
    input.name = "quiz";
    input.dataset.quiz = quizsFiles[i];

    let markDiv = document.createElement("div");
    markDiv.classList.add("mark");

    let label = document.createElement("label");
    label.htmlFor = `quiz_${i}`;
    label.appendChild(document.createTextNode(quizsName[i]));

    boxDiv.appendChild(div);
    div.appendChild(input);
    div.appendChild(markDiv);
    div.appendChild(label);
  }
}

function clickEvent() {
  let quizBox = Array.from(document.querySelectorAll(".quiz"));
  let input = Array.from(document.querySelectorAll(".quiz input"));

  quizBox.forEach((box, boxIndx) => {
    input.forEach((inpt, inptIndx) => {
      if (boxIndx === inptIndx) {
        box.onclick = function () {
          inpt.checked = true;
          choosenQuiz = inpt.dataset.quiz;
        };
      }
    });
  });
}

function startGame() {
  let startBtn = document.querySelector(".start-game button"),
    pMsg1 = document.querySelector(".user-name p"),
    pMsg2 = document.querySelector(".choose-quize .box p"),
    logainPag = document.querySelector(".logain-page");

  startBtn.onclick = function () {
    if (nameInput.value === "") {
      pMsg1.classList.add("work");
    } else {
      pMsg1.classList.remove("work");

      nameInput = nameInput.value;
      if (choosenQuiz === undefined) {
        pMsg2.classList.add("work");
      } else {
        pMsg2.classList.remove("work");
        setTimeout(() => {
          logainPag.style.display = "none";
          getData(choosenQuiz);
        }, 500);
      }
    }
  };
}

function nightAndDay() {
  let pageStyle = document.querySelector(".page-stlye"),
    holder = document.querySelector(".page-stlye .holder"),
    mainPage = document.querySelector(".container"),
    navbar = document.querySelector("nav"),
    qAreaInfo = document.querySelector(".quistion-info"),
    qArea = document.querySelector(".quistions"),
    scoreArea = document.querySelector(".score-time"),
    logainPage = document.querySelector(".logain-page"),
    inputBox = document.querySelector(".input-box");

  holder.onclick = function () {
    pageStyle.classList.toggle("night");
    if (pageStyle.classList.contains("night") === false) {
      mainPage.classList.add("day");
      navbar.classList.add("day", "day-background");
      qAreaInfo.classList.add("day", "day-background");
      qArea.classList.add("day", "day-background");
      scoreArea.classList.add("day", "day-background");
      logainPage.classList.add("day", "day-background");
      inputBox.classList.add("day", "day-background");
    } else {
      mainPage.classList.remove("day");
      navbar.classList.remove("day", "day-background");
      qAreaInfo.classList.remove("day", "day-background");
      qArea.classList.remove("day", "day-background");
      scoreArea.classList.remove("day", "day-background");
      logainPage.classList.remove("day", "day-background");
      inputBox.classList.remove("day", "day-background");
    }
  };
}

// Main Function
function getData(choosenQuiz) {
  fetch(choosenQuiz)
    .then((res) => res.json())
    .then((myData) => {
      let dataArr = myData.sort(() => Math.random() - 0.5);

      let qCount = dataArr.length;
      quistionNum.innerHTML = qCount;

      createQuistions(dataArr[currentIndex], qCount);
      createBults(qCount);
      clickEventOnAns();

      countDown(10, qCount);

      submitBtn.onclick = function () {
        let rightAns = dataArr[currentIndex]["answer"];
        checkAnswer(rightAns);

        submitBtn.style.display = "none";
        currentIndex++;

        clearInterval(countDownInterval);
        countDown(10, qCount);

        setTimeout(() => {
          submitBtn.style.display = "block";
          qArea.innerHTML = "";
          ansArea.innerHTML = "";

          createQuistions(dataArr[currentIndex], qCount);
          clickEventOnAns();
        }, 1000);
        endGame(qCount);
      };
    });
}

function createQuistions(data, qCount) {
  let qArea = document.querySelector(".quistions .title");
  let ansArea = document.querySelector(".answers-area");

  if (currentIndex < qCount) {
    let title = document.createElement("p");
    title.classList.add("title");
    title.appendChild(document.createTextNode(data["quistion"]));
    qArea.appendChild(title);

    let answersArr = data["opt"];
    answersArr.push(data["answer"]);
    answersArr.sort(() => Math.random() - 0.5);

    for (let i = 0; i < answersArr.length; i++) {
      let div = document.createElement("div");
      div.classList.add("answer");

      let label = document.createElement("label");
      label.htmlFor = `answer_${i + 1}`;
      label.appendChild(document.createTextNode(answersArr[i]));

      let input = document.createElement("input");
      input.id = `answer_${i + 1}`;
      input.type = "radio";
      input.name = "answer";
      input.dataset.answer = answersArr[i];

      let mark = document.createElement("div");
      mark.classList.add("mark");

      div.appendChild(label);
      div.appendChild(input);
      div.appendChild(mark);

      ansArea.appendChild(div);
    }
  }
}

function checkAnswer(rightAns) {
  let opt = Array.from(
    document.querySelectorAll(".answers-area .answer input")
  );
  let choosenAns;

  for (let i = 0; i < opt.length; i++) {
    if (opt[i].checked) {
      choosenAns = opt[i].dataset.answer;
    }
  }

  if (rightAns === choosenAns) {
    correctAnswer++;
    document.querySelector(".right-ans-sound").play();
  } else {
    wrongAnswer++;
    document.querySelector(".wrong-ans-sound").play();
  }

  handelBulets(choosenAns, rightAns);
  showRightAns(rightAns);
}

function createBults(qCount) {
  let scoreDiv = document.querySelector(".score");
  for (let i = 0; i < qCount; i++) {
    let span = document.createElement("span");
    scoreDiv.appendChild(span);
  }
}

function handelBulets(choosenAns, rightAns) {
  let bults = Array.from(document.querySelectorAll(".score span"));
  bults.forEach((blt, bltIndex) => {
    if (bltIndex === currentIndex) {
      if (choosenAns === rightAns) {
        blt.classList.add("correct");
      } else {
        blt.classList.add("wrong");
      }
    }
  });
}

function clickEventOnAns() {
  let answers = Array.from(document.querySelectorAll(".answers-area .answer"));
  let input = Array.from(
    document.querySelectorAll(".answers-area .answer input")
  );

  answers.forEach((ans, ansIndex) => {
    input.forEach((inpt, inptIndex) => {
      if (ansIndex === inptIndex) {
        ans.onclick = function () {
          inpt.checked = true;
        };
      }
    });
  });
}

function showRightAns(rightAns) {
  let answers = Array.from(
    document.querySelectorAll(".answers-area .answer label")
  );
  answers.filter((ans) => {
    if (ans.innerHTML === rightAns) {
      ans.parentElement.style.background = "#005d3c";
    } else {
      ans.parentElement.style.background = "#8e00006e";
    }
  });
}

function countDown(duration, qCount) {
  let time = document.querySelector(".quistion .time-left");

  let minuts, seconds;

  countDownInterval = setInterval(() => {
    if (currentIndex < qCount) {
      minuts = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minuts = minuts < 10 ? `0${minuts}` : minuts;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      time.innerHTML = `${minuts}:${seconds}`;

      if (--duration <= 0) {
        clearInterval(countDownInterval);
        submitBtn.click();
      }
    }
  }, 1000);
}

function endGame(qCount) {
  if (currentIndex === qCount) {
    startSound();
    let qArea = document.querySelector(".quistion");
    qArea.innerHTML = "";
    submitBtn.style.display = "none";

    let endDiv = document.querySelector(".end");
    endDiv.classList.add("show");

    let pText = document.querySelector(".end .text");

    let pName = document.querySelector(".end .name");

    pName.innerHTML = nameInput;

    let good = `Good JoB You Got ${correctAnswer} From ${qCount}`;
    let bad = `Amm ...! Your Islamic information is not good  You Got .. ${correctAnswer} From ${qCount}`;

    if (correctAnswer >= qCount / 2) {
      pText.appendChild(document.createTextNode(good));
    } else {
      pText.appendChild(document.createTextNode(bad));
    }
  }
}

function PlayAgain() {
  let btn = document.querySelector(".end button");
  btn.onclick = function () {
    window.location.reload();
  };
}
