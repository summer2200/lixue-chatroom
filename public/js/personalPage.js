$(function() {
    var tabValue = window.location.hash;

    if (tabValue) {

        var split = tabValue.split('?');
        var pannel = split[0];
        var name = split[1].split('=')[1];

        $('#myTabs a[href="' + pannel + '"]').tab('show'); // Select tab by name

        if (pannel === '#pane2') {
            getMyFriends(function(data) {
                $('#pane2 ul').empty();
                data.forEach(function(user) {
                    var deleteicon = '<span class="glyphicon glyphicon-remove" aria-hidden="true" onclick="deleteFriend(\'' + user.id + '\', \'' + user.name + '\')"></span>';
                    $("#pane2 ul").append('<li class="list-group-item" id="' + user.id + '"><a href="/p2p-chat"><span class="tab">' + user.name + '</span></a>' + deleteicon + '</li>');
                });
            });
        }
    }


    $("#friendsTab").click(function() {
        getMyFriends(function(data) {
            $('#pane2 ul').empty();
            data.forEach(function(user) {
                var deleteicon = '<span class="glyphicon glyphicon-remove" aria-hidden="true" onclick="deleteFriend(\'' + user.id + '\', \'' + user.name + '\')"></span>';
                $("#pane2 ul").append('<li class="list-group-item" id="' + user.id + '"><a href="/p2p-chat"><span class="tab">' + user.name + '</span></a>' + deleteicon + '</li>');
            });
        });
    });

    var socket = io();
    var fromUser = $.cookie('username');//从 cookie 中读取用户名，存于变量 from
    var to = 'all';//设置默认接收对象为"所有人"
    //发送用户上线信号
    socket.emit('online', {user: fromUser});
    socket.on('online', function (data) {
      //显示系统消息
      var sys = '';
      if (data.user != fromUser) {
        sys = '<div style="color:#f00">系统(' + now() + '):' + '用户 ' + data.user + ' 上线了！</div>';
      } else {
        sys = '<div style="color:#f00">系统(' + now() + '):你进入了聊天室！</div>';
      }
      toastr.info(sys);

      //刷新用户在线列表
      // flushUsers(data.users);
      //显示正在对谁说话
      // showSayTo();
    });
});
