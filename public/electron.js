const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const dialog = electron.dialog;
const path = require('path');
const isDev = require('electron-is-dev');

const ipcMain = require('electron').ipcMain;

ipcMain.on('adjust-window-dimensions-auto', (event) => {
  console.log("AUTO!!!")
  let browserWindow = BrowserWindow.fromWebContents(event.sender)
  let mainDisplaySize = electron.screen.getPrimaryDisplay().size

  let maxSize = browserWindow.getMaximumSize()
  
  let targetWidth = 1240
  let targetHeight = 800

  console.log("Screen W=" + mainDisplaySize.width + " | H=" + mainDisplaySize.height)
  console.log("MaxSize W=" + maxSize[0] + " | H=" + maxSize[1])

  if(mainDisplaySize.width < 1000) {
    console.log("mainDisplaySize is minor than 1000px")

    if(maxSize[0] < 1000) {
      console.log("max Size is minor than 1000px")
      targetWidth = maxSize[0]
    } else {
      console.log("adjusting max size to screen limit")
      targetWidth = mainDisplaySize.width
    }
  } else {
    console.log("Taking 90% of screen")
    targetWidth = mainDisplaySize.width * 0.9
    console.log("Res = " + targetWidth)

    if(maxSize[0] < targetWidth) {
      console.log("maxSize is minor than 90%, adjusting")
      targetWidth = maxSize[0]
    }
  }

  if(mainDisplaySize.height < 1000) {
    if(maxSize[1] < 1000) {
      targetHeight = maxSize[1]
    } else {
      targetHeight = mainDisplaySize.height
    }
  } else {
    targetHeight = mainDisplaySize.height * 0.9

    if(maxSize[1] < targetHeight) {
      targetHeight = maxSize[1]
    }
  }

  browserWindow.setSize(targetWidth, targetHeight)
  browserWindow.center()
})

ipcMain.on('adjust-window-dimensions-max-size-screen', (event) => {
  let browserWindow = BrowserWindow.fromWebContents(event.sender)
  let mainDisplaySize = electron.screen.getPrimaryDisplay().size
  browserWindow?.setMaximumSize(mainDisplaySize.width, mainDisplaySize.height)
})

ipcMain.on('adjust-window-dimensions-size', (event, width, height) => {
  let browserWindow = BrowserWindow.fromWebContents(event.sender)
  browserWindow?.setSize(width, height)
  browserWindow.center()
})

ipcMain.on('adjust-window-dimensions-max-size', (event, width, height) => {
  let browserWindow = BrowserWindow.fromWebContents(event.sender)
  browserWindow?.setMaximumSize(width, height)
})

ipcMain.on('adjust-window-dimensions-min-size', (event, width, height) => {
  let browserWindow = BrowserWindow.fromWebContents(event.sender)
  browserWindow?.setMinimumSize(width, height)
})

ipcMain.on('adjust-window-resizable', (event, resizable) => {
  let browserWindow = BrowserWindow.fromWebContents(event.sender)
  browserWindow?.setResizable(resizable)
})

ipcMain.on('adjust-window-title', (event, title) => {
  let browserWindow = BrowserWindow.fromWebContents(event.sender)
  browserWindow?.setTitle(title)
})

ipcMain.on('open-file-dialog', (event, filters) => {
  let browserWindow = BrowserWindow.fromWebContents(event.sender)

  dialog.showOpenDialog(
      browserWindow,
      {
          properties: ["openFile"],
          title: "Selecciona la configuración",
          filters
      }
  ).then((result) => {
      browserWindow.webContents.send("open-file-dialog-result", result)
  })
})

ipcMain.on('open-folder-dialog', (event) => {
  let browserWindow = BrowserWindow.fromWebContents(event.sender)

  dialog.showOpenDialog(
      browserWindow,
      {
          properties: ["openDirectory"],
          title: "Abrir carpeta..."
      }
  ).then((result) => {
      browserWindow.webContents.send("open-file-dialog-result", result)
  })
})

ipcMain.on('save-file-dialog', (event, filters) => {
  let browserWindow = BrowserWindow.fromWebContents(event.sender)

  dialog.showSaveDialog(
      browserWindow,
      {
          title: "Exportar configuración",
          filters
      }
  ).then((result) => {
      browserWindow.webContents.send("save-file-dialog-result", result)
  })
})

let maximizeTimeOut = undefined

ipcMain.on('retrieve-window-dimensions', (event, filters) => {
  let browserWindow = BrowserWindow.fromWebContents(event.sender)
  browserWindow.webContents.send("updated-window-dimensions", browserWindow.getSize())
  browserWindow.removeAllListeners("resized")
  browserWindow.removeAllListeners("will-resize")
  browserWindow.removeAllListeners("maximize")
  browserWindow.removeAllListeners("unmaximize")

  browserWindow.addListener("resized", () => {
    browserWindow.webContents.send("updated-window-dimensions", browserWindow.getSize())
  })
  browserWindow.addListener("will-resize", (event, bounds) => {
    browserWindow.webContents.send("updated-window-dimensions", [bounds.width, bounds.height])
  })
  browserWindow.addListener("maximize", () => {
    if(maximizeTimeOut !== undefined) {
      clearTimeout(maximizeTimeOut)
    }
    console.log("maximize called")
    maximizeTimeOut = setTimeout(() => {
      browserWindow.webContents.send("updated-window-dimensions", [browserWindow.getSize()[0], browserWindow.getSize()[1] - 15])
    }, 1000);
  })
  browserWindow.addListener("unmaximize", () => {
    if(maximizeTimeOut !== undefined) {
      clearTimeout(maximizeTimeOut)
    }
    browserWindow.webContents.send("updated-window-dimensions", browserWindow.getSize())
  })
})

ipcMain.on('close-window', (event) => {
  let browserWindow = BrowserWindow.fromWebContents(event.sender)
  browserWindow?.close()
})


let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow(
    {
      width: 900, 
      height: 680,
      webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          enableremotemodule: true
      },
      frame: false,
      backgroundColor: "#3c434a"
    }
  );
  //mainWindow.setMenuBarVisibility(false)
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  if (isDev) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    //mainWindow.webContents.openDevTools();
  }
  mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', () => {

  if (isDev) {
      installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS])
              .then((name) => console.log(`Added Extension:  ${name}`))
              .catch((err) => console.log('An error occurred: ', err))
              .finally(() => createWindow())
  } else {
    createWindow()
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});