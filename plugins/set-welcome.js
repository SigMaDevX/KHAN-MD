const { cmd } = require('../command')
const config = require('../config')

cmd({
    on: 'group-participants'
}, async (conn, mek, m, { from, isGroup, isBotAdmins }) => {
    try {
        // Debug log to verify handler is triggered
        console.log('Group participants event detected:', mek.action)
        
        if (!isGroup || !isBotAdmins || config.WELCOME !== "true") {
            console.log('Conditions not met - exiting')
            return
        }

        const action = mek.action
        const participants = mek.participants || [mek.participant]
        const metadata = await conn.groupMetadata(from)
        
        // Get PKT time (UTC+5)
        const now = new Date()
        const pktTime = new Date(now.getTime() + (5 * 60 * 60 * 1000))
        const time = pktTime.toLocaleTimeString('en-US', { 
            hour12: true, 
            timeZone: 'UTC' 
        })
        const date = pktTime.toLocaleDateString('en-GB', { 
            timeZone: 'UTC' 
        })

        for (const jid of participants) {
            if (!jid) continue
            
            const username = jid.split('@')[0]
            let msg = ''

            if (action === 'add' || action === 'invite') {
                msg = `╭─「 🎊 WELCOME 」\n` +
                      `│\n` +
                      `│ ➤ User: @${username}\n` +
                      `│ ➤ Group: ${metadata.subject}\n` +
                      `│ ➤ Members: ${metadata.size}\n` +
                      `│ ➤ Time: ${time} (PKT)\n` +
                      `│ ➤ Date: ${date}\n` +
                      `╰─────────────────`
            } 
            else if (action === 'remove' || action === 'leave') {
                msg = `╭─「 👋 GOODBYE 」\n` +
                      `│\n` +
                      `│ ➤ User: @${username}\n` +
                      `│ ➤ Group: ${metadata.subject}\n` +
                      `│ ➤ Members: ${metadata.size}\n` +
                      `│ ➤ Time: ${time} (PKT)\n` +
                      `│ ➤ Date: ${date}\n` +
                      `╰─────────────────`
            }

            await conn.sendMessage(from, { 
                text: msg, 
                mentions: [jid] 
            }).catch(e => console.error('Send message error:', e))
        }
    } catch (error) {
        console.error('Handler error:', error)
    }
})
