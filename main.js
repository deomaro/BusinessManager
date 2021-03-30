const { app, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    frame:false,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation:false,
      enableRemoteModule:true,
    }
  })

  win.loadFile('index.html'); //for production
  // Open the DevTools.
  win.webContents.openDevTools()
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
