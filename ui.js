var inventoryOpen = false
var selected = 0
var showName = 0

var selectedRecipe = -1
var lastHeldItem = "none"
var clickSlow = 0
var selectedItem = ["none", 0]
var inInventory = 0

var safeInventory = []
var inventory = []
for (let i = 0; i < 51; i++ ) {
	inventory.push(["none", 0])
}

var tab = "backpack"

var usernameBox = new ui.TextBox("Username")
usernameBox.outlineSize = 5

function createSlider(min, max) {
	let slider = new ui.ScrollBar(inventoryImg, inventoryImg,
		[16*7, 176+16, 32, 16],
		[16*6, 176+16, 16, 16],
	)
	slider.maxValue = max
	slider.minValue = min
	return slider
}

var hrd = createSlider(2, 12)
var vrd = createSlider(2, 4)
var cls = createSlider(1, 5)
var ms = createSlider(1, 10)

var upSkin = new ui.Button("img")
upSkin.img = inventoryImg
upSkin.clip = [48, 176+16, 16, 16]
var downSkin = new ui.Button("img")
downSkin.img = inventoryImg
downSkin.clip = [32, 176+16, 16, 16]

var inventorySlots = []
for (let y = 0; y < 10; y++) {
	for (let x = 0; x < 4; x++) {
		let slot = new ui.Button("img")
		slot.img = inventoryImg
		slot.clip = [0, 176, 16, 16]
		slot.hoverMul = 0.95
		slot.clickMul = 0.75
		inventorySlots.push(slot)
	}
}
let slot2 = new ui.Button("img")
slot2.img = inventoryImg
slot2.clip = [192, 192, 16, 16]
slot2.hoverMul = 0.95
slot2.clickMul = 0.75
inventorySlots.push(slot2)

let rows = Math.ceil(recipes.length / 5)

var recipesScroll = new ui.Canvas()
recipesScroll.bounds.minY = -64*rows + 61*4

var recipeSlots = []

for (let y = 0; y < rows; y++) {
	for (let x = 0; x < 5; x++) {
		let slot = new ui.Button("img")
		slot.img = inventoryImg
		slot.clip = [0, 176, 16, 16]
		slot.hoverMul = 0.95
		slot.clickMul = 0.75
		recipeSlots.push(slot)
	}
}

var result = new ui.Button("img")
result.img = inventoryImg
result.clip = [0, 176, 16, 16]
result.hoverMul = 0.95
result.clickMul = 0.75

var chatBox = new ui.TextBox("press enter to chat!")
chatBox.alpha = 0
chatBox.stop = 0

var menuButtonG = new ui.SideButton("Menu")
menuButtonG.invert = true

var inventoryButton = new ui.Button("img")
inventoryButton.img = inventoryImg
inventoryButton.clip = [208, 192, 16, 16]

var spawnButton = new ui.Button("img")
spawnButton.img = inventoryImg
spawnButton.clip = [224, 192, 16, 16]

var cameraButton = new ui.Button("img")
cameraButton.img = inventoryImg
cameraButton.clip = [224, 192-48, 16, 16]

var chatButton = new ui.Button("img")
chatButton.img = inventoryImg
chatButton.clip = [208, 192-48, 16, 16]

var jumpButton = new ui.Button("img")
jumpButton.img = inventoryImg
jumpButton.clip = [224, 160, 16, 16]

var shiftButton = new ui.Button("img")
shiftButton.img = inventoryImg
shiftButton.clip = [224-16*3, 160, 16, 16]

var buildButton = new ui.Button("img")
buildButton.img = inventoryImg
buildButton.clip = [224-16, 160, 16, 16]

var breakButton = new ui.Button("img")
breakButton.img = inventoryImg
breakButton.clip = [224-16*2, 160, 16, 16]

function highlightSlider(slider) {
	let oldAlpha = ctx.globalAlpha
	ctx.globalAlpha = 0.1
	ui.img(slider.x, slider.y, slider.width, slider.height, slider.img, [16*9, 176+16, 32, 16])
    ui.img(slider.x-slider.width/2+slider.bound + (slider.width-slider.bound*2) * ((slider.value-slider.minValue)/(slider.maxValue-slider.minValue)), slider.y, slider.handleWidth, slider.handleHeight, slider.handleImg, [16*11, 176+16, 16, 16])
	ctx.globalAlpha = oldAlpha
}

