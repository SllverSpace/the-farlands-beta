class Object3D {
	pos = {x: 0, y: 0, z: 0}
	size = {x: 0, y: 0, z: 0}
	rot = {x: 0, y: 0, z: 0}
	visible = true
	constructor(x, y, z, width, height, depth) {
		this.pos.x = x
		this.pos.y = y
		this.pos.z = z
		this.size.x = width
		this.size.y = height
		this.size.z = depth
	}
	isColliding(objects) {
		for (let object of objects) {
			if (
				this.pos.x+this.size.x/2 > object.pos.x-object.size.x/2 &&
				this.pos.x-this.size.x/2 < object.pos.x+object.size.x/2 &&
				this.pos.y+this.size.y/2 > object.pos.y-object.size.y/2 &&
				this.pos.y-this.size.y/2 < object.pos.y+object.size.y/2 &&
				this.pos.z+this.size.z/2 > object.pos.z-object.size.z/2 &&
				this.pos.z-this.size.z/2 < object.pos.z+object.size.z/2
			) {
				return true
			}
		}
		return false
	}
}

function isColliding3D(x1, y1, z1, w1, h1, d1, x2, y2, z2, w2, h2, d2) {
	return (
		x1+w1/2 > x2-w2/2 && x1-w1/2 < x2+w2/2 &&
		y1+h1/2 > y2-h2/2 && y1-h1/2 < y2+h2/2 &&
		z1+d1/2 > z2-d2/2 && z1-d1/2 < z2+d2/2
	)
}

class Object2D {
	x = 0
	y = 0
	width = 0
	height = 0
	rot = 0
	constructor(x, y, width, height) {
		this.x = x
		this.y = y
		this.width = width
		this.height = height
	}
	isColliding(objects) {
		for (let object of objects) {
			if (
				this.x+this.width/2 > object.x-object.width/2 &&
				this.x-this.width/2 < object.x+object.width/2 &&
				this.y+this.height/2 > object.y-object.height/2 &&
				this.y-this.height/2 < object.y+object.height/2
			) {
				return true
			}
		}
		return false
	}
	containsPoint(x, y) {
		return (
			x > this.x-this.width/2 && x < this.x+this.width/2 &&
			y > this.y-this.height/2 && y < this.y+this.height/2
		)
	}
	hasPoint(x, y) {
        return (
            x > this.x-this.width/2 && x < this.x+this.width/2 &&
            y > this.y-this.height/2 && y < this.y+this.height/2
        )
    }
}

// SOMETIME IN THE FUTURE
/*
class Text {
	pos = {x: 0, y: 0, z: 0}
	size = 0
	rot = {x: 0, y: 0, z: 0}
	colour = [0, 0, 0]
	depth = 0
	mesh
	geometry
	material
	
	shadows
	visible = true
	lastColour = []
	lastSize
	lastDepth
	lastColour
	text = ""
	lastText = ""
	rendered = false
	center = true
	constructor(x, y, z, text, size, depth, colour) {
		this.pos.x = x
		this.pos.y = y
		this.pos.z = z
		this.size = size
		this.depth = depth
		this.colour = colour
		this.text = text
		this.geometry = new THREE.Geometry()
		this.material = new THREE.MeshLambertMaterial()
		this.mesh = new THREE.Mesh(this.geometry, this.material)
		this.update()
		scene.add(this.mesh)
	}
	lookAtCam() {
		var diff = {x: camera.pos.x-this.pos.x, y: camera.pos.y-this.pos.y, z:  camera.pos.z-this.pos.z}
		this.mesh.castShadow = true
		this.rot.y = Math.atan2(diff.x, diff.z)
		var l1 = Math.sqrt((diff.x**2) + (diff.z**2))
		this.rot.x = Math.atan2(l1, diff.y)
		this.rot.x -= Math.PI/2
	}
	update() {
		this.mesh.visible = this.visible
		if ((font && !this.rendered) || this.text != this.lastText || JSON.stringify(this.lastSize) != JSON.stringify(this.size) || JSON.stringify(this.lastDepth) != JSON.stringify(this.depth)) {
			if (font) {
				this.rendered = true
				this.geometry = new THREE.TextGeometry(this.text, {
					font: font,
					size: this.size,
					height: this.depth,
					curveSegments: 2
				})
			}
			this.mesh.geometry = this.geometry
		}
		this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z)
		this.mesh.rotation.set(0, 0, 0)
		var box = new THREE.Box3().setFromObject(this.mesh)
		var euler = new THREE.Euler(this.rot.x, this.rot.y, this.rot.z, "YXZ")
		this.mesh.rotation.copy(euler)
		this.mesh.position.x -= Math.sin(this.rot.y+Math.PI/2)*((box.max.x-box.min.x)/2)
		this.mesh.position.z -= Math.cos(this.rot.y+Math.PI/2)*((box.max.x-box.min.x)/2)
		
		this.lastText = this.text
		this.lastSize = this.size
		this.lastDepth = this.depth
		if (JSON.stringify(this.colour) != JSON.stringify(this.lastColour)) {
			this.material = new THREE.MeshLambertMaterial({color: new THREE.Color(this.colour[0], this.colour[1], this.colour[2])})
			this.mesh.material = this.material
		}
		this.lastColour = [...this.colour]
	}
	delete() {
		scene.remove(this.mesh)
		this.material.dispose()
		this.geometry.dispose()
	}
}
*/

