$(function() {
	var tabValue = window.location.hash;
	console.log(tabValue);

	if(tabValue) {
		 $('#myTabs a[href="#tabValue"]').tab('show'); // Select tab by name
		 $("#pane2").append('<li><a href="/p2p-chat"><span class="tab">'+name+'</span></a></li>');
	}


});