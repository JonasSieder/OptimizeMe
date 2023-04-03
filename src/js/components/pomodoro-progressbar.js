const init = () => {
  let intervalTimes = {
    workInterval: 25,
    breakInterval: 5,
    lastBreak: 15,
    pomodoroCycle: 4
  }

  saveCloudTimeData(intervalTimes)
}

const saveCloudTimeData = (intervalTimes) => {
  chrome.storage.sync.get((result) => {
    if (result.adjustedIntervals) {
      intervalTimes.workInterval = result.adjustedIntervals.workInterval
    }
  })
}

export default {
  init,
}