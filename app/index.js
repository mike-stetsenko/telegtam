var TelegramBot = require('node-telegram-bot-api');

var bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: true});

var notes = [];

bot.on('text', function(msg) {
    var messageChatId = msg.chat.id;
    var messageText = msg.text;
 
    if (messageText === '/start') {
        bot.sendMessage(messageChatId, 'Добро пожаловать, ваш chat.id ' + msg.chat.id + ', на сервере ' + new Date().getHours() + ' часов')
    }
});

bot.onText(/remind (.+) at (.+)/, function (msg, match) {
    var userId = msg.from.id;
	
    var text = match[1];
    var time = match[2].split('-');
    var date = ""
    if (time.length == 2) {
	date = time[1]
        time = time[0]
    }
	
    notes.push( { 'uid':userId, 'time':time, 'date':date, 'text':text } );
	
    var showDate = date
    if (date == "") {
	showDate = "сегодня"
    }
	
    bot.sendMessage(userId, 'Напоминание установлено на ' + time + " " + showDate);
});

setInterval(function(){
    for (var i = 0; i < notes.length; i++){
	
	var date = new Date()
        var curTime = date.getHours() + ':' + date.getMinutes();
	var curDate = date.getDate() + '.0' + (date.getMonth() + 1);
		
        if ( notes[i]['time'] == curTime && (notes[i]['date'] == "" || curDate == notes[i]['date'])) {
            bot.sendMessage(notes[i]['uid'], 'Напоминаю, что Вы должны: '+ notes[i]['text'] + ' сейчас.');
            notes.splice(i,1);
        }
    }
},10000);
