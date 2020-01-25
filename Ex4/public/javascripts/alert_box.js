const alertBox = (function () {
    //this function hides the alert box if it is already on
    function hide()
    {
        document.getElementById('alert_box').classList.add('d-none');
    }

    //this function shows alert box
    function show(str, err) {

        //replaces between two classes
        function updateClassList(toRemove, toAdd) {
            document.getElementById('alert_box').classList.remove(toRemove);
            document.getElementById('alert_box').classList.add(toAdd);
        }

        if(err)
            updateClassList('alert-sucess', 'alert-danger'); //alert box red
        else
            updateClassList('alert-danger', 'alert-success'); //alert box green

        document.getElementById('alert_box').innerHTML = str;
        document.getElementById('alert_box').classList.remove('d-none');

    }

    return {
        hide: hide,
        show: show
    }

})();