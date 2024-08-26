function chunkLoaded(x, y, z) {
    let id = x+","+y+","+z
    if (id in chunks) {
        if (chunks[id].generated && chunks[id].networkLoaded) {
            return true
        }
    }
    return false
}

var renderPoses = []

var toMeshQ = []
var toGenerateQ = []

function requestRender(x, y, z) {
    let id = x+","+y+","+z
    if (id in chunks) {
        chunks[id].meshed = false
    }
}

var loadedChunks = 0

function getQueues() {
    let toMesh = []
    let toGenerate = []
    renderPoses = []
    let offs = [
        [-1, 0, 0],
        [1, 0, 0],
        [0, -1, 0],
        [0, 1, 0],
        [0, 0, -1],
        [0, 0, 1]
    ]
    loadedChunks = 0
    for (let x = 0; x < renderSize.x*2+3; x++) {
        for (let y = 0; y < renderSize.y*2+3; y++) {
            for (let z = 0; z < renderSize.z*2+3; z++) {
                let border = (
                    x == 0 || x >= renderSize.x*2+2 ||
                    y == 0 || y >= renderSize.y*2+2 ||
                    z == 0 || z >= renderSize.z*2+2 
                )
                let cx = x-renderSize.x-1 + Math.floor(player.wcpos.x / cs.x)
                let cy = y-renderSize.y-1 + Math.floor(player.wcpos.y / cs.y)
                let cz = z-renderSize.z-1 + Math.floor(player.wcpos.z / cs.z)
                let id = [cx, cy, cz].join(",")
                renderPoses.push(id)
                if (!(id in chunks)) {
                    let inCamera = isCubeInFrustum([cx*cs.x+cs.x/2 - player.wcpos.x, cy*cs.y+cs.y/2 - player.wcpos.y, cz*cs.z+cs.z/2 - player.wcpos.z], cs.x*3, planes)
                    let d = Math.sqrt((cx*cs.x - player.wcpos.x)**2 + (cy*cs.y - player.wcpos.y)**2 + (cz*cs.z - player.wcpos.z)**2)
                    toGenerate.push([id, inCamera ? d-renderSize.x*cs.x : d])
                } else {
					let chunk = chunks[id]
                    if (chunk.generated && chunk.networkLoaded && !chunk.meshed) {
                        if (!border) {
                            let inCamera = isCubeInFrustum([cx*cs.x+cs.x/2 - player.wcpos.x, cy*cs.y+cs.y/2 - player.wcpos.y, cz*cs.z+cs.z/2 - player.wcpos.z], cs.x*3, planes)
                            let nearby = true
                            offs.map((off) => {if (!chunkLoaded(cx+off[0], cy+off[1], cz+off[2])) nearby = false})
                            if (nearby) {
                                let d = Math.sqrt((cx*cs.x - player.wcpos.x)**2 + (cy*cs.y - player.wcpos.y)**2 + (cz*cs.z - player.wcpos.z)**2)
                                toMesh.push([id, inCamera ? d-renderSize.x*cs.x : d])
                            }
                        }
                    } else if (chunk.generated && !chunk.networkLoaded) {
                        chunk.networkTimeout += delta
                        if (chunk.networkTimeout > 1) {
                            chunk.networkTimeout = 0
                            sendMsg({"chunk": [cx, cy, cz]})
                        }
                    } else {
                        loadedChunks += 1
                    }
                    if (id in sets) {
                       doSets(id, cx, cy, cz)
                    }
                }
            }
        }
    }
    toMesh.sort((a, b) => (a[1] - b[1]))
    toGenerate.sort((a, b) => (a[1] - b[1]))
    return [toMesh, toGenerate]
}

var skipMesh = false

function doSets(id, cx, cy, cz) {
	for (let set of sets[id]) {
		chunks[id].blocks[(set[0]-chunks[id].pos.x)*cs.y*cs.z + (set[1]-chunks[id].pos.y)*cs.z + (set[2]-chunks[id].pos.z)] = set[3]
		if (set[0]-chunks[id].pos.x <= 0) requestRender(cx-1, cy, cz)
		if (set[0]-chunks[id].pos.x >= cs.x-1) requestRender(cx+1, cy, cz)
		if (set[1]-chunks[id].pos.y <= 0) requestRender(cx, cy-1, cz)
		if (set[1]-chunks[id].pos.y >= cs.y-1) requestRender(cx, cy+1, cz)
		if (set[2]-chunks[id].pos.z <= 0) requestRender(cx, cy, cz-1)
		if (set[2]-chunks[id].pos.z >= cs.z-1) requestRender(cx, cy, cz+1)
	}
	delete sets[id]
	chunks[id].meshed = false
}

