const path = require('path')
const os = require('os')
const fs = require('fs')
const resizeImg = require('resize-img')
const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron')

const isDev = process.env.NODE_ENV !== 'production';
const isWin = process.platform === 'win32'

let mainWindow

//CREATE MAIN WINDOW
function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: 'Yulbot Resizer',
        width: 400,
        height: 700,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, './render/js/preload.js')
        }
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

    //REMOVE MAINWINDOW ON CLOSE
    mainWindow.on('closed', () => (mainWindow = null))


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

//RESPOND  IPCRENDER
ipcMain.on('image:resize', (e, options) => {
    options.dest = path.join(os.homedir(), 'YulbotResizer')
    resizeImage(options)
})

//RESIZE FUNCTION

async function resizeImage({ imgPath, width, height, dest }) {
    try {
        const newPath = await resizeImg(fs.readFileSync(imgPath), {
            width: +width,
            height: +height
        })
        //filename
        const filename = path.basename(imgPath)

        //folder
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest)
        }
        //create new file
        fs.writeFileSync(path.join(dest, filename), newPath)

        //success msg
        mainWindow.webContents.send('image:done')

        //open dest folder
        shell.openPath(dest)

    } catch (error) {
        console.log(error)
        
    }
}

app.on('window-all-closed', () => {
    if (!isWin) {
        app.quit()
    }
})