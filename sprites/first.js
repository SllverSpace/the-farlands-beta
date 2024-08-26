class Chunk extends Object3D {
	mesh
	meshT
	collide = []
	blockSize = {x: 1, y: 1, z: 1}
	visible = false
	forceVis = 0
	blocks = []
	generated = false
	meshed = false
	empty = true
	structures = false
	networkLoaded = false
	networkTimeout = 0
	constructor(x, y, z) {
		super(x, y, z, cs.x, cs.y, cs.z)
	}
	generate() {
		let generated = generateChunk(this.pos.x/cs.x, this.pos.y/cs.y, this.pos.z/cs.z)
		this.blocks = generated[0]
		this.sets = generated[1]
		this.setStructures()
		this.generated = true
	}
	setStructures() {
		for (let set of this.sets) {
			if (
				set[0]-this.pos.x >= 0 && set[0]-this.pos.x < cs.x &&
				set[1]-this.pos.y >= 0 && set[1]-this.pos.y < cs.y &&
				set[2]-this.pos.z >= 0 && set[2]-this.pos.z < cs.z
			) {
				this.blocks[(set[0]-this.pos.x)*cs.y*cs.z + (set[1]-this.pos.y)*cs.z + (set[2]-this.pos.z)] = set[3]
			} else {
				addSet(set)
			}
		}
		this.structures = true
	}
	getBlockO(x, y, z, relative=true, raw=true, ignore=false, trueRaw=true, col=false) {
		if (x-this.pos.x >= 0 && x-this.pos.x < cs.x && 
			y-this.pos.y >= 0 && y-this.pos.y < cs.y &&
			z-this.pos.z >= 0 && z-this.pos.z < cs.z
		) {
			let block = this.blocks[(z-this.pos.z) + (y-this.pos.y) * cs.z + (x-this.pos.x) * cs.y * cs.z]
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
					bd = null
				}
				if (ignore || ignore2 || (!raw && transparent.includes(block))) {
					ignore2 = null
					return 0
				}
				ignore2 = null
			}
			
			return block
		} else {
			return getBlock(x, y, z, relative, raw, ignore, trueRaw, col)
		}
	}
	createMesh() {
		let pos = this.pos
		let geometry = {"vertices": [], "faces": [], "uvs": [], "colours": []}
		let geometryT = {"vertices": [], "faces": [], "uvs": [], "colours": []}
		for (let x = 0; x < cs.x; x++) {
			for (let y = 0; y < cs.y; y++) {
				for (let z = 0; z < cs.z; z++) {
					let block = this.blocks[x*cs.y*cs.z+y*cs.z+z]
					if (block == 0) continue
					let bd = blocks[ib(block)]
					if (!bd) continue 
					let sides = [
						this.getBlockO(x+pos.x, y+pos.y+1, z+pos.z, false, false, bd[8], false)==0,
						this.getBlockO(x+pos.x, y+pos.y-1, z+pos.z, false, false, bd[8], false)==0,
						this.getBlockO(x+pos.x+1, y+pos.y, z+pos.z, false, false, bd[8], false)==0, 
						this.getBlockO(x+pos.x-1, y+pos.y, z+pos.z, false, false, bd[8], false)==0, 
						this.getBlockO(x+pos.x, y+pos.y, z+pos.z+1, false, false, bd[8], false)==0,
						this.getBlockO(x+pos.x, y+pos.y, z+pos.z-1, false, false, bd[8], false)==0,
					]
					let corners = [
						this.getBlockO(x+pos.x-1, y+pos.y+1, z+pos.z-1, false, false, bd[8], false)!=0,
						this.getBlockO(x+pos.x-1, y+pos.y+1, z+pos.z+1, false, false, bd[8], false)!=0,
						this.getBlockO(x+pos.x+1, y+pos.y+1, z+pos.z-1, false, false, bd[8], false)!=0,
						this.getBlockO(x+pos.x+1, y+pos.y+1, z+pos.z+1, false, false, bd[8], false)!=0,
						this.getBlockO(x+pos.x-1, y+pos.y-1, z+pos.z-1, false, false, bd[8], false)!=0,
						this.getBlockO(x+pos.x-1, y+pos.y-1, z+pos.z+1, false, false, bd[8], false)!=0,
						this.getBlockO(x+pos.x+1, y+pos.y-1, z+pos.z-1, false, false, bd[8], false)!=0,
						this.getBlockO(x+pos.x+1, y+pos.y-1, z+pos.z+1, false, false, bd[8], false)!=0,

						this.getBlockO(x+pos.x-1, y+pos.y+1, z+pos.z+0, false, false, bd[8], false)!=0,
						this.getBlockO(x+pos.x+1, y+pos.y+1, z+pos.z+0, false, false, bd[8], false)!=0,
						this.getBlockO(x+pos.x+0, y+pos.y+1, z+pos.z-1, false, false, bd[8], false)!=0,
						this.getBlockO(x+pos.x+0, y+pos.y+1, z+pos.z+1, false, false, bd[8], false)!=0,

						this.getBlockO(x+pos.x-1, y+pos.y-1, z+pos.z+0, false, false, bd[8], false)!=0,
						this.getBlockO(x+pos.x+1, y+pos.y-1, z+pos.z+0, false, false, bd[8], false)!=0,
						this.getBlockO(x+pos.x+0, y+pos.y-1, z+pos.z-1, false, false, bd[8], false)!=0,
						this.getBlockO(x+pos.x+0, y+pos.y-1, z+pos.z+1, false, false, bd[8], false)!=0,

						this.getBlockO(x+pos.x-1, y+pos.y+0, z+pos.z-1, false, false, bd[8], false)!=0,
						this.getBlockO(x+pos.x-1, y+pos.y+0, z+pos.z+1, false, false, bd[8], false)!=0,
						this.getBlockO(x+pos.x+1, y+pos.y+0, z+pos.z-1, false, false, bd[8], false)!=0,
						this.getBlockO(x+pos.x+1, y+pos.y+0, z+pos.z+1, false, false, bd[8], false)!=0,
					]
					if (block != 0 && bd[6]) {
						geometry = this.createBlock(geometry, x, y, z, ib(block), sides, corners, bd[9] ? bd[9] : 0)
					}
					block = null
					bd = null
					sides = null
				}
			}
		}
		for (let x = 0; x < cs.x; x++) {
			for (let y = 0; y < cs.y; y++) {
				for (let z = 0; z < cs.z; z++) {
					let block = this.blocks[x*cs.y*cs.z+y*cs.z+z]
					let bd = blocks[ib(block)]
					if (!bd) continue
					if (bd[6]) continue
					let sides = [
						this.getBlockO(x+pos.x, y+pos.y+1, z+pos.z, false, texture, bd[8], false),
						this.getBlockO(x+pos.x, y+pos.y-1, z+pos.z, false, texture, bd[8], false),
						this.getBlockO(x+pos.x+1, y+pos.y, z+pos.z, false, texture, bd[8], false), 
						this.getBlockO(x+pos.x-1, y+pos.y, z+pos.z, false, texture, bd[8], false), 
						this.getBlockO(x+pos.x, y+pos.y, z+pos.z+1, false, texture, bd[8], false),
						this.getBlockO(x+pos.x, y+pos.y, z+pos.z-1, false, texture, bd[8], false),
					]
					let corners = [
						this.getBlockO(x+pos.x-1, y+pos.y+1, z+pos.z-1, false, texture, bd[8], false),
						this.getBlockO(x+pos.x-1, y+pos.y+1, z+pos.z+1, false, texture, bd[8], false),
						this.getBlockO(x+pos.x+1, y+pos.y+1, z+pos.z-1, false, texture, bd[8], false),
						this.getBlockO(x+pos.x+1, y+pos.y+1, z+pos.z+1, false, texture, bd[8], false),
						this.getBlockO(x+pos.x-1, y+pos.y-1, z+pos.z-1, false, texture, bd[8], false),
						this.getBlockO(x+pos.x-1, y+pos.y-1, z+pos.z+1, false, texture, bd[8], false),
						this.getBlockO(x+pos.x+1, y+pos.y-1, z+pos.z-1, false, texture, bd[8], false),
						this.getBlockO(x+pos.x+1, y+pos.y-1, z+pos.z+1, false, texture, bd[8], false),

						this.getBlockO(x+pos.x-1, y+pos.y+1, z+pos.z+0, false, texture, bd[8], false),
						this.getBlockO(x+pos.x+1, y+pos.y+1, z+pos.z+0, false, texture, bd[8], false),
						this.getBlockO(x+pos.x+0, y+pos.y+1, z+pos.z-1, false, texture, bd[8], false),
						this.getBlockO(x+pos.x+0, y+pos.y+1, z+pos.z+1, false, texture, bd[8], false),

						this.getBlockO(x+pos.x-1, y+pos.y-1, z+pos.z+0, false, texture, bd[8], false),
						this.getBlockO(x+pos.x+1, y+pos.y-1, z+pos.z+0, false, texture, bd[8], false),
						this.getBlockO(x+pos.x+0, y+pos.y-1, z+pos.z-1, false, texture, bd[8], false),
						this.getBlockO(x+pos.x+0, y+pos.y-1, z+pos.z+1, false, texture, bd[8], false),

						this.getBlockO(x+pos.x-1, y+pos.y+0, z+pos.z-1, false, texture, bd[8], false),
						this.getBlockO(x+pos.x-1, y+pos.y+0, z+pos.z+1, false, texture, bd[8], false),
						this.getBlockO(x+pos.x+1, y+pos.y+0, z+pos.z-1, false, texture, bd[8], false),
						this.getBlockO(x+pos.x+1, y+pos.y+0, z+pos.z+1, false, texture, bd[8], false),
					]
					for (let i in sides) {
						sides[i] = sides[i] == 0 || (transparent.includes(sides[i]) && sides[i] < block)
					}
					if (block != 0 && !bd[6]) {
						if (forceSolidB.includes(block)) {
							geometry = this.createBlock(geometry, x, y, z, ib(block), sides, corners, bd[9] ? bd[9] : 0)
						} else {
							geometryT = this.createBlock(geometryT, x, y, z, ib(block), sides, corners, bd[9] ? bd[9] : 0)
						}
						
					}
					block = null
					bd = null
					sides = null
				}
			}
		}
		if (geometry.vertices.length > 0 || geometryT.vertices.length > 0) {
			this.render([geometry, geometryT])
			this.empty = false
		} else {
			this.empty = true
		}
		this.meshed = true
	}
	createBlock(geometry, x, y, z, block, sides, corners, o=0) {
		let pos = {x: x, y: y, z: z}
		var i0 = 0
		var i1 = 0
		var i2 = 0
		var i3 = 0
		let shadow = shadows
		let e = exposure
		let l = 1*e
		let alpha = 0.5
		// +Y
		if (sides[0]) {
			geometry.vertices.push(pos.x, pos.y+1-o, pos.z)
			i0 = geometry.vertices.length/3-1
			geometry.vertices.push(pos.x+1, pos.y+1-o, pos.z+1)
			i1 = geometry.vertices.length/3-1
			geometry.vertices.push(pos.x+1, pos.y+1-o, pos.z)
			i2 = geometry.vertices.length/3-1
			geometry.vertices.push(pos.x, pos.y+1-o, pos.z+1)
			i3 = geometry.vertices.length/3-1
			geometry.faces.push(i0, i1, i2)
			geometry.faces.push(i3, i1, i0)
			// let l = 1*e
			if (corners[0] || corners[8] || corners[10]) {geometry.colours.push(l*shadow, l*shadow, l*shadow, alpha)} else geometry.colours.push(l, l, l, alpha)
			if (corners[3] || corners[9] || corners[11]) {geometry.colours.push(l*shadow, l*shadow, l*shadow, alpha)} else geometry.colours.push(l, l, l, alpha)
			if (corners[2] || corners[9] || corners[10]) {geometry.colours.push(l*shadow, l*shadow, l*shadow, alpha)} else geometry.colours.push(l, l, l, alpha)
			if (corners[1] || corners[8] || corners[11]) {geometry.colours.push(l*shadow, l*shadow, l*shadow, alpha)} else geometry.colours.push(l, l, l, alpha)
			geometry.uvs.push(
				blocks[block][0][0], blocks[block][0][1],
				blocks[block][0][0]+blockSize.x, blocks[block][0][1]+blockSize.y,
				blocks[block][0][0]+blockSize.x, blocks[block][0][1],
				blocks[block][0][0], blocks[block][0][1]+blockSize.y
			)
		}
		
		// -Y
		if (sides[1]) {
			geometry.vertices.push(pos.x, pos.y+o, pos.z)
			i0 = geometry.vertices.length/3-1
			geometry.vertices.push(pos.x+1, pos.y+o, pos.z+1)
			i1 = geometry.vertices.length/3-1
			geometry.vertices.push(pos.x+1, pos.y+o, pos.z)
			i2 = geometry.vertices.length/3-1
			geometry.vertices.push(pos.x, pos.y+o, pos.z+1)
			i3 = geometry.vertices.length/3-1
			geometry.faces.push(i2, i1, i0)
			geometry.faces.push(i0, i1, i3)
			// let l = 0.55*e
			if (corners[4] || corners[12] || corners[14]) {geometry.colours.push(l*shadow, l*shadow, l*shadow, alpha)} else geometry.colours.push(l, l, l, alpha)
			if (corners[7] || corners[13] || corners[15]) {geometry.colours.push(l*shadow, l*shadow, l*shadow, alpha)} else geometry.colours.push(l, l, l, alpha)
			if (corners[6] || corners[13] || corners[14]) {geometry.colours.push(l*shadow, l*shadow, l*shadow, alpha)} else geometry.colours.push(l, l, l, alpha)
			if (corners[5] || corners[12] || corners[15]) {geometry.colours.push(l*shadow, l*shadow, l*shadow, alpha)} else geometry.colours.push(l, l, l, alpha)
			geometry.uvs.push(
				blocks[block][1][0], blocks[block][1][1],
				blocks[block][1][0]+blockSize.x, blocks[block][1][1]+blockSize.y,
				blocks[block][1][0]+blockSize.x, blocks[block][1][1],
				blocks[block][1][0], blocks[block][1][1]+blockSize.y
			)
		}
		
		// +X
		if (sides[2]) {
			geometry.vertices.push(pos.x+1-o, pos.y, pos.z)
			i0 = geometry.vertices.length/3-1
			geometry.vertices.push(pos.x+1-o, pos.y+1, pos.z+1)
			i1 = geometry.vertices.length/3-1
			geometry.vertices.push(pos.x+1-o, pos.y+1, pos.z)
			i2 = geometry.vertices.length/3-1
			geometry.vertices.push(pos.x+1-o, pos.y, pos.z+1)
			i3 = geometry.vertices.length/3-1
			geometry.faces.push(i2, i1, i0)
			geometry.faces.push(i0, i1, i3)
			// let l = 0.85*e
			if (corners[6] || corners[13] || corners[18]) {geometry.colours.push(l*shadow, l*shadow, l*shadow, alpha)} else geometry.colours.push(l, l, l, alpha)
			if (corners[3] || corners[9] || corners[19]) {geometry.colours.push(l*shadow, l*shadow, l*shadow, alpha)} else geometry.colours.push(l, l, l, alpha)
			if (corners[2] || corners[9] || corners[18]) {geometry.colours.push(l*shadow, l*shadow, l*shadow, alpha)} else geometry.colours.push(l, l, l, alpha)
			if (corners[7] || corners[13] || corners[19]) {geometry.colours.push(l*shadow, l*shadow, l*shadow, alpha)} else geometry.colours.push(l, l, l, alpha)
			geometry.uvs.push(
				blocks[block][2][0], blocks[block][2][1],
				blocks[block][2][0]+blockSize.x, blocks[block][2][1]+blockSize.y,
				blocks[block][2][0], blocks[block][2][1]+blockSize.y,
				blocks[block][2][0]+blockSize.x, blocks[block][2][1]
			)
		}
		
		// -X
		if (sides[3]) {
			geometry.vertices.push(pos.x+o, pos.y, pos.z)
			i0 = geometry.vertices.length/3-1
			geometry.vertices.push(pos.x+o, pos.y+1, pos.z+1)
			i1 = geometry.vertices.length/3-1
			geometry.vertices.push(pos.x+o, pos.y+1, pos.z)
			i2 = geometry.vertices.length/3-1
			geometry.vertices.push(pos.x+o, pos.y, pos.z+1)
			i3 = geometry.vertices.length/3-1
			geometry.faces.push(i0, i1, i2)
			geometry.faces.push(i3, i1, i0)
			// let l = 0.7*e
			if (corners[4] || corners[12] || corners[16]) {geometry.colours.push(l*shadow, l*shadow, l*shadow, 1)} else geometry.colours.push(l, l, l, alpha)
			if (corners[1] || corners[8] || corners[17]) {geometry.colours.push(l*shadow, l*shadow, l*shadow, 1)} else geometry.colours.push(l, l, l, alpha)
			if (corners[0] || corners[8] || corners[16]) {geometry.colours.push(l*shadow, l*shadow, l*shadow, 1)} else geometry.colours.push(l, l, l, alpha)
			if (corners[5] || corners[12] || corners[17]) {geometry.colours.push(l*shadow, l*shadow, l*shadow, 1)} else geometry.colours.push(l, l, l, alpha)
			geometry.uvs.push(
				blocks[block][3][0], blocks[block][3][1],
				blocks[block][3][0]+blockSize.x, blocks[block][3][1]+blockSize.y,
				blocks[block][3][0], blocks[block][3][1]+blockSize.y,
				blocks[block][3][0]+blockSize.x, blocks[block][3][1]
			)
		}
		
		// +Z
		if (sides[4]) {
			geometry.vertices.push(pos.x, pos.y, pos.z+1-o)
			i0 = geometry.vertices.length/3-1
			geometry.vertices.push(pos.x+1, pos.y+1, pos.z+1-o)
			i1 = geometry.vertices.length/3-1
			geometry.vertices.push(pos.x+1, pos.y, pos.z+1-o)
			i2 = geometry.vertices.length/3-1
			geometry.vertices.push(pos.x, pos.y+1, pos.z+1-o)
			i3 = geometry.vertices.length/3-1
			geometry.faces.push(i2, i1, i0)
			geometry.faces.push(i0, i1, i3)
			// let l = 0.75*e
			if (corners[5] || corners[15] || corners[17]) {geometry.colours.push(l*shadow, l*shadow, l*shadow, 1)} else geometry.colours.push(l, l, l, alpha)
			if (corners[3] || corners[11] || corners[19]) {geometry.colours.push(l*shadow, l*shadow, l*shadow, 1)} else geometry.colours.push(l, l, l, alpha)
			if (corners[7] || corners[15] || corners[19]) {geometry.colours.push(l*shadow, l*shadow, l*shadow, 1)} else geometry.colours.push(l, l, l, alpha)
			if (corners[1] || corners[11] || corners[17]) {geometry.colours.push(l*shadow, l*shadow, l*shadow, 1)} else geometry.colours.push(l, l, l, alpha)
			geometry.uvs.push(
				blocks[block][4][0], blocks[block][4][1],
				blocks[block][4][0]+blockSize.x, blocks[block][4][1]+blockSize.y,
				blocks[block][4][0]+blockSize.x, blocks[block][4][1],
				blocks[block][4][0], blocks[block][4][1]+blockSize.y
			)
		}
		
		// -Z
		if (sides[5]) {
			geometry.vertices.push(pos.x, pos.y, pos.z+o)
			i0 = geometry.vertices.length/3-1
			geometry.vertices.push(pos.x+1, pos.y+1, pos.z+o)
			i1 = geometry.vertices.length/3-1+o
			geometry.vertices.push(pos.x+1, pos.y, pos.z+o)
			i2 = geometry.vertices.length/3-1
			geometry.vertices.push(pos.x, pos.y+1, pos.z+o)
			i3 = geometry.vertices.length/3-1
			geometry.faces.push(i0, i1, i2)
			geometry.faces.push(i3, i1, i0)
			// let l = 0.6*e
			if (corners[4] || corners[14] || corners[16]) {geometry.colours.push(l*shadow, l*shadow, l*shadow, 1)} else geometry.colours.push(l, l, l, alpha)
			if (corners[2] || corners[10] || corners[18]) {geometry.colours.push(l*shadow, l*shadow, l*shadow, 1)} else geometry.colours.push(l, l, l, alpha)
			if (corners[6] || corners[14] || corners[18]) {geometry.colours.push(l*shadow, l*shadow, l*shadow, 1)} else geometry.colours.push(l, l, l, alpha)
			if (corners[0] || corners[10] || corners[16]) {geometry.colours.push(l*shadow, l*shadow, l*shadow, 1)} else geometry.colours.push(l, l, l, alpha)
			geometry.uvs.push(
				blocks[block][5][0], blocks[block][4][1],
				blocks[block][5][0]+blockSize.x, blocks[block][4][1]+blockSize.y,
				blocks[block][5][0]+blockSize.x, blocks[block][4][1],
				blocks[block][5][0], blocks[block][4][1]+blockSize.y
			)
		}
		
		return geometry
	}
	render(geometries) {
		if (this.mesh) this.mesh.delete()
		if (this.meshT) this.meshT.delete()

		if (geometries[0].vertices.length > 0) {
			this.mesh = new webgpu.Mesh(0, 0, 0, 1, 1, 1, [], [], [])
			this.mesh.setTexture(texture)
			this.mesh.oneSide = false
			// this.mesh.useAlpha = true
			// this.mesh.alphaTexture = alphaTexture
			// this.mesh.forceSolid = true
			// this.mesh.uniforms = {...this.mesh.uniforms,
			// 	camera: "uCamera",
			// 	rDistance: "rDistance"
			// }
			// webgl.setProgram(this.mesh.vertexShader, this.mesh.fragmentShader, this.mesh.attributes, this.mesh.uniforms)
			
			var geometry = geometries[0]
			this.mesh.vertices = geometry.vertices
			this.mesh.uvs = geometry.uvs
			this.mesh.colours = geometry.colours
			this.mesh.faces = geometry.faces

			this.mesh.computeNormals()

			// for (let i = 0; i < this.mesh.faces.length; i++) {
			// 	this.mesh.normals.push(0, 1, 0)
			// }

			this.mesh.updateBuffers()

			// this.mesh.doCustomRender = true

			// this.mesh.buffer = gl.createBuffer()
			// let data = []
			
			// for (let i = 0; i < geometry.faces.length; i++) {
			// 	data.push(geometry.vertices[i*3])
			// 	data.push(geometry.vertices[i*3+1])
			// 	data.push(geometry.vertices[i*3+2])
			// 	data.push(geometry.uvs[i*2])
			// 	data.push(geometry.uvs[i*2+1])
			// 	data.push(geometry.colours[i*3])
			// 	data.push(geometry.colours[i*3+1])
			// 	data.push(geometry.colours[i*3+2])
			// }

			// this.mesh.data = data

			// gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.buffer)
			// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_DRAW)

			// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.facesBuffer)
			// gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(geometry.faces), gl.DYNAMIC_DRAW)

			// this.mesh.group = "chunk-solid"
			// this.mesh.initGroup = () => {
			// 	webgl.setProgram(this.mesh.vertexShader, this.mesh.fragmentShader, this.mesh.attributes, this.mesh.uniforms)

			// 	gl.uniform1i(webgl.uniforms.useTexture, this.mesh.useTexture ? 1 : 0)
			// 	gl.uniform1i(webgl.uniforms.texture, this.mesh.useTexture && this.mesh.texture ? this.mesh.texture.id : webgl.gId)

			// 	gl.uniform1i(webgl.uniforms.useAlphaMap, this.mesh.useAlpha)
			// 	gl.uniform1i(webgl.uniforms.alpha, this.mesh.useAlpha && this.mesh.alphaTexture ? this.mesh.alphaTexture.id : webgl.gId)

			// 	gl.enableVertexAttribArray(webgl.attributes.uvs)
			// 	gl.enableVertexAttribArray(webgl.attributes.vertices)
			// 	gl.enableVertexAttribArray(webgl.attributes.uvs)
			// 	gl.enableVertexAttribArray(webgl.attributes.colours)

			// 	gl.disable(gl.CULL_FACE)
			// 	// gl.cullFace(gl.BACK)
			// }

			// this.mesh.renderA = () => {
			// 	webgl.setProgram(this.mesh.vertexShader, this.mesh.fragmentShader, this.mesh.attributes, this.mesh.uniforms)

			// 	gl.uniformMatrix4fv(webgl.uniforms.model, false, this.mesh.model)

			// 	gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.buffer)
			// 	// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.data), gl.DYNAMIC_DRAW)
			// 	gl.vertexAttribPointer(webgl.attributes.vertices, 3, gl.FLOAT, false, 32, 0)
			// 	gl.vertexAttribPointer(webgl.attributes.uvs, 2, gl.FLOAT, false, 32, 12)
			// 	gl.vertexAttribPointer(webgl.attributes.colours, 3, gl.FLOAT, false, 32, 20)

			// 	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.facesBuffer)

			// 	gl.drawElements(gl.TRIANGLES, this.mesh.faces.length, gl.UNSIGNED_INT, 0)
			// 	// gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(geometry.faces), gl.DYNAMIC_DRAW)
			// }
		}

		if (geometries[1].vertices.length > 0) {
			this.meshT = new webgpu.Mesh(0, 0, 0, 1, 1, 1, [], [], [])
			this.meshT.setTexture(texture)
			this.meshT.transparent = true
			// this.meshT.useAlpha = true
			// this.meshT.alphaTexture = alphaTexture
			// this.meshT.order = true

			// this.meshT.uniforms = {...this.meshT.uniforms,
			// 	camera: "uCamera",
			// 	rDistance: "rDistance"
			// }
			
			var geometryT = geometries[1]
			this.meshT.vertices = geometryT.vertices
			this.meshT.uvs = geometryT.uvs
			this.meshT.colours = geometryT.colours
			this.meshT.faces = geometryT.faces

			this.meshT.castShadows = false

			this.meshT.computeNormals()

			// this.meshT.setTMat()

			// // this.meshT.setProgram()
			// // this.meshT.vao = gl.createVertexArray()

			this.meshT.updateBuffers()
	
			// this.meshT.doCustomRender = true
	
			// this.meshT.buffer = gl.createBuffer()
			// data = []
			
			// for (let i = 0; i < geometryT.faces.length; i++) {
			// 	data.push(geometryT.vertices[i*3])
			// 	data.push(geometryT.vertices[i*3+1])
			// 	data.push(geometryT.vertices[i*3+2])
			// 	data.push(geometryT.uvs[i*2])
			// 	data.push(geometryT.uvs[i*2+1])
			// 	data.push(geometryT.colours[i*3])
			// 	data.push(geometryT.colours[i*3+1])
			// 	data.push(geometryT.colours[i*3+2])
			// }
	
			// this.meshT.data = data
	
			// gl.bindBuffer(gl.ARRAY_BUFFER, this.meshT.buffer)
			// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_DRAW)
	
			// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.meshT.facesBuffer)
			// gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.meshT.faces), gl.DYNAMIC_DRAW)

			// this.meshT.group = "chunk-transparent"
			// this.meshT.initGroup = () => {
			// 	this.meshT.setProgram()

			// 	gl.uniform1i(webgl.uniforms.useTexture, this.meshT.useTexture ? 1 : 0)
			// 	gl.uniform1i(webgl.uniforms.texture, this.meshT.useTexture && this.meshT.texture ? this.meshT.texture.id : webgl.gId)

			// 	gl.uniform1i(webgl.uniforms.useAlphaMap, this.meshT.useAlpha)
			// 	gl.uniform1i(webgl.uniforms.alpha, this.meshT.useAlpha && this.meshT.alphaTexture ? this.meshT.alphaTexture.id : webgl.gId)

			// 	gl.uniform1i(webgl.uniforms.ignoreDepth, this.meshT.ignoreDepth)
			// 	gl.uniform1f(webgl.uniforms.alpha2, this.meshT.alpha)

			// 	gl.enableVertexAttribArray(webgl.attributes.uvs)
			// 	gl.enableVertexAttribArray(webgl.attributes.vertices)
			// 	gl.enableVertexAttribArray(webgl.attributes.uvs)
			// 	gl.enableVertexAttribArray(webgl.attributes.colours)

			// 	gl.disable(gl.CULL_FACE)
			// 	// gl.cullFace(gl.BACK)
			// }

			// this.meshT.renderA = () => {
			// 	this.meshT.orderFaces()
			// 	this.meshT.setProgram()

			// 	gl.uniformMatrix4fv(webgl.uniforms.model, false, this.meshT.model)

			// 	gl.bindBuffer(gl.ARRAY_BUFFER, this.meshT.buffer)
			// 	// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.meshT.data), gl.DYNAMIC_DRAW)
			// 	gl.vertexAttribPointer(webgl.attributes.vertices, 3, gl.FLOAT, false, 32, 0)
			// 	gl.vertexAttribPointer(webgl.attributes.uvs, 2, gl.FLOAT, false, 32, 12)
			// 	gl.vertexAttribPointer(webgl.attributes.colours, 3, gl.FLOAT, false, 32, 20)

			// 	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.meshT.facesBuffer)

			// 	gl.drawElements(gl.TRIANGLES, this.meshT.faces.length, gl.UNSIGNED_INT, 0)
			// 	// gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(geometry.faces), gl.DYNAMIC_DRAW)
			// }

			// this.meshT.originalFaces = [...this.meshT.faces]
			// this.meshT.doCustomOrderUpdate = true
			// this.meshT.customOrderUpdate = () => {
			// 	this.meshT.setProgram()
			// 	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.meshT.facesBuffer)
			// 	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.meshT.faces), gl.DYNAMIC_DRAW)
			// }
	
			// this.meshT.customRender = () => {
			// 	gl.enableVertexAttribArray(webgl.attributes.vertices)
			// 	gl.enableVertexAttribArray(webgl.attributes.uvs)
			// 	gl.enableVertexAttribArray(webgl.attributes.colours)
			// 	gl.bindBuffer(gl.ARRAY_BUFFER, this.meshT.buffer)
			// 	// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.data), gl.DYNAMIC_DRAW)
			// 	gl.vertexAttribPointer(webgl.attributes.vertices, 3, gl.FLOAT, false, 32, 0)
			// 	gl.vertexAttribPointer(webgl.attributes.uvs, 2, gl.FLOAT, false, 32, 12)
			// 	gl.vertexAttribPointer(webgl.attributes.colours, 3, gl.FLOAT, false, 32, 20)
	
			// 	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.meshT.facesBuffer)
			// 	// gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(geometry.faces), gl.DYNAMIC_DRAW)
			// }
		}
		
		this.updatePos()
		
		// this.mesh.vertexShader = vertexShader
		// this.mesh.fragmentShader = fragmentShader
		// this.meshT.vertexShader = vertexShader
		// this.meshT.fragmentShader = fragmentShader
		

		// this.mesh.updateBuffers()
		// this.meshT.updateBuffers()
		// this.meshT.orderFaces()
	}
	updatePos() {
		if (this.mesh) {
			this.mesh.pos = {x: this.pos.x-player.wcpos.x, y: this.pos.y-player.wcpos.y, z: this.pos.z-player.wcpos.z}
			// this.mesh.model = mat4.create()
			// mat4.translate(this.mesh.model, this.mesh.model, [this.mesh.pos.x, this.mesh.pos.y, this.mesh.pos.z])
		}
		if (this.meshT) {
			this.meshT.pos = {x: this.pos.x-player.wcpos.x, y: this.pos.y-player.wcpos.y, z: this.pos.z-player.wcpos.z}
			// this.meshT.model = mat4.create()
			// mat4.translate(this.meshT.model, this.meshT.model, [this.meshT.pos.x, this.meshT.pos.y, this.meshT.pos.z])
		}
	}
	order(geometryT) {
		return
		// console.log(JSON.stringify(this.geometryT2) == geometryT)
		// this.geometryT2 = geometryT
		// this.geometryT = new THREE.BufferGeometry()
		// this.geometryT.setAttribute("position", new THREE.BufferAttribute(new Float32Array(geometryT.vertices), 3))
		// this.geometryT.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(geometryT.uvs), 2))
		// this.geometryT.setAttribute("color", new THREE.Float32BufferAttribute(geometryT.colours, 3))
		// this.geometryT.setIndex(geometryT.faces)
		// this.geometryT.computeVertexNormals()
		// this.geometryT.computeFaceNormals()
		// this.meshT.geometry = this.geometryT
		// console.log("ye")
		// this.geometryT.setIndex(order2)
		
		// this.geometryT.computeFaceNormals()
		// this.meshT.geometry = this.geometryT
	}
	updateShader() {
		// this.materialT.uniforms.cameraPos.value = camera.position
		// this.materialT.uniforms.light.value = light
		// this.material.uniforms.light.value = light
	}
	delete() {
		if (this.mesh) this.mesh.delete()
		if (this.meshT) this.meshT.delete()
		this.mesh = null
		this.meshT = null
	}
}

