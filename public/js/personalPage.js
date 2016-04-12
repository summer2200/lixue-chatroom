// $(document).ready(function(){
//     //  When user clicks on tab, this code will be executed
//     $("#bottom-bar li").click(function() {
//         //  First remove class "active" from currently active tab
//         $("#bottom-bar li").removeClass('active');

//         //  Now add class "active" to the selected/clicked tab
//        $(this).addClass("active");

//         //  Hide all tab content
//         $(".tab-content").hide();

//         //  Here we get the href value of the selected tab
//         var selected_tab = $(this).find("a").attr("href");

//         //  Show the selected tab content
//         $(selected_tab).fadeIn();

//         //  At the end, we add return false so that the click on the link is not executed
//         return false;
//     });
//   // $("#simulate").click(function(){
//   //   $('a[rel="tab2"]').trigger("click");
//   // });
// });


$(document).ready(function() {
    var $tabs = $('#bottombar');

    $("a").click(function() {
        $(".recently").hide();
    });
    // $("#friends").click(function() {
    //    $tabs.tabs('enable', 2).tabs('select', 2).tabs('disable', [1,3]]);   
    // });
    // $("#groups").click(function() {
    //     $tabs.tabs('enable', 3).tabs('select', 3).tabs('disable', [1,2]);   
    // });
});
