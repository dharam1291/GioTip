var error = false;
$(document).ready(function(){
	$('.loader').show();
	$.get('/city','json')
	.success(function(data){
		var html='<option hidden data-icon="glyphicon glyphicon-map-marker" value="-1">Select Location</option>';
			$.each(data,function(index,info){
				html = html+'<option data-icon="glyphicon glyphicon-map-marker" data-subtext="India" value="'+info.cityid+'">'+info.name+'</option>';
			});
			$('#explore-city').append(html);
			$('#explore-city').selectpicker({ 	
				showIcon: true,
				width:450,
				height:50
				});
		})
	.error(function(jqXHR, textStatus, errorThrown){ 
		error = true;
		alert(jqXHR.status +"Error occure!!!!!!!!!!!");
	})
	.always(function(){
		$('.loader').hide();
		if(!error){
			$('#search_section').css('display','block');
		    }
	});
	
	/*
	 * sign in up style
	 * **/
	$("#signup a").on("click",function(){
		signup_style();
	});
	$('.close').on("click",function(){
		$('#parentcontainer').css("display","none");
	})
	$('li a#signin').on("click",function(){
		signin_style();
	})
});
function signin_style(){
	$('#parentcontainer').css("display","block");
	$('#signin-model').css("display","block");
	$('#signup-model').css("display","none");
}
function signup_style(){
	$('#parentcontainer').css("display","block");
	$('#signup-model').css("display","block");
	$('#signin-model').css("display","none");
}