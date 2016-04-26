function isValid(thatemail) {

    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(thatemail);
}

function scrollToBottom() {
    $("html, body").animate({ scrollTop: $(document).height() - $(window).height() }, 1000);
}

//获取当前时间
function now() {
  var date = new Date();
  var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + ":" + (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds());
  return time;
}


toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": true,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
};

var onlineUsers = [];
var socket = io();

socket.on('p2pchat', function(data){
  //显示系统消息
  alert(12)
  var sys = '';
  onlineUsers = Object.keys(data.users);
  if (data.user != fromUser) {
      sys = '<div style="color:#f00">系统(' + now() + '):' + '用户 ' + data.user + ' 上线了！</div>';
  } else {
      sys = '<div style="color:#f00">系统(' + now() + '):你进入了聊天室！</div>';
  }
  toastr.info(sys);

  if (pannel === '#pane2') {
      drawMyFriendsList();
  }
});

  var url = window.location.pathname;
  if (!(url === '/sign-up' || url === '/')) {
      $(".homebanner #signIn").hide();
  }

