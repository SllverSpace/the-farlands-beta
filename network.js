var ws

var id = 0
var queue = []
var sent = 0
var data = {x: 0, y: 0, z: 0, rx: 0, ry: 0, hr: 0, c: 0, a: 0, p: [0, 0], i: "none", ig: false}
var playerData = {}
var connected = false
var connecting = -1
var joining = []
var ready = false

function sendMsg(sendData, bypass=false) {
	if (ws.readyState == WebSocket.OPEN && (connected || bypass)) {
		ws.send(JSON.stringify(sendData))
		// if (sent < 5) {
		// 	sent += 1
			
		// } else {
		// 	queue.push(JSON.stringify(sendData))
		// }
	}
}

function sendWelcome() {
	setTimeout(() => {
		ready = true
		chat.push("Welcome to The Farlands!")
		if (chat.length > 5) {
			chat.splice(0, 1)
		}
		chat.push("Players Online: " + getPlayersCode(false).join(", "))
		if (chat.length > 5) {
			chat.splice(0, 1)
		}
		chatBox.stop = 3
	}, 1000)
}

var vid = ""
var vidLoaded = localStorage.getItem("id")
var letters = "abcdefghijklmnopqrstuvABCDEFGHIJKLMNOPQRS0123456789"
if (vidLoaded) {
	vid = vidLoaded
} else {
	for (let i = 0; i < 8; i++) {
		vid += letters[Math.round(Math.random()*(letters.length-1))]
	}
	localStorage.setItem("id", vid)
}

function getViews() {
	ws.send(JSON.stringify({getViews: true}))
}

var wConnect = false

function connectToServer() {
	if (ws) {
		if (ws.readyState == WebSocket.OPEN) {
			ws.close()
		}
	}
	connected = false
	connecting = -1
	id = 0
	ws = new WebSocket("wss://server.silverspace.online:443")

	ws.addEventListener("open", (event) => { 
		sendMsg({connect: "the-farlands"}, true)
	})
	
	ws.addEventListener("message", (event) => {
		var msg = JSON.parse(event.data)
		if (msg.connected) {
			connected = true
			console.log("Connected with id: " + msg.connected)
			sendMsg({view: vid})
			id = msg.connected
			playerData[id] = {}
		}
		if (msg.ping && !document.hidden) {
            sendMsg({ping: true})
        }
		if (msg.views) {
            console.log(JSON.stringify(msg.views))
        }
		if (msg.data) {
			for (let player in msg.data) {
				playerData[player] = msg.data[player]
			}
		}
		if (msg.chat) {
			chat.push(msg.chat)
			if (chat.length > 5) {
				chat.splice(0, 1)
			}
			chatBox.stop = 3
		}
		if (msg.joined) {
			// console.log("Player Joined:", msg.joined)
			// players[msg.joined] = new Player(0, 0, 0)
			// playerData[msg.joined] = {x: 0, y: 0, z: 0, rx: 0, ry: 0, hr: 0, c: 0, i: "none"}
		}
		if (msg.left) {
			let player = msg.left
			if (playerData[player]) {
				if (playerData[player].ig) {
					chat.push((playerData[player].u ? playerData[player].u : "Unnamed") + " left :(")
					if (chat.length > 5) {
						chat.splice(0, 1)
					}
					chatBox.stop = 3
				}
			}

			if (players[player]) {
				players[player].delete()
				delete players[player]
			}
			delete playerData[player]

			// console.log("Player Left:", msg.left)
			// delete playerData[msg.left]
			// players[msg.left].delete()
			// delete players[msg.left]
		}
		if (msg.close) {
			ws.close()
			connected = false
			connecting = -1
			id = 0
			ready = false
			console.log("AFK Disconnect")
			scene = "disconnected"
		}
		if (msg.attack) {
			players[msg.attack].attacking = 10
		}
		if (msg.hit) {
			var dir = {x: player.pos.x-msg.hit.x, y: player.pos.y-msg.hit.y, z: player.pos.z-msg.hit.z }
			player.vel.x += dir.x
			player.vel.y += /*dir.y +*/ 0.11
			player.vel.z += dir.z
			player.rotating = 60
		}
		if (msg.use) {
			if (this.players[msg.use]) {
				this.players[msg.use].hroVel = 50
				this.players[msg.use].handRotOffset = 0
			}
		}
		if (msg.chunk) {
			let id = msg.chunk[0].join(",")
			if (id in chunks && !chunks[id].networkLoaded) {
				chunks[id].networkLoaded = true
				for (let set of msg.chunk[1]) {
					chunks[id].blocks[(set[0]-chunks[id].pos.x)*cs.y*cs.z + (set[1]-chunks[id].pos.y)*cs.z + (set[2]-chunks[id].pos.z)] = set[3]
				}
			}			
			// // var c = msg.chunk[0].join(",")
			// // if (loadingChunks.includes(c)) {
			// // 	loadingChunks.splice(loadingChunks.indexOf(c), 1)
			// // }
			// // loadingChunks.splice(loadingChunks.indexOf(msg.chunk[0].join(",")), 1)
			// if (msg.chunk[1]) {
			// 	addSets([...msg.chunk[1]], true)
			// } else {
			// 	if (world[msg.chunk[0].join(",")]) {
			// 		world[msg.chunk[0].join(",")].visible = true
			// 	}
			// }
			// // startLoad(msg.chunk[0].join(","))
		}
		if (msg.set) {
			addSets([msg.set], true)
		}
	})
	
	ws.addEventListener("close", (event) => {
		console.log("Disconnected from server")
		if (scene != "disconnected") {
			wConnect = true
		}
	})
}

connectToServer()

setInterval(() => {
	sent = 0
	while (sent < 5 && queue.length > 0) {
		sendMsg(queue[0])
		queue.splice(0, 1)
	}
	sendMsg({"data": data})
	
	connecting -= 1
	if (connecting == 0) {
		for (let chunk in world) {
			let pos = expandChunk(chunk)
			if (!testGen) {
				sendMsg({"chunk": [pos.x, pos.y, pos.z]})
			}
			// world[chunk].delete()
		}
		// world = {}
		// chunks = {}
		// sets = []
	}
	for (let i = 0; i < joining.length; i++) {
		if (!playerData[joining[i]]) {
			joining.splice(i, 1)
			i--
			continue
		}
		if (Object.keys(playerData[joining[i]]).includes("u")) {
			chat.push((playerData[joining[i]].u ? playerData[joining[i]].u : "Unnamed") + " joined!")
			if (chat.length > 5) {
				chat.splice(0, 1)
			}
			joining.splice(i, 1)
			chatBox.stop = 3
			i--
		}
	}
}, 1000/60)

setInterval(function () {
	if (scene == "disconnected") { return }
	if (ws.readyState != WebSocket.OPEN) {
		connectToServer()
	}
}, 10000)