import pomodoroProgressbar from "/src/js/components/pomodoro-progressbar.js"
const init = async () => {
  await pomodoroProgressbar.init()

  const btnStart = document.querySelector('[data-role="pomodoroStart"]')
  const btnNextInterval = document.querySelector('[data-role="pomodoroNextInterval"]')
  const btnReset = document.querySelector('[data-role="pomodoroReset"]')
  const countdownDisplay = document.querySelector('[data-role="countdown"]')
  const workProgressbar = document.querySelector('[data-role="workProgressbar"]')
  const breakProgressbar = document.querySelectorAll('[data-role="breakProgressbar"]')
  const lastBreakProgressbar = document.querySelectorAll('[data-role="lastBreakProgressbar"]')
  const intervalTimes = {}
  let currentIntervalData = {
    currentInterval: 0,
    currentSeconds: 0
  }

  await fetchIntervalTimes(intervalTimes)
  countdownDisplay.innerHTML = `${intervalTimes.workInterval}:00`
  console.log(workProgressbar)

  btnStart.addEventListener('click', () => {
    // currentInterval = currentIntervalData.currentInterval
    startInterval(countdownDisplay, intervalTimes.workInterval, currentIntervalData.currentSeconds, workProgressbar)
  })

  btnNextInterval.addEventListener('click', () => {
    console.log('next')
  })

  btnReset.addEventListener('click', () => {
    console.log('reset')
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

const startInterval = (countdownDisplay, maxMinutes, currentSeconds, workProgressbar) => {
  let remainingSeconds = (maxMinutes * 60) - 1 // don't count the first second
  const countdownInterval = setInterval(() => {
    countdownDisplay.innerHTML = formatTime(remainingSeconds)
    moveProgressbar(currentSeconds, maxMinutes, workProgressbar)
    // console.log(`remainingSeconds: ${remainingSeconds}`)
    remainingSeconds--
    currentSeconds++
    if (remainingSeconds === 0) {
      clearInterval(countdownInterval)
      alert(`Countdown für ${maxMinutes} Minuten ist abgelaufen!`)
    }
  }, 1000)
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

export default {
  init
}