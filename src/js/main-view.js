import pomodoroProgressbar from './components/pomodoro-progressbar.js'

const btnIntervalleAnpassen = document.querySelector('[data-role="btnIntervalleAnpassen"]')
const btnPomodoroStart = document.querySelector('[data-role="pomodoroStart"]')
const elmTimer = document.querySelector('[data-role="time"]')

pomodoroProgressbar.init()

const openCustomizeIntervalsView = () => {
  chrome.windows.create({
    url: "/src/views/adjust-intervals.html",
    type: "popup",
    width: 550,
    height: 600,
    top: 100,
    left: 100
  }, (window) => {
    chrome.windows.onRemoved.addListener((windowId) => {
      if (windowId === window.id) {
        pomodoroProgressbar.init()
      }
    })
  })
}

const startPomodoro = () => {
  const startingMinutes = 15
  let time = startingMinutes * 60

  setInterval(() => {
    updateCountdown(time)
    time--
  }, 1000)
}

const updateCountdown = (time) => {
  const minutes = Math.floor(time / 60)
  let seconds = time % 60
  if (seconds < 10) {
    seconds = "0" + seconds
  }

  elmTimer.innerHTML = `${minutes}:${seconds}`
}

btnIntervalleAnpassen.addEventListener('click', openCustomizeIntervalsView)
btnPomodoroStart.addEventListener('click', startPomodoro)