function chunkTick() {
    let queues = getQueues()
    toMeshQ = queues[0]
    toGenerateQ = queues[1]
    if (keys["KeyU"]) {
        startTime = performance.now()+11
    }

 
    let toMesh = toMeshQ
    let toGenerate = toGenerateQ
    let offs = [
        [-1, 0, 0],
        [1, 0, 0],
        [0, -1, 0],
        [0, 1, 0],
        [0, 0, -1],
        [0, 0, 1]
    ]
    // for (let chunk in chunks) {
    //     if (!poses.includes(chunk)) {
    //         chunks[chunk].delete()
    //         delete chunks[chunk]
    //     }
    // }
    let loops = 0
	let done = false
    while (performance.now() - startTime < 5 || !done) {
        loops++
		done = false
        // let idd = Object.keys(chunks)[Math.round(Math.random()*(Object.keys(chunks).length-1))]
        // if (idd in chunks && !poses.includes(idd)) {
        //     chunks[idd].delete()
        //     delete chunks[idd]
        // }
        if (toMesh.length > 0 && !skipMesh) {
            let id = toMesh[0][0]
            chunks[id].createMesh()
            toMesh.shift()
            done = true
        } else if (toGenerate.length > 0) {
            skipMesh = false
            let id = toGenerate[0][0]
            let pos = id.split(",").map(a => parseInt(a))
            let cx = pos[0]
            let cy = pos[1]
            let cz = pos[2]
            chunks[id] = new Chunk(cx*cs.x, cy*cs.y, cz*cs.z)
            chunks[id].generate()
            toGenerate.shift()
            sendMsg({"chunk": [cx, cy, cz]})
            done = true
        }
        
        if (!done) break
        chunksLoaded += 1
    }

    let dx = 0
    let dy = 0
    let dz = 0
    for (let chunk in chunks) {
        dx = chunks[chunk].pos.x - player.wcpos.x
        dy = chunks[chunk].pos.y - player.wcpos.y
        dz = chunks[chunk].pos.z - player.wcpos.z
        if (Math.abs(dx) > renderSize.x*cs.x || Math.abs(dy) > renderSize.y*cs.y || Math.abs(dz) > renderSize.z*cs.z) {
            chunks[chunk].delete()
            chunks[chunk].meshed = false
            if (Math.abs(dx) > (renderSize.x+1)*cs.x || Math.abs(dy) > (renderSize.y+1)*cs.y || Math.abs(dz) > (renderSize.z+1)*cs.z) delete chunks[chunk]
        }
    }
}

