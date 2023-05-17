import pomodoroProgressbar from "/src/js/components/pomodoro-progressbar.js"

const init = async () => {
  await pomodoroProgressbar.init()

  const progressbarWork = document.querySelector('[data-role="workProgressbar"]')
  const countdownDisplay = document.querySelector('[data-role="countdown"]')
  const btnStart = document.querySelector('[data-role="pomodoroStart"]')
  const intervalTimes = {}
  let currentIntervalTimes = {
    currentInterval: null,
    currentSeconds: null,
    remainingSeconds: null
  }

  await fetchIntervalTimes(intervalTimes)

  btnStart.addEventListener('click', () => {
    const maxMinutes = intervalTimes.workInterval

    chrome.runtime.sendMessage({ action: 'startCountdown', maxMinutes, currentSeconds: 0 }, (response) => {
      if (response.success) {
        // moveProgressbar(response.remainingSeconds, maxMinutes)
      }
    })

    setInterval(() => {
      sendRemainingSeconds(countdownDisplay, currentIntervalTimes)
      moveProgressbar(currentIntervalTimes.currentSeconds, maxMinutes, progressbarWork)
    }, 500)
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

const sendRemainingSeconds = (countdownDisplay, currentIntervalTimes) => {
  chrome.runtime.sendMessage({ action: 'getRemainingSeconds' }, (response) => {
    countdownDisplay.innerHTML = formatTime(response.remainingSeconds)
    currentIntervalTimes.currentSeconds = response.currentSeconds
    currentIntervalTimes.remainingSeconds = response.remainingSeconds
  })
}

const formatTime = (remainingSeconds) => {
  const minutes = Math.floor(remainingSeconds / 60)
  const remainingSecondsFromMinutes = remainingSeconds % 60
  return `${minutes}:${remainingSecondsFromMinutes < 10 ? '0' : ''}${remainingSecondsFromMinutes}`
}

const moveProgressbar = (currentSeconds, maxMinutes, progressbar) => {
  // let progressbarWidth = ((maxMinutes * 60 - currentSeconds) * 100) / (maxMinutes * 60)
  let progressbarWidth = (currentSeconds * 100) / (maxMinutes * 60)
  progressbar.style.width = `${progressbarWidth}%`
}

export default {
  init
}
