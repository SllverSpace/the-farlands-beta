
var font = new FontFace("font", "url(assets/font.ttf)")
var fontLoaded = false
font.load().then(function(loadedFont) {
	fontLoaded = true
	document.fonts.add(loadedFont)
})

class UI {
    rect(ctx, x, y, width, height, colour=[0, 0, 0, 1], outlineSize=0, outlineColour=[0, 0, 0, 1]) {
        ctx.fillStyle = `rgba(${colour[0]},${colour[1]},${colour[2]},${colour[3]})`
        if (outlineSize > 0) {
            ctx.lineWidth = outlineSize
            ctx.strokeStyle = `rgba(${outlineColour[0]},${outlineColour[1]},${outlineColour[2]},${outlineColour[3]})`
            ctx.strokeRect(x - width/2 + ctx.off.x, y - height/2 + ctx.off.y, width, height)
        }
        ctx.fillRect(x - width/2 + ctx.off.x, y - height/2 + ctx.off.y, width, height)
    }
    text(ctx, x, y, size, text, align="left", outlineSize="auto", wrap=-1, colour=[255, 255, 255, 1], outlineColour=[0, 0, 0, 1]) {
        if (!fontLoaded) { return }
        ctx.fillStyle = `rgba(${colour[0]},${colour[1]},${colour[2]},${colour[3]})`
        ctx.font = `${size}px font`
        ctx.textAlign = align
        ctx.textBaseline = "middle"
        ctx.strokeStyle = `rgba(${outlineColour[0]},${outlineColour[1]},${outlineColour[2]},${outlineColour[3]})`
        if (outlineSize == "auto") {
            outlineSize = size/4.5
        }
        ctx.lineWidth = outlineSize

        let words = text.split(" ")
        let lines = []
        let line = ""
        for (let word of words) {
            let newLine = word.includes("\n")
            word = word.replace("\n", "")
            if ((ctx.measureText(line + word + " ").width < wrap || wrap == -1) && !newLine) {
                line += word + " "
            } else {
                lines.push(line)
                line = word + " "
            }
        }
        lines.push(line)

        for (let i = 0; i < lines.length; i++) {
            while (ctx.measureText(lines[i]).width > wrap && wrap != -1) {
                lines[i] = lines[i].slice(0, -1)
            }
        }

        for (let i in lines) {
            ctx.strokeText(lines[i], x + ctx.off.x, y + ctx.off.y + i*size)
            ctx.fillText(lines[i], x + ctx.off.x, y + ctx.off.y + i*size)
        }

        return lines.length
    }
    img(ctx, x, y, width, height, img, clip={use: false, x: 0, y: 0, width: 0, height: 0}) {
        x = Math.round(x)
        y = Math.round(y)
        width = Math.round(width/2)*2
        height = Math.round(height/2)*2
        if (clip.use) {
            ctx.drawImage(img, clip.x, clip.y, clip.width, clip.height, x-width/2 + ctx.off.x, y-height/2 + ctx.off.y, width, height)
        } else {
            ctx.drawImage(img, x-width/2 + ctx.off.x, y-height/2 + ctx.off.y, width, height)
        }
    }
    hovered(x, y, width, height, gOff={x: 0, y: 0}) {
        return (
            mouse.x-gOff.x > x-width/2 && mouse.x-gOff.x < x+width/2 &&
            mouse.y-gOff.y > y-height/2 && mouse.y-gOff.y < y+height/2
        )
    }
}

var ui = new UI()

class Rect extends Object2D {
    colour = [0, 0, 0, 1]
    outline = [0, 0, 0, 1]
    outlineSize = 0
    constructor(x, y, width, height, colour=[0, 0, 0, 1], outline=[0, 0, 0, 1], outlineSize=0) {
        super(x, y, width, height)
        this.colour = colour
        this.outline = outline
        this.outlineSize = outlineSize
    }
    draw(ctx) {
        ctx.fillStyle = `rgba(${this.colour[0]},${this.colour[1]},${this.colour[2]},${this.colour[3]})`
        ctx.strokeStyle = `rgba(${this.outline[0]},${this.outline[1]},${this.outline[2]},${this.outline[3]})`
        ctx.lineWidth = this.outlineSize
        if (this.outlineSize > 0) {
            ctx.strokeRect(this.x-this.width/2 + ctx.off.x, this.y-this.height/2 + ctx.off.y, this.width, this.height)
        }
        ctx.fillRect(this.x-this.width/2 + ctx.off.x, this.y-this.height/2 + ctx.off.y, this.width, this.height)
        
    }
}

