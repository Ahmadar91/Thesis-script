const xlsx = require('xlsx')

const wb = xlsx.readFile('./newFiles/ignite.xlsx', { cellDates: true })
const name = 'Release 2.5.0 (2018-05-28)'
const ws = wb.Sheets[name]
const data = xlsx.utils.sheet_to_json(ws)
console.log(data)

const arr = []
for (let index = 0; index < data.length; index++) {
  let result = 0
  if (data[index].bugType.includes('bug') === true) {
    result = data[index].BugIntroduced / data[index].loc
  }

  data[index].defectDensity = result
  arr.push(data[index])
}
const newWB = xlsx.utils.book_new(arr)
const newWS = xlsx.utils.json_to_sheet(arr)
xlsx.utils.book_append_sheet(newWB, newWS, name)
xlsx.writeFile(newWB, './newFiles/newIgnite.xlsx')
