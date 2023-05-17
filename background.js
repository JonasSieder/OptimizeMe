let countdownInterval
let remainingSeconds = 0
let currentSeconds = 0

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startCountdown') {
    console.log('background --> Message startCountdown erhalten')
    startInterval(message.maxMinutes, sendResponse)
    sendResponse({ success: true })
  } else if (message.action === 'stopCountdown') {
    clearInterval(countdownInterval)
    sendResponse({ success: true })
  } else if (message.action === 'getRemainingSeconds') {
    sendResponse({ success: true, remainingSeconds, currentSeconds })
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

const startInterval = (maxMinutes, currentSeconds, sendResponse) => {
  remainingSeconds = (maxMinutes * 60) - 1

  countdownInterval = setInterval(() => {
    console.log('---------------------')
    console.log(`maxMinutes: ${maxMinutes}`)
    console.log(`currentSeconds: ${currentSeconds}`)
    console.log(`remainingSeconds: ${remainingSeconds}`)

    remainingSeconds--
    currentSeconds++
    if (remainingSeconds === 0) {
      createNotification()
      clearInterval(countdownInterval)
    }
  }, 1000)
}
