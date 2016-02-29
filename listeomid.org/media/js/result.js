var activeTab = "m-province";
var milliseconds = (new Date).getTime(); //for removing lists' chache
var version = 2; //in case province and part changes
var chartOne, chartTwo;
var colors = {"omid":"#b1ff77","osul":"#ffba77","both":"#9ffcf2","free":"#eee","second-omid":"#d8ffbb", "second-osul":"#ffdcbb", "second-free":"#f3f3f3"}

var chartOptions= {
    segmentShowStroke : true,
    segmentStrokeColor : "#fff",
    segmentStrokeWidth : 1,
    tooltipFontFamily: "Vazir, Tahoma",
    tooltipTitleFontFamily: "Vazir, Tahoma",
    scaleFontFamily: "Vazir, Tahoma",
    scaleFontSize: 14,
    tooltipTemplate: " <%=label%>: <%= numeral(circumference / 6.283).format('(0[.][00]%)') %>" ,
    percentageInnerCutout : 50, 
    animate : false,
	scaleOverride: true,
	scaleSteps: 10,
	scaleStartValue: 0, 
	scaleStepWidth: "", 
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
}

var chartOneData = [
    {
        value: 33,
        realValue: 1,
        color:"#b1ff77",
        highlight: "#d8ffbb",
        label: "لیست امید"
    },
    {
        value: 33,
        realValue: 1,
        color: "#ffba77",
        highlight: "#ffdcbb",
        label: "فقط اصولگرا"
    },
    {
        value: 33,
        realValue: 1,
        color: "#eee",
        highlight: "#f3f3f3",
        label: "مستقل"
    },	    
]


var chartTwoData = {
    labels: [],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: [],
            color: []
        },
    ]
};

$(document).ready(function(){
	loadData('m-province');
	var ctx = $("#chartOne").get(0).getContext("2d");
	chartOne = new Chart(ctx).Pie(chartOneData, chartOptions);					
	$(".chartOne .legend").html(chartOne.generateLegend());
	delete chartOptions.tooltipTemplate;

});


$("#province").change(function(){
	var province = $(this).val();
	loadProvince(province, activeTab);
});

$("#part").change(function(){
	var province = $("#province").val();
	var part = $(this).val();
	loadList(province, part, 'm-list');
})

$("#printBtn").click(function(e){
	e.preventDefault();
	window.print();
})

$("#mBtn").click(function(e){
	e.preventDefault();
	$(".activeText").html($(this).text());
	activeTab = "m-province";
	loadData('m-province');
	$(this).addClass('active');
	$("#khBtn").removeClass('active');
	$(".part-section").show();
	$(".province-parent").parent().removeClass("eleven").addClass("three");
});

$("#khBtn").click(function(e){
	e.preventDefault();
	$(".activeText").html($(this).text());
	activeTab = "kh-province";
	loadData('kh-province');
	$(this).addClass('active');
	$("#mBtn").removeClass('active');
	$(".part-section").hide();
	$(".province-parent").parent().addClass("eleven").removeClass("three");
});

function loadData(fileName){
	$.getJSON( "./data/" + fileName + ".json?v=" + version, function( data ) {
	
	$("#province").html('<option value="-1" selected="selected">کل کشور</option>');
	  $.each( data, function( key, val ) {
	  	var item = fileName=="kh-province" ? val : key;
		$( "<option/>", {
		    html: item,
		  }).appendTo( "#province" );
	  });
		
		province = "-1";
		
	  $("#province option:contains('"+province+"')").prop('selected',true);
	  loadProvince(province, fileName);
	});
}


function loadProvince(province, fileName){
	$.getJSON( "./data/" + fileName + ".json?v=" + version, function( data ) {
	  
	  $("#part").html('');
	  
	  $.each( data[province], function( key, val ) {
		$( "<option/>", {
		    html: val,
		  }).appendTo( "#part" );
	  });

	if (fileName=="m-province"){
		if (province!="-1"){
			part = data[province][0];
			$("#part option:contains('"+part+"')").prop('selected',true);
		}else{
			part = '';
		}
		var list = 'm-list';
	}else{
		part = '';
		var list = 'kh-list';
	}

		loadList(province, part, list );
	});
}


