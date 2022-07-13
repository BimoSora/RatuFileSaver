require('dotenv').config();
const { Telegraf } = require('telegraf');
const crypto = require('crypto');
const bot = new Telegraf(process.env.TOKEN);

process.env.TZ = "Asia/Jakarta";

//database
const db = require('./config/connection')
const collection = require('./config/collection')
const saver = require('./database/filesaver')
const helpcommand = require('./help.js');

//DATABASE CONNECTION 
db.connect((err) => {
    if(err) { console.log('error connection db' + err); }
    else { console.log('db connected'); }
})

//ID Channel/Group
const channelId = `${process.env.CHANNELJOIN}`;

function today(ctx){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();
    return today = mm + '/' + dd + '/' + yyyy + ' ' + hours + ':' + minutes + ':' + seconds;
}

function today2(ctx){
    var today2 = new Date();
    var dd2 = String(today2.getDate()).padStart(2, '0');
    var mm2 = String(today2.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy2 = today2.getFullYear();
    var hours2 = today2.getHours();
    var minutes2 = today2.getMinutes();
    var seconds2 = today2.getSeconds();
    return today2 = mm2 + '/' + dd2 + '/' + yyyy2 + '-' + hours2 + ':' + minutes2 + ':' + seconds2;
}

//Function
function first_name(ctx){
    return `${ctx.from.first_name ? ctx.from.first_name : ""}`;
}
function last_name(ctx){
    return `${ctx.from.last_name ? ctx.from.last_name : ""}`;
}
function username(ctx){
    return ctx.from.username ? `@${ctx.from.username}` : "";
}
function fromid(ctx){
    return ctx.from.id ? `[${ctx.from.id}]` : "";
}
function welcomejoin(ctx){
    return `${process.env.WELCOMEJOINBOT}\n\n${today(ctx)}`;
}
function messagewelcome(ctx){
    return `${process.env.MESSAGEWELCOMEBOT}\n\n${today(ctx)}`;
}
function messagebanned(ctx){
    return `⚠ YOU ARE BLOCKED FOR ABUSE OF A BOTT, CALL THE ADMIN FOR APPEAL.`;
}
function messagebotnoaddgroup(ctx){
    return `The bot has not entered the owner's channel/group.`;
}
function messagelink(ctx){
    return `Send bot videos, photos and documents.`;
}
function documentation(ctx){
    var mykey = crypto.createDecipher('aes-128-cbc', 'mypassword');
    var mystr = mykey.update('d59f19294f388d2ee23e350f913a84ba7abf661a3d2f09062ce5e927f0d644429d835186bec83190988e6941287f8ddce229e2f98ad520d6014ae1f21ffd4d71', 'hex', 'utf8')
    mystr += mykey.final('utf8');
    return `The bot was created using \n<b>Program:</b> Node JS \n<b>API:</b> <a href='https://telegraf.js.org/'>Telegraph</a> \n\n~ ${mystr} ~`;
}
const url2 = process.env.LINKCHANNEL.split(/[\,-]+/);
const url3 = url2[0];
const url4 = url2[1];

// inline keyboard
const inKey = [
    [{text:'📎 LINK',callback_data:'POP'}],
    [{text:'📚 DOCUMENTATION',callback_data:'DOC'},{text:'🆘 HELP',callback_data:'HELP'}],
    [{text:'💿 SOURCE CODE',callback_data:'SRC'}],
    [{text: `${url3}`, url: `${url4}`}]
];

const inKey2 = [
    [{text:'📚 DOCUMENTATION',callback_data:'DOC'},{text:'🆘 HELP',callback_data:'HELP'}],
    [{text:'💿 SOURCE CODE',callback_data:'SRC'}],
    [{text: `${url3}`, url: `${url4}`}]
];

bot.catch(e => console.error(e))

//BOT START
bot.start(async(ctx)=>{
    if(ctx.chat.type == 'private') {
        const msg = ctx.message.text;
        let msgArray = msg.split(' ')
        //console.log(msgArray.length);
        let length = msgArray.length
        msgArray.shift()
        let query = msgArray.join(' ')
    
        const user = {
            first_name:ctx.from.first_name,
            userId:ctx.from.id
        }

        let str = process.env.ADMIN;
        let result = str.includes(ctx.from.id);

        var payload = ctx.startPayload;
        if(payload == "welcome"){
            if(result == true){
                await ctx.deleteMessage(ctx.message.message_id)
                const profile = await bot.telegram.getUserProfilePhotos(ctx.from.id)
                if(!profile || profile.total_count == 0)
                    return await ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,{
                        parse_mode:'HTML',
                        disable_web_page_preview: true,
                        reply_markup:{
                            inline_keyboard:inKey
                        }
                    })
                    await ctx.replyWithPhoto(profile.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,
                        parse_mode:'HTML',
                        disable_web_page_preview: true,
                        reply_markup:{
                            inline_keyboard:inKey
                        }
                    })
            }else{
                var botStatus = await bot.telegram.getChatMember(channelId, ctx.botInfo.id)
                var member = await bot.telegram.getChatMember(channelId, ctx.from.id)
                //console.log(member);
                if(member.status == 'restricted' || member.status == 'left' || member.status == 'kicked'){
                    const profile2 = await bot.telegram.getUserProfilePhotos(ctx.from.id)
                    await saver.checkBan(`${ctx.from.id}`).then(async res => {
                        //console.log(res);
                        if(res == true) {
                            if(ctx.chat.type == 'private') {
                                await ctx.deleteMessage(ctx.message.message_id)
                                await ctx.reply(`${messagebanned(ctx)}`)
                            }
                        }else{
                            ctx.deleteMessage()
                            if(!profile2 || profile2.total_count == 0)
                            return await ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,{
                                parse_mode:'HTML',
                                disable_web_page_preview: true,
                                reply_markup:{
                                    inline_keyboard:[
                                        [{text: `${url3}`, url: `${url4}`}],
                                        [{text: `🔄 Try again`, url: `https://t.me/${process.env.BOTUSERNAME}?start=${query}`}]
                                    ]
                                }
                            })
                            await ctx.replyWithPhoto(profile2.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,
                                parse_mode:'HTML',
                                disable_web_page_preview: true,
                                reply_markup:{
                                    inline_keyboard:[
                                        [{text: `${url3}`, url: `${url4}`}],
                                        [{text: `🔄 Try again`, url: `https://t.me/${process.env.BOTUSERNAME}?start=${query}`}]
                                    ]
                                }
                            })
                        }
                    })
                }else{
                    const profile3 = await bot.telegram.getUserProfilePhotos(ctx.from.id)
                        await saver.checkBan(`${ctx.from.id}`).then(async res => {
                            //console.log(res);
                            if(res == true) {
                                if(ctx.chat.type == 'private') {
                                    await ctx.deleteMessage(ctx.message.message_id)
                                    await ctx.reply(`${messagebanned(ctx)}`)
                                }
                            }else{
                                await ctx.deleteMessage(ctx.message.message_id)
                                if(!profile3 || profile3.total_count == 0)
                                    return await ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,{
                                        parse_mode:'HTML',
                                        disable_web_page_preview: true,
                                        reply_markup:{
                                            inline_keyboard:inKey2
                                        }
                                    })
                                    await ctx.replyWithPhoto(profile3.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,
                                        parse_mode:'HTML',
                                        disable_web_page_preview: true,
                                        reply_markup:{
                                            inline_keyboard:inKey2
                                        }
                                    })
                            }
                        })
                }
            }
        }else{
            if(result == true){
                //welcoming message on /start and ifthere is a query available we can send files
                if(length == 1){
                    await ctx.deleteMessage(ctx.message.message_id)
                    const profile = await bot.telegram.getUserProfilePhotos(ctx.from.id)
                    if(!profile || profile.total_count == 0)
                        return await ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,{
                            parse_mode:'HTML',
                            disable_web_page_preview: true,
                            reply_markup:{
                                inline_keyboard:inKey
                            }
                        })
                        await ctx.replyWithPhoto(profile.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,
                            parse_mode:'HTML',
                            disable_web_page_preview: true,
                            reply_markup:{
                                inline_keyboard:inKey
                            }
                        })
                }else{
                    if(query.indexOf('grp_') > -1){
                        let query1 = query.replace('grp_','');
                        try{
                            const res1 = await saver.getFile1(query1)
                                let mediagroup = [];
                                for (let index = 0; index < res1.length; index++) {
                                const data = res1[index];
                                mediagroup.push({type: data.type, media: data.file_id, caption: data.caption, parse_mode:'HTML'});
                            }

                            await ctx.deleteMessage(ctx.message.message_id)
                            await ctx.telegram.sendMediaGroup(ctx.chat.id, mediagroup);
                        }catch(error){
                            await ctx.reply(`Media not found or has been removed.`)
                        }
                    }else{
                        let query2 = query;
                        try{
                            const res2 = await saver.getFile2(query2)
            
                            if(res2.type=='video'){
                                await ctx.deleteMessage(ctx.message.message_id)
                                if(!res2.caption) {
                                    return await ctx.replyWithVideo(res2.file_id);
                                }
                                await ctx.replyWithVideo(res2.file_id,{caption: `${res2.caption}`,
                                    parse_mode:'HTML'
                                });
                            }else if(res2.type=='photo'){
                                await ctx.deleteMessage(ctx.message.message_id)
                                if(!res2.caption) {
                                    return await ctx.replyWithPhoto(res2.file_id);
                                }
                                await ctx.replyWithPhoto(res2.file_id,{caption: `${res2.caption}`,
                                    parse_mode:'HTML'
                                });
                            }else if(res2.type=='document'){
                                await ctx.deleteMessage(ctx.message.message_id)
                                if(!res2.caption) {
                                    return await ctx.replyWithDocument(res2.file_id);
                                }
                                await ctx.replyWithDocument(res2.file_id,{caption: `${res2.caption}`,
                                    parse_mode:'HTML'
                                })
                            }
                        }catch(error){
                            await ctx.deleteMessage(ctx.message.message_id)
                            await ctx.reply(`Media not found or has been removed.`)
                        }
                    }
                }
            }else{
                try {
                    var botStatus = await bot.telegram.getChatMember(channelId, ctx.botInfo.id)
                    var member = await bot.telegram.getChatMember(channelId, ctx.from.id)
                    //console.log(member);
                    if(member.status == 'restricted' || member.status == 'left' || member.status == 'kicked'){
                        const profile2 = await bot.telegram.getUserProfilePhotos(ctx.from.id)
                        await saver.checkBan(`${ctx.from.id}`).then(async res => {
                            //console.log(res);
                            if(res == true) {
                                if(ctx.chat.type == 'private') {
                                    await ctx.deleteMessage(ctx.message.message_id)
                                    await ctx.reply(`${messagebanned(ctx)}`)
                                }
                            }else{
                                ctx.deleteMessage()
                                if(msg.indexOf('/start A') > -1 || msg.indexOf('/start grp_') > -1){
                                    if(!profile2 || profile2.total_count == 0)
                                    return await ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,{
                                        parse_mode:'HTML',
                                        disable_web_page_preview: true,
                                        reply_markup:{
                                            inline_keyboard:[
                                                [{text: `${url3}`, url: `${url4}`}],
                                                [{text: `🔄 Try again`, url: `https://t.me/${process.env.BOTUSERNAME}?start=${query}`}]
                                            ]
                                        }
                                    })
                                    await ctx.replyWithPhoto(profile2.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,
                                        parse_mode:'HTML',
                                        disable_web_page_preview: true,
                                        reply_markup:{
                                            inline_keyboard:[
                                                [{text: `${url3}`, url: `${url4}`}],
                                                [{text: `🔄 Try again`, url: `https://t.me/${process.env.BOTUSERNAME}?start=${query}`}]
                                            ]
                                        }
                                    })
                                }else{
                                    if(!profile2 || profile2.total_count == 0)
                                    return await ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,{
                                        parse_mode:'HTML',
                                        disable_web_page_preview: true,
                                        reply_markup:{
                                            inline_keyboard:[
                                                [{text: `${url3}`, url: `${url4}`}],
                                                [{text: `🔄 Try again`, url: `https://t.me/${process.env.BOTUSERNAME}?start=${query}`}]
                                            ]
                                        }
                                    })
                                    await ctx.replyWithPhoto(profile2.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,
                                        parse_mode:'HTML',
                                        disable_web_page_preview: true,
                                        reply_markup:{
                                            inline_keyboard:[
                                                [{text: `${url3}`, url: `${url4}`}],
                                                [{text: `🔄 Try again`, url: `https://t.me/${process.env.BOTUSERNAME}?start=${query}`}]
                                            ]
                                        }
                                    })
                                }
                            }
                        })
                    }else{
                        //welcoming message on /start and ifthere is a query available we can send files
                        if(length == 1){
                            const profile3 = await bot.telegram.getUserProfilePhotos(ctx.from.id)
                                await saver.checkBan(`${ctx.from.id}`).then(async res => {
                                    //console.log(res);
                                    if(res == true) {
                                        if(ctx.chat.type == 'private') {
                                            await ctx.deleteMessage(ctx.message.message_id)
                                            await ctx.reply(`${messagebanned(ctx)}`)
                                        }
                                    }else{
                                        await ctx.deleteMessage(ctx.message.message_id)
                                        if(!profile3 || profile3.total_count == 0)
                                            return await ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,{
                                                parse_mode:'HTML',
                                                disable_web_page_preview: true,
                                                reply_markup:{
                                                    inline_keyboard:inKey2
                                                }
                                            })
                                            await ctx.replyWithPhoto(profile3.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,
                                                parse_mode:'HTML',
                                                disable_web_page_preview: true,
                                                reply_markup:{
                                                    inline_keyboard:inKey2
                                                }
                                            })
                                    }
                                })
                            }else{
                                if(query.indexOf('grp_') > -1){
                                    let query1 = query.replace('grp_','');
                                    try{
                                        const res1 = await saver.getFile1(query1)
                                            let mediagroup = [];
                                            for (let index = 0; index < res1.length; index++) {
                                            const data = res1[index];
                                            mediagroup.push({type: data.type, media: data.file_id, caption: data.caption, parse_mode:'HTML'});
                                        }
                        
                                        await saver.checkBan(`${ctx.from.id}`).then(async res => {
                                            //console.log(res);
                                            if(res == true) {
                                                await ctx.deleteMessage(ctx.message.message_id)
                                                if(ctx.chat.type == 'private') {
                                                    await ctx.deleteMessage(ctx.message.message_id)
                                                    await ctx.reply(`${messagebanned(ctx)}`)
                                                }
                                            }else{
                                                await ctx.deleteMessage(ctx.message.message_id)
                                                await ctx.telegram.sendMediaGroup(ctx.chat.id, mediagroup);
                                            }
                                        })
                                    }catch(error){
                                        await saver.checkBan(`${ctx.from.id}`).then(async res => {
                                            //console.log(res);
                                            if(res == true) {
                                                if(ctx.chat.type == 'private') {
                                                    await ctx.deleteMessage(ctx.message.message_id)
                                                    await ctx.reply(`${messagebanned(ctx)}`)
                                                }
                                            }else{
                                                await ctx.reply(`Media not found or has been removed.`)
                                            }
                                        })
                                    }
                                }else{
                                    let query2 = query;
                                    try{
                                        const res2 = await saver.getFile2(query2)
                        
                                        await saver.checkBan(`${ctx.from.id}`).then(async res => {
                                            //console.log(res);
                                            if(res == true) {
                                                if(ctx.chat.type == 'private') {
                                                    await ctx.deleteMessage(ctx.message.message_id)
                                                    await ctx.reply(`${messagebanned(ctx)}`)
                                                }
                                            }else{
                                                if(res2.type=='video'){
                                                    await ctx.deleteMessage(ctx.message.message_id)
                                                    if(!res2.caption) {
                                                        return ctx.replyWithVideo(res2.file_id);
                                                    }
                                                    await ctx.replyWithVideo(res2.file_id,{caption: `${res2.caption}`,
                                                        parse_mode:'HTML'
                                                    });
                                                }else if(res2.type=='photo'){
                                                    await ctx.deleteMessage(ctx.message.message_id)
                                                    if(!res2.caption) {
                                                        return await ctx.replyWithPhoto(res2.file_id);
                                                    }
                                                    await ctx.replyWithPhoto(res2.file_id,{caption: `${res2.caption}`,
                                                        parse_mode:'HTML'
                                                    });
                                                }else if(res2.type=='document'){
                                                    await ctx.deleteMessage(ctx.message.message_id)
                                                    if(!res2.caption) {
                                                        return await ctx.replyWithDocument(res2.file_id);
                                                    }
                                                    await ctx.replyWithDocument(res2.file_id,{caption: `${res2.caption}`,
                                                        parse_mode:'HTML'
                                                    })
                                                }
                                            }
                                        })
                                    }catch(error){
                                        await saver.checkBan(`${ctx.from.id}`).then(async res => {
                                            //console.log(res);
                                            if(res == true) {
                                                if(ctx.chat.type == 'private') {
                                                    await ctx.deleteMessage(ctx.message.message_id)
                                                    await ctx.reply(`${messagebanned(ctx)}`)
                                                }
                                            }else{
                                                await ctx.deleteMessage(ctx.message.message_id)
                                                await ctx.reply(`Media not found or has been removed.`)
                                            }
                                        })
                                    }
                                }
                            }
                        }
                    }
                catch(error){
                    await ctx.deleteMessage(ctx.message.message_id)
                    await ctx.reply(`${messagebotnoaddgroup(ctx)}`)
                }
            }
        }
        //saving user details to the database
        await saver.saveUser(user)
    }
})