function generateChunk(cx, cy, cz) {
    let xo = cx*cs.x
    let yo = cy*cs.y
    let zo = cz*cs.z
    var chunkxz = []
    var sets = []
    for (let x = 0; x < cs.x; x++) {
        for (let z = 0; z < cs.z; z++) {
            let oceans = (simplex2D((x+xo)/500, (z+zo)/500)/2+0.5)
            let hills = (simplex2D((x+xo)/50, (z+zo)/50)/2+0.5)/10
            let littleHills = (simplex2D((x+xo)/20, (z+zo)/20)/2+0.5)/50
            let height = Math.round((oceans+hills+littleHills)*worldSize.y)
            for (let y = 0; y < cs.y; y++) {
                // let gen2 = (simplex3D(((x+xo)+29332)/60, ((y+yo)+72932)/30, ((z+zo)+63232)/60)+1)
                // let gen3 = (simplex3D(((x+xo)+81943)/200, ((y+yo)+46193)/66, ((z+zo)+12345)/200)+1) * (simplex3D(((x+xo)+76544)/60, ((y+yo)+42234)/30, ((z+zo)+12121)/60)+1) / 1.5
                // if (gen3 < gen2) {
                //     gen2 = gen3
                // }
                let caveGen = Math.abs(0.5-(simplex3D(((x+xo)+84948)/50, ((y+yo)+93939)/50, ((z+zo)+39232)/50)/2+0.5))*2
                caveGen += Math.abs(0.5-(simplex3D(((x+xo)+24939)/45, ((y+yo)+46474)/45, ((z+zo)+99384)/45)/2+0.5))*2
                caveGen += Math.abs(0.5-(simplex3D(((x+xo)+88883)/30, ((y+yo)+54544)/30, ((z+zo)+34098)/30)/2+0.5))*2
                caveGen /= 4
                caveGen += simplex3D(((x+xo)+58383)/100, ((y+yo)+49393)/100, ((z+zo)+12345)/100)/4
                // caveGen *= 3
                let gen2 = 1
                if ((y+yo <= height || gen2 < 0.1) && caveGen < 0.4) {
                    if (y+yo <= height-5) {
                        chunkxz.push(7)
                    } else if (y+yo < waterLevel) {
                        chunkxz.push(9)
                    } else if (y+yo == height) {
                        chunkxz.push(2)
                        if (srand(x+xo+(y+yo)*10000+(z+zo)*10000*10000) > 0.99) {
                            sets.push(...generateStructure(x+xo, y+yo, z+zo, "tree"))
                        } else if (srand(x+593858+xo+(y+99896596+yo)*10000+(z+3485673+zo)*10000*10000) > 0.95) {
							sets.push([x+xo, y+yo+1, z+zo, 45])
						} else if (srand(x+568475+xo+(y+77777777+yo)*10000+(z+5743664+zo)*10000*10000) > 0.99) {
							sets.push([x+xo, y+yo+1, z+zo, 46])
						} else if (srand(x+978484+xo+(y+12345674+yo)*10000+(z+3456747+zo)*10000*10000) > 0.99) {
							sets.push([x+xo, y+yo+1, z+zo, 53])
						}
                    } else {
                        chunkxz.push(1)
                    }
                } else if (caveGen >= 0.4 && y+yo < height) {
                    chunkxz.push(0)
                } else {
                    if (y+yo < waterLevel) {
                        chunkxz.push(6)
                    } else {
                        chunkxz.push(0)
                    }  
                }
            }
        }
    }

    let chunk = []
    for (let x = 0; x < cs.x; x++) {
        for (let y = 0; y < cs.y; y++) {
            for (let z = 0; z < cs.z; z++) {
                chunk.push(chunkxz[x*cs.z*cs.y+z*cs.y+y])
            }
        }
    }

    return [chunk, sets]
}

function generateStructure(x, y, z, name) {
    let sets = []
    if (name == "tree") {
        for (let i = 0; i < 3; i++) {
            sets.push([x, y+1+i, z, 3])
        }
        for (let y2 = 0; y2 < 2; y2++) {
            for (let x2 = -2; x2 < 3; x2++) {
                for (let z2 = -2; z2 < 3; z2++) {
                    sets.push([x+x2, y+4+y2, z+z2, 4])
                }
            }
        }
        sets.push([x, y+6, z, 4])
        sets.push([x, y+7, z, 4])

        sets.push([x-1, y+6, z, 4])
        sets.push([x-1, y+7, z, 4])

        sets.push([x+1, y+6, z, 4])
        sets.push([x+1, y+7, z, 4])

        sets.push([x, y+6, z-1, 4])
        sets.push([x, y+7, z-1, 4])

        sets.push([x, y+6, z+1, 4])
        sets.push([x, y+7, z+1, 4])
    }
    return sets
}

function addSets(sets, replace=true) {
    for (let set of sets) {
        addSet(set, replace)
    }
}

function addSet(set, replace=true) {
    let chunk = Math.floor(set[0]/cs.x)+","+Math.floor(set[1]/cs.y)+","+Math.floor(set[2]/cs.z)
    if (chunk in sets) {
        let poses = getSetPoses(sets[chunk])
        if (poses.includes(set[0]+","+set[1]+","+set[2])) {
            if (replace) {
                sets[chunk].push(set)
            }
        } else {
            sets[chunk].push(set)
        }
    } else {
        sets[chunk] = [set]
    }
}

