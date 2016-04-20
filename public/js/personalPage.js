$(function() {
	var tabValue = window.location.hash;
	console.log(tabValue);

	if(tabValue) {
		 $('#myTabs a[href="#tabValue"]').tab('show'); // Select tab by name
	}
});