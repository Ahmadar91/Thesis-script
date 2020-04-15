const xlsx = require('xlsx')

const wb = xlsx.readFile('./files/Jenkins.xlsx', { cellDates: true })

const ws = wb.Sheets.bugs
const data = xlsx.utils.sheet_to_json(ws)
const arr = []
for (let index = 0; index < 500; index++) {
  let count = 0
  let codeChurn = 0
  let bugCount = 0
  // console.log(data[index].name)
  // var array = data[index].bugType.split(',').map(String)
  for (let i = 0; i < 500; i++) {
    //
    if (data[index].name === data[i].name) {
      codeChurn += data[i].changes
      count++
      // for (let j = 0; j < array.length; j++) {
      if (data[i].bugType.includes('bug') === true) {
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
xlsx.writeFile(newWB, 'test 1.xlsx')
