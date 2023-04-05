import pomodoro from './views/pomodoro.js'
import adjustIntervals from './views/adjust-intervals.js'
const buttonsNavbar = document.querySelectorAll('[data-role="navbarButton"]')
const containerContent = document.querySelector('[data-role="contentContainer"]')

const renderContent = (fileName) => {
  return fetch(`/src/views/${fileName}.html`)
    .then(response => response.text())
    .then(data => {
      containerContent.innerHTML = ''
      addContent(fileName, data)
    })
    .catch(error => console.log(error))
}

const addContent = (fileName, data) => {
  const content = document.createElement('div')
  content.innerHTML = data

  containerContent.appendChild(content)

  switch (fileName) {
    case 'pomodoro':
      pomodoro.init()
      break;
    case 'adjust-intervals':
      adjustIntervals.init()
      break;
    default:
      console.log('coming soon!')
  }
}

renderContent('pomodoro')

buttonsNavbar.forEach((button) => {
  button.addEventListener('click', () => {
    renderContent(button.value)
  })
})
