const xlsx = require('xlsx')
const cheerio = require('cheerio')
const fetch = require('node-fetch')
const wb = xlsx.readFile('./newjenkinsbugs.xlsx', { cellDates: true })
const ws = wb.Sheets.bugs
const data = xlsx.utils.sheet_to_json(ws)
const newData = []

async function process (index) {
  console.log(`processing record: ${index} out off ${data.length}`)
  newData.push(await processRecord(data[index]))
  // a < data.length - 1
  if (index < data.length - 1) {
    if (index % 3 === 0) {
      console.log('waiting for 50 ms')
      setTimeout(async () => {
        await process(++index)
      }, 50)
    } else {
      await process(++index)
    }
  } else {
    write()
  }
}

async function processRecord (record) {
  const newArr = []
  const newArr1 = []
  const newArr2 = []
  // a !==''
  if (record.IssueLink) {
    console.log(record.IssueLink)

    var array = record.IssueLink.split(',').map(String)
    for (let index = 0; index < array.length; index++) {
      const str = await startScraping(array[index])
      if (str) {
        var strArr = str.split(',').map(String)
        // console.log(strArr)
        if ((strArr[1].toLocaleLowerCase().startsWith('new'))) {
          newArr.push(strArr[1] + ' ' + strArr[2])
          if (strArr[4].toLowerCase().startsWith('in')) {
            newArr1.push(strArr[4] + ' ' + strArr[5])
          } else { newArr1.push(strArr[4]) }
          newArr2.push(strArr[10])
        } else {
          newArr.push(strArr[1])
          if (strArr[3].toLowerCase().startsWith('in')) {
            newArr1.push(strArr[3] + ' ' + strArr[4])
          } else { newArr1.push(strArr[3]) }
          newArr2.push(strArr[9])
        }
      }
    }
  }
  var fil1 = newArr.filter(function (re, index) {
    return newArr.indexOf(re) === index
  })
  var fil2 = newArr1.filter(function (re, index) {
    return newArr1.indexOf(re) === index
  })
  var fil3 = newArr2.filter(function (re, index) {
    return newArr2.indexOf(re) === index
  })
  record.bugType = fil1.toString()
  record.bugStatus = fil2.toString()
  record.Resolution = fil3.toString()
  return record
}

async function startScraping (url) {
  try {
    const body = await getDataFromAPI(url)
    const $ = cheerio.load(body)
    let str = $('#issuedetails').text().trim().toLowerCase()
    str = str.replace(/\s+/g, ',')
    // console.log(str)
    return str
  } catch (err) {
    console.log(err.message)
  }
}
async function getDataFromAPI (url) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:75.0) Gecko/20100101 Firefox/75.0',
        Accept: '*/*',
        Cookie: 'atlassian.xsrf.token=B5BF-G2S8-8N2K-SZ3R_d782f0b7febfcdd0cc52ccb30a5c05a19fc09cc9_lout; JSESSIONID=110191BF9E30158D6709AEDF9B73BFBD',
        Host: 'issues.jenkins-ci.org',
        'Accept-Encoding': 'gzip, deflate, br'
      }
    })
    return await response.text()
  } catch (error) {
    console.log(error.message)
  }
}

async function write () {
  // console.log(newData)
  const newWB = xlsx.utils.book_new(newData)
  const newWS = xlsx.utils.json_to_sheet(newData)

  // was bug now named original
  xlsx.utils.book_append_sheet(newWB, newWS, 'bugs')
  xlsx.writeFile(newWB, 'newjenkinsbugs2.xlsx')
}

async function main () {
  console.log(`Total records: ${data.length}`)
  await process(0)
}

main()
