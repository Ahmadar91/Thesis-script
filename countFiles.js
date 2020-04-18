const xlsx = require('xlsx')

const wb = xlsx.readFile('./files/jmeter.xlsx', { cellDates: true })

// const ws = wb.Sheets.ten
const ws = wb.Sheets['Release v5.2.1 (Nov 24, 2019)']
const data = xlsx.utils.sheet_to_json(ws)
const arr = []
for (let index = 0; index < data.length; index++) {
  let count = 0
  let codeChurn = 0
  let bugCount = 0
  // console.log(data[index].name)

  // var array = data[index].bugType.split(',').map(String)
  for (let i = 0; i < data.length; i++) {
    //
    if (data[index].name === data[i].name) {
      console.log(data[i].name)
      codeChurn += data[i].changes
      count++
      // for (let j = 0; j < array.length; j++) {
      // data[i].bugType.includes('bug') === true
      if (data[i].bugType.includes('resolved') === true || data[i].bugType.includes('closed') === true || data[i].bugType.includes('reopened') === true || data[i].bugType.includes('new') === true || data[i].bugType.includes('closed') === true || data[i].bugType.includes('verified') === true) {
      //  console.log('bug')
        bugCount++
      }
      // }
    }
  }
  data[index].NumberOfChanges = count
  data[index].codeChurn = codeChurn
  data[index].BugIntroduced = bugCount
  arr.push(data[index])
  // console.log(data[index].name + ': ' + count)
}
// console.log(arr)

const newWB = xlsx.utils.book_new(arr)
const newWS = xlsx.utils.json_to_sheet(arr)
xlsx.utils.book_append_sheet(newWB, newWS, 'bugs')
xlsx.writeFile(newWB, './results/jmeterFinal.xlsx')