class VoxelModel extends Object3D {
	mesh
	pos = {x: 0, y: 0, z: 0}
	data
	visible = true
	constructor(x, y, z, data) {
		super(x, y, z, 1, 1, 1)
		this.pos = {x: x, y: y, z: z}
		this.mesh = new webgpu.Mesh(x, y, z, 1, 1, 1, [], [], [])
		this.mesh.oneSide = true
		this.data = data
		this.update()
	}
	updateRaw() {
		this.mesh.pos = this.pos
		this.mesh.rot = this.rot
		this.mesh.size = this.size
		this.mesh.visible = this.visible
	}
	update() {
		this.updateRaw()
		this.mesh.vertices = []
		this.mesh.faces = []
		this.mesh.colours = []
		let offs = [
			[1, 0, 0],
			[-1, 0, 0],
			[0, 1, 0],
			[0, -1, 0],
			[0, 0, 1],
			[0, 0, -1],
		]
		for (let x = 0; x < 16; x++) {
			for (let y = 0; y < 16; y++) {
				for (let z = 0; z < 16; z++) {
					if (x*16*16+y*16+z >= this.data.length) { break }
					let d = this.data[x*16*16+y*16+z]
					if (d[0]) {
						let sides = []
						for (let off of offs) {
							let s = true
							let i = (x+off[0])*16*16+(y+off[1])*16+(z+off[2])
							if (i < 0 || i >= this.data.length) {
								s = false
							} else {
								if (!this.data[i][0]) {
									s = false
								}
							}
							sides.push(!s)
						}
						this.renderVoxel(x, y, z, d[1], sides)
					}
				}
			}
		}
		this.mesh.updateBuffers()
	}
	renderVoxel(x, y, z, c, sides) {
		x /= 16
		y /= 16
		z /= 16
		// +X
		let s = 1/16
		if (sides[0]) {
			let i0 = this.mesh.vertices.length/3
			let i1 = this.mesh.vertices.length/3+1
			let i2 = this.mesh.vertices.length/3+2
			let i3 = this.mesh.vertices.length/3+3
			this.mesh.vertices.push(
				s+x, 0+y, 0+z,
				s+x, s+y, s+z,
				s+x, s+y, 0+z,
				s+x, 0+y, s+z,
			)
			this.mesh.faces.push(
				i0, i2, i1,
				i1, i3, i0,
			)
			for (let i = 0; i < 4; i++) {
				this.mesh.colours.push(c[0]*0.85, c[1]*0.85, c[2]*0.85)
			}
		}
		// -X
		if (sides[1]) {
			let i0 = this.mesh.vertices.length/3
			let i1 = this.mesh.vertices.length/3+1
			let i2 = this.mesh.vertices.length/3+2
			let i3 = this.mesh.vertices.length/3+3
			this.mesh.vertices.push(
				0+x, 0+y, 0+z,
				0+x, s+y, s+z,
				0+x, s+y, 0+z,
				0+x, 0+y, s+z,
			)
			this.mesh.faces.push(
				i1, i2, i0,
				i0, i3, i1,
			)
			for (let i = 0; i < 4; i++) {
				this.mesh.colours.push(c[0]*0.7, c[1]*0.7, c[2]*0.7)
			}
		}
		// +Y
		if (sides[2]) {
			let i0 = this.mesh.vertices.length/3
			let i1 = this.mesh.vertices.length/3+1
			let i2 = this.mesh.vertices.length/3+2
			let i3 = this.mesh.vertices.length/3+3
			this.mesh.vertices.push(
				0+x, s+y, 0+z,
				s+x, s+y, s+z,
				s+x, s+y, 0+z,
				0+x, s+y, s+z,
			)
			this.mesh.faces.push(
				i1, i2, i0,
				i0, i3, i1,
			)
			for (let i = 0; i < 4; i++) {
				this.mesh.colours.push(c[0]*1, c[1]*1, c[2]*1)
			}
		}
		// -Y
		if (sides[3]) {
			let i0 = this.mesh.vertices.length/3
			let i1 = this.mesh.vertices.length/3+1
			let i2 = this.mesh.vertices.length/3+2
			let i3 = this.mesh.vertices.length/3+3
			this.mesh.vertices.push(
				0+x, 0+y, 0+z,
				s+x, 0+y, s+z,
				s+x, 0+y, 0+z,
				0+x, 0+y, s+z,
			)
			this.mesh.faces.push(
				i0, i2, i1,
				i1, i3, i0,
			)
			for (let i = 0; i < 4; i++) {
				this.mesh.colours.push(c[0]*0.55, c[1]*0.55, c[2]*0.55)
			}
		}
		// +Z
		if (sides[4]) {
			let i0 = this.mesh.vertices.length/3
			let i1 = this.mesh.vertices.length/3+1
			let i2 = this.mesh.vertices.length/3+2
			let i3 = this.mesh.vertices.length/3+3
			this.mesh.vertices.push(
				0+x, 0+y, s+z,
				s+x, s+y, s+z,
				s+x, 0+y, s+z,
				0+x, s+y, s+z,
			)
			this.mesh.faces.push(
				i0, i2, i1,
				i1, i3, i0,
			)
			for (let i = 0; i < 4; i++) {
				this.mesh.colours.push(c[0]*0.75, c[1]*0.75, c[2]*0.75)
			}
		}
		// -Z
		if (sides[5]) {
			let i0 = this.mesh.vertices.length/3
			let i1 = this.mesh.vertices.length/3+1
			let i2 = this.mesh.vertices.length/3+2
			let i3 = this.mesh.vertices.length/3+3
			this.mesh.vertices.push(
				0+x, 0+y, 0+z,
				s+x, s+y, 0+z,
				s+x, 0+y, 0+z,
				0+x, s+y, 0+z,
			)
			this.mesh.faces.push(
				i1, i2, i0,
				i0, i3, i1,
			)
			for (let i = 0; i < 4; i++) {
				this.mesh.colours.push(c[0]*0.6, c[1]*0.6, c[2]*0.6)
			}
		}
	}
}

