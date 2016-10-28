$(document).ready(function(){
	var window_height = $( window ).height();
	$("#left_content").height(window_height);
	$("#middel_content").height(window_height);
	$("#right_content").height(window_height);
	var selectcityId = $('#get-selected-city-id').text();
	
	/*function calling*/
	showloader();
	get_Allcity(selectcityId);
	get_GioPlace(selectcityId);
	
	
	var giolocation;
	$(document).on("click",'#left_content ul li',function(){
		$("#left_content ul li").removeClass( "leftsection" );
		$(this).addClass( "leftsection" );
		giolocation = $(this).find("#slct_li_txt").text();
		desc = $(this).find("#hdndesc").text();
		phone = $(this).find("#hdncntct").text(); 
		imgsrc = $(this).find("#li_img").find('img').prop("src");
		lat = $(this).find("#slct_lat").text();
		lng = $(this).find("#slct_lng").text();
		var cityplaceid = $(this).find("#cityplaceid").text();
			getGiopoint(cityplaceid).then(function(){
				showmarkPoint(giolocation);
				zoommarkPoint();
			});
		});
		
	});
$(window).load(function(){
	$('#search-header').show();
	$('#left_content .menu').show();
	$('#middel_content').animate({ width: 'hide' }).animate({ width: 'show' },function(){});
	stoploader();	
});
function stoploader(){$('.loader').hide();}
function showloader(){$('.loader').show();}
function get_Allcity(selectcityId){
	$.ajax({
		type:'GET',
		url:'/citylist',
		dataType:'json'
		}).done(function(data){
			var html="";
			$.each(data,function(index,info){
				if(info.cityid == selectcityId)
				{
					selectedcityName = info.name;
					html = html+'<option data-image="data:image/jpeg;base64,'+info.image+'" selected>'+info.name+'</option>'
					imgsrc = "data:image/jpeg;base64,"+info.image;
					initializeMap(info.lat,info.lng,selectedcityName);	
				}
				else 
					html = html+'<option data-image="data:image/jpeg;base64,'+info.image+'">'+info.name+'</option>';
			});
			$("#select-search").append(html);
			$('#select-search').msDropDown();
	});
	
}
function get_GioPlace(selectcityId){
	/* set marker to null for this city**/
	markers = [];
	$.ajax({
		type:'GET',
		url:'/cityplace',
		dataType:'json',
		data:{"cityid":selectcityId}
	}).done(function(data){
		$('#left_content .menu ul').remove();
		var html = "<ul>";
		$.each(data, function (key, info){		
			html = html+'<li><div id="li_img"><img src="data:image/jpeg;base64,'+info.image+'" class="crlimg">'+
			'</div><div id="slct_li_txt">'+info.name+'</div><div id="hdndesc" style="display:none;">'+info.descp+'</div><div id="hdncntct" style="display:none;">'+info.contact+'</div>'+
			'<div id="slct_lat">'+info.lat+'</div><div id="slct_lng">'+info.lng+'</div><div id="cityplaceid">'+info.cityplaceid+'</div></li>';
		});
		$('#left_content .menu').hide();
		$('#left_content .menu').append(html);
	});	
}
function getGiopoint(cityplaceid){
	return new Promise(function(resolve,reject){
	$.ajax({
		type:'GET',
		url:'/giopoint',
		dataType:'json',
		data:{"cityplaceid":cityplaceid}
	}).done(function(data){
		$('#middel_content ul').remove();
		var html = "<ul>";
		$.each(data, function (key, info){		
			html = html+'<li><div id="li_img"><img src="data:image/jpeg;base64,'+info.image+'" class="crlimg">'+
			'</div><div id="giopoint_name">'+info.name+'</div><div id="giopoint_lat">'+info.lat+'</div><div id="giopoint_lng">'+info.lng+'</div></li>';
            /*
             * display this giopoint marker
           */
			var pictureLabel1 = document.createElement("img");
			  pictureLabel1.setAttribute("style","width:30px");
			  pictureLabel1.src = "data:image/jpeg;base64,"+info.image;
			var marker = new MarkerWithLabel({
				position: new google.maps.LatLng(info.lat,info.lng),
				title: info.name,
				labelContent: pictureLabel1,
			    labelAnchor: new google.maps.Point(15, 75),
			    labelClass: "markerlabels", // the CSS class for the label
			    labelInBackground: false,
			    icon: markerSymbol('white'),
				optimized: false
				});
			marker.setMap(map);
			markers.push(marker);
			
		});
		$('#middel_content').append(html);
	});
	resolve();
	});
}
/********************************** map functionality  *******************************/
var selectedcityName ="";
var map;
var markers = [];
var infowindow;
var desc;
var phone;
var imgsrc;
var lat,lng;
var cityCircle;
function initializeMap(lat,lng){
	  var position = new google.maps.LatLng(lat, lng);
	  var mapCanvas = document.getElementById("right_content");
	  mapCanvas.style.display="block";
	  var mapOptions = 
		{
	        center: position,
	        zoom: 10
	    }
	  map = new google.maps.Map(mapCanvas, mapOptions);
	  infowindow = new google.maps.InfoWindow();
	  /**
	   * generate marker symbol of city.
	   * 
	   * */
	  markerGenrator(lat,lng,selectedcityName);
	  drawCircle(position,map);
}  
	  
function markerGenrator(lat,lng,address){
	var position = new google.maps.LatLng(lat, lng);
	
	var pictureLabel1 = document.createElement("img");
	    pictureLabel1.setAttribute("style","width:30px");
	    pictureLabel1.src = imgsrc;
	    
	var marker = new MarkerWithLabel({
		position: position,
		title: address,
		labelContent: pictureLabel1,
	    labelAnchor: new google.maps.Point(15, 75),
	    labelClass: "markerlabels", 
	    labelInBackground: false,
	    icon: markerSymbol('white'),
		optimized: false
		});
	marker.setMap(map);
	markers.push(marker);
	
	/****add event listener on marker****/
	google.maps.event.addListener(marker, 'click', function() { 
    	var latLng =  new google.maps.LatLng (lat,lng);
    		if((marker.position.lat() == latLng.lat())&&(marker.position.lng() == latLng.lng()))
		    	{
		    	var html = '<div><div id="slctloc_Img"><img src="'+imgsrc+'"></div><div id="slctloc_Des">'+desc+'<br><b style="margin-right:10px;">Phone</b>'+phone+'</div></div>';
		    	infowindow.setContent(html);
		    	infowindow.open(map, marker);
		    	}
        });
}	  
	  
function drawCircle(position,map){
		cityCircle = new google.maps.Circle({      
	      strokeColor: '#061625',      
	      strokeOpacity: 0.8,      
	      strokeWeight: 2,      
	      fillColor: '#061625',      
	      fillOpacity: 0.35,      
	      map: map,      
	      center: position,      
	      radius: 20000,    
	      draggable:false    
	    });          
}	  
	  
function zoommarkPoint(){
		var latlngbounds = new google.maps.LatLngBounds();
		var latLng =  new google.maps.LatLng (lat,lng);
		latlngbounds.extend(latLng);		
		map.setCenter(latlngbounds.getCenter());
		map.fitBounds(latlngbounds); 
		map.setZoom(17);
}
function markerSymbol(color) {
	  return {
	    path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
	    fillColor: color,
	    fillOpacity: 1,
	    strokeColor: '#000',
	    strokeWeight: 2,
	    scale: 2
	  };
	}