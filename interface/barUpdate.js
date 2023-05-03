function bar_update() {
	var proxy_main = 'https://api.allorigins.win/get?url=';
	var proxy_dop  = 'https://cors-anywhere.herokuapp.com/';
	var URLData    = 'URL not available';
	
	$.getJSON(proxy_main + encodeURIComponent(URLData), 
		function (data) {
			//console.log(data.contents);
			data = JSON.parse(data.contents)
			//console.log(data);
			
			var result = 0;
			var total_v = 0;
			
			$.each(data, function(key, val) {
				total_v+=val.count
			});
			
			$( ".table_striped_main" ).html('');
			
			function add(txt){
				$('.table_striped_main').html($('.table_striped_main').html() + txt);
			}
			
			add("<tr>" +
					"<th>Код кандидата</th>" +
					"<th>Название организации кандидата</th>" +
					"<th>Процент и количество проголосовавших</th>" + 
				"</tr>"
			);
				
			for(var i in data) {
				//console.log("---------");
				//console.log("Номер " + i);
				//console.log("Участник " + data[i].name);
				//console.log("Количество SMS " + data[i].count);
				
				//result += data[i].count;
				
				var x;
				var percent;
				
				x = data[i].count/(total_v/100.0); 
				percent = Math.round(x*100)/100;
				
				

				add("<tr>"+
						"<td class='pref' width='200'>" + 
							"<font class='circle kod-kandidata'>ГОЛОС "+ i +"</font>" + 
						"</td>"+
						
						"<td class='name' width='400'>" + 
							"<font class='organizaciy'>"+ data[i].name + "</font>" + 
						"</td>"+
						
						"<td class='proc' width='400'>" +
							"<span class='proc'>"+
								"<div style='border-radius: 10px; height:100%; float:left; background: #3772ff; width:" +100*data[i].count/total_v+"%'>&nbsp;</div>"+
								"<div style='height:100%; width:100%;'>" + 
									"<font class='itogi'>&nbsp;" + percent + " % (" + data[i].count +")</font>" + 
								"</div>" +
							"</span>" + 
						"</td>"+
					"</tr>"
				);
				
				/*var id  = data[i].id;
				var prs = "width: "+data[i].prs + "%;";
				var value = data[i].count+" sms";
				html_id="bar_"+id;
				document.getElementById(html_id).style = prs;
				document.getElementById(html_id).innerHTML = value;*/
			}
			
			add("<tr><td><br></td></tr>");
			add("<tr>" +
						"<td></td>" +
						"<td class='name' width='400'>" + 
							"<font class='organizaciy'>Всего проголосовавших</font>" + 
						"</td>"+
						"<td class='proc' width='400'>" +
							"<span class='proc'>"+
								"<div style='height:100%; width:100%;'>" + 
									"<font class='itogi'>" + total_v +"</font>" + 
								"</div>" +
							"</span>" + 
						"</td>"+
					"</tr>"
			);
		}
	);
		
	$.ajax({ 
		type: 'POST', 
		url: proxy_dop + URLData,
		headers: {  'Access-Control-Allow-Origin': '*' },
		dataType: 'json',
		success: function (data) {
			console.log(data);
			
			var result = 0;
			var total_v = 0;
			
			$.each(data, function(key, val) {
				total_v+=val.count
			});
			
			$( ".table_striped_dop" ).html('');
			
			function add(txt){
				$('.table_striped_dop').html($('.table_striped_dop').html() + txt);
			}
			
			add("<tr>" +
					"<th>Код кандидата</th>" +
					"<th>Название организации кандидата</th>" +
					"<th>Процент и количество проголосовавших</th>" + 
				"</tr>"
			);
			
			for(var i in data) {
				//console.log("---------");
				//console.log("Номер " + i);
				//console.log("Участник " + data[i].name);
				//console.log("Количество SMS " + data[i].count);
				
				//result += data[i].count;
				
				var x;
				var percent;
				
				x = data[i].count/(total_v/100.0); 
				percent = Math.round(x*100)/100;

				add("<tr>"+
						"<td class='pref' width='200'>" + 
							"<font class='circle kod-kandidata'>ГОЛОС "+ i +"</font>" + 
						"</td>"+
						
						"<td class='name' width='400'>" + 
							"<font class='organizaciy'>"+ data[i].name + "</font>" + 
						"</td>"+
						
						"<td class='proc' width='400'>" +
							"<span class='proc'>"+
								"<div style='border-radius: 10px; height:100%; float:left; background: #3772ff; width:" +100*data[i].count/total_v+"%'>&nbsp;</div>"+
								"<div style='height:100%; width:100%;'>" + 
									"<font class='itogi'>&nbsp;" + percent + " % (" + data[i].count +")</font>" + 
								"</div>" +
							"</span>" + 
						"</td>"+
					"</tr>"
				);
				
				//var id  = data[i].id;
				//var prs = "width: "+data[i].prs + "%;";
				//var value = data[i].count+" sms";
				//html_id="bar_"+id;
				//document.getElementById(html_id).style = prs;
				//document.getElementById(html_id).innerHTML = value;
			}
			
			add("<tr><td><br></td></tr>");
			add("<tr>" +
						"<td></td>" +
						"<td class='name' width='400'>" + 
							"<font class='organizaciy'>Всего проголосовавших</font>" + 
						"</td>"+
						"<td class='proc' width='400'>" +
							"<span class='proc'>"+
								"<div style='height:100%; width:100%;'>" + 
									"<font class='itogi'>" + total_v +"</font>" + 
								"</div>" +
							"</span>" + 
						"</td>"+
					"</tr>"
			);
		}
	});
	setTimeout("bar_update()",5000);
}