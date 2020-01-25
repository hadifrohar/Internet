
(function () {

    const github_api = 'https://api.github.com/users/'; //github api path


    let Utils = (function () {

        /**
         *
         * @param str: string, in our case it is username
         * @returns {string}: string without white spaces
         */
        const removeWhiteSpaces = (str) => str.replace(/\s+/g,'').trim();

        /**
         * @returns {string}: returns user input (in the search box) without whitespaces
         */
        const getInput = () => removeWhiteSpaces(document.getElementById('user_input').value);

        /**
         * @param data: json data
         * @param data.full_name: full name of a github repo
         * @returns full name of a github repo from json object. for example hadifrohar/Internet

         */
        const getFullName = (data) => data.full_name;

        /**
         *
         * @param data: json data
         * @param data.html_url: html url of
         * @returns html url from json object
         */
        const getHtmlUrl = (data) => data.html_url;


        /**
         * @param data: json data
         * @param data.login: username of github user
         * @returns github profile
         */
        const getGithubProfile = (data) => 'https://github.com/'+data;


        /**
         *
         * @param data: json objet data
         * @param data.login: username of github user
         * @returns returns username from json object
         */
        const getLogin = (data) => data.login;

        /**
         * @param str: string
         * @returns boolean: if string is empty or not
         */
        function isEmpty(str) {
            if(str== null || str.trim() === '')
            {
                alertBox.show('Username cannot be empty', true);
                return true;
            }

            return false;
        }

        /**
         * It shows an alertbox if there is an error with the appropriate message
         * @param status: status of http request
         * @returns boolean if it is an ok status (success) or not
         */
        function validResponse(status)
        {
            if(status>=200 && status <300)
                return true;
            else if(status === 404)
                alertBox.show('No such user!', true);
            else
                alertBox.show('Error '+status, true);

            return false;
        }

        /**
         *
         * @param username: username to add to the request
         * @returns {{headers: {"Content-Type": string}, method: string, body: *}} ajax parameters
         */
        function postUserParam(username) {
            return {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username: username})
            }
        }

        /**
         * Converts string of usernames to array of strings
         * @param savedUsers: string of usernames splitted by ,
         * @returns {Array|string[]}: array contains all usernames
         */
        function getSavedUsers(savedUsers){
            if(savedUsers === '' || savedUsers == null)
                return [];
            else
                return savedUsers.split(',');
        }


        /**
         *
         * @returns {HTMLElement}: html element of the demo box (which shows a live demo of github username)
         */
        const getDemoBox = () => document.getElementById('demo-box');

        /**
         * @returns {HTMLElement}: html element of the saved box (which shows saved users)
         */
        const getSavedBox = () => document.getElementById('saved-box');

        return {
            getInput: getInput,
            getFullName: getFullName,
            getHtmlUrl: getHtmlUrl,
            getGithubProfile: getGithubProfile,
            getLogin: getLogin,
            isEmpty: isEmpty,
            validResponse: validResponse,
            postUserParam: postUserParam,
            getDemoBox: getDemoBox,
            getSavedBox: getSavedBox,
            getSavedUsers: getSavedUsers
        }

    })();

    //list class
    class HTMLList {

        /**
         *
         * @param name: list name (header)
         * @param init_data: initial data to initialize the list
         * @param getTitle: function to get the text in the list element
         * @param getUrl: function to get the url to refer when clicking on the element (href)
         */
        constructor(name, init_data, getTitle, getUrl) {
            this.getTitle = getTitle;
            this.getUrl = getUrl;
            this.num_of_elements = init_data.length;

            this.list_block = document.createElement('div');
            this.list_name = document.createElement('h2'); //list name\title
            this.list_div = document.createElement('div'); //the list element

            this.list_name.classList.add('font-weight-bold');
            this.list_name.appendChild(document.createTextNode(name+': '+this.num_of_elements));

            this.list_block.appendChild(this.list_name);
            this.list_block.appendChild(this.list_div);

            this.list_div.classList.add('list-group');
            if (this.num_of_elements === 0)
                this.list_div.appendChild(document.createTextNode('No '+name.toLowerCase()));
            else
                init_data.forEach(element => {
                    this.list_div.appendChild(this.createListElement(element));
                });
        }

        /**
         * @param data: json data which contains text and url
         * @returns {HTMLAnchorElement}: returns an list element with the text and url (anchor)
         */
        createListElement(data)
        {
            let list_element = document.createElement('a');
            list_element.classList.add('list-group-item', 'list-group-item-action');
            list_element.target = '_blank';
            list_element.href = this.getUrl(data);
            list_element.appendChild(document.createTextNode(this.getTitle(data)));
            return list_element;
        }

        /**
         * @returns {HTMLDivElement}: returns the html element of the full list block (list and header)
         */
        getList() {
            return this.list_block;
        }
    }



    //searches for an github user using their api, and shows a live demo of the user which contains all the
    //repos of the user, and all of his followers
    function search()
    {
        alertBox.hide();
        Utils.getDemoBox().classList.add('d-none');

        const username =  Utils.getInput();
        if(Utils.isEmpty(username))
            return;

        let htmlElement = document.getElementById('user-details');
        htmlElement.innerHTML = '';


        fetch(github_api+username).then(function(response){ //fetches the user
            if(!Utils.validResponse(response.status))
                return;

            response.json().then(function (data) {

                Utils.getDemoBox().classList.remove('d-none');
                let name = document.createElement('h5');
                name.classList.add('font-weight-bold');
                name.appendChild(document.createTextNode(Utils.getLogin(data)));
                htmlElement.appendChild(name);
                return fetch(github_api+username+'/repos');

            }).then(function(response){ //fetches user repos

                if(!Utils.validResponse(response.status))
                    return;

                response.json().then(function(data) { //creates repos html list
                    htmlElement.appendChild(new HTMLList('Repositories', data, Utils.getFullName,
                        Utils.getHtmlUrl).getList());
                    return fetch(github_api+username+'/followers') //fetches user followers

                }).then(function(response){

                    if(!Utils.validResponse(response.status))
                        return;

                    response.json().then(function(data){ //creates followers html list
                        htmlElement.appendChild(new HTMLList('Followers', data, Utils.getLogin,
                            Utils.getHtmlUrl).getList());
                    })
                })

            })
        })

    }

    //saves a github user to the server
    function save_user()
    {
        alertBox.hide();
        const username = Utils.getInput();
        if(Utils.isEmpty(username))
            return;


        fetch('./save', Utils.postUserParam(username)).then(function(response) { //posts request to the server
            if(response.status !== 200) {
                alertBox.show('Username already saved!', true);
                return;
            }

            response.json().then(function(data) {
                alertBox.show(data.msg, false);
                init_saved(); //updates saved list
            });
        });

    }

    //deletes saved github user
    function delete_user() {
        alertBox.hide();
        const username = Utils.getInput();
        if(Utils.isEmpty(username))
            return;

        fetch('./delete', Utils.postUserParam(username)).then(function(response) {
            if(response.status !== 200) {
                alertBox.show('No such username!', true);
                return;
            }

            response.json().then(function(data) {
                alertBox.show(data.msg, false);
                init_saved(); //updates saved list
            });
        });
    }


    /**
     * initialize saved list: it gets saved users from the server and creates an HTMLList object of it
     * and shows it in the saved list objects
     */
    function init_saved() {
        fetch('./getSaved', {method: 'GET', headers: {'Content-Type': 'application/json'}}).then(
            function(response) {
                if(response.status !== 200) {
                    alertBox('Error ' + response.status + ': ' + response.statusText, true);
                    return;
                }
                response.json().then(function(data) {
                    Utils.getSavedBox().innerHTML = '';
                    Utils.getSavedBox().appendChild(new HTMLList('Saved users', Utils.getSavedUsers(data.users),
                        data => data, Utils.getGithubProfile).getList());
                })
            }
        )
    }




    //updates saved list
    init_saved();



    //buttons listeners
    document.addEventListener('DOMContentLoaded', function () {
        document.getElementById("search-button").addEventListener("click", search);

        document.getElementById("save-button").addEventListener("click", save_user);

        document.getElementById("delete-button").addEventListener("click", delete_user);

        //hides alertbox when user enters\removes anything
        document.getElementById('user_input').addEventListener('input', alertBox.hide);
    }, false);

})();