// function generateChunk(xOff, yOff, zOff) {
// 	xOff = parseInt(xOff)
// 	zOff = parseInt(zOff)
// 	yOff = parseInt(yOff)
// 	var chunk = []
// 	var sets = []
	
// 	for (let x = 0; x < cs.x; x++) {
// 		var x2 = x+xOff*cs.x
// 		for (let y = 0; y < cs.y; y++) {
// 			var y2 = y+yOff*cs.y
// 			for (let z = 0; z < cs.z; z++) {
// 				var z2 = z+zOff*cs.z
// 				// spread = ( Math.sin(x2/150)+Math.cos(x2/100)+Math.sin(x2/250) 
// 				// 					+ Math.sin(z2/100)+Math.cos(z2/150)+Math.sin(z2/250) ) / 6 * 50
// 				// if (spread < 1) {
// 				// 	spread = 1
// 				// }
// 				// var gen = noise.perlin3((x2+37432)/15, (y2+53723)/15, (z2+95820)/15)
// 				// gen +- 0.0-noise.perlin3((x2+95028)/15, (y2+45720)/15, (z2+57294)/15)
// 				// genSpread = Math.round(genSpread*100)/100

// 				var genSpread = 2
// 				var gSpread = 1
// 				var cutoff = 0.4
				
// 				function getGen(x2, y2, z2) {
// 					var spikes = false
// 					var n5 = (noise.perlin2((x2+20482)/(500*gSpread), (z2+98293)/(500*gSpread))+1)/2
// 					if (n5 > 0.49 && n5 < 0.51) {
// 						spikes = true
// 					}

// 					var gen2 = (noise.perlin3((x2+29332)/30, (y2+72932)/15, (z2+63232)/30)+1)/1.6
// 					var gen3 = (noise.perlin3((x2+81943)/200, (y2+46193)/66, (z2+12345)/200)+1) * (noise.perlin3((x2+76544)/30, (y2+42234)/15, (z2+12121)/30)+1) / 2         
// 					if (gen3 < gen2) {
// 						gen2 = gen3
// 					}
					
// 					var gen = Math.abs(0.5-(noise.perlin3((x2+95028)/(50), (y2+45720)/(50), (z2+57294)/(50))+1)/2)*2
// 					gen += Math.abs(0.5-(noise.perlin3((x2+58204)/(45), (y2+856038)/(45), (z2+104842)/(45))+1)/2)*2
// 					gen += Math.abs(0.5-(noise.perlin3((x2+58204)/(30), (y2+856038)/(30), (z2+104842)/(30))+1)/2)*2
// 					gen /= 1.5
// 					gen *= 10
// 					if (gen > 1) {
// 						gen = 1
// 					}
// 					gen -= (noise.perlin3((x2+37432)/(16*genSpread), (y2+53723)/(16*genSpread), (z2+95820)/(16*genSpread))+1)/2/3
// 					gen -= (noise.perlin3((x2+74974)/(15*genSpread), (y2+74828)/(15*genSpread), (z2+45432)/(15*genSpread))+1)/2/3
// 					gen -= (noise.perlin3((x2+99834)/(14*genSpread), (y2+10948)/(14*genSpread), (z2+82728)/(14*genSpread))+1)/2/3
	
