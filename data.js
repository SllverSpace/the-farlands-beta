// +Y -Y X+ X- Z+ Z-
var blocks = {
	/*1*/	"dirt": [[1, 0], [1, 0], [1, 0], [1, 0], [1, 0], [1, 0], true, "dirt"],
	/*2*/	"grass": [[0, 1], [1, 0], [0, 0], [0, 0], [0, 0], [0, 0], true, "grass"],
	/*3*/	"oakLog": [[6, 1], [6, 1], [6, 0], [6, 0], [6, 0], [6, 0], true, "oakLog"],
	/*4*/	"oakLeaves": [[6, 2], [6, 2], [6, 2], [6, 2], [6, 2], [6, 2], false, "oakLeaves"],
	/*5*/	"glass": [[1, 1], [1, 1], [1, 1], [1, 1], [1, 1], [1, 1], false, "glass"],
	/*6*/	"water": [[0, 2], [0, 2], [0, 2], [0, 2], [0, 2], [0, 2], false, "water"],
	/*7*/	"stone": [[2, 2], [2, 2], [2, 2], [2, 2], [2, 2], [2, 2], true, "stone"],
	/*8*/	"oakPlanks": [[6, 3], [6, 3], [6, 3], [6, 3], [6, 3], [6, 3], true, "oakPlanks"],
	/*9*/	"sand": [[2, 1], [2, 1], [2, 1], [2, 1], [2, 1], [2, 1], true, "sand"],
	/*10*/ "coalOre": [[0, 3], [0, 3], [0, 3], [0, 3], [0, 3], [0, 3], true, "coal"],
	/*11*/ "ironOre": [[1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], true, "ironOre"],
	/*12*/ "goldOre": [[2, 3], [2, 3], [2, 3], [2, 3], [2, 3], [2, 3], true, "goldOre"],
	/*13*/ "diamondOre": [[3, 3], [3, 3], [3, 3], [3, 3], [3, 3], [3, 3], true, "diamond"],
	/*14*/ "lava": [[1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], false, "lava"],
	/*15*/ "iceOre": [[4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], true, "iceShard"],
	/*16*/ "lavaOrbOre": [[5, 3], [5, 3], [5, 3], [5, 3], [5, 3], [5, 3], true, "lavaOrb"],
	/*17*/ "snowGrass": [[4, 2], [1, 0], [4, 1], [4, 1], [4, 1], [4, 1], true, "snowGrass"],
	/*18*/ "snow": [[4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], true, "snow"],
	/*19*/ "moltenRock": [[5, 1], [5, 1], [5, 1], [5, 1], [5, 1], [5, 1], true, "moltenRock"],
	/*20*/ "magma": [[5, 2], [5, 2], [5, 2], [5, 2], [5, 2], [5, 2], true, "magma"],
	/*21*/ "bricks": [[2, 0], [2, 0], [2, 0], [2, 0], [2, 0], [2, 0], true, "bricks"],
	/*22*/ "cactus": [[5, 6], [5, 6], [3, 1], [3, 1], [3, 1], [3, 1], true, "cactus"],
	/*23*/ "birchLog": [[7, 1], [7, 1], [7, 0], [7, 0], [7, 0], [7, 0], true, "birchLog"],
	/*24*/ "birchLeaves": [[7, 2], [7, 2], [7, 2], [7, 2], [7, 2], [7, 2], false, "birchLeaves"],
	/*25*/ "birchPlanks": [[7, 3], [7, 3], [7, 3], [7, 3], [7, 3], [7, 3], true, "birchPlanks"],
	/*26*/ "jungleLog": [[8, 1], [8, 1], [8, 0], [8, 0], [8, 0], [8, 0], true, "jungleLog"],
	/*27*/ "jungleLeaves": [[8, 2], [8, 2], [8, 2], [8, 2], [8, 2], [8, 2], true, "jungleLeaves"],
	/*28*/ "junglePlanks": [[8, 3], [8, 3], [8, 3], [8, 3], [8, 3], [8, 3], true, "junglePlanks"],
	/*29*/ "stoneBricks": [[3, 0], [3, 0], [3, 0], [3, 0], [3, 0], [3, 0], true, "stoneBricks"],
	/*30*/ "coalBlock": [[0, 4], [0, 4], [0, 4], [0, 4], [0, 4], [0, 4], true, "coalBlock"],
	/*31*/ "ironBlock": [[1, 4], [1, 4], [1, 4], [1, 4], [1, 4], [1, 4], true, "ironBlock"],
	/*32*/ "goldBlock": [[2, 4], [2, 4], [2, 4], [2, 4], [2, 4], [2, 4], true, "goldBlock"],
	/*33*/ "diamondBlock": [[3, 4], [3, 4], [3, 4], [3, 4], [3, 4], [3, 4], true, "diamondBlock"],
	/*34*/ "crackedStoneBricks": [[4, 0], [4, 0], [4, 0], [4, 0], [4, 0], [4, 0], true, "crackedStoneBricks"],
	/*35*/ "mixedLeaves": [[6, 4], [6, 4], [6, 4], [6, 4], [6, 4], [6, 4], false, "mixedLeaves"],
	/*36*/ "obsidian": [[7, 4], [7, 4], [7, 4], [7, 4], [7, 4], [7, 4], true, "obsidian"],
	/*37*/ "ultraBlock": [[8, 4], [8, 4], [8, 4], [8, 4], [8, 4], [8, 4], true, "ultraBlock"],
	/*38*/ "centerStone": [[5, 0], [5, 0], [5, 0], [5, 0], [5, 0], [5, 0], true, "centerStone"],
	/*39*/ "cornerStone": [[0, 5], [0, 5], [0, 5], [0, 5], [0, 5], [0, 5], true, "cornerStone"],
	/*40*/ "trampoline": [[2, 5], [3, 5], [1, 5], [1, 5], [1, 5], [1, 5], false, "trampoline", true, 0.01],
	/*41*/ "levitator": [[8, 5], [7, 5], [6, 5], [6, 5], [6, 5], [6, 5], true, "levitator"],
	/*42*/ "stardustOre": [[4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], true, "stardust"],
	/*43*/ "stardustBlock": [[5, 5], [5, 5], [5, 5], [5, 5], [5, 5], [5, 5], true, "stardustBlock"],
	/*44*/ "path": [[0, 6], [1, 0], [1, 6], [1, 6], [1, 6], [1, 6], true, "path"],
	/*45*/ "grasstop": [[3, 5], [3, 5], [2, 6], [2, 6], [2, 6], [2, 6], false, "grassTop", true, 0.25],
	/*46*/ "redFlower": [[3, 5], [3, 5], [3, 6], [3, 6], [3, 6], [3, 6], false, "redFlower", true, 0.499],
	/*47*/ "null": [[5, 4], [5, 4], [5, 4], [5, 4], [5, 4], [5, 4], true, "null"],
	/*48*/ "pineLog": [[9, 1], [9, 1], [9, 0], [9, 0], [9, 0], [9, 0], true, "pineLog"],
	/*49*/ "pinePlanks": [[9, 3], [9, 3], [9, 3], [9, 3], [9, 3], [9, 3], true, "pinePlanks"],
	/*50*/ "pineLeaves": [[9, 2], [9, 2], [9, 2], [9, 2], [9, 2], [9, 2], false, "pineLeaves"],
	/*51*/ "iceBlock": [[4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], false, "iceBlock"],
	/*52*/ "jungleGrass": [[6, 6], [1, 0], [7, 6], [7, 6], [7, 6], [7, 6], true, "jungleGrass"],
	/*53*/ "blueFlower": [[3, 5], [3, 5], [4, 6], [4, 6], [4, 6], [4, 6], false, "blueFlower", true, 0.499],
	/*54*/ "rainbow": [[0, 7], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], false, "rainbow"]
}
var forceSolidB = [4, 24, 27, 35, 50, 45, 46, 53, 40]
let blockK = Object.keys(blocks)
function bi(name) {
	return blockK.indexOf(name)+1
}
function ib(id) {
	return blockK[id-1]
}
var itemData = {
	"none": [[], false, 0, 100],
	"grass": [[0, 0], true, 2, 100],
	"dirt": [[1, 0], true, 1, 100],
	"stone": [[0, 1], true, 7, 100],
	"sand": [[2, 0], true, 9, 100],
	"glass": [[1, 1], true, 5, 100],
	"sand": [[2, 0], true, 9, 100],
	"bricks": [[2, 1], true, 21, 100],
	"oakLog": [[0, 4], true, 3, 100],
	"oakLeaves": [[2, 4], true, 4, 100],
	"oakPlanks": [[4, 4], true, 8, 100],
	"birchLog": [[1, 4], true, 23, 100],
	"birchLeaves": [[3, 4], true, 24, 100],
	"birchPlanks": [[5, 4], true, 25, 100],
	"coalOre": [[0, 3], true, 10, 100],
	"ironOre": [[1, 3], true, 11, 100],
	"goldOre": [[2, 3], true, 12, 100],
	"diamondOre": [[3, 3], true, 13, 100],
	"stoneBricks": [[4, 2], true, 29, 100],
	"crackedStoneBricks": [[4, 3], true, 34, 100],
	"water": [[0, 2], true, 6, 100],
	"lava": [[1, 2], true, 14, 100],
	"brick": [[0, 5], false, 0, 100],
	"coal": [[1, 5], false, 0, 100],
	"iron": [[2, 5], false, 0, 100],
	"gold": [[3, 5], false, 0, 100],
	"diamond": [[4, 5], false, 0, 100],
	"coalBlock": [[5, 0], true, 30, 100],
	"ironBlock": [[5, 1], true, 31, 100],
	"goldBlock": [[5, 2], true, 32, 100],
	"diamondBlock": [[5, 3], true, 33, 100],
	"mixedLeaves": [[6, 4], true, 35, 100],
	"obsidian": [[6, 1], true, 36, 100],
	"ultraBlock": [[6, 0], true, 37, 100],
	"centerStone": [[6, 2], true, 38, 100],
	"cornerStone": [[6, 3], true, 39, 100],
	"trampoline": [[5, 5], true, 40, 100],
	"levitator": [[2, 6], true, 41, 100],
	"stardustOre": [[6, 5], true, 42, 100],
	"stardust": [[0, 6], false, 0, 100],
	"stardustBlock": [[1, 6], true, 43, 100],
	"path": [[3, 6], true, 44, 100],
	"null": [[2, 2], true, 47, 100],
	"grassTop": [[4, 6], true, 45, 100],
	"redFlower": [[5, 6], true, 46, 100],
	"snow": [[3, 2], true, 18, 100],
	"snowGrass": [[3, 1], true, 17, 100],
	"iceOre": [[6, 6], true, 15, 100],
	"lavaOrbOre": [[6, 7], true, 16, 100],
	"moltenRock": [[4, 7], true, 19, 100],
	"magma": [[5, 7], true, 20, 100],
	"cactus": [[3, 0], true, 22, 100],
	"jungleLog": [[7, 1], true, 26, 100],
	"junglePlanks": [[7, 2], true, 28, 100],
	"jungleLeaves": [[7, 3], true, 27, 100],
	"pineLog": [[0, 7], true, 48, 100],
	"pinePlanks": [[1, 7], true, 49, 100],
	"pineLeaves": [[2, 7], true, 50, 100],
	"iceShard": [[7, 0], false, 0, 100],
	"iceBlock": [[3, 7], true, 51, 100],
	"jungleGrass": [[7, 4], true, 52, 100],
	"blueFlower": [[7, 5], true, 53, 100],
	"lavaOrb": [[7, 6], false, 0, 100],
	"rainbow": [[2, 2], true, 54, 100],
}
var recipes = [
	[["oakPlanks", 4], [["oakLog", 1]]],
	[["birchPlanks", 4], [["birchLog", 1]]],
	[["glass", 1], [["sand", 1], ["coal", 1]]],
	[["stoneBricks", 1], [["stone", 4]]],
	[["crackedStoneBricks", 1], [["stoneBricks", 1]]],
	[["water", 1], [["sand", 10]]],
	[["lava", 1], [["stone", 5], ["coal", 5]]],
	[["grass", 1], [["dirt", 1], ["grassTop", 1]]],
	[["mixedLeaves", 1], [["oakLeaves", 1], ["birchLeaves", 1]]],
	[["bricks", 1], [["brick", 4], ["coal", 1]]],
	[["brick", 1], [["dirt", 1], ["stone", 1], ["coal", 1]]],
	[["iron", 1], [["ironOre", 1], ["coal", 1]]],
	[["gold", 1], [["goldOre", 1], ["coal", 1]]],
	[["coalBlock", 1], [["coal", 10]]],
	[["ironBlock", 1], [["iron", 10]]],
	[["goldBlock", 1], [["gold", 10]]],
	[["diamondBlock", 1], [["diamond", 10]]],
	[["obsidian", 1], [["water", 1], ["lava", 1]]],
	[["ultraBlock", 1], [["coalBlock", 10], ["ironBlock", 10], ["goldBlock", 10], ["diamondBlock", 10]]],
	[["coal", 10], [["coalBlock", 1]]],
	[["iron", 10], [["ironBlock", 1]]],
	[["gold", 10], [["goldBlock", 1]]],
	[["diamond", 10], [["diamondBlock", 1]]],
	[["centerStone", 1], [["stoneBricks", 4]]],
	[["cornerStone", 1], [["centerStone", 4]]],
	[["stardustBlock", 1], [["stardust", 10]]],
	[["trampoline", 1], [["stardust", 3], ["gold", 3], ["iron", 5]]],
	[["levitator", 1], [["stardust", 5], ["ironBlock", 1]]],
	[["stardust", 10], [["stardustBlock", 1]]],
	[["path", 1], [["grass", 1], ["stoneBricks", 1]]],
	[["junglePlanks", 4], [["jungleLog", 1]]],
	[["pinePlanks", 4], [["pineLog", 1]]],
	[["iceBlock", 1], [["iceShard", 10]]],
	[["lava", 1], [["lavaOrb", 10]]],
	[["rainbow", 1], [["redFlower", 1], ["blueFlower", 1]]],
]

