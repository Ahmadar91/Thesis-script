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

// const wb = xlsx.readFile('./test.xlsx', { cellDates: true })
const wb = xlsx.readFile('./files/Jenkins.xlsx', { cellDates: true })
// console.log(wb.SheetNames)
const ws = wb.Sheets.bugs
// const ws = wb.Sheets.Original
// console.log(ws)
const data = xlsx.utils.sheet_to_json(ws)
// console.log(data)
const newData = data.map(function (record) {
  // const arr = record.message.match(/\bJENKINS-[0-9]{1,6}\b|#[0-9]{1,6}|HUDSON-[0-9]{1,6}/gim)
  const arr = record.message.match(/\bCAMEL-[0-9]{1,6}\b|#[0-9]{1,6}/gim)
  const sub = record.message.match(/\bfix\b|\bfixed\b/gim)
  let fixCount = 0
  if (sub != null) {
  //  console.log(sub.length)
    fixCount = sub.length
  }

  const str = []
  const str2 = []
  const str3 = []
  if (arr) {
    var fil = arr.filter(function (re, index) {
      return arr.indexOf(re) === index
    })
    for (let index = 0; index < fil.length; index++) {
      if (fil[index].startsWith('JEN')) {
        // console.log(arr[index].substring(8, arr[index].length))
        // https://issues.apache.org/jira/browse/CAMEL-14927
        // str2.push(`https://issues.jenkins-ci.org/browse/JENKINS-${fil[index].substring(8, fil[index].length)}`)
        str2.push(`hhttps://issues.apache.org/jira/browse/CAMEL-${fil[index].substring(8, fil[index].length)}`)
        //  console.log(str2)
        str.push(fil[index].substring(8, fil[index].length) + '')
        console.log(fil[index].substring(8, fil[index].length))
      } else if (fil[index].startsWith('#')) {
        // str3.push(`https://github.com/jenkinsci/jenkins/pull/${fil[index].substring(1, fil[index].length)}`)
        str3.push(`https://github.com/apache/camel/pull/${fil[index].substring(1, fil[index].length)}`)
        str.push(fil[index].substring(1, fil[index].length))
      } else {
        str.push(fil[index].substring(8, fil[index].length))
        console.log(fil[index].substring(8, fil[index].length))
      }
      var fil1 = str.filter(function (re, index) {
        return str.indexOf(re) === index
      })
      var fil2 = str2.filter(function (re, index) {
        return str2.indexOf(re) === index
      })
      var fil3 = str3.filter(function (re, index) {
        return str3.indexOf(re) === index
      })
      record.bugID = fil1.toString()
      record.IssueLink = fil2.toString()
      record.MergeLink = fil3.toString()
    }
  }

  record.ContainsTheWordFix = fixCount

  return record
})

// console.log(newData)
const newWB = xlsx.utils.book_new(newData)
const newWS = xlsx.utils.json_to_sheet(newData)
xlsx.utils.book_append_sheet(newWB, newWS, 'bugs')
xlsx.writeFile(newWB, 'newjenkinsbugs.xlsx')