class Text3D extends Object3D {
	spc = 1
	text = ""
	mesh
	lastText = ""
	center = true
	constructor(x, y, z, text, sizePerCharacter) {
		super(x, y, z, 1, 1, 1)
		this.text = text
		this.spc = sizePerCharacter
		this.mesh = new webgpu.Mesh(0, 0, 0, 1, 1, 1, [], [], [])
		this.mesh.useTexture = true
		this.mesh.texture = fontTexture
		this.mesh.useAlpha = true
		this.mesh.alphaTexture = fontAlphaTexture
		this.mesh.order = true
		this.update()
	}
	lookAtCam() {
		if (!player) { return }
		let diff = {x: camera.pos.x-this.pos.x, y: camera.pos.y-this.pos.y, z: camera.pos.z-this.pos.z}
		this.rot.y = Math.atan2(diff.x, diff.z)
		var l1 = Math.sqrt((diff.x**2) + (diff.z**2))
		this.rot.x = Math.atan2(l1, diff.y)
		this.rot.x -= Math.PI/2
	}
	getWidth() {
		let x = 0
		for (let c of this.text) {
			let cData = characters[c]
			if (!cData) { 
				if (c == " ") x += this.spc
				continue 
			}
			let spacing = cData.length > 2 ? cData[2] : 1
			x += this.spc * spacing + this.spc * 0.2
		}
		return x
	}
	renderMesh() {
		this.mesh.vertices = []
		this.mesh.faces = []
		this.mesh.colours = []
		this.mesh.uvs = []

		let width = this.getWidth()

		let i = 0
		let x2 = 0
		for (let c of this.text) {
			let cData = characters[c]
			if (!cData) { 
				i++
				if (c == " ") x2 += this.spc
				continue 
			}
			let spacing = cData.length > 2 ? cData[2] : 1
			let x = cData[0]
			let y = cData[1]
				
			let i0 = this.mesh.vertices.length/3
			let i1 = this.mesh.vertices.length/3+1
			let i2 = this.mesh.vertices.length/3+2
			let i3 = this.mesh.vertices.length/3+3
			this.mesh.vertices.push(
				0+x2 - width/2,            0,            0,
				this.spc*spacing+x2 - width/2, this.spc*1.4, 0,
				this.spc*spacing+x2 - width/2, 0,            0,
				0+x2 - width/2,      			 this.spc*1.4, 0,
			)
			this.mesh.faces.push(
				i0, i1, i2,
				i0, i1, i3,
			)
			let sideOff1 = Math.floor((1-spacing) / 2 * 5) / 5 * fs.x
			let sideOff2 = Math.ceil((1-spacing) / 2 * 5) / 5 * fs.x
			this.mesh.uvs.push(
				x*fs.x+0+sideOff1, y*fs.y+0,
				x*fs.x+fs.x-sideOff2, y*fs.y+fs.y,
				x*fs.x+fs.x-sideOff2, y*fs.y+0,
				x*fs.x+0+sideOff1, y*fs.y+fs.y
			)
			for (let i2 = 0; i2 < 4; i2++) {
				this.mesh.colours.push(1, 1, 1, 1)
			}

			if (i < this.text.length-1) {
				// i0 = this.mesh.vertices.length/3
				// i1 = this.mesh.vertices.length/3+1
				// i2 = this.mesh.vertices.length/3+2
				// i3 = this.mesh.vertices.length/3+3
				// this.mesh.vertices.push(
				// 	this.spc/1.2+i*this.spc - this.text.length/2*this.spc, 0,            0,
				// 	this.spc+i*this.spc - this.text.length/2*this.spc,     this.spc/1.2*1.4, 0,
				// 	this.spc+i*this.spc - this.text.length/2*this.spc,     0,            0,
				// 	this.spc/1.2+i*this.spc - this.text.length/2*this.spc, this.spc/1.2*1.4, 0,
				// )
				// this.mesh.faces.push(
				// 	i0, i1, i2,
				// 	i0, i1, i3,
				// )
				// this.mesh.uvs.push(
				// 	0+offF, 0,
				// 	0+offF, 0,
				// 	0+offF, 0,
				// 	0+offF, 0,
				// )
				// for (let i2 = 0; i2 < 4; i2++) {
				// 	this.mesh.colours.push(0, 0, 0)
				// }
				i++
				x2 += this.spc * spacing + this.spc * 0.2
			}
		}

		this.mesh.updateBuffers()
	}
	update() {
		this.size.x = this.text.length*this.spc
		this.size.y = this.sizePerCharacter*1.4
		this.mesh.pos = this.pos
		if (this.text != this.lastText) {
			this.renderMesh()
		}
		this.lookAtCam()
		this.mesh.rot = {...this.rot}
		this.lastText = this.text
	}
}

