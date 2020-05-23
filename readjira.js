const xlsx = require('xlsx')
const wb = xlsx.readFile('./files/ignite.xlsx', { cellDates: true })
const ws = wb.Sheets.original
const data = xlsx.utils.sheet_to_json(ws)
const newData = data.map(function (record) {
  // const arr = record.message.match(/\bJENKINS-[0-9]{1,6}\b|#[0-9]{1,6}|HUDSON-[0-9]{1,6}/gim)
  const arr = record.message.match(/\bIGNITE-[0-9]{1,6}\b|#[0-9]{1,6}/gim)
  const sub = record.message.match(/\bfix\b|\bfixed\b/gim)
  let fixCount = 0
  if (sub != null) {
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
      if (fil[index].startsWith('IGN')) {
        console.log(arr[index].substring(7, arr[index].length))
        // https://issues.apache.org/jira/browse/CAMEL-14927
        // str2.push(`https://issues.jenkins-ci.org/browse/JENKINS-${fil[index].substring(8, fil[index].length)}`)
        str2.push(`https://issues.apache.org/jira/browse/IGNITE-${fil[index].substring(7, fil[index].length)}`)
        //  console.log(str2)
        str.push(fil[index].substring(7, fil[index].length) + '')
        // console.log(fil[index].substring(8, fil[index].length))
      } else if (fil[index].startsWith('#')) {
        // str3.push(`https://github.com/jenkinsci/jenkins/pull/${fil[index].substring(1, fil[index].length)}`)
        str3.push(`https://github.com/apache/ignite/pull/${fil[index].substring(1, fil[index].length)}`)
        str.push(fil[index].substring(1, fil[index].length))
      }
      // else {
      //   str.push(fil[index].substring(8, fil[index].length))
      //   console.log(fil[index].substring(8, fil[index].length))
      // }
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

const newWB = xlsx.utils.book_new(newData)
const newWS = xlsx.utils.json_to_sheet(newData)
xlsx.utils.book_append_sheet(newWB, newWS, 'original')
xlsx.writeFile(newWB, 'newingite.xlsx')
