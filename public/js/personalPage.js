$(function() {
    var tabValue = window.location.hash;

    if (tabValue) {

        var split = tabValue.split('?');
        var pannel = split[0];
        var name = split[1].split('=')[1];

        $('#myTabs a[href="' + pannel + '"]').tab('show'); // Select tab by name
        $("#pane2").append('<li><a href="/p2p-chat"><span class="tab">' + name + '</span></a></li>');
    }

});