// 					var spread = 100*gSpread
// 					var spread2 = 20*gSpread
// 					var spread3 = 50*gSpread
// 					var n = noise.perlin2(x2/spread, z2/spread)
// 					n += noise.perlin2((x2+48924)/spread, (z2+94029)/spread)
// 					n /= 2
// 					n += 1
// 					var g1 = 0
// 					if (n <= 0.5) {
// 						g1 = 0
// 					} else if (n <= 0.7) {
// 						g1 = 0+(n-0.5)/0.2*0.5
// 					} else if (n <= 0.9) {
// 						g1 = 0.5
// 					} else if (n <= 1) {
// 						g1 = 0.5+(n-0.9)/0.1*0.5
// 					} else {
// 						g1 = 1
// 					}
// 					var n2 = noise.perlin2((x2+49204)/spread2, (z2+85923)/spread2)
// 					n2 += noise.perlin2((x2+85092)/spread2, (z2+52943)/spread2)
// 					n2 /= 2
// 					n2 += 1
// 					var g2 = 0
// 					if (n2 <= 0.2) {
// 						g2 = 1-n2/0.2*0.33
// 					} else if (n2 <= 1.5) {
// 						g2 = 0.66-(n2-0.2)/1.3*0.16
// 					} else if (n2 <= 1.6) {
// 						g2 = 0.76-(n2-1.5)/0.1*0.33
// 					} else if (n2 <= 1.7) {
// 						g2 = 0.16
// 					} else if (n2 <= 1.8) {
// 						g2 = 0.16+(n2-1.7)/0.1*0.16
// 					} else if (n2 <= 1.85) {
// 						g2 = 0.33
// 					} else if (n2 <= 1.9) {
// 						g2 = 0.33-(n2-1.85)/cutoff*0.16
// 					} else {
// 						g2 = 0.16
// 					}
// 					var n3 = noise.perlin2((x2+58203)/spread3, (z2+75293)/spread3)
// 					n3 += noise.perlin2((x2+33029)/spread3, (z2+10412)/spread3)
// 					n3 /= 2
// 					n3 += 1
// 					var g3 = 0
// 					if (n3 <= 0.2) {
// 						g3 = n3*0.15
// 					} else if (n3 <= 0.5) {
// 						g3 = 0.15+(n3-0.2)/0.3*0.15
// 					} else if (n3 <= 1) {
// 						g3 = 0.3
// 					} else if (n3 <= 1.5) {
// 						g3 = 0.3+(n3-1)/0.5*0.5
// 					} else if (n3 <= 1.8) {
// 						g3 = 0.8+(n3-1.5)/0.3*0.2
// 					} else {
// 						g3 = 1
// 					}
// 					genHeight = (g1+g2+g3)/3
// 					genHeight *= (worldSize.y-1)
// 					genHeight += noise.perlin2((x2+42934)/(500*gSpread), (z2+10484)/(500*gSpread))*worldSize.y
// 					var n4 = (noise.perlin2((x2+84592)/(200*gSpread), (z2+20483)/(200*gSpread))+1)/2
// 					if (n4 > 0.45 && n4 < 0.55) {
// 						var r = 1-Math.abs(0.5-n4)*(1/0.05)
// 						genHeight += (waterLevel - 10 - genHeight)*r
// 					}
	
// 					if (spikes) {
// 						// var r = 1-Math.abs(0.5-n5)*(1/0.025)
// 						// genHeight += (worldSize.y - genHeight)*r
// 						genHeight += (noise.perlin2((x2+52937)*1.1, (z2+47293)*1.1)+1)/2*((noise.perlin2((x2+52937)*1.1, (z2+47293)*1.1))/2)*60
// 					}
					
// 					genHeight = Math.round(genHeight)
				
// 					let biome = "plains"
// 					let temperature = (noise.perlin3(x2/150, y2/150, z2/150)+1)/2
// 					let water = (noise.perlin3((x2+93203)/150, (y2+13543)/150, (z2+32322)/150)+1)/2
					
// 					if (temperature < 0.33) {
// 						biome = "snow"
// 					}
// 					if (temperature > 0.66) {
// 						biome = "desert"
// 					}
// 					if (temperature > 0.33 && water > 0.66) {
// 						biome = "jungle"
// 					}
// 					if (temperature > 0.66+0.17) {
// 						biome = "molten"
// 					}

// 					return [genHeight, gen, gen2, spikes, biome]
// 				}


        
// 				function grassGen(x2, y2, z2) {
// 					if (noise.perlin3((x2+92832)/2, (y2+12122)/2, (z2+62452)/2) > 0.4) {
// 						sets.push([x2, y2+1, z2, 45])
// 					}
// 					if (noise.perlin3((x2+22322)/2, (y2+64564)/2, (z2+99999)/2) > 0.5) {
// 						sets.push([x2, y2+1, z2, 53])
// 					}
// 					if (noise.perlin3((x2+10101)/2, (y2+90909)/2, (z2+202020)/2) > 0.5) {
// 						sets.push([x2, y2+1, z2, 46])
// 					}
// 					if (noise.perlin3((x2+67340)/2, (y2+41033)/2, (z2+10383)/2) > 0.7) {
// 						sets.push(...generateStructure("birch tree", x2, y2, z2))
// 					}
// 					else if (noise.perlin3((x2+54723)/2, (y2+73576)/2, (z2+13539)/2) > 0.5) {
// 						sets.push(...generateStructure("oak tree", x2, y2, z2))
// 					}
// 					else if (noise.perlin3((x2+95723)/2, (y2+27493)/2, (z2+64293)/2) > 0.8 && y2 < worldSize.y) {
// 						sets.push(...generateStructure("dungeon", x2, y2, z2))
// 					}
//           			else if (noise.perlin3((x2+55555)/2, (y2+99999)/2, (z2+33333)/2) > 0.8) {
// 						sets.push(...generateStructure("house", x2, y2, z2))
// 					}
// 				}

