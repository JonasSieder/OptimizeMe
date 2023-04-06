const init = async () => {
  let intervalTimes = {
    workInterval: 25,
    breakInterval: 5,
    lastBreak: 15,
    pomodoroCycle: 4
  }

  await getCloudTimeDataIfExists(intervalTimes)
  renderProgressbar(intervalTimes.workInterval, intervalTimes.breakInterval, intervalTimes.lastBreak, intervalTimes.pomodoroCycle)
}

const getCloudTimeDataIfExists = (intervalTimes) => {
  return new Promise((resolve) => {
    chrome.storage.sync.get((result) => {
      if (result.customizedInterval) {
        intervalTimes.workInterval = result.customizedInterval.workInterval
        intervalTimes.breakInterval = result.customizedInterval.breakInterval
        intervalTimes.lastBreak = result.customizedInterval.lastBreak
        intervalTimes.pomodoroCycle = result.customizedInterval.pomodoroCycle
      }
      resolve()
    })
  })
}

const renderProgressbar = (workInterval, breakInterval, lastBreak, pomodoroCycle) => {
  const elementPomodoroProgress = document.querySelector('[data-role="pomodoroProgress"]')

  const percantageIntervalWidths = calculateIntervalWidths(workInterval, breakInterval, lastBreak, pomodoroCycle)
  buildProgressbar(elementPomodoroProgress, percantageIntervalWidths, pomodoroCycle)
}

const calculateIntervalWidths = (workInterval, breakInterval, lastBreak, pomodoroCycle) => {
  const totalMinutes = (workInterval * pomodoroCycle) + (breakInterval * (pomodoroCycle - 1) + lastBreak)
  const widthWorkInterval = calculateIntervalWidth(workInterval, totalMinutes).toFixed(2)
  const widthBreakInterval = calculateIntervalWidth(breakInterval, totalMinutes).toFixed(2)
  const widthLastBreakInterval = calculateIntervalWidth(lastBreak, totalMinutes).toFixed(2)

  return [widthWorkInterval, widthBreakInterval, widthLastBreakInterval]
}

const calculateIntervalWidth = (interval, totalMinutes) => {
  return (interval * 100) / totalMinutes
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
  renderProgressbar
}