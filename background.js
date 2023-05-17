let countdownInterval
let currentSeconds = 0

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'getProgressTimes':
      sendResponse({ success: true, currentSeconds })
      break;
    case 'startCountdown':
      startInterval(message.maxMinutes)
      sendResponse({ success: true })
      break;
    case 'stopCountdown':
      clearInterval(countdownInterval)
      sendResponse({ success: true })
      break;
    case 'nextInterval':
      clearInterval(countdownInterval)
      currentSeconds = 0
      startInterval(message.maxMinutes)
      console.log(message.maxMinutes)
      sendResponse({ success: true })
      break;
    default:
      sendResponse({ success: false, error: 'Unknown action' })
  }
})

const createNotification = () => {
  console.log('Benachrichtigung')
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'time-icon.jpg',
    title: 'Zeit abgelaufen!',
    message: 'Es wird Zeit zum nächsten Intervall überzugehen!',
    priority: 0
  })
}

const startInterval = (maxMinutes) => {
  countdownInterval = setInterval(() => {
    console.log('---------------------')
    console.log(`maxMinutes: ${maxMinutes}`)
    console.log(`currentSeconds: ${currentSeconds}`)

    currentSeconds++
    if (currentSeconds === (maxMinutes * 60)) {
      createNotification()
      clearInterval(countdownInterval)
    }
  }, 1000)
}
