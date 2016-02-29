var activeTab = "m-province";
var milliseconds = (new Date).getTime(); //for removing lists' chache
var version = 2; //in case province and part changes
var chartOne, chartTwo, chartThree;
var colors = {"omid":"#3cb8c2","osul":"#ebdd68","both":"#74b1eb","free":"#ada8f6","second-omid":"#9ddbe0", "second-osul":"#f5eeb3", "second-free":"#d6d3fa"}

var chartOptions= function(){return {
    segmentShowStroke : true,
    segmentStrokeColor : "#fff",
    segmentStrokeWidth : 1,
    tooltipFontFamily: "Vazir, Tahoma",
    tooltipTitleFontFamily: "Vazir, Tahoma",
    scaleFontFamily: "Vazir, Tahoma",
    scaleFontSize: 14,
    showTooltips: true,
    tooltipTemplate: " <%=label%>: <%= numeral(circumference / 6.283).format('(0[.][00]%)') %>" ,
    percentageInnerCutout : 50, 
    animate : false,
	scaleOverride: true,
	scaleSteps: 10,
	scaleStartValue: 0, 
	scaleStepWidth: "", 
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
}}

var chartOneData = function (){return [
    {
        value: 14.28,
        color: colors.free,
        label: "مستقل"
    },
    {
        value: 14.28,
        color: colors.omid,
        label: "لیست امید"
    },
    {
        value: 14.28,
        color: colors.both,
        label: "مشترک"
    },      
    {
        value: 14.28,
        color: colors.osul,
        label: "اصولگرا"
    },
    {
        value: 14.28,
        color: colors['second-free'],
        label: "مستقل ـ مرحله دوم"
    }, 
	{
        value: 14.28,
        color: colors['second-omid'],
        label: "لیست امید ـ مرحله دوم"
    },        
    {
        value: 14.28,
        color: colors['second-osul'],
        label: "اصولگرا ـ مرحله دوم"
    },
   	    
]}

var chartThreeData = function (){return [
    {
        value: 33,
        color: colors.omid,
        label: "راه‌یافته"
    },
    {
        value: 33,
        color: colors['second-omid'],
        label: "مرحله دوم"
    },
    {
        value: 33,
        color: '#eee',
        label: "بازمانده"
    }
   	    
]}


var chartTwoData = {
    labels: [],
    datasets: [
        {
            fillColor: "rgba(220,220,220,0.5)",
            data: [],
            color: []
        },
    ]
};

$(document).ready(function(){
	loadData('m-province');
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
	$(".m-second").fadeIn(250);
	activeTab = "m-province";
	loadData('m-province');
	$(this).addClass('active');
	$("#khBtn").removeClass('active');
	$(".part-section").show();
	$(".province-parent").parent().removeClass("twelve").addClass("three");
});