//DEFINING POP CALLBACK
bot.action('POP', async(ctx)=>{
    await ctx.deleteMessage()
    await ctx.reply(`${messagelink(ctx)}`,{
        parse_mode: 'HTML',
        reply_markup:{
            inline_keyboard: [
                [{text:'Batal',callback_data:'STARTUP'}]
            ]
        }
    })
})

//DEFINING DOC CALLBACK
bot.action('DOC', async(ctx)=>{
    await ctx.deleteMessage()
    await ctx.reply(`${documentation(ctx)}`,{
        parse_mode: 'HTML',
        reply_markup:{
            inline_keyboard: [
                [{text:'BACK',callback_data:'STARTUP'}]
            ]
        }
    })
})

bot.action('SRC', async(ctx)=>{
    await ctx.deleteMessage()
    await ctx.reply(`${helpcommand.botsrc}`,{
        parse_mode: 'HTML',
        reply_markup:{
            inline_keyboard: [
                [{text: `💿 HEROKU`, url: `https://bit.ly/3yA6IRA`},{text: `💿 KOMPUTER/VPS`, url: `https://bit.ly/38qaMsS`}],
                [{text:'BACK',callback_data:'STARTUP'}]
            ]
        }
    })
})

bot.action('HELP',async(ctx)=>{
    await ctx.deleteMessage()
    await ctx.reply(`${helpcommand.bothelp}`,{
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        reply_markup:{
            inline_keyboard: [
                [{text:'🪒 COMMAND',callback_data:'COMM'}],
                [{text:'BACK',callback_data:'STARTUP'}]
            ]
        }
    })
})

