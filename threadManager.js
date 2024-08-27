
// setInterval(chunkTick, 1000/chunksPerSecond)
// setInterval(loadTick, 1000/chunksPerSecond)
// setInterval(setTick, 1000/setsPerSecond)

function orderTick() {
	if (!canOrder || !connected) { return }
	var geometries = {}
	for (let c in world) {
		var chunk = world[c]
		if (chunk.geometryT2.vertices.length > 0 && distance({x: chunk.pos.x*cs.x+cs.x/2, y: chunk.pos.y*cs.y+cs.y/2, z: chunk.pos.z*cs.z+cs.z/2}, camera.position) < 32) {
			geometries[c] = chunk.geometryT2
		}
	}
	if (geometries != {}) {
		canOrder = false
		chunkLoader.postMessage({task: "order", geometries: geometries, pos: camera.position })
	}
}

function setTick() {
	if (!canSet || setTickCooldown > 0 || !connected) { return }
	var toSet = []
	var nearby = {}
	var toRender = []
	var offs = [
		[1, 0, 0],
		[-1, 0, 0],
		[0, 1, 0],
		[0, -1, 0],
		[0, 0, 1],
		[0, 0, -1]
	]
	var setting = 0
	for (let i = 0; i < sets.length; i++) {
		if (setting >= 1000) {
			break
		}
		setting += 1
		var set = sets[i]
		var p = getPos(set[0], set[1], set[2])
		var chunkPos = p[0]
		var cp = compactChunk(chunkPos)
		if (!toRender.includes(cp) && world[cp]) {
			toRender.push(cp)
			for (let off of offs) {
				var cp3 = compactChunk({x:chunkPos.x+off[0], y:chunkPos.y+off[1], z:chunkPos.z+off[2]})
				nearby[cp3] = chunks[cp3]
			}
		}
		// X
		if (p[1].x == 0) {
			var cp2 = compactChunk({x:chunkPos.x-1, y:chunkPos.y, z:chunkPos.z})
			nearby[cp2] = chunks[cp2]
			if (!toRender.includes(cp2) && world[cp2]) {
				toRender.push(cp2)
				for (let off of offs) {
					var cp3 = compactChunk({x:chunkPos.x-1+off[0], y:chunkPos.y+off[1], z:chunkPos.z+off[2]})
					nearby[cp3] = chunks[cp3]
				}
			}
		}
		if (p[1].x == cs.x-1) {
			var cp2 = compactChunk({x:chunkPos.x+1, y:chunkPos.y, z:chunkPos.z})
			nearby[cp2] = chunks[cp2]
			if (!toRender.includes(cp2) && world[cp2]) {
				toRender.push(cp2)
				for (let off of offs) {
					var cp3 = compactChunk({x:chunkPos.x+1+off[0], y:chunkPos.y+off[1], z:chunkPos.z+off[2]})
					nearby[cp3] = chunks[cp3]
				}
			}
		}
		// Y
		if (p[1].y == 0) {
			var cp2 = compactChunk({x:chunkPos.x, y:chunkPos.y-1, z:chunkPos.z})
			nearby[cp2] = chunks[cp2]
			if (!toRender.includes(cp2) && world[cp2]) {
				toRender.push(cp2)
				for (let off of offs) {
					var cp3 = compactChunk({x:chunkPos.x+off[0], y:chunkPos.y-1+off[1], z:chunkPos.z+off[2]})
					nearby[cp3] = chunks[cp3]
				}
			}
		}
		if (p[1].y == cs.y-1) {
			var cp2 = compactChunk({x:chunkPos.x, y:chunkPos.y+1, z:chunkPos.z})
			nearby[cp2] = chunks[cp2]
			if (!toRender.includes(cp2) && world[cp2]) {
				toRender.push(cp2)
				for (let off of offs) {
					var cp3 = compactChunk({x:chunkPos.x+off[0], y:chunkPos.y+1+off[1], z:chunkPos.z+off[2]})
					nearby[cp3] = chunks[cp3]
				}
			}
		}
		// Z
		if (p[1].z == 0) {
			var cp2 = compactChunk({x:chunkPos.x, y:chunkPos.y, z:chunkPos.z-1})
			nearby[cp2] = chunks[cp2]
			if (!toRender.includes(cp2) && world[cp2]) {
				toRender.push(cp2)
				for (let off of offs) {
					var cp3 = compactChunk({x:chunkPos.x+off[0], y:chunkPos.y+off[1], z:chunkPos.z-1+off[2]})
					nearby[cp3] = chunks[cp3]
				}
			}
		}
		if (p[1].z == cs.z-1) {
			var cp2 = compactChunk({x:chunkPos.x, y:chunkPos.y, z:chunkPos.z+1})
			nearby[cp2] = chunks[cp2]
			if (!toRender.includes(cp2) && world[cp2]) {
				toRender.push(cp2)
				for (let off of offs) {
					var cp3 = compactChunk({x:chunkPos.x+off[0], y:chunkPos.y+off[1], z:chunkPos.z+1+off[2]})
					nearby[cp3] = chunks[cp3]
				}
			}
		}
		setBlock(set[0], set[1], set[2], set[3])
		toSet.push(set)
		sets.splice(i, 1)
		i -= 1
		nearby[cp] = chunks[cp]
		for (let off of offs) {
			var cp3 = compactChunk({x:chunkPos.x+off[0], y:chunkPos.y+off[1], z:chunkPos.z+off[2]})
			nearby[cp3] = chunks[cp3]
		}
	}
	if (toSet.length > 0) {
		canSet = false
		chunkLoader.postMessage({task: "set", sets: toSet, chunks: {}, toRender: toRender})
	}
}

