// This file is executed in the browser, when people visit /chat/<random id>

$(function() {

    // getting the id of the room from the url
    if (window.location.pathname.match(/\/chat\/(\d+)$/)) {
        var id = Number(window.location.pathname.match(/\/chat\/(\d+)$/)[1]);
    } else {
        var id = 100;
    }

    //var friend; //this variable comes from p2pchat.ejs

    var currentUser = {
        id: $.cookie('userId'),
        name: $.cookie('username')
    };
    var img = "";

    var chats = $('.chat-messages'),
        chatMessageForm = $('#chat-message-form'),
        chatMessageTextarea = $('.chat-message-textarea'),
        chatSendBtn = $('.chat-message-submit');
        chats = $('.chats');

    var p2pchatSocket = io('/p2pchat');

    p2pInit();
    function p2pInit() {
        //the id in emit is the room id
        p2pchatSocket.emit('clientConnected', { id: id, username: currentUser.name });
        waitForFriend();
    }

    //wait for other people join and trigger signal clientConnected
    function waitForFriend() {
    	p2pchatSocket.off('startChat').on('startChat', function(data){
    		startChat();
    		p2pchatSocket.off('receive').on('receive', function(data){
    			if (data.msg.trim().length) {
    			    createChatMessage(data.msg, data.user, data.img, moment());
    			    scrollToBottom();
    			}
    		});
    	});
    }

    function startChat() {
        $('.wait-for-friend').addClass('hidden');
        $('.chatting').removeClass('hidden');

        chatMessageForm.off('submit').on('submit', function(e) {
            e.preventDefault();
            if (chatMessageTextarea.val().trim().length) {
                createChatMessage(chatMessageTextarea.val(), currentUser.name, img, moment());
                scrollToBottom();

                // Send the message to the other person in the chat
                p2pchatSocket.emit('msg', { msg: chatMessageTextarea.val(), user: currentUser.name, img: img });
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

        p2pchatSocket.on('leave', chatEnd);
    }

    function chatEnd() {
        sys = '<div style="color:#f00">系统(' + now() + '):' + friend.name + '离开了聊天室！</div>';
        toastr.info(sys);
        toggelInput(false);
        waitForFriendReconnect();
    }

    function toggelInput(type) {
        if (type) {
            chatMessageTextarea.attr('disabled', false);
            chatSendBtn.attr('disabled', false);
            chatMessageTextarea.val('');
            sys = '<div style="color:#f00">系统(' + now() + '):' + friend.name + '已经重连！</div>';
            toastr.info(sys);

        } else {
            chatMessageTextarea.attr('disabled', true);
            chatMessageTextarea.val('对方已离开聊天室。您无法发送消息');
            chatSendBtn.attr('disabled', true);
        }
    }

    function waitForFriendReconnect() {
    	p2pchatSocket.off('startChat').on('startChat', function(data){
    		toggelInput(true);
    	});
    }

    // Function that creates a new chat message
    function createChatMessage(msg, user, imgg, now) {

        var direction = '';
        var who = '';

        if (user === currentUser.name) {
            direction = 'pull-right';
            who = 'me';
        } else {
            direction = 'pull-left';
            who = 'you';
        }

        //TODO chat update image
        imgg = '/img/unnamed.jpg';

        var li = $(
            '<li class=' + who + '>' +
            '<div class="image">' +
            '<img src=' + imgg + ' />' +
            '<b></b>' +
            '<i class="timesent" data-time=' + now + '></i> ' +
            '</div>' +
            '<p></p>' +
            '</li>');

        // use the 'text' method to escape malicious user input
        li.find('p').text(msg);
        li.find('b').text(user);

        chats.append(li);

        messageTimeSent = $(".timesent");
        messageTimeSent.last().text(now.fromNow());
    }

    function scrollToBottom() {
        $("html, body").animate({ scrollTop: $(document).height() - $(window).height() }, 1000);
    }


});
