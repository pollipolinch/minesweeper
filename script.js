let body = document.body;
window.addEventListener("load", reload());
function reload() {
  body.innerHTML = `
    <h4 class="title">Minesweeper</h4>
    <div class="container">
    <div>Кликов: <span id='clicks'></span></div>
    <div class="time">Время: <span id='timer'></span></div>
    </div>
    <div class="container">
    <div class="game-field"></div>
    </div>
    <div class="container">
    </div>
    <div class="container">
    <div>Осталось бомб: <span id='boom-left'></span></div>
    </div>
    <div class="container">
    <div class="reboot"></div>
    </div>
    <div class="tablo" id="result">
    </div>
 
      `;
  game();
}
function game() {
  const field = document.querySelector(".game-field");
  const flagsLeft = document.querySelector("#flags-left");
  const boomLeft = document.querySelector("#boom-left");
  const result = document.querySelector("#result");
  const clicks = document.querySelector("#clicks");
  const timer = document.querySelector("#timer");
  let time = 0;
  timer.textContent = time;
  let clickAmount = 0;
  clicks.innerHTML = clickAmount;
  let width = 10;
  let boomAmount = 10;
  let flagsAmount = 10;
  let flags = 0;
  let booms = 0;
  let squares = [];
  let isGameOver = false;
  let interval;

  function createLayout() {
    boomLeft.innerHTML = boomAmount;
    const boomsArray = Array(boomAmount).fill("boom");
    const emptyArray = Array(width * width - boomAmount).fill("but");
    const gameArray = emptyArray.concat(boomsArray);
    const mixedАrray = gameArray.sort(() => Math.random() - 0.5);

    for (let i = 0; i < width * width; i++) {
      const button = document.createElement("div");
      button.setAttribute("id", i);
      button.classList.add(mixedАrray[i]);
      field.appendChild(button);
      squares.push(button);

      button.addEventListener("click", function (e) {
        if (
          !button.classList.contains("active") &&
          !button.classList.contains("boom") &&
          !button.classList.contains("flag")
        ) {
          clickAmount++;
          if (clickAmount == 1) {
            interval = setInterval(() => {
              time = time + 1;
              timer.textContent = time;
            }, 1000);
          }
          clicks.textContent = clickAmount;
        }
        click(button);
        checkForWin();
      });
      button.oncontextmenu = function (e) {
        e.preventDefault();
        addFlag(button);
      };
    }
    for (let i = 0; i < squares.length; i++) {
      let total = 0;
      const isLeftEdge = i % width === 0;
      const isRightEdge = i % width === width - 1;
      if (squares[i].classList.contains("but")) {
        if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("boom"))
          total++;
        if (
          i > 9 &&
          !isRightEdge &&
          squares[i + 1 - width].classList.contains("boom")
        )
          total++;
        if (i > 9 && squares[i - width].classList.contains("boom")) total++;
        if (
          i > 10 &&
          !isLeftEdge &&
          squares[i - 1 - width].classList.contains("boom")
        )
          total++;
        if (i < 99 && !isRightEdge && squares[i + 1].classList.contains("boom"))
          total++;
        if (
          i < 90 &&
          !isLeftEdge &&
          squares[i - 1 + width].classList.contains("boom")
        )
          total++;
        if (
          i < 89 &&
          !isRightEdge &&
          squares[i + 1 + width].classList.contains("boom")
        )
          total++;
        if (i < 90 && squares[i + width].classList.contains("boom")) total++;
        squares[i].setAttribute("data", total);
      }
    }
  }
  createLayout();
  function addFlag(button) {
    if (isGameOver) return;
    if (!button.classList.contains("active")) {
      if (!button.classList.contains("flag")) {
        button.classList.add("flag");
        button.innerHTML = "🚩";
        flags++;
        boomLeft.innerHTML = boomAmount - flags;
        checkForWin();
      } else if (button.classList.contains("flag")) {
        button.classList.remove("flag");
        button.innerHTML = "";
        flags--;
        boomLeft.innerHTML = boomAmount - flags;
      } else if (!button.classList.contains("flag")) {
        button.classList.add("flag");
        button.innerHTML = "🚩";
        flags++;
        checkForWin();
      } else {
        button.classList.remove("flag");
        button.innerHTML = "";
        flags--;
      }
    }
  }
  function click(button) {
    let actualId = button.id;
    if (isGameOver) return;
    if (
      button.classList.contains("active") ||
      button.classList.contains("flag")
    )
      return;
    if (button.classList.contains("boom")) {
      gameOver(button);
    } else {
      let total = button.getAttribute("data");
      if (total != 0) {
        button.classList.add("active");
        if (total == 1) button.classList.add("btn-one");
        if (total == 2) button.classList.add("btn-two");
        if (total == 3) button.classList.add("btn-three");
        if (total == 4) button.classList.add("btn-four");
        button.innerHTML = total;
        return;
      }
      checkButton(button, actualId);
    }
    button.classList.add("active");
  }

  function checkButton(button, actualId) {
    const isLeftEdge = actualId % width === 0;
    const isRightEdge = actualId % width === width - 1;

    setTimeout(() => {
      if (actualId > 0 && !isLeftEdge) {
        const newId = squares[parseInt(actualId) - 1].id;
        const newButton = document.getElementById(newId);
        click(newButton);
      }
      if (actualId > 9 && !isRightEdge) {
        const newId = squares[parseInt(actualId) + 1 - width].id;
        const newButton = document.getElementById(newId);
        click(newButton);
      }
      if (actualId > 10) {
        const newId = squares[parseInt(actualId - width)].id;
        const newButton = document.getElementById(newId);
        click(newButton);
      }
      if (actualId > 11 && !isLeftEdge) {
        const newId = squares[parseInt(actualId) - 1 - width].id;
        const newButton = document.getElementById(newId);
        click(newButton);
      }
      if (actualId < 99 && !isRightEdge) {
        const newId = squares[parseInt(actualId) + 1].id;
        const newButton = document.getElementById(newId);
        click(newButton);
      }
      if (actualId < 90 && !isLeftEdge) {
        const newId = squares[parseInt(actualId) - 1 + width].id;
        const newButton = document.getElementById(newId);
        click(newButton);
      }
      if (actualId < 88 && !isRightEdge) {
        const newId = squares[parseInt(actualId) + 1 + width].id;
        const newButton = document.getElementById(newId);
        click(newButton);
      }
      if (actualId < 89) {
        const newId = squares[parseInt(actualId) + width].id;
        const newButton = document.getElementById(newId);
        click(newButton);
      }
    }, 10);
  }
  function gameOver(button) {
    result.classList.add("active");
    result.innerHTML = "GAME OVER. TRY AGAIN";
    isGameOver = true;
    clearInterval(interval);
    squares.forEach((button) => {
      if (button.classList.contains("boom")) {
        button.innerHTML = "💣";
        button.classList.remove("boom");
        button.classList.add("active");
      }
    });
  }
  function checkForWin() {
    let matches = 0;
    let val = 0;
    for (let i = 0; i < squares.length; i++) {
      if (
        squares[i].classList.contains("flag") &&
        squares[i].classList.contains("boom")
      ) {
        matches++;
        if (matches == 10) {
          result.classList.add("active");
          result.innerHTML = "YOU WIN!";
          isGameOver = true;
          clearInterval(interval);
        }
      }
      if (
        squares[i].classList.contains("but") &&
        squares[i].classList.contains("active")
      ) {
        val++;
        console.log(val);
        if (val == 90) {
          result.classList.add("active");
          result.innerHTML = "YOU WIN!";
          isGameOver = true;
          clearInterval(interval);
        }
      }
    }
  }
  let reboot = document.querySelector(".reboot");
  reboot.addEventListener("click", function (e) {
    reload();
  });
}