class Text extends Object2D {
    text = ""
    colour = [255, 255, 255, 1]
    outline = [0, 0, 0, 1]
    outlineSize = 1
    size = 0
    align = "left"
    autoOutline = true
    constructor(x, y, size, text, colour=[255, 255, 255, 1], outlineSize=1, outline=[0, 0, 0, 1], align="left") {
        super(x, y, 0, 0)
        this.size = size
        this.text = text
        this.colour = colour
        this.outline = outline
        this.outlineSize = outlineSize
        this.align = align
    }
    updateSize(ctx) {
        ctx.font = `${this.size}px font`
        let text = ctx.measureText(this.text)
        this.width = text.width
        this.height = this.size
    }
    draw(ctx) {
        if (!fontLoaded) { return }
        this.updateSize(ctx)
        ctx.fillStyle = `rgba(${this.colour[0]},${this.colour[1]},${this.colour[2]},${this.colour[3]})`
        ctx.font = `${this.size}px font`
        ctx.textAlign = this.align
        ctx.textBaseline = "middle"
        ctx.strokeStyle = `rgba(${this.outline[0]},${this.outline[1]},${this.outline[2]},${this.outline[3]})`
        if (this.autoOutline) {
            this.outlineSize = this.size/4.5
        }
        ctx.lineWidth = this.outlineSize
        ctx.strokeText(this.text, this.x + ctx.off.x, this.y + ctx.off.y)
        ctx.fillText(this.text, this.x + ctx.off.x, this.y + ctx.off.y)
    }
}

class TextBox extends Rect {
    text = ""
    placeholder = ""
    textO
    focused = false
    indicator
    time = 0
    lastText = ""
    mulX = 1
    mulY = 1
    focusTime = 0
    gOff = {x: 0, y: 0}
    constructor(x, y, width, height, placeholder="", colour=[127, 127, 127, 1]) {
        super(x, y, width, height, colour, [0, 0, 0, 1], 10)
        this.placeholder = placeholder
        this.textO = new Text(this.x - this.width/2, this.y+this.height, this.height, placeholder)
        this.indicator = new Rect(0, 0, 0, 0, [255, 255, 255, 1])
    }
    checkFocus(event) {
        let hovered = this.hasPoint(mouse.x-this.gOff.x, mouse.y-this.gOff.y)
        if (hovered && mouse.lclick) {
            focused = this
            this.focused = true
            getInput.focus()
            event.preventDefault()
            this.time = 0
            getInput.value = this.text
        }
    }
    hovered() {
        return this.hasPoint(mouse.x-this.gOff.x, mouse.y-this.gOff.y)
    }
    hover() {
        if (this.hovered()) {
            document.body.style.cursor = "text"
            this.mulX += (0.995-this.mulX) * delta * 15
            this.mulY += (0.95-this.mulY) * delta * 15
        } else {
            this.mulX += (1-this.mulX) * delta * 15
            this.mulY += (1-this.mulY) * delta * 15
        }
    }
    draw(ctx) {
        this.width *= this.mulX
        this.height *= this.mulY
        super.draw(ctx)
        this.width /= this.mulX
        this.height /= this.mulY
        this.height *= 0.75
        this.textO.text = this.text
        if (this.text.length < 1) {
            this.textO.text = this.placeholder
            this.textO.colour = [100, 100, 100, 1]
        } else {
            this.textO.colour = [255, 255, 255, 1]
        }
        this.textO.size = this.height
        this.textO.x = this.x - this.width/2 + this.height * 0.25
        this.textO.y = this.y
        this.textO.outlineSize = this.height/4.5
        this.height /= 0.75
        this.textO.draw(ctx)

        this.time += delta
        if (this.time > 1) {
            this.time = 0
        }
        if (this.focused && this.time < 0.5) {
            if (this.text.length < 1) { this.textO.width = 0 }
            this.indicator.x = this.textO.x + this.textO.width
            this.indicator.y = this.y
            this.indicator.width = this.height*0.75/7
            this.indicator.height = this.height*0.75
            this.indicator.draw(ctx)
        }
        if (this.lastText != this.text) {
            this.time = 0
        }
        this.lastText = this.text

        ctx.strokeStyle = `rgba(0, 0, 255, ${this.focusTime*10})`
        let s = this.height/7 * 2
        this.width += s
        this.height += s
        ctx.lineWidth = this.outlineSize/4
        ctx.strokeRect(this.x - this.width/2 + ctx.off.x, this.y - this.height/2 + ctx.off.y, this.width, this.height)
        this.width -= s
        this.height -= s

        if (this.focused) {
            this.focusTime += delta
            if (this.focusTime > 1/10) {
                this.focusTime = 1/10
            }
        } else {
            this.focusTime -= delta
            if (this.focusTime < 0) {
                this.focusTime = 0
            }
        }

    }
}