// draw ui
function renderUI() {
	
	ctx.globalAlpha = 1
	var cBlock = getBlock(Math.floor(player.pos.x), Math.floor(player.pos.y+0.5), Math.floor(player.pos.z))
	if (cBlock == 6) {
		ui.rect(canvas.width/2, canvas.height/2, canvas.width, canvas.height, [10, 119,229, 0.75])
	}
	if (cBlock == 14) {
		ui.rect(canvas.width/2, canvas.height/2, canvas.width, canvas.height, [229, 103, 0, 0.75])
	}
	ctx.globalAlpha = 0.75
	ui.img(canvas.width/2, canvas.height/2, 50*su, 50*su, crosshair)

	// var recipesScroll = new Canvas(82.5*4 + 83*4/2, 61*4/2, 86*4, 61*4)
	// recipesScroll.bounds.minY = -64*rows + 61*4
	var hoverText = ""
	var off = 0
	ctx.globalAlpha = 0.9

	if (!inventoryOpen) {
		menuButtonG.visWidth = 200*su
		menuButtonG.visHeight = 50*su
	}

	if (inventoryOpen) {

		menuButtonG.set(canvas.width + (-100)*su, (10 + 25) * su, 200*su, 50*su)
		menuButtonG.textSize = 25*su
		menuButtonG.bgColour = [255, 0, 0, 0.5]
		
		menuButtonG.basic()

		if (menuButtonG.hovered() && mouse.lclick) {
			menuButtonG.click()
			targetScene = "menu"
			overlayT = 1
		}

		menuButtonG.draw()

		if (tab == "backpack") {
			ui.img((168*4/2)*su, (176*4/2)*su, (168*4)*su, (176*4)*su, inventoryImg, [0, 0, 168, 176])
			for (let i = 0; i < 10; i++) {
				let hovered = ui.hovered((16*4/2)*su, (i*16*4 + 16*4/2)*su, (16*4)*su, (16*4)*su)
				inventoryLogic(i, hovered)
				if (hovered && inventory[i][0] != "none") {
					hoverText = inventory[i][0]
				}
				if (i == selected) {
					ui.img((32*4/2)*su, (i*16*4 + 16*4/2)*su, (32*4)*su, (16*4)*su, inventoryImg, [160, 176, 32, 16])
				} else {
					ui.img((16*4/2)*su, (i*16*4 + 16*4/2)*su, (16*4)*su, (16*4)*su, inventoryImg, [144, 176, 16, 16])
				}
				var item = itemData[inventory[i][0]][0]
				if (item) {
					ui.img((16*4/2)*su, (i*16*4 + 16*4/2)*su, (16/1.5*4*1.1)*su, (16/1.5*4*1.1)*su, itemsImg, [item[0]*16, item[1]*16, 16, 16])
				}
				if (hovered) {
					ui.rect((16*4/2)*su, (i*16*4 + 16*4/2)*su, (16*4)*su, (16*4)*su, [255, 255, 255, 0.25])
				}
				if (fontLoaded && inventory[i][1] > 1) {
					ui.text(4.8*su, (i*16*4+16)*su, 15*su, `${inventory[i][1]}`)
				}
			}
			for (let y = 0; y < 10; y++) {
				for (let x = 0; x < 4; x++) {
					let i = x+y*4
					let slot = inventorySlots[i]
					inventoryLogic(i+10, slot.hovered())
					slot.set((0+16*4+16*4*x+32)*su, (0+y*16*4+32)*su, 64*su, 64*su)
					slot.basic()
					slot.draw()
					if (slot.hovered()) {
						ctx.globalAlpha = 0.25
						ui.img(slot.x, slot.y, slot.visWidth, slot.visHeight, inventoryImg, [192, 176, 16, 16])
						ctx.globalAlpha = 0.9
						if (mouse.lclick || mouse.rclick ) {
							slot.click()
						}
						document.body.style.cursor = "default"
						if (inventory[i+10][0] != "none") {
							hoverText = inventory[i+10][0]
						}
					}
					let item = itemData[inventory[i+10][0]][0]
					if (item) {
						ui.img(slot.x, slot.y, slot.visWidth/1.5, slot.visHeight/1.5, itemsImg, [item[0]*16, item[1]*16, 16, 16])
					}
					if (inventory[i+10][1] > 1) {
						ui.text(slot.x-slot.width/2/1.5, slot.y-slot.height/2/1.5/2, 15*su, `${inventory[i+10][1]}`)
					}
				}
			}
			
			let trash = inventorySlots[40]
			trash.x = (88*4+3)*su
			trash.y = (176*4-16*6)*su
			trash.width = 64*su
			trash.height = 64*su
			let hovered = trash.hovered()
			trash.draw()
			trash.basic()
			if (trash.hovered()) {
				if (mouse.lclick || mouse.rclick) {
					trash.click()
				}
				if (inventory[50][0] != "none") {
					hoverText = inventory[50][0]
				}
			}
			if (inventory[50][0]) {
				let item = itemData[inventory[50][0]][0]
				ui.img(trash.x, trash.y, trash.visWidth/1.5, trash.visHeight/1.5, itemsImg, [item[0]*16, item[1]*16, 16, 16])
			}

			if (inventory[50][1] > 1) {
				ui.text((88*4-16)*su, (176*4-16*6-8)*su, 15*su, `${inventory[50][1]}`)
			}

			let lastI = inventory[50].join(",")
			let lastHeld = [...selectedItem]
			inventoryLogic(50, hovered)
			if (hovered && lastI == selectedItem.join(",") && (mouse.lclick || mouse.rclick) && !(mouse.rclick && lastHeld[1] == 2) && inventory[50][0] != "none") {
				selectedItem = ["none", 0]
			}

			ui.setC(recipesScroll)

			// Crafting
			for (let y = 0; y < rows; y++) {
				for (let x = 0; x < 5; x++) {
					let i = x+y*5
					let slot = recipeSlots[i]
					slot.x = (32+x*64 + 3*4)*su
					slot.y = (32+y*64)*su
					slot.width = 64*su
					slot.height = 64*su
					slot.canvas = recipesScroll
					slot.draw()
					slot.basic()
					if (slot.hovered()) {
						document.body.style.cursor = "default"
					}
					if (i < recipes.length) {
						let itemData2 = itemData[recipes[i][0][0]][0]
						if (slot.hovered()) {
							hoverText = recipes[i][0][0]
							if (mouse.lclick) {
								slot.click()
								selectedRecipe = i
							}
						}
						ui.img(slot.x, slot.y, slot.visWidth/1.5, slot.visHeight/1.5, itemsImg, [itemData2[0]*16, itemData2[1]*16, 16, 16])
					}
				}
			}

			recipesScroll.drawScroll({x: 4*su, y: 7.5*su}, 7.5*su)
			ui.setC()

			function checkCanCraft() {
				var canCraft = selectedRecipe != -1
				for (let i = 0; i < 5; i++) {
					let itemData2 = []
					let count = 1
					if (selectedRecipe != -1) {
						if (i < recipes[selectedRecipe][1].length) {
							itemData2 = itemData[recipes[selectedRecipe][1][i][0]][0]
							count = recipes[selectedRecipe][1][i][1]
							if (!hasItemA(recipes[selectedRecipe][1][i][0], count)) {
								canCraft = false
							}
						}
					}
				}
				return canCraft
			}

			var canCraft = checkCanCraft()
			for (let i = 0; i < 5; i++) {
				let x = (i*16*4 + 81*4 + 16*4/2 + 3*4) * su
				let y = (62*4 + 16*4/2) * su
				ui.img(x, y, 16*4*su, 16*4*su, inventoryImg, [0, 176, 16, 16])
				let hovered = ui.hovered(x, (62*4 + 16*4/2) * su, 16*4*su, 16*4*su)
				let itemData2 = []
				let count = 1
				if (selectedRecipe != -1) {
					if (i < recipes[selectedRecipe][1].length) {
						itemData2 = itemData[recipes[selectedRecipe][1][i][0]][0]
						count = recipes[selectedRecipe][1][i][1]
						if (hovered) {
							hoverText = recipes[selectedRecipe][1][i][0]
						}
						if (!hasItemA(recipes[selectedRecipe][1][i][0], count)) {
							canCraft = false
						}
					}
				}
				ui.img(x, y, 16*4/1.5*su, 16*4/1.5*su, itemsImg, [itemData2[0]*16, itemData2[1]*16, 16, 16])
				if (hovered) {
					ctx.globalAlpha = 0.25
					ui.img(x, y, 16*4*su, 16*4*su, inventoryImg, [192, 176, 16, 16])
					ctx.globalAlpha = 0.9
				}
				if (count > 1) {
					ui.text(x-(16*4/2/1.5)*su, y-(16*4/2/1.5/2)*su, 15*su, `${count}`)
				}
				
			}
		
			result.x = (2*16*4 + 84*4 + 16*4/2)*su
			result.y = (62*4 + 16*4/2 + 16*4)*su
			result.width = 64*su
			result.height = 64*su
			result.draw()
			result.basic()
			if (selectedRecipe != -1) {
				let itemData2 = itemData[recipes[selectedRecipe][0][0]][0]
				ui.img(result.x, result.y, result.visWidth/1.5, result.visHeight/1.5, itemsImg, [itemData2[0]*16, itemData2[1]*16, 16, 16])
				if (recipes[selectedRecipe][0][1] > 1) {
					ui.text(result.x-result.width/2/1.5, result.y-result.height/2/1.5/2, 15*su, `${recipes[selectedRecipe][0][1]}`)
				}
			}

			hovered = result.hovered()

			function craftResult() {
				for (let item of recipes[selectedRecipe][1]) {
					removeItem(item[0], item[1])
				}
				let resultI = recipes[selectedRecipe][0]
				if (selectedItem[0] == resultI[0]) {
					if (selectedItem[1] + resultI[1] > itemData[selectedItem[0]][3]) {
						let amount = (selectedItem[1]+resultI[1]) - 100
						selectedItem[1] = 100
						addItem(selectedItem[0], amount, true)
					} else {
						selectedItem[1] += resultI[1]
					}
				} else {
					if (selectedItem[0] != "none") {
						addItem(selectedItem[0], selectedItem[1], true)
					}
					selectedItem = [...resultI]
				}
			}
			
			if (canCraft) {
				if (hovered) {
					document.body.style.cursor = "default"
					if (mouse.lclick) {
						if (keys["ShiftLeft"]) {
							for (let item of recipes[selectedRecipe][1]) {
								removeItem(item[0], item[1])
							}
							addItem(recipes[selectedRecipe][0][0], recipes[selectedRecipe][0][1], true)
							if (keys["AltLeft"]) {
								while (checkCanCraft()) {
									for (let item of recipes[selectedRecipe][1]) {
										removeItem(item[0], item[1])
									}
									addItem(recipes[selectedRecipe][0][0], recipes[selectedRecipe][0][1], true)
								}
							}
						} else {
							craftResult()
							if (keys["AltLeft"]) {
								while (checkCanCraft()) {
									craftResult()
								}
							}
						}
					}
				}
			} else if (selectedRecipe != -1) {
				ui.rect(result.x, result.y, 12*4*su, 12*4*su, [0, 0, 0, 0.35])
				if (hovered) {
					document.body.style.cursor = "not-allowed"
				}
			}

			if (hovered) {
				ctx.globalAlpha = 0.25
				ui.img(result.x, result.y, result.visWidth, result.visHeight, inventoryImg, [192, 176, 16, 16])
				ctx.globalAlpha = 0.9
				if (selectedRecipe == -1) {
					document.body.style.cursor = "default"
				}
			}
		} else if (tab == "options") {
			ui.img(81*4/2*su, 176*4/2*su, 81*4*su, 176*4*su, inventoryImg, [0, 0, 81, 176])
			
			ui.text(10*su, (10+20)*su, 18*su, "Horizontal Render Distance: "+renderSize.x)
			hrd.x = 80*2*su
			hrd.y = (10+16*3+5)*su
			hrd.width = 32*4*su; hrd.height = 16*4*su; hrd.handleWidth = 16*4*su; hrd.handleHeight = 16*4*su
			hrd.value = renderSize.x
			hrd.draw(ctx)
			if (hrd.hovered()) {
				if (mouse.ldown) {
					hrd.value = Math.round(hrd.convert(mouse.x))
					hrd.capValue()
					renderSize.x = hrd.value
					renderSize.z = hrd.value
				}
				highlightSlider(hrd)
			}

			ui.text(10*su, (10+20+64)*su, 18*su, "Vertical Render Distance: "+renderSize.y)
			vrd.x = 80*2*su
			vrd.y = (10+16*3+5+64)*su
			vrd.width = 32*4*su; vrd.height = 16*4*su; vrd.handleWidth = 16*4*su; vrd.handleHeight = 16*4*su
			vrd.value = renderSize.y
			vrd.draw(ctx)
			if (vrd.hovered()) {
				if (mouse.ldown) {
					vrd.value = Math.round(vrd.convert(mouse.x))
					vrd.capValue()
					renderSize.y = vrd.value
				}
				highlightSlider(vrd)
			}
			
			ui.text(10*su, (10+20+128)*su, 18*su, "Chunk Load Speed: "+chunkLoadSpeed)
			cls.x = 80*2*su
			cls.y = (10+16*3+5+128)*su
			cls.width = 32*4*su; cls.height = 16*4*su; cls.handleWidth = 16*4*su; cls.handleHeight = 16*4*su
			cls.value = chunkLoadSpeed
			cls.draw(ctx)
			if (cls.hovered()) {
				if (mouse.ldown) {
					cls.value = Math.round(cls.convert(mouse.x))
					cls.capValue()
					chunkLoadSpeed = cls.value
				}
				highlightSlider(cls)
			}
			
			ui.text(10*su, (10+20+64*3)*su, 18*su, "Mouse Sensitivity: "+Math.round(sensitivity*1000))
			ms.x = 80*2*su
			ms.y = (10+16*3+5+64*3)*su
			ms.width = 32*4*su; ms.height = 16*4*su; ms.handleWidth = 16*4*su; ms.handleHeight = 16*4*su
			ms.value = sensitivity*1000
			ms.draw(ctx)
			if (ms.hovered()) {
				if (mouse.ldown) {
					ms.value = Math.round(ms.convert(mouse.x))
					ms.capValue()
					sensitivity = ms.value/1000
				}
				highlightSlider(ms)
			}
			
			ui.text(10*su, (10+20+128+128+64)*su, 18*su, "Player Skin: "+ playerNames[playerT.join(",")])

			var order = Object.keys(playerNames)
			
			upSkin.x = (10+12*4/2)*su
			upSkin.y = (10+20+128+128+64+10+12*4/2)*su
			upSkin.width = 12*4*su
			upSkin.height = 12*4*su
			upSkin.draw(ctx)
			upSkin.basic()
			if (upSkin.hovered()) {
				if (mouse.lclick) {
					upSkin.click()
					let i = order.indexOf(playerT.join(","))
					if (i > 0) {
						i -= 1
					} else {
						i = order.length-1
					}
					playerT = order[i].split(",")
					player.updateTexture(playerT)
				}
				ctx.globalAlpha = 0.25
				ui.img(upSkin.x, upSkin.y, upSkin.visWidth, upSkin.visHeight, inventoryImg, [192, 176, 16, 16])
				ctx.globalAlpha = 0.9
			}

			downSkin.x = (10+12*4/2)*su
			downSkin.y = (10+20+128+128+64+10+12*4+12*4/2)*su
			downSkin.width = 12*4*su
			downSkin.height = 12*4*su
			downSkin.draw(ctx)
			downSkin.basic()
			if (downSkin.hovered()) {
				if (mouse.lclick) {
					downSkin.click()
					let i = order.indexOf(playerT.join(","))
					if (i < order.length-1) {
						i += 1
					} else {
						i = 0
					}
					playerT = order[i].split(",")
					player.updateTexture(playerT)
				}
				ctx.globalAlpha = 0.25
				ui.img(downSkin.x, downSkin.y, downSkin.visWidth, downSkin.visHeight, inventoryImg, [192, 176, 16, 16])
				ctx.globalAlpha = 0.9
			}
			
			usernameBox.x = 150*su
			usernameBox.y = 525*su
			usernameBox.width = 200*su
			usernameBox.height = 20*su
			usernameBox.outlineSize = 5*su

			usernameBox.hover()

			usernameBox.draw(ctx)
			
			ui.img((10+12*4+5 + 24*4/2)*su, (10+20+128+128+64+10 + 24*4/2)*su, 24*4*su, 24*4*su, playerImg, [32+playerT[0]*48, (playerSize2.y-1-playerT[1])*44, 8, 8])
			
			ui.text(10*su, (30+256+64+24*4+18*2)*su, 14*su, "*You can see yourself by pressing P*")
		}

		var tabs = ["backpack", "options"]
		for (let i in tabs) {
			let hovered = ui.hovered(((i*16+16+8)*4 + 16*4/2)*su, (164*4 + 16*4/2)*su, 16*4*su, 16*4*su)
			let x = i
			let y = 0
			let selectedOff = 48
			if (i == 1) {
				x = -1
				y = 1
				selectedOff = 16
			}
			if (tab == tabs[i]) {
				ui.img(((i*16+16+8)*4 + 16*4/2)*su, (164*4 + 16*4/2)*su, 16*4*su, 16*4*su, inventoryImg, [x*16+16, 176+y*16, 16, 16])
				if (hovered) {
					ctx.globalAlpha = 0.25
					ui.img(((i*16+16+8)*4 + 16*4/2)*su, (164*4 + 16*4/2)*su, 16*4*su, 16*4*su, inventoryImg, [208, 176, 16, 16])
					ctx.globalAlpha = 0.9
				}
			} else {
				ui.img(((i*16+16+8)*4 + 16*4/2)*su, (164*4 + 16*4/2)*su, 16*4*su, 16*4*su, inventoryImg, [x*16+16+selectedOff, 176+y*16, 16, 16])
				if (hovered) {
					ctx.globalAlpha = 0.25
					ui.img(((i*16+16+8)*4 + 16*4/2)*su, (164*4 + 16*4/2)*su, 16*4*su, 16*4*su, inventoryImg, [224, 176, 16, 16])
					ctx.globalAlpha = 0.9
				}
			}
			if (hovered && mouse.lclick) {
				tab = tabs[i]
			}
		}
		
		off = 88*4-28
	} else {

		if (mobile) {
			inventoryButton.x = 220*su
			inventoryButton.y = 40*su
			inventoryButton.width = 70*su
			inventoryButton.height = 70*su
			inventoryButton.basic()
			inventoryButton.draw(ctx)

			spawnButton.x = 220*su+75*su
			spawnButton.y = 40*su
			spawnButton.width = 70*su
			spawnButton.height = 70*su
			spawnButton.basic()
			spawnButton.draw(ctx)

			cameraButton.x = 220*su+75*2*su
			cameraButton.y = 40*su
			cameraButton.width = 70*su
			cameraButton.height = 70*su
			cameraButton.basic()
			cameraButton.draw(ctx)

			chatButton.x = 220*su+75*3*su
			chatButton.y = 40*su
			chatButton.width = 70*su
			chatButton.height = 70*su
			chatButton.basic()
			chatButton.draw(ctx)

			if (inventoryButton.hovered() && mouse.lclick) {
				inventoryButton.click()
				mouse.locked = false
			}

			if (spawnButton.hovered() && mouse.lclick) {
				spawnButton.click()
				player.tp(cs.x / 2 + 0.5, worldSize.y, cs.z / 2 + 0.5)
			}

			if (cameraButton.hovered() && mouse.lclick) {
				cameraButton.click()
				thirdPerson = !thirdPerson
			}

			ctx.beginPath()
			ctx.arc(200*su, canvas.height-250*su, 135*su, 0, Math.PI*2)
			ctx.closePath()
			ctx.fillStyle = "rgba(127, 127, 127, 0.75)"
			ctx.fill()

			ctx.beginPath()
			ctx.arc(200*su + joyStickPos.x*135*su, canvas.height-250*su + joyStickPos.y*135*su, 50*su, 0, Math.PI*2)
			ctx.closePath()
			ctx.fillStyle = "rgba(100, 100, 100, 0.9)"
			ctx.fill()

			joyStickPos = {x: 0, y: 0}

			// console.log(touches)

			for (let mouseID in touches) {
				let mouse = touches[mouseID]
				console.log(mouse)
				if (mouse.x < 400*su && mouse.y > canvas.height-500*su && !(mouse.x > 300*su && mouse.y > canvas.height-80*su)) {
					joyStickPos = {x: mouse.x, y: mouse.y}
					let distance = Math.sqrt((joyStickPos.x-200*su)**2 + (joyStickPos.y-(canvas.height-250*su))**2)
					if (distance > 135*su) {
						joyStickPos.x = 200*su + (joyStickPos.x-200*su) * (135*su / distance)
						joyStickPos.y = canvas.height-250*su + (joyStickPos.y-(canvas.height-250*su)) * (135*su / distance)
					}
					joyStickPos.x -= 200*su
					joyStickPos.y -= canvas.height-250*su
					joyStickPos.x /= 135*su
					joyStickPos.y /= 135*su
				}
			}

			buildButton.x = canvas.width-200*su+50*su
			buildButton.y = canvas.height-200*su+25*su
			buildButton.width = 125*su
			buildButton.height = 125*su
			buildButton.basic()
			buildButton.draw(ctx)

			breakButton.x = canvas.width-200*su-75*su
			breakButton.y = canvas.height-200*su+25*su
			breakButton.width = 125*su
			breakButton.height = 125*su
			breakButton.basic()
			breakButton.draw(ctx)

			jumpButton.x = canvas.width-200*su+50*su
			jumpButton.y = canvas.height-200*su+25*su-125*su
			jumpButton.width = 125*su
			jumpButton.height = 125*su
			jumpButton.basic()
			jumpButton.draw(ctx)

			shiftButton.x = canvas.width-200*su-75*su
			shiftButton.y = canvas.height-200*su+25*su-125*su
			shiftButton.width = 125*su
			shiftButton.height = 125*su
			shiftButton.basic()
			shiftButton.draw(ctx)

			keys["KeyC"] = false
			keys["Space"] = false
			let lclick = mouse.lclick
			for (let mouseID in touches) {
				let mouse = touches[mouseID]
				let oldMouse = input.mouse
				input.mouse = mouse
				if (jumpButton.hovered("none", mouse)) {
					jumpButton.click()
					player.jumpPressed = 10
					keys["Space"] = true
				}
				if (shiftButton.hovered("none", mouse)) {
					shiftButton.click()
					keys["KeyC"] = true
				}
				input.mouse = oldMouse
			}
			
		}

		let i = 0
		for (let x = -72*4-36; x < 72*4+72; x += 72) {
			drawSlot(canvas.width/2+x*su, canvas.height - (10+72/2)*su, itemData[inventory[i][0]][0], i == selected, inventory[i][1], 72*su, 72*su)
			if (mobile) {
				if (ui.hovered(canvas.width/2+x*su, canvas.height - (10+72/2)*su, 72*su, 72*su) && mouse.lclick) {
					selected = i
				}
			}

			i += 1
		}
	}

	let offy = 0
	if (tab == "backpack" && inventoryOpen) {
		offy = 113*4
	}

	loadedChunksA = utils.lerp(loadedChunksA, Object.keys(chunks).length, delta*10)

	ctx.globalAlpha = 0.9
	ui.text((10+off)*su, (10+35/2 + offy)*su, 35*su, `FPS: ${Math.round(fps)}`)
	ui.text((10+off)*su, (40+35/2 + offy)*su, 13*su, `Loaded Chunks: ${Math.round(loadedChunks)} / ${(renderSize.x*2+1) * (renderSize.y*2+1) * (renderSize.z*2+1)}`, "left", 20*su/4.5)
	if (keys["KeyU"]) ui.text((10+off)*su, (70+35/2 + offy)*su, 35*su, "SUPER LOAD", {colour: [255, 127, 127, 1]})

	if (hoverText != "" && selectedItem[0] == "none" && mouse.has) {
		ui.text(mouse.x+10*su, mouse.y+30*su, 20*su, expandName(hoverText))
	}

	if (inventory[selected][0] != "none" && !inventoryOpen) {
		ctx.globalAlpha = showName
		if (showName > 2.75) {
			ctx.globalAlpha = 1-(showName-2.75)*4
		}
		ui.text(canvas.width/2, canvas.height+(-16*5/2-15-36-5)*su, 25*su, expandName(inventory[selected][0]), {align: "center"})
	}

	ctx.globalAlpha = chatBox.alpha
	chatBox.isChat = true
	if (blockBig) {
		chatBox.text = chatBox.text.substring(0, 30)
	}
	chatBox.width = (500-10)*su
	chatBox.height = 20*su
	chatBox.outlineSize = 10*su
	let tAlpha = 0
	if (!inventoryOpen) {
		let h = ui.text(-1000*su, 100*su, 20*su, chat.join(" \n"), {wrap: 490*su}).lines*20+20
		ui.rect(500*su/2, (80+h/2)*su, 500*su, h*su, [0, 0, 0, 0.5])
		ui.text(10*su, 100*su, 20*su, chat.join(" \n"), {wrap: 490*su})
		chatBox.x = 500*su/2
		chatBox.y = (h+10+80)*su
		chatBox.draw(ctx)
		if (ui.hovered(500*su/2, (80+h/2)*su, 500*su, h*su)) {
			tAlpha = 0.9
		}
	} else if (tab == "options") {
		let h = ui.text(-1000*su, 100*su, 20*su, chat.join(" \n"), {wrap: 490*su}).lines*20+20
		ui.rect(500*su/2 + 81*4*su, (100-20+h/2)*su, 500*su, h*su, [0, 0, 0, 0.5])
		ui.text(10*su + 81*4*su, 100*su, 20*su, chat.join(" \n"), {wrap: 490*su})
		chatBox.x = 500*su/2 + 81*4*su
		chatBox.y = (h+10+80)*su
		chatBox.draw(ctx)
		if (ui.hovered(500*su/2 + 81*4*su, (100-20+h/2)*su, 500*su, h*su)) {
			tAlpha = 0.9
		}
	} else {
		let h = ui.text(-1000*su, 100*su, 20*su, chat.join(" \n"), {wrap: 490*su}).lines*20+20
		ui.rect(500*su/2 + 168*4*su, (h/2+10)*su, 500*su, h*su, [0, 0, 0, 0.5])
		ui.text(10*su + 168*4*su, 30*su, 20*su, chat.join(" \n"), {wrap: 490*su})
		chatBox.x = 500*su/2 + 168*4*su
		chatBox.y = (h+10+10)*su
		chatBox.draw(ctx)
		if (ui.hovered(500*su/2 + 168*4*su, (h/2+10)*su, 500*su, h*su)) {
			tAlpha = 0.9
		}
	}

	if (chatBox.focused) {
		tAlpha = 0.9
		chatBox.stop = 1.5
	}

	if (chatBox.stop > 0) {
		tAlpha = 0.9
	}

	chatBox.stop -= delta
	if (chatBox.stop <= 0 || tAlpha-chatBox.alpha > 0) {
		if (tAlpha-chatBox.alpha > 0) {
			chatBox.alpha += (tAlpha-chatBox.alpha)*delta*10
		} else {
			chatBox.alpha += (tAlpha-chatBox.alpha)*delta*5
		}
	}
	ctx.globalAlpha = 0.9

	if (jKeys["Enter"]) {
		if (chatBox.focused) {
			chatBox.focused = false
			input.focused = null
		} else {
			input.focused = chatBox
			chatBox.focused = true
			input.getInput.focus()
			chatBox.time = 0
			input.getInput.value = chatBox.text
		}
	}
	if (selectedItem[1] > 0 && mouse.has) {
		let item = itemData[selectedItem[0]][0]
		ui.img(mouse.x+32*su, mouse.y+40*su, 64/1.5*1.1*su, 64/1.5*1.1*su, itemsImg, [item[0]*16, item[1]*16, 16, 16])

		if (selectedItem[1] > 1) {
			ui.text(mouse.x+(32-64/2/1.5)*su, mouse.y+(40-64/2/1.5)*su, 15*su, `${selectedItem[1]}`)
		}
	}
}

