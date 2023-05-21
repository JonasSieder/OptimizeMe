import pomodoroProgressbar from "/src/js/components/pomodoro-progressbar.js"
const init = () => {
  const inputsAdjustIntervalTimes = document.querySelectorAll('[data-role="adjustIntervalTime"]')
  const btnResetIntervalTimes = document.querySelector('[data-role="resetIntervalTimes"]')
  const btnSaveIntervalTimes = document.querySelector('[data-role="saveIntervalTimes"]')

  chrome.storage.sync.get((result) => {
    if (result.customizedInterval) {
      inputsAdjustIntervalTimes[0].value = result.customizedInterval.workInterval
      inputsAdjustIntervalTimes[1].value = result.customizedInterval.breakInterval
      inputsAdjustIntervalTimes[2].value = result.customizedInterval.lastBreakInterval
      inputsAdjustIntervalTimes[3].value = result.customizedInterval.pomodoroCycle
    }
  })

  pomodoroProgressbar.init()

  btnSaveIntervalTimes.addEventListener('click', () => {
    saveInputIntervalTimesToCloud(inputsAdjustIntervalTimes)
    chrome.storage.local.set({'interval': 0})
    chrome.storage.local.clear(() => {})
  })
  btnResetIntervalTimes.addEventListener('click', () => {
    resetInputIntervalTimes(inputsAdjustIntervalTimes)
  })
  inputsAdjustIntervalTimes.forEach((input) => {
    input.addEventListener('change', () => {
      pomodoroProgressbar.renderProgressbar(parseInt(inputsAdjustIntervalTimes[0].value), parseInt(inputsAdjustIntervalTimes[1].value), parseInt(inputsAdjustIntervalTimes[2].value), parseInt(inputsAdjustIntervalTimes[3].value))
    })
  })
}

const saveInputIntervalTimesToCloud = (inputsAdjustIntervalTimes) => {
  const obj = {
    workInterval: parseInt(inputsAdjustIntervalTimes[0].value),
    breakInterval: parseInt(inputsAdjustIntervalTimes[1].value),
    lastBreakInterval: parseInt(inputsAdjustIntervalTimes[2].value),
    pomodoroCycle: parseInt(inputsAdjustIntervalTimes[3].value)
  }

  chrome.storage.sync.set({'customizedInterval': obj})
}

const resetInputIntervalTimes = (inputsAdjustIntervalTimes) => {
  chrome.storage.sync.clear()
  inputsAdjustIntervalTimes[0].value = 25
  inputsAdjustIntervalTimes[1].value = 5
  inputsAdjustIntervalTimes[2].value = 15
  inputsAdjustIntervalTimes[3].value = 4
  pomodoroProgressbar.init()
}

export default {
  init
}