bot.action('COMM', async(ctx)=>{
    await ctx.deleteMessage()
    await ctx.reply(`${helpcommand.botcommand}`,{
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        reply_markup:{
            inline_keyboard: [
                [{text:'BACK',callback_data:'HELP'}]
            ]
        }
    })
})

bot.action('STARTUP', async(ctx)=>{
    let str = process.env.ADMIN;
    let result = str.includes(ctx.from.id);

    await ctx.deleteMessage()
    if(result == true){
        const profile = await bot.telegram.getUserProfilePhotos(ctx.from.id)
        if(!profile || profile.total_count == 0)
            return await ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,{
                parse_mode:'HTML',
                disable_web_page_preview: true,
                reply_markup:{
                    inline_keyboard:inKey
                }
            })
            await ctx.replyWithPhoto(profile.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,
                parse_mode:'HTML',
                disable_web_page_preview: true,
                reply_markup:{
                    inline_keyboard:inKey
                }
            })
    }else{
        const profile = await bot.telegram.getUserProfilePhotos(ctx.from.id)
        if(!profile || profile.total_count == 0)
            return await ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,{
                parse_mode:'HTML',
                disable_web_page_preview: true,
                reply_markup:{
                    inline_keyboard:inKey2
                }
            })
            await ctx.replyWithPhoto(profile.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,
                parse_mode:'HTML',
                disable_web_page_preview: true,
                reply_markup:{
                    inline_keyboard:inKey2
                }
            })
    }
})

//TEST BOT
bot.hears(/ping/i,async(ctx)=>{
    if(ctx.chat.type == 'private') {    
        await saver.checkBan(`${ctx.from.id}`).then(async res => {
            //console.log(res);
            if(res == true) {
                if(ctx.chat.type == 'private') {
                    await ctx.deleteMessage(ctx.message.message_id)
                    await ctx.reply(`${messagebanned(ctx)}`)
                }
            }else{
                await ctx.deleteMessage(ctx.message.message_id)
                let chatId = ctx.message.from.id;
                let opts = {
                    reply_markup:{
                        inline_keyboard: [[{text:'OK',callback_data:'PONG'}]]
                    }
                }
                return await bot.telegram.sendMessage(chatId, 'pong' , opts);
            }
        })
    }
})

