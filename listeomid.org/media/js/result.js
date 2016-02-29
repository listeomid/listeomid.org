var activeTab = "m-province";
var milliseconds = (new Date).getTime(); //for removing lists' chache
var version = 2; //in case province and part changes
var chartOne;

var chartOptions= {
    segmentShowStroke : true,
    segmentStrokeColor : "#fff",
    segmentStrokeWidth : 1,
    tooltipFontFamily: "Vazir, Tahoma",
    tooltipTemplate: " <%=label%>: <%= numeral(circumference / 6.283).format('(0[.][00]%)') %>" ,
    percentageInnerCutout : 50, 
    animationSteps : 30,
    animationEasing : "linear",
    animateRotate : false,
    animateScale : false,
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
}

var chartOneData = [
    {
        value: 25,
        realValue: 1,
        color:"#b1ff77",
        highlight: "#d8ffbb",
        label: "امید"
    },
    {
        value: 25,
        realValue: 1,
        color: "#fdff77",
        highlight: "#feffbb",
        label: "اصولگرا"
    },
    {
        value: 25,
        realValue: 1,
        color: "#ddd",
        highlight: "#eee",
        label: "مستقل"
    },
    {
        value: 25,
        realValue: 1,
        color: "#95bdff",
        highlight: "#cadeff",
        label: "مشترک"
    }	    
]


$(document).ready(function(){
	loadData('m-province');
	var ctx = $("#chartOne").get(0).getContext("2d");
	chartOne = new Chart(ctx).Pie(chartOneData, chartOptions);					
	$(".chartOne .legend").html(chartOne.generateLegend());

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
	
	$("#province").html('<option value="-1" selected="selected">انتخاب کنید</option>');
	  $.each( data, function( key, val ) {
	  	var item = fileName=="kh-province" ? val : key;
		$( "<option/>", {
		    html: item,
		  }).appendTo( "#province" );
	  });
		
		province = "-1";
		
	  //$("#province option:contains('"+province+"')").prop('selected',true);
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
	$(".result .table tbody").html("");
	
	for(k in chartOne.segments){
		chartOne.segments[k].value = null;
	}

	$.getJSON( "./data/result-" + fileName + ".json?v=" + milliseconds, function( data ) {
		var totalseat = 0, totalvote = 0;
		var dataList = {"omid":0, "osul":0, "free":0, "both":0, "second":0}
	  $.each( data, function( key, val ) {

	  	if (((val.part==part || fileName=="kh-list") && val.province==province) || province==-1){
	  		++totalseat;
	  		if (val.total && (data[key-1]!=undefined && val.part!=data[key-1].part)){
	  			totalvote += val.total;
	  		}
			
			chartOneCal(val);
			
			if(val.lname2){
				++dataList.second;
	  			addItem("#second", val.fname, val.lname, val.vote, val.total, val.category, province);
	  			addItem("#second", val.fname2, val.lname2, val.vote2, val.total, val.category2, province);
	  		}else{
	  			if(val.lname){
					var category = val.category.replace('فقط','').trim();
					var tagClassList = {"مشترک":"both","منتخب":"chosen", "بازمانده":"notchosen","مرحله دو":"second","امید":"omid","اصولگرا":"osul","مستقل":"free"};
					tagClass = tagClassList[category]!=undefined ? tagClassList[category] : '';	  				
					++dataList[tagClass]
	  				addItem("#total", val.fname, val.lname, val.vote, val.total, val.category, province);
	  			}	
	  		}
	  		if(val.l_omid){
	  			addItem("#omid", val.f_omid, val.l_omid, val.vote_omid, val.total, val.res_omid, province);
	  		}
	  		if(val.l_osul){
	  			addItem("#osul", val.f_osul, val.l_osul, val.vote_osul, val.total, val.res_osul, province);
	  		}
	  		
	  		
		}
	  });

	  totalvote = totalvote >0 ? numeral(totalvote).format('0,0') : '';
	  $("#status .totalvote").text(totalvote);
	  $("#status .totalseat").text(totalseat);
	  $("#status .second").text(dataList.second);
	  $("#status .omid").text(dataList.omid);
	  $("#status .osul").text(dataList.osul);
	  $("#status .free").text(dataList.free);
	  $("#status .both").text(dataList.both);

		$('.result .table tbody').each(function(){
		    if($(this).find('tr').length == 0){
		        $(this).parent().hide();
		    }else{
		    	$(this).parent().show();
		    }
		});

		if($("#total tbody tr").length==0 && province!=-1){
			$(".chartOne").fadeOut(250);
		}else{
			$(".chartOne").fadeIn(250);
		}

		if (province==-1 || $("#total tbody tr").length>0){
			chartOne.update();
		}
	});
}

function addItem(listId, fname, lname, vote, total, category, status){
	if (status==-1){
		return false;
	}
	var items = '', tagClass='';
	
	items+="<td>" + (parseInt($(listId + " td").length/$(listId + " th").length) + 1) + "</td>"

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
	  }).appendTo( ".result table" + listId + " tbody");

}


function chartOneCal(data){
	if (!data.category2){
		data.category = data.category.replace('فقط','').trim();
		var categoryList = {"مشترک":"both","منتخب":"chosen", "بازمانده":"notchosen","مرحله دو":"second","امید":"omid","اصولگرا":"osul","مستقل":"free"};
		var dataList = {"omid":0, "osul":1, "free":2, "both":3}
		var categoryItem = categoryList[data.category]!=undefined ? categoryList[data.category] : '' ;
		
		if (categoryItem){
			++chartOne.segments[dataList[categoryItem]].value;
		}
		
	}

}