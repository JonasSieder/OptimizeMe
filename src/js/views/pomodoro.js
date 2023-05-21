import pomodoroProgressbar from "/src/js/components/pomodoro-progressbar.js"

const init = async () => {
  await pomodoroProgressbar.init()

  const countdownDisplay = document.querySelector('[data-role="countdown"]')
  const btnPlay = document.querySelector('[data-role="pomodoroStart"]')
  const btnStop = document.querySelector('[data-role="pomodoroStop"]')
  const btnNextInterval = document.querySelector('[data-role="pomodoroNextInterval"]')
  const btnReset = document.querySelector('[data-role="pomodoroReset"]')

  const progressbarOrder = Array.from(document.querySelectorAll('[data-role^="workInterval"], [data-role^="breakInterval"], [data-role^="lastBreakInterval"]')) // all html progressbars
  // const progressbarOrderId = progressbarOrder.map(element => element.getAttribute('data-id'))
  const intervalTimes = await pomodoroProgressbar.getIntervalTime() // workInterval, breakInterval, lastBreakInterval, pomodoroCycle

  let interval = await getInterval()
  let countdownInterval = { value: null }

  let progressbarElement = getProgressbarElement(progressbarOrder, interval)
  let progressbarElementId = progressbarElement.getAttribute('data-id')
  let maxMinutes = getMaxMinutes(progressbarElement, intervalTimes)
  chrome.storage.local.set({'progressbarElementId': progressbarElementId, 'maxMinutes': maxMinutes})

  displayProgress(maxMinutes, countdownDisplay, countdownInterval, btnPlay, btnStop, progressbarOrder)

  btnPlay.addEventListener('click', () => {
    chrome.runtime.sendMessage({action: 'startCountdown', maxMinutes})
    runningDisplayProgress(btnPlay, btnStop, maxMinutes, countdownDisplay, countdownInterval, progressbarOrder)
    changePlayPauseBtn(btnPlay, btnStop)
  })

  btnStop.addEventListener('click', () => {
    chrome.runtime.sendMessage({action: 'stopCountdown'})
    changePlayPauseBtn(btnStop, btnPlay)
  })

  btnNextInterval.addEventListener('click', async () => {
    interval = await getInterval()
    if (interval + 1 >= progressbarOrder.length) {
      alert('Bitte setze dein Pomodoro-Fortschritt zurück!')
      return
    }

    const nextInterval = interval + 1
    chrome.storage.local.set({'interval': nextInterval})

    progressbarElement = getProgressbarElement(progressbarOrder, nextInterval)
    progressbarElementId = progressbarElement.getAttribute('data-id')
    maxMinutes = getMaxMinutes(progressbarElement, intervalTimes)
    console.log(progressbarElement)
    chrome.storage.local.set({'progressbarElementId': progressbarElementId, 'maxMinutes': maxMinutes})

    chrome.runtime.sendMessage({action: 'nextInterval', maxMinutes})
    runningDisplayProgress(btnPlay, btnStop, maxMinutes, countdownDisplay, countdownInterval, progressbarOrder)
  })

  btnReset.addEventListener('click', async () => {
    chrome.runtime.sendMessage({action: 'resetIntervalNumber'})
    clearInterval(countdownInterval.value)
    chrome.storage.local.clear(() => {})

    progressbarOrder.forEach((element) => {
      element.style.width = 0
    })
    console.log(interval)
    progressbarElement = getProgressbarElement(progressbarOrder, interval)
    progressbarElementId = progressbarElement.getAttribute('data-id')
    maxMinutes = getMaxMinutes(progressbarElement, intervalTimes)
    displayProgress(maxMinutes, countdownDisplay, countdownInterval, btnPlay, btnStop, progressbarOrder)
  })
}

const getInterval = () => {
  return new Promise((resolve) => {
    chrome.storage.local.get('interval', (result) => {
      resolve(result.interval || 0 )
    })
  })
}

const getProgressbarElement = (progressbarOrder, interval) => {
  return progressbarOrder[interval]
}

const getMaxMinutes = (progressbarElement, intervalTimes) => {
  const progressbarType = progressbarElement.getAttribute('data-role')
  return intervalTimes[progressbarType]
}

const displayProgress = (maxMinutes, countdownDisplay, countdownInterval, btnPlay, btnStop, progressbarOrder) => {
  chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
    displayCountdown(maxMinutes, countdownDisplay, response)

    chrome.storage.local.get('progressbarWidths', (result) => {
      const progressbarWidths = result.progressbarWidths || []
      progressbarWidths.forEach((item) => {
        const progressElement = document.querySelector(`[data-id='${item.id}']`)
        progressElement.style.width = `${parseInt(item.width)}%`
      })
    })

    // moveProgressbar() --> hol alle breiteDerFortschrittsbalken von GoogleStorage und passe die Breite aller Elemente an || wenn nicht vorhanden, dann 0
    if (response.intervalStatus) {
      runningDisplayProgress(btnPlay, btnStop, maxMinutes, countdownDisplay, countdownInterval, progressbarOrder)
    } else {
      changePlayPauseBtn(btnStop, btnPlay)
    }
  })
}

const runningDisplayProgress = async (btnPlay, btnStop, maxMinutes, countdownDisplay, countdownInterval, progressbarOrder) => {
  changePlayPauseBtn(btnPlay, btnStop)
  const progressbarElementId = await getChromeStorageValue('progressbarElementId')
  const progressElement = document.querySelector(`[data-id='${progressbarElementId}']`)

  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }

  countdownInterval.value = setInterval( async () => {
    console.log('contentInterval')
    chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
      displayCountdown(maxMinutes, countdownDisplay, response)

      let progressbarElementWidth = (response.seconds * 100) / (maxMinutes * 60)
      progressElement.style.width = `${progressbarElementWidth}%`

      const progressbarWidths = progressbarOrder.map(element => ({
        id: element.getAttribute('data-id'),
        width: element.style.width
      }))

      chrome.storage.local.set({ progressbarWidths })
    })
  }, 500)
}

const displayCountdown = (maxMinutes, countdownDisplay, response) => {
  let remainingSeconds = calculateRemainingSeconds(maxMinutes, response.seconds)
  countdownDisplay.innerHTML = formatTime(remainingSeconds)
}

const getChromeStorageValue = (key) => {
  return new Promise((resolve) => {
    chrome.storage.local.get(key, (result) => {
      resolve(result[key] || 0)
    })
  })
}

const calculateRemainingSeconds = (maxMinutes, currentSeconds) => {
  return (maxMinutes * 60) - currentSeconds
}

const formatTime = (remainingSeconds) => {
  const minutes = Math.floor(remainingSeconds / 60)
  const remainingSecondsFromMinutes = remainingSeconds % 60
  return `${minutes}:${remainingSecondsFromMinutes < 10 ? '0' : ''}${remainingSecondsFromMinutes}`
}

const changePlayPauseBtn = (btnFirst, btnSecond) => {
  btnFirst.style.display = 'none'
  btnSecond.style.display = ''
}

export default {
  init
}
