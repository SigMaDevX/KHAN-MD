const { cmd } = require('../command')
const config = require('../config')

cmd({
    on: 'group-participants'
}, async (conn, mek, m, { from, isGroup, isBotAdmins, groupMetadata }) => {
    try {
        if (!isGroup || !isBotAdmins || config.WELCOME !== "true") return;

        const action = mek.update?.action
        const participants = mek.update?.participants || []
        
        const now = new Date()
        const pktTime = new Date(now.getTime() + (5 * 60 * 60 * 1000)) // PKT = UTC+5
        const time = pktTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        const date = pktTime.toLocaleDateString('en-GB')

        for (const jid of participants) {
            const username = jid.split('@')[0]
            let msg = ''

            if (action === 'add') {
                msg = `╭─「 🎊 WELCOME 」\n` +
                      `│\n` +
                      `│ ➤ User: @${username}\n` +
                      `│ ➤ Group: ${groupMetadata.subject}\n` +
                      `│ ➤ Members: ${groupMetadata.size}\n` +
                      `│ ➤ Time: ${time} (PKT)\n` +
                      `│ ➤ Date: ${date}\n` +
                      `╰─────────────────`
            } 
            else if (action === 'remove') {
                msg = `╭─「 👋 GOODBYE 」\n` +
                      `│\n` +
                      `│ ➤ User: @${username}\n` +
                      `│ ➤ Group: ${groupMetadata.subject}\n` +
                      `│ ➤ Members: ${groupMetadata.size}\n` +
                      `│ ➤ Time: ${time} (PKT)\n` +
                      `│ ➤ Date: ${date}\n` +
                      `╰─────────────────`
            }

            await conn.sendMessage(from, { 
                text: msg, 
                mentions: [jid] 
            }).catch(console.error)
        }
    } catch (error) {
        console.error('Welcome handler error:', error)
    }
})
