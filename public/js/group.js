// This file is executed in the browser, when people visit /chat/<random id>

$(function() {

    // some more jquery objects
    // register use
    var groupForm = $(".groupForm"),
        groupName = $("#groupName"),
        member = $("#member"),
        description = $("#description"),
        findFriendButton = $('#findFriendButton');

    // groupForm.on('submit', function(e) {

    // });

    // function drewSearchResult(data){
    //     $('#searchResults').empty();
    //     if(data.length == 0){
    //         $('#searchResults').text('no result find');
    //     }
    //     data.forEach(function(user){
    //         var li = '<li class="list-group-item" id='+user._id+' onclick="addFriend(\''+user._id+'\',\''+user.name+'\',\''+user.email+'\')">'+ user.name+'<span class="glyphicon glyphicon-plus pull-right"></span></li>';
    //         $('#searchResults').append(li);
    //     });
    // }
    // search
    $('#findFriendButton').on('click', function(e) {
        var searchText = $('#findFriendInput').val();
        if (searchText === '') return;
        getMyFriends(function(result) {
            var friends = result.filter(function(friend) {
                return friend.name.indexOf(searchText) > -1;
            });
            drawSearchMyFriendResult(friends);
        });
    });
    $('#findFriendInput').on('keypress', function(e) {
        if (e.which == 13) {
            e.preventDefault();
            $('#findFriendButton').trigger('click');
        }
    });

    $("#doneButton").click(function() {
        addGroup();
    });

    function drawSearchMyFriendResult(friends) {
        console.log(friends);
        $('#searchMyFriendResults').empty();
        if (friends.length === 0) {
            $('#searchMyFriendResults').text('no result find');
        }
        friends.forEach(function(user) {
            var li = '<li class="list-group-item" id=' + user.id + ' onclick="addMember(\'' + user.id + '\',\'' + user.name + '\',\'' + user.email + '\')">' + user.name + '<span class="glyphicon glyphicon-plus pull-right"></span></li>';
            $('#searchMyFriendResults').append(li);
        });
    }

    function addGroup() {
        var name = groupName.val();
        var groupDescription = description.val();
        if (groupName.val() === "") {
            alert('please input a group name');
            return false;
        }
        if (description.val() === '') {
            alert('Please input description');
            return false;
        }

        // alert(id)
        alert('Do you want to add ' + name + ' to your group list ?');
        $.post('/create-group', { gname: name, description: groupDescription, members: members }, function(data) {
            console.log(data);
            if (data == 'sign-in') {
                alert('you are not sigin, please sign first');
                window.location.href = '/sign-in';
            } else {
                // $('#' + id).remove();
                alert(name + ' is created successfully !');
                window.location.href = '/personal-page#pane3?name=' + name;
            }
        });
    }



}());
var members = [];

function addMember(id, name, email) {
    var member = { id: id, name: name, email: email };
    members.push(member);
    $('#searchMyFriendResults #' + id).remove();
    var h4 = '<span class="label label-success" id="' + id + '">' + name + '<span class="glyphicon glyphicon-remove delete-friend" onclick="deleteMember(\'' + id + '\')"></span></span>';
    $('#member .mcontent h4').append(h4);
    // alert(id)
    // alert('Do you want to add ' + name + ' to your friends list ?');
    // $.post('/add-memeber', { userInfo: { name: name, id: id, email: email } }, function(data) {
    //     console.log(data);
    //     if (data == 'sign-in') {
    //         alert('you are not sigin, please sign first');
    //         window.location.href = '/sign-in';
    //     } else {
    //         $('#' + id).remove();
    //         alert(name + ' is your friend now !');
    //         window.location.href = '/personal-page#pane3?name=' + name;
    //     }
    // });
}

function deleteMember(id, name) {
    var index = _.findIndex(members, { id: id });

    if (index > -1) {
        members.splice(index, 1);
        $('#member .mcontent #' + id).remove();
    }
    // alert(id)
    // if (confirm('Do you want to delete ' + name + ' from your friends list ?')) {
    //     $.ajax({
    //         url: '/delete-memeber',
    //         type: 'DELETE',
    //         data: { friendId: id },
    //         success: function(result) {

    //             if (result == 'sign-in') {
    //                 alert('you are not sigin, please sign first');
    //                 window.location.href = '/sign-in';
    //             } else {
    //                 $('#pane2 ul ' + '#' + id).remove();
    //                 alert(name + ' is deleted from friend now !');
    //             }
    //         }
    //     });
    // }
}

function deleteGroupChart(id, name){
    // alert(id)
    if (confirm('Do you want to delete '+name+' from your group list ?')){
        $.ajax({
            url: '/delete-group',
            type: 'DELETE',
            data: {groupId:id},
            success: function(result) {

                if(result == 'sign-in'){
                    alert('you are not sigin, please sign first');
                    window.location.href = '/sign-in';
                }else if(result == 'success'){
                    $('#pane3 ul '+ '#'+id).remove();
                    alert(name+' is deleted from group now !');
                }else{
                    toastr.error('delete fail');
                }
            }
        });
    }
}

function getMyGroupCharts(callback){
    $.post('/my-groups', function(data){

        if(data == 'sign-in'){
            alert('you are not sigin, please sign first');
            window.location.href = '/sign-in';
        }else{
            callback(data);
        }
    });
}