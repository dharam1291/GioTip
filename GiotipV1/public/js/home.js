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
		clearData_fields()
		signin_field_show();
		signup_field_show();
	})
	$('li a#signin').on("click",function(){
		signin_style();
	})
	
	/**
	 * set action on input box insert data
	 * **/
	$('.input-group input[name="username"]').keypress(function(){
		$('.input-group label[for = "username"]').hide();
	});
	$('#signin-pass input[name="password"]').keypress(function(){
		$('#signin-pass label[for = "password"]').hide();
	});
	$('.input-group input[name="email"]').keypress(function(){
		$('.input-group label[for = "email"]').hide();
	});
	$('#signup-pass input[name="password"]').keypress(function(){
		$('#signup-pass label[for = "password"]').hide();
	});
	$('.input-group input[name="name"]').keypress(function(){
		$('.input-group label[for = "name"]').hide();
	});
});
function signin_style(){
	$('#parentcontainer').css("display","block");
	clearData_fields();
	signin_field_show();
	signup_field_show();
	$('#signin-model').css("display","block");
	$('#signup-model').css("display","none");
}
function signup_style(){
	$('#parentcontainer').css("display","block");
	clearData_fields();
	signin_field_show();
	signup_field_show();
	$('#signup-model').css("display","block");
	$('#signin-model').css("display","none");
}

function signin_field_show(){
	$('.input-group label[for = "username"]').show();
	$('#signin-pass label[for = "password"]').show();
}

function signup_field_show(){
	$('.input-group label[for = "name"]').show();
	$('#signup-pass label[for = "password"]').show();
	$('.input-group label[for = "email"]').show();
}
function clearData_fields(){
	$('.input-group input[name="username"]').val("");
	$('.input-group input[name="name"]').val("");
	$('.input-group input[name="email"]').val("");
	$('#signup-pass input[name="password"]').val("");
	$('#signin-pass input[name="password"]').val("");
}