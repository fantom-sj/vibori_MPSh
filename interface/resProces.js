$('#input_itogi').on('change', function(){
	console.log("Итоги голосования загружены");
	
	let file = this.files[0];
	$(this).next().html(file.name);
	
	let reader = new FileReader();
	reader.readAsText(file);
	
	reader.onload = function() {
		//console.log(reader.result);
		eel.loadItogi(reader.result);
	};
	
	reader.onerror = function() {
		console.log(reader.error);
	};
	
});

$('#input_spiski').on('change', function(){
	console.log("Списки голосующих загружены");
	
	let file = this.files[0];
	$(this).next().html(file.name);
	
	let reader = new FileReader();
	reader.readAsText(file);
	
	reader.onload = function() {
		//console.log(reader.result);
		eel.loadSpiski(reader.result);
	};
	
	reader.onerror = function() {
		console.log(reader.error);
	};
});

eel.expose(printResult);
function printResult(results) {
	console.log("Обработанные данные");
	
	//results = JSON.parse(results);
	console.log(results);
	var total_v = 0;
	
	var name = [
		'Школа "Лидер"',
		'Общественное движение "Волонтеры культуры г. Шахты"',
		'Шахтинская городская организация профсоюза работников народного образования и науки',
		'Институт сферы обслуживания и предпринимательства (филиал) ДГТУ в г. Шахты',
		'Студенческий совет Шахтинского техникума дизайна и сервиса "Дон-Текс"',
		'Шахтинский автодорожный институт (филиал) ЮРГПУ (НПИ) им. М.И. Платова'
	];
	
	$.each(results, function(key, count) {
		total_v+=count;
	});
	
	$( ".table_results" ).html('');
			
	function add(txt){
		$('.table_results').html($('.table_results').html() + txt);
	}
	
	add("<tr>" +
			"<th>Код кандидата</th>" +
			"<th>Название организации кандидата</th>" +
			"<th>Процент и количество проголосовавших</th>" + 
		"</tr>"
	);
	
	for(var i in results) {
		var x;
		var percent;
		
		x = results[i]/(total_v/100.0); 
		percent = Math.round(x*100)/100;

		add("<tr>"+
				"<td class='pref' width='200'>" + 
					"<font class='circle kod-kandidata'>ГОЛОС "+ i +"</font>" + 
				"</td>"+
				
				"<td class='name' width='400'>" + 
					"<font class='organizaciy'>"+ name[i-1] + "</font>" + 
				"</td>"+
				
				"<td class='proc' width='400'>" +
					"<span class='proc'>"+
						"<div style='border-radius: 10px; height:100%; float:left; background: #3772ff; width:" +100*results[i]/total_v+"%'>&nbsp;</div>"+
						"<div style='height:100%; width:100%;'>" + 
							"<font class='itogi'>&nbsp;" + percent + " % (" + results[i] +")</font>" + 
						"</div>" +
					"</span>" + 
				"</td>"+
			"</tr>"
		);
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
};