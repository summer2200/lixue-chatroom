// This file is executed in the browser, when people visit /chat/<random id>

$(function() {

    // some more jquery objects
    // register use
    var signUpForm = $(".signUpForm"),
        userName = $("#userName"),
        password = $("#password"),
        confirmPassword = $("#confirmPassword"),
        email = $("#email");


    signUpForm.on('submit', function(e) {
    	if(userName.val() === ""){
    		alert('please input a user name');
    		return false;
    	}
        if(!isValid(email.val())){
        	alert('Please input valid email');
        	return false;
        }
        if(password.val() === ''){
        	alert('Please input password');
        	return false;
        }
        if(password.val() != confirmPassword.val()){
        	alert('Password is not same');
        	return false;
        }
        return true;
    });

    var signinForm = $('.form-signin'),
    	signInUserName = $('#signInUserName'),
    	inputPassword = $('#inputPassword'),
    	msg = $('#msg');
    msg.fadeOut(1000);

    signinForm.on('submit', function(e) {
    	if(signInUserName.val() === ""){
    		alert('please input a user name');
    		return false;
    	}
    	if(inputPassword.val() === ''){
        	alert('Please input password');
        	return false;
        }
        return true;
    });



});
