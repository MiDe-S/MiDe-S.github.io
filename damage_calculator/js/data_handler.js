/**
 * Loads a given document
 * @todo
 */
function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            /*var test = this.responseText.replace(/\n/g, "<br>");*/
            var test = this.responseText.split("\n");

            replaceSelectWithArray(test, "chars");
        }
    };
    xhttp.open("GET", "characters.csv", true);
    xhttp.send();
}

/**
 * Replaces selection list of given ID with given array
 * 
 *  reference https://www.w3schools.com/jsref/dom_obj_select.asp
 * @param {Array} array_list Array to use as selection list
 * @param {string} select_id_to_replace ID of selction list to replace array_list with
 */
function replaceSelectWithArray(array_list, select_id_to_replace) {

    var select_box = document.createElement("select");
    select_box.setAttribute("id", "replaced_select_box");
    document.getElementById(select_id_to_replace).innerHTML = select_box
    var i = 0;
    for (i = 0; i < array_list.length; i++) {
        var option = document.createElement("option");
        option.setAttribute("value", array_list[i]);
        var text_node = document.createTextNode(array_list[i]);
        option.appendChild(text_node);
        document.getElementById(select_id_to_replace).appendChild(option);
    }


}
