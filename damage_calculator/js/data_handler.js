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
    xhttp.open("GET", "../data/moves.json", true);
    xhttp.send();

    // @todo add groups
    // actually implement slots
    // load spirit effects
    var xhttp_2 = new XMLHttpRequest();
    xhttp_2.onreadystatechange = function () {
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
    xhttp_2.open("GET", "../data/effects.json", true);
    xhttp_2.send();

    // Intialize session variables
    sessionStorage.setItem('p1_slots1', 0);
    sessionStorage.setItem('p1_slots2', 0);
    sessionStorage.setItem('p2_slots1', 0);
    sessionStorage.setItem('p2_slots2', 0);

    var xhttp_3 = new XMLHttpRequest();
    xhttp_3.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Get data from file into js object
            var connection_info = JSON.parse(this.responseText);

            // Store object in memory so we don't have to read from it again
            sessionStorage.setItem('connection_info', JSON.stringify(connection_info));

        }
    };
    xhttp_3.open("GET", "../data/connect.json", true);
    xhttp_3.send();

}

/**
 * Generate moves
 * 
 * @param {string} char_id The index of the character's moves we want to generate
 */
function generateMoves(char_id) {
    var mov_select_id = "moves";
    var char_info = JSON.parse(sessionStorage.getItem('char_info'));
    var move_names = [];
    var disabled_move_ids = [];
    // Creates list of names for array function + marks disabled options
    for (var i = 0; i < char_info[char_id].moves.length; i++) {
        move_names.push(char_info[char_id].moves[i].name);
        if (char_info[char_id].moves[i].hitboxes[0] == null) {
            disabled_move_ids.push(char_info[char_id].moves[i].id)
        }
    }

    replaceSelectWithArray(move_names, mov_select_id, false);

    // Disables moves with null data
    for (var i = 0; i < disabled_move_ids.length; i++) {
        document.getElementById(mov_select_id).options[disabled_move_ids[i]].setAttribute("disabled", true)
    }

    // Since moves are refreshed hitboxes should be refreshed
    generateHitBoxes(char_id, 0);
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

/**
 * Generate Hitboxes
 * 
 * @param {string} char_id
 * @param {string} move_id
 */
function generateHitBoxes(char_id, move_id) {
    var hitbox_select_id = "hitboxes";
    var hitbox_div_id = "hitbox_div";
    var short_hop_id = "short_hop"
    var short_hop_div_id = "short_hop_div"

    var char_info = JSON.parse(sessionStorage.getItem('char_info'));
    var hitbox_names = [];
    var disabled_hitbox_ids = [];

    for (var i = 0; i < char_info[char_id].moves[move_id].hitboxes.length; i++) {
        hitbox_names.push(char_info[char_id].moves[move_id].hitboxes[i].name);
        if (isNaN(char_info[char_id].moves[move_id].hitboxes[i].damage)) {
            disabled_hitbox_ids.push(char_info[char_id].moves[move_id].hitboxes[i].id)
        }
    }
    replaceSelectWithArray(hitbox_names, hitbox_select_id, false);

    // if only one hitbox exists, no need for extra field
    if (hitbox_names.length == 1) {
        document.getElementById(hitbox_div_id).style.display = "none";
        document.getElementById(hitbox_select_id).value = "0";
    }
    else {
        document.getElementById(hitbox_div_id).style.display = "block";
    }
    // if move is an aerial, enable shorthop option
    if (char_info[char_id].moves[move_id].name.slice(-6) == "aerial") {
        document.getElementById(short_hop_div_id).style.display = "block";
    }
    else {
        document.getElementById(short_hop_div_id).style.display = "none";
        document.getElementById(short_hop_id).checked = false;
    }
    // if move damage is "variable" it cannont be used and needs to be disabled
    for (var i = 0; i < disabled_hitbox_ids.length; i++) {
        document.getElementById(hitbox_select_id).options[disabled_hitbox_ids[i]].setAttribute("disabled", true)
    }
}