class Particle extends Box {
	vel = {x: 0, y: 0, z: 0}
	time = 0
	lifetime = 0
	wpos = {x: 0, y: 0, z: 0}
	rsize = 0
	constructor(colour, x, y, z, velx, vely, velz, size, lifetime) {
		super(0, 0, 0, size, size, size, colour)
		this.rsize = size
		this.vel = {x: velx, y: vely, z: velz}
		this.wpos = {x:x, y:y, z:z}
		this.lifetime = lifetime
		this.updateP()
	}
	updateP() {
		let s = this.rsize * (1-this.time/this.lifetime)
		this.size = {x: s, y: s, z: s}
		this.pos = {x: this.wpos.x - player.wcpos.x, y: this.wpos.y - player.wcpos.y, z: this.wpos.z - player.wcpos.z}
		this.update()
	}
	move() {
		this.wpos.x += this.vel.x
		this.wpos.y += this.vel.y
		this.wpos.z += this.vel.z

		this.vel.x *= 0.99
		this.vel.y *= 0.99
		this.vel.z *= 0.99

		let speed = 0.01
		this.vel.x += (Math.random()*speed - speed/2) * delta
		this.vel.y += (Math.random()*speed - speed/2) * delta 
		this.vel.z += (Math.random()*speed - speed/2) * delta

		this.updateP()

		this.time += delta
		if (this.time > this.lifetime) {
			this.delete()
			return false
		}
		return true
	}
}