// 				function desertGen(x2, y2, z2) {
// 					if (noise.perlin3((x2+67340)/2, (y2+41033)/2, (z2+10383)/2) > 0.5) {
// 						sets.push([x2, y2+1, z2, 22])
// 						sets.push([x2, y2+2, z2, 22])
// 					}
// 				}

// 				function snowGen(x2, y2, z2) {
// 					if (noise.perlin3((x2+54723)/2, (y2+73576)/2, (z2+13539)/2) > 0.5) {
// 						sets.push(...generateStructure("pine tree", x2, y2, z2))
// 					}
// 				}

// 				function jungleGen(x2, y2, z2) {
// 					if (noise.perlin3((x2+92832)/2, (y2+12122)/2, (z2+62452)/2) > 0.3) {
// 						sets.push([x2, y2+1, z2, 45])
// 					}
// 					if (noise.perlin3((x2+10101)/2, (y2+90909)/2, (z2+202020)/2) > 0.4) {
// 						sets.push([x2, y2+1, z2, 46])
// 					}
// 					if (noise.perlin3((x2+22322)/2, (y2+64564)/2, (z2+99999)/22) > 0.4) {
// 						sets.push([x2, y2+1, z2, 53])
// 					}
// 					if (noise.perlin3((x2+54723)/2, (y2+73576)/2, (z2+13539)/2) > 0.4) {
// 						sets.push(...generateStructure("jungle tree", x2, y2, z2))
// 					}
// 				}

// 				function moltenGen(x2, y2, z2) {
// 					if (noise.perlin3((x2+54723)/2, (y2+73576)/2, (z2+13539)/2) > 0.5) {
// 						sets.push(...generateStructure("lava lake", x2, y2, z2))
// 					}
// 					if (noise.perlin3((x2+39193)/2, (y2+67654)/2, (z2+88888)/2) > 0.7) {
// 						sets.push(...generateStructure("molten hill", x2, y2, z2))
// 					}
// 				}
        
// 				function stoneGen(x2, y2, z2, biome) {
// 					if (biome == "molten") {
// 						moltenRockGen(x2, y2, z2)
// 						return
// 					}
// 					if (noise.perlin3((x2+85284)/8, (y2+75928)/8, (z2+48502)/8) > 0.6) {
// 						chunk.push(10)
// 					} else if (noise.perlin3((x2+12112)/8, (y2+23232)/8, (z2+53434)/8) > 0.6 && biome == "snow") {
// 						chunk.push(51)
// 					} else if (noise.perlin3((x2+10321)/5, (y2+42243)/5, (z2+87653)/5) > 0.65 && biome == "snow") {
// 						chunk.push(15)
//          			} else if (noise.perlin3((x2+83562)/5, (y2+32386)/5, (z2+97255)/5) > 0.65) {
// 						chunk.push(11)
//          			} else if (noise.perlin3((x2+32567)/5, (y2+23968)/5, (z2+24797)/5) > 0.7 && y2 <= 15) {
// 						chunk.push(12)
//           			} else if (noise.perlin3((x2+72476)/5, (y2+74566)/5, (z2+87656)/5) > 0.75 && y2 <= 0) {
// 						chunk.push(13)
// 					} else if (noise.perlin3((x2+72476)/8, (y2+74566)/8, (z2+87656)/8) > 0.5 && y2 > 100) {
// 						chunk.push(42)
//          			} else {
// 						if (biome == "snow") {
// 							chunk.push(18)
// 						} else {
// 							chunk.push(7)
// 						}
// 					}
// 				}