bot.action('PONG',async(ctx)=>{
    await ctx.deleteMessage(ctx.message.message_id)
})

//GROUP COMMAND
bot.command('reload',async(ctx)=>{
    var botStatus2 = await bot.telegram.getChatMember(ctx.chat.id, ctx.botInfo.id)
    var memberstatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.from.id)
    //console.log(memberstatus);
    const group = {
        groupId:ctx.chat.id
    }
    if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
        if(memberstatus.status == 'creator' || memberstatus.status == 'administrator'){
            await ctx.deleteMessage(ctx.message.message_id)
            await ctx.reply('Bot restarted')
            await saver.saveGroup(group)
        }
        if(ctx.from.username == 'GroupAnonymousBot'){
            await ctx.deleteMessage(ctx.message.message_id)
            await ctx.reply('Bot restarted')
            await saver.saveGroup(group)
        }
    }
    
})

bot.command('kick',async(ctx)=>{
    const groupDetails = await saver.getGroup().then(async res=>{
        const n = res.length
        const groupId = []
        for (let i = n-1; i >=0; i--) {
            groupId.push(res[i].groupId)
        }
        async function kick() {
            for (const group of groupId) {
                var botStatus2 = await bot.telegram.getChatMember(group, ctx.botInfo.id)
                var memberstatus = await bot.telegram.getChatMember(group, ctx.from.id)
                //console.log(memberstatus);

                if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
                    if(memberstatus.status == 'administrator'){  
                        await ctx.deleteMessage(ctx.message.message_id)  
                        if(memberstatus.can_restrict_members == true){       
                            if(ctx.message.reply_to_message == undefined){
                                let args = ctx.message.text.split(" ").slice(1)
                                await bot.telegram.kickChatMember(ctx.chat.id, Number(args[0])).then(async result =>{
                                    //console.log(result)
                                })
                            }
                            await bot.telegram.kickChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(async result =>{
                                //console.log(result)
                            })
                        }
                    }else if(memberstatus.status == 'creator'){
                        await ctx.deleteMessage(ctx.message.message_id)
                        if(ctx.message.reply_to_message == undefined){
                            let args = ctx.message.text.split(" ").slice(1)
                            await bot.telegram.kickChatMember(ctx.chat.id, Number(args[0])).then(async result =>{
                                //console.log(result)
                            })
                        }
                        await bot.telegram.kickChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(async result =>{
                            //console.log(result)
                        })
                    }else{
                        if(ctx.from.username == 'GroupAnonymousBot'){
                            await ctx.deleteMessage(ctx.message.message_id)
                            if(ctx.message.reply_to_message == undefined){
                                let args = ctx.message.text.split(" ").slice(1)
                                await bot.telegram.kickChatMember(ctx.chat.id, Number(args[0])).then(async result =>{
                                    //console.log(result)
                                })
                            }
                            await bot.telegram.kickChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(async result =>{
                                //console.log(result)
                            })
                        }
                    }
                }
            }
        }
        kick()
    })
    
})

bot.command('ban',async(ctx)=>{
    const groupDetails = await saver.getGroup().then(async res => {
        const n = res.length
        const groupId = []
        for (let i = n-1; i >=0; i--) {
            groupId.push(res[i].groupId)
        }
        async function ban() {
            for (const group of groupId) {
                var botStatus2 = await bot.telegram.getChatMember(group, ctx.botInfo.id)
                var memberstatus = await bot.telegram.getChatMember(group, ctx.from.id)
                //console.log(memberstatus);

                if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
                    if(memberstatus.status == 'administrator'){
                        await ctx.deleteMessage(ctx.message.message_id)
                        if(memberstatus.can_restrict_members == true){
                            if(ctx.message.reply_to_message == undefined){
                               const str = ctx.message.text;
                               const words = str.split(/ +/g);
                               const command = words.shift().slice(1);
                               const userId = words.shift();
                               const caption = words.join(" ");
                               const caption2 = caption ? `\n<b>Because:</b> ${caption}` : "";

                               await bot.telegram.callApi('banChatMember', {
                               chat_id: ctx.message.chat.id,
                               user_id: userId
                               }).then(async result =>{
                                   //console.log(result)
                                   await ctx.reply(`[${userId}] blocked. ${caption2}`,{
                                       parse_mode: 'HTML'
                                   })
                                   return await bot.telegram.sendMessage(userId, `You have been blocked on ${ctx.message.chat.title} ${caption2}`,{
                                       parse_mode: 'HTML'
                                   })
                               })
                            }
    
                            const str = ctx.message.text;
                            const words = str.split(/ +/g);
                            const command = words.shift().slice(1);
                            const userId = words.shift();
                            const caption = words.join(" ");
                            const caption2 = caption ? `\n<b>Because:</b> ${caption}` : "";
    
                            await bot.telegram.callApi('banChatMember', {
                            chat_id: ctx.message.chat.id,
                            user_id: ctx.message.reply_to_message.from.id
                            }).then(async result =>{
                                //console.log(result)
                                let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                                let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                                await ctx.reply(`${replyUsername} ${replyFromid} blocked. ${caption2}`,{
                                    parse_mode: 'HTML',
                                    reply_to_message_id: ctx.message.reply_to_message.message_id
                                })
                                return await bot.telegram.sendMessage(userId, `You have been blocked on ${ctx.message.chat.title} ${caption2}`,{
                                    parse_mode: 'HTML'
                                })
                            })
                        }
                    }else if(memberstatus.status == 'creator'){
                        await ctx.deleteMessage(ctx.message.message_id)
                        if(ctx.message.reply_to_message == undefined){
                            const str = ctx.message.text;
                            const words = str.split(/ +/g);
                            const command = words.shift().slice(1);
                            const userId = words.shift();
                            const caption = words.join(" ");
                            const caption2 = caption ? `\n<b>Because:</b> ${caption}` : "";

                            await bot.telegram.callApi('banChatMember', {
                            chat_id: ctx.message.chat.id,
                            user_id: userId
                            }).then(async result =>{
                                //console.log(result)
                                await ctx.reply(`[${userId}] blocked. ${caption2}`,{
                                    parse_mode: 'HTML'
                                })
                                return await bot.telegram.sendMessage(userId, `You have been blocked on ${ctx.message.chat.title} ${caption2}`,{
                                    parse_mode: 'HTML'
                                })
                            })
                        }

                        const str = ctx.message.text;
                        const words = str.split(/ +/g);
                        const command = words.shift().slice(1);
                        const userId = words.shift();
                        const caption = words.join(" ");
                        const caption2 = caption ? `\n<b>Because:</b> ${caption}` : "";

                        await bot.telegram.callApi('banChatMember', {
                        chat_id: ctx.message.chat.id,
                        user_id: ctx.message.reply_to_message.from.id
                        }).then(async result =>{
                            //console.log(result)
                            let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                            let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                            await ctx.reply(`${replyUsername} ${replyFromid} blocked. ${caption2}`,{
                                parse_mode: 'HTML',
                                reply_to_message_id: ctx.message.reply_to_message.message_id
                            })
                            return await bot.telegram.sendMessage(userId, `You have been blocked on ${ctx.message.chat.title} ${caption2}`,{
                                parse_mode: 'HTML'
                            })
                        })
                    }else{
                        if(ctx.from.username == 'GroupAnonymousBot'){
                            await ctx.deleteMessage(ctx.message.message_id)
                            if(ctx.message.reply_to_message == undefined){
                                const str = ctx.message.text;
                                const words = str.split(/ +/g);
                                const command = words.shift().slice(1);
                                const userId = words.shift();
                                const caption = words.join(" ");
                                const caption2 = caption ? `\n<b>Because:</b> ${caption}` : "";
    
                                await bot.telegram.callApi('banChatMember', {
                                chat_id: ctx.message.chat.id,
                                user_id: userId
                                }).then(async result =>{
                                    //console.log(result)
                                    await ctx.reply(`[${userId}] blocked. ${caption2}`,{
                                        parse_mode: 'HTML'
                                    })
                                    return await bot.telegram.sendMessage(userId, `You have been blocked on ${ctx.message.chat.title} ${caption2}`,{
                                        parse_mode: 'HTML'
                                    })
                                })
                            }
    
                            const str = ctx.message.text;
                            const words = str.split(/ +/g);
                            const command = words.shift().slice(1);
                            const userId = words.shift();
                            const caption = words.join(" ");
                            const caption2 = caption ? `\n<b>Because:</b> ${caption}` : "";
    
                            await bot.telegram.callApi('banChatMember', {
                            chat_id: ctx.message.chat.id,
                            user_id: ctx.message.reply_to_message.from.id
                            }).then(async result =>{
                                //console.log(result)
                                let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                                let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                                await ctx.reply(`${replyUsername} ${replyFromid} blocked. ${caption2}`,{
                                    parse_mode: 'HTML',
                                    reply_to_message_id: ctx.message.reply_to_message.message_id
                                })
                                return await bot.telegram.sendMessage(userId, `You have been blocked on ${ctx.message.chat.title} ${caption2}`,{
                                    parse_mode: 'HTML'
                                })
                            })
                        }
                    }
                }
            }
        }
        ban()
    })
    
})

