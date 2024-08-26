let fetchedData = {}

function getImgData(img, sx, sy, sw, sh) {
	if (!fetchedData[img.src]) {
		let canvas = document.createElement("canvas")
		let ctx = canvas.getContext("2d")
		canvas.width = img.width
		canvas.height = img.height
		ctx.drawImage(img, 0, 0)
		let data = ctx.getImageData(0, 0, img.width, img.height).data
		canvas = null
		fetchedData[img.src] = data
	}
	let data = fetchedData[img.src]
	let data2 = []
	for (let x = 0; x < sw; x++) {
		for (let y = 0; y < sh; y++) {
			let i = ((sy+y)*img.width + (sx+x)) * 4
			data2.push([data[i], data[i+1], data[i+2], data[i+3]])
		}
	}
	delete fetchedData[img.src]
	return data2
}

function safe(value) {
	return Math.round(value*100)/100
}

function angleDistance(angle1, angle2) {
	angle1 *= 180 / Math.PI
	angle2 *= 180 / Math.PI
  angle1 = (angle1 + 360) % 360
  angle2 = (angle2 + 360) % 360
  var angleDistance = ((angle2 - angle1 + 540) % 360) - 180
	return angleDistance * (Math.PI/180)
}

function intAngle(angle1, angle2, interpolate) {
	angle1 *= 180 / Math.PI
	angle2 *= 180 / Math.PI
  angle1 = (angle1 + 360) % 360
  angle2 = (angle2 + 360) % 360
  var angleDistance = ((angle2 - angle1 + 540) % 360) - 180
  var interpolatedAngle = angle1 + angleDistance * interpolate
  interpolatedAngle = (interpolatedAngle + 360) % 360
  return interpolatedAngle * (Math.PI/180)
}

function normalize(vec) {
	var magnitude = Math.sqrt(vec.x*vec.x + vec.y*vec.y + vec.z*vec.z)
	if (magnitude == 0) {
		magnitude = 1
	}
	return {x: vec.x/magnitude, y: vec.y/magnitude, z: vec.z/magnitude}
}

function dir(value, cutoff=0) {
	var dir = 0
	if (value > cutoff) {
		dir = 1
	} else if (value < -cutoff) {
		dir = -1
	}
	return dir
}

function mod(v1, v2) {
	return v1 - Math.floor(v1 / v2)
}

function compactChunk(chunk) {
	return chunk.x+","+chunk.y+","+chunk.z
}
function expandChunk(chunk) {
	var pos = chunk.split(",")
	return {x: parseInt(pos[0]), y: parseInt(pos[1]), z: parseInt(pos[2])}
}

function collisionFix(obj1, objs) {
	var tries = 0
	while (tries < 100 && obj1.isColliding(objs)) {
		obj1.pos.y += 0.01
		tries += 1
	}
}

function collisionFixWorld(obj) {
	var tries = 0
	while (tries < 100 && isCollidingWorld(obj)) {
		obj.pos.y += 0.1
		tries += 1
	}
	return obj.pos
}

function getData(blockId) {
	let i = 0
	for (let data in blocks) {
		if (i == blockId-1) {
			return data
		}
		i++
	}
}

function editString(string, i, newC) {
	var s = string.split("")
	s[i] = newC
	return s.join("")
}

function expandName(name) {
	var upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	upper = upper.split("")
	var lower = "abcdefghijklmnopqrstuvwxyz"
	lower = lower.split("")
	var words = []
	var word = name[0]
	let i = 1
	while (i < name.length) {
		if (upper.includes(name[i])) {
			words.push(word)
			word = name[i]
		} else {
			word += name[i]
		}
		i++
	}
	words.push(word)
	if (lower.includes(words[0][0])) {
		words[0] = editString(words[0], 0, upper[lower.indexOf(words[0][0])])
	}
	var finalName = ""
	for (word of words) {
		finalName += " " + word
	}
	finalName = editString(finalName, 0, "")
	return finalName
}

function hasItem(item, target=-1) {
	if (target == -1) {
		var items = []
		for (let item of inventory) {
			items.push(item[0])
		}
		return items.includes(item)
	} else {
		var item2 = inventory[target][0]
		return item == item2
	}
}

function copyInventory() {
	var copied = []
	for (let item of inventory) {
		copied.push([item[0], item[1]])
	}
	return copied
}

