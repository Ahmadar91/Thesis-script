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
const wb = xlsx.readFile('./files/jmeter.xlsx', { cellDates: true })
// console.log(wb.SheetNames)
// const ws = wb.Sheets.bugs
const ws = wb.Sheets.bugs
// console.log(ws)
const data = xlsx.utils.sheet_to_json(ws)
// console.log(data)
const newData = data.map(function (record) {
  // SELECT * FROM files WHERE message REGEXP '/[[:<:]]BZ [0-9]{1,6}[[:>:]]|#[0-9]{1,6}|id=[0-9]{1,6}|bug [0-9]{1,6}|pr [0-9]{1,6}|id: [0-9]{1,6}|bugzilla [0-9]{1,6}|Enhancement [0-9]{1,6}|[[:<:]]fix[[:>:]]|[[:<:]]fixed[[:>:]]/gim*' AND NAME LIKE "%.java%";

  const arr = record.message.match(/\bbz [0-9]{1,6}\b|#[0-9]{1,6}|bug [0-9]{1,6}|id: [0-9]{1,6}|pr [0-9]{1,6}|id=[0-9]{1,6}|bugzilla [0-9]{1,6}|Enhancement [0-9]{1,6}/gim)
  const sub = record.message.match(/\bfix\b|\bfixed\b/gim)
  // console.log(sub)

  let fixCount = 0
  if (sub) {
    fixCount = sub.length
  }

  const str = []
  const str2 = []
  const str3 = []
  if (arr) {
    var fil = arr.filter(function (re, index) {
      return arr.indexOf(re) === index
    })
    // console.log(fil)

    for (let index = 0; index < fil.length; index++) {
      if (fil[index].startsWith('bz') || fil[index].startsWith('BZ')) {
      //  console.log('bz')
      //  console.log(fil[index].substring(3, fil[index].length))
        str2.push(`https://bz.apache.org/bugzilla/show_bug.cgi?id=${fil[index].substring(3, fil[index].length)}`)
        str.push(fil[index].substring(3, fil[index].length) + '')
      } else if (fil[index].startsWith('#')) {
        str3.push(`https://github.com/jenkinsci/jenkins/pull/${fil[index].substring(1, fil[index].length)}`)
        str.push(fil[index].substring(1, fil[index].length))
      } else if (fil[index].toLowerCase().startsWith('bug')) {
        // console.log('bug')
        // console.log(fil[index].substring(4, fil[index].length))
        str2.push(`https://bz.apache.org/bugzilla/show_bug.cgi?id=${fil[index].substring(4, fil[index].length)}`)
        str.push(fil[index].substring(4, fil[index].length))
      } else if (fil[index].startsWith('id=')) {
      //  console.log('id=')
      //  console.log(fil[index].substring(3, fil[index].length))
        str2.push(`https://bz.apache.org/bugzilla/show_bug.cgi?id=${fil[index].substring(3, fil[index].length)}`)
        str.push(fil[index].substring(3, fil[index].length))
      } else if (fil[index].startsWith('Id:')) {
        // console.log('id:')
        // console.log(fil[index].substring(4, fil[index].length))
        str2.push(`https://bz.apache.org/bugzilla/show_bug.cgi?id=${fil[index].substring(4, fil[index].length)}`)
        str.push(fil[index].substring(3, fil[index].length))
      } else if (fil[index].toLowerCase().startsWith('pr')) {
      //  console.log('pr')
      //  console.log(fil[index].substring(2, fil[index].length))
        str2.push(`https://bz.apache.org/bugzilla/show_bug.cgi?id=${fil[index].substring(2, fil[index].length)}`)
        str.push(fil[index].substring(2, fil[index].length))
      } else if (fil[index].toLowerCase().startsWith('bugzilla')) {
        // console.log('bugzilla')
      //  console.log(fil[index].substring(9, fil[index].length))
        str2.push(`https://bz.apache.org/bugzilla/show_bug.cgi?id=${fil[index].substring(9, fil[index].length)}`)
        str.push(fil[index].substring(2, fil[index].length))
      } else if (fil[index].startsWith('Enhancement')) {
        // console.log('Enhancement')
        // console.log(fil[index].substring(11, fil[index].length))
        str2.push(`https://bz.apache.org/bugzilla/show_bug.cgi?id=${fil[index].substring(11, fil[index].length)}`)
        str.push(fil[index].substring(2, fil[index].length))
      }
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
    console.log(fil1)
    console.log(fil2)
    console.log(fil3)
    record.bugID = fil1.toString()
    record.IssueLink = fil2.toString()
    record.MergeLink = fil3.toString()
  }
  record.ContainsTheWordFix = fixCount
  return record
})

// console.log(newData)
const newWB = xlsx.utils.book_new(newData)
const newWS = xlsx.utils.json_to_sheet(newData)
xlsx.utils.book_append_sheet(newWB, newWS, 'bugs')
xlsx.writeFile(newWB, 'newjmeter.xlsx')
