/**
 * cherrykkutu bot 입니다
 * 저작권은 체리보린한테 있으며
 * 무단으로 코드를 복사하거나, 2차 복제에 대해 제지 할것이다.
 * 감사하다(?). 
 */
// 모듈 불러온다.
// 디스코드 봇 돌리기 위해 모듈을 불러온다.

var Discord = require("discord.js");
// 리턴시 jlog 로 출력하기 위함이다
var JLog = require("../sub/jjlog")
// !kn 시 끄투 공지를 출력해야하므로 KKuTu 를 선언했다.
// 채널 ID 를 불러와야 하므로 선언했다.
var GLOBAL = require("../sub/global.json");
// servers 의 값을 불러와야하므로 선언했다.
var request = require("request")
// 버리자.
// yell 때문에 필요하다
var yell = require("./load");

// 이건 왜 선언 되어있는지 모른다. 리펙토링 사용하다 선언된거 같다.
// 그냥 버리자
// const { KOR_FLAG } = require("../const");

// kill 사용으로 만든 기능이다. 그냥 버리자.
// var dic = {};

// 클라이언트 선언한다. client 보다 bot 이 나을거 같아 bot으로 선언했다.
var Bot = new Discord.Client();

// 채널 생성
// 근데 이거는 global 에서 선언 되어 따로 선언 되지 않다. 