function chunkTick() {
	if (!loadChunks || !connected) {
		return
	}
	if (!canTick || chunkTickCooldown > 0) {
		return
	}
	
	player.wpos.x -= cs.x/2
	player.wpos.z -= cs.z/2
	var toRender = []
	for (let x = 0; x < renderSize.x*2+1; x++) {
		for (let y = 0; y < renderSize.y*2+1; y++) {
			for (let z = 0; z < renderSize.z*2+1; z++) {
				toRender.push((x-renderSize.x+Math.round(player.wcpos.x/cs.x))+"," + (y-renderSize.y+Math.round(player.wcpos.y/cs.y)) + ","+(z-renderSize.z+Math.round(player.wcpos.z/cs.z)))
			}
		}
	}
	player.wpos.x += cs.x/2
	player.wpos.z += cs.z/2
	var offPos = {
		x: player.wpos.x-Math.sin(camera.rot.y)*Math.cos(camera.rot.x)*cs.x*2, 
		y: player.wpos.y+Math.sin(camera.rot.x)*cs.y*2, 
		z: player.wpos.z-Math.cos(camera.rot.y)*Math.cos(camera.rot.x)*cs.z*2
	}
	// player.wpos.x += cs.x/2
	// player.wpos.z += cs.z/2
	// test.pos = offPos
	// test.update()
	// for (let x = 0; x < renderSize.x*2; x++) {
	// 	for (let y = 0; y < renderSize.y*2; y++) {
	// 		for (let z = 0; z < renderSize.z*2; z++) {
	// 			toRender2.push((x-renderSize.x+Math.round(offPos.x/cs.x))+"," + (y-renderSize.y+Math.round(offPos.y/cs.y)) + ","+(z-renderSize.z+Math.round(offPos.z/cs.z)))
	// 		}
	// 	}
	// }
	for (let chunk in world) {
		if (!toRender.includes(chunk)) {
			world[chunk].delete()
			delete world[chunk]
			// delete chunks[chunk]
			if (loadingChunks.includes(chunk)) {
				loadingChunks.splice(loadingChunks.indexOf(chunk), 1)
			}
		}
	}

	var trSorted = []

	for (let i = 0; i < toRender.length; i++) {
		if (!world[toRender[i]] && !loadingChunks.includes(toRender[i])) {
			var pos = toRender[i].split(",")
			var d = distance({x: pos[0]*cs.x, y: pos[1]*cs.y, z: pos[2]*cs.z}, player.wcpos)
			trSorted.push([toRender[i], d])

			// var dx = Math.round(Math.sqrt((pos[0]*cs.x-player.wcpos.x)**2 + (pos[2]*cs.z-player.wcpos.z)**2)/cs.x+1)*cs.x
			// if (dx < fogDistance) {
			// 	fogDistance = dx
			// }
		}
	}

	trSorted.sort((a, b) => a[1] - b[1])

	var closestArr = []
	for (let i = 0; i < chunkLoadSpeed; i++) {
		if (i >= trSorted.length) {
			break
		}
		closestArr.push(trSorted[i][0])
	}

	// var pos = closest.split(",")
	// console.log(closest, {x: pos[0]*cs.x, y: pos[1]*cs.y, z: pos[2]*cs.z}, bd)
	// for (let i = 0; i < toRender2.length; i++) {
	// 	if (ca.includes(toRender2[i])) {
	// 		toRender2.splice(i, 1)
	// 		i -= 1
	// 	} else {
	// 		var pos = toRender2[i].split(",")
	// 		var d = distance({x: pos[0]*cs.x, y: pos[1]*cs.y, z: pos[2]*cs.z}, offPos)
	// 		if (d < bd || bd == 0) {
	// 			bd = d
	// 			closest = toRender2[i]
	// 		}
	// 	}
	// }

	if (closestArr.length > 0) {
		canTick = false
		for (let closest of closestArr) {
			var pos = expandChunk(closest)
			var nearby = {}
			var offs = [
				[0, 0, 0],
				[1, 0, 0],
				[-1, 0, 0],
				[0, 1, 0],
				[0, -1, 0],
				[0, 0, 1],
				[0, 0, -1],
			]
			for (let off of offs) {
				var c = compactChunk({x: pos.x+off[0], y: pos.y+off[1], z: pos.z+off[2]})
				// if (cSent.includes(c)) {continue}
				nearby[c] = chunks[c]
				cSent.push(c)
			}
			if (!loadingChunks.includes(closest) && connected) {
				loadingChunks.push(closest)
				if (!testGen) {
					sendMsg({"chunk": [pos.x, pos.y, pos.z]})
				}
			}
			
		}
		chunkLoader.postMessage({task: "render", rChunks: closestArr, chunks: nearby})
	} else {
		chunkTickCooldown = 1
	}
	// for (let chunk of toRender) {
	// 	if (!world[chunk]) {
			
	// 	}
	// }
}

