const init = () => {
  const pomodoroProgress = document.querySelector('[data-role="pomodoroProgress"]')

  let workInterval = 25
  let breakInterval = 5
  let lastBreak = 15
  let pomodoroCycle = 4

  const intervalWidths = progressbarPartitioning(pomodoroProgress, workInterval, breakInterval, lastBreak, pomodoroCycle)
  console.log(intervalWidths)
  buildProgressbar(pomodoroProgress, intervalWidths, pomodoroCycle)
}

const progressbarPartitioning = (pomodoroProgress, workInterval, breakInterval, lastBreak, pomodoroCycle) => {
  const allMinutes = (workInterval * pomodoroCycle) + (breakInterval * (pomodoroCycle - 1) + lastBreak)
  const widthWorkInterval = calculatePercentageRate(workInterval, allMinutes).toFixed(2)
  const widthBreakInterval = calculatePercentageRate(breakInterval, allMinutes).toFixed(2)
  const widthLastBreakInterval = calculatePercentageRate(lastBreak, allMinutes).toFixed(2)

  return [widthWorkInterval, widthBreakInterval, widthLastBreakInterval]
}

const calculatePercentageRate = (interval, allMinutes) => {
  return (interval * 100) / allMinutes
}

const buildProgressbar = (pomodoroProgress, intervalWidths, pomodoroCycle) => {
  const workProgressbar = `
  <div class="work-progressbar" style="width: ${intervalWidths[0]}%">
    <div class="work-progressbar__progress"></div>
    <p class="work-progressbar__description"></p>
  </div>
`

  const breakProgressbar = `
    <div class="break-progressbar" style="width: ${intervalWidths[1]}%">
      <div class="break-progressbar__progress"></div>
      <p class="break-progressbar__description"></p>
    </div>
  `

  const lastBreakProgressbar = `
    <div class="break-progressbar break-progressbar--last-break" style="width: ${intervalWidths[2]}%">
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

  pomodoroProgress.innerHTML = progressBar
}

export default {
  init,
}