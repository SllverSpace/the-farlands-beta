
function htpTick() {
    let w = canvas.height*(2286/1283)
    if (w < canvas.width) {
        w = canvas.width
    }
    ctx.globalAlpha = 1
    ui.img(canvas.width/2, canvas.height/2, w, canvas.height, bgImg)
    ctx.globalAlpha = 1-overlayA
    ui.text(canvas.width/2, 40*su, 40*su, "How to Play", {align: "center"})

    ui.text(canvas.width/2-300*su, 150*su, 30*su, "Controls", {align: "center"})
    ui.text(canvas.width/2-300*su, 190*su, 20*su, "WASD - Move \nSpace - Jump \nDouble tap W - Sprint \nShift - Crouch \nLeft Click - Build \nRight Click - Break \nG - Go back to spawn \nJ, K, L and ; - Switch player texture \nP - Toggle third person mode \n0-9 Switch held item \nI/ESC - Open/Close Inventory \nShift when crafting - Auto place result into inventory \nAlt when crafting - Craft max amount of recipe", {align: "center"})

    ui.text(canvas.width/2+300*su, 150*su, 30*su, "Info", {align: "center"})
    ui.text(canvas.width/2+300*su, 190*su, 20*su, "The farlands is a Indie game made by Silver. It's a game mainly focused around building things, although later more survival features will be added.", {align: "center", wrap: 400*su})

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