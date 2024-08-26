// Vars
var mouse = {x: 0, y: 0, locked: false, has: false, ldown: false, rdown: false, lclick: false, rclick: false}

var keys = {}
var jKeys = {}

var keysRaw = {}
var jKeysRaw = {}

var usingVKeyboard = false

var touches = {}

var focused = null

document.addEventListener("mouseleave", () => {
	mouse.has = false
})

document.addEventListener("mouseenter", () => {
	mouse.has = true
})

var mouseLocked = false

var moved = 0
var downTime = 0
var mobile = false

// Key Manager
addEventListener("keydown", (event) => {
	if (focused) {
		if (event.key.length == 1) {
			focused.text += event.key
		} else if (event.key == "Backspace") {
			focused.text = focused.text.substring(0, focused.text.length-1)
		}
		if (event.key == "+") {
			event.preventDefault()
		}
		if (event.code == "Enter") {
			if (focused.isChat && focused.text.length > 0) {
				focused.text = focused.text.replace("\n", "")
				if (blockBig) {
					focused.text = focused.text.substring(0, 30)
				}
				
				chat.push((usernameBox.text ? usernameBox.text : "Unnamed") + ") " + focused.text)
				sendMsg({chat: (usernameBox.text ? usernameBox.text : "Unnamed") + ") " + focused.text})
				focused.text = ""
				if (chat.length > 5) {
					chat.splice(0, 1)
				}
				
			}
			focused.focused = false
			focused = null
			getInput.blur()
		}
	} else {
		if (!keys[event.code]) {
			jKeys[event.code] = true
		}
		keys[event.code] = true
		
		if (!keysRaw[event.key]) {
			jKeysRaw[event.key] = true
		}
		keysRaw[event.key] = true

		if ((event.code == "Tab" || event.code == "KeyI" || event.code == "Escape" || event.code == "KeyO") && scene == "game") {
			if (isMouseLocked()) {
				unlockMouse()
				if (event.code == "KeyI") {
					tab = "backpack"
				}
				if (event.code == "KeyO") {
					tab = "options"
				}
			} else {
				lockMouse()
			}
		}
	}
	if (event.code == "Tab") {
		event.preventDefault()
	}
})

addEventListener("keyup", (event) => {
	delete keys[event.code]
	delete keysRaw[event.key]
})

addEventListener("blur", function() {
  	keys = {}
	jKeys = {}
	keysRaw = {}
	jKeysRaw = []
	mouse.lclick = false
	mouse.rclick = false
	mouse.ldown = false
	mouse.rdown = false
	if (focused) {
        focused.focused = false
	    focused = null
    }
	unlockMouse()
})

// Update
function updateInput() {
	mouse.lclick = false
	mouse.rclick = false
	mobileL = false
	mobileR = false
	jKeys = {}
	jKeysRaw = {}

	if (inUI) {
		keys = {}
	}

	if (getInput.value.length > 0) {
		usingVKeyboard = true
	}

	if (usingVKeyboard && focused) {
		// focused.text = getInput.value
	}

	if (!mouse.ldown) {
		joyStickPos.x = 0
		joyStickPos.y = 0
	}

	if (mobile && mouseLocked && scene == "game") {
		keys["KeyW"] = joyStickPos.y < -0.25
		keys["KeyS"] = joyStickPos.y > 0.25
		keys["KeyD"] = joyStickPos.x > 0.25
		keys["KeyA"] = joyStickPos.x < -0.25

		player.sprinting = Math.sqrt((joyStickPos.x)**2+(joyStickPos.y)**2) > 0.9
	}
}

// Mouse manager
function lockMouse() {
  const element = uiCanvas

  if (element.requestPointerLock && !mobile) {
    element.requestPointerLock()
  }
}

function unlockMouse() {
  if (document.exitPointerLock && !mobile) {
    document.exitPointerLock()
  }
}

function isMouseLocked() {
	if (!mobile) {
		return document.pointerLockElement == uiCanvas ||
		document.mozPointerLockElement == uiCanvas ||
		document.webkitPointerLockElement == uiCanvas
	}
	return mouseLocked
}

addEventListener("mousedown", (event) => {
	if (event.button == 0) {
		mouse.lclick = true
		mouse.ldown = true
	} else if (event.button == 2) {
		mouse.rclick = true
		mouse.rdown = true
	}
	mouse.x = event.clientX / cScale
	mouse.y = event.clientY / cScale
	checkInputs(event)
	event.preventDefault()
	onClick()
})

function onClick() {
	let x = 81*4*su
	if (tab == "backpack") {
		x = 165*4*su
	}
	if (!((mouse.x < x && mouse.y < 176*4*su) || (mouse.x > uiCanvas.width - 100*su-20*su && mouse.y < 50*su+10*su)) && scene == "game") {
		lockMouse()
		mouseLocked = true
	}

	if (scene == "menu") {
		if (playButton.hovered() && connected && overlayT == 0) {
			overlayT = 1
			playButton.click()
			targetScene = "game"
			menuButtonG.reset()
			lockMouse()
			mouse.lclick = false

			chunks = {}
			for (let chunk in world) {
				world[chunk].delete()
			}
			world = {}
			sets = []
			chunkSets = {}
			loadingChunks = []
		}
	}

	if (discordButton.hovered() && mouse.lclick && scene == "menu") {
        discordButton.click()
        window.open("https://discord.gg/UUxdvXTe4t", "_blank")
    }

	if (mobile && mouse.lclick && chatButton.hovered() && scene == "game") {
		chatButton.click()
		if (chatBox.focused) {
			focused.focused = false
			focused = null
			getInput.blur()
		} else {
			chatBox.focused = true
			focused = chatBox
			getInput.focus()
			getInput.value = chatBox.text
			chatBox.time = 0
			event.preventDefault()
		}
	}
}

