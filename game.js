
var particles = []
var lastwcpos = {x: 0, y: 0, z: 0}
var lastrd = {x: 0, y: 0, z: 0}

var startTime = 0

function gameTick() {
	startTime = performance.now()
	var oldPos = { ...player.pos }
	// time = 30
	// light = (Math.sin(time*Math.PI/60)+1)/2
	// aLight.intensity = light*0.9+0.35
	// console.log(l)
	// scene.background = new THREE.Color(0.529*light, 0.808*light, 0.922*light)
	// console.log(window.innerWidth, window.innerHeight)
	// var asp = 960/576
	// if (player.pos.y > 0) {
	// 	light.intensity = player.pos.y/worldSize.y
	// } else {
	// 	light.intensity = 0
	// }

	testText.text = "WOW, You found some 3D text! Big Number: " + Math.round(time)

	if (godmode) {
		dashForce = 1
		// airSpeed = 0.01
	} else {
		dashForce = 0.35
		// airSpeed = 0.003
	}

	inventoryOpen = !input.isMouseLocked()
	if (!inventoryOpen && selectedItem[0] != "none") {
		inventory = [...safeInventory]
		selectedItem = ["none", 0]
	}
	// var light2 = 1-Math.abs(Math.cos(time*0.01))
	// scene.background = new THREE.Color(135*light2, 206*light2, 235*light2)
	// aLight.intensity = light2
	// time += 1-Math.abs(Math.sin(time*0.01))+0.1
	// off.x = Math.sin(time*0.01)*aOff.x
	// off.z = Math.sin(time*0.01)*aOff.z
	// off.y = Math.abs(Math.cos(time*0.01))/2*aOff.y
	// requestAnimationFrame(render)

	frames += 1
	if (connecting <= 0) {
		player.tick()
	}
	player.wpos.x += player.pos.x - oldPos.x
	player.wpos.y += player.pos.y - oldPos.y
	player.wpos.z += player.pos.z - oldPos.z

	player.wcpos = { x: Math.floor(player.wpos.x / cs.x) * cs.x, y: Math.floor(player.wpos.y / cs.y) * cs.y, z: Math.floor(player.wpos.z / cs.z) * cs.z }
	player.pos = { x: player.wpos.x - player.wcpos.x, y: player.wpos.y - player.wcpos.y, z: player.wpos.z - player.wcpos.z }

	// if (JSON.stringify(player.wcpos) != lastwcpos || JSON.stringify(renderSize) != lastrd) {
	// 	let queues = getQueues()
	// 	toMeshQ = queues[0]
	// 	toGenerateQ = queues[1]
	// 	lastwcpos = JSON.stringify(player.wcpos)
	// 	lastrd = JSON.stringify(renderSize)
	// }

	testText.pos = { x: 0 - player.wcpos.x, y: 100 - player.wcpos.y, z: 0.02 - player.wcpos.z }
	testText.update()

	for (let i = 0; i < particles.length; i++) {
		if (!particles[i].move()) {
			particles.splice(i, 1)
			i--
		}
	}

	clickSlow -= delta
	if (mouse.lclick || mouse.rclick) {
		clickSlow = 0.05
	}

	inInventory -= delta
	if (inventoryOpen) {
		inInventory = 0.1
	}

	chunkTickCooldown -= delta
	setTickCooldown -= delta
	showName -= delta
	if (showName < 0) {
		showName = 0
	}

	sky.pos.x = -player.wcpos.x + player.wpos.x
	sky.pos.y = 70 - player.wcpos.y + player.wpos.y
	sky.pos.z = -player.wcpos.z + player.wpos.z

	for (let i = 0; i < 10; i++) {
		var i2 = 0
		if (i < 9) {
			i2 = i + 1
		}
		if (jKeys["Digit" + i2]) {
			if (selected == i && showName > 0) {
				showName = 2.75
			} else {
				showName = 3
			}
			selected = i
		}
	}

	if (inventory[selected][0] != lastHeldItem) {
		showName = 3
	}
	lastHeldItem = inventory[selected][0]

	if (fps == 0) {
		fps = Math.round(1 / delta)
		newFPS = Math.round(1 / delta)
	}

	fps += (newFPS - fps) * delta
	cps += (newCPS - cps) * delta

	var chunkPos = { x: player.wcpos.x + cs.x / 2, y: player.wcpos.y + cs.y / 2, z: player.wcpos.z + cs.z / 2 }
	var offs = [
		[0, 0, 0],
		[cs.x, 0, 0],
		[-cs.x, 0, 0],
		[0, cs.y, 0],
		[0, -cs.y, 0],
		[0, 0, cs.z],
		[0, 0, -cs.z]
	]
	for (let i in offs) {
		borders[i].pos = { x: cs.x / 2, y: cs.y / 2, z: cs.z / 2 }
		borders[i].pos.x += offs[i][0]
		borders[i].pos.y += offs[i][1]
		borders[i].pos.z += offs[i][2]
		let c = [Math.floor((borders[i].pos.x + player.wcpos.x) / cs.x), Math.floor((borders[i].pos.y + player.wcpos.y) / cs.y), Math.floor((borders[i].pos.z + player.wcpos.z) / cs.z)].join(",")
		if (world[c] || true) {
			borders[i].pos.y -= 1000
		}
	}

	data = {
		x: safe(player.wpos.x),
		y: safe(player.wpos.y),
		z: safe(player.wpos.z),
		rx: safe(camera.rot.x),
		ry: safe(player.rot.y),
		hr: safe(player.headRot),
		sf: safe(player.speedF),
		cy: safe(cameraYTarget),
		a: anims.indexOf(player.anim),
		p: playerT,
		i: inventory[selected][0],
		u: username,
        ig: true
	}

	if (keys["Escape"]) {
		input.unlockMouse()
	}

	var ct = { x: player.pos.x + Math.sin(camera.rot.y + Math.PI / 2) * 1, y: player.pos.y, z: player.pos.z + Math.cos(camera.rot.y + Math.PI / 2) * 1 }

	var r = raycast3D({x: player.pos.x, y: player.pos.y+cameraY, z: player.pos.z}, camera.rot, 10)
	rp = { ...r[1] }
	// let tries = 0
	// while (tries < 250 && r[0] < 10) {
	// 	r[1].x += Math.sin(camera.rot.y) * Math.cos(-camera.rot.x) * 0.01
	// 	r[1].y += Math.sin(-camera.rot.x) * 0.01
	// 	r[1].z += Math.cos(camera.rot.y) * Math.cos(-camera.rot.x) * 0.01
	// 	tries += 1
	// 	if (getBlock(Math.round(r[1].x - 0.5), Math.round(r[1].y - 0.5), Math.round(r[1].z - 0.5)) != 0) {
	// 		break
	// 	}
	// }
	// if (tries >= 100 && r[0] < 10) {
	// 	tries = 0
	// 	r[1].x += Math.sin(camera.rot.y) * Math.cos(-camera.rot.x) * 1
	// 	r[1].y += Math.sin(-camera.rot.x) * 1
	// 	r[1].z += Math.cos(camera.rot.y) * Math.cos(-camera.rot.x) * 1
	// 	while (tries < 100 && r[0] < 10) {
	// 		r[1].x += Math.sin(camera.rot.y) * Math.cos(-camera.rot.x) * 0.01
	// 		r[1].y += Math.sin(-camera.rot.x) * 0.01
	// 		r[1].z += Math.cos(camera.rot.y) * Math.cos(-camera.rot.x) * 0.01
	// 		tries += 1
	// 		if (getBlock(Math.round(r[1].x - 0.5), Math.round(r[1].y - 0.5), Math.round(r[1].z - 0.5), true, true, false, false, true) != 0) {
	// 			break
	// 		}
	// 	}
	// }

	indicator.pos = { x: Math.round(r[1].x + 0.5) - 0.5, y: Math.round(r[1].y + 0.5) - 0.5, z: Math.round(r[1].z + 0.5) - 0.5 }
	indicator.visible = r[0] < 10 && getBlock(indicator.pos.x, indicator.pos.y, indicator.pos.z, true, true, false, false, true) != 0
	// indicator.update()

    username = usernameBox.text

	// if (raycast3D(ct, camera.rotation, 3)[0] > 0.1) {
	// 	cameraOff.x += (ct.x-cameraOff.x)/5
	// 	cameraOff.y += (ct.y-cameraOff.y)/5
	// 	cameraOff.z += (ct.z-cameraOff.z)/5
	// } else {
	// 	cameraOff.x += (player.pos.x-cameraOff.x)/5
	// 	cameraOff.y += (player.pos.y-cameraOff.y)/5
	// 	cameraOff.z += (player.pos.z-cameraOff.z)/5
	// }

	// var raycast = raycast3D(cameraOff, camera.rotation, 3)
	// while (raycast[0] < 0.25 && distance(cameraOff, player.pos) > 0.1) {
	// 	cameraOff.x += (player.pos.x-cameraOff.x)/5
	// 	cameraOff.y += (player.pos.y-cameraOff.y)/5
	// 	cameraOff.z += (player.pos.z-cameraOff.z)/5
	// 	raycast = raycast3D(cameraOff, camera.rotation, 3)
	// }

	// target.position.set(player.pos.x, player.pos.y, player.pos.z)
	// light.position.set(player.pos.x+off.x, player.pos.y+off.y, player.pos.z+off.z)
	// light.shadow.camera.left = -80
	// light.shadow.camera.right = 80
	// light.shadow.camera.far = 80
	// light.shadow.camera.near = -80
	// light.shadow.camera.top = 80
	// light.shadow.camera.bottom = -80
	// light.shadow.camera.updateProjectionMatrix()

	for (let player in players) {
		if (!playerData[player]) {
			players[player].delete()
			delete players[player]
			return
		}
		if (!playerData[player].ig) {
			chat.push((playerData[player].u ? playerData[player].u : "Unnamed") + " left :(")
			if (chat.length > 5) {
				chat.splice(0, 1)
			}
			chatBox.stop = 3

			players[player].delete()
			delete players[player]
			delete playerData[player]
			return
		}
	}

	for (let player in playerData) {
		if (playerData[player] && player != id) {
			if (playerData[player].ig && !players[player]) {
				players[player] = new Player(0, 0, 0)
				joining.push(player)
			}
		}
	}

	var gplayer = player
	for (let player in players) {
		if (!playerData[player]) { continue }
        if (!playerData[player].ig) {
            players[player].visible = false
            return
        }
        players[player].visible = true
		players[player].pos2.x = interp(players[player].pos2.x, playerData[player].x, 15, 10)
		players[player].pos2.y = interp(players[player].pos2.y, playerData[player].y, 15, 10)
		players[player].pos2.z = interp(players[player].pos2.z, playerData[player].z, 15, 10)
		players[player].pos.x = players[player].pos2.x - gplayer.wcpos.x
		players[player].pos.y = players[player].pos2.y - gplayer.wcpos.y
		players[player].pos.z = players[player].pos2.z - gplayer.wcpos.z
		players[player].speedF += (playerData[player].sf - players[player].speedF) * delta * 10
		players[player].cameraY += (playerData[player].cy - players[player].cameraY) * delta * 10
		// players[player].cameraY = playerData[player].cy
		players[player].rotating -= 1
		if (itemData[playerData[player].i]) {
			players[player].selectedItem = playerData[player].i
		}

		players[player].handRotOffset += players[player].hroVel * delta
		players[player].hroVel -= 1000 * delta

		if (players[player].handRotOffset < 0) {
			players[player].handRotOffset = 0
		}

		if (players[player].rotating > 0) {
			players[player].rot.y += 0.25
		} else {
			players[player].rot.y = intAngle(players[player].rot.y, playerData[player].ry, 1 / 10)
		}

		players[player].headRot += (playerData[player].hr - players[player].headRot) / 10

		if (playerData[player].c == 0) {
			players[player].colour = [0, 0.5, 1]
		} else {
			players[player].colour = [1, 1, 1]
		}

		if (Object.keys(playerData[player]).includes("u")) {
			players[player].usernameText = playerData[player].u
		}
		// players[player].attack.pos = players[player].pos
		// players[player].attack.visible = false//players[player].attacking > 0
		// players[player].attack.size.x = (5-Math.abs(5 - players[player].attacking))/2
		// players[player].attack.size.y = (5-Math.abs(5 - players[player].attacking))/2
		// players[player].attack.size.z = (5-Math.abs(5 - players[player].attacking))/2
		// players[player].attack.update()
		players[player].attacking -= 1

		players[player].model[1].rot.x += (playerData[player].rx - players[player].model[1].rot.x) * delta * 15
		players[player].anim = anims[playerData[player].a]
		players[player].updateTexture(playerData[player].p)
		for (let model of players[player].model) {
			model.box.updateBuffers()
		}
		players[player].updateModel()
		// players[player].update()
		// if (playerData[player].username != null) {
		// 	players[player].username.text = playerData[player].username
		// 	players[player].username.pos = {...players[player].pos}
		// 	players[player].username.pos.y += 0.5
		// 	players[player].username.lookAtCam()
		// 	players[player].username.update()
		// }

	}

	// for (let set of sets) {
	// 	setBlock(set[0], set[1], set[2], set[3])
	// }

	// for (let chunk in world) {
	// 	world[chunk].updateShader()
	// }

	// if (transparent.includes(getBlock(indicator.pos.x, indicator.pos.y, indicator.pos.z))) {
	// 	if (indicator.box.rOrder == 0) {
	// 		indicator.box.rOrder = 2000
	// 		// webgl.sortObjs()
	// 	}
	// 	indicator.box.rOrder = 2000
	// } else {
	// 	if (indicator.box.rOrder == 2000) {
	// 		indicator.box.rOrder = 0
	// 		// webgl.sortObjs()
	// 	}
	// 	indicator.box.rOrder = 0
	// }

	if (jKeys["KeyP"]) {
		thirdPerson = !thirdPerson
	}

	if (keys["KeyC"] && !inventoryOpen) {
		cameraYTarget = 0.25
	} else {
		cameraYTarget = 0.75
	}

	player.visible = rDistance > 0.5
	camera.pos = { ...player.pos }
	cameraY += (cameraYTarget - cameraY) * delta * 10
	camera.pos.y += cameraY

	// camera.position.set(cameraOff.x, cameraOff.y, cameraOff.z)

	if (thirdPerson) {
		rDistance += (4 - rDistance) * delta * 10
	} else {
		rDistance += (0 - rDistance) * delta * 10
	}

	if (rDistance > 0.5) {
		var raycast = raycast3D(camera.pos, { x: camera.rot.x + Math.PI, y: camera.rot.y, z: -camera.rot.z }, rDistance)
		camera.pos.x -= Math.sin(camera.rot.y) * Math.cos(-camera.rot.x) * (raycast[0])
		camera.pos.y -= Math.sin(-camera.rot.x) * (raycast[0])
		camera.pos.z -= Math.cos(camera.rot.y) * Math.cos(-camera.rot.x) * (raycast[0])
	}

	player.usernameText = username
	player.updateModel()
	
	sortChunks()

	if (player.sprinting) {
		targetFOV = dFov+20
	} else {
		targetFOV = dFov
	}
	fov += (targetFOV - fov) * delta * 10

	// webgl.setView(camera)
	// webgl.setupFrame([0.529, 0.808, 0.922, 1])
	// webgl.setupFrame([0, 0, 0, 1])

	webgpu.lightBuffer = new Float32Array([lightDir.x, lightDir.y, lightDir.z, 0, 1, 1, 1, 0])
    webgpu.cameraBuffer = new Float32Array([camera.pos.x, camera.pos.y, camera.pos.z, 0])

	webgpu.render([0.529, 0.808, 0.922, 1])

    renderUI()

	chunkTick()
}

