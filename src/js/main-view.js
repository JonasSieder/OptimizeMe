import workBreakProgressbar from './components/work-break-progressbar.js'

const btnIntervalleAnpassen = document.querySelector('[data-role="btnIntervalleAnpassen"]')

workBreakProgressbar.init()

const openCustomizeIntervals = () => {
  chrome.windows.create({
    url: "/src/views/adjust-intervals.html",
    type: "popup",
    width: 550,
    height: 600,
    top: 100,
    left: 100
  })
}

btnIntervalleAnpassen.addEventListener('click', openCustomizeIntervals)
