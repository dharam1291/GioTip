var map,infowindow,name,lat,lng,desc,imgsrc,phone,marker,cityCircle,isGiopoint = false,gioPointmarkers=[];
$(document).ready(function(){
	var window_height = $( window ).height();
	$("#left_content").height(window_height-110);
	$("#middel_content").height(window_height-110);
	$("#right_content").height(window_height-110);
	var selectcityId = $('#get-selected-city-id').text();
	var error = false;
	var giositeid;
	var isInitialize = true;
    $.get('/city','json')
    .success(function(data){
    	var html="";
		$.each(data,function(index,info){
			    if(index == selectcityId-1)
			    	html = html+'<option data-image="data:image/jpeg;base64,'+info.image+'" selected>'+info.name+'</option>'
			    else
			    	html = html+'<option data-image="data:image/jpeg;base64,'+info.image+'">'+info.name+'</option>'

		});
		$("#select-search").append(html);
		$('#select-search').msDropDown();
    })
    .error(function(jqXHR,status,errorThrow){
    	error = true;
        //error page forward
    })
    .always(function(){
    	if(!error){
    		giosite_AND_Point(selectcityId);
    	}
    });
    
    /*
     * function of giosite and point
     * **/
    function giosite_AND_Point(selectcityId){
    	/*
    	 * ther will be two request one for giosite and second for get giopoint based on giosite
    	 * */
    	$.get('/giosite',{"cityid":selectcityId},'json')
    	.success(function(data){
    		$('#left_content .menu ul').remove();
    		var html = "<ul>";
    		$.each(data, function (key, info){
    			if(key == 0)
				{
				 lat =   info.lat;
				 lng =   info.lng;
				 imgsrc= "data:image/jpeg;base64,"+info.image;
				 name =  info.name;
				 desc =  info.descp;
				 phone = "";
				 giositeid = info.giositeid;
				 html = html+'<li class ="leftsection">';
				}
    			else	{html = html+'<li>';}
    			html = html+'<div id="li_img"><img src="data:image/jpeg;base64,'+info.image+'" class="crlimg">'+
    			'</div><div id="slct_li_txt">'+info.name+'</div><div id="hdndesc" style="display:none;">'+info.descp+'</div><div id="hdncntct" style="display:none;">'+info.contact+'</div>'+
    			'<div id="slct_lat">'+info.lat+'</div><div id="slct_lng">'+info.lng+'</div><div id="giositeid">'+info.giositeid+'</div></li>';
    		});
    		$('#left_content .menu').append(html);
    		$('#left_content .menu').show();
    			
    	})
    	.error(function(jqHRX,status,errorThrown){
    		error = true;
    		//error page forward
    	})
    	.always(function(){
    		if(!error){ gioPoint(giositeid);}
    	})
    }
    function gioPoint(giositeid){
    	$.get('/giopoint',{"giositeid":giositeid},'json')
		.success(function(data){
			$('#middel_content ul').remove();
			var html = "<ul>";
			$.each(data, function (key, info){
				html = html+'<li><div id="li_img"><img src="data:image/jpeg;base64,'+info.image+'" class="crlimg">'+
				'</div><div id="giopoint_name">'+info.name+'</div><div id="giopoint_lat">'+info.lat+'</div><div id="giopoint_lng">'+info.lng+'</div></li>';
			});
			$('#middel_content').append(html);
		})
		.error(function(jqHRX,status,errorThrow){
			error = true;
			// error page forward
		})
		.always(function(){
			if((!error) && (isInitialize)){
				$('#search-header').show();
				$('#left_content .menu').show();
				$('#middel_content').animate({ width: 'hide' }).animate({ width: 'show' },function(){});
				$('#right_content').show();
				$('.loader').hide();
				isInitialize = false;
				initializeMap(lat,lng,name);
			}
			else if(!error){
				$('.loader').hide();
				/** now genrate marker*/
				cityCircle.setMap(null);
				markerGenrator(lat,lng,name);
				zoommarkPoint(lat,lng);
			}
		})
    }
    
    
/********************************* event handler ************************************************/
    $(document).on("click",'#left_content ul li',function(){
		$("#left_content ul li").removeClass( "leftsection" );
		$(this).addClass( "leftsection" );
		name = $(this).find("#slct_li_txt").text();
		lat = $(this).find("#slct_lat").text();
		lng = $(this).find("#slct_lng").text();
		desc = $(this).find("#hdndesc").text();
		imgsrc = $(this).find("#li_img").find('img').prop("src");
		phone = $(this).find("#hdncntct").text();
		$('.loader').show();
		isGiopoint = false;
		/**
		 * delete all previous Giopoints marker
		 * */
		deleteGioPoint_Markers();
		gioPointmarkers=[]
		gioPoint($(this).find("#giositeid").text());
    });
    
   $(document).on('click','#middel_content ul li',function(){
	   lat = $(this).find('#giopoint_lat').text();
	   lng = $(this).find('#giopoint_lng').text();
	   name = $(this).find('#giopoint_name').text();
	   imgsrc = $(this).find("#li_img").find('img').prop("src");
	   isGiopoint = true;
	   markerGenrator(lat,lng,name);
   }) 
   /*************************************** on city select ********************************************************************/
   $('#search-site-button').on('click',function(){
	   isGiopoint = false;
	   giosite_AND_Point($('#select-search').prop('selectedIndex')+1);
   });
   
   
   /******************************************** open popup for book now*******************************************************/
   $('#booknow-button').on('click',function(){
	$('.pkg_container').show();   
   })
   
});

