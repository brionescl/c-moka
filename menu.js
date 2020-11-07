const { app } = require('electron')
const isMac = process.platform === 'darwin'
const isProduction = process.env.NODE_ENV === 'production'

module.exports = function(params) {
    return {
        mainMenu: [
            // { role: 'appMenu' }
            ...(isMac ? [{
                label: app.name,
                submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideothers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
                ]
            }] : []),
            // { role: 'fileMenu' }
            {
                label: 'File',
                submenu: [
                    {
                        label: 'Summary',
                        accelerator: "CommandOrControl+S",
                        click() {
                            params.openMainWindow()
                        }
                    },
                    isMac ? { role: 'close' } : { role: 'quit' }
                ]
            },
            // { role: 'editMenu' }
            {
                label: 'Edit',
                submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                ...(isMac ? [
                    { role: 'pasteAndMatchStyle' },
                    { role: 'delete' },
                    { role: 'selectAll' },
                    { type: 'separator' },
                    {
                    label: 'Speech',
                    submenu: [
                        { role: 'startspeaking' },
                        { role: 'stopspeaking' }
                    ]
                    }
                ] : [
                    { role: 'delete' },
                    { type: 'separator' },
                    { role: 'selectAll' }
                ])
                ]
            },
            // { role: 'viewMenu' }
            {
                label: 'View',
                submenu: [
                ...(!isProduction ? [
                    { role: 'reload' },
                    { role: 'forcereload' },
                    { role: 'toggledevtools' }
                ] : [
                    {}
                ]),
                { type: 'separator' },
                { role: 'resetzoom' },
                { role: 'zoomin' },
                { role: 'zoomout' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
                ]
            },
            // { role: 'windowMenu' }
            {
                label: 'Window',
                submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                ...(isMac ? [
                    { type: 'separator' },
                    { role: 'front' },
                    { type: 'separator' },
                    { role: 'window' }
                ] : [
                    { role: 'close' }
                ])
                ]
            },
            {
                role: 'help',
                submenu: [
                {
                    label: 'Learn More',
                    click: async () => {
                        const { shell } = require('electron')
                        await shell.openExternal('https://electronjs.org')
                    }
                }
                ]
            }
        ],
        trayMenu: [
            {
                label: 'Summary',
                click() {
                    params.openMainWindow()
                }
            },
            { type: 'separator' },
            {
                label: 'Reminder in 45 minutes',
                type: 'radio',
                checked: (params.reminderIn == 45 ? true : false),
                click() {
                    params.setReminder(45)
                }
            },
            {
                label: 'Reminder in 1 hour',
                type: 'radio',
                checked: (params.reminderIn == 60 ? true : false),
                click() {
                    params.setReminder(60)
                }
            },
            { type: 'separator' },
            ...(!isMac ? [{ role: 'close' }] : [{ role: 'quit' }])
        ]
    }
}