// 				function moltenRockGen(x2, y2, z2) {
// 					if (noise.perlin3((x2+85284)/8, (y2+75928)/8, (z2+48502)/8) > 0.6) {
// 						chunk.push(20)
// 					} else if (noise.perlin3((x2+83562)/5, (y2+32386)/5, (z2+97255)/5) > 0.65) {
// 						chunk.push(16)
//          			} else {
// 						chunk.push(19)
// 					}
// 				}
				
// 				var genData = getGen(x2, y2, z2)
// 				var genHeight = genData[0]
// 				var gen = genData[1]
// 				var gen2 = genData[2]
// 				var spikes = genData[3]

// 				var aData = getGen(x2, y2+1, z2)
// 				var aGenHeight = aData[0]
// 				var aGen = aData[1]
// 				var aGen2 = aData[2]
// 				var aSpikes = aData[3]

// 				var a5Data = getGen(x2, y2+5, z2)
// 				var a5GenHeight = a5Data[0]
// 				var a5Gen = a5Data[1]
// 				var a5Gen2 = a5Data[2]
// 				var a5Spikes = a5Data[3]

// 				var isCut = gen <= cutoff || aGen <= cutoff || a5Gen <= cutoff

// 				var isAir = !((y2 <= genHeight || gen2 < 0.2) && gen > cutoff)
// 				var isAirAbove = !((y2+1 <= aGenHeight || aGen2 < 0.2) && aGen > cutoff)
// 				var isAirAbove5 = !((y2+5 <= a5GenHeight || a5Gen2 < 0.2) && a5Gen > cutoff)

// 				let biome = genData[4]
				
// 				// var isAir = !((y2 < genHeight || (y2 == genHeight && y2 <= waterLevel)) && gen > cutoff)
// 				// var isAirAbove = !((y2+1 <= aGenHeight || (y2+1 == aGenHeight && y2+1 <= waterLevel)) && aGen > cutoff)
// 				// var isAirAbove5 = !((y2+5 <= a5GenHeight || (y2+5== a5GenHeight && y2+5 <= waterLevel)) && a5Gen > cutoff)
				
// 				if (!isAir && !isAirAbove) {
// 					if (isAirAbove5) {
// 						if (y2 <= waterLevel || spikes) {
// 							if (isCut & y2+5 < genHeight || spikes) {
// 								if (y2 < genHeight-5 || spikes) {
// 									stoneGen(x2, y2, z2, biome)
// 								} else {
// 									chunk.push(1)
// 								}
// 							} else {
// 								chunk.push(9)
// 							}
// 						} else {
// 							if (biome == "desert") {
// 								chunk.push(9)
// 							} else if (biome == "molten") {
// 								moltenRockGen(x2, y2, z2, biome)
// 							} else {
// 								chunk.push(1)
// 							}
							
// 						}
// 					} else {
// 						stoneGen(x2, y2, z2, biome)
// 					}
// 				} else if (!isAir && isAirAbove && isAirAbove5) {
// 					if (y2 <= waterLevel || spikes) {
// 						if (isCut && y2+5 < genHeight || spikes) {
// 							if (y2 < genHeight-5 || spikes) {
// 								stoneGen(x2, y2, z2, biome)
// 							} else {
// 								chunk.push(2)
// 								grassGen(x2, y2, z2)
// 							}
// 						} else {
// 							chunk.push(9)
// 						}
// 					} else {
// 						if (biome == "snow") {
// 							chunk.push(17)
// 							snowGen(x2, y2, z2)
// 						} else  if (biome == "desert") {
// 							chunk.push(9)
// 							desertGen(x2, y2, z2)
// 						} else  if (biome == "jungle") {
// 							chunk.push(52)
// 							jungleGen(x2, y2, z2)
// 						} else if (biome == "molten") {
// 							moltenRockGen(x2, y2, z2, biome)
// 							moltenGen(x2, y2, z2)
// 						} else {
// 							chunk.push(2)
// 							grassGen(x2, y2, z2)
// 						}
// 					}
// 				} else {
// 					if (y2 <= waterLevel && (!isCut || y2 > genHeight)) {
// 						chunk.push(6)
// 					} else {
// 						chunk.push(0)
// 					}
// 				}
// 			}
// 		}
// 	}
//   for (let set of sets) {
//     set.push(false)
//   }
// 	return [chunk, sets]
// }