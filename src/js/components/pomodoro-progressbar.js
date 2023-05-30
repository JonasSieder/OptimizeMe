const init = async () => {
  const intervalTimes = await getIntervalTime()
  renderProgressbar(intervalTimes.workInterval, intervalTimes.breakInterval, intervalTimes.lastBreakInterval, intervalTimes.pomodoroCycle)
}

const getIntervalTime = () => {
  return new Promise((resolve) => {
    chrome.storage.sync.get((result) => {
      if (result.customizedInterval) {
        resolve({
          workInterval: result.customizedInterval.workInterval,
          breakInterval: result.customizedInterval.breakInterval,
          lastBreakInterval: result.customizedInterval.lastBreakInterval,
          pomodoroCycle: result.customizedInterval.pomodoroCycle
        })
      } else {
        resolve({
          workInterval: 25,
          breakInterval: 5,
          lastBreakInterval: 15,
          pomodoroCycle: 4
        })
      }
    })
  })
}

const renderProgressbar = (workInterval, breakInterval, lastBreakInterval, pomodoroCycle) => {
  const elementPomodoroProgress = document.querySelector('[data-role="pomodoroProgress"]')

  const percantageIntervalWidths = calculateIntervalWidths(workInterval, breakInterval, lastBreakInterval, pomodoroCycle)
  buildProgressbar(elementPomodoroProgress, percantageIntervalWidths, pomodoroCycle)
}

const calculateIntervalWidths = (workInterval, breakInterval, lastBreakInterval, pomodoroCycle) => {
  const totalMinutes = (workInterval * pomodoroCycle) + (breakInterval * (pomodoroCycle - 1) + lastBreakInterval)
  const widthWorkInterval = calculateIntervalWidth(workInterval, totalMinutes).toFixed(2)
  const widthBreakInterval = calculateIntervalWidth(breakInterval, totalMinutes).toFixed(2)
  const widthLastBreakInterval = calculateIntervalWidth(lastBreakInterval, totalMinutes).toFixed(2)

  return [widthWorkInterval, widthBreakInterval, widthLastBreakInterval]
}

const calculateIntervalWidth = (interval, totalMinutes) => {
  return (interval * 100) / totalMinutes
}

const buildProgressbar = (elementPomodoroProgress, intervalWidthsPercent, pomodoroCycle) => {
  const workInterval = (id, width) => `
    <div class="work-progressbar" style="width: ${width}%">
      <div class="work-progressbar__progress" data-role="workInterval" data-id="${id}"></div>
    </div>
  `

  const breakInterval = (id, width) => `
    <div class="break-progressbar" style="width: ${width}%">
      <div class="break-progressbar__progress" data-role="breakInterval" data-id="${id}"></div>
    </div>
  `

  const lastBreakInterval = (id, width) => `
    <div class="break-progressbar break-progressbar--last-break" style="width: ${width}%">
      <div class="break-progressbar__progress" data-role="lastBreakInterval" data-id="${id}"></div>
    </div>
  `

  let progressBar = ''

  for (let i = 0; i < pomodoroCycle * 2; i++) {
    if (i === pomodoroCycle * 2 - 1) {
      progressBar += lastBreakInterval(i, intervalWidthsPercent[2])
    } else {
      progressBar += i % 2 === 0 ? workInterval(i, intervalWidthsPercent[0]) : breakInterval(i, intervalWidthsPercent[1])
    }
  }

  elementPomodoroProgress.innerHTML = progressBar
}

export default {
  init,
  renderProgressbar,
  getIntervalTime
}