$("#khBtn").click(function(e){
	e.preventDefault();
	$(".activeText").html($(this).text());
	$(".m-second").fadeOut(250);
	activeTab = "kh-province";
	loadData('kh-province');
	$(this).addClass('active');
	$("#mBtn").removeClass('active');
	$(".part-section").hide();
	$(".province-parent").parent().addClass("twelve").removeClass("three");
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
	var title='';
	if(province!=-1){
		$(".list").show();
		$(".statusOmid").addClass('ahidden');
		if (fileName=="kh-list"){
			title = 'میزان توفیق جریان‌های سیاسی در حوزه انتخابیه «'+province+'» برای مجلس خبرگان ششم'
		}else{
			title = 'میزان توفیق جریان‌های سیاسی در حوزه انتخابیه «'+part+'» برای مجلس دهم'
		}
		$("#chartOneTitle").text(title);

		if (fileName=="kh-list"){
			title = 'نسبت آرا نمایندگان جریان‌های سیاسی در حوزه‌ی انتخابیه «'+province+'»';
		}else{
			title = 'نسبت آرا نمایندگان جریان‌های سیاسی در حوزه‌ی انتخابیه «'+part+'»';
		}
		$("#chartTwoTitle").text(title);				
	}else{
		if (fileName=="kh-list"){
			title = 'میزان توفیق نامزدهای لیست امید در ۷۷ حوزه‌ای که وارد رقابت حداقلی شده بودند'
		}else{
			title = 'میزان توفیق نامزدهای لیست امید در ۲۳۳ حوزه‌ای که وارد رقابت حداقلی شده بودند'
		}
		$("#chartThreeTitle").text(title);	

		if (fileName=="kh-list"){
			title = 'میزان توفیق جریان‌های سیاسی در کل کشور برای مجلس خبرگان ششم'
		}else{
			title = 'میزان توفیق جریان‌های سیاسی در کل کشور برای مجلس دهم'
		}
		$("#chartOneTitle").text(title);	

		$(".list").hide();
		$(".statusOmid").removeClass('ahidden')
	}

	
	if (chartOne!=undefined){
		chartOne.destroy();
	}

	if (chartThree!=undefined){
		chartThree.destroy();
	}	

	var xtemp = chartOneData();
	if(fileName=="kh-list"){
		xtemp.length = 4;
		xtemp[0].value = 25;
		xtemp[1].value = 25;
		xtemp[2].value = 25;
		xtemp[3].value = 25;
		
	}
	
	var ctx = $("#chartOne").get(0).getContext("2d");
	chartOne = new Chart(ctx).Pie(xtemp, chartOptions());					
	$(".chartOne .legend").html(chartOne.generateLegend());

	for(k in chartOne.segments){
		chartOne.segments[k].value = null;
	}

	var xtemp2 = chartThreeData();	
	var ctx = $("#chartThree").get(0).getContext("2d");
	chartThree = new Chart(ctx).Pie(xtemp2, chartOptions());					
	$(".chartThree .legend").html(chartThree.generateLegend());

	for(k in chartThree.segments){
		chartThree.segments[k].value = null;
	}
	
	$.getJSON( "./data/result-" + fileName + ".json?v=" + milliseconds, function( data ) {
		var totalseat = 0, totalvote = 0;
		var dataList = {"omid":0, "osul":0, "free":0, "both":0, "second":0, "total":0,"omid_chosen":0,"omid_notchosen":0,"omid_second":0}
	  $.each( data, function( key, val ) {

	  	if (((val.part==part || fileName=="kh-list") && val.province==province) || province==-1){
	  		++totalseat;
	  		if (val.total && (data[key-1]!=undefined && val.part!=data[key-1].part)){
	  			totalvote += val.total;
	  		}
	  		
			if (fileName=="kh-list" && val.total && (data[key-1]!=undefined && val.province!=data[key-1].province || key==0)){
	  			totalvote += val.total;
	  		}

			chartOneCal(val);
			if (province==-1){
				chartThreeCal(val);
			}

			var tagClassList = {"مشترک":"both","منتخب":"chosen", "بازنده":"notchosen","مرحله دو":"second","امید":"omid","اصولگرا":"osul","مستقل":"free"};

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
	
			if (val.vote>0 && province!=-1 && val.lname && !val.lname2){
				var tag = '';
				if(val.lname2){
					tag = 'second-'
					chartTwoData.labels.push(val.fname2 + " " + val.lname2);
					chartTwoData.datasets[0].data.push(val.vote2);

					var category = val.category2.replace('فقط','').trim();
					tagClass = tagClassList[category]!=undefined ? tagClassList[category] : '';
					chartTwoData.datasets[0].color[val.vote2]=colors[tag+tagClass];
					
				}

				var category = val.category.replace('فقط','').trim();
				tagClass = tagClassList[category]!=undefined ? tagClassList[category] : '';
				chartTwoData.labels.push(val.fname + " " + val.lname);
				chartTwoData.datasets[0].data.push(val.vote);
				chartTwoData.datasets[0].color[val.vote]=colors[tag+tagClass];
				
				++dataList.total;
			}



	  		 if(val.res_omid){
	  		 	//addItem("#omid", val.f_omid, val.l_omid, val.vote_omid, val.total, val.res_omid, province);
				var res_omid = val.res_omid.trim();
				tagClass = tagClassList[res_omid]!=undefined ? tagClassList[res_omid] : '';
	  		 	++dataList['omid_'+tagClass];
	  		 }
	  		// if(val.l_osul){
	  		// 	addItem("#osul", val.f_osul, val.l_osul, val.vote_osul, val.total, val.res_osul, province);
	  		// }
	  		
	  		
		}
	  });

		var tv = totalvote >0 ? numeral(totalvote).format('0,0') : '';
		$("#status .totalvote").text(tv);
		$("#status .totalseat").text(totalseat);
		$("#status .second").text(dataList.second);
		$("#status .omid").text(dataList.omid+dataList.both);
		$("#status .osul").text(dataList.osul+dataList.both);
		$("#status .both").text(dataList.both);
		$("#status .free").text(dataList.free);
		
		$("#statusOmid .chosen").text(dataList.omid_chosen);
		$("#statusOmid .second").text(dataList.omid_second);
		$("#statusOmid .notchosen").text(dataList.omid_notchosen);


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
			var cOptions = chartOptions() ;
			delete cOptions.tooltipTemplate ;						
			cOptions.scaleStepWidth= Math.ceil(totalvote/10);
			cOptions.showTooltips= false;
			var ctx = $("#chartTwo").get(0).getContext("2d");
			chartTwo = new Chart(ctx).Bar(chartTwoData, cOptions);
			MyBarChartMethods.sort(chartTwo,0)
			for(n in chartTwo.datasets[0].bars){
				chartTwo.datasets[0].bars[n].fillColor = chartTwoData.datasets[0].color[chartTwo.datasets[0].bars[n].value];
			}
			
		}else{
			$(".chartTwo").fadeOut(250);
		}

		chartOne.update();
		chartThree.update();

		if(fileName=="kh-list"){
			$(".chartOne .pie-legend").css('top','45px');
			$(".chartThree .pie-legend").css('top','70px');
			$(".result #statusOmid").css('margin-top','60px');
			$(".chartThree .pie-legend li:nth(1)").hide()
		}else{
			$(".chartOne .pie-legend").css('top','2px');
			$(".chartThree .pie-legend").css('top','55px');
			$(".result #statusOmid").css('margin-top','44px');
			$(".chartThree .pie-legend li:nth(1)").show()
		}
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
		var tagClassList = {"مشترک":"both","منتخب":"chosen", "بازنده":"notchosen","مرحله دو":"second","امید":"omid","اصولگرا":"osul","مستقل":"free"};
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
	var categoryList = {"مشترک":"both","منتخب":"chosen", "بازنده":"notchosen","مرحله دو":"second","امید":"omid","اصولگرا":"osul","مستقل":"free"};
	var dataList = {"omid":1, "osul":3, "free":0, "both":2}
	var categoryItem = categoryList[data.category]!=undefined ? categoryList[data.category] : '' ;	

	if (categoryItem && !data.category2){
		++chartOne.segments[dataList[categoryItem]].value;
	}

	if (data.category2){
		var dataList = {"omid":5, "osul":6, "free":4, "both":2}
		chartOne.segments[dataList[categoryItem]].value+=0.5;
		data.category2 = data.category2.replace('فقط','').trim();	
		categoryItem = categoryList[data.category2]!=undefined ? categoryList[data.category2] : '' ;		
		chartOne.segments[dataList[categoryItem]].value+=0.5;
	}

}

function chartThreeCal(data){
	
	data.res_omid = data.res_omid.trim();
	var categoryList = {"مشترک":"both","منتخب":"chosen", "بازنده":"notchosen","مرحله دو":"second","امید":"omid","اصولگرا":"osul","مستقل":"free"};
	var dataList = {"chosen":0, "second":1 ,"notchosen":2}
	var categoryItem = categoryList[data.res_omid]!=undefined ? categoryList[data.res_omid] : '' ;	

	if (categoryItem){
		if (dataList[categoryItem]!=2){
			++chartThree.segments[dataList[categoryItem]].value;
		}else{
			chartThree.segments[dataList[categoryItem]].value+=0.5;
		}
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