addEventListener("mouseup", (event) => {
	mouse.ldown = false
	mouse.rdown = false
})

addEventListener("contextmenu", function(event) {
	event.preventDefault()
	hasMouse = true
})

var lastSensitivity = 0
var sensitivity = 0.005
addEventListener("mousemove", (event) => {
	hasMouse = true
	if (isMouseLocked() && connecting <= 0 && scene == "game") {
		camera.rot.x -= event.movementY*sensitivity
		if (camera.rot.x > Math.PI/2*0.99) {
			camera.rot.x = Math.PI/2*0.99
		}
		if (camera.rot.x < -Math.PI/2*0.99) {
			camera.rot.x = -Math.PI/2*0.99
		}
		camera.rot.y -= event.movementX*sensitivity	
	} else {
		mouse.x = event.clientX / cScale
		mouse.y = event.clientY / cScale
	}
})

var mobileL = false
var mobileR = false

addEventListener("touchstart", (event) => {
	for (let touch of event.changedTouches) {
		touches[touch.identifier] = {x: touch.clientX / cScale, y: touch.clientY / cScale}

		if (scene == "game" && mouseLocked && buildButton.hovered("none", touches[touch.identifier])) {
			mobileR = true
			buildButton.click()
		}
		if (scene == "game" && mouseLocked && breakButton.hovered("none", touches[touch.identifier])) {
			mobileL = true
			breakButton.click()
		}
	}
	
	mouse.ldown = true
	mouse.has = true
	mobile = true
	moved = 0
	downTime = 0
	mouse.x = event.touches[0].clientX / cScale
	mouse.y = event.touches[0].clientY / cScale
	event.preventDefault()

	touches = {}
	for (let touch of event.touches) {
		touches[touch.identifier] = {x: touch.clientX / cScale, y: touch.clientY / cScale}
	}
}, { passive: false })

addEventListener("touchmove", (event) => {
	for (let touch of event.changedTouches) {
		let deltaMove = {x: touch.clientX / cScale - touches[touch.identifier].x, y: touch.clientY / cScale - touches[touch.identifier].y}
		
		touches[touch.identifier] = {x: touch.clientX / cScale, y: touch.clientY / cScale}

		moved += Math.abs((deltaMove.x+deltaMove.y)/2)

		if (mouseLocked && !(touches[touch.identifier].x < 400*su && touches[touch.identifier].y > uiCanvas.height-500*su)) {
			camera.rot.x -= deltaMove.y*sensitivity
			if (camera.rot.x > Math.PI/2*0.99) {
				camera.rot.x = Math.PI/2*0.99
			}
			if (camera.rot.x < -Math.PI/2*0.99) {
				camera.rot.x = -Math.PI/2*0.99
			}
			camera.rot.y -= deltaMove.x*sensitivity	
		}

		scrollElements(-deltaMove.x, -deltaMove.y)
	}
	
	// let deltaMove = {x: event.touches[0].clientX / cScale - mouse.x, y: event.touches[0].clientY / cScale - mouse.y}
	
    mouse.x = event.touches[0].clientX / cScale
	mouse.y = event.touches[0].clientY / cScale
	mobile = true
	mouse.has = true

	touches = {}
	for (let touch of event.touches) {
		touches[touch.identifier] = {x: touch.clientX / cScale, y: touch.clientY / cScale}
	}
	
})

addEventListener("touchend", (event) => {
	setTimeout(() => {
		for (let touch of event.changedTouches) {
			delete touches[touch.identifier]
		}
		if (Object.keys(touches).length <= 0) {
			mouse.ldown = false
		}
	}, 1000/fps)
	if (moved < 50 && downTime < 0.2) {
		mouse.lclick = true
	}
	mobile = true
	// mouse.x = event.touches[0].clientX / cScale
	// mouse.y = event.touches[0].clientY / cScale
	checkInputs(event)
	onClick()

	touches = {}
	for (let touch of event.touches) {
		touches[touch.identifier] = {x: touch.clientX / cScale, y: touch.clientY / cScale}
	}
})

addEventListener("touchcancel", (event) => {
	for (let touch of event.changedTouches) {
		delete touches[touch.identifier]
	}
	mobile = true
	if (focused) {
        focused.focused = false
	    focused = null
    }

	touches = {}
	for (let touch of event.touches) {
		touches[touch.identifier] = {x: touch.clientX / cScale, y: touch.clientY / cScale}
	}
})

document.addEventListener("contextmenu", function(event) {
    event.preventDefault()
})

window.addEventListener("wheel", (event) => {
	scrollElements(event.deltaX * su, event.deltaY * su)
})

function checkValidClick() {
	if (mobile) {
		// if ((mouse.x < 350*su && mouse.y < 100*su) || mouse.y > uiCanvas.height-100*su || (mouse.x < 400*su && mouse.y > uiCanvas.height-400*su)) {
		// 	return false
		// }
		// return false
		return mobileL || mobileR
	}
	return true
}

var joyStickPos = {x: 0, y: 0}