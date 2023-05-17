import pomodoroProgressbar from "/src/js/components/pomodoro-progressbar.js"

const init = async () => {
  await pomodoroProgressbar.init()

  const countdownDisplay = document.querySelector('[data-role="countdown"]')
  const btnStart = document.querySelector('[data-role="pomodoroStart"]')
  const intervalTimes = {}
  let currentIntervalData = {
    currentInterval: null,
    currentSeconds: null,
    remainingSeconds: null
  }

  await fetchIntervalTimes(intervalTimes)

  btnStart.addEventListener('click', () => {
    const maxMinutes = intervalTimes.workInterval
    // countdownDisplay.innerHTML = (maxMinutes * 60) - 1
    console.log(`pomodoro --> btnStart click | maxMinutes: ${maxMinutes}`)

    chrome.runtime.sendMessage({ action: 'startCountdown', maxMinutes, currentSeconds: 0 }, (response) => {
      if (response.success) {
        // moveProgressbar(response.remainingSeconds, maxMinutes)
      }
    })

    setInterval(() => {
      sendRemainingSeconds(countdownDisplay, currentIntervalData)
      moveProgressbar(currentIntervalData.currentSeconds)
    }, 500)
  })
}

const sendRemainingSeconds = (countdownDisplay, currentIntervalData) => {
  chrome.runtime.sendMessage({ action: 'getRemainingSeconds' }, (response) => {
    if (response.success) {
      console.log('current seconds:', response.currentSeconds)
      countdownDisplay.innerHTML = formatTime(response.remainingSeconds)
      currentIntervalData.currentSeconds = response.currentSeconds
      currentIntervalData.remainingSeconds = response.remainingSeconds
    }
  })
}

const fetchIntervalTimes = (intervalTimes) => {
  return pomodoroProgressbar.getIntervalTime().then(result => {
    intervalTimes.workInterval = result.workInterval
    intervalTimes.breakInterval = result.breakInterval
    intervalTimes.lastBreak = result.lastBreak
    intervalTimes.pomodoroCycle = result.pomodoroCycle
  }).catch(error => {
    console.error(error)
  })
}

const formatTime = (remainingSeconds) => {
  const minutes = Math.floor(remainingSeconds / 60)
  const remainingSecondsFromMinutes = remainingSeconds % 60
  return `${minutes}:${remainingSecondsFromMinutes < 10 ? '0' : ''}${remainingSecondsFromMinutes}`
}

const moveProgressbar = (remainingSeconds, maxMinutes) => {
  const progressbar = document.querySelector('[data-role="workProgressbar"]')
  let progressbarWidth = ((maxMinutes * 60 - remainingSeconds) * 100) / (maxMinutes * 60)
  progressbar.style.width = `${progressbarWidth}%`
}

export default {
  init
}
