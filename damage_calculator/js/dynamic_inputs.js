/**
 * Removes the given ID from the html
 * @param {string} div_id
 */
function removeDiv(div_id) {
    div_id = "first_slot";
    var obj = document.getElementById(div_id);
    obj.remove();
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
function replaceSelectWithArray(array, select_id_to_replace) {
    select_box = document.getElementById(select_id_to_replace);
    // Removes all items in select_box currently, if they exist
    var len = select_box.options.length;
    if (len) {
        for (var i = len; i; i--) {
            console.log(i);
            var par = select_box.options[i - 1].parentNode;
            par.removeChild(select_box.options[i - 1]);
        }
    }

    for (var i = 0; i < array.length; i++) {
        var opt = document.createElement('option');
        opt.setAttribute("value", i);
        opt.appendChild(document.createTextNode(array[i]));
        select_box.appendChild(opt);
    }
}



/** @todo
 */
function spiritManager(called_by_id) {
    var p1 = {
        attack: "p1_attack",
        defense: "p1_defense"
    };
    var p2 = {
        attack: "p2_attack",
        defense: "p2_defense"
    };

    var player;
    // This could be cleaned up with classes but idk javascript well enough
    if (called_by_id.slice(0, 2) == 'p1') {
        player = p1
    }
    else if (called_by_id.slice(0, 2) == 'p2') {
        player = p2
    }
    balanced_stats = balanceAtkDef(called_by_id.slice(3), document.getElementById(player.attack).value, document.getElementById(player.defense).value, 3);
    document.getElementById(player.attack).value = balanced_stats.atk
    document.getElementById(player.defense).value = balanced_stats.def

}

/** @todo
 */
function slotManager() {
    balanceAtkDef('slots');
}


/**
 * Changes the values of attack/defense in accordance with stat cap and individual max/min
 * The one that was changed most recently (determined by called_by_id) stays (within max/min)
 * and the other value adjusts to make the build legal
 * 
 * @param {string} priority_stat attack or defense are inputs. Used to determine what to subtract from
 * @param {number} atk Attack stat
 * @param {number} def Defense stat
 * @param {number} slots_used Number of slots used
 */
function balanceAtkDef(priority_stat, atk, def, slots_used) {
    atk = parseInt(atk)
    def = parseInt(def)
    // Stat cap, indivdual stat max, individual stat min
    var cap, max, min;
    switch (slots_used) {
        case 0:
            cap = 5000;
            max = 5000;
            min = 0;
            break;

        case 1:
            cap = 4700;
            max = 4950;
            min = -150;
            break;

        case 2:
            cap = 4500;
            max = 4750;
            min = -250;
            break;

        case 3:
            cap = 4200;
            max = 4600;
            min = -400;
            break;
    }

    switch (priority_stat) {
        case 'attack':
            if (atk > max) {
                atk = max
            }
            else if (atk < min) {
                atk = min
            }
            if (atk + def > cap) {
                var difference = cap - (atk + def);
                def += difference;
            }
            break;
    
        case 'defense':
            if (def > max) {
                def = max
            }
            else if (def < min) {
                def = min
            }
            if (atk + def > cap) {
                var difference = cap - (atk + def);
                atk += difference;
            }
            break;
    
        case 'slots':
            if (atk + def > cap) {
                var difference = cap - (atk + def);
                difference = parseInt(difference / 2);
                atk += difference;
                def += difference;
            }
            break;
    }


    return {
        "atk": atk,
        "def": def
    };
}