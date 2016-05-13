$(document).ready(function () {
	$('#login').submit(function(e){
		e.preventDefault();
		$.ajax({
			method: 'POST',
			url: '/auth/signin',
			data: {
				email: $('#email').val(),
				password: $('#password').val()
			}})
			.success(function(user){
				window.user = user;
				window.location.assign('/');
			})
			.error(function() {
				console.log('login failure');
			})
	});    
});