function hasItemA(item, amount, target=-1) {
	if (!Object.keys(itemData).includes(item)) {
		console.log("That item does not exist!")
		return
	}
	var oldInventory = copyInventory()
	var removed = removeItem(item, amount, target)
	inventory = oldInventory
	return removed == amount
}

function getItemIndex(item, from=0) {
	if (!Object.keys(itemData).includes(item)) {
		console.log("That item does not exist!")
		return
	}
	var items = []
	for (let item of inventory) {
		items.push(item[0])
	}
	return items.indexOf(item, from)
}

function enoughSpace(item, count) {
	if (!Object.keys(itemData).includes(item)) {
		console.log("That item does not exist!")
		return
	}
	var oldInventory = copyInventory()
	var amount = addItem(item, count, true)
	inventory = oldInventory
	return amount == count
}

function addItem(item, count, metadata=false, target=-1) {
	if (!metadata) {
		console.log("That's too powerful! Ima reload your page in 3 seconds L")
		console.log("3")
		setTimeout(() => {
			console.log("2")
			setTimeout(() => {
				console.log("1")
				setTimeout(() => {
					console.log("lol")
					location.reload()
				}, 1000)
			}, 1000)
		}, 1000)
		return
	}
	if (!Object.keys(itemData).includes(item)) {
		console.log("That item does not exist!")
		return
	}
	var added = 0
	if (target == -1) {
		for (let i = 0; i < count; i++) {
			if (hasItem(item)) {
				var index = getItemIndex(item)
				var doMove = index < inventory.length && index != -1
				if (doMove) { doMove = doMove && inventory[index][1] >= itemData[inventory[index][0]][3] && index != -1}
				while (doMove) {
					index = getItemIndex(item, index+1)
					doMove = index < inventory.length && index != -1
					if (doMove) { doMove = doMove && inventory[index][1] >= itemData[inventory[index][0]][3] && index != -1}
				}
				if (index != -1) {
					added += 1
					inventory[index][1] += 1
				} else if (hasItem("none")) {
					added += 1
					var index = getItemIndex("none")
					inventory[index] = [item, 1]
				}
			} else if (hasItem("none")) {
				added += 1
				var index = getItemIndex("none")
				inventory[index] = [item, 1]
			}
		}
	}
	return added
}

function removeItem(item, count, target=-1, fallback=true) {
	if (!Object.keys(itemData).includes(item)) {
		console.log("That item does not exist!")
		return
	}
	var removed = 0
	for (let i = 0; i < count; i++) {
		if (target != -1) {
			if (target > 0 && target < inventory.length) {
				if (inventory[target][0] == item) {
					removed += 1
					inventory[target][1] -= 1
					if (inventory[target][1] <= 0) {
						inventory[target] = ["none", 0]
					}
					continue
				}
			}
		}
		if (fallback || target == -1) {
			if (hasItem(item)) {
				var index = getItemIndex(item)
				removed += 1
				inventory[index][1] -= 1
				if (inventory[index][1] <= 0) {
					inventory[index] = ["none", 0]
				}
			}
		}
	}
	return removed
}






