const musicContainer = document.getElementById("music-container");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const audio = document.getElementById("audio");
const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progress-container");
const title = document.getElementById("title");
const cover = document.getElementById("cover");
const currTime = document.querySelector("#currTime");
const durTime = document.querySelector("#durTime");

const songs = [
  "El problema-Моргенштерн",
  "Унесенные ветрами - Rauf&Faik",
  "Inside-The Limba",
];

//keep track of song
let songIndex = 1;

//Initially load song details into dom
loadSong(songs[songIndex]);

//Update song details
function loadSong(song) {
  title.innerText = song;
  audio.src = `music/${song}.mp3`;
  cover.src = `images/${song}.jpg`;
}
let paused = false;
//Change body Color
function changeBodyColor() {
  const bodyEl = document.body;
  const color = window.getComputedStyle(bodyEl).backgroundImage;
  let rgba1 = color
    .slice(color.indexOf("a(") + 2, color.indexOf(") 10") - 5)
    .split(", ");
  let rgba2 = color
    .slice(color.indexOf("%, rgba(") + 8, color.indexOf(") 80") - 5)
    .split(", ");
  let [red1, green1, blue1, red2, green2, blue2] = [...rgba1, ...rgba2];
  let colors = [red1, green1, blue1, red2, green2, blue2];
  let colorNames = ["red1", "green1", "blue1", "red2", "green2", "blue2"];
  // debugger;

  let colorObj = {};
  for (let i = 0; i < 3; i++) {
    colorObj[colorNames[i]] = {
      colorValue: colors[i],
      direction: "up",
    };
  }
  for (let i = 3; i < 6; i++) {
    colorObj[colorNames[i]] = {
      colorValue: colors[i],
      direction: "down",
    };
  }

  function f() {
    for (let bodyColor in colorObj) {
      let direction = colorObj[bodyColor].direction;
      let curColorValue = parseInt(colorObj[bodyColor].colorValue);
      let rand = Math.round(Math.random() * 10);
      if (direction == "up") {
        curColorValue = curColorValue + rand;
      } else if (direction == "down") {
        curColorValue = curColorValue - rand;
      } else {
        console.log("error" + bodyColor);
      }

      if (+curColorValue >= 255) {
        direction = "down";
        curColorValue = 255 - (curColorValue % 255);
      } else if (+curColorValue <= 0) {
        direction = "up";
        curColorValue = -curColorValue;
      }
      colorObj[bodyColor].colorValue = curColorValue;
      colorObj[bodyColor].direction = direction;
    }
    bodyEl.style.backgroundImage = `linear-gradient(0deg, rgba(${colorObj.red1.colorValue}, ${colorObj.green1.colorValue}, ${colorObj.blue1.colorValue}, 0.7) 30%, rgba(${colorObj.red2.colorValue}, ${colorObj.green2.colorValue}, ${colorObj.blue2.colorValue}, 0.7))`;
  }
  timerId = setInterval(() => {
    if (paused) {
      return;
    }
    f();
  }, 100);
}

//linear-gradient(0deg, rgba(231, 220, 67, 0.5) 10%, rgba(150, 70, 121, 0.5) 80%)

//Play song
function playSong() {
  musicContainer.classList.add("play");
  playBtn.querySelector("i.fas").classList.remove("fa-play");
  playBtn.querySelector("i.fas").classList.add("fa-pause");
  changeBodyColor();
  audio.play();
  paused = false;
}

//Pause song
function pauseSong() {
  musicContainer.classList.remove("play");
  playBtn.querySelector("i.fas").classList.add("fa-play");
  playBtn.querySelector("i.fas").classList.remove("fa-pause");
  audio.pause();
  paused = true;
}

//Prev song
function prevSong() {
  songIndex--;
  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }
  loadSong(songs[songIndex]);
  playSong();
}

//Next song
function nextSong() {
  songIndex++;
  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }
  loadSong(songs[songIndex]);
  playSong();
}
//Update progress
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = ((currentTime / duration) * 100).toFixed(2);
  progress.style.width = `${progressPercent}%`;
}

//Set progress
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
}

//get duration & currentTime for Time of song
function DurTime(e) {
  const { duration, currentTime } = e.srcElement;
  var sec;
  var sec_d;

  // define minutes currentTime
  let min = currentTime == null ? 0 : Math.floor(currentTime / 60);
  min = min < 10 ? "0" + min : min;

  // define seconds currentTime
  function get_sec(x) {
    if (Math.floor(x) >= 60) {
      for (var i = 1; i <= 60; i++) {
        if (Math.floor(x) >= 60 * i && Math.floor(x) < 60 * (i + 1)) {
          sec = Math.floor(x) - 60 * i;
          sec = sec < 10 ? "0" + sec : sec;
        }
      }
    } else {
      sec = Math.floor(x);
      sec = sec < 10 ? "0" + sec : sec;
    }
  }

  get_sec(currentTime, sec);

  // change currentTime DOM
  currTime.innerHTML = min + ":" + sec;

  // define minutes duration
  let min_d = isNaN(duration) === true ? "0" : Math.floor(duration / 60);
  min_d = min_d < 10 ? "0" + min_d : min_d;

  function get_sec_d(x) {
    if (Math.floor(x) >= 60) {
      for (var i = 1; i <= 60; i++) {
        if (Math.floor(x) >= 60 * i && Math.floor(x) < 60 * (i + 1)) {
          sec_d = Math.floor(x) - 60 * i;
          sec_d = sec_d < 10 ? "0" + sec_d : sec_d;
        }
      }
    } else {
      sec_d = isNaN(duration) === true ? "0" : Math.floor(x);
      sec_d = sec_d < 10 ? "0" + sec_d : sec_d;
    }
  }

  // define seconds duration

  get_sec_d(duration);

  // change duration DOM
  durTime.innerHTML = min_d + ":" + sec_d;
}

//Event listaners
playBtn.addEventListener("click", () => {
  const isPlaying = musicContainer.classList.contains("play");
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

//change song
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);

//time song update
audio.addEventListener("timeupdate", updateProgress);

//click on progress bar
progressContainer.addEventListener("click", setProgress);

//audio ends
audio.addEventListener("ended", nextSong);

// Time of song
audio.addEventListener("timeupdate", DurTime);