function loadList(province, part, fileName){
	chartTwoData.labels = [];
	chartTwoData.datasets[0].data = [];
	chartTwoData.datasets[0].color = [];
	$(".result .table tbody").html("");
	
	for(k in chartOne.segments){
		chartOne.segments[k].value = null;
	}

	$.getJSON( "./data/result-" + fileName + ".json?v=" + milliseconds, function( data ) {
		var totalseat = 0, totalvote = 0;
		var dataList = {"omid":0, "osul":0, "free":0, "both":0, "second":0, "total":0}
	  $.each( data, function( key, val ) {

	  	if (((val.part==part || fileName=="kh-list") && val.province==province) || province==-1){
	  		++totalseat;
	  		if (val.total && (data[key-1]!=undefined && val.part!=data[key-1].part)){
	  			totalvote += val.total;
	  		}
			

			chartOneCal(val);
			var tagClassList = {"مشترک":"both","منتخب":"chosen", "بازمانده":"notchosen","مرحله دو":"second","امید":"omid","اصولگرا":"osul","مستقل":"free"};

			if(val.lname2){
				++dataList.second;
	  			addItem("#second", val.fname, val.lname, val.vote, val.total, val.category, province);
	  			addItem("#second", val.fname2, val.lname2, val.vote2, val.total, val.category2, province);
	  		}else{
	  			if(val.lname){
					var category = val.category.replace('فقط','').trim();
					tagClass = tagClassList[category]!=undefined ? tagClassList[category] : '';	  				
					++dataList[tagClass]
	  				addItem("#total", val.fname, val.lname, val.vote, val.total, val.category, province);
	  			}	
	  		}
	
			if (val.vote>0 && province!=-1){
				var tag = '';
				if(val.lname2){
					tag = 'second-'
					chartTwoData.labels.push(val.fname2 + " " + val.lname2);
					chartTwoData.datasets[0].data.push(val.vote2);

					var category = val.category2.replace('فقط','').trim();
					tagClass = tagClassList[category]!=undefined ? tagClassList[category] : '';
					chartTwoData.datasets[0].color.push(colors[tag+tagClass]);
					
				}

				var category = val.category.replace('فقط','').trim();
				tagClass = tagClassList[category]!=undefined ? tagClassList[category] : '';
				chartTwoData.labels.push(val.fname + " " + val.lname);
				chartTwoData.datasets[0].data.push(val.vote);
				chartTwoData.datasets[0].color.push(colors[tag+tagClass]);
				
				++dataList.total;
			}

	  		if(val.l_omid){
	  			addItem("#omid", val.f_omid, val.l_omid, val.vote_omid, val.total, val.res_omid, province);
	  		}
	  		if(val.l_osul){
	  			addItem("#osul", val.f_osul, val.l_osul, val.vote_osul, val.total, val.res_osul, province);
	  		}
	  		
	  		
		}
	  });

		var tv = totalvote >0 ? numeral(totalvote).format('0,0') : '';
		$("#status .totalvote").text(tv);
		$("#status .totalseat").text(totalseat);
		$("#status .second").text(dataList.second);
		$("#status .omid").text(dataList.omid+dataList.both);
		$("#status .osul").text(dataList.osul+dataList.both);
		$("#status .free").text(dataList.free);
		
		$('.result .table tbody').each(function(){
			var n = 1;
			$(this).find('tr').each(function(){
				$(this).find('td').first().text(n);
				n++;
			})
		    if($(this).find('tr').length == 0){
		        $(this).parent().hide();
		    }else{
		    	$(this).parent().show();
		    }
		});

		if (chartTwo!=undefined){
			chartTwo.destroy();
		}
		
		if (totalvote && dataList.total>0 && province!=-1){
			$(".chartTwo").fadeIn(250);
			chartOptions.scaleStepWidth= Math.ceil(totalvote/10);
			var ctx = $("#chartTwo").get(0).getContext("2d");
			chartTwo = new Chart(ctx).Bar(chartTwoData, chartOptions);
			for(n in chartTwo.datasets[0].bars){
				chartTwo.datasets[0].bars[n].fillColor = chartTwoData.datasets[0].color[n];
			}
			MyBarChartMethods.sort(chartTwo, 0);
		}else{
			$(".chartTwo").fadeOut(250);
		}

		chartOne.update();
		
	});
}

