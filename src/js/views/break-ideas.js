const init = () => {
  const navbarTabs = document.querySelectorAll('[data-role="navbarTab"]')
  const tasks = document.querySelectorAll('[data-role="task"]')
  const ytPlaylists = document.querySelectorAll('[data-role="playlist"]')
  const powernapping = document.querySelector('[data-role="powernapping"]')
  let activeElement
  let activeTab = navbarTabs[0]

  let randomTask = renderRandomTask(tasks, activeElement)
  activeElement = randomTask

  navbarTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      activeTab = changeActiveTab(activeTab, tab)

      switch (tab.getAttribute('data-value')) {
        case 'randomTask':
          removeActiveElement(activeElement)
          let randomTask = renderRandomTask(tasks, activeElement)
          activeElement = randomTask
          break;
        case 'sport':
          removeActiveElement(activeElement)
          ytPlaylists[0].classList.remove('none')
          activeElement = ytPlaylists[0]
          break;
        case 'yoga':
          removeActiveElement(activeElement)
          ytPlaylists[1].classList.remove('none')
          activeElement = ytPlaylists[1]
          break;
        case 'meditation':
          removeActiveElement(activeElement)
          ytPlaylists[2].classList.remove('none')
          activeElement = ytPlaylists[2]
          break;
        case 'powernapping':
          removeActiveElement(activeElement)
          initPowernapping(powernapping)
          activeElement = powernapping
          break;
      }
    })
  })
}

const removeActiveElement = (activeElement) => {
  if (activeElement) {
    activeElement.classList.add('none')
  }
}

const renderRandomTask = (tasks) => {
  const randomTask = tasks[Math.floor(Math.random() * tasks.length)]
  randomTask.classList.remove('none')

  return randomTask
}

const initPowernapping = (powernapping) => {
  const timeElement = document.querySelector('[data-role="powernappingTime"]')
  const timeUp = document.querySelector('[data-role="powernappingTimeUp"]')
  const timeDown = document.querySelector('[data-role="powernappingTimeDown"]')
  const play = document.querySelector('[data-role="powernappingPlay"]')
  const pause = document.querySelector('[data-role="powernappingPause"]')

  powernapping.classList.remove('none')

  let time = timeElement.innerHTML

  // timeUp.addEventListener('click', () => {

  // }

  return 
}

const changeActiveTab = (activeTab, tab) => {
  activeTab.classList.remove('ideas-navbar-tab--active')
  tab.classList.add('ideas-navbar-tab--active')
  return tab
}

export default {
  init
}