var lastCp = {}

function sortChunks() {
	// webgl.setView(camera)

	// let viewProjection = mat4.create()
	// mat4.perspective(projection, fov * Math.PI / 180, canvas.width / canvas.height, 0.01, 5000)

	// mat4.multiply(viewProjection, projection, view)

	let cp = {x: Math.floor(player.wcpos.x/cs.x), y: Math.floor(player.wcpos.y/cs.y), z: Math.floor(player.wcpos.z/cs.z)}

	if (JSON.stringify(cp) != lastCp) {
		movedChunk()
		lastCp = JSON.stringify(cp)
	}

	planes = extractFrustumPlanes(webgpu.getViewMatrix(camera, fov))
	for (let chunk2 in chunks) {
		var chunk = chunks[chunk2]
		if (chunk.empty || !chunk.meshed) continue
		var p = { x: chunk.pos.x - player.wcpos.x + cs.x / 2, y: chunk.pos.y - player.wcpos.y + cs.y / 2, z: chunk.pos.z - player.wcpos.z + cs.z / 2 }
		// let visible = isCubeInFrustum([p.x, p.y, p.z], cs.x*10, planes)
		let visible = true
		// let d = Math.sqrt((camera.pos.x - p.x)**2 + (camera.pos.z - p.z)**2)
		// let xzangle = Math.atan2(camera.pos.x - p.x, camera.pos.z - p.z)
		// let dyangle = Math.atan2(player.wpos.y - chunk.pos.y, d)
		// let xfov = fov * (Math.PI/180) * 2
		// let visible = Math.abs(angleDistance(xzangle+xfov/2, camera.rot.y)) < xfov || d < cs.x*2
		// let visible = Math.abs(angleDistance(Math.atan2(p.z - player.pos.z - Math.cos(player.cameraY) * diffy, p.x - player.pos.x - Math.sin(player.cameraY) * diffy), -player.rot.y - Math.PI / 5)) < Math.PI / 5
		chunk.forceVis += delta
		if (chunk.forceVis > 1) {
			chunk.forceVis = 1
			chunk.visible = true
		}
		if (chunk.mesh) chunk.mesh.visible = visible && chunk.visible
		if (chunk.meshT) chunk.meshT.visible = visible && chunk.visible
	}
}