var characters = {
	"a": [0, 1],"b": [1, 1],"c": [2, 1],
	"d": [3, 1],"e": [4, 1],"f": [5, 1, 0.6],
	"g": [6, 1, 0.8],"h": [7, 1],"i": [8, 1, 0.2],
	"j": [9, 1, 0.6],"k": [10, 1, 0.8],"l": [11, 1, 0.2],
	"m": [12, 1],"n": [13, 1],"o": [14, 1],
	"p": [15, 1, 0.8],"q": [16, 1, 0.8],"r": [17, 1, 0.8],
	"s": [18, 1],"t": [19, 1, 0.6],"u": [20, 1],
	"v": [21, 1],"w": [22, 1],"x": [23, 1],
	"y": [24, 1],"z": [25, 1],

	"A": [0, 0],"B": [1, 0],"C": [2, 0],
	"D": [3, 0],"E": [4, 0],"F": [5, 0],
	"G": [6, 0],"H": [7, 0],"I": [8, 0],
	"J": [9, 0],"K": [10, 0],"L": [11, 0],
	"M": [12, 0],"N": [13, 0],"O": [14, 0],
	"P": [15, 0],"Q": [16, 0],"R": [17, 0],
	"S": [18, 0],"T": [19, 0],"U": [20, 0],
	"V": [21, 0],"W": [22, 0],"X": [23, 0],
	"Y": [24, 0],"Z": [25, 0],

	"0": [0, 2], "1": [1, 2], "2": [2, 2],
	"3": [3, 2], "4": [4, 2], "5": [5, 2],
	"6": [6, 2], "7": [7, 2], "8": [8, 2],
	"9": [9, 2],

	"-": [0, 3], "+": [1, 3], "=": [2, 3],
	"!": [3, 3, 0.2], "#": [4, 3], "@": [5, 3],
	"$": [6, 3], "%": [7, 3], "^": [8, 3],
	"&": [10, 3], "*": [11, 3], "(": [12, 3, 0.6],
	")": [13, 3, 0.6], "_": [14, 3], "[": [15, 3, 0.6],
	"]": [16, 3, 0.6], "{": [17, 3, 0.6], "}": [18, 3, 0.6],
	"|": [19, 3, 0.2], "/": [20, 3, 0.6], "\\": [21, 3, 0.6],
	".": [22, 3], ",": [23, 3], "'": [24, 3],
	'"': [25, 3], ":": [26, 3, 0.2], ";": [27, 3, 0.4],
	"?": [28, 3], "~": [29, 3], "`": [30, 3],
}

