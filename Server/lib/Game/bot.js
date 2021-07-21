// 디스코드 모듈 불러오기
const Discord = require("discord.js");
const JLog = require("../sub/jjlog")
const KKuTu = require('./kkutu');
const GLOBAL = require("../sub/global.json");

// 클라이언트 선언
const Bot = new Discord.Client();

// 채널 생성

      
// 봇 준비시 끄투 켜짐 발행 (2번 실행 된다 이유는 모른다.)
Bot.on("ready", () => {
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL)) return JLog.warn("ready 발송 과정에서 채널을 찾지 못함");
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL).send("Bot ready");
})
// 마스터 준비시 발행한다. 근데 if 에서 이상한 리턴을 해버린다.
exports.dbready = () => {
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL)) return
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL).send("```끄투 마스터 준비 끝```")
}
// 채팅시 발행한다.
exports.chat = (msg, id, name, channelId) => {
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL)) return JLog.warn("채팅 안됨");
   if (!name) name = "GUEST"
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL).send(msg + `\n(${id}),{${channelId}}`)
}
// 지금은 안되지만 언젠간 될 kill 명령어 시 발행한다.
exports.ban = (id) => {
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL)) return JLog.warn("kill 안됨")
   if (id) return JLog.warn("id 확인 불가");
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL).send(`type : 410 [${id}]`)
}
exports.close = (servernumber) => {
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL)) return
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL).send(`***서버 닫힘*** **서버 번호 |${servernumber}|`)
}
exports.serverready = (servernumber) => {
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL)) return
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL).send(`***서버 열림*** **서버 번호 |${servernumber}|`)
}
// 디스코드 메시지를 수집해 명령문을 내린다.
Bot.on("message", async (message) => {
   // !ku 라면 끄투 공지에 Discord Send : (내용)을 보낸다 근데 로비를 제외한 모든 곳은 다 2번 보내진다 이상하다 .ㅠㅠ
   if (message.content.startsWith("!ku")){
      let content = message.content.slice("!ku".length);;
      if (message.author.id === ("551639169865220096")){
      KKuTu.publish('yell', { value: "Discord Send : " + content });
      } else {
         message.reply("권한 없음");
         return;
      }
   }
})

// 봇 로그인
Bot.login(GLOBAL.BOT_SETTING.BOT_TOKEN);