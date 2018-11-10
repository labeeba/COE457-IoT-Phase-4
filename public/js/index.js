// to redirect get started button to sign up page
// document.getElementById("getstarted").onclick = function () {
//         window.location.href = "/signup";
//       }

//jquery to redirect user to signup route on click of button
$(document).ready(function(){
  $("#getstarted").click(function(event){
        window.location.href = "/signup";
  });
});