function movedChunk() {
	for (let chunk2 in chunks) {
		chunks[chunk2].updatePos()
	}
}

var planes

setInterval(() => {
	if (showFPS) {
		console.log(frames)
	}
	newCPS = chunksLoaded
	chunksLoaded = 0
	newFPS = frames
	frames = 0
}, 1000)



function getSetPoses(sets) {
	let setsPos = []
	for (let set of sets) {
		setsPos.push([set[0], set[1], set[2]].join(","))
	}
	return setsPos
}

// function addSets(sets2, replace = false, start = 0, setted = []) {
// 	let i2 = 0
// 	for (let set of sets2) {
// 		if (i2 < start) {
// 			i2++
// 			continue
// 		}
// 		if (set.length < 5) {
// 			set.push(replace)
// 		}
// 		set[4] = replace
// 		let pos = getPos(set[0], set[1], set[2])
// 		let c = [pos[0].x, pos[0].y, pos[0].z].join(",")
// 		if (!chunkSets[c]) {
// 			chunkSets[c] = []
// 		}
// 		let i = getSetPoses(chunkSets[c]).indexOf([set[0], set[1], set[2]].join(","))
// 		if (i != -1) {
// 			if (replace || ((setted.includes([set[0], set[1], set[2]].join(",")) || set[3] < chunkSets[c][i][3]) && !chunkSets[c][i][4])) {
// 				sets.push(set)
// 				chunkSets[c][i] = set
// 				setted.push([set[0], set[1], set[2]].join(","))
// 			}
// 		} else {
// 			sets.push(set)
// 			chunkSets[c].push(set)
// 			setted.push([set[0], set[1], set[2]].join(","))
// 		}
// 		i2++
// 		if (i2 - start > 100) {
// 			setTimeout(() => {
// 				addSets(sets2, replace, i2, setted)
// 			}, 100)
// 			return
// 		}
// 	}
// }

