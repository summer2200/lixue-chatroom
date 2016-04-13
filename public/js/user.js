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

    function scrollToBottom() {
        $("html, body").animate({ scrollTop: $(document).height() - $(window).height() }, 1000);
    }

    function isValid(thatemail) {

        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(thatemail);
    }

});
