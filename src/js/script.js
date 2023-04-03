const buttonsNavbar = document.querySelectorAll('[data-role="navbarButton"]')
const containerContent = document.querySelector('[data-role="contentContainer"]')

const renderContent = (fileName) => {
  return fetch(`/src/views/${fileName}.html`)
    .then(response => response.text())
    .then(data => {
      removeContent()
      addContent(fileName, data)
    })
    .catch(error => console.log(error))
}

const removeContent = () => {
  const script = document.head.querySelector('script')
  if (script) {
    script.parentNode.removeChild(script)
  }

  containerContent.innerHTML = ''
}

const addContent = (fileName, data) => {
  const content = document.createElement('div')
  content.innerHTML = data

  const script = document.createElement('script')
  script.type= 'module'
  script.src = `/src/js/views/${fileName}.js`
  document.head.appendChild(script)

  containerContent.appendChild(content)
}

renderContent('pomodoro')

buttonsNavbar.forEach((button) => {
  button.addEventListener('click', () => {
    renderContent(button.value)
  })
})