/***********************************************Ajax funcationality **********************************************************/




/****************************************************** Map Functionality **********************************/
function initializeMap(lat,lng,name){
	  var position = new google.maps.LatLng(lat, lng);
	  var mapCanvas = document.getElementById("right_content");
	  mapCanvas.style.display="block";
	  var mapOptions = 
		{
	        center: position,
	        zoom: 17
	    }
	  map = new google.maps.Map(mapCanvas, mapOptions);
	  markerGenrator(lat,lng,name);
	  infowindow = new google.maps.InfoWindow();
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
function zoommarkPoint(lat,lng){
	var latlngbounds = new google.maps.LatLngBounds();
	var latLng =  new google.maps.LatLng (lat,lng);
	latlngbounds.extend(latLng);		
	map.setCenter(latlngbounds.getCenter());
	map.fitBounds(latlngbounds); 
	map.setZoom(17);
}
function drawCircle(position,map){
	cityCircle = new google.maps.Circle({      
      strokeColor: '#061625',      
      strokeOpacity: 0.5,      
      strokeWeight: 2,      
      fillColor: '#061625',      
      fillOpacity: 0.1,      
      map: map,      
      center: position,      
      radius: 200,    
      draggable:false    
    });
}	
function deleteGioPoint_Markers(){
	$.each(gioPointmarkers,function(index,gioPointmarker){
		console.log("go   "+gioPointmarker);
		gioPointmarker.setMap(null);
	});
}
function markerGenrator(lat,lng,name){
	var position = new google.maps.LatLng(lat, lng);	
	
	var pictureLabel1 = document.createElement("img");
	    pictureLabel1.setAttribute("style","width:30px");
	    pictureLabel1.src = imgsrc;
	    
	var markerColor = 'white';    
	if(isGiopoint){markerColor = 'red';}  
	
	var marker = new MarkerWithLabel({
		position: position,
		title: name,
		labelContent: pictureLabel1,
	    labelAnchor: new google.maps.Point(15, 75),
	    labelClass: "markerlabels", 
	    labelInBackground: false,
	    icon: markerSymbol(markerColor),
		optimized: false
		});
	marker.setMap(map);
	if(!isGiopoint){	drawCircle(position,map);	}
	if(isGiopoint){		gioPointmarkers.push(marker);	}
	
	/****add event listener on marker****/
	google.maps.event.addListener(marker, 'click', function() { 
		/*
		 * display corresponding marker information and check weather this is site marker or point marker
		 * **/
		if(!isGiopoint)
		{
		$('#left_content ul li').each(function(key,data){
			var latLng = new google.maps.LatLng($(this).find("#slct_lat").text(),$(this).find("#slct_lng").text());		
			if((marker.position.lat() == latLng.lat())&&(marker.position.lng() == latLng.lng()))
		    	{
				var html = '<div><div id="slctloc_Img"><img src="'+$(this).find("#li_img").find('img').prop("src")+'"></div><div id="slctloc_Des">'+$(this).find("#hdndesc").text()+'<br><b style="margin-right:10px;">Phone</b>'+$(this).find("#hdncntct").text()+'</div></div>';
		    	infowindow.setContent(html);
		    	infowindow.open(map, marker);
		    	}
			});
		}
		else
			{
				$('#middel_content ul li').each(function(key,data){
					/* for middle we have only name that by here we display only name with image**/
					var latLng = new google.maps.LatLng($(this).find("#giopoint_lat").text(),$(this).find("#giopoint_lng").text());
					if((marker.position.lat() == latLng.lat())&&(marker.position.lng() == latLng.lng()))
			    	{
						var html = '<div><div id="slctloc_Img"><img src="'+$(this).find("#li_img").find('img').prop("src")+'"></div><div id="slctloc_Des">'+$(this).find("#giopoint_name").text()+'</div></div>';
				    	infowindow.setContent(html);
				    	infowindow.open(map, marker);	
			    	}
				});
			}
	});
}	