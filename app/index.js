var TelegramBot = require('node-telegram-bot-api');

var bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: true});

var notes = [];

bot.on('text', function(msg) {
    var messageChatId = msg.chat.id;
    var messageText = msg.text;
 
    if (messageText === '/start') {
        bot.sendMessage(messageChatId, 'Добро пожаловать, ваш chat.id ' + msg.chat.id + ', на сервере ' + new Date().getHours() + 'часов')
    }
});

bot.onText(/remind (.+) at (.+)/, function (msg, match) {
    var userId = msg.from.id;
    var text = match[1];
    var time = match[2];

    notes.push( { 'uid':userId, 'time':time, 'text':text } );

    bot.sendMessage(userId, 'Отлично! Я обязательно напомню, если не сдохну :)' );
});

setInterval(function(){
    for (var i = 0; i < notes.length; i++){
	    var date = new Date()
        var curDate = date.getHours() + ':' + date.getMinutes();
        if ( notes[i]['time'] == curDate ) {
            bot.sendMessage(notes[i]['uid'], 'Напоминаю, что вы должны: '+ notes[i]['text'] + ' сейчас.');
            notes.splice(i,1);
        }
    }
},10000);
