import pomodoro from './views/pomodoro.js'
import adjustIntervals from './views/adjust-intervals.js'
import breakIdeas from './views/break-ideas.js'
import selfReflaction from './views/self-reflection.js'
import statistic from './views/statistic.js'

const buttonsNavbar = document.querySelectorAll('[data-role="navbarButton"]')
const underLineNavbar = document.querySelector('[data-role="navbarUnderline"]')
const containerContent = document.querySelector('[data-role="contentContainer"]')

const moveNavbarUnderline = (button) => {
  const activeButtonRect = button.getBoundingClientRect()
  const containerRect = button.parentElement.getBoundingClientRect()

  const offsetLeft = activeButtonRect.left - containerRect.left
  const offsetRight = containerRect.right - activeButtonRect.right

  underLineNavbar.style.left = offsetLeft + 'px'
  underLineNavbar.style.right = offsetRight + 'px'
}

const renderContent = (fileName) => {
  return fetch(`/src/views/${fileName}.html`)
    .then(response => response.text())
    .then(data => {
      addContent(data)
      runViewLogic(fileName)
    })
    .catch(error => console.log(error))
}

const addContent = (data) => {
  containerContent.innerHTML = ''

  const content = document.createElement('div')
  content.innerHTML = data

  containerContent.appendChild(content)
}

const runViewLogic = (fileName) => {
  switch (fileName) {
    case 'pomodoro':
      pomodoro.init()
      break;
    case 'adjust-intervals':
      adjustIntervals.init()
      break;
    case 'break-ideas':
      breakIdeas.init()
      break;
    case 'self-reflection':
      selfReflaction.init()
      break;
    case 'statistic':
      statistic.init()
      break;
    default:
      console.log('js coming soon!')
  }
}

moveNavbarUnderline(buttonsNavbar[0])
renderContent('pomodoro')

buttonsNavbar.forEach((button) => {
  button.addEventListener('click', () => {
    moveNavbarUnderline(button)
    renderContent(button.value)
  })
})
