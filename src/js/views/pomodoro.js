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
  let maxMinutes
  let countdownInterval = { value: null }
  const intervalTimes = {
    workProgressbar: null,
    breakProgressbar: null,
    lastBreakProgressbar: null
  }
  let progressTimes = {
    currentInterval: null,
    currentSeconds: null,
    remainingSeconds: null
  }
  console.log(progressBarOrder)

  await getIntervalTimesFromGoogleCloud(intervalTimes)
  maxMinutes = intervalTimes.workProgressbar
  // getMaxMinutes()

  await getProgressTimesFromBackgroundScript(progressTimes, maxMinutes)
  displayRightBtn(btnPlay, btnStop, progressTimes)

  updateCountdownDisplay(progressTimes, maxMinutes, progressTimes.currentSeconds, progressTimes.remainingSeconds, countdownDisplay, progressbarWork, countdownInterval)

  btnPlay.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'startCountdown', maxMinutes}, (response) => {
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
    moveToNextInterval(progressTimes, progressBarOrder, maxMinutes, intervalTimes, countdownDisplay, progressbarWork, countdownInterval)
  })

  btnReset.addEventListener('click', () => {
    chrome.storage.local.remove('currentInterval', () => {
      console.log('Intervall gelöscht')
    })
  })
}

const getMaxMinutes = (currentInterval, progressBarOrder, intervalTimes) => {
  const progressbar = progressBarOrder[currentInterval]
  const progressbarType = progressbar.element.getAttribute('data-role')
  return intervalTimes[progressbarType]
  // return {progressbarType, maxMinutes: intervalTimes[progressbarType]}
}

const createProgressbarOrderArray = (progressBars) => {
  const progressBarOrder = progressBars.map((progressBar) => {
    return {
      element: progressBar
    }
  })
  return progressBarOrder
}

const moveToNextInterval = (progressTimes, progressBarOrder, maxMinutes, intervalTimes, countdownDisplay, progressbarWork, countdownInterval) => {
  chrome.storage.local.get('currentInterval', (result) => {
    progressTimes.currentInterval = result.currentInterval || 0 // Standardwert 0, falls nicht vorhanden
    const nextInterval = progressTimes.currentInterval + 1 // Berechne den Wert des nächsten Intervalls

    maxMinutes = getMaxMinutes(nextInterval, progressBarOrder, intervalTimes)

    chrome.runtime.sendMessage({ action: 'nextInterval', maxMinutes}, (response) => {
      if (response.success) {
        updateCountdownDisplay(progressTimes, maxMinutes, progressTimes.currentSeconds, progressTimes.remainingSeconds, countdownDisplay, progressbarWork, countdownInterval)
        // moveProgressbar()
      }
    })

    // Speichere den Wert des nächsten Intervalls
    chrome.storage.local.set({ currentInterval: nextInterval }, () => {
      console.log(`Intervall ${nextInterval} gespeichert`)
    })
  })
}

const getIntervalTimesFromGoogleCloud = (intervalTimes) => {
  return pomodoroProgressbar.getIntervalTime().then(result => {
    intervalTimes.workProgressbar = result.workInterval
    intervalTimes.breakProgressbar = result.breakInterval
    intervalTimes.lastBreakProgressbar = result.lastBreak
  }).catch(error => {
    console.error(error)
  })
}

const updateCountdownDisplay = (progressTimes, maxMinutes, currentSeconds, remainingSeconds, countdownDisplay, progressbarWork, countdownInterval) => {
  countdownDisplay.innerHTML = formatTime(progressTimes.remainingSeconds)
  moveProgressbar(progressTimes.currentSeconds, maxMinutes, progressbarWork)

  if (countdownInterval.value) {
    clearInterval(countdownInterval.value);
  }

  countdownInterval.value = setInterval( async () => {
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
}

const changePlayPauseBtn = (btnFirst, btnSecond) => {
  btnFirst.style.display = 'none'
  btnSecond.style.display = ''
}

export default {
  init
}