bot.command('unban',async(ctx)=>{
    const groupDetails = await saver.getGroup().then(async res => {
        const n = res.length
        const groupId = []
        for (let i = n-1; i >=0; i--) {
            groupId.push(res[i].groupId)
        }
        async function unban() {
            for (const group of groupId) {
                var botStatus2 = await bot.telegram.getChatMember(group, ctx.botInfo.id)
                var memberstatus = await bot.telegram.getChatMember(group, ctx.from.id)
                //console.log(memberstatus);

                if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
                    if(memberstatus.status == 'administrator'){
                        await ctx.deleteMessage(ctx.message.message_id)
                        if(memberstatus.can_restrict_members == true){
                            if(ctx.message.reply_to_message == undefined){
                                let args = ctx.message.text.split(" ").slice(1)
                                await bot.telegram.unbanChatMember(ctx.chat.id, Number(args[0])).then(async result =>{
                                    //console.log(result)
                                    await ctx.reply(`[${args[0]}] not blocked, can re-enter!`)
                                    return await bot.telegram.sendMessage(args[0], `You are not blocked, you can re-enter at ${ctx.message.chat.title}`)
                                })
                            }
                            await bot.telegram.unbanChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(async result =>{
                                //console.log(result)
                                let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                                let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                                await ctx.reply(`${replyUsername} ${replyFromid} not blocked, can re-enter!`,{
                                    reply_to_message_id: ctx.message.reply_to_message.message_id
                                })
                                return await bot.telegram.sendMessage(ctx.message.reply_to_message.from.id, `You are not blocked, you can re-enter at ${ctx.message.chat.title}`)
                            })
                        }
                    }else if(memberstatus.status == 'creator'){
                        await ctx.deleteMessage(ctx.message.message_id)
                        if(ctx.message.reply_to_message == undefined){
                            let args = ctx.message.text.split(" ").slice(1)
                            await bot.telegram.unbanChatMember(ctx.chat.id, Number(args[0])).then(async result =>{
                                //console.log(result)
                                await ctx.reply(`[${args[0]}] not blocked, can re-enter!`)
                                return await bot.telegram.sendMessage(args[0], `You are not blocked, you can re-enter at ${ctx.message.chat.title}`)
                            })
                        }
                        await bot.telegram.unbanChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(async result =>{
                            //console.log(result)
                            let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                            let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                            await ctx.reply(`${replyUsername} ${replyFromid} not blocked, can re-enter!`,{
                                reply_to_message_id: ctx.message.reply_to_message.message_id
                            })
                            return await bot.telegram.sendMessage(ctx.message.reply_to_message.from.id, `You are not blocked, you can re-enter at ${ctx.message.chat.title}`)
                        })
                    }else{
                        if(ctx.from.username == 'GroupAnonymousBot'){
                            await ctx.deleteMessage(ctx.message.message_id)
                            if(ctx.message.reply_to_message == undefined){
                                let args = ctx.message.text.split(" ").slice(1)
                                await bot.telegram.unbanChatMember(ctx.chat.id, Number(args[0])).then(async result =>{
                                    //console.log(result)
                                    await ctx.reply(`[${args[0]}] not blocked, can re-enter!`)
                                    return await bot.telegram.sendMessage(args[0], `You are not blocked, you can re-enter at ${ctx.message.chat.title}`)
                                })
                            }
                            await bot.telegram.unbanChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(async result =>{
                                //console.log(result)
                                let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                                let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                                await ctx.reply(`${replyUsername} ${replyFromid} not blocked, can re-enter!`,{
                                    reply_to_message_id: ctx.message.reply_to_message.message_id
                                })
                                return await bot.telegram.sendMessage(ctx.message.reply_to_message.from.id, `You are not blocked, you can re-enter at ${ctx.message.chat.title}`)
                            })
                        }
                    }
                }
            }
        }
        unban()
    })
    
})

bot.command('pin',async(ctx)=>{
    const groupDetails = await saver.getGroup().then(async res =>{
        const n = res.length
        const groupId = []
        for (let i = n-1; i >=0; i--) {
            groupId.push(res[i].groupId)
        }
        async function pin() {
            for (const group of groupId) {
                var botStatus2 = await bot.telegram.getChatMember(group, ctx.botInfo.id)
                var memberstatus = await bot.telegram.getChatMember(group, ctx.from.id)
                //console.log(memberstatus);

                if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
                    if(memberstatus.status == 'administrator'){
                        await ctx.deleteMessage(ctx.message.message_id)
                        if(memberstatus.can_pin_messages == true){
                            await bot.telegram.pinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id,{
                                disable_notification: false,
                            }).then(async result =>{
                                //console.log(result)
                            })
                        }
                    }else if(memberstatus.status == 'creator'){
                        await ctx.deleteMessage(ctx.message.message_id)
                        await bot.telegram.pinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id,{
                            disable_notification: false,
                        }).then(async result =>{
                            //console.log(result)
                        })
                    }else{
                        if(ctx.from.username == 'GroupAnonymousBot'){
                            await ctx.deleteMessage(ctx.message.message_id)
                            await bot.telegram.pinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id,{
                                disable_notification: false,
                            }).then(async result =>{
                                //console.log(result)
                            })
                        }
                    }
                }
            }
        }
        pin()
    })
    
})

