import pomodoroProgressbar from "/src/js/components/pomodoro-progressbar.js"
const init = () => {
  console.log('adjust-interval geladen!')
  const inputsAdjustIntervalTimes = document.querySelectorAll('[data-role="adjustIntervalTime"]')
  const btnResetIntervalTimes = document.querySelector('[data-role="resetIntervalTimes"]')
  const btnSaveIntervalTimes = document.querySelector('[data-role="saveIntervalTimes"]')

  pomodoroProgressbar.init()

  const saveInputIntervalTimesToCloud = () => {
    const obj = {
      workInterval: parseInt(inputsAdjustIntervalTimes[0].value),
      breakInterval: parseInt(inputsAdjustIntervalTimes[1].value),
      lastBreak: parseInt(inputsAdjustIntervalTimes[2].value),
      pomodoroCycle: parseInt(inputsAdjustIntervalTimes[3].value)
    }

    chrome.storage.sync.set({'customizedInterval': obj})
  }

  btnSaveIntervalTimes.addEventListener('click', saveInputIntervalTimesToCloud)
  inputsAdjustIntervalTimes.forEach((input) => {
    input.addEventListener('change', () => {
      pomodoroProgressbar.renderProgressbar(parseInt(inputsAdjustIntervalTimes[0].value), parseInt(inputsAdjustIntervalTimes[1].value), parseInt(inputsAdjustIntervalTimes[2].value), parseInt(inputsAdjustIntervalTimes[3].value))
    })
  })
}

export default {
  init
}