function drawButton(x, y, w, h, img, srcX, srcY, srcW, srcH, hovered, clicked, highlight=true) {
	if (clicked && hovered) {
		w /= 1.5
		h /= 1.5
	}
	if (hovered) {
		ctx.drawImage(img, srcX, srcY, srcW, srcH, x-w*1.1/2, y-h*1.1/2, w*1.1, h*1.1)
		if (highlight) {
			ctx.globalAlpha = 0.25
			ctx.drawImage(inventoryImg, 192, 176, 16, 16, x-w*1.1/2, y-h*1.1/2, w*1.1, h*1.1)
			ctx.globalAlpha = 0.9
		}
	} else {
		ctx.drawImage(img, srcX, srcY, srcW, srcH, x-w/2, y-h/2, w, h)
	}
}

function drawSlider(x, y, percentage, hovered) {
	ctx.drawImage(inventoryImg, 16*7, 176+16, 32, 16, x-16*4, y, 32*4, 16*4)
	if (hovered) {
		ctx.globalAlpha = 0.1
		ctx.drawImage(inventoryImg, 16*9, 176+16, 32, 16, x-16*4, y, 32*4, 16*4)
		ctx.globalAlpha = 0.9
	}
	ctx.drawImage(inventoryImg, 16*6, 176+16, 16, 16, x-16*4-5*4 + (32*2+10*4)*percentage, y, 16*4, 16*4)
	if (hovered) {
		ctx.globalAlpha = 0.1
		ctx.drawImage(inventoryImg, 16*11, 176+16, 16, 16, x-16*4-5*4 + (32*2+10*4)*percentage, y, 16*4, 16*4)
		ctx.globalAlpha = 0.9
	}
}

