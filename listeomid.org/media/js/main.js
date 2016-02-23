var activeTab = "m-province";

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
	activeTab = "m-province";
	loadData('m-province');
	$(this).addClass('active');
	$("#khBtn").removeClass('active');
	$(".part-section").show();
	$(".province-parent").removeClass("ten").addClass("three");
});

$("#khBtn").click(function(e){
	e.preventDefault();
	activeTab = "kh-province";
	loadData('kh-province');
	$(this).addClass('active');
	$("#mBtn").removeClass('active');
	$(".part-section").hide();
	$(".province-parent").addClass("ten").removeClass("three");
});

function loadData(fileName){
	$.getJSON( "./data/"+fileName+".json", function( data ) {
	$("#province").html('');
	  $.each( data, function( key, val ) {
	  	var item = fileName=="kh-province" ? val : key;
		$( "<option/>", {
		    html: item,
		  }).appendTo( "#province" );
	  });
		var province = readCookie("province");
		if(province==null){
			province = "تهران";
		}
	  $("#province option:contains('"+province+"')").prop('selected',true);
	  loadProvince(province, fileName);
	});
}

function loadProvince(province, fileName){
	$.getJSON( "./data/" + fileName + ".json", function( data ) {
	  $("#part").html("");
	  $.each( data[province], function( key, val ) {
		$( "<option/>", {
		    html: val,
		  }).appendTo( "#part" );
	  });
	  if (fileName=="m-province"){

	  	var part = readCookie("part");
	  	if(data[province].indexOf(part)==-1){
	  		part = data[province][0];
		}
	  	$("#part option:contains('"+part+"')").prop('selected',true);
	  	loadList(province, part, 'm-list');
		}else{
			loadList(province, '', 'kh-list');
		}
	});
}


function loadList(province, part, fileName){
	createCookie("province", province, 1000);
	if (part){
		createCookie("part", part, 1000);
	}


	$("#list").html("");

	$.getJSON( "./data/" + fileName + ".json", function( data ) {

	  $.each( data, function( key, val ) {

	  	if ((val['part']==part || fileName=="kh-list") && val['province']==province){
	  		var items = '';

	  		if(val['fname'] && val['lname']){
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
			    class: "four columns candidate"
			  }).appendTo( "#list" );
		}
	  });
	});
}

function createCookie(name,value,hours) {
    if (hours) {
        var date = new Date();
        date.setTime(date.getTime()+(hours*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