// hmmmmmmmmmm
function convertImageToBuffers(image, extrusionHeight) {
  // Create canvas and context
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");

  // Set canvas size to match image size
  canvas.width = image.width;
  canvas.height = image.height;

  // Draw the image onto the canvas
  context.drawImage(image, 0, 0);

  // Get the image data
  var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  var pixels = imageData.data;

  // Calculate the number of pixels and vertices
  var numPixels = imageData.width * imageData.height;
  var numVertices = numPixels * 8; // 8 vertices per pixel (including extrusion)

  // Create buffers
  var vertexBuffer = [];
  var indexBuffer = [];
  var uvBuffer = [];
  var colorBuffer = [];

  // Iterate over each pixel
  for (var i = 0; i < numPixels; i++) {
    var x = i % imageData.width;
    var y = Math.floor(i / imageData.width);
    var pixelIndex = i * 4;

    // Calculate extruded height based on pixel intensity
    var intensity = (pixels[pixelIndex] + pixels[pixelIndex + 1] + pixels[pixelIndex + 2]) / (3 * 255);
    var extrudedHeight = intensity * extrusionHeight;

    // Create vertices
    var vertexOffset = i * 8;
    vertexBuffer.push(
      x, y, 0, // Bottom-left front vertex
      x + 1, y, 0, // Bottom-right front vertex
      x + 1, y + 1, 0, // Top-right front vertex
      x, y + 1, 0, // Top-left front vertex
      x, y, extrudedHeight, // Bottom-left back vertex (extruded)
      x + 1, y, extrudedHeight, // Bottom-right back vertex (extruded)
      x + 1, y + 1, extrudedHeight, // Top-right back vertex (extruded)
      x, y + 1, extrudedHeight // Top-left back vertex (extruded)
    );

    // Create indices
    var indexOffset = i * 36;
    var vertexIndex = i * 8;
    indexBuffer.push(
      vertexIndex, vertexIndex + 1, vertexIndex + 2, // Front face triangle 1
      vertexIndex, vertexIndex + 2, vertexIndex + 3, // Front face triangle 2
      vertexIndex, vertexIndex + 1, vertexIndex + 5, // Bottom face triangle 1
      vertexIndex, vertexIndex + 5, vertexIndex + 4, // Bottom face triangle 2
      vertexIndex + 1, vertexIndex + 2, vertexIndex + 6, // Right face triangle 1
      vertexIndex + 1, vertexIndex + 6, vertexIndex + 5, // Right face triangle 2
      vertexIndex + 2, vertexIndex + 3, vertexIndex + 7, // Top face triangle 1
      vertexIndex + 2, vertexIndex + 7, vertexIndex + 6, // Top face triangle 2
      vertexIndex + 3, vertexIndex, vertexIndex + 4, // Left face triangle 1
      vertexIndex + 3, vertexIndex + 4, vertexIndex + 7, // Left face triangle 2
      vertexIndex + 4, vertexIndex + 5, vertexIndex + 6, // Back face triangle 1
      vertexIndex + 4, vertexIndex + 6, vertexIndex + 7 // Back face triangle 2
    );

    // Create UV coordinates
    var u = x / (imageData.width - 1);
    var v = y / (imageData.height - 1);
    uvBuffer.push(
      u, v, // Bottom-left front UV
      u + 1 / (imageData.width - 1), v, // Bottom-right front UV
      u + 1 / (imageData.width - 1), v + 1 / (imageData.height - 1), // Top-right front UV
      u, v + 1 / (imageData.height - 1), // Top-left front UV
      u, v, // Bottom-left back UV
      u + 1 / (imageData.width - 1), v, // Bottom-right back UV
      u + 1 / (imageData.width - 1), v + 1 / (imageData.height - 1), // Top-right back UV
      u, v + 1 / (imageData.height - 1) // Top-left back UV
    );

    // Create colors
    colorBuffer.push(
      pixels[pixelIndex] / 255, // R
      pixels[pixelIndex + 1] / 255, // G
      pixels[pixelIndex + 2] / 255, // B
      pixels[pixelIndex + 3] / 255, // A
      pixels[pixelIndex] / 255, // R (extruded)
      pixels[pixelIndex + 1] / 255, // G (extruded)
      pixels[pixelIndex + 2] / 255, // B (extruded)
      pixels[pixelIndex + 3] / 255 // A (extruded)
    );
  }

  return {
    vertices: new Float32Array(vertexBuffer),
    indices: new Uint16Array(indexBuffer),
    uvs: new Float32Array(uvBuffer),
    colors: new Float32Array(colorBuffer)
  };
}

var letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" 
letters = letters.split("")

function getChunkData(string) {
	var list = []
	var item = ""
	for (let letter of string) {
		if (letters.includes(letter)) {
			for (let i = 0; i < letters.indexOf(letter)+1; i++) {
				list.push(parseInt(item))
			}
			item = ""
		} else {
			item += letter
		}
	}
	return list
}

function compressList(list) {
	var clist = ""
	var amount = 0
	var lastItem = list[0]
	let i = 0
	for (let i in list) {
		let item = list[i]
		if (item == lastItem && amount < 52) {
			amount += 1
		} else {
			clist += lastItem.toString()+letters[amount-1]
			amount = 1
		}
		lastItem = item
		i++
	}
	clist += lastItem.toString()+letters[amount-1]
	return clist
}