// 봇 준비시 끄투 켜짐 발행 (2~최대 4번 나온다. 이유는 모른다.)
Bot.on("ready", () => {
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL)) return JLog.warn("ready 발송 과정에서 채널을 찾지 못함");
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL).send("Bot ready");
})
// 마스터 준비시 발행한다. 근데 if 에서 이상한 리턴을 해버린다.
exports.dbready = () => {
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL)) return
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL).send("```끄투 마스터 준비 끝```")
}
// 채팅시 발행한다
exports.chat = (msg, id, name, channelId) => {
   if (!Bot.channels.cache.get("835829185367900191")) return JLog.warn("채팅 안됨");
   if (!name) name = "GUEST"
   Bot.channels.cache.get("835829185367900191").send(msg + `\n(${id}),{${channelId}}`)
}
// 지금은 안되지만 언젠간 될 kill 명령어 시 발행한다.
exports.ban = (id) => {
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL)) return JLog.warn("kill 안됨")
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL).send(`type : 410 [${id}]`)
}
// 서버 game close 일때 실행한다. servernumber number 형식이다.
exports.close = (servernumber) => {
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL)) return
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL).send(`***서버 닫힘*** **서버 번호** **|${servernumber}|**`)
}
// 서버가 열리면 출력한다 (근대 이건 그냥 안된다 ㅋㅋ)
exports.serverready = (servernumber) => {
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL)) return
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL).send(`***서버 열림*** **서버 번호 |${servernumber}|`)
}
// kkutu 진입시 채널에알린다. ~~근데 m_은 따로 안막았다 왜냐하면 체리끄투는 모바일을 막았기 때문이다.~~~~
exports.page = (ip, guest, page) => {
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.ip_Channel)) return;
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.ip_Channel).send(`${ip},${guest},${page}`)
   if (ip === "211.224.188.58") return;
   if (page === "portal") return;
   if (page === "login") return;
   if (page === "gwalli") return;
   if (page === "m_portal") return;
   if (page === "m_login") return;
   if (page === "m_gwalli") return;


   Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL).send(`${ip.split(".").slice(0, 2).join(".") + ".xx.xx"},${page}`)
}
// 공지시 발송한다.
exports.notice = (msg, id, name) => {
   var embed = new Discord.MessageEmbed()
      .setTitle("끄투 공지")
      .setDescription(`**${msg}**`)
      .setFooter(`${id},[${name}]`);
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.notice_Channel)) return;
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.notice_Channel).send(embed)
}
// 끄투 채팅에서 변경시 호출한다.
exports.un = (msg) => {
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.un_Channel)) return;
   var embed = new Discord.MessageEmbed({
      title: "환율 변경",
      description: `**${msg}**` + "/핑",
      color: "ff0000"
   })
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.un_Channel).send(embed)
}
// 182줄에서 쓴다.
function un(msg) {
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.un_Channel)) return;
   var embed = new Discord.MessageEmbed({
      title: "환율 변경",
      description: `**${msg}**` + "/핑",
      color: "ff0000"
   })
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.un_Channel).send(embed)
}
// 디스코드 메시지를 수집해 명령문을 내린다.
Bot.on("message", (message) => {
   // !kn , !kkutunotice (내용) 을 하면 Discord Send : (내용) 으로 끄투 공지로 출력한다.근데 !kkutunotice 는 지울 전망이다 엇갈린다.
   if (message.content.startsWith("!kn")) {
      var msg = message.content.slice(3)

      if (message.author.id === ("820525053141319691") || message.author.id === ("551639169865220096")) {
         yell.yell(msg, message.author.id, message.author.username) // 처리 방법 변경함.
      } else { // 위에 5516.. 체리끄투 관리자가 라면 공지가 되지만 아니라면 권한이 없다고 한다 근데 권한 없다고 3번이 뜬다 이유를 모른다.
         message.reply("권한 없음");
         return; // 그러고선 리턴을 해버린다 필요없긴 하지만.
      }
   }
   // err,res 는 사용되지 않은 선언문이지만 지우지 말자 (그러면 body 안됨 )모듈상으로 .ㅠ
   if (message.content.startsWith("!list") || message.content.startsWith("!kkutulist")) {
      request.get({ url: "http://cherry.or-kr.ml/servers" }, function (error, res, body) { // error,res 는 지우지 말자 왜냐하면 모듈상으로 error,res,body 순이기 때문에 지워버리면 err 로 인식해버린다.
         message.channel.send(`**${body}**`) // 그러고선 채널에 전송한다 (3번씩이나.)
      })
   }

   if (message.content.startsWith("!ek")) { // 타 끄투 서버의 리스트를 불러오는 명령어이다.
      let msg = message.content.slice("!ek".length); // msg 를 불러온다 
      // 편의성을 위해 체리끄투가 노가다 해서 만든것이다. !ek 끄투리오 하면 servers 요청 하여 나온다.
      if (msg === " 끄투리오") { // 띄어쓰기는 절대 빼지 말자. 띄어쓰기를 빼려면 slice(4) 로 설정하면 띄어쓰기를 빼야 된다.
         msg = "https://kkutu.io/" // 끄투리오라면 msg 를 변환한다. 사이트로
      } else if (msg === " 끄투코리아") {
         msg = "https://kkutu.co.kr/"
      } else if (msg === " 끄투닷넷") {
         msg = "https://kkutu.xyz/"
      } else if (msg === " BF끄투") {
         msg = "https://bfkkutu.kr/"
      } else if (msg === " RH끄투") {
         msg = "https://kkutu.romanhue.xyz/"
      } else if (msg === " 랜덤 스튜디오") {
         msg = "http://randomstudio.kro.kr/"
      } else if (msg === " 이름 없는 끄투") {
         msg = "https://kkutu.org/"
      } else if (msg === " 끄투블루") {
         msg = "http://kkutu.blue/"
      } else if (msg === " 지빵끄투") {
         msg = "https://jgkkutu.kr/"
      } else if (msg === " 투데이끄투") {
         msg = "http://kkutu.today/"
      } else if (msg === " 분홍끄투") {
         msg = "https://kkutu.pinkflower.kro.kr/"
      } else if (msg === " 벨투") {
         msg = "https://veltu.kro.kr/"
      } else if (msg === " 블루끄투") {
         msg = "http://bluekkutu.com/"
      } else if (msg === " 행성끄투") {
         msg = "https://planetkt.kr/"
      } else if (msg === " 끄투어스") {
         msg = "https://kkutu.us/"
      } else if (msg === " 저런닷컴") {
         msg = "https://kkutu.top/"
      } else if (msg === " 끄투민트") {
         msg = "https://kkutumint.k-r.cc/"
      } else if (msg === " 트꾸") {
         msg = "https://kimustory.kro.kr/"
      } else if (msg === " 디보이끄투") {
         msg = "https://dboikkutu.kro.kr/"
      } else if (msg === " 그레이끄투") {
         msg = "https://graykkutu.kro.kr/"
      } else if (msg === " 체리끄투") {
         msg = "http://cherrykkutu.kro.kr/"
      } // 없는 것도 있다. 없으면 체리끄투 채팅에 없다고 알리자.
      // 만일 !ek ㅁㄴㅇㄹ 라고 하면 사이트가 ㅁㄴㅇㄹ 가 된다 저기 if 문에 없다면 사이트로도 가능하다.
      request.get({ url: msg + "servers" }, function (e, r, body) { // 아까 120 줄에서 설명했다.
         if (!body) body = "해당 끄투 연결 안됨.";
         message.channel.send(`**${body}**`);
      })
   }
   // kill (강퇴) 기능이다 근데 이거 빠꾸(에러) 나오니 그냥 버리는게 좋다.
   /* if (message.content.startsWith("/kill")){
        var temp;
        let msg = message.content.slice(6);
        try{
           if (temp = dic[msg]){
              temp.socket.send('{"type":"error","code":410}');
              temp.socket.close();
           }
        } catch(e) {
           message.channel.send(e)
        }
     }
     */
   // 환율 기능이다. 저런닷컴과 체리끄투가 환전소로 거듭나 만든 기능이다.
   if (message.content.startsWith("/un")) { // !un 123 이라고 하면 환율을 수정한다 DB와 전혀 무관하다.
      var msg = message.content.slice(3) // msg 를 선언하고,
      un(msg) // 84줄에 function un 이 있다. 수정할려면 84 줄 아래를 수정하면 된다.


   }
}) // 여기서 이제 Bot.on 의 괄호가 끝난다.



// 봇 로그인
Bot.login(GLOBAL.BOT_SETTING.BOT_TOKEN); // 봇을 이제 로그인 한다. 토큰이 필요하믈 글로벌.json 에서 토큰을 넣어야 한다 안넣으면 망한다. 꼭 넣자. 안넣으면 그냥 명령어 잇어도 안돌아간다.
// 토큰 얻는 법은 : discord.com/developers 에 들어가서 자신의 봇을 누르고 Bot 메뉴에 들어간다. 그러면 자신의 봇 이름 아래 Token 이라는 것이 있을거다 그러면 copy 하면 토큰이 복사 되었다 꼭 노출되면 안된다 노출 되면 디스코드에서 감지되어 자동으로 토큰을 변경하는 시스템이 있기에 그냥 노출 하지 말고 global 에 token 을 잘 집어 넣어 사용 하도록 하자.
//