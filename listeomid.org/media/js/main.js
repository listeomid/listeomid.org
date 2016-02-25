var activeTab = "m-province";
var milliseconds = (new Date).getTime(); //for removing lists' chache
var version = 2; //in case province and part changes

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
	$("#province").html('');
	  $.each( data, function( key, val ) {
	  	var item = fileName=="kh-province" ? val : key;
		$( "<option/>", {
		    html: item,
		  }).appendTo( "#province" );
	  });
		
		province = "تهران";
		
	  $("#province option:contains('"+province+"')").prop('selected',true);
	  loadProvince(province, fileName);
	});
}

function loadProvince(province, fileName){
	$.getJSON( "./data/" + fileName + ".json?v=" + version, function( data ) {
	  $("#part").html("");
	  $.each( data[province], function( key, val ) {
		$( "<option/>", {
		    html: val,
		  }).appendTo( "#part" );
	  });
	  if (fileName=="m-province"){

	  	

	  	part = data[province][0];

	  	$("#part option:contains('"+part+"')").prop('selected',true);
	  	loadList(province, part, 'm-list');
		}else{
			loadList(province, '', 'kh-list');
		}
	});
}


function loadList(province, part, fileName){

	$("#list").html("");

	$.getJSON( "./data/" + fileName + ".json?v=" + milliseconds, function( data ) {

	  $.each( data, function( key, val ) {

	  	if ((val['part']==part || fileName=="kh-list") && val['province']==province){
	  		var items = '';

	  		if(val['lname']){
		  		if(val['code']){
		  			items+= "<p class='code'>" + val['code'] + "</p>";
		  		}
		  		items+='<p class="fname">'

		  		if(val['prefix']){
		  			items+= val['prefix'] + " ";
		  		}

		  		items+= val['fname'] + " ";
		  		items+= val['lname'];

		  		items+="</p>";
	  		}else{
	  			if ($("#list").text().length==0){
					items = '<p>موردی یافت نشد</p>';
				}
	  		}


			$( "<div/>", {
			    html: items,
			    class: "six columns candidate"
			  }).appendTo( "#list" );
		}
	  });
	});
}