bot.command('unpin',async(ctx)=>{
    const groupDetails = await saver.getGroup().then( async res=>{
        const n = res.length
        const groupId = []
        for (let i = n-1; i >=0; i--) {
            groupId.push(res[i].groupId)
        }
        async function unpin() {
            for (const group of groupId) {
                var botStatus2 = await bot.telegram.getChatMember(group, ctx.botInfo.id)
                var memberstatus = await bot.telegram.getChatMember(group, ctx.from.id)
                //console.log(memberstatus);

                if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
                    if(memberstatus.status == 'administrator'){
                        await ctx.deleteMessage(ctx.message.message_id)
                        if(memberstatus.can_pin_messages == true){
                            await bot.telegram.unpinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id).then(async result =>{
                                //console.log(result)
                            })
                        }
                    }else if(memberstatus.status == 'creator'){
                        await ctx.deleteMessage(ctx.message.message_id)
                        await bot.telegram.unpinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id).then(async result =>{
                            //console.log(result)
                        })
                    }else{
                        if(ctx.from.username == 'GroupAnonymousBot'){
                            await ctx.deleteMessage(ctx.message.message_id)
                            await bot.telegram.unpinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id).then(async result =>{
                                //console.log(result)
                            })
                        }
                    }
                }
            }
        }
        unpin()
    })
    
})

bot.command('send',async(ctx)=>{
    const groupDetails = await saver.getGroup().then(async res =>{
        const n = res.length
        const groupId = []
        for (let i = n-1; i >=0; i--) {
            groupId.push(res[i].groupId)
        }
        async function send() {
            for (const group of groupId) {
                var botStatus2 = await bot.telegram.getChatMember(group, ctx.botInfo.id)
                var memberstatus = await bot.telegram.getChatMember(group, ctx.from.id)
                //console.log(memberstatus);

                if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
                    if(memberstatus.status == 'creator' || memberstatus.status == 'administrator'){
                        await ctx.deleteMessage(ctx.message.message_id)
                        if(ctx.message.reply_to_message == undefined){
                            const str = ctx.message.text;
                            const words = str.split(/ +/g);
                            const command = words.shift().slice(1);
                            const caption = words.join(" ");
    
                            return await bot.telegram.sendMessage(group, `${caption}`)
                        }
                        const str = ctx.message.text;
                        const words = str.split(/ +/g);
                        const command = words.shift().slice(1);
                        const caption = words.join(" ");

                        return await bot.telegram.sendMessage(group, `${caption}`,{
                            reply_to_message_id: ctx.message.reply_to_message.message_id
                        })
                    }
                    if(ctx.from.username == 'GroupAnonymousBot'){
                        await ctx.deleteMessage(ctx.message.message_id)
                        if(ctx.message.reply_to_message == undefined){
                            const str = ctx.message.text;
                            const words = str.split(/ +/g);
                            const command = words.shift().slice(1);
                            const caption = words.join(" ");
    
                            return await bot.telegram.sendMessage(group, `${caption}`)
                        }
                        const str = ctx.message.text;
                        const words = str.split(/ +/g);
                        const command = words.shift().slice(1);
                        const caption = words.join(" ");

                        return await bot.telegram.sendMessage(group, `${caption}`,{
                            reply_to_message_id: ctx.message.reply_to_message.message_id
                        })
                    }
                }
            }
        }
        send()
    })
    
})
//END

//check account
bot.command('getid',async(ctx)=>{
    if(ctx.chat.type == 'private') {       
        const profile4 = await bot.telegram.getUserProfilePhotos(ctx.from.id)
        await saver.checkBan(`${ctx.from.id}`).then(async res => {
            //console.log(res);
            if(res == true) {
                if(ctx.chat.type == 'private') {
                    await ctx.deleteMessage(ctx.message.message_id)
                    await ctx.reply(`${messagebanned(ctx)}`)
                }
            }else{
                if(!profile4 || profile4.total_count == 0){
                    await ctx.deleteMessage(ctx.message.message_id)
                    await ctx.reply(`<b>Name:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n<b>Username:</b> ${username(ctx)}\n<b>ID:</b> ${ctx.from.id}`,{
                        parse_mode:'HTML'  
                    })
                }else{
                    await ctx.deleteMessage(ctx.message.message_id)
                    await ctx.replyWithPhoto(profile4.photos[0][0].file_id,{caption: `<b>Name:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n<b>Username:</b> ${username(ctx)}\n<b>ID:</b> ${ctx.from.id}`,
                        parse_mode:'HTML'
                    })
                }
            }
        })
    }
    
})

//remove files with file_id
bot.command('rem', async(ctx) => {
    if(ctx.chat.type == 'private') {
        const msg = ctx.message.text
        let msgArray = msg.split(' ')
        msgArray.shift()
        let text2 = msgArray.join(' ')
        let text = `${text2}`.replace(/_/g, '-');
        console.log(text);

        let str = process.env.ADMIN;
        let result = str.includes(ctx.from.id);

        if(result == true){
            await ctx.deleteMessage(ctx.message.message_id)
            saver.removeFile(text)
            await ctx.reply('❌ 1 media deleted successfully')
        }
    }
    
})

bot.command('remgrp', async(ctx) => {
    if(ctx.chat.type == 'private') {
        const msg = ctx.message.text
        let msgArray = msg.split(' ')
        msgArray.shift()
        let media = msgArray.join(' ')
        //console.log(media);

        let str = process.env.ADMIN;
        let result = str.includes(ctx.from.id);

        if(result == true){
            await ctx.deleteMessage(ctx.message.message_id)
            saver.removeFileMedia(media)
            await ctx.reply('❌ Media group deleted successfully')
        }
    }
})

//remove whole collection(remove all files)
bot.command('clear', async(ctx)=>{
    if(ctx.chat.type == 'private') {
        let str = process.env.ADMIN;
        let result = str.includes(ctx.from.id);

        if(result == true){
            await ctx.deleteMessage(ctx.message.message_id)
            await saver.deleteCollection()
            await ctx.reply('❌ All media deleted successfully')
        }
    }
})

//removing all files sent by a user
bot.command('remall', async(ctx) => {
    if(ctx.chat.type == 'private') {
        const msg = ctx.message.text
        let msgArray = msg.split(' ')
        msgArray.shift()
        let text = msgArray.join(' ')
        //console.log(text);
        let id = parseInt(text)

        let str = process.env.ADMIN;
        let result = str.includes(ctx.from.id);

        if(result == true){
            await ctx.deleteMessage(ctx.message.message_id)
            await saver.removeUserFile(id)
            await ctx.reply('❌ Delete all user media successfully')
        }
    }
    
})

