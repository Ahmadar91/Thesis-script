const xlsx = require('xlsx')
const cheerio = require('cheerio')
const fetch = require('node-fetch')
const wb = xlsx.readFile('./newjmeter.xlsx', { cellDates: true })
const ws = wb.Sheets.bugs
const data = xlsx.utils.sheet_to_json(ws)
const newData = []

async function process (index) {
  console.log(`processing record: ${index} out off ${data.length}`)
  newData.push(await processRecord(data[index]))
  if (index < data.length - 1) {
    if (index % 3 === 0) {
      console.log('waiting for 1500 ms')
      setTimeout(async () => {
        await process(++index)
      }, 1500)
    } else {
      await process(++index)
    }
  } else {
    write()
  }
}

async function processRecord (record) {
  const newArr = []
  if (record.IssueLink) {
    console.log(record.IssueLink)
    var array = record.IssueLink.split(',').map(String)
    for (let index = 0; index < array.length; index++) {
      const str = await startScraping(array[index])
      if (str) {
        console.log('\x1b[42m%s\x1b[0m', `****${str}****`)
        newArr.push(str)
      }
    }
  }
  var fil1 = newArr.filter(function (re, index) {
    return newArr.indexOf(re) === index
  })
  record.bugType = fil1.toString()
  return record
}

async function startScraping (url) {
  try {
    const body = await getDataFromAPI(url)
    const $ = cheerio.load(body)
    let str = $('#static_bug_status').text().trim().toLowerCase()
    str = str.replace(/\s+/g, ' ')
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
        'Accept-Encoding': 'gzip, deflate, br'
      }
    })
    return await response.text()
  } catch (error) {
    console.log(error.message)
  }
}

async function write () {
  const newWB = xlsx.utils.book_new(newData)
  const newWS = xlsx.utils.json_to_sheet(newData)
  xlsx.utils.book_append_sheet(newWB, newWS, 'bugs')
  xlsx.writeFile(newWB, 'newjmeter2.xlsx')
}

async function main () {
  console.log(`Total records: ${data.length}`)
  await process(0)
}

main()