function startLoad(chunk) {
	loadingChunks.splice(loadingChunks.indexOf(chunk), 1)
	toRender.push(chunk)
}

function loadTick() {
	if (!canTick || !connected) { return }
	var ds = []
	for (let chunk of toRender) {
		let e = expandChunk(chunk)
		ds.push([chunk, distance(player.wpos, {x: e.x*cs.x, y: e.y*cs.y, z: e.z*cs.z})])
		i++
	}
	ds.sort((a, b) => a[1] - b[1])
	toRender = []
	for (let d of ds) {
		toRender.push(d[0])
	}
	
	var toRender2 = []
	var nearby = {}
	var offs = [
		[0, 0, 0],
		[1, 0, 0],
		[-1, 0, 0],
		[0, 1, 0],
		[0, -1, 0],
		[0, 0, 1],
		[0, 0, -1],
	]
	for (let i = 0; i < chunkLoadSpeed; i++) {
		if (toRender.length <= 0) { break }
		let chunk = toRender[0]
		toRender.splice(0, 1)
		toRender2.push(chunk)
		var pos = expandChunk(chunk)
		for (let off of offs) {
			var c = compactChunk({x: pos.x+off[0], y: pos.y+off[1], z: pos.z+off[2]})
			// if (cSent.includes(c)) {continue}
			nearby[c] = chunks[c]
			// cSent.push(c)
			if (world[c]) {
				toRender2.push(c)
				for (let off2 of offs) {
					var c2 = compactChunk({x: pos.x+off[0]+off2[0], y: pos.y+off[1]+off2[1], z: pos.z+off[2]+off2[2]})
					nearby[c2] = chunks[c2]
				}
			}
		}
	}
	if (toRender2.length > 0) {
		canTick = false
		chunkLoader.postMessage({task: "render", rChunks: toRender2, chunks: nearby})
	}
}

chunkLoader.onmessage = function(event) {
  var data = event.data
	var task = data.task
	if (task == "render") {
		var rChunks = data.rChunks
		for (let chunk of rChunks) {
			chunksLoaded += 1
			if (!world[chunk]) {
				var pos = expandChunk(chunk)
				let c = new Chunk(pos.x, pos.y, pos.z)
				world[chunk] = c
			}
			world[chunk].render(data.geometries[chunk])
		}
		
		for (let newChunk in data.chunks) {
			chunks[newChunk] = data.chunks[newChunk]
		}
		canTick = true
		if (testGen || true) {
			addSets(data.sets)
		}
	} else if (task == "set") {
		canSet = true
		for (let geometry in data.geometries) {
			if (!world[geometry]) {
				var pos = expandChunk(geometry)
				var chunk = new Chunk(pos.x, pos.y, pos.z)
				world[geometry] = chunk
			}
			world[geometry].visible = true
			world[geometry].render(data.geometries[geometry])
		}
		for (let newChunk in data.chunks) {
			chunks[newChunk] = data.chunks[newChunk]
		}
	} else if (task == "order") {
		canOrder = true
		var newGeometry = data.newGeometry
		for (let chunk in newGeometry) {
			if (world[chunk]) {
				world[chunk].order(newGeometry[chunk])
			}
		}
	}
	// for (let geometry in data.geometries) {
	// 	var chunk = world[geometry]
	// 	// if (!chunk) {continue}
	// 	var pos = expandChunk(geometry)
	// 	if (!chunk) {
	// 		var chunk = new Chunk(pos.x, pos.y, pos.z)
	// 		world[geometry] = chunk
	// 	}
	// 	world[geometry].render(data.geometries[geometry])
	// }
	
}

chunkLoader.onerror = function(error) {
  console.error('Worker error:', error)
}