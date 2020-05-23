
const xlsx = require('xlsx')

const wb = xlsx.readFile('./files/AntNew.xlsx', { cellDates: true })

const ws = wb.Sheets.all
const data = xlsx.utils.sheet_to_json(ws)
const newData = data.map(function (record) {
  const arr = record.message.match(/\bbz [0-9]{1,6}\b|#[0-9]{1,6}|bug [0-9]{1,6}|id: [0-9]{1,6}|pr [0-9]{1,6}|id=[0-9]{1,6}|bugzilla [0-9]{1,6}|Enhancement [0-9]{1,6}|bz-[0-9]{1,6}}|bugzilla-[0-9]{1,6}/gim)
  const sub = record.message.match(/\bfix\b|\bfixed\b/gim)

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

    for (let index = 0; index < fil.length; index++) {
      if (fil[index].startsWith('bz') || fil[index].startsWith('BZ')) {
        str2.push(`https://bz.apache.org/bugzilla/show_bug.cgi?id=${fil[index].substring(3, fil[index].length)}`)
        str.push(fil[index].substring(3, fil[index].length) + '')
      } else if (fil[index].startsWith('#')) {
        str3.push(`https://github.com/apache/ant/pull/${fil[index].substring(1, fil[index].length)}`)
        str.push(fil[index].substring(1, fil[index].length))
      } else if (fil[index].toLowerCase().startsWith('bug')) {
        str2.push(`https://bz.apache.org/bugzilla/show_bug.cgi?id=${fil[index].substring(4, fil[index].length)}`)
        str.push(fil[index].substring(4, fil[index].length))
      } else if (fil[index].startsWith('id=')) {
        str2.push(`https://bz.apache.org/bugzilla/show_bug.cgi?id=${fil[index].substring(3, fil[index].length)}`)
        str.push(fil[index].substring(3, fil[index].length))
      } else if (fil[index].startsWith('Id:')) {
        str2.push(`https://bz.apache.org/bugzilla/show_bug.cgi?id=${fil[index].substring(4, fil[index].length)}`)
        str.push(fil[index].substring(3, fil[index].length))
      } else if (fil[index].toLowerCase().startsWith('pr')) {
        str2.push(`https://bz.apache.org/bugzilla/show_bug.cgi?id=${fil[index].substring(2, fil[index].length)}`)
        str.push(fil[index].substring(2, fil[index].length))
      } else if (fil[index].toLowerCase().startsWith('bugzilla')) {
        str2.push(`https://bz.apache.org/bugzilla/show_bug.cgi?id=${fil[index].substring(9, fil[index].length)}`)
        str.push(fil[index].substring(2, fil[index].length))
      } else if (fil[index].startsWith('Enhancement')) {
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
const newWB = xlsx.utils.book_new(newData)
const newWS = xlsx.utils.json_to_sheet(newData)
xlsx.utils.book_append_sheet(newWB, newWS, 'original')
xlsx.writeFile(newWB, 'antnewnew.xlsx')
