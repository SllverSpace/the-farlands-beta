// settings
var world = {}
var chunks = {}
var sets = []
var chunkSets = {}
var borders = [
	new Object3D(0, 0, 0, 16, 16, 16),
	new Object3D(0, 0, 0, 16, 16, 16),
	new Object3D(0, 0, 0, 16, 16, 16),
	new Object3D(0, 0, 0, 16, 16, 16),
	new Object3D(0, 0, 0, 16, 16, 16),
	new Object3D(0, 0, 0, 16, 16, 16),
	new Object3D(0, 0, 0, 16, 16, 16),
]
var cameraOff = { x: 0, y: 0, z: 0 }
var offset = { x: -worldSize.x / 2, y: -worldSize.y - 0.5, z: -worldSize.z / 2 }
// var textureLoader = new THREE.TextureLoader()
var texture = new webgpu.Texture("assets/blocks.png")
var alphaTexture = new webgpu.Texture("assets/alpha.png")
var playerTexture = new webgpu.Texture("assets/players.png")
var fontTexture = new webgpu.Texture("assets/font.png")
var fontAlphaTexture = new webgpu.Texture("assets/fontAlpha.png")

var bugTexture = new webgpu.Texture("assets/sky.png")
var skyTexture = new webgpu.Texture("assets/sky.png")
var chunkTickCooldown = 0
var setTickCooldown = 0
var loadingChunks = []
var targetFOV = 60
var fov = 60
var cameraY = 0.75
var cameraYTarget = 0.75
var fogDistance = 0
var blockBig = true
var loadedChunksA = 0

var font = new FontFace("font", "url(assets/font.ttf)")
var fontLoaded = false
font.load().then(function(loadedFont) {
	fontLoaded = true
	document.fonts.add(loadedFont)
})

// var rando = []
// for (let i = 0; i < 1000; i++) {
// 	rando.push(Math.round(sRandom(i)*10+1))
// }
// console.log(rando)


// loader.load("assets/font.json", function(font2) {
//   font = font2
// })

var view = mat4.create()
const projection = mat4.create()

// sprites
var rp = { x: 0, y: 0, z: 0 }
var indicator = new webgpu.Box(0, 0, 0, 1.025, 1.025, 1.025, [1, 1, 1, 0.2])
for (let i = 0; i < 6; i++) {
	indicator.uvs.push(
		3 * blockSize.x, 2 * blockSize.y,
		3 * blockSize.x + blockSize.x, 2 * blockSize.y + blockSize.y,
		3 * blockSize.x + blockSize.x, 2 * blockSize.y,
		3 * blockSize.x, 2 * blockSize.y + blockSize.y,
	)
}
indicator.updateBuffers()
indicator.castShadows = false
indicator.ignoreLighting()
// indicator.useTexture = true
// indicator.texture = texture
indicator.transparent = true
// indicator.useAlpha = true
// indicator.alphaTexture = alphaTexture

var thirdPerson = false
var anims = ["idle", "walk", "jump", "run"]
var rDistance = 0
var players = {}
// x: 134.46097076958287, y: 13.250000000003208, z: 46.27446747936711
var player = new Player(cs.x / 2 + 0.5, worldSize.y, cs.z / 2 + 0.5)
player.real = true
var lastRounded = {}
var cSent = []
var toRender = []

var chunkBox = new webgpu.Box(cs.x/2, cs.y/2, cs.z/2, cs.x, cs.y, cs.z, [1, 1, 1])
chunkBox.oneSide = false
chunkBox.alpha = 0.8
chunkBox.order = true
// lighting
var time = 0
var aOff = { x: -0.5, y: 0.65, z: 0.25 }
var off = { x: -0.5, y: 0.65, z: 0.5 }
// var aLight = new THREE.AmbientLight(0xffffff, 1.25)
// scene.add(aLight)
var light = 0
// var light = new THREE.DirectionalLight(0xffffff, 0.75)
// light.position.set(off.x, off.y, off.z)
// light.castShadow = true
// light.shadow.mapSize.width = 4096
// light.shadow.mapSize.height = 4096
// light.shadow.bias = -0.0025
// scene.add(light)
// var target = new THREE.Object3D()
// target.position.set(0, 0, 0)
// scene.add(target)

