$(function() {
    var tabValue = window.location.hash;

    if (tabValue) {

        var split = tabValue.split('?');
        var pannel = split[0];
        var name = split[1].split('=')[1];

        $('#myTabs a[href="' + pannel + '"]').tab('show'); // Select tab by name

        if(pannel === '#pane2'){
            getMyFriends(function (data) {
                $('#pane2 ul').empty();
                data.forEach(function(user){
                    var deleteicon = '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>';
                    $("#pane2 ul").append('<li class="list-group-item"><a href="/p2p-chat"><span class="tab">' + user.name + '</span></a>' + deleteicon +'</li>');
                });
            });
        }

    }

});
