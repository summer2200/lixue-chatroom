// This file is executed in the browser, when people visit /chat/<random id>

$(function() {
    var socket = io();
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
    });

    function drewSearchResult(data){
        $('#searchResults').empty();
        if(data.length == 0){
            // $('#searchResults').text('no result find');
            $('#searchResults').append('<span class="noresult col-xs-12"><h5>No such user name <br>or you have added this friend.</h5></span>');
        }
        data.forEach(function(user){
            var li = '<li class="list-group-item" id='+user._id+' onclick="addFriend(\''+user._id+'\',\''+user.name+'\',\''+user.email+'\')">'+ user.name+'<span class="glyphicon glyphicon-plus pull-right"></span></li>';
            $('#searchResults').append(li);
        });
    }

});



function addFriend(id, name, email){
    // alert(id)
    alert('Do you want to add '+name+' to your friends list ?');
    $.post('/add-friend', {userInfo: {name:name, id:id, email:email}},function(data){
        console.log(data);
        if(data == 'sign-in'){
            alert('you are not sigin, please sign first');
            window.location.href = '/sign-in';
        }else{
            $('#'+id).remove();
            alert(name+' is your friend now !');
            window.location.href = '/personal-page#pane2?name='+name;
        }
    });
}
function deleteFriend(id, name){
    // alert(id)
    if (confirm('Do you want to delete '+name+' from your friends list ?')){
        $.ajax({
            url: '/delete-friend',
            type: 'DELETE',
            data: {friendId:id},
            success: function(result) {

                if(result == 'sign-in'){
                    alert('you are not sigin, please sign first');
                    window.location.href = '/sign-in';
                }else{
                    $('#pane2 ul '+ '#'+id).remove();
                    alert(name+' is deleted from friend now !');
                }
            }
        });
    }
}

function getMyFriends(callback){
    // alert(id)
    $.post('/my-friends', function(data){

        if(data == 'sign-in'){
            alert('you are not sigin, please sign first');
            window.location.href = '/sign-in';
        }else{
            callback(data);
        }
    });
}

function getMyChatList(callback){
    $.post('/my-chatlist', function(data){

        if(data == 'sign-in'){
            alert('you are not sigin, please sign first');
            window.location.href = '/sign-in';
        }else{
            callback(data);
        }
    });
}
