let workInterval
let breakInterval
let lastBreak
let pomodoroCycle

const init = async () => {
  await getIntervalTimes()
  renderProgressbar()
}

const getChromeSyncStorage = () => {
  chrome.storage.sync.get((result) => {
    return result
  })
}

const getIntervalTimes = () => {
  return new Promise((resolve) => {
    chrome.storage.sync.get((result) => {
      if (result.customizedInterval) {
        console.log(getChromeSyncStorage)
        workInterval = result.customizedInterval.workInterval
        breakInterval = result.customizedInterval.breakInterval
        lastBreak = result.customizedInterval.lastBreak
        pomodoroCycle = result.customizedInterval.pomodoroCycle
      } else {
        workInterval = 25
        breakInterval = 5
        lastBreak = 15
        pomodoroCycle = 4
      }
      resolve()
    })
  })
}

const renderProgressbar = (adjustIntervalTime, valueWorkInterval, valueBreakInterval, valueLastBreak, valuePomodoroCycle) => {
  if (adjustIntervalTime) {
    workInterval = valueWorkInterval
    breakInterval =  valueBreakInterval
    lastBreak =  valueLastBreak
    pomodoroCycle =  valuePomodoroCycle
  }

  const elementPomodoroProgress = document.querySelector('[data-role="pomodoroProgress"]')

  const intervalWidthsPercent = progressbarPartitioning(workInterval, breakInterval, lastBreak, pomodoroCycle)
  buildProgressbar(elementPomodoroProgress, intervalWidthsPercent, pomodoroCycle)
}

const progressbarPartitioning = (workInterval, breakInterval, lastBreak, pomodoroCycle) => {
  const allMinutes = getAllMinutes(workInterval, breakInterval, lastBreak, pomodoroCycle)
  const widthWorkInterval = calculatePercentageRate(workInterval, allMinutes).toFixed(2)
  const widthBreakInterval = calculatePercentageRate(breakInterval, allMinutes).toFixed(2)
  const widthLastBreakInterval = calculatePercentageRate(lastBreak, allMinutes).toFixed(2)

  return [widthWorkInterval, widthBreakInterval, widthLastBreakInterval]
}

const getAllMinutes = (workInterval, breakInterval, lastBreak, pomodoroCycle) => {
  return (workInterval * pomodoroCycle) + (breakInterval * (pomodoroCycle - 1) + lastBreak)
}

const calculatePercentageRate = (interval, allMinutes) => {
  return (interval * 100) / allMinutes
}

const buildProgressbar = (elementPomodoroProgress, intervalWidthsPercent, pomodoroCycle) => {
  const workProgressbar = `
    <div class="work-progressbar" style="width: ${intervalWidthsPercent[0]}%">
      <div class="work-progressbar__progress"></div>
      <p class="work-progressbar__description"></p>
    </div>
  `

  const breakProgressbar = `
    <div class="break-progressbar" style="width: ${intervalWidthsPercent[1]}%">
      <div class="break-progressbar__progress"></div>
      <p class="break-progressbar__description"></p>
    </div>
  `

  const lastBreakProgressbar = `
    <div class="break-progressbar break-progressbar--last-break" style="width: ${intervalWidthsPercent[2]}%">
      <div class="break-progressbar__progress"></div>
      <p class="break-progressbar__description"></p>
    </div>
  `

  let progressBar = '';

  for (let i = 0; i < pomodoroCycle * 2; i++) {
    if (i === pomodoroCycle * 2 - 1) {
      progressBar += lastBreakProgressbar
    } else {
      progressBar += i % 2 === 0 ? workProgressbar : breakProgressbar
    }
  }

  elementPomodoroProgress.innerHTML = progressBar
}

export default {
  init,
  renderProgressbar,
  getChromeSyncStorage
}