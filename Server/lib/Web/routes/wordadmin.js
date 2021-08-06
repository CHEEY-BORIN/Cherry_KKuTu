/**
 * Rule the words! KKuTu Online
 * Copyright (C) 2017 JJoriping(op@jjo.kr)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

 var File	 = require("fs");
 var MainDB	 = require("../db");
 var Bot     = require("../../Game/bot")
 var GLOBAL	 = require("../../sub/global.json");
 var JLog	 = require("../../sub/jjlog");
 var Lizard	 = require("../../sub/lizard.js");

 exports.run = function(Server, page){

 Server.get("/admin/us", function(req, res){
	 if(!checkAdmin(req, res)) return;

	 req.session.admin = true;
	 page(req, res, "wordadmin");
 });
 Server.get("/admin/word/injeong", function(req, res){
	 if(!checkAdmin(req, res)) return;

	 MainDB.kkutu_injeong.find([ 'theme', { $not: "~" } ]).limit(100).on(function($list){
		 res.send({ list: $list });
	 });
 });
 Server.get("/admin/word/kkutudb/:word", function(req, res){
	 if(!checkAdmin(req, res)) return;

	 var TABLE = MainDB.kkutu[req.query.lang];

	 if(!TABLE) return res.sendStatus(400);
	 if(!TABLE.findOne) return res.sendStatus(400);
	 TABLE.findOne([ '_id', req.params.word ]).on(function($doc){
		 res.send($doc);
	 });
 });
 Server.get("/admin/word/kkututheme", function(req, res){
	 if(!checkAdmin(req, res)) return;

	 var TABLE = MainDB.kkutu[req.query.lang];

	 if(!TABLE) return res.sendStatus(400);
	 if(!TABLE.find) return res.sendStatus(400);
	 TABLE.find([ 'theme', new RegExp(req.query.theme) ]).limit([ '_id', true ]).on(function($docs){
		 res.send({ list: $docs.map(v => v._id) });
	 });
 });
 Server.get("/admin/word/kkutuhot", function(req, res){
	 if(!checkAdmin(req, res)) return;

	 File.readFile(GLOBAL.KKUTUHOT_PATH, function(err, file){
		 var data = JSON.parse(file.toString());

		 parseKKuTuHot().then(function($kh){
			 res.send({ prev: data, data: $kh });
		 });
	 });
 });
 Server.post("/admin/word/injeong", function(req, res){
	 if(!checkAdmin(req, res)) return;
	 if(req.body.pw != GLOBAL.PASS) return res.sendStatus(400);

	 var list = JSON.parse(req.body.list).list;
	 var themes;

	 list.forEach(function(v){
		 if(v.ok){
			 req.body.nof = true;
			 req.body.lang = "ko";
			 v.theme.split(',').forEach(function(w, i){
				 setTimeout(function(lid, x){
					 req.body.list = lid;
					 req.body.theme = x;
					 onKKuTuDB(req, res);
				 }, i * 1000, v._id.replace(/[^가-힣0-9]/g, ""), w);
			 });
		 }else{
			 MainDB.kkutu_injeong.update([ '_id', v._origin ]).set([ 'theme', "~" ]).on();
		 }
		 // MainDB.kkutu_injeong.remove([ '_id', v._origin ]).on();
	 });
	 res.sendStatus(200);
 });
 Server.post("/admin/word/kkutudb", onKKuTuDB);
 function onKKuTuDB(req, res){
	 if(!checkAdmin(req, res)) return;
	 if(req.body.pw != GLOBAL.PASS) return res.sendStatus(400);

	 var theme = req.body.theme;
	 var list = req.body.list;
	 var TABLE = MainDB.kkutu[req.body.lang];

	 if(!list) return res.sendStatus(400);
	 if(!TABLE) return res.sendStatus(400);
	 if(!TABLE.insert) return res.sendStatus(400);
	 Bot.word(list, theme);
	list = list.split(/[,\r\n]+/);

	 noticeAdmin(req, theme, list.length);
	 list.forEach(function(item){
		 if(!item) return;
		 item = item.trim();
		 if(!item.length) return;
		 TABLE.findOne([ '_id', item ]).on(function($doc){
			 if(!$doc) return TABLE.insert([ '_id', item ], [ 'type', "INJEONG" ], [ 'theme', theme ], [ 'mean', "＂1＂" ], [ 'flag', 2 ]).on();
			 var means = $doc.mean.split(/＂[0-9]+＂/g).slice(1);
			 var len = means.length;

			 if($doc.theme.indexOf(theme) == -1){
				 $doc.type += ",INJEONG";
				 $doc.theme += "," + theme;
				 $doc.mean += `＂${len+1}＂`;
				 TABLE.update([ '_id', item ]).set([ 'type', $doc.type ], [ 'theme', $doc.theme ], [ 'mean', $doc.mean ]).on();
			 }else{
				 JLog.warn(`Word '${item}' already has the theme '${theme}'!`);

			 }
		 });
	 });
	 if(!req.body.nof) res.sendStatus(200);
 }
 Server.post("/admin/word/kkutudb/:word", function(req, res){
	 if(!checkAdmin(req, res)) return;
	 if(req.body.pw != GLOBAL.PASS) return res.sendStatus(400);
	 var TABLE = MainDB.kkutu[req.body.lang];
	 var data = JSON.parse(req.body.data);

	 if(!TABLE) return res.sendStatus(400);
	 if(!TABLE.upsert) return res.sendStatus(400);

	 noticeAdmin(req, data._id);
	 if(data.mean == ""){
		 TABLE.remove([ '_id', data._id ]).on(function($res){
			 res.send($res.toString());
		 });
	 }else{
		 TABLE.upsert([ '_id', data._id ]).set([ 'flag', data.flag ], [ 'type', data.type ], [ 'theme', data.theme ], [ 'mean', data.mean ]).on(function($res){
			 res.send($res.toString());
		 });
	 }
 });
 Server.post("/admin/word/kkutuhot", function(req, res){
	 if(!checkAdmin(req, res)) return;
	 if(req.body.pw != GLOBAL.PASS) return res.sendStatus(400);

	 noticeAdmin(req);
	 parseKKuTuHot().then(function($kh){
		 var i, j, obj = {};

		 for(i in $kh){
			 for(j in $kh[i]){
				 obj[$kh[i][j]._id] = $kh[i][j].hit;
			 }
		 }
		 File.writeFile(GLOBAL.KKUTUHOT_PATH, JSON.stringify(obj), function(err){
			 res.send(err);
		 });
	 });
 });
 function noticeAdmin(req, ...args){
	 JLog.info(`[ADMIN] ${req.originalUrl} ${req.ip} | ${args.join(' | ')}`);
 }
 function checkAdmin(req, res){
	 if(global.isPublic){
		 if(req.session.profile){
			 if(GLOBAL.ADMIN.indexOf(req.session.profile.id) == -1){
				 req.session.admin = false;
				 return res.send({ error: 400 }), false;
			 }
		 }else{
			 req.session.admin = false;
			 return res.send({ error: 400 }), false;
		 }
	 }
	 return true;
 }
 function parseKKuTuHot(){
	 var R = new Lizard.Tail();

	 Lizard.all([
		 query(`SELECT * FROM kkutu_ko WHERE hit > 0 ORDER BY hit DESC LIMIT 50`),
		 query(`SELECT * FROM kkutu_ko WHERE _id ~ '^...$' AND hit > 0 ORDER BY hit DESC LIMIT 50`),
		 query(`SELECT * FROM kkutu_ko WHERE type = 'INJEONG' AND hit > 0 ORDER BY hit DESC LIMIT 50`),
		 query(`SELECT * FROM kkutu_en WHERE hit > 0 ORDER BY hit DESC LIMIT 50`)
	 ]).then(function($docs){
		 R.go($docs);
	 });
	 function query(q){
		 var R = new Lizard.Tail();

		 MainDB.kkutu['ko'].direct(q, function(err, $docs){
			 if(err) return JLog.error(err.toString());
			 R.go($docs.rows);
		 });
		 return R;
	 }
	 return R;
 }
}
