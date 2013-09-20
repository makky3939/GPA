var Visualizer4GPA = (function(){

var inEle      = $('div.input');
var outEle     = $('div.out');
var outinfoEle = $('div.outinfo');

var barChartData = {
		column   :6,
		labels   : ["A+","A","B","C","D","P","F"],
		datasets : [
			{
				fillColor   : "rgba(151,187,205,0.5)",
				strokeColor : "rgba(151,187,205,1.0)",
				data        : [0,0,0,0,0,0,0]
			}
		]
	}
var radarChartData = {
		column   :8,
		labels   : ["A","B","C"],
		datasets : [
			{
				fillColor   : "rgba(220,220,220,0.5)",
				strokeColor : "rgba(220,220,220,1)",
				pointColor  : "rgba(220,220,220,1)",
				pointStrokeColor : "#fff",
				data        : [0,0,0]
			}
		]
	}

function _init() {
	inEle.on('dragenter', function(e){e.preventDefault();dataEnter(e);})
		 .on('dragover',  function(e){e.preventDefault();})
		 .on('dragleave',  function(e){e.preventDefault();dataOut(e);})
		 .on('drop',      function(e){e.preventDefault();dataInput(e);});
};

function dataEnter(e){
	inEle.css({'border-color':'#4ECDC4','opacity':'1'});
}

function dataOut(e){
	inEle.css({'border-color':'#fff','opacity':'0'});
}

function dataInput(e){
inEle.css({'border-color':'#fff','opacity':'0'});
var files = e.originalEvent.dataTransfer.files;
	
for (var i=0; i<files.length; i++) {
	if (files[i].type === 'application/vnd.ms-excel' || files[i].type === 'text/csv'){
		var reader = new FileReader();
		
		reader.onerror = function(e) {
			console.log('error', e.target.error.code);
		}
		
        reader.onload = function(e){
			var gpa = totalizationCSV(e.target.result,  barChartData);
					  totalizationCSV(e.target.result,radarChartData);

			outEle.html(parseCSV(e.target.result));
			outinfoEle.html("GPA:"+CalculationGPA(gpa));
			
			myLine = new Chart(document.getElementById("canvas") .getContext("2d")).Bar(barChartData);
			myLine = new Chart(document.getElementById("canvas2").getContext("2d")).Radar(radarChartData);
			$('canvas#canvas').addClass('panel');
			$('canvas#canvas2').addClass('panel');
			outEle.addClass('panel');
        };
		
        reader.readAsText(files[i], 'utf-8');
		
		}else{
			console.log(files[i].type);
		}
    }
}

function totalizationCSV(csv,obj){
	var data = new Array(obj["labels"].length+1);
	var CR   = String.fromCharCode(13); 
	var line = csv.split(CR);
	
	for (var i=0; i<data.length; i++){data[i] = 0;}

	for (var i=1; i<line.length-1; i++){
		var column = line[i].split(",");

		for(var j=0; j<obj["labels"].length; j++){
				
			if(column[obj["column"]].split('"')[1] === obj["labels"][j]){
				data[j] += parseFloat(column[5].split('"')[1]);
			}
		
		}

	}

	for(var i=0;i<obj["labels"].length;i++){
		obj["datasets"][0].data[i] = data[i];
	}

	return data;
	
}

function parseCSV(csv){
	var temp_column = "";
	var column_head  = ["学籍番号","学生氏名","科目番号","科目コード","科目名 ","単位数","総合評価","認定年度","科目区分","認定学期"];
	var result      = '<table class="table">';
	var CR          = String.fromCharCode(13); 
	var line        = csv.split(CR);
	
	result += "<tr>";
	for(var i=0; i<column_head.length; i++){
		result += "<th>"+ column_head[i] + "</th>";
	}
	result += "</tr>";
	
	for (var i=1; i<line.length-1; i++){
		var column = line[i].split(",");
		result += "<tr>";
		
		for (j=0; j<column.length; j++){
			temp_column = column[j].split('"')[1]; 
			result += "<td>"+ temp_column + "</td>";
		}
	
		result += "</tr>";
		
	}
	
	result += "</table>";
	return result;
	
}

function CalculationGPA(data){

	return ((data[0]*4 + data[1]*3 + data[2]*2 + data[3]*1) / (data[0] + data[1] + data[2] + data[3] + data[4])).toFixed(3);

}
 
_init();
  
return 0;

}());