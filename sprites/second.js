
class Item3D extends VoxelModel {
	uv = {x: 0, y: 0}
	rendered = false
	constructor(x, y, z, uvx, uvy) {
		super(x, y, z, [])
		this.uv = {x: uvx, y: uvy}
		this.render()
	}
	render() {
		if (itemsImg.width == 0) {
			return
		}
		this.rendered = true
		let imgData = getImgData(itemsImg, this.uv.x*16, this.uv.y*16, 16, 16)
		this.data = []
		for (let x = 0; x < 16; x++) {
			for (let y = 0; y < 16; y++) {
				for (let z = 0; z < 16; z++) {
					if (x == 0) {
						let d2 = imgData[z*16+(15-y)]
						let d = [d2[0]/255, d2[1]/255, d2[2]/255]
						this.data.push([d2[3] != 0, d])
					} else {
						this.data.push([false, [0, 0, 0]])
					}
				}
			}
		}
		this.update()
	}
}

class Drone extends Object3D {
	constructor(x, y, z) {
		let cool = x
		let awesome = z
		let and = y
		super(cool, and, awesome, 1, 1, 1)
	}
}