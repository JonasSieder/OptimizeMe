import renderWorkBreakProgressbar from './components/render-work-break-progressbar.js'

const btnIntervalleAnpassen = document.querySelector('[data-role="btnIntervalleAnpassen"]')
const btnPomodoroStart = document.querySelector('[data-role="pomodoroStart"]')

renderWorkBreakProgressbar.init()

const openCustomizeIntervals = () => {
  chrome.windows.create({
    url: "/src/views/adjust-intervals.html",
    type: "popup",
    width: 550,
    height: 600,
    top: 100,
    left: 100
  })
}

const startPomodoro = () => {
  const timer = 25
}

btnIntervalleAnpassen.addEventListener('click', openCustomizeIntervals)
btnPomodoroStart.addEventListener('click', startPomodoro)