function addItem(listId, fname, lname, vote, total, category, status){
	listId = ".result table" + listId + " tbody";

	if (status==-1){
		return false;
	}
	var items = '', tagClass='';
	
	//items+="<td>" + (parseInt($(listId + " td").length/$(listId + " th").length) + 1) + "</td>"
	items+="<td></td>";	

	items+='<td>'
	items+= fname + " ";
	items+= lname;
	items+="</td>";

	if(vote || total){
			
		items+="<td>" + numeral(vote).format('0,0') + "</td>";
		var rate = ''
			
		if (vote && total){
			rate = vote / total;
			rate = numeral(rate).format('0.00 %');
		}

		items+="<td>" + rate + "</td>";
	}else{
		items+="<td></td><td></td>";
	}

	if(category){
		category = category.replace('فقط','').trim();
		var tagClassList = {"مشترک":"both","منتخب":"chosen", "بازمانده":"notchosen","مرحله دو":"second","امید":"omid","اصولگرا":"osul","مستقل":"free"};
		tagClass = tagClassList[category]!=undefined ? tagClassList[category] : '';
		items+="<td>" + category + "</td>";
	}else{
		items+="<td></td>";	
	}

	items+="<td></td>";	

	$( "<tr/>", {
	    html: items,
	    class: tagClass
	  }).appendTo(listId);

	if (vote){
		$( listId + " tr").sort(function(a,b){
			a = numeral().unformat($(a).find('td:nth(2)').text())
			b = numeral().unformat($(b).find('td:nth(2)').text())
			if(a>b){
				return -1;
			}else{
				return 1;
			}
		}).appendTo(listId);
	}
	
}


function chartOneCal(data){
	
	data.category = data.category.replace('فقط','').trim();
	var categoryList = {"مشترک":"both","منتخب":"chosen", "بازمانده":"notchosen","مرحله دو":"second","امید":"omid","اصولگرا":"osul","مستقل":"free"};
	var dataList = {"omid":0, "osul":1, "free":2, "both":0}
	var categoryItem = categoryList[data.category]!=undefined ? categoryList[data.category] : '' ;	

	if (categoryItem && !data.category2){
		++chartOne.segments[dataList[categoryItem]].value;
	}

	if (data.category2){
		chartOne.segments[dataList[categoryItem]].value+=0.5;
		data.category2 = data.category2.replace('فقط','').trim();	
		categoryItem = categoryList[data.category2]!=undefined ? categoryList[data.category2] : '' ;		
		chartOne.segments[dataList[categoryItem]].value+=0.5;
	}

}


var MyBarChartMethods = {
    // sort a dataset
    sort: function (chart, datasetIndex) {
        var data = []
        chart.datasets.forEach(function (dataset, i) {
            dataset.bars.forEach(function (bar, j) {
                if (i === 0) {
                    data.push({
                        label: chart.scale.xLabels[j],
                        values: [bar.value]
                    })
                } else 
                    data[j].values.push(bar.value)
            });
        })

        data.sort(function (a, b) {
            if (a.values[datasetIndex] > b.values[datasetIndex])
                return -1;
            else if (a.values[datasetIndex] < b.values[datasetIndex])
                return 1;
            else
                return 0;
        })

        chart.datasets.forEach(function (dataset, i) {
            dataset.bars.forEach(function (bar, j) {
                if (i === 0)
                    chart.scale.xLabels[j] = data[j].label;
                bar.label = data[j].label;
                bar.value = data[j].values[i];
            })
        });
        chart.update();
    },
    // reload data
    reload: function (chart, datasetIndex, labels, values) {
        var diff = chart.datasets[datasetIndex].bars.length - values.length;
        if (diff < 0) {
            for (var i = 0; i < -diff; i++)
                chart.addData([0], "");
        } else if (diff > 0) {
            for (var i = 0; i < diff; i++)
                chart.removeData();
        }

        chart.datasets[datasetIndex].bars.forEach(function (bar, i) {
            chart.scale.xLabels[i] = labels[i];
            bar.value = values[i];
        })
        chart.update();
    }
}