const init = () => {
  const iconsDayStatus = document.querySelectorAll('[data-role="dayStatus"]')
  const inputTimeManagementUsage = document.querySelector('[data-role="timeManagementUsage"]')
  const inputWaterIntake = document.querySelector('[data-role="waterIntake"]')
  const inputHealthyBreak = document.querySelector('[data-role="healthyBreak"]')
  const btnSave = document.querySelector('[data-role="save"]')
  const btnDelete = document.querySelector('[data-role="delete"]')
  let dayStatus

  iconsDayStatus.forEach((iconDayStatus) => {
    iconDayStatus.addEventListener('click', () => {
      styleActiveIcon(iconsDayStatus, iconDayStatus)
      dayStatus = iconDayStatus.getAttribute('data-id')
    })
  })

  btnSave.addEventListener('click', () => {
    const data = getData(dayStatus, inputTimeManagementUsage, inputWaterIntake, inputHealthyBreak)

    if (data) {
      console.log(data)
      const key = `selfReflectionData_${data.date}`
      chrome.storage.local.set({ [key]: data })
    }
  })

  btnDelete.addEventListener('click', () => {
    removeKeysStartingWith('selfReflectionData')
  })
}

const styleActiveIcon = (iconsDayStatus, iconDayStatus) => {
  iconsDayStatus.forEach((icon) => {
    icon.classList.remove('section__icon--active')
  })
  iconDayStatus.classList.add('section__icon--active')
}

const getData = (dayStatus, inputTimeManagementUsage, inputWaterIntake, inputHealthyBreak) => {
  if (dayStatus == undefined) {
    alert('Bitte beantworte vorher die Frage: Wie war dein Tag?')
    return null
  }

  const data = {
    date: getYYYYMD(),
    dayStatus: dayStatus,
    timeManagementUsage: inputTimeManagementUsage.value,
    waterIntake: inputWaterIntake.value,
    healthyBreak: inputHealthyBreak.value
  }

  return data
}

const removeKeysStartingWith = (prefix) => {
  chrome.storage.local.get(null, (items) => {
    const keysToRemove = Object.keys(items).filter((key) => key.startsWith(prefix))
    chrome.storage.local.remove(keysToRemove)
  })
}

const getYYYYMD = () => {
  const date = new Date()
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return `${year}-${month}-${day}`
}

export default {
  init
}
