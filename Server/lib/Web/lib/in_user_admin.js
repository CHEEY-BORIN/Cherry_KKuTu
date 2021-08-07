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
(function(){
	var WIDTH = { 'y': 50, 't': 50, 'g': 100, 'l': 200, 'm': 600 };
	var $temp = {};
	var load = require("../../Game/load")

	$(document).ready(function(){
		$("#user-go").on('click', function(e){
			$.get("/admin/us/users?id=" + $("#user-id").val() + "&name=" + $("#user-nick").val(), function(res){
				var $table = $("#user-data").empty();
				var $r;

				res.list.forEach(function(item){
					$table.append($r = $("<tr>").attr('id', ['ur', item._id].join('-')));
					$r
						.append($("<td>").append(putter("ud-" + item._id + "-_id", 'g', item._id)))
						.append($("<td>").append(putter("ud-" + item._id + "-money", 'g', item.money)))
						.append($("<td>").append(putter("ud-" + item._id + "-kkutu", 'l', JSON.stringify(item.kkutu || {}))))
						.append($("<td>").append(putter("ud-" + item._id + "-box", 'l', JSON.stringify(item.box || {}))))
						.append($("<td>").append(putter("ud-" + item._id + "-equip", 'l', JSON.stringify(item.equip || {}))))
						.append($("<td>").append(putter("ud-" + item._id + "-nickname", 'g', item.nickname)))
						.append($("<td>").append(putter("ud-" + item._id + "-nickChanged", 'g', item.nickChanged)))
						.append($("<td>").append(putter("ud-" + item._id + "-exordial", 'g', item.exordial)))
						.append($("<td>").append(putter("ud-" + item._id + "-server", 't', item.server)))
						.append($("<td>").append(putter("ud-" + item._id + "-lastLogin", 't', item.lastLogin)))
            .addend($("<td>").append(putter("ud-" + item._id + "-warn", 't', item.warn)))
						.append($("<td>").append(putter("ud-" + item._id + "-black", 'g', item.black)))
						/* Enhanced User Block System [S] */
						.append($("<td>").append(putter("ud-" + item._id + "-blockedUntil", 'g', item.blockedUntil)))
						/* Enhanced User Block System [E] */
						.append($("<td>").append(putter("ud-" + item._id + "-friends", 'g', JSON.stringify(item.friends || {}))));
				});
			});
		});
		$("#user-apply").on('click', function(e){
			var list = [];

			$("#user-data tr:visible").each(function(i, o){
				var $data = $(o).find("td>input");

				list.push({
					_id: $data.get(0).value,
					money: $data.get(1).value,
					kkutu: $data.get(2).value,
					box: $data.get(3).value,
					equip: $data.get(4).value,
					nickname: $data.get(5).value,
					nickChanged: $data.get(6).value,
					exordial: $data.get(7).value,
					server: $data.get(8).value,
					lastLogin: $data.get(9).value,
					black: $data.get(10).value,
					/* Enhanced User Block System [S] */
					blockedUntil: $data.get(11).value,
					friends: $data.get(12).value
				});
			});
			$.post("/gwalli/users", {
				list: JSON.stringify({ list: list }),
				pw: $("#db-password").val()
			}, function(res){
				alert(res);
			});
		});
	$("#")
	// 유저 감시하기
		$("#gamsi-go").on('click', function(e){
			clearInterval($temp._gamsi);

			var $data = $("#gamsi-data").empty();
			var list = $("#gamsi-id").val().split(/,\s*/);
			var i, len = list.length;

			for(i in list){
				$data.append($("<tr>").attr('id', "gamsi-" + list[i]).html("<td>(" + list[i] + ") 감시 시작</td>"));
				onGamsi();
			}
			i = 0;
			$temp._gamsi = setInterval(onGamsi, 10000);

			function onGamsi(){
				var cid = list[i];
				var $obj = $("#gamsi-" + cid);

				$.get("/gwalli/gamsi?id=" + cid, function(res){
					if(!res) return $obj.html("(없는 사용자)" + cid);
					$obj.html([ res._id, res.title || "-", "<a target='_blank' href='/?server=" + res.server + "'>" + res.server + "</a>" ].map(function(v){ return "<td>" + v + "</td>"; }));
				});
				i = (i + 1) % len;
			}
		});
		// 끄투 공지 발송
	$("#kkutu-notice-ok").on('click', function(e){
		load.yell($("#kkutu-notice-text").val(),"useradmin","관리자 페이지")
	});
});
})();
