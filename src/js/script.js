// import pomodoroProgressbar from './components/pomodoro-progressbar.js'

const buttonsNavbar = document.querySelectorAll('[data-role="navbarButton"]')
const containerContent = document.querySelector('[data-role="contentContainer"]')

const renderContent = (fileName) => {
  return fetch(`/src/contents/${fileName}.html`)
    .then(response => response.text())
    .then(data => {
    const content = document.createElement('div')
    content.innerHTML = data

    // das h2-Element bearbeiten
    // const heading = content.querySelector('#pomodoro-heading');
    // heading.textContent = 'Mein neuer Pomodoro Timer';

    containerContent.appendChild(content)
  })
  .catch(error => console.log(error))
}

chrome.runtime.onStartup.addListener(function() {
  console.log('Browser gestartet.')
})
console.log('test')

buttonsNavbar.forEach((button) => {
  button.addEventListener('click', () => {
    renderContent(button.value).then(() => {
      if (button.value == 'pomodoro-progressbar') {
        // pomodoroProgressbar.init()
      }
    })
  })
})
