
/**
 * Validates the stalequeue inputs
 * @param {any} stale_id id of most recent update
 */
function validateStaleQueue(stale_id) {
    var base_stale_id = "stale";
    var base_shield_id = "shield";

    if (stale_id == "staleEnable") {
        for (let i = 1; i < 10; i++) {
            let shield = document.getElementById(base_shield_id + i);
            let stale = document.getElementById(base_stale_id + i)

            if (document.getElementById("staleEnable").checked) {
                shield.disabled = false;
                stale.disabled = false;
            }
            else {
                stale.checked = false;
                stale.disabled = true;
                shield.checked = false;
                shield.disabled = true;
            }

        }

    }
    else if (stale_id.slice(0, -1) == base_shield_id) {
        if (document.getElementById(stale_id).checked) {
            document.getElementById(base_stale_id  + stale_id.slice(-1)).checked = true;
        }
    }
    else {
        if (!document.getElementById(stale_id).checked) {
            document.getElementById(base_shield_id + stale_id.slice(-1)).checked = false;
        }
    }
}

/**
 * Gets the player type from the radio options of the given name
 * 
 * @param {any} player_name the name of the radio options of the player you want the type of
 */
function getPlayerClassification(player_name) {
    var radio_buttons = document.getElementsByName(player_name);
    for (i = 0; i < radio_buttons.length; i++) {
        if (radio_buttons[i].checked) {
            return radio_buttons[i].value;
        }
    }
}

/**
 * Gets the amount of cost used by a slot in a select box
 * 
 * @param {any} select_id slot select_box_id to get slot value from
 */
function getSelectSlotCost(select_id) {
    var eff_info = JSON.parse(sessionStorage.getItem('eff_info'));

    var slot1_val = document.getElementById(select_id).value;

    // None value in first slot means no slots used
    if (slot1_val == -1) {
        return 0;
    }
    else if (slot1_val < eff_info[0].effects.length) {
        return parseInt(eff_info[0].effects[slot1_val].cost);
    }
    else {
        return parseInt(eff_info[1].effects[slot1_val - eff_info[0].effects.length].cost);
    }
}

/** @todo
 */
function spiritManager(called_by_id) {
    var p1 = {
        player_type: "p1_HorA",
        attack: "p1_attack",
        defense: "p1_defense",
        slot1: "p1_slots1",
        slot2: "p1_slots2",
        slot3: "p1_slots3",
        slot1_div: "p1_first_slot",
        slot2_div: "p1_second_slot",
        slot3_div: "p1_third_slot"
    };
    var p2 = {
        player_type: "p2_HorA",
        attack: "p2_attack",
        defense: "p2_defense",
        slot1: "p2_slots1",
        slot2: "p2_slots2",
        slot3: "p2_slots3",
        slot1_div: "p2_first_slot",
        slot2_div: "p2_second_slot",
        slot3_div: "p2_third_slot"
    };



    var player;

    // This could be cleaned up with classes but idk javascript well enough
    if (called_by_id.slice(0, 2) == 'p1') {
        player = p1
    }
    else if (called_by_id.slice(0, 2) == 'p2') {
        player = p2
    }

    var player_type = getPlayerClassification(player.player_type);

    console.log(player_type);

    var slots_used = slotsManager(player);

    if (player_type == "amiibo") {

        if (called_by_id.slice(3) == "attack" || called_by_id.slice(3) == "defense") {
            balanced_stats = balanceAtkDef(called_by_id.slice(3), document.getElementById(player.attack).value, document.getElementById(player.defense).value, slots_used);
        }
        else {
            balanced_stats = balanceAtkDef("slots", document.getElementById(player.attack).value, document.getElementById(player.defense).value, slots_used);
        }
        document.getElementById(player.attack).value = balanced_stats.atk;
        document.getElementById(player.defense).value = balanced_stats.def;
    }
    else {
        atk = document.getElementById(player.attack).value;
        def = document.getElementById(player.defense).value;
        if (atk > 7941) {
            atk = 7941;
        }
        else if (atk < 0) {
            atk = 0;
        }
        if (def > 10000) {
            def = 10000;
        }
        else if (def < 0) {
            def = 0;
        }
        document.getElementById(player.attack).value = atk;
        document.getElementById(player.defense).value = def;
    }

}

/**
 * Causes the correct amount of slots to appear based on cost used
 * 
 * @param {object} player player to modify, obj from spirit_manager
 */
