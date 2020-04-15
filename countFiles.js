const xlsx = require('xlsx')
const wb = xlsx.readFile('./files/tomcat.xlsx', { cellDates: true })

// const ws = wb.Sheets.original
const ws = wb.Sheets.bugs
const data = xlsx.utils.sheet_to_json(ws)

// const newData = data.map(function (record) {
const arr = []
for (let index = 0; index < 500; index++) {
  // console.log(data[index].name)
  let count = 0
  let codeChurn = 0
  let bugCount = 0
  var array = data[index].bugType.split(',').map(String)
  for (let i = 0; i < 500; i++) {
    if (data[index].name === data[i].name) {
      // console.log(data[index].name + '==' + data[i].name)
      codeChurn += data[i].changes
      count++
      for (let j = 0; j < array.length; j++) {
        if (array[j].toLowerCase() === 'bug') {
          bugCount++
        }
      }
    }
  }
  data[index].NumberOfChanges = count
  data[index].codeChurn = codeChurn
  data[index].codeCount = bugCount
  arr.push(data[index])
  console.log(data[index].name + ': ' + count)
}

const newWB = xlsx.utils.book_new(arr)
const newWS = xlsx.utils.json_to_sheet(arr)
xlsx.utils.book_append_sheet(newWB, newWS, 'bugs')
xlsx.writeFile(newWB, 'newtomcat1.xlsx')
