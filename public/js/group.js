// This file is executed in the browser, when people visit /chat/<random id>

$(function() {

    // some more jquery objects
    // register use
    var groupForm = $(".groupForm"),
        groupName = $("#groupName"),
        member = $("#member"),
        description = $("#description");


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

    $("#doneButton").click(function(){
        addGroup();
    });

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
        $.post('/create-group', { gname: name, description: groupDescription  }, function(data) {
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

    function addMember(id, name, email) {
        // alert(id)
        alert('Do you want to add ' + name + ' to your friends list ?');
        $.post('/add-friend', { userInfo: { name: name, id: id, email: email } }, function(data) {
            console.log(data);
            if (data == 'sign-in') {
                alert('you are not sigin, please sign first');
                window.location.href = '/sign-in';
            } else {
                $('#' + id).remove();
                alert(name + ' is your friend now !');
                window.location.href = '/personal-page#pane2?name=' + name;
            }
        });
    }

    function deleteMember(id, name) {
        // alert(id)
        if (confirm('Do you want to delete ' + name + ' from your friends list ?')) {
            $.ajax({
                url: '/delete-friend',
                type: 'DELETE',
                data: { friendId: id },
                success: function(result) {

                    if (result == 'sign-in') {
                        alert('you are not sigin, please sign first');
                        window.location.href = '/sign-in';
                    } else {
                        $('#pane2 ul ' + '#' + id).remove();
                        alert(name + ' is deleted from friend now !');
                    }
                }
            });
        }
    }

});




// function getMyFriends(callback){
//     // alert(id)
//     $.post('/my-friends', function(data){

//         if(data == 'sign-in'){
//             alert('you are not sigin, please sign first');
//             window.location.href = '/sign-in';
//         }else{
//             callback(data);
//         }
//     });
// }
