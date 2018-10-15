const express = require('express')
const app = express()
const fs = require('fs')

const port = 3001

// TODO: use a .json file to contain the config for the server

var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST')
  next()
})

const songNamePrefix = 'song'
const songLocation = './data'
const matchOn = /^song(\d+)\.json$/
let allSongs = undefined

const ids = files => {
  const matching = []
  files.forEach(file => { 
    const match = matchOn.exec(file)
    if (match) matching.push(match[1])
  })
  return matching
}

const songFilename = id => `${songLocation}/${songNamePrefix}${id}.json`

const readSong = id => {
  const rawData = fs.readFileSync(songFilename(id))
  return JSON.parse(rawData)
}

const writeSong = json => {
  const songText = JSON.stringify(json)
  fs.writeFileSync(`song${id}.json`, songText)
}

const title = id => readSong(id).name

const generateSongList = files => {
  const songList = []
  files.forEach(file => { 
    const match = matchOn.exec(file)
    if (match) {
      const id = match[1]
      songList.push([id, title(id)])
    }
  })
  return songList
}

const nextAvailableId = () => {
  const intIds = ids(songFiles()).map(id => parseInt(id, 10))
  return (Math.max(...intIds) + 1).toString()
}

const songFiles = () => fs.readdirSync('data/')

app.get('/song/:id', (request, response) => { 
  response.send(readSong(request.params.id))
})

app.get('/songs', (request, response) => {
  if (!allSongs)
    allSongs = generateSongList(songFiles())

  const sortedByTitle = allSongs.sort(([_id1, title1], [_id2, title2]) => title1 > title2)
  response.send(sortedByTitle)
})

app.put('/song/:id', (request,response) => {
  const song = request.body
  const id = request.params.id
  writeSong(id, request.body)
  response.send(200)
})

app.post('/song', (request,response) => {
  const song = request.body
  song.id = nextAvailableId()
  writeSong(song.id, song)
  response.json(song.id)
})

app.listen(port, (err) => {
  if (err)
    return console.log('ERROR: ', err);

  console.log(`geektone server listening on ${port}`);
})
