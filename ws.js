const xlsx = require('xlsx')
const cheerio = require('cheerio')
const fetch = require('node-fetch')
const wb = xlsx.readFile('./newTest.xlsx', { cellDates: true })
const ws = wb.Sheets.bugs
const data = xlsx.utils.sheet_to_json(ws)

async function process () {
  console.log(`Total records: ${data.length}`)
  let counter = 0
  return Promise.all(data.map(async (record) => {
    console.log(`processing record: ${counter++} out off ${data.length}`)
    const newArr = []
    if (record.IssueLink !== '') {
      var array = record.IssueLink.split(',').map(String)
      for (let index = 0; index < array.length; index++) {
        const str = await startScraping(array[index])
        if (str) {
          newArr.push(str)
        }
      }
    }
    record.bugType = newArr.toString()
    return record
  }))
}

async function startScraping (url) {
  try {
    const body = await getDataFromAPI(url)
    const $ = cheerio.load(body)
    let str = $('#issuedetails').text().trim().toLowerCase()
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

async function main () {
  const newData = await process()
  console.log(newData)
  const newWB = xlsx.utils.book_new(newData)
  const newWS = xlsx.utils.json_to_sheet(newData)
  xlsx.utils.book_append_sheet(newWB, newWS, 'bugs')
  xlsx.writeFile(newWB, 'newTest2.xlsx')
}

main()
