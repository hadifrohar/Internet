(function () {


    /**
     * This function takes an action "login" or "register" and then sends to the server a request to do
     * the necessary action
     * @param action: action to do
     */
    function submit(action) {
        if(!validation.isValidUser(document.getElementById('username').value)) //validates username
            alertBox.show(validation.ValidationErrors.USERNAME, true);
        else if(!validation.isValidPassword(document.getElementById('password').value)) //validates password
            alertBox.show(validation.ValidationErrors.PASSWORD, true);
        else
        {
            fetch(action, {method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username: document.getElementById('username').value,
                    password: document.getElementById('password').value,
                    remember: document.getElementById('remember').checked}) //sends request to server

            }).then(function(response) {
                response.json().then(function(data) {
                    if(response.status !== 200)
                        alertBox.show(data.msg, true); //request was not done
                    else {
                        alertBox.show(data.msg, false); //request done. authenticated.
                        setTimeout(function() {
                            location.replace("/");
                        }, 500);
                    }
                });
            });
        }

    }

    document.addEventListener('DOMContentLoaded', function () {
        document.getElementById("login-btn").addEventListener("click", function(){
            submit('./login')
        });
        document.getElementById("register-btn").addEventListener("click", function(){
            submit('./register')
        });
        document.getElementById('username').addEventListener('input', alertBox.hide);
        document.getElementById('password').addEventListener('input', alertBox.hide);

    }, false);

})();

