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
            replaceSelectWithArray(char_names, char_select_id);

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

            // Get data from file into js object
            var eff_info = JSON.parse(this.responseText);

            // Get all names in obj to make select list from
            var eff_names = [];
            for (var index = 0; index < eff_info.length; index++) {
                eff_names.push(eff_info[index].name);
            }
            replaceSelectWithArray(eff_names, eff1_select_id);

        }
    };
    xhttp.open("GET", "effects.json", true);
    xhttp.send();
}

/**
 * Generate moves
 * 
 * @param {string} char_id The index of the character's moves we want to generate
 */
function generateMoves(char_id) {
    var char_info = JSON.parse(sessionStorage.getItem('char_info'));
    var move_names = [];
    for (i = 0; i < char_info[char_id].moves.length; i++) {
        move_names.push(char_info[char_id].moves[i].move_name);
    }
    replaceSelectWithArray(move_names, "moves");
}