function drawText(x, y, text, size, align="left") {
	if (!fontLoaded) {return}
	ctx.fillStyle = `rgb(${255}, ${255}, ${255})`
	ctx.font = `${size}px font`
	ctx.strokeStyle = "black"
	ctx.textAlign = align
	ctx.lineWidth = size/5
	ctx.strokeText(text, x, y)
	ctx.fillText(text, x, y)
}

function drawSlot(x, y, item, highlight, count, w=64, h=64) {
	if (highlight) {
		ui.img(x, y, w*1.1, h*1.1, inventoryImg, [0, 176, 16, 16])
		if (item) {
			ui.img(x, y, w/1.5*1.1, h/1.5*1.1, itemsImg, [item[0]*16, item[1]*16, 16, 16])
		}
		ctx.globalAlpha = 0.25
		ui.img(x, y, w*1.1, h*1.1, inventoryImg, [192, 176, 16, 16])
		ctx.globalAlpha = 0.9
	} else {
		ui.img(x, y, w, h, inventoryImg, [0, 176, 16, 16])
		if (item) {
			ui.img(x, y, w/1.5, h/1.5, itemsImg, [item[0]*16, item[1]*16, 16, 16])
		}
	}
	if (count > 1) {
		ui.text(x-w/2/1.5, y-h/2/1.5/2, 15*su, `${count}`)
	}
}

