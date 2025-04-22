const { cmd } = require('../command');
const config = require('../config');

cmd({
    on: 'group-participants'
}, async (conn, mek, m, { from, isGroup, isBotAdmins }) => {
    try {
        if (!isGroup || !isBotAdmins || config.WELCOME !== "true") return;

        const action = mek.action;
        const participants = mek.participants || [mek.participant];
        const metadata = await conn.groupMetadata(from);
        
        // Get Karachi time (UTC+5)
        const now = new Date();
        const karachiOffset = 5 * 60 * 60 * 1000; // PKT is UTC+5
        const karachiTime = new Date(now.getTime() + karachiOffset);
        
        const time = karachiTime.toLocaleTimeString('en-US', { 
            hour12: true, 
            hour: 'numeric', 
            minute: '2-digit', 
            second: '2-digit' 
        });
        
        const date = karachiTime.toLocaleDateString('en-GB');

        for (const jid of participants) {
            if (!jid) continue;
            
            const username = jid.split('@')[0];
            let msg = '';

            if (action === 'add' || action === 'invite') {
                msg = `╭─「 🎊 WELCOME 」\n` +
                      `│\n` +
                      `│ ➤ User: @${username}\n` +
                      `│ ➤ Group: ${metadata.subject}\n` +
                      `│ ➤ Members: ${metadata.size}\n` +
                      `│ ➤ Time: ${time} (PKT)\n` +
                      `│ ➤ Date: ${date}\n` +
                      `╰─────────────────`;
            } 
            else if (action === 'remove' || action === 'leave') {
                msg = `╭─「 👋 GOODBYE 」\n` +
                      `│\n` +
                      `│ ➤ User: @${username}\n` +
                      `│ ➤ Group: ${metadata.subject}\n` +
                      `│ ➤ Members: ${metadata.size}\n` +
                      `│ ➤ Time: ${time} (PKT)\n` +
                      `│ ➤ Date: ${date}\n` +
                      `╰─────────────────`;
            }

            await conn.sendMessage(from, { 
                text: msg, 
                mentions: [jid] 
            });
        }
    } catch (error) {
        console.error('Group participants handler error:', error);
    }
});
