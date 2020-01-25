
(function(exports) {

    /**
     * checks if string contains special characters such as !@#$ or whitespaces
     * @param c: string
     * @returns {boolean}: True if yes, false otherwise
     */
    const containsSpecialChar = (c) => !/^[a-zA-z0-9]+$/.test(c);


    /**
     * returns if user is valid: doesn't contain special characters or empty
     * @param user: string
     * @returns {boolean}: True if it is valid, otherwise false
     */
    exports.isValidUser = (user) => !containsSpecialChar(user) && !(user.trim().length === 0);

    /**
     * Checks if password is valid
     * @param password: string
     * @returns {boolean}: True if valid (length >=4) otherwise false
     */
    exports.isValidPassword = (password) => password.length >= 4;


    //contains different error messages
    exports.ValidationErrors = (function () {

        const USERNAME = 'Username cannot be empty or contain special characters or whitespaces!';
        const PASSWORD = 'Password length cannot be less than 4 characters!';

        return {
            USERNAME : USERNAME,
            PASSWORD: PASSWORD
        }
    })();

})(typeof exports === 'undefined'?
    this['validation']={}: exports); //shared code between server and client
