/**
 * Loads a given document
 * @todo
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

            // Get moves from default option
            generateMoves(document.getElementById(char_select_id).value);

        }
    };
    xhttp.open("GET", "moves.json", true);
    xhttp.send();

    // @todo add groups
    // actually implement slots
    // load spirit effects
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // hardcoded ID of selection box
            var eff1_select_id = "p1_slots1";
            var eff2_select_id = "p2_slots1";

            // Get data from file into js object
            var eff_info = JSON.parse(this.responseText);

            // Store object in memory so we don't have to read from it again
            sessionStorage.setItem('eff_info', JSON.stringify(eff_info));

            generateEffects(eff1_select_id, 0);
            generateEffects(eff2_select_id, 0);

        }
    };
    xhttp.open("GET", "effects.json", true);
    xhttp.send();

    // Intialize session variables
    sessionStorage.setItem('p1_slots1', 0);
    sessionStorage.setItem('p1_slots2', 0);
    sessionStorage.setItem('p2_slots1', 0);
    sessionStorage.setItem('p2_slots2', 0);

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
 * Generate moves
 * 
 * @param {string} char_id The index of the character's moves we want to generate
 */
function generateMoves(char_id) {
    var char_info = JSON.parse(sessionStorage.getItem('char_info'));
    var move_names = [];
    for (var i = 0; i < char_info[char_id].moves.length; i++) {
        move_names.push(char_info[char_id].moves[i].move_name);
    }
    replaceSelectWithArray(move_names, "moves", false);
}

/**
 * Generate moves
 * 
 * @param {string} select_id The id of the select box to generate moves into
 * @param {number} slots_used The number of slots used
 */
function generateEffects(select_id, slots_used) {
    var eff_info = JSON.parse(sessionStorage.getItem('eff_info'));
    effect_names = ["None", [{name: "None", cost: "0", id: "-1"}]];
    for (var i = 0; i < eff_info.length; i++) {
        effect_names.push(eff_info[i].name);

        actual_effects = [];
        for (var j = 0; j < eff_info[i].effects.length; ++j) {
            if ((slots_used + parseInt(eff_info[i].effects[j].cost)) <= 3) {
                actual_effects.push(eff_info[i].effects[j]);
            }
        }
        effect_names.push(actual_effects);
    }
    replaceSelectWithArray(effect_names, select_id, true);
}