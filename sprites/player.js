class Player extends Object3D {
	vel = { x: 0, y: 0, z: 0 }
	falling = 3
	jumpPressed = 0
	dash = 0
	dashDir = { x: 0, y: 0, z: 0 }
	lDash = { x: 0, y: 0, z: 0 }
	moveDir = { x: 0, y: 0, z: 0 }
	speed = 0
	dashes = 0
	floor = 0
	username
	dashing = false
	dashing2 = false
	lastWater = false
	teleporting = false
	teleport = 0
	model = []
	anim = "idle"
	headRot = 0
	pos2 = { x: 0, y: 0, z: 0 }
	wpos = { x: 0, y: 0, z: 0 }
	wcpos = { x: 0, y: 0, z: 0 }
	set = false
	setPos = { x: 0, y: 0, z: 0 }
	floorPos = { x: 0, y: 0, z: 0 }
	lastFPress = 0
	sprinting = false
	hand
	handItem
	handAnim = 0
	handMode = 0
	forceUpdate = 0.5
	handRotOffset = 0
	hroVel = 0
	real = false
	selectedItem = "grass"
	usernameText = ""
	cameraY2 = 0
	cbBlock = 0
	rising = 0
	speedF = 0
	animPoint = 0
	animVel = 1
	jumpOff = 0
	wall = {x: 0, z: 0, v: 3}
	sliding = false
	lastWall = {x: 0, z: 0}
	cameraY = 0.75
	cameraX2 = 0
	constructor(x, y, z) {
		super(x, y, z, 0.5, 1.9, 0.5)
		this.wpos = this.pos
		this.model = [
			new Box(0, 0, 0, 0.5, 0.75, 0.25, [1, 1, 1]),
			new Box(0, 0, 0, 0.5 + 0.001, 0.5 + 0.001, 0.5 + 0.001, [1, 1, 1]),
			new Box(0, 0, 0, 0.25 - 0.001, 0.75 - 0.001, 0.25 - 0.001, [1, 1, 1]),
			new Box(0, 0, 0, 0.25 - 0.001, 0.75 - 0.001, 0.25 - 0.001, [1, 1, 1]),
			new Box(0, 0, 0, 0.25 - 0.001, 0.75 - 0.001, 0.25 - 0.001, [1, 1, 1]),
			new Box(0, 0, 0, 0.25 - 0.001, 0.75 - 0.001, 0.25 - 0.001, [1, 1, 1]),
		]
		this.model[0].offset = { x: 0, y: 0.1 + 0.075, z: 0, xr: 0, yr: 0, zr: 0 }
		this.model[1].offset = { x: 0, y: 0.625 + 0.1 + 0.075, z: 0, xr: 0, yr: 0, zr: 0 }
		this.model[2].offset = { x: 0.125, y: -0.65 + 0.075, z: 0, xr: 0, yr: 0, zr: 0 }
		this.model[3].offset = { x: -0.125, y: -0.65 + 0.075, z: 0, xr: 0, yr: 0, zr: 0 }
		this.model[4].offset = { x: 0.375, y: 0.1 + 0.075, z: 0, xr: 0, yr: 0, zr: 0 }
		this.model[5].offset = { x: -0.375, y: 0.1 + 0.075, z: 0, xr: 0, yr: 0, zr: 0 }

		for (let i in this.model) {
			this.model[i].box.updateBuffers()
			this.model[i].box.useTexture = true
			this.model[i].box.texture = playerTexture
		}

		this.handItem = new Item3D(x, y, z, 0, 0)

		this.hand = new Box(x, y, z, 0.25, 0.75, 0.25, [1, 1, 1])

		this.handItem.visible = false
		this.handItem.updateRaw()
		this.hand.visible = false
		this.hand.box.updateBuffers()
		this.hand.box.useTexture = true
		this.hand.box.texture = playerTexture
		this.hand.box.ignoreDepth = true
		this.hand.box.alphaTexture = alphaTexture
		this.hand.box.rOrder = 5000
		this.handItem.mesh.rOrder = 5000
		this.hand.update()

		this.updateTexture()
		this.username = new Text3D(0, 0, 0, "Unnamed", 0.15)
		// this.username = new Text(0, 0, 0, "Unnamed", 0.25, 0.01, [255, 255, 255])
		// this.attack = new Box(x, y, z, 2, 2, 2, [0, 215, 255])
		// this.attack.visible = false
	}
	updateTexture(playerT = [0, 0]) {
		this.model[0].mapUvs([
			(psx * 4) * psx2 + playerT[0] * psx2, (psy * 6) * psy2 + playerT[1] * psy2, (psx * 4 + psx) * psx2 + playerT[0] * psx2, (psy * 6 + psy * 3) * psy2 + playerT[1] * psy2,
			(psx * 5) * psx2 + playerT[0] * psx2, (psy * 6) * psy2 + playerT[1] * psy2, (psx * 5 + psx) * psx2 + playerT[0] * psx2, (psy * 6 + psy * 3) * psy2 + playerT[1] * psy2,
			(psx * 6) * psx2 + playerT[0] * psx2, (psy * 8) * psy2 + playerT[1] * psy2, (psx * 6 + psx * 2) * psx2 + playerT[0] * psx2, (psy * 8 + psy) * psy2 + playerT[1] * psy2,
			(psx * 6) * psx2 + playerT[0] * psx2, (psy * 7) * psy2 + playerT[1] * psy2, (psx * 6 + psx * 2) * psx2 + playerT[0] * psx2, (psy * 7 + psy) * psy2 + playerT[1] * psy2,
			(0) * psx2 + playerT[0] * psx2, (psy * 6) * psy2 + playerT[1] * psy2, (0 + psx * 2) * psx2 + playerT[0] * psx2, (psy * 6 + psy * 3) * psy2 + playerT[1] * psy2,
			(psx * 2) * psx2 + playerT[0] * psx2, (psy * 6) * psy2 + playerT[1] * psy2, (psx * 2 + psx * 2) * psx2 + playerT[0] * psx2, (psy * 6 + psy * 3) * psy2 + playerT[1] * psy2,
		])

		this.model[1].mapUvs([
			(0) * psx2 + playerT[0] * psx2, (1 - psy * 2) * psy2 + playerT[1] * psy2, (psx * 2) * psx2 + playerT[0] * psx2, (1) * psy2 + playerT[1] * psy2,
			(psx * 2) * psx2 + playerT[0] * psx2, (1 - psy * 2) * psy2 + playerT[1] * psy2, (psx * 2 + psx * 2) * psx2 + playerT[0] * psx2, (1) * psy2 + playerT[1] * psy2,
			(psx * 4) * psx2 + playerT[0] * psx2, (1 - psy * 2) * psy2 + playerT[1] * psy2, (psx * 4 + psx * 2) * psx2 + playerT[0] * psx2, (1) * psy2 + playerT[1] * psy2,
			(psx * 6) * psx2 + playerT[0] * psx2, (1 - psy * 2) * psy2 + playerT[1] * psy2, (psx * 6 + psx * 2) * psx2 + playerT[0] * psx2, (1) * psy2 + playerT[1] * psy2,
			(psx * 8) * psx2 + playerT[0] * psx2, (1 - psy * 2) * psy2 + playerT[1] * psy2, (psx * 8 + psx * 2) * psx2 + playerT[0] * psx2, (1) * psy2 + playerT[1] * psy2,
			(psx * 10) * psx2 + playerT[0] * psx2, (1 - psy * 2) * psy2 + playerT[1] * psy2, (psx * 10 + psx * 2) * psx2 + playerT[0] * psx2, (1) * psy2 + playerT[1] * psy2,
		])

		this.model[2].mapUvs([
			(psx * 2) * psx2 + playerT[0] * psx2, (0) * psy2 + playerT[1] * psy2, (psx * 2 + psx) * psx2 + playerT[0] * psx2, (0 + psy * 3) * psy2 + playerT[1] * psy2,
			(psx * 3) * psx2 + playerT[0] * psx2, (0) * psy2 + playerT[1] * psy2, (psx * 3 + psx) * psx2 + playerT[0] * psx2, (0 + psy * 3) * psy2 + playerT[1] * psy2,
			(psx * 4) * psx2 + playerT[0] * psx2, (psy) * psy2 + playerT[1] * psy2, (psx * 4 + psx) * psx2 + playerT[0] * psx2, (psy + psy) * psy2 + playerT[1] * psy2,
			(psx * 4) * psx2 + playerT[0] * psx2, (0) * psy2 + playerT[1] * psy2, (psx * 4 + psx) * psx2 + playerT[0] * psx2, (0 + psy) * psy2 + playerT[1] * psy2,
			(0) * psx2 + playerT[0] * psx2, (0) * psy2 + playerT[1] * psy2, (0 + psx) * psx2 + playerT[0] * psx2, (0 + psy * 3) * psy2 + playerT[1] * psy2,
			(psx) * psx2 + playerT[0] * psx2, (0) * psy2 + playerT[1] * psy2, (psx + psx) * psx2 + playerT[0] * psx2, (0 + psy * 3) * psy2 + playerT[1] * psy2,
		])

		this.model[3].mapUvs([
			(psx * 2 + psx * 5) * psx2 + playerT[0] * psx2, (0) * psy2 + playerT[1] * psy2, (psx * 2 + psx + psx * 5) * psx2 + playerT[0] * psx2, (0 + psy * 3) * psy2 + playerT[1] * psy2,
			(psx * 3 + psx * 5) * psx2 + playerT[0] * psx2, (0) * psy2 + playerT[1] * psy2, (psx * 3 + psx + psx * 5) * psx2 + playerT[0] * psx2, (0 + psy * 3) * psy2 + playerT[1] * psy2,
			(psx * 4 + psx * 5) * psx2 + playerT[0] * psx2, (psy) * psy2 + playerT[1] * psy2, (psx * 4 + psx + psx * 5) * psx2 + playerT[0] * psx2, (psy + psy) * psy2 + playerT[1] * psy2,
			(psx * 4 + psx * 5) * psx2 + playerT[0] * psx2, (0) * psy2 + playerT[1] * psy2, (psx * 4 + psx + psx * 5) * psx2 + playerT[0] * psx2, (0 + psy) * psy2 + playerT[1] * psy2,
			(0 + psx * 5) * psx2 + playerT[0] * psx2, (0) * psy2 + playerT[1] * psy2, (0 + psx + psx * 5) * psx2 + playerT[0] * psx2, (0 + psy * 3) * psy2 + playerT[1] * psy2,
			(psx + psx * 5) * psx2 + playerT[0] * psx2, (0) * psy2 + playerT[1] * psy2, (psx + psx + psx * 5) * psx2 + playerT[0] * psx2, (0 + psy * 3) * psy2 + playerT[1] * psy2,
		])

		this.model[4].mapUvs([
			(psx * 2) * psx2 + playerT[0] * psx2, (psy * 3) * psy2 + playerT[1] * psy2, (psx * 2 + psx) * psx2 + playerT[0] * psx2, (psy * 3 + psy * 3) * psy2 + playerT[1] * psy2,
			(psx * 3) * psx2 + playerT[0] * psx2, (psy * 3) * psy2 + playerT[1] * psy2, (psx * 3 + psx) * psx2 + playerT[0] * psx2, (psy * 3 + psy * 3) * psy2 + playerT[1] * psy2,
			(psx * 4) * psx2 + playerT[0] * psx2, (psy * 4) * psy2 + playerT[1] * psy2, (psx * 4 + psx) * psx2 + playerT[0] * psx2, (psy * 4 + psy) * psy2 + playerT[1] * psy2,
			(psx * 4) * psx2 + playerT[0] * psx2, (psy * 3) * psy2 + playerT[1] * psy2, (psx * 4 + psx) * psx2 + playerT[0] * psx2, (psy * 3 + psy) * psy2 + playerT[1] * psy2,
			(0) * psx2 + playerT[0] * psx2, (psy * 3) * psy2 + playerT[1] * psy2, (0 + psx) * psx2 + playerT[0] * psx2, (psy * 3 + psy * 3) * psy2 + playerT[1] * psy2,
			(psx) * psx2 + playerT[0] * psx2, (psy * 3) * psy2 + playerT[1] * psy2, (psx + psx) * psx2 + playerT[0] * psx2, (psy * 3 + psy * 3) * psy2 + playerT[1] * psy2,
		])

		this.model[5].mapUvs([
			(psx * 2 + psx * 5) * psx2 + playerT[0] * psx2, (psy * 3) * psy2 + playerT[1] * psy2, (psx * 2 + psx + psx * 5) * psx2 + playerT[0] * psx2, (psy * 3 + psy * 3) * psy2 + playerT[1] * psy2,
			(psx * 3 + psx * 5) * psx2 + playerT[0] * psx2, (psy * 3) * psy2 + playerT[1] * psy2, (psx * 3 + psx + psx * 5) * psx2 + playerT[0] * psx2, (psy * 3 + psy * 3) * psy2 + playerT[1] * psy2,
			(psx * 4 + psx * 5) * psx2 + playerT[0] * psx2, (psy * 4) * psy2 + playerT[1] * psy2, (psx * 4 + psx + psx * 5) * psx2 + playerT[0] * psx2, (psy * 4 + psy) * psy2 + playerT[1] * psy2,
			(psx * 4 + psx * 5) * psx2 + playerT[0] * psx2, (psy * 3) * psy2 + playerT[1] * psy2, (psx * 4 + psx + psx * 5) * psx2 + playerT[0] * psx2, (psy * 3 + psy) * psy2 + playerT[1] * psy2,
			(0 + psx * 5) * psx2 + playerT[0] * psx2, (psy * 3) * psy2 + playerT[1] * psy2, (0 + psx + psx * 5) * psx2 + playerT[0] * psx2, (psy * 3 + psy * 3) * psy2 + playerT[1] * psy2,
			(psx + psx * 5) * psx2 + playerT[0] * psx2, (psy * 3) * psy2 + playerT[1] * psy2, (psx + psx + psx * 5) * psx2 + playerT[0] * psx2, (psy * 3 + psy * 3) * psy2 + playerT[1] * psy2,
		])

		if (this.handMode == 0) {
			this.hand.mapUvs([
				(psx * 2) * psx2 + playerT[0] * psx2, (psy * 3) * psy2 + playerT[1] * psy2, (psx * 2 + psx) * psx2 + playerT[0] * psx2, (psy * 3 + psy * 3) * psy2 + playerT[1] * psy2,
				(psx * 3) * psx2 + playerT[0] * psx2, (psy * 3) * psy2 + playerT[1] * psy2, (psx * 3 + psx) * psx2 + playerT[0] * psx2, (psy * 3 + psy * 3) * psy2 + playerT[1] * psy2,
				(psx * 4) * psx2 + playerT[0] * psx2, (psy * 4) * psy2 + playerT[1] * psy2, (psx * 4 + psx) * psx2 + playerT[0] * psx2, (psy * 4 + psy) * psy2 + playerT[1] * psy2,
				(psx * 4) * psx2 + playerT[0] * psx2, (psy * 3) * psy2 + playerT[1] * psy2, (psx * 4 + psx) * psx2 + playerT[0] * psx2, (psy * 3 + psy) * psy2 + playerT[1] * psy2,
				(0) * psx2 + playerT[0] * psx2, (psy * 3) * psy2 + playerT[1] * psy2, (0 + psx) * psx2 + playerT[0] * psx2, (psy * 3 + psy * 3) * psy2 + playerT[1] * psy2,
				(psx) * psx2 + playerT[0] * psx2, (psy * 3) * psy2 + playerT[1] * psy2, (psx + psx) * psx2 + playerT[0] * psx2, (psy * 3 + psy * 3) * psy2 + playerT[1] * psy2,
			])
		}
		this.updateBuffers()
	}
	tp(x, y, z) {
		this.set = true
		this.setPos = { x: x, y: y, z: z }
	}
	updateBuffers() {
		for (let model of this.model) {
			model.box.updateBuffers()
		}
		this.hand.box.updateBuffers()
	}
	getDir(x, y, z) {
		let x2 = 0
		if (x > 0) {
			x2 = 1
		}
		if (x < 0) {
			x2 = -1
		}
		let y2 = 0
		if (y > 0) {
			y2 = 1
		}
		if (y < 0) {
			y2 = -1
		}
		let z2 = 0
		if (z > 0) {
			z2 = 1
		}
		if (z < 0) {
			z2 = -1
		}
		return {x:x2, y:y2, z:z2}
	}
	tick() {
		this.cameraY2 = camera.rot.y
		this.cameraX2 = camera.rot.x
		// this.username.visible = false
		if (this.set) {
			this.set = false
			this.wpos = { ...this.setPos }
		}
		var cBlock = getBlock(Math.floor(this.pos.x), Math.floor(this.pos.y - 0.5), Math.floor(this.pos.z))
		var cBlockA = getBlock(Math.floor(this.pos.x), Math.floor(this.pos.y + 0.5), Math.floor(this.pos.z))
		var inWater = cBlock == 6 || cBlock == 14 || cBlockA == 6 || cBlockA == 14
		this.cbBlock = getBlock(Math.floor(this.pos.x), Math.floor(this.pos.y - 0.5) - 1, Math.floor(this.pos.z))
		this.jumpPressed -= 1 * 60 * delta

		this.handAnim -= 1 * delta
		this.forceUpdate -= 1 * delta
		this.dash -= delta

		this.selectedItem = inventory[selected][0]

		if (this.cbBlock == 41 && this.falling < 0.1) {
			this.rising = 2
		}
		if (this.rising > 0) {
			this.vel.y += 40 * delta
			this.vel.y -= (1 - 0.9) * delta * this.vel.y * 60
		}
		this.rising -= delta
		if (this.rising < 0) {
			this.rising = 0
		}

		if ((mouse.lclick || mobileL) && checkValidClick() && inInventory <= 0) {
			this.handAnim = 0.2
		}

		if (this.handAnim < 0) {
			this.handAnim = 0
		}

		if ((mouse.lclick || mouse.rclick || mobileL || mobileR) && checkValidClick() && !inventoryOpen && inInventory <= 0) {
			this.hroVel = 50
			this.handRotOffset = 0
			sendMsg({ use: true })
		}

		this.handRotOffset += this.hroVel * delta
		this.hroVel -= 1000 * delta

		if (this.handRotOffset < 0) {
			this.handRotOffset = 0
		}

		if (jKeys["KeyJ"]) {
			playerT = [0, 0]
			this.updateTexture(playerT)
		}
		if (jKeys["KeyK"]) {
			playerT = [1, 0]
			this.updateTexture(playerT)
		}
		if (jKeys["KeyL"]) {
			playerT = [0, 1]
			this.updateTexture(playerT)
		}
		if (jKeys["Semicolon"]) {
			playerT = [1, 1]
			this.updateTexture(playerT)
		}

		this.lastFPress -= delta
		if (jKeys["KeyW"]) {
			if (this.lastFPress > 0 && !keys["KeyC"]) {
				this.sprinting = true
			}
			this.lastFPress = 0.25
		}

		if (keys["KeyC"]) {
			this.sprinting = false
		}

		if (!keys["KeyW"]) {
			this.sprinting = false
		}

		if (this.teleporting) {
			this.teleport += 1 * delta
		}
		if (this.teleport >= 3) {
			this.teleport = 0
			this.teleporting = false
			this.tp(cs.x / 2 + 0.5, worldSize.y, cs.z / 2 + 0.5)
		}
		if (jKeys["Space"]) {
			this.jumpPressed = 10
		}
		this.attacking -= 1 * 60 * delta
		if ((mouse.lclick || mobileL) && checkValidClick() && !inventoryOpen && inInventory <= 0) {
			var bp = indicator.pos
			if (indicator.visible) {
				var block = getData(getBlock(Math.floor(bp.x), Math.floor(bp.y), Math.floor(bp.z)))
				if (block) {
					if (enoughSpace(blocks[block][7], 1)) {
						var s = [Math.floor(bp.x) + this.wcpos.x, Math.floor(bp.y) + this.wcpos.y, Math.floor(bp.z) + this.wcpos.z, 0]
						if (!sets.includes(s)) {
							sendMsg({ "set": s })
							addSet(s, true)
						}
						if (block != 0) {
							addItem(blocks[block][7], 1, true)
						}
						setTickCooldown = 0
					}
				}
			}
			// sendMsg({"broadcast": {"attack": id}})
			// this.attacking = 10
		}
		if ((mouse.rclick || mobileR) && checkValidClick() && !inventoryOpen && inInventory <= 0) {
			var bp = { ...rp }
			bp.x -= Math.sin(camera.rot.y) * Math.cos(-camera.rot.x) * 0.025
			bp.y -= Math.sin(-camera.rot.x) * 0.025
			bp.z -= Math.cos(camera.rot.y) * Math.cos(-camera.rot.x) * 0.025
			bp = { x: Math.round(bp.x + 0.5) - 0.5, y: Math.round(bp.y + 0.5) - 0.5, z: Math.round(bp.z + 0.5) - 0.5 }
			var bpHitbox = new Object3D(bp.x, bp.y, bp.z, 1, 1, 1)
			if (!this.isColliding([bpHitbox]) && indicator.visible && itemData[inventory[selected][0]][1]) {
				var s = [Math.floor(bp.x) + this.wcpos.x, Math.floor(bp.y) + this.wcpos.y, Math.floor(bp.z) + this.wcpos.z, itemData[inventory[selected][0]][2]]
				removeItem(inventory[selected][0], 1, selected)
				if (!sets.includes(s)) { addSet(s, true) }
				this.handAnim = 0.2
				sendMsg({ "set": s })
				setTickCooldown = 0
			}

			// sendMsg({"broadcast": {"attack": id}})
			// this.attacking = 10
		}

		if (this.dash <= 0 && this.dashing) {
			this.dashing = false
			if (this.lDash.y > -1 || this.falling <= 0) {
				if (this.lDash.y > 0) {
					this.vel.y = 7/2
				}
				let cx = this.dashDir.x; if (Math.abs(cx) > 1) { cx /= Math.abs(cx) }
				let cz = this.dashDir.z; if (Math.abs(cz) > 1) { cz /= Math.abs(cz) }
				// this.vel.x = cx * this.speed * delta * 60
				// this.vel.z = cz * this.speed * delta * 60
			}
		}

		if (this.dash > 0.16) {
			this.dashing2 = true
		} else {
			this.dashing2 = false
		}

		if (this.falling <= 0 && this.dash <= 0) {
			this.dashes = 1
		}

		if (inWater) {
			this.dashes = 1
		}

		if (this.wall.v < 0.1 && this.cbBlock == 0 && Math.sqrt(this.vel.x**2+this.vel.z**2) > 0) {
			let t = 0
			if (Math.abs(angleDistance(camera.rot.y, Math.atan2(-this.wall.x, -this.wall.z))) > Math.PI/4) {
				if (Math.abs(Math.sin(camera.rot.y)) > Math.abs(Math.cos(camera.rot.y))) {
					t = Math.PI/32 * this.wall.z * this.getDir(Math.sin(camera.rot.y), 0, Math.cos(camera.rot.y)).x * cameraTilt
				} else {
					t = Math.PI/32 * this.wall.x * this.getDir(Math.sin(camera.rot.y), 0, Math.cos(camera.rot.y)).z * cameraTilt
				}
			}


			// camera.rot.y = Math.atan2(this.wall.x, this.wall.z)
			// console.log(t)
			camera.rot.z += (t - camera.rot.z) * delta * 5 * cameraTilt
		} else {
			camera.rot.z += (0 - camera.rot.z) * delta * 5 * cameraTilt
		}

		if (this.cbBlock != 0) {
			if ((this.vel.x / Math.abs(this.vel.x) != this.wall.x && this.wall.x != 0) || (this.vel.z / Math.abs(this.vel.z) != this.wall.z && this.wall.z != 0)) {
				this.wall.x = 0
				this.wall.z = 0
			}
			// this.wall.x = 0
			// this.wall.z = 0
			this.lastWall.x = 0
			this.lastWall.z = 0
		}

		

		let vx = this.wall.x == 0 || this.wall.x != this.lastWall.x
		let vz = this.wall.z == 0 || this.wall.z != this.lastWall.z

		if (this.jumpPressed > 0 && (this.falling < 0.1 || (this.wall.v < 0.1 && none.includes(this.cbBlock) && vx && vz))) {
			this.teleporting = false
			this.teleport = 0
			this.vel.y = 7
			this.jumpPressed = 0

			if (this.dashing) {

				if (!this.dashing2) {
					this.dashes = 1
				}

				this.dashing = false
				this.dashing2 = false
				this.dash = 0

				let cx = this.dashDir.x; if (Math.abs(cx) > 1) { cx /= Math.abs(cx) }
				let cz = this.dashDir.z; if (Math.abs(cz) > 1) { cz /= Math.abs(cz) }

				if (this.lDash.y < 0) {
					this.vel.y /= 1.5
					// this.vel.x *= 2
					// this.vel.z *= 2
					this.vel.x = cx * dashSpeed*120 * delta * 2
					this.vel.z = cz * dashSpeed*120 * delta * 2
				}
			}

			if (this.wall.v < 0.1 && none.includes(this.cbBlock)) {
				if (this.wall.x != 0) {
					this.vel.x *= -1
					this.lastWall.x = this.wall.x
					this.lastWall.z = this.wall.z
				}
				if (this.wall.z != 0) {
					this.vel.z *= -1
					this.lastWall.x = this.wall.x
					this.lastWall.z = this.wall.z
				}
			}
		} 

		if (this.falling <= 0) {
			this.floor += delta
		} else {
			this.floor = 0
		}

		if (this.floor > 0.1 && this.cbBlock != 51 && !this.sliding) {
			this.vel.x -= (1 - friction) * delta * this.vel.x * 60
			this.vel.z -= (1 - friction) * delta * this.vel.z * 60
			this.speed = speed
		} else if (!this.sliding) {
			this.vel.x -= (1 - airFriction) * delta * this.vel.x * 60
			this.vel.z -= (1 - airFriction) * delta * this.vel.z * 60
			this.speed = airSpeed
			if (this.cbBlock != 52 && this.floor > 0.1) {
				this.speed *= 2
			}
		} else {
			this.speed = airSpeed /= 100
		}
		if (this.sprinting) {
			this.speed *= 2
		}
		if ((keys["KeyC"] && !inventoryOpen) && !godmode) {
			this.speed /= 3
		}
		this.anim = "idle"
		if (!this.dashing2) {
			if (!inWater && !godmode) {
				this.vel.y -= gravity * 60 * delta
			}
			this.dashDir = { x: 0, y: 0, z: 0 }
			this.moveDir = { x: 0, y: 0, z: 0 }
			if (keys["KeyW"]) {
				this.anim = "walk"
 
				let v = Math.sqrt((this.vel.x*Math.sin(camera.rot.y))**2 + (this.vel.z*Math.sin(camera.rot.y))**2) / 15
				if (v < 1) { v = 1 }

				this.vel.z += Math.cos(camera.rot.y) * this.speed * delta
				this.vel.x += Math.sin(camera.rot.y) * this.speed * delta
				this.dashDir.z += Math.cos(camera.rot.y) * v
				this.dashDir.x += Math.sin(camera.rot.y) * v
				this.moveDir.z += Math.cos(camera.rot.y)
				this.moveDir.x += Math.sin(camera.rot.y)
				this.teleporting = false
				this.teleport = 0
			}
			if (keys["KeyS"]) {
				this.anim = "walk"
				this.vel.z -= Math.cos(camera.rot.y) * this.speed * delta
				this.vel.x -= Math.sin(camera.rot.y) * this.speed * delta
				this.dashDir.z -= Math.cos(camera.rot.y)
				this.dashDir.x -= Math.sin(camera.rot.y)
				this.moveDir.z -= Math.cos(camera.rot.y)
				this.moveDir.x -= Math.sin(camera.rot.y)
				this.teleporting = false
				this.teleport = 0
			}
			if (keys["KeyA"]) {
				this.anim = "walk"
				this.vel.z -= Math.cos(camera.rot.y + Math.PI / 2) * this.speed * delta
				this.vel.x -= Math.sin(camera.rot.y + Math.PI / 2) * this.speed * delta
				this.dashDir.z -= Math.cos(camera.rot.y + Math.PI / 2)
				this.dashDir.x -= Math.sin(camera.rot.y + Math.PI / 2)
				this.moveDir.z -= Math.cos(camera.rot.y + Math.PI / 2)
				this.moveDir.x -= Math.sin(camera.rot.y + Math.PI / 2)
				this.teleporting = false
				this.teleport = 0
			}
			if (keys["KeyD"]) {
				this.anim = "walk"
				this.vel.z += Math.cos(camera.rot.y + Math.PI / 2) * this.speed * delta
				this.vel.x += Math.sin(camera.rot.y + Math.PI / 2) * this.speed * delta
				this.dashDir.z += Math.cos(camera.rot.y + Math.PI / 2)
				this.dashDir.x += Math.sin(camera.rot.y + Math.PI / 2)
				this.moveDir.z += Math.cos(camera.rot.y + Math.PI / 2)
				this.moveDir.x += Math.sin(camera.rot.y + Math.PI / 2)
				this.teleporting = false
				this.teleport = 0
			}
			if (godmode) {
				this.vel.y -= (1 - 0.9) * delta * this.vel.y * 60
			}
			if (inWater) {
				if (!godmode) {
					this.vel.y -= (1 - 0.95) * delta * this.vel.y * 60
					this.vel.y -= 2.5 * delta
				}
				if (keys["Space"]) {
					this.teleporting = false
					this.teleport = 0
					this.vel.y += 20 * delta
				}
				if (keys["KeyC"] && !inventoryOpen) {
					this.teleporting = false
					this.teleport = 0
					this.vel.y -= (20 - 2.5 * 2) * delta
				}
			}
			if (!inWater && this.lastWater && keys["Space"]) {
				this.vel.y = 5
				this.teleporting = false
				this.teleport = 0
			}
			if (keys["Space"]) {
				if (godmode) {
					this.vel.y += 60 * delta
					this.teleporting = false
					this.teleport = 0
				}
			}
			if (keys["KeyC"] && !inventoryOpen) {
				if (godmode) {
					this.vel.y -= 60 * delta
					this.teleporting = false
					this.teleport = 0
				}
			}

			if (camera.rot.x < Math.PI/8) {
				this.dashDir.y = 1
			}
			if (camera.rot.x > -Math.PI/8) {
				this.dashDir.y = -1
			}
			if (keys["KeyQ"] || keys["KeyE"]) {
				this.dashDir.y = 0
			}

			if (keys["KeyQ"]) {
				this.dashDir.y = -1
			}
			if (keys["KeyE"]) {
				this.dashDir.y = 1
			}

			if (jKeys["ShiftLeft"] && this.dashes > 0 && (this.dashDir.x != 0 || this.dashDir.y != 0 || this.dashDir.z != 0)) {
				this.dashing = true
				this.dashes -= 1
				this.dash = 0.25
				this.lDash = {x: this.dashDir.x, y: this.dashDir.y, z: this.dashDir.z}
			}
		} else {
			// console.log(this.dashDir, Math.abs(this.dashDir.x) + Math.abs(this.dashDir.z))
			this.vel.x = this.dashDir.x * dashSpeed
			this.vel.y = this.dashDir.y * dashSpeed
			this.vel.z = this.dashDir.z * dashSpeed
		}

		if (this.dashing) {
			for (let i = 0; i < 3; i++) {
				particles.push(new Particle([0, 127, 255], this.wpos.x+Math.random()*0.5-0.25, this.wpos.y+Math.random()*1-0.5, this.wpos.z+Math.random()*0.5-0.25, Math.random()*0.01-0.005, Math.random()*0.01-0.005, Math.random()*0.01-0.005, 0.25*Math.random(), 2))
			}
		} else if (this.speedF > 0.75) {
			for (let i = 0; i < 2; i++) {
				particles.push(new Particle([255, 255, 255], this.wpos.x+Math.random()*0.5-0.25, this.wpos.y+Math.random()*1-0.5, this.wpos.z+Math.random()*0.5-0.25, Math.random()*0.01-0.005, Math.random()*0.01-0.005, Math.random()*0.01-0.005, 0.25*Math.random(), 2))
			}
		}

		if (jKeys["KeyG"]) {
			this.tp(cs.x / 2 + 0.5, worldSize.y, cs.z / 2 + 0.5)
			// this.teleporting = true
			// this.teleport = 0
		}

		this.wall.x = 0
		this.wall.z = 0

		let lastFalling2 = this.falling
		let lastPos2 = { ...this.pos }
		let lastVel2 = { ...this.vel }
		this.move(this.vel.x * delta, this.vel.y * delta, this.vel.z * delta, 1 / delta)

		let lastPos = { ...this.pos }
		let lastFalling = this.falling
		let lastVel = { ...this.vel }
		this.move(0, -1 * delta, 0, 1)
		if (this.pos.y != lastPos.y && ((keys["KeyC"] && !keys["Space"]) && !inventoryOpen) && lastFalling2 <= 0 && !this.dashing2) {
			this.pos = { ...lastPos2 }
			this.pos.x = lastPos.x
			this.falling = lastFalling2
			this.vel = { ...lastVel2 }
			this.vel.y = 0
			this.move(0, -1 * delta, 0, 1)
			let reset = [false, false]

			if (this.pos.y != lastPos2.y) {
				this.pos.x = lastPos2.x
				this.falling = lastFalling2
				this.vel = { ...lastVel2 }
				this.vel.y = 0
				reset[0] = true
			}

			this.pos = { ...lastPos2 }

			this.pos.z = lastPos.z
			this.falling = lastFalling2
			this.vel = { ...lastVel2 }
			this.vel.y = 0
			this.move(0, -1 * delta, 0, 1)

			if (this.pos.y != lastPos2.y) {
				this.pos.z = lastPos2.z
				this.falling = lastFalling2
				this.vel = { ...lastVel2 }
				this.vel.y = 0
				reset[1] = true
			}
			this.pos = { ...lastPos2 }
			this.falling = lastFalling2
			this.vel = { ...lastVel2 }
			this.vel.y = 0

			if (!reset[0]) {
				this.pos.x = lastPos.x
			} else {
				this.vel.x = 0
			}
			if (!reset[1]) {
				this.pos.z = lastPos.z
			} else {
				this.vel.z = 0
			}

			this.move(0, -1 * delta, 0, 1)

			if (this.pos.y != lastPos2.y) {
				this.pos = lastPos
				this.falling = lastFalling
				this.vel = lastVel
			} else {
				this.pos = { ...lastPos2 }
				this.falling = lastFalling2
				this.vel = { ...lastVel2 }
				this.vel.y = 0

				if (!reset[0]) {
					this.pos.x = lastPos.x
				} else {
					this.vel.x = 0
				}
				if (!reset[1]) {
					this.pos.z = lastPos.z
				} else {
					this.vel.z = 0
				}
			}
		} else {
			this.pos = lastPos
			this.falling = lastFalling
			this.vel = lastVel
		}

		if (this.checkCollide()) {
			this.pos.y += 20 * delta
		}

		if (this.sprinting && this.anim == "walk") {
			this.anim = "run"
		}
		if (this.falling >= 0.1) {
			this.anim = "jump"
		}

		for (let player in this.cooldown) {
			this.cooldown[player] -= 1
			if (this.cooldown[player] <= 0) {
				delete this.cooldown[player]
			}
		}

		if (this.attacking < 0) {
			this.attacking = 0
		}

		this.rotating -= 1
		if (this.rotating > 0) {
			this.rot.y += 0.25
		} else {
			// this.rot.y = this.rot.y % (Math.PI * 2)
			if (this.moveDir.x != 0 || this.moveDir.z != 0) {
				this.rot.y += angleDistance(Math.atan2(this.moveDir.x, this.moveDir.z), this.rot.y) * delta * 5
			}
			var targetAngle = angleDistance(camera.rot.y, this.rot.y)
			if (targetAngle < -Math.PI / 4) {
				targetAngle = -Math.PI / 4
			}
			if (targetAngle > Math.PI / 4) {
				targetAngle = Math.PI / 4
			}
			this.headRot += (targetAngle - this.headRot) * delta * 10
			if (targetAngle <= -Math.PI / 4) {
				this.rot.y -= 3 * delta
			}
			if (targetAngle >= Math.PI / 4) {
				this.rot.y += 3 * delta
			}
		}

		this.lastWater = inWater
		this.model[1].rot.x = camera.rot.x
		let len = Math.sqrt(this.vel.x**2 + this.vel.z**2)
		let max = 19.233
		this.speedF = len/max
		this.cameraY = cameraY
	}
	updateModel() {
		var interpolate = 10
		let jumping = this.anim == "jump"
		if (this.anim == "jump") {
			interpolate = 2
			this.anim = "walk"
		}

		this.animPoint += this.animVel * this.speedF * delta * 8
 
		if (this.animPoint > 1) {
			// this.animPoint = 1 - (this.animPoint - 1)
			this.animPoint = 1
			this.animVel *= -1
		}
		if (this.animPoint < 0) {
			// this.animPoint = Math.abs(-this.animPoint)
			this.animPoint = 0
			this.animVel *= -1
		}

		let S = (Math.PI/1.75) * this.speedF*2
		if (S > Math.PI/1.75) {
			S = Math.PI/1.75
		}
		let V = (this.animPoint - 0.5)*2 * S

		this.model[2].rot.x += (V - this.model[2].rot.x) * delta * interpolate * 2
		this.model[3].rot.x += (-V - this.model[3].rot.x) * delta * interpolate * 2
		if (this.handRotOffset > 0) {
			this.model[4].rot.x += (this.handRotOffset - this.model[4].rot.x) * delta * interpolate * 2
		} else {
			this.model[4].rot.x += (-V - this.model[4].rot.x) * delta * interpolate * 2
		}
		this.model[5].rot.x += (V - this.model[5].rot.x) * delta * interpolate * 2

		if (jumping) {
			this.anim = "jump"
		}

		if (this.anim == "jump") {
			this.jumpOff += (0 - this.jumpOff) * delta * 10
		} else {
			this.jumpOff += (Math.abs(0.5-this.animPoint)*this.speedF/2 - this.jumpOff) * delta * 10
		}

		let r = (0.75 - this.cameraY) * 2 * Math.PI/6 * -1
		
		var i = 0
		for (let model of this.model) {
			// model.pos = {...this.pos}

			if (i < 2 || i > 3) {
				if (i != 1) {
					model.rot.x += r
				}
			}

			model.pos.x = this.pos.x
			model.pos.y = this.pos.y + this.jumpOff
			model.pos.z = this.pos.z
			if (i < 2 || i > 3) {
				model.pos.x += model.offset.x * Math.cos(-this.rot.y) + model.offset.z * Math.cos(-this.rot.y + Math.PI / 2) + model.offset.y * Math.cos(-this.rot.y + Math.PI / 2) * Math.sin(r)
				model.pos.y += (model.offset.y) * Math.cos(r)
				model.pos.z += model.offset.x * Math.sin(-this.rot.y) + model.offset.z * Math.sin(-this.rot.y + Math.PI / 2) + model.offset.y * Math.sin(-this.rot.y + Math.PI / 2) * Math.sin(r)

				if (i > 3) {
					model.pos.y += model.size.x * Math.sin(r) / (1.5 * 1.095)
					model.pos.x += model.size.x*Math.cos(-this.rot.y + Math.PI / 2) * Math.sin(r) * 1.5
					model.pos.z += model.size.x*Math.sin(-this.rot.y + Math.PI / 2) * Math.sin(r) * 1.5
				}
				if (i == 1) {
					model.pos.x -= model.size.x/2*Math.cos(-this.rot.y + Math.PI / 2) * Math.sin(r)
					model.pos.z -= model.size.x/2*Math.sin(-this.rot.y + Math.PI / 2) * Math.sin(r)
				}
			} else {
				model.pos.x += model.offset.x * Math.cos(-this.rot.y) + model.offset.z * Math.cos(-this.rot.y + Math.PI / 2)
				model.pos.y += model.offset.y
				model.pos.z += model.offset.x * Math.sin(-this.rot.y) + model.offset.z * Math.sin(-this.rot.y + Math.PI / 2)
			}
			model.box.rotOff.x = -model.size.x / 2
			model.box.rotOff.y = -model.size.y / 2
			model.box.rotOff.z = -model.size.z / 2
			if (i >= 2) /*is leg or arm*/ {
				model.box.rotOff.y -= 0.375
			}
			model.rot.y = this.rot.y
			if (i == 1) {
				model.box.rotOff.y += 0.25
				model.rot.y += this.headRot
			}
			// if (i != 2) {
			// 	model.colour = this.colour
			// }

			model.visible = this.visible
			model.rot.x += this.rot.x
			model.update()
			model.rot.x -= this.rot.x

			if (i < 2 || i > 3) {
				if (i != 1) {
					model.rot.x -= r
				}
			}

			i += 1
		}
		this.hand.box.updateShape()
		this.hand.visible = false
		this.handItem.visible = false
		if (rDistance < 0.5 && this.real) {
			this.hand.box.ignoreDepth = true
			this.handItem.mesh.ignoreDepth = true
			this.handItem.mesh.rotOff.y = 0
			this.hand.box.oneSide = true
			this.hand.box.useAlpha = false
			this.handItem.mesh.order = false
			this.hand.box.order = false
			if (inventory[selected][0] != "none" && itemData[inventory[selected][0]][1]) {
				this.hand.visible = true
				this.handItem.visible = false
				this.hand.box.useAlpha = true
				this.hand.box.oneSide = false
				if (this.handAnim < 0.18 && this.handAnim > 0.02) {
					this.hand.box.faces = [
						// +Y
						10, 9, 8,
						8, 9, 11,
						// +Z
						18, 17, 16,
						16, 17, 19,
						// +X
						0, 1, 2,
						3, 1, 0,
						// -X
						6, 5, 4,
						4, 5, 7,
						// -Z
						20, 21, 22,
						23, 21, 20,
						// -Y
						12, 13, 14,
						15, 13, 12,
					]
					
				} else {
					this.hand.box.faces = [
						// -Y
						12, 13, 14,
						15, 13, 12,
						// +Z
						18, 17, 16,
						16, 17, 19,
						// -X
						6, 5, 4,
						4, 5, 7,
						// +X
						0, 1, 2,
						3, 1, 0,
						// -Z
						20, 21, 22,
						23, 21, 20,
						// +Y
						10, 9, 8,
						8, 9, 11,
					]
				}
				let b = Object.keys(blocks)[itemData[inventory[selected][0]][2] - 1]
				if (blocks[b][9]) {
					this.hand.box.updateShape(blocks[b][9])
				}
				this.hand.box.updateBuffers()

				this.handMode = 1
				this.hand.size = { x: 0.5, y: 0.5, z: 0.5 }
				if (showName > 2.5 || rDistance > 0.1) {
					this.hand.box.texture = texture
					this.hand.box.useAlpha = true
					this.hand.box.alphaTexture = alphaTexture
					this.hand.mapUvs([
						blocks[b][2][0], blocks[b][2][1], blocks[b][2][0] + blockSize.x, blocks[b][2][1] + blockSize.y,
						blocks[b][3][0], blocks[b][3][1], blocks[b][3][0] + blockSize.x, blocks[b][3][1] + blockSize.y,
						blocks[b][0][0], blocks[b][0][1], blocks[b][0][0] + blockSize.x, blocks[b][0][1] + blockSize.y,
						blocks[b][1][0], blocks[b][1][1], blocks[b][1][0] + blockSize.x, blocks[b][1][1] + blockSize.y,
						blocks[b][4][0], blocks[b][4][1], blocks[b][4][0] + blockSize.x, blocks[b][4][1] + blockSize.y,
						blocks[b][5][0], blocks[b][5][1], blocks[b][5][0] + blockSize.x, blocks[b][5][1] + blockSize.y,
					])
					this.hand.box.updateBuffers()
				}
			} else if (inventory[selected][0] != "none" && !itemData[inventory[selected][0]][1]) {
				this.hand.visible = false
				this.handItem.visible = true

				this.handItem.pos = { ...camera.pos }

				this.handItem.mesh.customRotOff = []
				this.handItem.mesh.customRotOff.push({ x: 0, y: 0, z: 0 })
				this.handItem.mesh.customRotOff.push({ x: 0, y: 0, z: 0 })
				this.handItem.mesh.customRotOff.push({ x: 0, y: 0, z: 0 })
				this.handItem.mesh.customRotOff.push({ x: 0, y: 0, z: 0 })
				this.handItem.mesh.customRotOff.push({ x: 0, y: -0.5, z: 0.5 })

				this.handItem.rot.y = camera.rot.y//+Math.PI/8
				this.handItem.rot.x = camera.rot.x
				this.handItem.mesh.customRot = [["Y", Math.PI / 8], ["X", -(0.1 - Math.abs(0.1 - this.handAnim)) * 16 * Math.PI / 8]]
				this.handItem.mesh.ignoreDepth = true

				let d = 1
				d += (0.1 - Math.abs(0.1 - this.handAnim)) * 16 * 0
				this.handItem.pos.x -= Math.sin(camera.rot.y) * Math.cos(camera.rot.x) * d
				this.handItem.pos.y += Math.sin(camera.rot.x) * d
				this.handItem.pos.z -= Math.cos(camera.rot.y) * Math.cos(camera.rot.x) * d

				this.handItem.pos.x -= Math.sin(camera.rot.y - Math.PI / 2) * 0.4
				this.handItem.pos.z -= Math.cos(camera.rot.y - Math.PI / 2) * 0.4

				this.handItem.pos.x -= Math.sin(camera.rot.y) * Math.cos(camera.rot.x - Math.PI / 2) * 0.6
				this.handItem.pos.y += Math.sin(camera.rot.x - Math.PI / 2) * 0.6
				this.handItem.pos.z -= Math.cos(camera.rot.y) * Math.cos(camera.rot.x - Math.PI / 2) * 0.6

				this.handItem.size = { x: 0.5, y: 0.5, z: 0.5 }

				if (showName > 2.5 || rDistance > 0.1 || this.handMode != 2 || !this.handItem.rendered) {
					this.handItem.uv.x = itemData[inventory[selected][0]][0][0]
					this.handItem.uv.y = itemData[inventory[selected][0]][0][1]
					// this.handItem.render()
				}
				this.handMode = 2

			} else {
				this.hand.visible = true
				this.handItem.visible = false

				this.hand.size = { x: 0.25, y: 0.75, z: 0.25 }
				this.hand.box.texture = playerTexture
				this.hand.box.useAlpha = false
				if (this.handMode != 0 || rDistance > 0.1) {
					this.forceUpdate = 0.5
				}
				if (this.forceUpdate > 0) {
					this.updateTexture(playerT)
				}
				this.handMode = 0
			}

			if (this.handMode != 2) {
				this.start = false
				this.hand.pos = { ...camera.pos }

				this.hand.box.rotOff.x = -this.hand.size.x / 2
				this.hand.box.rotOff.y = -this.hand.size.y / 2
				this.hand.box.rotOff.z = -this.hand.size.z / 2
				// this.hand.box.rotOff.y += 0.375

				this.hand.rot.y = camera.rot.y//+(Math.PI/4+Math.PI/8)*Math.sin(camera.rot.x)

				// this.handAnim = 0.075
				let d = 0.75// - (fov-60)/20*0.275
				if (this.handMode == 1) { d = 1 }
				d += (0.1 - Math.abs(0.1 - this.handAnim)) * 16 * 0.5

				this.hand.pos.x -= Math.sin(camera.rot.y) * Math.cos(camera.rot.x) * d
				this.hand.pos.y += Math.sin(camera.rot.x) * d
				this.hand.pos.z -= Math.cos(camera.rot.y) * Math.cos(camera.rot.x) * d

				d = 0.5
				if (this.handMode == 1) { d = 0.6 }
				this.hand.pos.x -= Math.sin(camera.rot.y - Math.PI / 2) * d
				this.hand.pos.z -= Math.cos(camera.rot.y - Math.PI / 2) * d

				d = 0.5
				this.hand.pos.x -= Math.sin(camera.rot.y) * Math.cos(camera.rot.x - Math.PI / 2) * d
				this.hand.pos.y += Math.sin(camera.rot.x - Math.PI / 2) * d
				this.hand.pos.z -= Math.cos(camera.rot.y) * Math.cos(camera.rot.x - Math.PI / 2) * d
				// this.hand.pos.z += Math.cos(camera.rot.x-Math.PI/2)*0.25
				if (this.handMode == 0) {
					this.hand.rot.z = -Math.PI / 8
					this.hand.rot.x = camera.rot.x + Math.PI / 4 * 3 - (0.1 - Math.abs(0.1 - this.handAnim)) * 16 * Math.PI / 4
				} else {
					this.hand.rot.z = 0
					this.hand.rot.x = camera.rot.x + Math.PI / 4 * 2 - Math.PI / 2 - (0.1 - Math.abs(0.1 - this.handAnim)) * 16 * Math.PI / 4
				}
			}
		} else {
			this.hand.visible = false
			this.hand.box.ignoreDepth = false
			this.handItem.visible = false
			this.handItem.mesh.ignoreDepth = false
			this.handItem.mesh.order = true
			this.hand.box.order = true
			this.hand.box.oneSide = false
			if (this.selectedItem != "none" && itemData[this.selectedItem][1]) {
				this.hand.visible = true
				this.hand.size = { x: 0.26, y: 0.26, z: 0.26 }
				let b = Object.keys(blocks)[itemData[this.selectedItem][2] - 1]
				if (blocks[b][9]) {
					this.hand.box.updateShape(blocks[b][9])
				}
				if (showName > 2.5 || rDistance < 1 || !this.real) {
					this.hand.box.texture = texture
					this.hand.box.useAlpha = true
					this.hand.box.alphaTexture = alphaTexture
					this.hand.mapUvs([
						blocks[b][2][0], blocks[b][2][1], blocks[b][2][0] + blockSize.x, blocks[b][2][1] + blockSize.y,
						blocks[b][3][0], blocks[b][3][1], blocks[b][3][0] + blockSize.x, blocks[b][3][1] + blockSize.y,
						blocks[b][0][0], blocks[b][0][1], blocks[b][0][0] + blockSize.x, blocks[b][0][1] + blockSize.y,
						blocks[b][1][0], blocks[b][1][1], blocks[b][1][0] + blockSize.x, blocks[b][1][1] + blockSize.y,
						blocks[b][4][0], blocks[b][4][1], blocks[b][4][0] + blockSize.x, blocks[b][4][1] + blockSize.y,
						blocks[b][5][0], blocks[b][5][1], blocks[b][5][0] + blockSize.x, blocks[b][5][1] + blockSize.y,
					])
					this.hand.box.updateBuffers()
				}

				this.hand.pos = { ...this.model[4].pos }
				this.hand.pos.x += -(0.375) * Math.sin(this.model[4].rot.x+r) * Math.sin(this.rot.y)
				this.hand.pos.y += -(0.375) * Math.cos(this.model[4].rot.x+r)
				this.hand.pos.z += -(0.375) * Math.sin(this.model[4].rot.x+r) * Math.cos(this.rot.y)

				this.hand.pos.x += -(0.25 / 2) * Math.sin(this.model[4].rot.x+r + Math.PI / 2) * Math.sin(this.rot.y)
				this.hand.pos.y += -(0.25 / 2) * Math.cos(this.model[4].rot.x+r + Math.PI / 2)
				this.hand.pos.z += -(0.25 / 2) * Math.sin(this.model[4].rot.x+r + Math.PI / 2) * Math.cos(this.rot.y)

				this.hand.rot.x = this.model[4].rot.x+r
				this.hand.rot.y = this.rot.y
				this.hand.rot.z = 0
				this.hand.box.rotOff.x = -0.25 / 2
				this.hand.box.rotOff.y = -0.26 / 2 - 0.375
				this.hand.box.rotOff.z = -0.25 / 2

			} else if (this.selectedItem != "none" && !itemData[this.selectedItem][1]) {
				this.handItem.mesh.customRot = []
				this.handItem.mesh.customRotOff = []
				this.handItem.visible = true

				if (showName > 2.5 || rDistance < 1 || !this.handItem.rendered || !this.real) {
					this.handItem.uv.x = itemData[this.selectedItem][0][0]
					this.handItem.uv.y = itemData[this.selectedItem][0][1]
					// this.handItem.render()
				}

				this.handItem.pos = { ...this.model[4].pos }
				this.handItem.rot.y = this.rot.y
				this.handItem.pos.x += -(0.375 + 0.05) * Math.sin(this.model[4].rot.x+r) * Math.sin(this.rot.y)
				this.handItem.pos.y += -(0.375 + 0.05) * Math.cos(this.model[4].rot.x+r)
				this.handItem.pos.z += -(0.375 + 0.05) * Math.sin(this.model[4].rot.x+r) * Math.cos(this.rot.y)

				this.handItem.pos.x += -(0.5) * Math.sin(this.model[4].rot.x+r + Math.PI / 2) * Math.sin(this.rot.y)
				this.handItem.pos.y += -(0.5) * Math.cos(this.model[4].rot.x+r + Math.PI / 2)
				this.handItem.pos.z += -(0.5) * Math.sin(this.model[4].rot.x+r + Math.PI / 2) * Math.cos(this.rot.y)

				this.handItem.rot.x = this.model[4].rot.x+r
				// this.handItem.rot.y = this.rot.y
				// this.handItem.rot.z = 0
				// this.handItem.mesh.rotOff.x = -0.26/2
				this.handItem.size = { x: 0.5, y: 0.5, z: 0.5 }
				this.handItem.mesh.rotOff.y = -0.375
				// this.handItem.mesh.rotOff.z = -0.26/2
			}

		}

		this.hand.update()
		this.handItem.updateRaw()

		if (this.real) {
			this.username.mesh.visible = thirdPerson
		} else {
			this.hand.box.ignoreDepth = false
			this.handItem.mesh.ignoreDepth = false
			this.hand.box.rOrder = 0
		}
		this.username.text = this.usernameText ? this.usernameText : "Unnamed"
		this.username.pos = { ...this.pos }
		this.username.pos.y += 1.1
		this.username.update()
	}
	delete() {
		for (let model of this.model) {
			model.delete()
		}
		this.username.mesh.delete()
		this.hand.delete()
		this.handItem.mesh.delete()
	}
	checkAttack() {
		if (this.attacking <= 0) { return }
		for (let player in players) {
			if (!this.cooldown[player] && this.attack.isColliding([players[player]])) {
				this.cooldown[player] = 60
				players[player].rotating = 60
				sendMsg({ "send": [player, { "hit": this.pos }] })
			}
		}
	}
	checkCollide() {
		if (godmode) {
			return false
		}
		if (this.isColliding(borders)) {
			return true
		}
		if (isCollidingWorld(this, true)) {
			return true
		}
		return false
	}
	move(x, y, z, steps) {
		this.falling += delta
		if (this.wall.x == 0 && this.wall.z == 0) {
			this.wall.v += delta
		}

		for (let i = 0; i < steps; i++) {
			var lastX = this.pos.x
			this.pos.x += x / steps
			if (this.checkCollide()) {
				this.pos.x = lastX
				this.wall.x = Math.abs(x) / x
				this.wall.v = 0
				break
			}
		}

		for (let i = 0; i < steps; i++) {
			var lastZ = this.pos.z
			this.pos.z += z / steps
			if (this.checkCollide()) {
				this.pos.z = lastZ
				this.wall.z = Math.abs(z) / z
				this.wall.v = 0
				break
			}
		}

		for (let i = 0; i < steps; i++) {
			var lastY = this.pos.y
			this.pos.y += y / steps
			if (this.checkCollide()) {
				this.pos.y = lastY
				this.cbBlock = getBlock(Math.floor(this.pos.x), Math.floor(this.pos.y - 0.5) - 1, Math.floor(this.pos.z))
				if (this.vel.y < 0) {
					this.falling = 0
				}
				if (this.cbBlock == 40) {
					this.vel.y *= -0.999
				} else {
					this.vel.y = 0
				}
			}
		}
		// if (set.x != 0 || set.z != 0) {
		// 	this.wall.x = set.x
		// 	this.wall.z = set.z
		// }
		// if (this.wall.x != Math.abs(x) / x) {
		// 	this.wall.x = 0
		// }
		// if (this.wall.z != Math.abs(z) / z) {
		// 	this.wall.z = 0
		// }
	}
}