class Img extends Object2D {
    img
    clip
    r = true
    constructor(x, y, width, height, img, clip={use: false, x: 0, y: 0, width: 0, height: 0}) {
        super(x, y, width, height)
        this.img = img
        this.clip = clip
    }
    draw(ctx) {
        let oldX = this.x
        let oldY = this.y
        let oldWidth = this.width
        let oldHeight = this.height
        this.x = Math.round(this.x)
        this.y = Math.round(this.y)
        this.width = Math.round(this.width/2)*2
        this.height = Math.round(this.height/2)*2
        if (this.r) {
            
        }
        if (this.clip.use) {
            ctx.drawImage(this.img, this.clip.x, this.clip.y, this.clip.width, this.clip.height, this.x-this.width/2 + ctx.off.x, this.y-this.height/2 + ctx.off.y, this.width, this.height)
        } else {
            ctx.drawImage(this.img, this.x-this.width/2 + ctx.off.x, this.y-this.height/2 + ctx.off.y, this.width, this.height)
        }
        this.x = oldX
        this.y = oldY
        this.width = oldWidth
        this.height = oldHeight
    }
}

class Button extends Object2D {
    type = ""
    bg
    text = ""
    textO
    textSize = 0
    bgColour = [0, 0, 0, 255]
    visHeight = 0
    visWidth = 0
    mulVel = 0
    mul = 1
    hoverMul = 0.9
    clickMul = 0.2
    img
    scaleText = false
    clip = {use: false, x: 0, y: 0, width: 0, height: 0}
    gOff = {x: 0, y: 0}
    constructor(x, y, visWidth, visHeight, type, text="", textSize=20) {
        super(x, y, visWidth, visHeight)
        this.text = text
        this.textSize = textSize
        this.visWidth = visWidth
        this.visHeight = visHeight
        this.type = type
        this.textO = new Text(this.x, this.y, this.textSize, this.text)
        if (type == "img") {
            this.bg = new Img(this.x, this.y, this.width, this.height, "")
        } else {
            this.bg = new Rect(this.x, this.y, this.width, this.height)
        }
    }
    hovered(canvas="none", mouse2="none") {
        if (canvas != "none") {
            if (this.y - this.height/2 > canvas.height-canvas.ctx.off.y) {
                return false
            }
        }
        if (mouse2 != "none") {
            let mouse = mouse2
            return this.hasPoint(mouse.x-this.gOff.x, mouse.y-this.gOff.y)
        }
        return this.hasPoint(mouse.x-this.gOff.x, mouse.y-this.gOff.y)
    }
    click() {
        this.mul = 1
        this.mulVel = -this.clickMul
    }
    basic(canvas="none") {
        this.mulVel += delta * 5
        this.mul += this.mulVel * delta * 120
        if (this.mul > 1) {
            this.mul = 1
        }
        if (this.mul < 0) {
            this.mul = 0
        }
        if (this.hovered(canvas)) {
            this.visWidth += (this.width*this.hoverMul*this.mul - this.visWidth) * delta * 15
            this.visHeight += (this.height*this.hoverMul*this.mul - this.visHeight) * delta * 15
            document.body.style.cursor = "pointer"
        } else {
            this.visWidth += (this.width*this.mul - this.visWidth) * delta * 15
            this.visHeight += (this.height*this.mul - this.visHeight) * delta * 15
        }
    }
    draw(ctx) {
        this.bg.x = this.x
        this.bg.y = this.y
        this.bg.width = this.visWidth
        this.bg.height = this.visHeight
        this.textO.x = this.x
        this.textO.y = this.y
        this.textO.size = this.textSize
        this.textO.align = "center"
        this.textO.text = this.text

        if (this.type == "rect") {
            this.bg.colour = this.bgColour
        }
        if (this.type == "img") {
            this.bg.img = this.img
            this.bg.clip = this.clip
        }

        this.textO.align = "center"

        this.bg.draw(ctx)

        if (this.scaleText) {
            this.textO.size *= (this.visWidth/this.width + this.visHeight/this.height) / 2
        }
        this.textO.draw(ctx)
        if (this.scaleText) {
            this.textO.size /= (this.visWidth/this.width + this.visHeight/this.height) / 2
        }
    }
}

