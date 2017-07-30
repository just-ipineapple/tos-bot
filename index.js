var Eris = require('eris')
var fs = require('fs');
var guessLanguage = require('guesslanguage').guessLanguage;

var moment = date => require('moment-timezone')(date).tz('Asia/Tokyo')

//------------------bot--------------------
var token = 'your token name'
var dbDoc = {}
dbDoc.alertList = dbDoc.alertList || []

function rtnTime(addHour){
    return moment().add(addHour,'hour').format('HH:mm')
}

var bot = new Eris.CommandClient(token, {}, {
    description: "Create item search url bot.",
    owner: "somebody",
    prefix: ["!","/","@mention"],
    ignoreSelf:true,
    ignoreBots:true
});

bot.on("ready", (msg) => {
    console.log("Ready!"); 
});

bot.registerCommandAlias("halp", "help"); // Alias !halp to !help

// tos neet の横断検索へのリンク
bot.registerCommand("search", (msg, args) => { 
    if(args.length === 0)
    return "Invalid input";
    var text = args.join(" ");
    guessLanguage.detect(text ,function(language) {
    text = text.replace(/\s/g,'+')
    if(language === 'ko')
        url =  `https://tos-kr.neet.tv/?q=${text}\nhttps://translate.google.co.jp/translate?sl=auto&tl=ja&js=y&prev=_t&hl=ja&ie=UTF-8&u=https://tos-kr.neet.tv/?q=${text}&edit-text=&act=url`; 
    else if(language == 'ja' || language === 'zh'|| language === 'zh-TW')
        url = 'https://tos-jp.neet.tv/?q=' + text; 
    else
        url = `https://tos.neet.tv/?q=${text}\nhttps://translate.google.co.jp/translate?sl=auto&tl=ja&js=y&prev=_t&hl=ja&ie=UTF-8&u=https://tos.neet.tv/?q=${text}&edit-text=&act=url`; 

    bot.createMessage(msg.channel.id, url); 
});

},{ 
    description: "Create tos.neet`s url.",
    usage: "<text>",
     aliases:["s"]
});

// 外国語→日本語に翻訳
bot.registerCommand("trans", (msg, args) => { 
    if(args.length === 0) { 
        return "Invalid input";
    }
    var text = args.join(" ");
    if(text.match(/http/i))
      return `https://translate.google.co.jp/translate?sl=auto&tl=ja&js=y&prev=_t&hl=ja&ie=UTF-8&u=${text}&edit-text=&act=url`; 
    return 'https://translate.google.co.jp/#auto/ja/' + text
}, {
    description: "translate foforeign language to japanese.",
    usage: "<text>",
    aliases:["t","translate"]
});

// 神秘的な箱
bot.registerCommand("box", (msg, args) => {
    if(args.length === 0) { 
        return "Input your Character Name";
    }
    var text = args.join(" ");
    var user = {
        type:3,
        channelID:msg.channel.id,
        mention:`<@${msg.author.id}>`,
        date:moment().add(24,'hour').add(-3,'minutes'),
        text:text
    }
    bot.createMessage(user.channelID,  `${user.mention} ${moment(user.date).format('HH:mmに')}${text}さんの箱が開けられます`)
    dbDoc.alertList.push(user)
    // dbUpdate()
    },{
        description: "Create mystical cube reminder.",
        usage: "<name>",
        aliases:["cube","b"]
});

// 何か発言されたときに発火。ここで発言するときはif文を使って、BOTを弾かないと無限ループ
bot.on("messageCreate", (msg) => {
    //メンション周り　現在凍結
    // for (var mention of msg.mentions){
    //     if(mention.username === botName)
    //         bot.createMessage(msg.channel.id,'https://tos-jp.neet.tv/?q=' + msg.content.replace(/<@.*>\s*/,''))
    // }
    // console.log()
    if(msg.author.id != bot.user.id && msg.channel.name == 'delgele'){ //ディルゲレチャンネルならタイマーを起動する
        bot.createMessage(msg.channel.id, `ディルゲレを植えました\n種まき・水やり・回収時間は ${rtnTime(0)}->${rtnTime(2)}->${rtnTime(5)}です。`);
        dbDoc.alertList.push({
            type:1,
            date:moment().add(2,'hour'),
            channelID:msg.channel.id
        })
        dbDoc.alertList.push({
            type:2,
            date:moment().add(5,'hour'),
            channelID:msg.channel.id
        })
        // console.log(dbDoc.alertList)
        // dbUpdate()    
    }
});
bot.connect();

//-----------alert-----------

function updateAlert(){
    let thisTime = moment().format('DD:HH:mm')
    for(let i in dbDoc.alertList){
        if(moment(dbDoc.alertList[i].date).format('DD:HH:mm') === thisTime){
            selectAlertFunc(dbDoc.alertList[i])
            delete dbDoc.alertList[i]
        }
    }
    dbDoc.alertList = dbDoc.alertList.filter(e=>e)
}

function selectAlertFunc(obj){
    switch (obj.type){
        case 1:{
            bot.createMessage(obj.channelID, `水を与える時間です\n回収時間は${rtnTime(3)}です`);
            break
         }
        case 2:{
            bot.createMessage(obj.channelID, '回収時間です。忘れずに回収してください。');
            break
        }
        case 3:{
            bot.createMessage(obj.channelID,  `${user.mention} ${text}さんの箱がもうすぐ開けられます!!`);
            break;
        }
    }
}   

var timer = setInterval(updateAlert,1000 * 20)

//---------web page----------
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});