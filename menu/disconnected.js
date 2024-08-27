
var reconnectButton = new ui.Button("rect", "Reconnect")

function disconnectedTick() {
    let w = canvas.height*(2286/1283)
    if (w < canvas.width) {
        w = canvas.width
    }
    ui.img(canvas.width/2, canvas.height/2, w, canvas.height, bgImg)

    ui.text(canvas.width/2, canvas.height/2 - 50*su, 40*su, "Disconnected", "center")

    reconnectButton.x = canvas.width/2
    reconnectButton.y = canvas.height/2
    reconnectButton.width = 200*su
    reconnectButton.height = 50*su
    reconnectButton.textSize = 30*su
    reconnectButton.bgColour = [0, 0, 0, 0.5]
    reconnectButton.hoverMul = 0.95
    
    reconnectButton.basic()
    reconnectButton.draw()

    if (reconnectButton.hovered() && mouse.lclick && overlayT == 0) {
        reconnectButton.click()
        overlayT = 1
        targetScene = "menu"
        connectToServer()
    }

    if (reconnectButton.hovered() && overlayT != 0) {
        document.body.style.cursor = "not-allowed"
    }
}