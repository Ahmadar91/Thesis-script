// mysql [[:<:]]fix[[:>:]]
// SELECT * FROM files WHERE message REGEXP '/[[:<:]]JENKINS-[0-9]{1,6}[[:>:]]|#[0-9]{1,6}|HUDSON-[0-9]{1,6}/gim*' AND message  REGEXP '[[:<:]]fix[[:>:]]' AND NAME LIKE "%.java%";
// /\bJENKINS-[0-9]{1,6}\b|#[0-9]{1,6}|HUDSON-[0-9]{1,6}/gim
// const str = '[JENKINS-42717] - Prevent NPE when a non-existent Default View is specified in the global config (#2815) + [JENKINS-42717] - Document view management hudson-1234 methods in Jenkins and ViewGroupMixIn +  [JKENKINS-42717] - GlobalDefauldViewConfiguration should not fail with NPE when the view is missing|+ [JENKINS-42717] - Draft the direct unit test + [JENKINS-42717] - Fix the tes implementatio + [JENKINS-42717] - Make FormException localizable [JENKINS-42717] - Fix te build glitch (cherry picked from commit 4074818b97d50b98b754f723842f03306a1ddaea)'
// const sub = str.match(/\bJENKINS-[0-9]{1,6}\b|#[0-9]{1,6}|HUDSON-[0-9]{1,6}/gim)
// const sub2 = str.match(/\bfix\b/gim)
// console.log(sub2)

// console.log(sub)
// for (let i = 0; i < sub.length; i++) {
//   if (sub[i].startsWith('JEN')) {
//     console.log(sub[i].substring(8, sub[i].length))
//   } else if (sub[i].startsWith('#')) {
//     console.log(sub[i].substring(1, sub[i].length))
//   } else { console.log(sub[i].substring(7, sub[i].length)) }
// }

const xlsx = require('xlsx')

const wb = xlsx.readFile('./test.xlsx', { cellDates: true })
// console.log(wb.SheetNames)
const ws = wb.Sheets.bugs
// console.log(ws)
const data = xlsx.utils.sheet_to_json(ws)
// console.log(data)
let count = 0
const newData = data.map(function (record) {
  const arr = record.message.match(/\bJENKINS-[0-9]{1,6}\b|#[0-9]{1,6}|HUDSON-[0-9]{1,6}/gim)
  //   console.log(arr)
  let str = ''
  let str2 = ''
  for (let index = 0; index < arr.length; index++) {
    if (arr[index].startsWith('JEN')) {
      // console.log(arr[index].substring(8, arr[index].length))
      str2 += `https://issues.jenkins-ci.org/browse/JENKINS-${arr[index].substring(8, arr[index].length)}?jql=ORDER%20BY%20lastViewed%20DESC\n`
      console.log(str2)

      str += arr[index].substring(8, arr[index].length) + ','
    } else if (arr[index].startsWith('#')) {
      str += arr[index].substring(1, arr[index].length) + ','
    } else { str += arr[index].substring(7, arr[index].length) + ',' }
  }
  //   console.log()
  count++
  //   console.log('Record:' + count + '/ ' + str)

  record.bugID = str
  return record
})

// console.log(newData)
// const newWB = xlsx.utils.book_new(newData)
// const newWS = xlsx.utils.json_to_sheet(newData)
// xlsx.utils.book_append_sheet(newWB, newWS, 'bugs')

// xlsx.writeFile(newWB, 'new Test.xlsx')