var fontSize = {x: 32, y: 8}
var fs = {x: 1/fontSize.x, y: 1/fontSize.y}
var offF = 1/(fontSize.x*5)

// Blocks with no collision
var none = [0, 6, 14]
var noCol = [0, 6, 14, 45, 46, 53]
// Size of tilemap
var blocksSize = {x: 10, y: 8}
var playerSize = {x: 12, y: 11}
var psx = 1/playerSize.x
var psy = 1/playerSize.y

var playerSize2 = {x: 3, y: 2}
var psx2 = 1/playerSize2.x
var psy2 = 1/playerSize2.y
var playerNames = {
	"0,0": "Silver",
	"1,0": "Camsical",
	"0,1": "ZayneX",
	"1,1": "Overscore", 
}
var playerT = Object.keys(playerNames)[Math.round(Math.random()*(Object.keys(playerNames).length-1))].split(",")
playerT[0] = parseInt(playerT[0])
playerT[1] = parseInt(playerT[1])
var inUI = false

// World size stuff
var renderSize = {x: 2, y: 2, z: 2}
var worldSize = {x: 1, y: 100, z: 1}
var waterLevel = worldSize.y/2
var cs = {x: 16, y: 16, z: 16}
// Speed of loading
var chunksPerSecond = 10
var setsPerSecond = 60
var ordersPerSecond = 60 /* does nothing */
var chunkLoadSpeed = 1

