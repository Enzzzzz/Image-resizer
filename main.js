const path = require('path')
const { app, BrowserWindow, Menu } = require('electron')


const isWin = process.platform === 'win32'

//CREATE MAIN WINDOW
function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'Yulbot Resizer',
        width: 400,
        height: 700
    })

    mainWindow.loadFile(path.join(__dirname, './render/index.html'));
}

// NEW WINDOW
function createNewWindow() {
    const newWindow = new BrowserWindow({
        title: 'Yulbot About',
        width: 300,
        height: 400
    })

    newWindow.loadFile(path.join(__dirname, './render/about.html'));
}

//APP READY
app.whenReady().then(() => {
    createMainWindow()

    // MENU
    const mainMenu = Menu.buildFromTemplate(menu)
    Menu.setApplicationMenu(mainMenu)


    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow()
        }
    })
})

// MENU
const menu = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Quit',
                click: () => app.quit(),
                accelerator: 'Ctrl+W'
            }
        ]
    },
    {
        label: 'About',
        click: createNewWindow
    }
]

app.on('window-all-closed', () => {
    if (!isWin) {
        app.quit()
    }
})