// light.target = target

// var chunkLoader = new Worker("threads/loader.js")

var worldPos = { x: 0, y: 0, z: 0 }
var canTick = true
var canSet = true
var canOrder = true
var order = 0

// variables
var collide = []
var meshes = []

var VERSION = 0
var saveData = {}

let skySize = 200
var sky = new webgpu.Mesh(0, 100, 0, 1, 1, 1, [
	-1*skySize, 0, -1*skySize, 
	1*skySize, 0, 1*skySize, 
	-1*skySize, 0, 1*skySize, 
	1*skySize, 0, -1*skySize
], [0, 2, 1, 0, 3, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
sky.texture = skyTexture
sky.uvs = [0, 0, 1, 1, 0, 1, 1, 0]
sky.useTexture = true
sky.castShadows = false
sky.material.ambient = [1, 1, 1]
sky.material.diffuse = [0, 0, 0]
// sky.ignoreFog = true


sky.visible = true

sky.updateBuffers()

var username = "Unnamed"

var dFov = 60
var cameraTilt = 1

var saveDataLoaded = localStorage.getItem("data")
if (saveDataLoaded) {
	saveDataLoaded = JSON.parse(saveDataLoaded)
	if (saveDataLoaded.playerT) {
		playerT = saveDataLoaded.playerT
	}
	if (saveDataLoaded.renderSize) {
		renderSize = saveDataLoaded.renderSize
	}
	if (saveDataLoaded.chunkLoadSpeed) {
		chunkLoadSpeed = saveDataLoaded.chunkLoadSpeed
	}
	if (saveDataLoaded.sensitivity) {
		sensitivity = saveDataLoaded.sensitivity
	}
	if (saveDataLoaded.inventory) {
		inventory = saveDataLoaded.inventory
		for (let i in inventory) {
			if (!Object.keys(itemData).includes(inventory[i][0])) {
				inventory[i] = ["none", 0]
			}
		}
	}
	if (saveDataLoaded.wpos) {
		player.wpos = saveDataLoaded.wpos
	}
	if (saveDataLoaded.rot) {
		camera.rot = saveDataLoaded.rot
	}
	if (saveDataLoaded.selected) {
		selected = saveDataLoaded.selected
	}
	if (saveDataLoaded.fov) {
		dFov = saveDataLoaded.fov
	}
	if (saveDataLoaded.cameraTilt) {
		cameraTilt = saveDataLoaded.cameraTilt
	}
	if (saveDataLoaded.username) {
		username = saveDataLoaded.username
		updateUsernameBoxes()
	}
}

function updateUsernameBoxes() {
	usernameBox.text = username
	usernameBox2.text = username
}

// var drone = new Box(3, 2, 3, 1, 1, 1, [0.5, 0.5, 0.5])

var testText = new Text3D(2, 3, 2, "", 0.1)

var chat = []

var overlayA = 0
var overlayT = 0

var popupAlpha = 1
var popupT = 1

var overlay = new ui.Canvas()
overlay.order = 1

function isCollidingBlock(object, x, y, z) {
	return isColliding3D(object.pos.x, object.pos.y, object.pos.z, object.size.x, object.size.y, object.size.z, x+0.5, y+0.5, z+0.5, 1, 1, 1)
}

function isCollidingWorld(object, t=false) {
	var round = { x: Math.round(object.pos.x - 0.5), y: Math.round(object.pos.y - 0.5), z: Math.round(object.pos.z - 0.5) }
	var check = []

	let non = []
	if (t) {
		non = noCol
	} else {
		non = none
	}

	// Center
	if (!non.includes(getBlock(round.x, round.y, round.z))) {
		if (isCollidingBlock(object, round.x, round.y, round.z)) { return true }
	}

	// X Dir
	if (!non.includes(getBlock(round.x + 1, round.y, round.z))) {
		if (isCollidingBlock(object, round.x + 1, round.y, round.z)) { return true }
	}
	if (!non.includes(getBlock(round.x - 1, round.y, round.z))) {
		if (isCollidingBlock(object, round.x - 1, round.y, round.z)) { return true }
	}

	// Z Dir
	if (!non.includes(getBlock(round.x, round.y, round.z + 1))) {
		if (isCollidingBlock(object, round.x, round.y, round.z + 1)) { return true }
	}
	if (!non.includes(getBlock(round.x, round.y, round.z - 1))) {
		if (isCollidingBlock(object, round.x, round.y, round.z - 1)) { return true }
	}

	// Y Dir
	if (!non.includes(getBlock(round.x, round.y + 1, round.z))) {
		if (isCollidingBlock(object, round.x, round.y + 1, round.z)) { return true }
	}
	if (!non.includes(getBlock(round.x, round.y - 1, round.z))) {
		if (isCollidingBlock(object, round.x, round.y - 1, round.z)) { return true }
	}

	// Corners - Top
	if (!non.includes(getBlock(round.x + 1, round.y + 1, round.z + 1))) {
		if (isCollidingBlock(object, round.x + 1, round.y + 1, round.z + 1)) { return true }
	}
	if (!non.includes(getBlock(round.x - 1, round.y + 1, round.z - 1))) {
		if (isCollidingBlock(object, round.x - 1, round.y + 1, round.z - 1)) { return true }
	}
	if (!non.includes(getBlock(round.x + 1, round.y + 1, round.z - 1))) {
		if (isCollidingBlock(object, round.x + 1, round.y + 1, round.z - 1)) { return true }
	}
	if (!non.includes(getBlock(round.x - 1, round.y + 1, round.z + 1))) {
		if (isCollidingBlock(object, round.x - 1, round.y + 1, round.z + 1)) { return true }
	}

	// Corners - Bottom
	if (!non.includes(getBlock(round.x - 1, round.y - 1, round.z - 1))) {
		if (isCollidingBlock(object, round.x - 1, round.y - 1, round.z - 1)) { return true }
	}
	if (!non.includes(getBlock(round.x + 1, round.y - 1, round.z + 1))) {
		if (isCollidingBlock(object, round.x + 1, round.y - 1, round.z + 1)) { return true }
	}
	if (!non.includes(getBlock(round.x - 1, round.y - 1, round.z + 1))) {
		if (isCollidingBlock(object, round.x - 1, round.y - 1, round.z + 1)) { return true }
	}
	if (!non.includes(getBlock(round.x + 1, round.y - 1, round.z - 1))) {
		if (isCollidingBlock(object, round.x + 1, round.y - 1, round.z - 1)) { return true }
	}

	// Edges - Top
	if (!non.includes(getBlock(round.x + 1, round.y + 1, round.z))) {
		if (isCollidingBlock(object, round.x + 1, round.y + 1, round.z)) { return true }
	}
	if (!non.includes(getBlock(round.x - 1, round.y + 1, round.z))) {
		if (isCollidingBlock(object, round.x - 1, round.y + 1, round.z)) { return true }
	}
	if (!non.includes(getBlock(round.x, round.y + 1, round.z - 1))) {
		if (isCollidingBlock(object, round.x, round.y + 1, round.z - 1)) { return true }
	}
	if (!none.includes(getBlock(round.x, round.y + 1, round.z + 1))) {
		if (isCollidingBlock(object, round.x, round.y + 1, round.z + 1)) { return true }
	}

	// Edges - Bottom
	if (!non.includes(getBlock(round.x - 1, round.y - 1, round.z))) {
		if (isCollidingBlock(object, round.x - 1, round.y - 1, round.z)) { return true }
	}
	if (!non.includes(getBlock(round.x + 1, round.y - 1, round.z))) {
		if (isCollidingBlock(object, round.x + 1, round.y - 1, round.z)) { return true }
	}
	if (!non.includes(getBlock(round.x, round.y - 1, round.z + 1))) {
		if (isCollidingBlock(object, round.x, round.y - 1, round.z + 1)) { return true }
	}
	if (!non.includes(getBlock(round.x, round.y - 1, round.z - 1))) {
		if (isCollidingBlock(object, round.x, round.y - 1, round.z - 1)) { return true }
	}

	// Edges - Sides
	if (!non.includes(getBlock(round.x + 1, round.y, round.z + 1))) {
		if (isCollidingBlock(object, round.x + 1, round.y, round.z + 1)) { return true }
	}
	if (!non.includes(getBlock(round.x - 1, round.y, round.z - 1))) {
		if (isCollidingBlock(object, round.x - 1, round.y, round.z - 1)) { return true }
	}
	if (!non.includes(getBlock(round.x - 1, round.y, round.z + 1))) {
		if (isCollidingBlock(object, round.x - 1, round.y, round.z + 1)) { return true }
	}
	if (!non.includes(getBlock(round.x + 1, round.y, round.z - 1))) {
		if (isCollidingBlock(object, round.x + 1, round.y, round.z - 1)) { return true }
	}
	for (let block of check) {
		if (block.isColliding([object])) {
			return true
		}
	}
	return false
}

function raycast3D(start, angle, distance) {
	var raycast2 = {...start}
	var travel = 0
	while (travel < distance) {
		travel += 0.01
		raycast2.x = start.x + Math.sin(angle.y) * Math.cos(-angle.x) * travel
		raycast2.y = start.y + Math.sin(-angle.x) * travel
		raycast2.z = start.z + Math.cos(angle.y) * Math.cos(-angle.x) * travel
		if (!none.includes(getBlock(Math.floor(raycast2.x+player.wcpos.x), Math.floor(raycast2.y+player.wcpos.y), Math.floor(raycast2.z+player.wcpos.z), false))) {
			break
		}
	}
	return [travel, raycast2]
}

var tickTime = 0

var lastTime = 0
var su = 0
var delta = 0

var scene = "menu"
var targetScene = "menu"

// render
function render(timestamp) {
	requestAnimationFrame(render)
	// console.log("tick")

	if (selectedItem[0] == "none") {
		safeInventory = copyInventory()
	}

	input.setGlobals()
	utils.getDelta(timestamp)
	ui.resizeCanvas()
	ui.getSu()

	webgpu.resizeCanvas()
	// gl.canvas.width = window.innerWidth
	// gl.canvas.height = window.innerHeight

	document.body.style.cursor = "default"

	if (scene == "game") {
		ctx.clearRect(0, 0, canvas.width, canvas.height)
	} else {
		ui.rect(canvas.width/2, canvas.height/2, canvas.width, canvas.height, [22, 22, 22, 1])
	}

	document.body.style.zoom = "100%"
    window.scrollTo(0, 0)

	overlay.set(canvas.width/2, canvas.height/2, canvas.width, canvas.height)

	recipesScroll.set((82.5*4 + 83*4/2)*su, 61*4/2*su, 86*4*su, 61*4*su)
	recipesScroll.bounds.minY = (-64*rows + 61*4)*su

	if (wConnect && !document.hidden) {
		wConnect = false
		connectToServer()
	}

	tickTime += delta
	time = Date.now() / 1000

	if (scene == "game") {
		gameTick()
	} else {
		menuTick()
	}

	ctx.globalAlpha = 1

	if (username.length > 15) {
		username = username.substring(0, 15)
        updateUsernameBoxes()
	}

	saveData = {
		version: VERSION,
		playerT: playerT,
		renderSize: renderSize,
		chunkLoadSpeed: chunkLoadSpeed,
		sensitivity: sensitivity,
		inventory: safeInventory,
		wpos: player.wpos,
		rot: camera.rot,
		selected: selected,
		username: username,
		fov: dFov,
		cameraTilt: cameraTilt,
	}

	localStorage.setItem("data", JSON.stringify(saveData))

	overlayA += (overlayT - overlayA) * delta * 10

	if (Math.abs(overlayT - overlayA) < 0.01 && overlayT == 1 && scene != targetScene) {
		overlayT = 0
		scene = targetScene
		if (scene == "game") {
			connecting = 0
			overlayT = 1
			thirdPerson = false
			usernameBox.text = username
			overlayT = 0
			chat = []
			sendWelcome()
		}
		if (scene != "game") {
			usernameBox2.text = username
			backButton.reset()
		}
		if (scene == "menu") {
			playButton.reset()
			optionsButton.reset()
			htpButton.reset()
		}
	}

	if (connected) {
		popupT = 0
		if (connecting > 0 && scene == "game") {
			popupT = 1
		}
	} else {
		chat = []
		if (scene != "disconnected") {
			popupT = 1
		}
		for (let player in players) {
			players[player].delete()
		}
		players = {}
		playerData = {}
	}

	if (scene == "game" || targetScene == "game") ui.rect(canvas.width/2, canvas.height/2, canvas.width, canvas.height, [0, 0, 0, overlayA])

	popupAlpha += (popupT - popupAlpha) * delta * 10

	if (popupAlpha < 0) {
		popupAlpha = 0
	}

	chunkBox.visible = keys["KeyV"]

	ctx.globalAlpha = popupAlpha

	ui.rect(10*su + 58.5*su, canvas.height-20*su - 85*su + 25*su, 140*su, 100*su, [0, 0, 0, 0.5])
	if (!connected && scene != "disconnected") {
		ui.text(10*su, canvas.height-20*su - 110 * su + 25*su, 20*su, "Connecting")
		ui.img(10*su + 58.5*su, canvas.height-20*su - 50 * su + 25*su, 100 * su, 100 * su, connectingImg, 
			[(Math.round(time*100 / 32)*32) % (192), 0, 32, 32]
		)
	} else if (scene == "game") {
		ui.text(10*su, canvas.height-20*su - 110 * su + 25*su, 16*su, "Loading World")
		ui.img(10*su + 58.5*su, canvas.height-20*su - 50 * su + 25*su, 100 * su, 100 * su, loadingImg, 
			[(Math.round(time*250 / 32)*32) % (256), 0, 32, 32]
		)
	}
	

	ctx.globalAlpha = 1

	input.updateInput()
	updateInput2()
}

// setInterval(orderTick, 1000/ordersPerSecond)
requestAnimationFrame(render)

function scrollElements(x, y) {
	if (recipesScroll.hasPoint(mouse.x, mouse.y) && scene == "game") {
		recipesScroll.ctx.off.x -= x
		recipesScroll.ctx.off.y -= y
	}
	if (devlog.hasPoint(mouse.x, mouse.y) && scene == "menu") {
		devlog.ctx.off.x -= x
		devlog.ctx.off.y -= y
	}
}

function checkInputs(event) {
	let wasFocused = focused
	if (focused) {
		focused.focused = false
		focused = null
	}

	if (inventoryOpen && tab == "options" && scene == "game") {
		usernameBox.checkFocus(event)
	}

	if (scene == "options") {
		usernameBox2.checkFocus(event)
	}

	if (!focused) {
		getInput.blur()
	}
}

function interp(x, y, mul=10, cut=-1) {
	if (cut != 1) {
		if (Math.abs(y - x) > cut) {
			return y
		}
	}
	return x + (y - x)*delta*10
}

function falseDisconnect() {
	scene = "disconnected"
	ws.close()
}