function clearInv() {
	inventory = []
	for (let i = 0; i < 51; i++) {
		inventory.push(["none", 0])
	}
}

function getPlayersCode(doMenu=false) {
	let usernames = []
	for (let player in playerData) {
		let u = playerData[player].u
		if (!u) {
			u = "Unnamed"
		}
		if (!playerData[player].ig && !doMenu) {
			continue
		}
		usernames.push(u)
	}
	return usernames
}

function getPlayers() {
	let usernames = []
	for (let player in playerData) {
		let u = playerData[player].u
		if (!u) {
			u = "Unnamed"
		}
		if (!playerData[player].ig && !doMenu) {
			continue
		}
		usernames.push([u, player])
	}

	let str = "Players:"
	for (let username of usernames) {
		str += ` ${username[0]} (ID: ${username[1]})`
	}
	console.log(str)
}

function tp(id) {
	if (!Object.keys(playerData).includes(id)) {
		console.log("That player does not exist!")
		getPlayers()
		return
	}
	player.wpos.x = playerData[id].x
	player.wpos.y = playerData[id].y
	player.wpos.z = playerData[id].z
}

function extractFrustumPlanes(viewProjectionMatrix) {
    let planes = [];

    for (let i = 0; i < 6; i++) {
        planes.push([0, 0, 0, 0])
    }

    planes[0][0] = viewProjectionMatrix[3] + viewProjectionMatrix[0]
    planes[0][1] = viewProjectionMatrix[7] + viewProjectionMatrix[4]
    planes[0][2] = viewProjectionMatrix[11] + viewProjectionMatrix[8]
    planes[0][3] = viewProjectionMatrix[15] + viewProjectionMatrix[12]

    planes[1][0] = viewProjectionMatrix[3] - viewProjectionMatrix[0]
    planes[1][1] = viewProjectionMatrix[7] - viewProjectionMatrix[4]
    planes[1][2] = viewProjectionMatrix[11] - viewProjectionMatrix[8]
    planes[1][3] = viewProjectionMatrix[15] - viewProjectionMatrix[12]

    planes[2][0] = viewProjectionMatrix[3] + viewProjectionMatrix[1]
    planes[2][1] = viewProjectionMatrix[7] + viewProjectionMatrix[5]
    planes[2][2] = viewProjectionMatrix[11] + viewProjectionMatrix[9]
    planes[2][3] = viewProjectionMatrix[15] + viewProjectionMatrix[13]

    planes[3][0] = viewProjectionMatrix[3] - viewProjectionMatrix[1]
    planes[3][1] = viewProjectionMatrix[7] - viewProjectionMatrix[5]
    planes[3][2] = viewProjectionMatrix[11] - viewProjectionMatrix[9]
    planes[3][3] = viewProjectionMatrix[15] - viewProjectionMatrix[13]

    planes[4][0] = viewProjectionMatrix[3] + viewProjectionMatrix[2]
    planes[4][1] = viewProjectionMatrix[7] + viewProjectionMatrix[6]
    planes[4][2] = viewProjectionMatrix[11] + viewProjectionMatrix[10]
    planes[4][3] = viewProjectionMatrix[15] + viewProjectionMatrix[14]

    planes[5][0] = viewProjectionMatrix[3] - viewProjectionMatrix[2]
    planes[5][1] = viewProjectionMatrix[7] - viewProjectionMatrix[6]
    planes[5][2] = viewProjectionMatrix[11] - viewProjectionMatrix[10]
    planes[5][3] = viewProjectionMatrix[15] - viewProjectionMatrix[14]

    for (let i = 0; i < 6; i++) {
        let length = Math.sqrt(planes[i][0] * planes[i][0] + planes[i][1] * planes[i][1] + planes[i][2] * planes[i][2])
        planes[i][0] /= length
        planes[i][1] /= length
        planes[i][2] /= length
        planes[i][3] /= length
    }

    return planes
}
 
function isCubeInFrustum(cubeCenter, cubeSize, frustumPlanes) {
	if (!frustumPlanes) return true
    let halfSize = cubeSize / 2

    for (let i = 0; i < 6; i++) {
        let plane = frustumPlanes[i]

        let allCornersOutside = true

        for (let x = -1; x <= 1; x += 2) {
            for (let y = -1; y <= 1; y += 2) {
                for (let z = -1; z <= 1; z += 2) {
                    let corner = [
                        cubeCenter[0] + x * halfSize,
                        cubeCenter[1] + y * halfSize,
                        cubeCenter[2] + z * halfSize
                    ]

                    if (plane[0] * corner[0] + plane[1] * corner[1] + plane[2] * corner[2] + plane[3] > 0) {
                        allCornersOutside = false
                        break
                    }
                }
                if (!allCornersOutside) break
            }
            if (!allCornersOutside) break
        }

        if (allCornersOutside) return false
    }

    return true
}
