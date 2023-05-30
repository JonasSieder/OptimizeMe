let countdown
let intervalStatus = false
let seconds = 0

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'getStatus':
      sendResponse({ intervalStatus, seconds })
      break;
    case 'startCountdown':
      startInterval(message.maxMinutes)
      break;
    case 'stopCountdown':
      clearInterval(countdown)
      intervalStatus = false
      break;
    case 'nextInterval':
      clearInterval(countdown)
      seconds = 0
      startInterval(message.maxMinutes)
      break;
    case 'resetIntervalNumber':
      clearInterval(countdown)
      intervalStatus = false
      seconds = 0
      break;
    default:
      sendResponse({ success: false, error: 'Unknown action' })
  }
})

const createNotification = () => {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'time-icon.jpg',
    title: 'Zeit abgelaufen!',
    message: 'Es wird Zeit zum nächsten Intervall überzugehen!',
    priority: 0
  })
}

const startInterval = (maxMinutes) => {
  intervalStatus = true
  countdown = setInterval(() => {

    seconds++
    if (seconds === (maxMinutes * 60)) {
      createNotification()
      clearInterval(countdown)
      intervalStatus = false
    }
  }, 1000)
}
