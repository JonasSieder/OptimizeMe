const init = () => {
  const iconDayStatus = document.querySelector('[data-role="iconDayStatus"]')
  const inputTimeToolStatus = document.querySelector('[data-role="inputTimeToolStatus"]')
  const inputWaterStatus = document.querySelector('[data-role="inputWaterStatus"]')
  const inputBreakStatus = document.querySelector('[data-role="inputBreakStatus"]')

  chrome.storage.local.get(null, (data) => {
    const selfReflectionData = getSelfReflectionData(data)

    if (selfReflectionData.length === 0) {
      alert('Es fehlen noch Daten zum Auswerten!')
      return
    }

    const averageData = calculateAverage(selfReflectionData)

    iconDayStatus.value = averageData.dayStatusAverage.toFixed(2)
    inputTimeToolStatus.value = averageData.timeToolUsageAverage.toFixed(2)
    inputWaterStatus.value = averageData.waterIntakeAverage.toFixed(2)
    inputBreakStatus.value = averageData.healthyBreakAverage.toFixed(2)
  })
}

const getSelfReflectionData = (data) => {
  const selfReflectionData = []

  Object.keys(data).forEach((key) => {
    if (key.startsWith('selfReflectionData')) {
      selfReflectionData.push(data[key])
    }
  })

  return selfReflectionData
}


const calculateAverage = (data) => {
  let dayStatusTotal = 0
  let timeToolUsageTotal = 0
  let waterIntakeTotal = 0
  let healthyBreakTotal = 0
  let count = data.length

  data.forEach((item) => {
    dayStatusTotal = dayStatusTotal + parseInt(item.dayStatus)
    timeToolUsageTotal = timeToolUsageTotal + parseInt(item.timeManagementUsage)
    waterIntakeTotal = waterIntakeTotal + parseInt(item.waterIntake)
    healthyBreakTotal = healthyBreakTotal + parseInt(item.healthyBreak)
  })

  return {
    dayStatusAverage: dayStatusTotal / count,
    timeToolUsageAverage: timeToolUsageTotal / count,
    waterIntakeAverage: waterIntakeTotal / count,
    healthyBreakAverage: healthyBreakTotal / count
  }
}

export default {
  init,
}
