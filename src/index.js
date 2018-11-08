import { app, BrowserWindow } from 'electron'

if (require('electron-squirrel-startup')) {
  app.quit()
}

let mainWindow
const createWindow = () => {
  mainWindow = new BrowserWindow({
    title: 'Abejas: el juego',
    backgroundColor: '#ffc107',
    fullscreen: true,
    // width: 1024,
    // height: 600,
    webPreferences: {
      devTools: false
    }
  })

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin') {
    app.quit()
  // }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
