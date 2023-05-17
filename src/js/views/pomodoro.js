import pomodoroProgressbar from "/src/js/components/pomodoro-progressbar.js"

const init = async () => {
  await pomodoroProgressbar.init()

  const progressBars = Array.from(document.querySelectorAll('[data-role^="workProgressbar"], [data-role^="breakProgressbar"], [data-role^="lastBreakProgressbar"]'))
  const progressbarWork = document.querySelector('[data-role="workProgressbar"]')
  const countdownDisplay = document.querySelector('[data-role="countdown"]')

  const btnPlay = document.querySelector('[data-role="pomodoroStart"]')
  const btnStop = document.querySelector('[data-role="pomodoroStop"]')
  const btnNextInterval = document.querySelector('[data-role="pomodoroNextInterval"]')
  const btnReset = document.querySelector('[data-role="pomodoroReset"]')

  let progressBarOrder = createProgressbarOrderArray(progressBars)
  const intervalTimes = {
    workInterval: null,
    breakInterval: null,
    lastBreak: null,
    pomodoroCycle: null
  }
  let progressTimes = {
    currentInterval: null,
    currentSeconds: null,
    remainingSeconds: null
  }
  await getIntervalTimesFromGoogleCloud(intervalTimes)
  const maxMinutes = intervalTimes.workInterval

  await getProgressTimesFromBackgroundScript(progressTimes, maxMinutes)
  displayRightBtn(btnPlay, btnStop, progressTimes)

  updateCountdownDisplay(progressTimes, maxMinutes, progressTimes.currentSeconds, progressTimes.remainingSeconds, countdownDisplay, progressbarWork)

  btnPlay.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'startCountdown', maxMinutes, currentSeconds: 0 }, (response) => {
      if (response.success) {
        changePlayPauseBtn(btnPlay, btnStop)
      }
    })
  })

  btnStop.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'stopCountdown'}, (response) => {
      if (response.success) {
        changePlayPauseBtn(btnStop, btnPlay)
      }
    })
  })

  btnNextInterval.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'nextInterval'}, (response) => {
      if (response.success) {
        moveToNextInterval()
      }
    })
  })

  btnReset.addEventListener('click', () => {
    chrome.storage.local.remove('currentInterval', () => {
      console.log('Intervall gelöscht.')
    })
  })
}

const createProgressbarOrderArray = (progressBars) => {
  const progressBarOrder = progressBars.map((progressBar) => {
    return {
      element: progressBar
    }
  })
  return progressBarOrder
}

const moveToNextInterval = () => {
  chrome.storage.local.get('currentInterval', (result) => {
    const currentInterval = result.currentInterval || 0 // Standardwert 0, falls nicht vorhanden
    const nextInterval = currentInterval + 1 // Berechne den Wert des nächsten Intervalls

    // Speichere den Wert des nächsten Intervalls
    chrome.storage.local.set({ currentInterval: nextInterval }, () => {
      console.log(`Intervall ${nextInterval} gespeichert.`)
    })
  })
}

const getIntervalTimesFromGoogleCloud = (intervalTimes) => {
  return pomodoroProgressbar.getIntervalTime().then(result => {
    intervalTimes.workInterval = result.workInterval
    intervalTimes.breakInterval = result.breakInterval
    intervalTimes.lastBreak = result.lastBreak
    intervalTimes.pomodoroCycle = result.pomodoroCycle
  }).catch(error => {
    console.error(error)
  })
}

const updateCountdownDisplay = (progressTimes, maxMinutes, currentSeconds, remainingSeconds, countdownDisplay, progressbarWork) => {
  countdownDisplay.innerHTML = formatTime(progressTimes.remainingSeconds)
  moveProgressbar(progressTimes.currentSeconds, maxMinutes, progressbarWork)

  setInterval( async () => {
    await getProgressTimesFromBackgroundScript(progressTimes, maxMinutes)
    remainingSeconds = progressTimes.remainingSeconds
    currentSeconds = progressTimes.currentSeconds
    countdownDisplay.innerHTML = formatTime(remainingSeconds)
    moveProgressbar(currentSeconds, maxMinutes, progressbarWork)
  }, 500)
}

const getProgressTimesFromBackgroundScript = (progressTimes, maxMinutes) => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: 'getProgressTimes' }, (response) => {
      progressTimes.currentSeconds = response.currentSeconds
      progressTimes.remainingSeconds = calculateRemainingSeconds(maxMinutes, response.currentSeconds)
      resolve()
    })
  })
}

const displayRightBtn = (btnPlay, btnStop, progressTimes) => {
  if (progressTimes.currentSeconds > 0) {
    btnPlay.style.display = 'none'
    btnStop.style.display = ''
  } else {
    btnPlay.style.display = ''
    btnStop.style.display = 'none'
  }
}

const calculateRemainingSeconds = (maxMinutes, currentSeconds) => {
  return (maxMinutes * 60) - currentSeconds
}

const formatTime = (remainingSeconds) => {
  const minutes = Math.floor(remainingSeconds / 60)
  const remainingSecondsFromMinutes = remainingSeconds % 60
  return `${minutes}:${remainingSecondsFromMinutes < 10 ? '0' : ''}${remainingSecondsFromMinutes}`
}

const moveProgressbar = (currentSeconds, maxMinutes, progressbar) => {
  let progressbarWidth = (currentSeconds * 100) / (maxMinutes * 60)
  progressbar.style.width = `${progressbarWidth}%`
  console.log(currentSeconds)
}

const changePlayPauseBtn = (btnFirst, btnSecond) => {
  btnFirst.style.display = 'none'
  btnSecond.style.display = ''
}

export default {
  init
}
