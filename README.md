# 始め方

1. `git clone https://github.com/writ312/tos-bot.git`
1. `npm install`
1. [create discord bot](https://discordapp.com/developers/applications/me)
1. edit index.js 1~2 Line
1. `npm start`

# botの作り方
上のURLをクリックして適当に頑張る
![img](img.png)


重要なのは丸の部分
上から順に
1. index.jsの一行目を置き換える
2. https://discordapp.com/oauth2/authorize?&client_id=ここと置き換える&scope=bot&permissions=0  
    置き換えてURLに飛ぶと、管理しているルームにBOTを追加するところに飛べる。管理者または管理者権限がないとだめなので注意。
3. index.jsの２行目を置き換える

ざっくりとした説明だけど、わかんなかったらググれ  
ずっとPC動かさないよーとかいう人はherokuなりbluemixなり使おう
