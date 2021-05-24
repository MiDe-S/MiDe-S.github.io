/**
 * Prevents an attempt to generate table before all session variables are created
 */
function loadDocWrapper() {
    loadDoc();
    var wait = setInterval(function () {
        if (JSON.parse(sessionStorage.getItem('connection_info')) != null && JSON.parse(sessionStorage.getItem('char_info')) != null) {
            // If this goes in xhttp_2 or outside of both generateChart gets called before either are done for some reason
            generateChart(0, 'false');
            clearInterval(wait);
        }
    }, 100); // check every 100ms
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
            var charater_info = JSON.parse(this.responseText);

            // Get all names in obj to make select list from
            var char_names = [];
            for (var index = 0; index < charater_info.length; index++) {
                char_names.push(charater_info[index].name);
            }
            replaceSelectWithArray(char_names, char_select_id, false);

            // Store object in memory so we don't have to read from it again
            sessionStorage.setItem('char_info', JSON.stringify(charater_info));
        }
    };
    xhttp.open("GET", "../data/moves.json", true);
    xhttp.send();


    var xhttp_2 = new XMLHttpRequest();
    xhttp_2.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Get data from file into js object
            var connection_info = JSON.parse(this.responseText);

            // Store object in memory so we don't have to read from it again
            sessionStorage.setItem('connection_info', JSON.stringify(connection_info));

        }
    };
    xhttp_2.open("GET", "../data/connect.json", true);
    xhttp_2.send();

}

/**
 * Replaces selection list of given ID with given array
 * values of selection box are item's index in array
 * 
 *  reference http://dyn-web.com/tutorials/forms/select/paired.php
 * @param {object} array array to replace list with
 * @param {string} select_id_to_replace ID of selection list to replace with char_info
 * @todo mess with groups
 */
function replaceSelectWithArray(array, select_id_to_replace, group_bool) {
    select_box = document.getElementById(select_id_to_replace);

    // Removes items from select_box
    if (group_bool) {
        groups = select_box.getElementsByTagName('optgroup');
        let len = groups.length
        for (var i = len; i > 0; i--) {
            select_box.removeChild(groups[i-1])
        }
    }
    let len = select_box.options.length;
    if (len) {
        for (var i = len; i; i--) {
            var par = select_box.options[i - 1].parentNode;
            par.removeChild(select_box.options[i - 1]);
        }
    }

    // Adds items to select_box
    if (group_bool) {
        for (var i = 0; i < array.length; i += 2) {
            group = document.createElement('optgroup')
            group.label = array[i]

            let eff_len = array[i + 1].length
            for (var j = 0; j < eff_len; ++j) {
                var opt = document.createElement('option');
                opt.setAttribute("value", array[i + 1][j].id);
                opt.appendChild(document.createTextNode(array[i + 1][j].name + ' (' + array[i + 1][j].cost + ')'));
                group.appendChild(opt);

            }
            select_box.appendChild(group)
        }
    }
    else {
        for (var i = 0; i < array.length; i++) {
            var opt = document.createElement('option');
            opt.setAttribute("value", i);
            opt.appendChild(document.createTextNode(array[i]));
            select_box.appendChild(opt);
        }
    }
}

/**
 * Determines if the effect applies to the move
 * 
 * @param {Object} move move_obj to test from moves.json
 * @param {Object} effect effect_obj to test from conect.json
 * @returns {string} returns "True", "False", "Mixed", "Null" based on if it applies or not
 */
function doesEffectApply(move, effect) {
    if (move.hitboxes[0] == null || effect.type == null) {
        return "Null";
    }
    
    var type_or_effect = effect.type;

    // If value is different from previous value, loop can end early with mixed
    var prev_value = null;

    for (let j = 0; j < effect.indicators.length; j++) {
        for (let i = 0; i < move.hitboxes.length; i++) {
            if (type_or_effect == "type" || type_or_effect == "effect") {
                if (move.hitboxes[i][type_or_effect] == effect.indicators[j]) {
                    if (i != 0 && prev_value == "False") {
                        return "Mixed";
                    }
                    prev_value = "True";
                }
                else {
                    if (i != 0 && prev_value == "True") {
                        return "Mixed";
                    }
                    prev_value = "False";
                }
            }
            // For Toss and Meteor
            else if (type_or_effect == "angle") {
                if (!isNaN(move.hitboxes[i].angle) && ((60 <= parseFloat(move.hitboxes[i].angle) && parseFloat(move.hitboxes[i].angle) <= 120) || (241 <= parseFloat(move.hitboxes[i].angle) && parseFloat(move.hitboxes[i].angle) <= 300))) {
                    if (i != 0 && prev_value == "False") {
                        return "Mixed";
                    }
                    prev_value = "True";
                }
                else {
                    if ((i != 0 && prev_value == "True") || move.hitboxes[i].angle == "BOTH") {
                        return "Mixed";
                    }
                    prev_value = "False";
                }
            }
            // For shooting attack up
            else if (type_or_effect == "direct") {
                if (move.hitboxes[i][type_or_effect] == "True") {
                    if (i != 0 && prev_value == "True") {
                        return "Mixed";
                    }
                    prev_value = "False";
                }
                else {
                    if (i != 0 && prev_value == "False") {
                        return "Mixed";
                    }
                    prev_value = "True";
                }
            }
        }
        // If one indicator is true, others don't need to be checked
        if (prev_value == "True") {
            return "True";
        }
    }
    return prev_value;
}