var shadows = 0.8
var exposure = 0.95

// Player Settings
var gravity = 0.3
var dashCooldown = 9
var dashForce = 0.35
var speed = 0.85 * 120
var friction = 0.5	 
var airFriction = 0.95
var airSpeed = 0.085 * 120 
var dashSpeed = 0.085 * 120 * 2

// General Settings
var testGen = false
var godmode = false
var showFPS = false
var loadChunks = true


// Setup
var blockSize = {x: 1/blocksSize.x, y: 1/blocksSize.y}

for (let block in blocks) {
	for (let i = 0; i < 6; i++) {
		blocks[block][i][0] /= blocksSize.x
		blocks[block][i][1] /= blocksSize.y
	}
}

var i = 0
var transparent = []
for (let block in blocks) {
	if (!blocks[block][6]) {
		transparent.push(i+1)
	}
	i++
}

function getBlock(x, y, z, relative=true, raw=true, ignore=false, trueRaw=true, col=false) {
	x = Math.floor(x)
	y = Math.floor(y)
	z = Math.floor(z)
	if (typeof player != "undefined" && relative) {
		x += player.wcpos.x
		y += player.wcpos.y
		z += player.wcpos.z
	}
	var chunkPos = {x: Math.floor(x / cs.x), y: Math.floor(y / cs.y), z: Math.floor(z / cs.z)}
	var blockPos = {x: x - chunkPos.x*cs.x, y: y - chunkPos.y*cs.y, z: z - chunkPos.z*cs.z}
	let c = chunkPos.x+","+chunkPos.y+","+chunkPos.z
	if (!chunks[c]) {
		return 0
	}
	var chunk = chunks[c]
	let block = chunk.blocks[blockPos.z + blockPos.y * cs.z + blockPos.x * cs.y * cs.z]
	if (col) {
		if (!raw) {
			if (none.includes(block)) {
				return 0
			}
		}
	} else {
		let ignore2 = false
		if (!trueRaw) {
			let bd = blocks[Object.keys(blocks)[block-1]]
			if (bd) { ignore2 = bd[8] }
		}
		if (ignore || ignore2 || (!raw && transparent.includes(block))) {
			return 0
		}
	}
	
	return block
}

function setBlock(x, y, z, block) {
	x = Math.floor(x)
	y = Math.floor(y)
	z = Math.floor(z)
	var chunkPos = {x: Math.floor(x/cs.x), y: Math.floor(y/cs.y), z: Math.floor(z/cs.z)}
	var blockPos = {x: x - chunkPos.x*cs.x, y: y - chunkPos.y*cs.y, z: z - chunkPos.z*cs.z}
	let c = chunkPos.x+","+chunkPos.y+","+chunkPos.z
	if (!chunks[c]) {
		return
	} 
	var chunk = chunks[c]
	chunk[blockPos.z + blockPos.y*cs.z + blockPos.x*cs.y*cs.z] = block
}

