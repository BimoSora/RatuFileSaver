module.exports.bothelp = `Hello, we are a Filesaver bot. We will continue to update our bot.`;

module.exports.botsrc = `You can install it yourself, make sure the steps are followed correctly.`;

module.exports.botcommand = `<b>Here are some admin commands and usage.</b>

~ How users ban, unban and kick from bots and groups.
<b>/ban</b> userID caption if any.
<b>/banchat</b> userID (private).
<b>/unban</b> userID.
<b>/unbanchat</b> userID (private).
<b>/kick</b> userID.
<b>Get UserID from log channel.</b>

~ How to use pin and unpin in groups.
<b>/pin</b> reply to the message you want to pin.
<b>/unpin</b> reply to the message you want to unpin.

~ How to send a message to a user from a group.
<b>/send</b> messages. send messages in groups.

<b>How to delete files from bot.</b>
You can delete files 4 ways.
  Delete individual files with file_id.
  Delete group files with mediaId.
  Delete all files Send by user.
  Delete all files Send to bot.

~ Delete individual files with file_id.
<b>/rem</b> file_id. It will delete files one by one as you pass file_id, get file_id from log channel.

~ Delete group files with mediaId.
<b>/remgrp</b> mediaId. This will delete the media in the group, get the mediaId from the log channel.

~ Delete all files Send by user.
<b>/remall</b> userID. You can delete all files sent by a specific user if the user sends abusive content or spam, get the userid from the log channel.

~ Delete all files Send to bot.
<b>/clear</b>. This will permanently delete all files sent to the bot.

<b>Send messages to users</b>
<b>/broadcast</b>. You can broadcast text messages to your users, messages will be sent from the last joined user to the first joined user to reduce spam. Try not to send too many messages at once if you have a large number of users.

<b>How to find out the total number of bot users</b>
<b>/stats</b>. You will get total users started your bot, real time data will be updated after successful broadcast.
`;
