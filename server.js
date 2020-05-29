var express    = require('express')
var app        = express()
var bodyParser = require('body-parser')
var shortid = require('shortid')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var port = process.env.PORT || 8080

var router = express.Router()

// Unsafely enable cors
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

// logging middleware
router.use(function(req, res, next) {
    console.log('\nReceived:',{url: req.originalUrl, body: req.body, query: req.query})
    next()
})

// Simple in memory database
const database = [
  { name: 'Tea Chats', id: 0, users: ['Ryan','Nick', 'Danielle', 'Ananya'],
    messages: [
        {name: 'Ananya', message: 'ayyyyy ayyyyy ayyyyy ayyyyy ayyyyy ayyyyy ayyyyy ayyyyy ayyyyy ', id: 'gg35545', reaction: null},
        {name: 'Nick', message: 'lmao leggooooo lmao leggooooo lmao leggooooo lmao ', id: 'yy35578', reaction: null},
        {name: 'Danielle', message: 'leggooooo leggooooo leggooooo leggooooo leggooooo leggooooo ', id: 'hh9843', reaction: null},
        {name: 'Ananya', message: 'ayyyyy ayyyyy ayyyyy ayyyyy ayyyyy ayyyyy ayyyyy ayyyyy ayyyyy ', id: 'jhjg34', reaction: null},
    ]
  },
  { name: 'Coffee Chats', id: 1, users: ['Ananya', 'Jessye'],
    messages: [
        {name: 'Jessye', message: 'ayy', id: 'ff35278', reaction: null},
        {name: 'Ananya', message: 'ayyyyy', id: 'gg35545', reaction: null}
    ]
  }
]


// Utility functions
const findRoom = (roomId) => {
  const room = database.find((room) => {
    return room.id === parseInt(roomId)
  })
  if (room === undefined){
    return {error: `a room with id ${roomId} does not exist`}
  }
  return room
}

const findRoomIndex = (roomId) => {
  const roomIndex = database.findIndex((room) => {
    return room.id === parseInt(roomId)
  })
  return roomIndex
}

const findMessageIndex = (room, messageId) => {
  const messageIndex = room.messages.findIndex((message) => {
    return message.id === messageId
  })
  return messageIndex
}

const logUser = (room, username) => {
  const userNotLogged = !room.users.find((user) => {
    return user === username
  })

  if (userNotLogged) {
    room.users.push(username)
  }
}

// API Routes
router.get('/rooms', function(req, res) {
    const rooms = database.map((room) => {
      return {name: room.name, id: room.id}
    })
    console.log('Response:',rooms)
    res.json(rooms)
})

router.get('/rooms/:roomId', function(req, res) {
  const room = findRoom(req.params.roomId)
  if (room.error) {
    console.log('Response:',room)
    res.json(room)
  } else {
    console.log('Response:',{name: room.name, id: room.id, users: room.users})
    res.json({name: room.name, id: room.id, users: room.users})
  }
})

router.route('/rooms/:roomId/messages')
  .get(function(req, res) {
    const room = findRoom(req.params.roomId)
    if (room.error) {
      console.log('Response:',room)
      res.json(room)
    } else {
      console.log('Response:',room.messages)
      res.json(room.messages)
    }
  })
  .post(function(req, res) {
    const room = findRoom(req.params.roomId)
    if (room.error) {
      console.log('Response:',room)
      res.json(room)
    } else if (!req.body.name || !req.body.message) {
      console.log('Response:',{error: 'request missing name or message'})
      res.json({error: 'request missing name or message'})
    } else {
      logUser(room, req.body.name)
      const reaction = req.body.reaction || null
      const messageObj = { name: req.body.name, message: req.body.message, id: shortid.generate(), reaction }
      room.messages.push(messageObj)
      console.log('Response:',{message: 'OK!'})
      res.json(messageObj)
    }
  })

    router.route('/rooms/:roomId/messages/:messageId')
    .post(function(req, res) {
        const room = findRoom(req.params.roomId)
        if (room.error) {
            console.log('Response:',room)
            res.json(room)
        } else {
            let messageIndex = findMessageIndex(room, req.params.messageId)
            if (messageIndex === -1){
                res.json({error: `a message with id ${req.params.messageId} does not exist`})
            } else {
                const roomIndex = findRoomIndex(req.params.roomId)
                console.log({roomIndex, messageIndex})
                if(req.body.name !== undefined) {
                    database[roomIndex].messages[messageIndex].name = req.body.name
                }
                if(req.body.message !== undefined) {
                    database[roomIndex].messages[messageIndex].message = req.body.message
                }
                if(req.body.reaction !== undefined) {
                    database[roomIndex].messages[messageIndex].reaction = req.body.reaction
                }
                res.json({message: 'OK!'})
            }
        }
    })


//Route for Server Sent Events
router.route('/rooms/:roomId/message-stream')
    .get(function(req, res) {
        const room = findRoom(req.params.roomId)
        if (room.error) {
            console.log('SSE Error Response:',room)
            res.json(room)
        } else {
            console.log('SSE Response:',room)

            //SSE persistent connection
            res.writeHead(200, {
                Connection: "keep-alive",
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Access-Control-Allow-Origin": "*"
            });
            res.write(`data: ${JSON.stringify(room)}\n\n`);
            res.end();
        }
    })

app.use('/api', router)
app.listen(port)
console.log(`API running at localhost:${port}/api`)
