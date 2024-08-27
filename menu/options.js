
var hrd2 = createSlider(2, 12)
var vrd2 = createSlider(2, 4)
var cls2 = createSlider(1, 5)
var ms2 = createSlider(1, 10)
var fov2 = createSlider(30, 120)
var ct2 = createSlider(1, 10)

var upSkin2 = new ui.Button("img")
upSkin2.img = inventoryImg
upSkin2.clip = [48, 176+16, 16, 16]
var downSkin2 = new ui.Button("img")
downSkin2.img = inventoryImg
downSkin2.clip = [32, 176+16, 16, 16]

var usernameBox2 = new ui.TextBox("Username")
usernameBox2.outlineSize = 5

function optionsTick() {
    let w = canvas.height*(2286/1283)
    if (w < canvas.width) {
        w = canvas.width
    }
    ctx.globalAlpha = 1
    ui.img(canvas.width/2, canvas.height/2, w, canvas.height, bgImg)
    ctx.globalAlpha = 1-overlayA
    ui.text(canvas.width/2, 40*su, 40*su, "Options", {align: "center"})

    ui.text(canvas.width/2-300*su, 150*su, 30*su, "Profile", {align: "center"})

    usernameBox2.set(canvas.width/2-300*su, 190*su, 300*su, 30*su)
    usernameBox2.outlineSize = 7.5*su

    username = usernameBox2.text

    usernameBox2.hover()

    usernameBox2.draw()

    upSkin2.set(canvas.width/2-300*su - 65*su, 260*su, 18*4*su, 18*4*su)

    downSkin2.set(canvas.width/2-300*su - 65*su, 260*su + 18*4*su, 18*4*su, 18*4*su)

    upSkin2.basic()
    downSkin2.basic()

    upSkin2.draw()
    downSkin2.draw()

    ui.img(canvas.width/2-300*su + 18*4/2*su + 125/2*su - 65*su, 295*su, 125*su, 125*su, playerImg, [32+playerT[0]*48, (playerSize2.y-1-playerT[1])*44, 8, 8])

    ui.text(canvas.width/2-300*su, 380*su, 20*su, "Player Skin: "+ playerNames[playerT.join(",")], {align: "center"})

    var order = Object.keys(playerNames)

    if (upSkin2.hovered()) {
        if (mouse.lclick) {
            upSkin2.click()
            let i = order.indexOf(playerT.join(","))
            if (i > 0) {
                i -= 1
            } else {
                i = order.length-1
            }
            playerT = order[i].split(",")
            player.updateTexture(playerT)
        }
        let old = ctx.globalAlpha 
        ctx.globalAlpha = 0.25
        ui.img(upSkin2.x, upSkin2.y, upSkin2.visWidth, upSkin2.visHeight, inventoryImg, [192, 176, 16, 16])
        ctx.globalAlpha = old
    }

    if (downSkin2.hovered()) {
        if (mouse.lclick) {
            downSkin2.click()
            let i = order.indexOf(playerT.join(","))
            if (i < order.length-1) {
                i += 1
            } else {
                i = 0
            }
            playerT = order[i].split(",")
            player.updateTexture(playerT)
        }
        let old = ctx.globalAlpha 
        ctx.globalAlpha = 0.25
        ui.img(downSkin2.x, downSkin2.y, downSkin2.visWidth, downSkin2.visHeight, inventoryImg, [192, 176, 16, 16])
        ctx.globalAlpha = old
    }

    ui.text(canvas.width/2+300*su, 150*su, 30*su, "Game", {align: "center"})

    ui.text(canvas.width/2+300*su, 190*su, 20*su, "Horizontal Render Distance: "+renderSize.x, {align: "center"})
    hrd2.set(canvas.width/2+300*su, 225*su, 32*4*su, 16*4*su)
    hrd2.set2(16*4*su, 16*4*su, 12*su)
    hrd2.value = renderSize.x
    hrd2.draw()
    if (hrd2.hovered()) {
        if (mouse.ldown) {
            hrd2.value = Math.round(hrd2.convert(mouse.x))
            hrd2.capValue()
            renderSize.x = hrd2.value
            renderSize.z = hrd2.value
        }
        highlightSlider(hrd2)
    }

    ui.text(canvas.width/2+300*su, 190*su+75*su, 20*su, "Vertical Render Distance: "+renderSize.y, {align: "center"})
    vrd2.set(canvas.width/2+300*su, 225*su+75*su, 32*4*su, 16*4*su)
    vrd2.set2(16*4*su, 16*4*su, 12*su)
    vrd2.value = renderSize.y
    vrd2.draw()
    if (vrd2.hovered()) {
        if (mouse.ldown) {
            vrd2.value = Math.round(vrd2.convert(mouse.x))
            vrd2.capValue()
            renderSize.y = vrd2.value
        }
        highlightSlider(vrd2)
    }

    ui.text(canvas.width/2+300*su, 190*su+75*2*su, 20*su, "Chunk Load Speed: "+chunkLoadSpeed, {align: "center"})
    cls2.set(canvas.width/2+300*su, 225*su+75*2*su, 32*4*su, 16*4*su)
    cls2.set2(16*4*su, 16*4*su, 12*su)
    cls2.value = chunkLoadSpeed
    cls2.draw()
    if (cls2.hovered()) {
        if (mouse.ldown) {
            cls2.value = Math.round(cls2.convert(mouse.x))
            cls2.capValue()
            chunkLoadSpeed = cls2.value
        }
        highlightSlider(cls2)
    }

    ui.text(canvas.width/2+300*su, 190*su+75*3*su, 20*su, "Mouse Sensitivity: "+Math.round(sensitivity*1000), {align: "center"})
    ms2.set(canvas.width/2+300*su, 225*su+75*3*su, 32*4*su, 16*4*su)
    ms2.set2(16*4*su, 16*4*su, 12*su)
    ms2.value = Math.round(sensitivity*1000)
    ms2.draw()
    if (ms2.hovered()) {
        if (mouse.ldown) {
            ms2.value = Math.round(ms2.convert(mouse.x))
            ms2.capValue()
            sensitivity = ms2.value/1000
        }
        highlightSlider(ms2)
    }

    ui.text(canvas.width/2+300*su, 190*su+75*4*su, 20*su, "FOV: "+dFov, {align: "center"})
    fov2.set(canvas.width/2+300*su, 225*su+75*4*su, 32*4*su, 16*4*su)
    fov2.set2(16*4*su, 16*4*su, 12*su)
    fov2.value = dFov
    fov2.draw()
    if (fov2.hovered()) {
        if (mouse.ldown) {
            fov2.value = Math.round(fov2.convert(mouse.x))
            fov2.capValue()
            dFov = fov2.value
        }
        highlightSlider(fov2)
    }

    ui.text(canvas.width/2+300*su, 190*su+75*5*su, 20*su, "Camera Tilt: "+Math.round(ct2.value), {align: "center"})
    ct2.set(canvas.width/2+300*su, 225*su+75*5*su, 32*4*su, 16*4*su)
    ct2.set2(16*4*su, 16*4*su, 12*su)
    ct2.value = (cameraTilt+0.5) * (10/5.5)
    ct2.draw()
    if (ct2.hovered()) {
        if (mouse.ldown) {
            ct2.value = Math.round(ct2.convert(mouse.x))
            ct2.capValue()
            cameraTilt = ct2.value/10 * 5.5 - 0.5
        }
        highlightSlider(ct2)
    }

    backButton.basic()
    backButton.draw()

    if (backButton.hovered() && mouse.lclick && overlayT == 0) {
        backButton.click()
        overlayT = 1
        targetScene = "menu"
    }

    if (backButton.hovered() && overlayT != 0) {
        document.body.style.cursor = "not-allowed"
    }
}