class Box extends Object3D {
	box
	colour = [0, 0, 0]
	constructor(x, y, z, width, height, depth, colour=[0, 0, 0]) {
		super(x, y, z, width, height, depth)
		this.colour = colour
		this.box = new webgpu.Box(x, y, z, width, height, depth, colour)
		this.update()
	}
	update() {
		this.box.visible = this.visible
		this.box.pos = this.pos
		this.box.rot = {...this.rot}
		this.box.size = this.size
		this.box.colour = this.colour
	}
	mapUvs(uvs) {
		// 0, 1, psx*2, 1-psy*2, psx*2, 1, 0, 1-psy*2,
		// psx*2+psx*2, 1, psx*2, 1-psy*2, psx*2, 1, psx*2+psx*2, 1-psy*2,
		// psx*4, 1, psx*4+psx*2, 1-psy*2, psx*4, 1-psy*2, psx*4+psx*2, 1,
		// psx*6, 1, psx*6+psx*2, 1-psy*2, psx*6, 1-psy*2, psx*6+psx*2, 1,
		// psx*8, 1, psx*8+psx*2, 1-psy*2, psx*8, 1-psy*2, psx*8+psx*2, 1,
		
		// psx*10+psx*2, 1, psx*10, 1-psy*2, psx*10+psx*2, 1-psy*2, psx*10, 1,

		// 0 0 1 1
		this.box.uvs = [
			uvs[0], uvs[3], uvs[2], uvs[1], uvs[2], uvs[3], uvs[0], uvs[1],
			uvs[2+1*4], uvs[3+1*4], uvs[0+1*4], uvs[1+1*4], uvs[0+1*4], uvs[3+1*4], uvs[2+1*4], uvs[1+1*4],
			uvs[0+2*4], uvs[3+2*4], uvs[2+2*4], uvs[1+2*4], uvs[0+2*4], uvs[1+2*4], uvs[2+2*4], uvs[3+2*4],
			uvs[0+3*4], uvs[3+3*4], uvs[2+3*4], uvs[1+3*4], uvs[0+3*4], uvs[1+3*4], uvs[2+3*4], uvs[3+3*4],
			uvs[0+4*4], uvs[3+4*4], uvs[2+4*4], uvs[1+4*4], uvs[0+4*4], uvs[1+4*4], uvs[2+4*4], uvs[3+4*4],
			uvs[2+5*4], uvs[3+5*4], uvs[0+5*4], uvs[1+5*4], uvs[2+5*4], uvs[1+5*4], uvs[0+5*4], uvs[3+5*4],
		]
	}
	delete() {
		this.box.delete()
	}
}