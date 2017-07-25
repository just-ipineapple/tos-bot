var botName = '作成したBOTの名前'
var token = '作成したBOTのトークン'

var Eris = require('eris')
var fs = require('fs');
var moment = date => require('moment-timezone')(date).tz('Asia/Tokyo')
var cubeObj = {};

// 神秘的な箱のセーブデータをロード
fs.readFile('MysticalCube.json', 'utf8', function (err, data) {
    if(data)
        cubeObj = JSON.parse(data);
    var tempObj = {}
    for(var name in cubeObj){
        var user = cubeObj[name]
        var noticeTime = moment(user.date).diff(moment())
        console.log(noticeTime)
        if(noticeTime > 0){
            setTimeout(name=>{
                bot.createMessage(user.channelID,  `${user.mention} ${name}さんの箱がもうすぐ開けられます!!`)
                cubeObj[name] = null
                fs.writeFile('MysticalCube.json', JSON.stringify(cubeObj, null, '    '));
            },noticeTime)
            tempObj[name] = user
        }
    }
    cubeObj = tempObj
    fs.writeFileSync('MysticalCube.json', JSON.stringify(cubeObj, null, '    '));
})

//ディルゲレの時間を保存したやつロード
fs.readFile('Delgele.json', 'utf8', function (err, data) {
    if(err) return
    if(data){
        data =  JSON.parse(data)
        var ElapsedTime = moment().diff(moment(data.date))
        var hour = ElapsedTime/1000/60/60
        if(ElapsedTime > 0 && hour <= 5){
            if(hour < 2){
                setTimeout(()=>{
                    bot.createMessage(data.channelID, `水を与える時間です\n回収時間は${rtnTime(3)}です`);
                },2 * 60 *  60 * 1000 - ElapsedTime)
            }
            setTimeout(()=>{
                bot.createMessage(data.channelID, '回収時間です。忘れずに回収してください。');
            },5 *60 * 60  * 1000 - ElapsedTime)    
        }
    }
})

function rtnTime(addHour){
    return moment().add(addHour,'hour').format('HH:mm')
}

var bot = new Eris.CommandClient(token, {}, {
    description: "Create item search url bot.",
    owner: "somebody",
    prefix: ["!","/","@mention"]
});

bot.on("ready", () => { 
    console.log("Ready!"); 
});

bot.registerCommandAlias("halp", "help"); // Alias !halp to !help

// tos j base の横断検索へのリンク
bot.registerCommand("s", (msg, args) => { 
    if(args.length === 0) { 
        return "Invalid input";
    }
    var text = args.join(" "); 
    return 'https://tos-jp.neet.tv/?q=' + text; 
}, {
    description: "Create TOS_J_BASE URL",
    usage: "<text>"
});

bot.registerCommand("search", (msg, args) => { 
    if(args.length === 0)
    return "Invalid input";
    var text = args.join(" "); 
    return 'https://tos-jp.neet.tv/?q=' + text;
},{ 
    description: "Create TOS_J_BASE URL",
    usage: "<text>"
});

// 韓国語→日本語に翻訳
bot.registerCommand("t", (msg, args) => { 
    if(args.length === 0) { 
        return "Invalid input";
    }
    var text = args.join(" ");
    if(text.match(/http/i))
      return `https://translate.google.co.jp/translate?sl=ko&tl=ja&js=y&prev=_t&hl=ja&ie=UTF-8&u=${text}&edit-text=&act=url`; 
    return 'https://translate.google.co.jp/?hl=ja#ko/ja/' + text
}, {
    description: "translate korean to japanese",
    usage: "<text>"
});

bot.registerCommand("trans", (msg, args) => { 
    if(args.length === 0) { 
        return "Invalid input";
    }
    var text = args.join(" ");
    if(text.match(/http/i))
      return `https://translate.google.co.jp/translate?sl=ko&tl=ja&js=y&prev=_t&hl=ja&ie=UTF-8&u=${text}&edit-text=&act=url`; // Return the generated string
    return 'https://translate.google.co.jp/?hl=ja#ko/ja/' + text
}, {
    description: "translate korean to japanese",
    usage: "<text>"
});

// 神秘的な箱
bot.registerCommand("b", (msg, args) => {
    if(args.length === 0) { 
        return "Input your Character Name";
    }
    var text = args.join(" ");
    var user = {channelID:msg.channel.id,mention:`<@${msg.author.id}>`,date:moment().add(24,'hour').add(-3,'minutes')}
    bot.createMessage(user.channelID,  `${user.mention} ${moment(user.date).format('HH:mmに')}${text}さんの箱が開けられます`)
    cubeObj[text] = user
    setTimeout(()=>{bot.createMessage(user.channelID,  `${user.mention} ${text}さんの箱がもうすぐ開けられます!!`);cubeObj[text] = null},moment(user.date).diff(moment()))
    fs.writeFile('MysticalCube.json', JSON.stringify(cubeObj, null, '    '));
    },{
        description: "translate korean to japanese",
        usage: "<name>"
});

bot.registerCommand("box", (msg, args) => {
    if(args.length === 0) { 
        return "Input your Character Name";
    }
    var text = args.join(" ");
    var user = {channelID:msg.channel.id,mention:`<@${msg.author.id}>`,date:moment().add(24,'hour').add(-3,'minutes')}
    bot.createMessage(user.channelID,  `${user.mention} ${moment(user.date).format('HH:mmに')}${text}さんの箱が開けられます`)
    cubeObj[text] = user
    setTimeout(()=>{bot.createMessage(user.channelID,  `${user.mention} ${text}さんの箱がもうすぐ開けられます!!`);cubeObj[text] = null},moment(user.date).diff(moment()))
    fs.writeFile('MysticalCube.json', JSON.stringify(cubeObj, null, '    '));
    },{
        description: "translate korean to japanese",
        usage: "<name>"
});

// 何か発言されたときに発火。ここで発言するときはif文を使って、BOTを弾かないと無限ループ
bot.on("messageCreate", (msg) => {
    //メンション周り　現在凍結
    // for (var mention of msg.mentions){
    //     if(mention.username === botName)
    //         bot.createMessage(msg.channel.id,'https://tos-jp.neet.tv/?q=' + msg.content.replace(/<@.*>\s*/,''))
    // }

    if(msg.author.username != botName && msg.channel.name == 'delgele'){ //ディルゲレチャンネルならタイマーを起動する
        bot.createMessage(msg.channel.id, `ディルゲレを植えました\n種まき・水やり・回収時間は ${rtnTime(0)}->${rtnTime(2)}->${rtnTime(5)}です。`);
        var obj = {date:moment(),channelID:msg.channel.id}
        fs.writeFile('Delgele.json', JSON.stringify(obj, null, '    '));
        setTimeout(()=>{
            bot.createMessage(msg.channel.id, `水を与える時間です\n回収時間は${rtnTime(3)}です`);
            setTimeout(()=>{
                bot.createMessage(msg.channel.id, '回収時間です。忘れずに回収してください。');
                },3 *60 * 60  * 1000)
        },2 * 60 * 60 * 1000)
    }
});
bot.connect();