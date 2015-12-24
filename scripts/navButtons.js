
//set button style for active/inactive pages
$(document).ready(function(){
	var currentPage = window.location.pathname;
	var calcPage = '/calcProject/calcProjectMain.html';
	var sandboxPage = '/sandbox/sandbox.html';
	var homePage = '/';

	console.log(currentPage);

	$('li').removeClass('active');

	switch(currentPage){
		case calcPage:
			$("#calcBtn").addClass('active');
			break;
		case sandboxPage:
			$("#sandboxBtn").addClass('active');
			break;
		default:
			$("#homeBtn").addClass('active');
		}
});

$(function() {
  $("li").on("click",function() {
    var btn =$(this);
    console.log(btn)
  });
});

function alertOnClick() {
       alert("button was clicked!")

}