class Slider extends Img {
    value = 50
    minValue = 0
    maxValue = 100
    handleImg
    handleClip = {use: false, x: 0, y: 0, width: 0, height: 0}
    handleWidth = 0
    handleHeight = 0
    bound = 3*4
    gOff = {x: 0, y: 0}
    constructor(x, y, width, height, img, handleWidth, handleHeight, handleImg, clip={use: false, x: 0, y: 0, width: 0, height: 0}, handleClip={use: false, x: 0, y: 0, width: 0, height: 0}) {
        super(x, y, width, height, img, clip)
        this.handleImg = handleImg
        this.handleClip = handleClip
        this.handleWidth = handleWidth
        this.handleHeight = handleHeight
    }
    hovered() {
        return this.hasPoint(mouse.x-this.gOff.x, mouse.y-this.gOff.y)
    }
    convert(x) {
        return (x-this.x + this.width/2 - this.bound*su) / (this.width-this.bound*2*su) * (this.maxValue-this.minValue) + this.minValue
    }
    capValue() {
        if (this.value < this.minValue) {
            this.value = this.minValue
        }
        if (this.value > this.maxValue) {
            this.value = this.maxValue
        }
    }
    draw(ctx) {
        super.draw(ctx)
        this.bound *= su
        ui.img(ctx, this.x-this.width/2+this.bound + (this.width-this.bound*2) * ((this.value-this.minValue)/(this.maxValue-this.minValue)), this.y, this.handleWidth, this.handleHeight, this.handleImg, this.handleClip)
        this.bound /= su
    }
}

class Canvas extends Object2D {
    colour = [0, 0, 0, 1]
    ctx
    canvas
    bounds = {minX: 0, minY: 0, maxX: 0, maxY: 0}
    tVis = 0
    vis = 0
    stop = 0
    loff = {x: 0, y: 0}
    order = 0
    constructor(x, y, width, height, colour=[0, 0, 0, 1]) {
        super(x, y, width, height)
        this.colour = colour
        this.canvas = document.createElement("canvas")
        this.canvas.style.position = "absolute"
        this.ctx = this.canvas.getContext("2d")
        this.ctx.off = {x: 0, y: 0}
        document.body.appendChild(this.canvas)
        this.bounds = {minX: 0, minY: 0, maxX: this.width, maxY: this.height}
    }
    clear(doDraw=true) {
        if (this.ctx.off.x < this.bounds.minX) {
            this.ctx.off.x = this.bounds.minX
        }
        if (this.ctx.off.x > this.bounds.maxX - this.width) {
            this.ctx.off.x = this.bounds.maxX - this.width
        }
        if (this.ctx.off.y < this.bounds.minY) {
            this.ctx.off.y = this.bounds.minY
        }
        if (this.ctx.off.y > this.bounds.maxY - this.height) {
            this.ctx.off.y = this.bounds.maxY - this.height
        }
        let alpha = this.ctx.globalAlpha
        this.canvas.style.left = ((this.x-this.width/2) * cScale)+"px"
        this.canvas.style.top = ((this.y-this.height/2) * cScale)+"px"
        this.canvas.width = this.width
        this.canvas.height = this.height
        this.canvas.style.zIndex = this.order
        this.canvas.style.transform = `scale(${cScale})`
        this.ctx.clearRect(0, 0, this.width, this.height)
        this.ctx.globalAlpha = alpha
        if (doDraw) {
            this.draw()
        }
        this.ctx.imageSmoothingEnabled = false
    }
    draw() {
        this.ctx.fillStyle = `rgba(${this.colour[0]},${this.colour[1]},${this.colour[2]},${this.colour[3]})`
        this.ctx.fillRect(0, 0, this.width, this.height)
    }
    off() {
        return {x: this.x-this.width/2+this.ctx.off.x, y: this.y-this.height/2+this.ctx.off.y}
    }
    drawScroll(off=10, force=false) {
    
        let ss = 10*su

        this.stop -= delta
        if (this.stop <= 0 || this.tVis-this.vis >= 0) {
            this.vis += (this.tVis-this.vis)*delta*10
        }
        
        this.tVis = 0
        if (this.hasPoint(mouse.x, mouse.y) && mouse.x-this.x > this.width/2-ss*2-off && mouse.y-this.y+this.height/2 > ss && mouse.y-this.y+this.height/2 < this.height-ss*2) {
            this.tVis = 0.9
            this.stop = 0.5
            if (mouse.ldown) {
                this.ctx.off.y = (mouse.y-this.y+this.height/2-ss) / (this.height-ss*2) * this.bounds.minY
            }
        }

        if (this.loff.y != this.ctx.off.y) {
            this.tVis = 0.9
            this.stop = 0.5
        }
        if (force) {
            this.vis = 0.9
        }

        this.loff.y = this.ctx.off.y

        this.ctx.fillStyle = `rgba(${150},${150},${150},${this.vis})`
        this.ctx.fillRect(this.width-ss-off, ss, ss, this.height-ss*2)

        this.ctx.fillStyle = `rgba(${200},${200},${200},${this.vis})`
        this.ctx.arc(this.width-ss/2-off, Math.abs(this.ctx.off.y)/Math.abs(this.bounds.minY) * (this.height-ss*2) + ss, 7.5*su, 0, Math.PI*2)
        this.ctx.fill()
    }
    drawBorder(size, colour) {
        this.ctx.strokeStyle = `rgba(${colour[0]},${colour[1]},${colour[2]},${colour[3]})`
        this.ctx.lineWidth = size
        this.ctx.strokeRect(0, 0, this.width, this.height)
    }
    delete() {
        document.body.removeChilld(this.canvas)
        this.canvas = null
        this.ctx = null
    }
}

