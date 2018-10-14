const express = require('express')
const app = express()
const fs = require('fs')

const port = 3001

// just use a .json file to contain the config for the server

var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app.get('/song', (request, response) => { 
  const rawData = fs.readFileSync('song2.json')
  response.send(JSON.parse(rawData))
})

const songNamePrefix = 'song'
const matchOn = /song(\d+)\.json/

const ids = files => {
  const matching = []
  files.forEach(file => { 
    const match = matchOn.exec(file)
    if (match) matching.push(match[1])
  })
  return matching
}

app.get('/songs', (request, response) => {
  const files = fs.readdirSync('data/')

  response.send(ids(files))
})

app.post('/song', (request,response) => {
  const json = JSON.stringify(request.body)
  fs.writeFileSync('song2.json', json)
  response.writeHead(200, {'Content-Type': 'text/html'})
  response.end('post received')
})

app.listen(port, (err) => {
  if (err)
    return console.log('ERROR: ', err);

  console.log(`geektone server listening on ${port}`);
})
