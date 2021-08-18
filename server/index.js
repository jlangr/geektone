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
const getAllSongs = () => {
  if (!allSongs)
    allSongs = generateSongList(songFiles())
  return allSongs
}

const ids = files => {
  const matching = []
  files.forEach(file => { 
    const match = matchOn.exec(file)
    if (match) matching.push(match[1])
  })
  return matching
}

const songFilename = id => `${songLocation}/${songNamePrefix}${id}.json`

const readSong = id => JSON.parse(fs.readFileSync(songFilename(id)))

const writeSong = (id, json) => fs.writeFileSync(songFilename(id), JSON.stringify(json))

const deleteSong = id => fs.unlinkSync(songFilename(id))

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

const sortedSongList = () => getAllSongs().sort(([_id1, title1], [_id2, title2]) => title1 > title2)

app.get('/songs', (request, response) => {
  response.send(sortedSongList())
})

app.post('/upload', (request, response) => {
  console.log('uploaded', request.files)
  console.log('file', request.files.fileToUpload)
  response.status(200)
})

app.delete('/song/:id', (request, response) => {
  const id = request.params.id
  deleteSong(id)
  allSongs = undefined
  response.status(200).json(sortedSongList())
})

app.put('/song/:id', (request,response) => {
  const song = request.body
  const id = request.params.id
  writeSong(id, request.body)
console.log('wrote song')
  response.status(200).json({})
})

const updateSongTitle = (idToUpdate, newTitle) => {
  const song = getAllSongs().find(([id, title], index) => {
    return id === idToUpdate})
  song[1] = newTitle
}

app.put('/song/:id/rename', (request, response) => {
  const newTitle = request.body.newTitle
  const id = request.params.id
  const song = readSong(id)
  song.name = newTitle
  writeSong(id, song)
  updateSongTitle(id, newTitle)
  response.status(200).json(sortedSongList())
})

app.post('/song', (request, response) => {
  const song = request.body
  song.id = nextAvailableId()
  writeSong(song.id, song)
  allSongs = undefined
  response.status(200).json({ 'id': song.id, 'songList': sortedSongList() })
})

app.listen(port, (err) => {
  if (err)
    return console.log('ERROR: ', err);

  console.log(`geektone server listening on ${port}`);
})
