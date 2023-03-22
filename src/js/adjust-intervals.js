import renderPomodoroProgressbar from './components/render-pomodoro-progressbar.js'

const inputsAdjustIntervalTimes = document.querySelectorAll('[data-role="adjustIntervalTime"]')
const btnResetIntervalTimes = document.querySelector('[data-role="resetIntervalTimes"]')
const btnSaveIntervalTimes = document.querySelector('[data-role="saveIntervalTimes"]')
let valueWorkInterval
let valueBreakInterval
let valueLastBreak
let valuePomodoroCycle

renderPomodoroProgressbar.init()

chrome.storage.sync.get((result) => {
  if (result.customizedInterval) {
    inputsAdjustIntervalTimes[0].value = result.customizedInterval.workInterval
    inputsAdjustIntervalTimes[1].value = result.customizedInterval.breakInterval
    inputsAdjustIntervalTimes[2].value = result.customizedInterval.lastBreak
    inputsAdjustIntervalTimes[3].value = result.customizedInterval.pomodoroCycle
  }
})

const saveValues = () => {
  valueWorkInterval = parseInt(inputsAdjustIntervalTimes[0].value)
  valueBreakInterval = parseInt(inputsAdjustIntervalTimes[1].value)
  valueLastBreak = parseInt(inputsAdjustIntervalTimes[2].value)
  valuePomodoroCycle = parseInt(inputsAdjustIntervalTimes[3].value)
}

const resetIntervalTimes = () => {
  chrome.storage.sync.clear()
  inputsAdjustIntervalTimes[0].value = 25
  inputsAdjustIntervalTimes[1].value = 5
  inputsAdjustIntervalTimes[2].value = 15
  inputsAdjustIntervalTimes[3].value = 4
  renderPomodoroProgressbar.init()
}

const saveIntervalTimes = () => {
  saveValues()

  const obj = {
    workInterval: valueWorkInterval,
    breakInterval: valueBreakInterval,
    lastBreak: valueLastBreak,
    pomodoroCycle: valuePomodoroCycle
  }

  chrome.storage.sync.set({'customizedInterval': obj})
}

btnResetIntervalTimes.addEventListener('click', resetIntervalTimes)
btnSaveIntervalTimes.addEventListener('click', saveIntervalTimes)
inputsAdjustIntervalTimes.forEach((input) => {
  input.addEventListener('change', () => {
    const adjustIntervalTime = true
    saveValues()

    renderPomodoroProgressbar.renderProgressbar(adjustIntervalTime, valueWorkInterval, valueBreakInterval, valueLastBreak, valuePomodoroCycle)
  })
})
