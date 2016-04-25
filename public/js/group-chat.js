// This file is executed in the browser, when people visit /chat/<random id>

$(function() {

    // getting the id of the room from the url
    if (window.location.pathname.match(/\/chat\/(\d+)$/)) {
        var id = Number(window.location.pathname.match(/\/chat\/(\d+)$/)[1]);
    } else {
        var id = 100;
    }

    //this variable comes from groupChat.ejs
    //var group = {
    //   id:
    // };

    var currentUser = {
        id: $.cookie('userId'),
        name: $.cookie('username')
    };
    var img = "";
    var isScroll = false;

    var chatMessageForm = $('#chat-message-form'),
        chatMessageTextarea = $('.chat-message-textarea'),
        chats = $('.chats'),
        messageTimeSent = $('.timesent'),
        groupMemberList = $('.group-member-list');

    var groupChatSocket = io('/groupchat');

    activate();

    //connect group chat
    function activate() {
        //the id in emit is the room id
        groupChatSocket.emit('clientConnected', { id: group.id, username: currentUser.name });
        addMemberListListener();
        addReceiveMessageListener();
        addLeaveListener();
        bindEventsToDOM();
    }

    function addMemberListListener() {
        groupChatSocket.off('members').on('members', function(data) {
            if (data && data.users && data.users.length) {
                updateMemberList(data.users);
            }
        });
    }

    //listern for messages and update chat screen
    function addReceiveMessageListener() {
        groupChatSocket.off('receive').on('receive', function(data) {
            console.log(data);
            if (data.user != currentUser.name && data.msg.trim().length) {
                createChatMessage(data.msg, data.user, data.img, moment());
                scrollToBottom();
            }
        });
    }

    function bindEventsToDOM() {
        chatMessageForm.off('submit').on('submit', function(e) {
            e.preventDefault();
            if (chatMessageTextarea.val().trim().length) {
                createChatMessage(chatMessageTextarea.val(), currentUser.name, img, moment());
                scrollToBottom();

                // Send the message to the other person in the chat
                groupChatSocket.emit('msg', { msg: chatMessageTextarea.val(), user: currentUser.name, img: img });
            }
            chatMessageTextarea.val('');
        });

        chatMessageTextarea.keypress(function(e) {
            // Submit the form on enter
            if (e.which == 13) {
                e.preventDefault();
                chatMessageForm.trigger('submit');
            }
        });

        // Update the relative time stamps on the chat messages every minute
        setInterval(function() {
            messageTimeSent.each(function() {
                var each = moment($(this).data('time'));
                $(this).text(each.fromNow());
            });
        }, 60000);
    }

    function updateMemberList(memberList) {
        var members = "";
        memberList.forEach(function(name) {
            if (name === currentUser.name) {
                return;
            }
            var newMember =
                '<div class="row member">' +
                '<div class="col-sm-3">' +
                '<img src="/img/unnamed.jpg">' +
                '</div>' +
                '<div class="col-sm-8 col-sm-push-1 member-name">' +
                name +
                '</div>' +
                '</div>'
            ;
            members += newMember;
        });
        groupMemberList.html($(members));
    }

    function addLeaveListener() {
        groupChatSocket.off('someoneLeave').on('someoneLeave', function(data) {
            sys = '<div style="color:#f00">系统(' + now() + '):' + friend.name + '离开了聊天室！</div>';
            toastr.info(sys);
            if (data) {
                updateMemberList(data.members);
            }
        });
    }

    // Function that creates a new chat message
    function createChatMessage(msg, user, imgg, now) {

        var who = '';
        var li;

        if (user === currentUser.name) {
            who = 'me';
            imgg = '/img/male.png';
            li = $(
                '<li class="' + who + ' pull-right"' +
                '>' +
                '<p></p>' +
                '<div class="image">' +
                '<img src=' + imgg + ' />' +
                '<b>me</b>' +
                '<i class="timesent" data-time=' + now + '></i> ' +
                '</div>' +
                '</li>');
        } else {
            who = 'you';
            imgg = '/img/female.png';
            li = $(
                '<li class=' + who + '>' +
                '<div class="image pull-left">' +
                '<img src=' + imgg + ' />' +
                '<b></b>' +
                '<i class="timesent" data-time=' + now + '></i> ' +
                '</div>' +
                '<p></p>' +
                '</li>');
            li.find('b').text(user);
        }

        // use the 'text' method to escape malicious user input
        li.find('p').text(msg);

        chats.append(li);

        messageTimeSent = $(".timesent");
        messageTimeSent.last().text(now.fromNow());
    }

    //TODO group chat multiple event
    function scrollToBottom() {
        if (isScroll) {
            return;
        }
        isScroll = true;
        $("html, body").animate({ scrollTop: $(document).height() - $(window).height() }, 1000, function() {
            isScroll = false;
        });
    }


});
