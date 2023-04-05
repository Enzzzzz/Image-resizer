const path = require('path')
const { app, BrowserWindow } = require('electron')


const isWin = process.platform === 'win32'

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'Yulbot Resizer',
        width: 400,
        height: 700
    })

    mainWindow.loadFile(path.join(__dirname, './render/index.html'));
}

app.whenReady().then(() => {
    createMainWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (!isWin) {
        app.quit()
    }
})