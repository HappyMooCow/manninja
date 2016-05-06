$(function(){
	var emailId = '#email';
	var passwordId = '#password';

	$('#login').submit(function(event){
		event.preventDefault();
		var data = {		
			email: $(this).find('#email').val(),
			password: $(this).find('#password').val()
		}
		
		if(!data.email || !data.password) {
			$('#loginError').html('enter a username and password');
		}

		$.ajax({
			url:'/auth/signin', 
			data:data,
			method: 'POST'
			})
			.error(function(data){
				$('#loginError').html(data.message || data || 'unknown error');
			})
			.success(function(user){
				window.user = user;
				$('.load').fadeIn(600);
				window.location.assign('/');
			});
		});
})