class SideButton extends Button {
    offX = 0
    offXT = 0
    offV = 0
    invert = false
    customHover = -1
    constructor(text) {
        super(0, 0, 0, 0, "rect", text, 0)
    }
    click() {
        this.offX = this.offXT
        this.offV = this.customHover != -1 ? -this.customHover*10*delta*120 : -this.width*0.01*delta*120
    } 
    basic(canvas="none") {
        if (this.offV >= 0) {
            this.offX += (this.offXT - this.offX) * delta * 10
        }

        this.offX += this.offV

        if (this.offV < 0) {
            this.offV += this.customHover != -1 ? this.customHover*10*delta : this.width*0.01*delta
            // if (this.offX > this.offXT) {
            //     this.offX = this.offXT
            //     this.offV = 0
            // }
        } else {
            this.offV = 0
        }
        
        if (this.hovered(canvas)) {
            document.body.style.cursor = "pointer"
            this.offXT = this.customHover != -1 ? this.customHover : this.width*0.1
        } else if (this.offV >= 0) {
            this.offXT = 0
        }
    }
    reset() {
        this.offX = 0
        this.offV = 0
        this.offXT = 0
    }
    draw(ctx) {
        let a = 1 - Math.abs(this.offX - this.width*0.1) / (this.width*0.2)

        let oldAlpha = ctx.globalAlpha
        if (this.offV < 0) {
            ctx.globalAlpha *= a > 0 ? a : 0
        }
        
        if (this.invert) {
            this.offX *= -1
            this.textO.align = "right"
        } else {
            this.textO.align = "left"
        }

        if (this.invert) {
            this.bg.x = this.x+this.height/2 + this.offX/2
            this.bg.width = this.width-this.height - this.offX
        } else {
            this.bg.x = this.x-this.height/2 + this.offX/2
            this.bg.width = this.width-this.height + this.offX
            
        }
        this.bg.y = this.y
        this.bg.height = this.height
        if (this.invert) {
            this.textO.x = this.x + this.width/2 - this.textSize/2 + this.offX
        } else {
            this.textO.x = this.x - this.width/2 + this.textSize/2 + this.offX
        }
        
        this.textO.y = this.y
        this.textO.size = this.textSize
        this.textO.text = this.text

        this.bg.colour = this.bgColour

        this.bg.draw(ctx)
        ctx.beginPath()
        if (this.invert) {
            ctx.moveTo(this.x-this.width/2+this.height+0.25 + this.offX, this.y-this.height/2)
            ctx.lineTo(this.x-this.width/2 + this.offX, this.y-this.height/2)
            ctx.lineTo(this.x-this.width/2+this.height+0.25 + this.offX, this.y+this.height/2)
        } else {
            ctx.moveTo(this.x+this.width/2-this.height-0.25 + this.offX, this.y-this.height/2)
            ctx.lineTo(this.x+this.width/2 + this.offX, this.y-this.height/2)
            ctx.lineTo(this.x+this.width/2-this.height-0.25 + this.offX, this.y+this.height/2)
        }
        ctx.fill()

        this.textO.draw(ctx)

        ctx.globalAlpha = oldAlpha

        if (this.invert) {
            this.offX *= -1
        }
    }
}