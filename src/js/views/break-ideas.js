const init = () => {
  const ideasMain = document.querySelector('[data-role="breakIdeasMain"]')
  const navbarTabs = document.querySelectorAll('[data-role="navbarTab"]')
  let activeTab = navbarTabs[0]

  renderTask(ideasMain)

  navbarTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      activeTab = changeActiveTab(activeTab, tab)

      switch (tab.getAttribute('data-value')) {
        case 'randomTask':
          renderTask(ideasMain)
      }
    })
  })
}

const renderTask = (ideasMain) => {
  console.log('renderTask')

  const tasks = [
    {
      icon: 'fa-regular fa-image fa-2xl',
      description: 'Schone deine Augen!'
    },
    {
      icon: 'fa-solid fa-mug-hot fa-2xl',
      description: 'Hol dir etwas zu trinken!'
    },
    {
      icon: 'fa-solid fa-mug-hot fa-2xl',
      description: 'Dehne dich!'
    },
    {
      icon: 'fa-solid fa-mug-hot fa-2xl',
      description: 'Schau beim Sport-Tab vorbei!'
    },
    {
      icon: 'fa-solid fa-mug-hot fa-2xl',
      description: 'Schau beim Yoga-Tab vorbei!'
    },
    {
      icon: 'fa-solid fa-mug-hot fa-2xl',
      description: 'Schau beim Meditations-Tab vorbei!'
    },
    {
      icon: 'fa-solid fa-mug-hot fa-2xl',
      description: 'Mach ein kurzes Powernapping!'
    },
    {
      icon: 'fa-solid fa-carrot',
      description: 'Iss ein Snack!'
    },
    {
      icon: 'fa-solid fa-mug-hot fa-2xl',
      description: 'Mach einen Spaziergang!'
    },
  ]

  const randomTask = tasks[Math.floor(Math.random() * tasks.length)]
  const randomTaskHtml = `
    <i class="${randomTask.icon}"></i>
    <h1>${randomTask.description}</h1>
  `
  ideasMain.innerHTML = randomTaskHtml
}

const changeActiveTab = (activeTab, tab) => {
  activeTab.classList.remove('ideas-navbar-tab--active')
  tab.classList.add('ideas-navbar-tab--active')
  return tab
}

export default {
  init
}