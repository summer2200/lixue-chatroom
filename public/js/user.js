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

    // search
    $('#searchButton').on('click', function(e){
        var searchText = $('#searchText').val();
        if(searchText == '') return;
        $.post('/search', {userName: searchText},function(data){
            console.log(data);
            drewSearchResult(data);
        })
    })
    $('#searchText').on('keypress',function(e){
        if(e.which == 13) {
            e.preventDefault();
            $('#searchButton').trigger('click');
        }
    })

    function drewSearchResult(data){
        $('#searchResults').empty();
        if(data.length == 0){
            $('#searchResults').text('no result find');
        }
        data.forEach(function(user){
            var li = '<li class="list-group-item" id='+user._id+' onclick="addFriend(\''+user._id+'\',\''+user.name+'\')">'+ user.name+'<span class="glyphicon glyphicon-plus pull-right"></span></li>';
            $('#searchResults').append(li);
        })
    }

});



function addFriend(id, name){
    // alert(id)
    $.post('/add-friend', {userName: name},function(data){
        console.log(data);
        if(data == 'sign-in'){
            alert('you are not sigin, please sign first');
            window.location.href = '/sign-in';
        }else{
            alert('Do you want to add '+name+' to your friends list ?');
            $('#'+id).remove();
            alert(name+' is your friend now !');
            // function wait() {
            //     alert(name+' is your friend now !');
            // } ;
            // setTimeout('wait()', 1000);
            window.location.href = '/personal-page#pane2?name='+name;
        }
    })
}
