var kkutu = require("./kkutu")
var Bot = require("./bot")

exports.yell = (msg,id,name) => {
   kkutu.publish("yell", {value : msg})
   Bot.notice(msg,id,name)
};
