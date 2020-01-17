$('.form-login').on('submit', function(e) {
    e.preventDefault();
    var $this = $(this);
    $.ajax({
        url: "/login",
        data : $this.serialize(),
        dataType : 'json',
        cache: false,
        method: 'POST',
        type: 'POST',
        success: function (response) {
            if (response.errors && response.errors.length) {
                    $('.login-page').prepend(response.errors.map(function(errMessage) {
                        return '\n' +
                            '    <div class="alert alert-danger">\n' +
                            '        <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>\n' +
                            '        <span class="alert-message">' + errMessage + '</span>\n' +
                            '    </div>';
                    }));
            } else {
                console.log('reroute to /home');
                window.location.href = "http://localhost:5000/home";
            }
        },
        error: function () {
        }
    });
    return false;
});
// new Vue({
//     el: '#app',
//     data: {
//         counter: 0,
//         counter2: 0
//     },
//     methods: {
//         riseCounter: function () {
//             this.counter++;
//         }
//     }
// });