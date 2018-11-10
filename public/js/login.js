$(document).ready(function () {
    //on the event of clicking the submit button
    $("#submit").click(function (event) {
        console.log('clicked');      
        $.ajax({
            url: "http://localhost:3000/loginAttempt",  //redirect to this route
            type: "POST",  
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                username: $('#username').val(),   //username
                password: $('#password').val()    //password
            }
        }).done(function(data){
               console.log("--->" + data);
               location.assign(data);             //if success assign data      
        }).fail(function(data){
            $('#error').html("Invalid login");    //if error displays invalid login in the span tag
        });     
    });
});



// $(document).ready(function () {
//     var email, pass;
//     $("#submit").click(function () {
//         email = $("#email").val();
//         pass = $("#password").val();
//         $.post("http://localhost:2999/login", { email: email, pass: pass }, function (data)
//     if (data === 'done') {
//             //set URL of the current page to /admin
//             window.location.href = "/admin";
//         }
//     });
// });
//     });