function slotsManager(player) {
    var slot1_cost = getSelectSlotCost(player.slot1);
    var slot2_cost = 0;
    switch (slot1_cost) {
        case 0:
            // reset slots 2 and 3 to 0, neither visible
            document.getElementById(player.slot2).value = -1
            document.getElementById(player.slot2_div).style.display = "none";
            document.getElementById(player.slot3).value = -1
            document.getElementById(player.slot3_div).style.display = "none";
            sessionStorage.setItem(player.slot1, 0);
            sessionStorage.setItem(player.slot2, 0);
            return 0;
            break;

        case 1:
            slot2_cost = getSelectSlotCost(player.slot2);
            // Only regenerate items if slot 1 changed cost
            if (sessionStorage.getItem(player.slot1) != slot1_cost) {
                // reset slots 2 and 3 to 0, with slot 2 visible
                generateEffects(player.slot2, 1);
                document.getElementById(player.slot2_div).style.display = "block";
                sessionStorage.setItem(player.slot2, 0);

                document.getElementById(player.slot3).value = -1
                document.getElementById(player.slot3_div).style.display = "none";
                sessionStorage.setItem(player.slot1, slot1_cost);
                return 1;
            }
            else {
                sessionStorage.setItem(player.slot1, slot1_cost);

                if (slot2_cost == 0 || slot2_cost == 2) {
                    document.getElementById(player.slot3).value = -1
                    document.getElementById(player.slot3_div).style.display = "none";

                    sessionStorage.setItem(player.slot2, slot2_cost);
                    return 1 + slot2_cost;
                }
                else {
                    // Only regenerate items if slot 2 changed cost
                    if (sessionStorage.getItem(player.slot2) != slot2_cost) {
                        // reset slot 3 to 0, with slot 3 visible
                        generateEffects(player.slot3, 2);
                        document.getElementById(player.slot3_div).style.display = "block";

                        sessionStorage.setItem(player.slot2, slot2_cost);
                    }
                    return 1 + getSelectSlotCost(player.slot3);
                }
            }
            break;

        case 2:
            slot2_cost = getSelectSlotCost(player.slot2);

            // Only regenerate items if slot 1 changed cost
            if (sessionStorage.getItem(player.slot1) != slot1_cost) {
                // reset slots 2 and 3 to 0, with slot 2 visible
                generateEffects(player.slot2, 2);
                document.getElementById(player.slot2_div).style.display = "block";

                document.getElementById(player.slot3).value = -1
                document.getElementById(player.slot3_div).style.display = "none";
            }
            else {
                sessionStorage.setItem(player.slot2, slot2_cost);
            }
            sessionStorage.setItem(player.slot1, slot1_cost);
            return 2 + slot2_cost;
            break;

        case 3:
            // reset slots 2 and 3 to 0, neither visible
            document.getElementById(player.slot2).value = -1
            document.getElementById(player.slot2_div).style.display = "none";
            document.getElementById(player.slot3).value = -1
            document.getElementById(player.slot3_div).style.display = "none";
            sessionStorage.setItem(player.slot1, 3);
            sessionStorage.setItem(player.slot2, 0);
            return 3;
            break;
    }

    return 0;
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
    if (isNaN(atk)) {
        atk = 0
    }
    if (isNaN(def)) {
        def = 0
    }
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
            if (atk < min) {
                atk = min;
            }
            else if (atk > max) {
                atk = max;
            }
            if (def < min) {
                def = min;
            }
            else if (def > max) {
                def = max;
            }
            break;
    }


    return {
        "atk": atk,
        "def": def
    };
}

function adjustChargePercent(frames_charged) {
    let percent = frames_charged / 60 * 100;

    percent = Math.round(percent * 100) / 100;

    // displayed percent
    document.getElementById("charge_percent").innerHTML = percent + '%';

    // actual damage calculations
    var prev_damage = parseFloat(document.getElementById("output").innerHTML.slice(0, -1));
    var prev_frames = parseFloat(document.getElementById("prev_charge").innerHTML);
    document.getElementById("prev_charge").innerHTML = frames_charged;


    // for some reason these characters + attacks do 1.2x at full charge rather than 1.4x. IDK WHY

    var char_id = document.getElementById("chars").value;
    var move_id = document.getElementById("moves").value;
    var halved = false;

    // for oli and bayo it is all smashes
    if (char_id == 68 || char_id == 44) {
        halved = true;
    }
    // for mega, ness, villy, it is fsmash, up + down smash, and fsmash respectively
    else if ((char_id == 50 && move_id == 5) || (char_id == 10 && (move_id == 8 || move_id == 9)) || (char_id == 49 && move_id == 7)) {
        halved = true;
    }

    if (halved) {
        // new multiplier
        var multiplier = 1 + (0.006667 * frames_charged / 2);

        // gets uncharged damage
        prev_damage *= 1 / (1 + (0.006667 * prev_frames / 2));
    }
    else {
        // new multiplier
        var multiplier = 1 + 0.006667 * frames_charged;

        // gets uncharged damage
        prev_damage *= 1 / (1 + 0.006667 * prev_frames);
    }

    document.getElementById("output").innerHTML = Math.round(prev_damage * multiplier * 100) / 100 + '%';

}

/**
 * Updates the damage based on checkbox ID using multiplier
 * 
 * @param {number} multiplier The amount to mulitply the damage by
 * @param {string} id id of checkbox to adjust based on
 */
function updateDamage(multiplier, id) {
    var prev_damage = parseFloat(document.getElementById("output").innerHTML.slice(0, -1));
    if (document.getElementById(id).checked) {
        document.getElementById("output").innerHTML = Math.round(prev_damage * multiplier * 100) / 100 + '%';
    }
    else {
        document.getElementById("output").innerHTML = Math.round(prev_damage / multiplier * 100) / 100 + '%';
    }
}