//broadcasting message to bot users(from last joined to first)
bot.command('broadcast',async(ctx)=>{
    if(ctx.chat.type == 'private') {
        const msg = ctx.message.text
        let msgArray = msg.split(' ')
        msgArray.shift()
        let text = msgArray.join(' ')
        const userDetails = await saver.getUser().then(async res =>{
            const n = res.length
            const userId = []
            for (let i = n-1; i >=0; i--) {
                userId.push(res[i].userId)
            }

            //broadcasting
            const totalBroadCast = 0
            const totalFail = []

            //creating function for broadcasting and to know bot user status
            async function broadcast(text) {
                for (const users of userId) {
                    try {
                        await bot.telegram.sendMessage(users, String(text),{
                            parse_mode:'HTML',
                            disable_web_page_preview: true
                          }
                        )
                    } catch (err) {
                        await saver.updateUser(users)
                        totalFail.push(users)

                    }
                }
                await ctx.reply(`✅ <b>Number of active users:</b> ${userId.length - totalFail.length}\n❌ <b>Total failed broadcasts:</b> ${totalFail.length}`,{
                    parse_mode:'HTML'
                })

            }

            let str = process.env.ADMIN;
        let result = str.includes(ctx.from.id);

        if(result == true){
                await ctx.deleteMessage(ctx.message.message_id)
                broadcast(text)
                await ctx.reply('Broadcast starts (Message is broadcast from last joined to first).')

            }else{
                await ctx.deleteMessage(ctx.message.message_id)
                await ctx.reply(`Commands can only be used by Admin.`) 
            }

        })
    }
    
})

//ban user with user id
bot.command('banchat', async(ctx) => {
    if(ctx.chat.type == 'private') {
        const msg = ctx.message.text
        let msgArray = msg.split(' ')
        msgArray.shift()
        let text = msgArray.join(' ')
        //console.log(text)
        const userId = {
            id: text
        }

        if(ctx.chat.type == 'private') {
            let str = process.env.ADMIN;
        let result = str.includes(ctx.from.id);

        if(result == true){
                await ctx.deleteMessage(ctx.message.message_id)
                await saver.banUser(userId).then(async res => {
                    await ctx.reply('❌ Banned')
                })
            }
        }
    }
     
})

//unban user with user id
bot.command('unbanchat', async(ctx) => {
    if(ctx.chat.type == 'private') {
        const msg = ctx.message.text
        let msgArray = msg.split(' ')
        msgArray.shift();
        let text = msgArray.join(' ')
        //console.log(text)
        const userId = {
            id: text
        }

        if(ctx.chat.type == 'private') {
            let str = process.env.ADMIN;
        let result = str.includes(ctx.from.id);

        if(result == true){
                await ctx.deleteMessage(ctx.message.message_id)
                await saver.unBan(userId).then(async res => {
                    await ctx.reply('✅ Finished')
                })
            }
        }
    }
    
})

//saving file
bot.on('document', async(ctx,next) => {
    await new Promise((resolve, reject) => {
        setTimeout(() => {
          return resolve("Result");
        }, 2000);
    });
    //console.log(ctx);
    if(ctx.chat.type == 'private') {
        let str = process.env.ADMIN;
        let result = str.includes(ctx.from.id);

        if(result == true){
            const document = ctx.message.document
  
            if(ctx.message.media_group_id == undefined){
                var tag = `✔️ Document save`;
                var mediaId = ``;
                var mediaId2 = ``;
                if(document.file_name == undefined){
                    var file_name2 = `${today2(ctx)}`;
                    if(ctx.message.caption == undefined){
                        var caption2 =  ``;
                    }else{
                        var caption2 =  `\n\n${ctx.message.caption}`;
                    }
                }else{
                    var exstension2 = document.file_name;
                    var regex2 = /\.[A-Za-z0-9]+$/gm
                    var doctext2 = exstension2.replace(regex2, '');
                    
                    var file_name2 = `${doctext2}`;
                    if(ctx.message.caption == undefined){
                        var caption2 =  ``;
                    }else{
                        var caption2 =  `\n\n${ctx.message.caption}`;
                    }
                }
            }else{
                var tag = `✔️ Group save`;
                var mediaId = `\n<b>Media ID</b>: ${ctx.message.media_group_id}`;
                var mediaId2 = `\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`;
                if(document.file_name == undefined){
                    var file_name2 = `${today2(ctx)}`;
                    if(ctx.message.caption == undefined){
                        var caption2 =  ``;
                    }else{
                        var caption2 =  `\n\n${ctx.message.caption}`;
                    }
                }else{
                    var exstension2 = document.file_name;
                    var regex2 = /\.[A-Za-z0-9]+$/gm
                    var doctext2 = exstension2.replace(regex2, '');
                    
                    var file_name2 = `${doctext2}`;
                    if(ctx.message.caption == undefined){
                        var caption2 =  ``;
                    }else{
                        var caption2 =  `\n\n${ctx.message.caption}`;
                    }
                }
            }
  
            await saver.checkFile(`${document.file_unique_id}`).then(async res => {
                //console.log(res);
                if(res == true) {
                    await ctx.reply(`File already exists.`,{
                        reply_to_message_id: ctx.message.message_id
                    })
                }else{
                    await ctx.replyWithDocument(document.file_id, {
                        chat_id: ctx.chat.id,
                        caption: `${tag} \n<b>Name file:</b> ${file_name2}\n<b>Size:</b> ${document.file_size} B\n<b>File ID:</b> ${document.file_unique_id} ${mediaId} \n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id} ${mediaId2}`,
                        parse_mode: 'HTML',
                        disable_web_page_preview: true,
                        reply_to_message_id: ctx.message.message_id
                    })
                    await ctx.replyWithDocument(document.file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `${tag} \n<b>From:</b> ${ctx.from.id}\n<b>Name:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Name file:</b> ${file_name2}\n<b>Size:</b> ${document.file_size} B\n<b>File ID:</b> ${document.file_unique_id} ${mediaId} \n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id} ${mediaId2} ${caption2}`,
                        parse_mode:'HTML'
                    })
                    const fileDetails1 = {
                        file_name: file_name2,
                        userId: ctx.from.id,
                        file_id: document.file_id,
                        mediaId: ctx.message.media_group_id,
                        caption: ctx.message.caption,
                        file_size: document.file_size,
                        uniqueId: document.file_unique_id,
                        type: 'document'
                    }
                    await saver.saveFile(fileDetails1)
                }
            })
        }
    }
    return next();
})