function inventoryLogic(i, hovered) {
	if (hovered && mouse.lclick) {
		if (inventory[i][0] == selectedItem[0]) {
			if (inventory[i][1] + selectedItem[1] <= itemData[inventory[i][0]][3]) {
				inventory[i][1] += selectedItem[1]
				selectedItem = ["none", 0]
			} else {
				var diff = itemData[inventory[i][0]][3]-inventory[i][1]
				inventory[i][1] = itemData[inventory[i][0]][3]
				selectedItem[1] -= diff
				if (diff == 0) {
					var oldSelectedItem = [...selectedItem]
					selectedItem = [...inventory[i]]
					inventory[i] = [...oldSelectedItem]
				}
			}
		} else {
			var oldSelectedItem = [...selectedItem]
			selectedItem = [...inventory[i]]
			inventory[i] = [...oldSelectedItem]
		}
	}
	if (mouse.rclick && hovered) {
		if (selectedItem[0] == "none") {
			if (inventory[i][1] > 1) {
				selectedItem = [inventory[i][0], Math.round(inventory[i][1]/2)]
				inventory[i][1] -= selectedItem[1]
			}
		} else if (inventory[i][0] == selectedItem[0]) {
			if (inventory[i][1] < itemData[inventory[i][0]][3]) {
				selectedItem[1] -= 1
				inventory[i][1] += 1
				if (selectedItem[1] <= 0) {
					selectedItem = ["none", 0]
				}
			}
		} else if (inventory[i][0] == "none") {
			inventory[i] = [selectedItem[0], 1]
			selectedItem[1] -= 1
			if (selectedItem[1] <= 0) {
				selectedItem = ["none", 0]
			}
		}
	}
}