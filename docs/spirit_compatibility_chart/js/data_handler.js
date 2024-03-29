/**
 * Prevents an attempt to generate table before all session variables are created
 */
function loadDocWrapper() {
    loadDoc();
    var wait = setInterval(function () {
        if (JSON.parse(sessionStorage.getItem('compatibility_info')) != null) {

            let url = new URL(window.location.href);
            if (url.search == "") {
                // If this goes in xhttp_2 or outside of both generateChart gets called before either are done for some reason
                generateChart(0, 'false');
            }
            else {
                let params = url.searchParams;
                let val = params.get('char');

                // Sets default item in option box
                // code from https://stackoverflow.com/questions/7373058/changing-the-selected-option-of-an-html-select-element
                var opts = document.getElementById('chars').options;
                for (var opt, j = 0; opt = opts[j]; j++) {
                    if (opt.value == val) {
                        document.getElementById('chars').selectedIndex = j;
                        break;
                    }
                }

                generateChart(val, 'false');
            }

            clearInterval(wait);
        }
    }, 100); // check every 100ms

    // Needed to load side bar
    loadSideBar();
}

/**
 * Loads a document
 */
function loadDoc() {
    // load moves
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // hardcoded ID of selection box
            var char_select_id = "chars";

            // Get data from file into js object
            var compatibility_info = JSON.parse(this.responseText);

            // Get all names in obj to make select list from
            var char_names = [];
            for (var index = 0; index < compatibility_info.length; index++) {
                char_names.push(compatibility_info[index].name);
            }
            replaceSelectWithArray(char_names, char_select_id, false);

            // Store object in memory so we don't have to read from it again
            sessionStorage.setItem('compatibility_info', JSON.stringify(compatibility_info));
        }
    };
    xhttp.open("GET", "compatibility.json", true);
    xhttp.send();
}