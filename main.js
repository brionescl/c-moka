const {
    app,
    BrowserWindow,
    Menu,
    Tray,
    Notification,
    ipcMain
} = require('electron')

let reminderIn = 45 // minutes
let tray = null
let mainWindow = null
let cupsOfCoffee = 0
let minutesTraveled = 0;

app.setName('Coffee Time')

function openMainWindow() {
    if (mainWindow !== null) {
        mainWindow.show()
        return
    }

    mainWindow = new BrowserWindow({
        width: 350,
        height: 250,
        webPreferences: {
          nodeIntegration: true
        },
        icon: './assets/images/window.png',
        title: app.name,
        show: false
    })

    mainWindow.loadFile('./views/main.html')
    // mainWindow.webContents.openDevTools()

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('set-app-name', app.name)
        mainWindow.webContents.send('set-minutes-left', getMinutesLeft())
        mainWindow.webContents.send('set-cups-of-coffee', cupsOfCoffee)
        mainWindow.show();
    })

    mainWindow.on('closed', () => {
        mainWindow = null;
    })
}

function setReminder(minutes) {
    reminderIn = minutes
    minutesTraveled = 0
    mainWindow.webContents.send('set-minutes-left', getMinutesLeft())
}

function setApplicationMenu() {
    const {
      mainMenu,
      trayMenu
    } = require('./menu')({
        'openMainWindow': openMainWindow,
        'setReminder': setReminder,
        'reminderIn': reminderIn
    })

    tray = new Tray('./assets/images/icon.png')
    tray.setToolTip(app.getName())
    tray.setContextMenu(Menu.buildFromTemplate(trayMenu))

    Menu.setApplicationMenu(Menu.buildFromTemplate(mainMenu))
}

function showNotification() {
    if (!Notification.isSupported()) {
        return
    }

    const notification = new Notification({
        title: app.name,
        body: 'Keep calm and make coffee!'
    })

    notification.show()

    notification.on('click', (event, arg) => {
        openMainWindow()
    })
}

function runReminder() {
    minutesTraveled++;
    const minutesLeft = getMinutesLeft();

    if (mainWindow !== null) {
        mainWindow.webContents.send('set-minutes-left', minutesLeft)
    }

    if (minutesLeft == 0) {
        minutesTraveled = 0
        showNotification()
    }
}

function getMinutesLeft() {
    return (reminderIn - minutesTraveled)
}

app.whenReady().then(() => {
    setApplicationMenu()

    setInterval(() => {
        runReminder()
    }, 60000)
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

ipcMain.on('add-coffee', (event) => {
    cupsOfCoffee++
    mainWindow.webContents.send('set-cups-of-coffee', cupsOfCoffee)
});