bot.on('video', async(ctx,next) => {
    await new Promise((resolve, reject) => {
        setTimeout(() => {
          return resolve("Result");
        }, 2000);
    });
    //console.log(ctx);
    if(ctx.chat.type == 'private') {
        let str = process.env.ADMIN;
        let result = str.includes(ctx.from.id);

        if(result == true){
            const video = ctx.message.video
    
            if(ctx.message.media_group_id == undefined){
                var tag = `✔️ Video save`;
                var mediaId = ``;
                var mediaId2 = ``;
                if(video.file_name == undefined){
                    var file_name2 = `${today2(ctx)}`;
                    if(ctx.message.caption == undefined){
                        var caption2 =  ``;
                    }else{
                        var caption2 =  `\n\n${ctx.message.caption}`;
                    }
                }else{
                    var exstension2 = video.file_name;
                    var regex2 = /\.[A-Za-z0-9]+$/gm
                    var vidtext2 = exstension2.replace(regex2, '');
        
                    var file_name2 = `${vidtext2}`;
                    if(ctx.message.caption == undefined){
                        var caption2 =  ``;
                    }else{
                        var caption2 =  `\n\n${ctx.message.caption}`;
                    }
                }
            }else{
                var tag = `✔️ Group save`;
                var mediaId = `\n<b>Media ID</b>: ${ctx.message.media_group_id}`;
                var mediaId2 = `\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`;
                if(video.file_name == undefined){
                    var file_name2 = `${today2(ctx)}`;
                    if(ctx.message.caption == undefined){
                        var caption2 =  ``;
                    }else{
                        var caption2 =  `\n\n${ctx.message.caption}`;
                    }
                }else{
                    var exstension2 = video.file_name;
                    var regex2 = /\.[A-Za-z0-9]+$/gm
                    var vidtext2 = exstension2.replace(regex2, '');
        
                    var file_name2 = `${vidtext2}`;
                    if(ctx.message.caption == undefined){
                        var caption2 =  ``;
                    }else{
                        var caption2 =  `\n\n${ctx.message.caption}`;
                    }
                }
            }

            await saver.checkFile(`${video.file_unique_id}`).then(async res => {
                //console.log(res);
                if(res == true) {
                    await ctx.reply(`File already exists.`,{
                        reply_to_message_id: ctx.message.message_id
                    })
                }else{
                    await ctx.replyWithVideo(video.file_id, {
                        chat_id: ctx.chat.id,
                        caption: `${tag} \n<b>Name file:</b> ${file_name2}\n<b>Size:</b> ${video.file_size} B\n<b>File ID:</b> ${video.file_unique_id} ${mediaId} \n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id} ${mediaId2}`,
                        parse_mode: 'HTML',
                        disable_web_page_preview: true,
                        reply_to_message_id: ctx.message.message_id
                    })
                    await ctx.replyWithVideo(video.file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `${tag} \n<b>From:</b> ${ctx.from.id}\n<b>Name:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Name file:</b> ${file_name2}\n<b>Size:</b> ${video.file_size} B\n<b>File ID:</b> ${video.file_unique_id} ${mediaId} \n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id} ${mediaId2} ${caption2}`,
                        parse_mode:'HTML'
                    })
                    const fileDetails1 = {
                        file_name: file_name2,
                        userId: ctx.from.id,
                        file_id: video.file_id,
                        mediaId: ctx.message.media_group_id,
                        caption: ctx.message.caption,
                        file_size: video.file_size,
                        uniqueId: video.file_unique_id,
                        type: 'video'
                    }
                    await saver.saveFile(fileDetails1)
                }
            })
        }
    }
    return next();
})

bot.on('photo', async(ctx,next) => {
    await new Promise((resolve, reject) => {
        setTimeout(() => {
          return resolve("Result");
        }, 2000);
    });
    //console.log(ctx);
    if(ctx.chat.type == 'private') {
        let str = process.env.ADMIN;
        let result = str.includes(ctx.from.id);

        if(result == true){
            const photo = ctx.message.photo[1]

            if(ctx.message.media_group_id == undefined){
                var tag = `✔️ Photo save`;
                var mediaId = ``;
                var mediaId2 = ``;
                if(photo.file_name == undefined){
                    var file_name2 = `${today2(ctx)}`;
                    if(ctx.message.caption == undefined){
                        var caption2 =  ``;
                    }else{
                        var caption2 =  `\n\n${ctx.message.caption}`;
                    }
                }else{
                    var exstension2 = photo.file_name;
                    var regex2 = /\.[A-Za-z0-9]+$/gm
                    var photext2 = exstension2.replace(regex2, '');
                    
                    var file_name2 = `${photext2}`;
                    if(ctx.message.caption == undefined){
                        var caption2 =  ``;
                    }else{
                        var caption2 =  `\n\n${ctx.message.caption}`;
                    }
                }
            }else{
                var tag = `✔️ Group save`;
                var mediaId = `\n<b>Media ID</b>: ${ctx.message.media_group_id}`;
                var mediaId2 = `\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`;
                if(photo.file_name == undefined){
                    var file_name2 = `${today2(ctx)}`;
                    if(ctx.message.caption == undefined){
                        var caption2 =  ``;
                    }else{
                        var caption2 =  `\n\n${ctx.message.caption}`;
                    }
                }else{
                    var exstension2 = photo.file_name;
                    var regex2 = /\.[A-Za-z0-9]+$/gm
                    var photext2 = exstension2.replace(regex2, '');
                    
                    var file_name2 = `${photext2}`;
                    if(ctx.message.caption == undefined){
                        var caption2 =  ``;
                    }else{
                        var caption2 =  `\n\n${ctx.message.caption}`;
                    }
                }
            }

            await saver.checkFile(`${photo.file_unique_id}`).then(async res => {
                //console.log(res);
                if(res == true) {
                    await ctx.reply(`File already exists.`,{
                        reply_to_message_id: ctx.message.message_id
                    })
                }else{
                    await ctx.replyWithPhoto(photo.file_id, {
                        chat_id: ctx.chat.id,
                        caption: `${tag} \n<b>Name file:</b> ${file_name2}\n<b>Size:</b> ${photo.file_size} B\n<b>File ID:</b> ${photo.file_unique_id} ${mediaId} \n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo.file_unique_id} ${mediaId2}`,
                        parse_mode: 'HTML',
                        disable_web_page_preview: true,
                        reply_to_message_id: ctx.message.message_id
                    })
                    await ctx.replyWithPhoto(photo.file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `${tag} \n<b>From:</b> ${ctx.from.id}\n<b>Name:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Name file:</b> ${file_name2}\n<b>Size:</b> ${photo.file_size} B\n<b>File ID:</b> ${photo.file_unique_id} ${mediaId} \n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo.file_unique_id} ${mediaId2} ${caption2}`,
                        parse_mode:'HTML'
                    })
                    const fileDetails1 = {
                        file_name: file_name2,
                        userId: ctx.from.id,
                        file_id: photo.file_id,
                        mediaId: ctx.message.media_group_id,
                        caption: ctx.message.caption,
                        file_size: photo.file_size,
                        uniqueId: photo.file_unique_id,
                        type: 'photo'
                    }
                    await saver.saveFile(fileDetails1)
                }
            })
        }
    }
    return next();
})

bot.command('stats',async(ctx)=>{
    await ctx.deleteMessage(ctx.message.message_id)
    let str = process.env.ADMIN;
    let result = str.includes(ctx.from.id);
    const stats1 = await saver.getUser2().then(async res1=>{
        const stats2 = await saver.getMedia2().then(async res2=>{
            const stats3 = await saver.getBan2().then(async res3=>{
                const stats4 = await saver.getGroup2().then(async res4=>{
                    if(result == true){
                        await ctx.reply(`👤 Total users: <b>${res1.length}</b>\n🎬 Total media: <b>${res2.length}</b>\n❌ Total users violate: <b>${res3.length}</b>\n👥 Total registered groups: <b>${res4.length}</b>`,{parse_mode:'HTML'})
                    }
                })
            })
        })
    })
})

//heroku config
domain = `${process.env.DOMAIN}.herokuapp.com`
bot.launch({
    webhook:{
       domain:domain,
        port:Number(process.env.PORT) 
    }
})