function getPos(x, y, z) {
	x = Math.round(x)
	y = Math.round(y)
	z = Math.round(z)
	var chunkPos = {x: Math.floor(x/cs.x), y: Math.floor(y/cs.y), z: Math.floor(z/cs.z)}
	var blockPos = {x: x - chunkPos.x*cs.x, y: y - chunkPos.y*cs.y, z: z - chunkPos.z*cs.z}
	return [chunkPos, blockPos]
}

function sRandom(seed) {
	var x = Math.sin(seed*3902+7459)*Math.cos(seed*4092+4829)*10000
	return x - Math.floor(x)
}

function distance(vec1, vec2) {
	return Math.sqrt((vec2.x-vec1.x)**2 + (vec2.y-vec1.y)**2 + (vec2.z-vec1.z)**2)
}

function distanceB(vec1, vec2) {
	return Math.sqrt((vec2.x-vec1.x)**2 + (vec2.y-vec1.y)**2 + (vec2.z-vec1.z)**2)
}

function generateStructure(structure, rx, ry, rz) {
	var sets = []
	if (structure == "oak tree") {
		// leafs
		function genLeaf(x, y, z, chance) {
			if (srandom(x*324*y*202*z*105) > chance) {
				sets.push([x, y, z, 4])
			}
		}
		for (let x3 = 0; x3 < 5; x3++) {
			for (let z3 = 0; z3 < 5; z3++) {
				for (let y3 = 0; y3 < 5; y3++) {
					genLeaf(rx+x3-2, ry+3+y3, rz+z3-2, distanceB({x:rx+x3-2,y:ry+3+y3,z:rz+z3-2}, {x:rx,y:ry+4,z:rz})**25/(50000*50000))
				}
			}
		}

		// for (let y = 0; y < 2; y++) {
		// 	genLeaf(rx, ry+5+y, rz)
		// 	genLeaf(rx-1, ry+5+y, rz)
		// 	genLeaf(rx+1, ry+5+y, rz)
		// 	genLeaf(rx, ry+5+y, rz-1)
		// 	genLeaf(rx, ry+5+y, rz+1)
		// }

		// log
		sets.push([rx, ry+1, rz, 3])
		sets.push([rx, ry+2, rz, 3])
		sets.push([rx, ry+3, rz, 3])
		sets.push([rx, ry+4, rz, 3])
	} else if (structure == "birch tree") {
		// leafs
		function genLeaf(x, y, z, chance) {
			if (srandom(x*324*y*202*z*105) > chance) {
				sets.push([x, y, z, 24])
			}
		}
		for (let x3 = 0; x3 < 5; x3++) {
			for (let z3 = 0; z3 < 5; z3++) {
				for (let y3 = 0; y3 < 10; y3++) {
					genLeaf(rx+x3-2, ry+3+y3, rz+z3-2, distanceB({x:rx+x3-2,y:ry+3+y3/3,z:rz+z3-2}, {x:rx,y:ry+3,z:rz})**25/(50000*50000))
				}
			}
		}

		// log
		for (let y = 0; y < 8; y++) {
			sets.push([rx, ry+1+y, rz, 23])
		}
	} else if (structure == "pine tree") {
		// leafs
		function genLeaf(x, y, z, chance) {
			if (srandom(x*324*y*202*z*105) > chance) {
				sets.push([x, y, z, 50])
			}
		}
		for (let x3 = 0; x3 < 5; x3++) {
			for (let z3 = 0; z3 < 5; z3++) {
				for (let y3 = 0; y3 < 10; y3++) {
					genLeaf(rx+x3-2, ry+3+y3, rz+z3-2, (distanceB({x:rx+x3-2,y:ry+3+y3/3,z:rz+z3-2}, {x:rx,y:ry+3,z:rz})**25/(50000*50000)+1)*((Math.sin(y3*10)*0.65+1))-1)
				}
			}
		}

		// log
		for (let y = 0; y < 8; y++) {
			sets.push([rx, ry+1+y, rz, 48])
		}
	} else if (structure == "jungle tree") {
		let height = Math.round(srandom(rx*324*ry*202*rz*105) * 4) + 4
		// leafs
		function genLeaf(x, y, z, chance) {
			if (srandom(x*324*y*202*z*105) > chance) {
				sets.push([x, y, z, 27])
			}
		}
		for (let x3 = 0; x3 < 5; x3++) {
			for (let z3 = 0; z3 < 5; z3++) {
				for (let y3 = 0; y3 < 5; y3++) {
					genLeaf(rx+x3-2, ry+height-1+y3, rz+z3-2, distanceB({x:rx+x3-2,y:ry+height-1+y3,z:rz+z3-2}, {x:rx,y:ry+height,z:rz})**25/(50000*50000))
				}
			}
		}

		// for (let y = 0; y < 2; y++) {
		// 	genLeaf(rx, ry+5+y, rz)
		// 	genLeaf(rx-1, ry+5+y, rz)
		// 	genLeaf(rx+1, ry+5+y, rz)
		// 	genLeaf(rx, ry+5+y, rz-1)
		// 	genLeaf(rx, ry+5+y, rz+1)
		// }

		// log
		for (let y = 0; y < height; y++) {
			sets.push([rx, ry+1+y, rz, 26])
		}
	} else if (structure == "lava lake") {
		for (let y = 0; y < 6; y++) {
			for (let x = 0; x < 6; x++) {
				for (let z = 0; z < 6; z++) {
					let d = distanceB({x:0,y:0,z:0},{x:x-3,y:y,z:z-3})
					if (d < 2.5) {
						sets.push([rx+x-3, ry-y, rz+z-3, 14])
					}
				}
			}
		}
	} else if (structure == "molten hill") {
		for (let y = 0; y < 16; y++) {
			for (let x = 0; x < 16; x++) {
				for (let z = 0; z < 16; z++) {
					let d = distanceB({x:0,y:0,z:0},{x:x-8,y:y,z:z-8})
					if (d < 8) {
						sets.push([rx+x-8, ry+y, rz+z-8, 19])
					}
				}
			}
		}
		sets.push(...generateStructure("lava lake", rx, ry+7, rz))
	} else if (structure == "house") {
		// floor
		for (let x = 0; x < 5; x++) {
			for (let z = 0; z < 9; z++) {
				sets.push([rx-2+x, ry, rz-2+z, 29])
			}
		}
		for (let x = 0; x < 5; x++) {
			for (let z = 0; z < 5; z++) {
				sets.push([rx-2+x-4, ry, rz-2+z+4, 29])
			}
		}

		// ceiling
		for (let x = 0; x < 5; x++) {
			for (let z = 0; z < 9; z++) {
				sets.push([rx-2+x, ry+4, rz-2+z, 29])
			}
		}
		for (let x = 0; x < 5; x++) {
			for (let z = 0; z < 5; z++) {
				sets.push([rx-2+x-4, ry+4, rz-2+z+4, 29])
			}
		}
		
		// -Z wall (front)
		for (let x = 0; x < 5; x++) {
			for (let y = 0; y < 5; y++) {
				sets.push([rx-2+x, ry+y, rz-2, 8])
			}
		}
		
		// +Z wall (back)
		for (let x = 0; x < 9; x++) {
			for (let y = 0; y < 5; y++) {
				sets.push([rx-6+x, ry+y, rz+6, 8])
			}
		}

		// +Z wall (front) 2
		for (let x = 0; x < 5; x++) {
			for (let y = 0; y < 5; y++) {
				sets.push([rx-2+x-4, ry+y, rz+2, 8])
			}
		}
		
		// -X wall (right)
		for (let z = 0; z < 5; z++) {
			for (let y = 0; y < 5; y++) {
				sets.push([rx-2, ry+y, rz-2+z, 8])
			}
	  	}

		// -X wall (right) 2
		for (let z = 0; z < 5; z++) {
			for (let y = 0; y < 5; y++) {
				sets.push([rx-6, ry+y, rz-2+z+4, 8])
			}
	  	}

		// +X wall (left)
		for (let z = 0; z < 9; z++) {
			for (let y = 0; y < 5; y++) {
				sets.push([rx+2, ry+y, rz-2+z, 8])
			}
	  	}

		// -X wall (right) 3
		for (let z = 0; z < 3; z++) {
			for (let y = 0; y < 3; y++) {
				sets.push([rx-2, ry+1+y, rz+3+z, 8])
			}
	  	}

		function pillar(x, y, z, height) {
			for (let y2 = 0; y2 < height; y2++) {
				sets.push([x, y+y2, z, 3])
			}
		}

		pillar(rx-2, ry, rz-2, 5)
		pillar(rx+2, ry, rz-2, 5)
		pillar(rx+2, ry, rz+6, 5)
		pillar(rx-6, ry, rz+6, 5)
		pillar(rx-6, ry, rz+2, 5)
		pillar(rx-2, ry, rz+2, 5)

		// front door
		sets.push([rx, ry+1, rz-2, 0])
		sets.push([rx, ry+2, rz-2, 0])
		
		// middle door
		sets.push([rx-2, ry+1, rz+4, 0])
		sets.push([rx-2, ry+2, rz+4, 0])

		// window
		sets.push([rx+2, ry+2, rz+1, 5])
		sets.push([rx+2, ry+2, rz+2, 5])
		sets.push([rx+2, ry+2, rz+3, 5])
		sets.push([rx+2, ry+3, rz+1, 5])
		sets.push([rx+2, ry+3, rz+2, 5])
		sets.push([rx+2, ry+3, rz+3, 5])

		// window 2
		sets.push([rx-4, ry+2, rz+6, 5])

		// treasure
		sets.push([rx-5, ry+1, rz+3, 32])

		// for (let z = 0; z < 5; z++) {
		// 	for (let y = 0; y < 5; y++) {
		// 		sets.push([rx+2, ry+y, rz-2+z, 8])
		// 	}
		// }
  } else if (structure == "dungeon") {
		var no = ["0,0", "6,6", "0,6", "6,0"]
		for (let x = 0; x < 7; x++) {
			for (let z = 0; z < 7; z++) {
				if (!no.includes([x, z].join(","))) {
					sets.push([rx+x-3, ry, rz+z-3, 29])
				}
			}
		}
		function generateRoom(rx, ry, rz, width, height, depth) {
			for (let x = 0; x < width; x++) {
				for (let y = 0; y < height; y++) {
					for (let z = 0; z < depth; z++) {
						sets.push([rx-Math.floor(width/2)+x, ry-Math.floor(height/2)+y, rz-Math.floor(depth/2)+z, 0])
					}
				}
			}
			width += 2
			height += 2
			depth += 2
			for (let x = 0; x < width; x++) {
				for (let y = 0; y < height; y++) {
					for (let z = 0; z < depth; z++) {
						if (x == 0 || y == 0 || z == 0 ||
						x == width-1 || y == height-1 || z == depth-1) {
							let b = srandom(rx*x*ry*y*rz*z*483) > 0.9 ? 34 : 29
							sets.push([rx-Math.floor(width/2)+x, ry-Math.floor(height/2)+y, rz-Math.floor(depth/2)+z, b])
						}
					}
				}
			}
		}
		var limit = 0
		var maxLimit = 10
		var generated = []
		var roomPos = [0, 0, 0]
		function generateRoom2(x, y, z) {
			var og =  [...roomPos]
			generated.push([...roomPos].join(","))
			if (limit > maxLimit) {
				return
			}
			limit += 1
			var side = Math.floor(srandom(rx*x*ry*y*rz*z*(limit+1))*5)
			if (side == 0 && limit < maxLimit) {
				roomPos[0] += 1
				generateRoom(x+4, y-1, z, 3, 3, 3)
			}
			if (side == 1 && limit < maxLimit) {
				roomPos[0] -= 1
				generateRoom(x-4, y-1, z, 3, 3, 3)
			}
			if (side == 2 && limit < maxLimit) {
				roomPos[1] += 1
				generateRoom(x, y-1, z+4, 3, 3, 3)
			}
			if (side == 3 && limit < maxLimit) {
				roomPos[1] -= 1
				generateRoom(x, y-1, z-4, 3, 3, 3)
			}
			if (side == 4 && limit < maxLimit) {
				roomPos[2] -= 1
				generateRoom(x, y-4, z, 3, 3, 3)
			}
			generateRoom(x, y, z, 5, 5, 5)
			var trap = Math.floor(srandom(rx*x*ry*y*rz*z*(limit+1)*2)*5)
			if (side == 4) { trap = 0 }
			if (trap == 1 && limit < maxLimit-1) {
				for (let x2 = 0; x2 < 3; x2++) {
					for (let z2 = 0; z2 < 3; z2++) {
						sets.push([x-1+x2, y-3, z-1+z2, 14])
						let b = srandom(x2*x*y*z2*z*923) > 0.9 ? 34 : 29
						sets.push([x-1+x2, y-4, z-1+z2, b])
					}
				}
			}
			if (trap == 2 && limit < maxLimit-1) {
				let b = srandom(x*y*z*929) > 0.9 ? 34 : 29
				sets.push([x, y-2, z, b])
				b = srandom(x*y*z*372) > 0.9 ? 34 : 29
				sets.push([x, y-1, z, b])
				b = srandom(x*y*z*129) > 0.9 ? 34 : 29
				sets.push([x, y, z, b])
				b = srandom(x*y*z*738) > 0.9 ? 34 : 29
				sets.push([x, y+1, z, b])
				b = srandom(x*y*z*534) > 0.9 ? 34 : 29
				sets.push([x, y+2, z, b])
			}
			if (trap == 3 && limit < maxLimit-1) {
				for (let x2 = 0; x2 < 5; x2++) {
					for (let z2 = 0; z2 < 5; z2++) {
						if (x2 == z2) {
							for (let y2 = 0; y2 < (x2 == 2 ? 3 : 5); y2++) {
								let b = srandom(x2*x*y2*y*z2*z*232) > 0.9 ? 34 : 29
								sets.push([x-2+x2, y-2+y2, z-2+z2, b])
							}
						}
					}
				}
				sets.push([x-2, y-2, z-1, 8])
				sets.push([x+2, y-2, z+1, 8])
				sets.push([x+1, y-1, z-1, 8])
				sets.push([x-1, y-1, z+1, 8])
			}
			if (trap == 4 && limit < maxLimit-1) {
				for (let x2 = 0; x2 < 3; x2++) {
					for (let z2 = 0; z2 < 3; z2++) {
						for (let y2 = 0; y2 < (x2 == 1 && z2 == 1 ? 3 : 5); y2++) {
							let b = srandom(x2*x*y2*y*z2*z*232) > 0.9 ? 34 : 29
							sets.push([x-1+x2, y-2+y2, z-1+z2, b])
						}
					}
				}
				sets.push([x-1, y+1, z, 0])
				sets.push([x-1, y+2, z, 0])
				sets.push([x, y+1, z, 32])
			}
			var doors = [
				generated.includes([og[0]+1, og[1], og[2]].join(",")),
				generated.includes([og[0]-1, og[1], og[2]].join(",")),
				generated.includes([og[0], og[1]+1, og[2]].join(",")),
				generated.includes([og[0], og[1]-1, og[2]].join(",")),
				generated.includes([og[0], og[1], og[2]+1].join(",")),
				generated.includes([og[0], og[1], og[2]-1].join(",")),
			]
			if (doors[0]) {
				for (let y2 = 0; y2 < 3; y2++) {
					for (let z2 = 0; z2 < 3; z2++) {
						sets.push([x+3, y-1-1+y2, z-1+z2, 0])
					}
				}
			}
			if (doors[1]) {
				for (let y2 = 0; y2 < 3; y2++) {
					for (let z2 = 0; z2 < 3; z2++) {
						sets.push([x-3, y-1-1+y2, z-1+z2, 0])
					}
				}
			}
			if (doors[2]) {
				for (let y2 = 0; y2 < 3; y2++) {
					for (let x2 = 0; x2 < 3; x2++) {
						sets.push([x-1+x2, y-1-1+y2, z+3, 0])
					}
				}
			}
			if (doors[3]) {
				for (let y2 = 0; y2 < 3; y2++) {
					for (let x2 = 0; x2 < 3; x2++) {
						sets.push([x-1+x2, y-1-1+y2, z-3, 0])
					}
				}
			}
			if (doors[4]) {
				for (let x2 = 0; x2 < 3; x2++) {
					for (let z2 = 0; z2 < 3; z2++) {
						sets.push([x-1+x2, y+3, z-1+z2, 0])
					}
				}
			}
			if (doors[5]) {
				for (let x2 = 0; x2 < 3; x2++) {
					for (let z2 = 0; z2 < 3; z2++) {
						sets.push([x-1+x2, y-3, z-1+z2, 0])
					}
				}
			}
			if (limit >= maxLimit) {
				sets.push([x, y-2, z, 13])
				return
			}
			if (side == 0) {
				for (let y2 = 0; y2 < 3; y2++) {
					for (let z2 = 0; z2 < 3; z2++) {
						sets.push([x+3, y-1-1+y2, z-1+z2, 0])
					}
				}
				for (let y2 = 0; y2 < 3; y2++) {
					for (let z2 = 0; z2 < 3; z2++) {
						sets.push([x+5, y-1-1+y2, z-1+z2, 0])
					}
				}
				generateRoom2(x+8, y, z)
			}
			if (side == 1) {
				for (let y2 = 0; y2 < 3; y2++) {
					for (let z2 = 0; z2 < 3; z2++) {
						sets.push([x-3, y-1-1+y2, z-1+z2, 0])
					}
				}
				for (let y2 = 0; y2 < 3; y2++) {
					for (let z2 = 0; z2 < 3; z2++) {
						sets.push([x-5, y-1-1+y2, z-1+z2, 0])
					}
				}
				generateRoom2(x-8, y, z)
			}
			if (side == 2) {
				for (let y2 = 0; y2 < 3; y2++) {
					for (let x2 = 0; x2 < 3; x2++) {
						sets.push([x-1+x2, y-1-1+y2, z+3, 0])
					}
				}
				for (let y2 = 0; y2 < 3; y2++) {
					for (let x2 = 0; x2 < 3; x2++) {
						sets.push([x-1+x2, y-1-1+y2, z+5, 0])
					}
				}
				generateRoom2(x, y, z+8)
			}
			if (side == 3) {
				for (let y2 = 0; y2 < 3; y2++) {
					for (let x2 = 0; x2 < 3; x2++) {
						sets.push([x-1+x2, y-1-1+y2, z-3, 0])
					}
				}
				for (let y2 = 0; y2 < 3; y2++) {
					for (let x2 = 0; x2 < 3; x2++) {
						sets.push([x-1+x2, y-1-1+y2, z-5, 0])
					}
				}
				generateRoom2(x, y, z-8)
			}
			if (side == 4) {
				for (let x2 = 0; x2 < 3; x2++) {
					for (let z2 = 0; z2 < 3; z2++) {
						sets.push([x-1+x2, y-3, z-1+z2, 0])
					}
				}
				for (let x2 = 0; x2 < 3; x2++) {
					for (let z2 = 0; z2 < 3; z2++) {
						sets.push([x-1+x2, y-5, z-1+z2, 0])
					}
				}
				generateRoom2(x, y-8, z)
			}
		}

		var distance = ry-(waterLevel-10)
		generateRoom2(rx, ry-distance-2, rz)
		for (let x = 0; x < 3; x++) {
			for (let z = 0; z < 3; z++) {
				for (let y = 0; y < distance; y++) {
					sets.push([rx+x-1, ry-y, rz+z-1, 0])
				}
			}
		}
		for (let x = 0; x < 5; x++) {
			for (let z = 0; z < 5; z++) {
				for (let y = 0; y < distance; y++) {
					if (x == 0 || z == 0 ||
						x == 5-1 || z == 5-1) {
						let b = srandom(rx*x*ry*y*rz*z*666) > 0.9 ? 34 : 29
						sets.push([rx+x-2, ry-y, rz+z-2, b])
					}
				}
			}
		}

		
	}
	return sets
}


function srandom(seed) {
	var m = 0x80000000
	var a = 1103515245
	var c = 12345
	
	var state = seed % m

	state = (a * state + c) % m
	return Math.abs(state / m)
}

function srand(seed) {
    seed = Math.sin(seed*100000)*100000
    seed = Math.abs(seed)
    const a = 1664525
    const c = 1013904223
    const m = 2 ** 32

    seed = (a * seed + c) % m
    return seed / m
}

// var rando = []
// var avg = 0
// for (let i = 0; i < 1000; i++) {
// 	avg += Math.round(sRandom(i+1)*9+1)
// 	rando.push(Math.round(sRandom(i+1)*9+1))
// }
// console.log(avg/1000)
// console.log(rando.join(","))