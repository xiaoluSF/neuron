import { app, Menu } from 'electron'
import 'reflect-metadata'

import initApp from './utils/initApp'
import createWindow from './utils/createWindow'
import i18n from './i18n'
import mainmenu from './menu'

let mainWindow: Electron.BrowserWindow | null

initApp()

const openWindow = () => {
  i18n.changeLanguage(app.getLocale())
  Menu.setApplicationMenu(mainmenu())
  if (!mainWindow) {
    mainWindow = createWindow()
    mainWindow.on('closed', () => {
      if (mainWindow) {
        mainWindow = null
      }
    })
  }
}

app.on('ready', openWindow)

app.on('activate', openWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
