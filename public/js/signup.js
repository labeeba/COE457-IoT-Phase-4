$(document).ready(function () {

    // function validateEmail(email) {
    //     var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //     return re.test(String(email).toLowerCase());
    // }

    //on clicking submit button
    $("#submit").click(function (event) {
        console.log('Clicked');
        $.ajax({
            url: "/registerAttempt",   //registerattempt route
            type: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                email: $('#email').val(),           //email
                username: $('#username').val(),     //username
                password: $('#password').val(),     //password
                location: $('#location').val(),     //location
            },
            //a function to be called if the request succeeds
            success: function (data) {
                location.assign(data);
            }
        });
    });
});