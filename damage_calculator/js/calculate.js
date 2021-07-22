/**
 * Clears a given table of all rows
 * 
 * @param {any} table_id id of table to clear
 */
function clearTable(table_id) {
    table = document.getElementById(table_id);
    var len = table.rows.length;
    for (let i = len; i > 1; --i) {
        table.removeChild(table.rows[i - 1])
    }
    // removes every th of the header besides the first option
    row = table.rows[0];
    len = row.children.length;
    for (let i = len; i > 1; --i) {
        row.removeChild(row.children[i - 1]);
    }
}

/**
 * Adds given array as a row to given table
 * 
 * @param {Array} row_data array to add
 * @param {string} table_id id of table to add row to
 * @param {boolean} header if header row or not
 */
function addRow(row_data, table_id, header) {
    var table = document.getElementById(table_id);

    if (header) {
        var row = table.rows[0];
    }
    else {
        var row = document.createElement("tr");
        if (table.rows.length % 2 == 0) {
            row.classList.add("even_alternating_colors");
        }
        else {
            row.classList.add("odd_alternating_colors");
        }
    }

    for (var i = 0; i < row_data.length; i++) {
        if (header) {
            var col = document.createElement("th");
        }
        else {
            var col = document.createElement("td");
        }

        col.appendChild(document.createTextNode(row_data[i]));

        row.appendChild(col);
    }

    table.appendChild(row);
}

/**
 * Calculates the multiplier from the given move and given effect
 * 
 * @param {string} effect_id id of effect to check
 * @param {Object} move move object from moves.json
 * @param {string} hitbox_id id of hitbox to check
 * @param {string} atk_or_def HAS TO BE attack_multi OR defense_multi
 * @returns {number} multiplier of effect buff/debuff
 */
function getEffectMultiplier(effect_id, move, hitbox_id, atk_or_def) {
    var connection_info = JSON.parse(sessionStorage.getItem('connection_info'));
    var eff_info = JSON.parse(sessionStorage.getItem('eff_info'));
    var effect;
    var multiplier = 1;
    var conditional = false;

    // -1 value indicates None
    if (effect_id == -1) {
        return { "multiplier": multiplier, "conditional": "always" }
    }
    // Need to do this to get proper effect because of group label
    else if (effect_id < eff_info[0].effects.length) {
        effect = eff_info[0].effects[effect_id];
    }
    else {
        effect = eff_info[1].effects[effect_id - eff_info[0].effects.length];
    }

    condition = ["always", "conditional"];
    for (var j = 0; j < condition.length; j++) {
        if (effect[condition[j]] != null) {
            if (j == 1) {
                conditional = true;
            }
            if (effect[condition[j]] == "ALL") {
                multiplier = multiplier * parseFloat(effect[atk_or_def]);
            }
            else if (effect[condition[j]] == "AERIALS" && move.name.slice(-6) == "aerial") {
                multiplier = multiplier * parseFloat(effect[atk_or_def]);
            }
            else if (effect[condition[j]] == "SMASH_ATTACKS" && move.name.slice(-5) == "smash" && move.name != "Final Smash") {
                multiplier = multiplier * parseFloat(effect[atk_or_def]);
            }
            else if (effect[condition[j]] == "SPECIAL_MOVES" && move.name.slice(-7) == "special") {
                multiplier = multiplier * parseFloat(effect[atk_or_def]);
            }
            else if (effect[condition[j]] == "ONE" && connection_info["ONE"][effect.name] == move.name) {
                multiplier = multiplier * parseFloat(effect[atk_or_def]);
            }
            else if (effect[condition[j]] == "SEARCH") {
                if (connection_info["SEARCH"][effect_id].type == "type") {
                    for (let i = 0; i < connection_info["SEARCH"][effect_id].indicators.length; i++) {
                        if (move.hitboxes[hitbox_id].type == connection_info["SEARCH"][effect_id].indicators[i] + " (type)") {
                            multiplier = multiplier * parseFloat(effect[atk_or_def]);
                        }
                    }
                }
                else if (connection_info["SEARCH"][effect_id].type == "effect") {
                    for (let i = 0; i < connection_info["SEARCH"][effect_id].indicators.length; i++)
                        if (move.hitboxes[hitbox_id].type == connection_info["SEARCH"][effect_id].indicators[i] + " (effect)") {
                            multiplier = multiplier * parseFloat(effect[atk_or_def]);
                        }
                }
                else if (connection_info["SEARCH"][effect_id].type == "angle") {
                    if (!isNaN(move.hitboxes[hitbox_id].angle)) {
                        if ((60 <= parseFloat(move.hitboxes[hitbox_id].angle) && parseFloat(move.hitboxes[hitbox_id].angle) <= 120) || (241 <= parseFloat(move.hitboxes[hitbox_id].angle) && parseFloat(move.hitboxes[hitbox_id].angle) <= 300)) {
                            multiplier = multiplier * parseFloat(effect[atk_or_def]);
                        }
                    }
                }
            }
        }
    }
    if (atk_or_def == "defense_multi" && multiplier > 1) {
        multiplier = 1/multiplier;
    }
    return { "multiplier": multiplier, "conditional": conditional };
}

function calculateStaleQueue() {
    return 1;
}

/**
 * Calculates the amount of damage done
 *
 */
function calculate() {
    // @todo: smash attack charge
    // @todo: stale moves
    // @todo: diminishing returns
    // @todo: checkbox for conditionals
    // @todo: lucario aura

    var table_id = "summary_table";
    clearTable(table_id);

    var char_info = JSON.parse(sessionStorage.getItem('char_info'));

    var damage = 0;
    var multiplier = 1;
    var conditions = [];

    var attacker = getPlayerType("p1_type");
    var defender = getPlayerType("p2_type");

    var move = char_info[document.getElementById("chars").value].moves[document.getElementById("moves").value];

    var atk = document.getElementById("p1_attack").value;

    var def = document.getElementById("p2_defense").value;

    var base_dmg = parseFloat(char_info[document.getElementById("chars").value].moves[document.getElementById("moves").value].hitboxes[document.getElementById("hitboxes").value].damage)

    addRow(["Base Damage", base_dmg + '%'], table_id, false);

    // 1v1 boost
    if (document.getElementById("match_type").checked) {
        multiplier = multiplier * 1.2;
        addRow(["1v1 Buff", 1.2], table_id, false);
    }

    // For freshness bonus
    if (calculateStaleQueue() == 1) {
        multiplier = multiplier * 1.05;
        addRow(["Freshness Bonus", 1.05], table_id, false);
    }

    // short hop damage reduction
    if (document.getElementById("short_hop").checked) {
        multiplier = multiplier * 0.85;
        addRow(["Shorthop Debuff", 0.85], table_id, false);
    }

    // amiibo damage multiplier
    // atk scale differently for humans and amiibo
    if (attacker == "amiibo") {
        multiplier = multiplier * 1.3;
        let buff = (1 + (atk * 3.077 / 10000));
        multiplier = multiplier * buff;
        addRow(["Amiibo Buff", 1.3], table_id, false);
        if (buff != 1) {
            addRow(["Amiibo Attack Buff", buff], table_id, false);
        }
    }
    else {
        // need to check if move is a final smash
        let buff = (1 + (atk * 4 / 10000));
        multiplier = multiplier * buff;
        if (buff != 1) {
            addRow(["Human Attack Buff", buff], table_id, false);
        }
    }

    var p1_slot_ids = ["p1_slots1", "p1_slots2", "p1_slots3"];

    for (let i = 0; i < p1_slot_ids.length; i++) {
        let eff_properties = getEffectMultiplier(document.getElementById(p1_slot_ids[i]).value, move, document.getElementById("hitboxes").value, "attack_multi");

        if (eff_properties.conditional == true && eff_properties.multiplier != 1) {
            conditions.push({
                "multiplier": eff_properties.multiplier,
                "slot": p1_slot_ids[i]
            });
        }
        else {
            multiplier = multiplier * eff_properties.multiplier;
        }
        if (eff_properties.multiplier != 1) {
            addRow([p1_slot_ids[i], eff_properties.multiplier], table_id, false);
        }
    }

    // amiibo defense multiplier
    // def scale differently for humans and amiibo
    if (defender == "amiibo") {
        multiplier = multiplier * 0.77;
        let buff = (1 / (1 + (def * 3.077 / 10000)));
        multiplier = multiplier * buff;

        addRow(["Amiibo Debuff", 0.77], table_id, false);
        if (buff != 1) {
            addRow(["Amiibo Defense Debuff", buff], table_id, false);
        }
    }
    else {
        let buff = (1 / (1 + (def * 6 / 10000)));
        multiplier = multiplier * buff;
        if (buff != 1) {
            addRow(["Human Defense Debuff", buff], table_id, false);
        }
    }


    var p2_slot_ids = ["p2_slots1", "p2_slots2", "p2_slots3"];

    for (let i = 0; i < p2_slot_ids.length; i++) {
        let eff_properties = getEffectMultiplier(document.getElementById(p2_slot_ids[i]).value, move, document.getElementById("hitboxes").value, "defense_multi");

        if (eff_properties.conditional == true && eff_properties.multiplier != 1) {
            conditions.push({
                "multiplier": eff_properties.multiplier,
                "slot": p2_slot_ids[i]
            });
        }
        else {
            multiplier = multiplier * eff_properties.multiplier;
        }
        if (eff_properties.multiplier != 1) {
            addRow([p2_slot_ids[i], eff_properties.multiplier], table_id, false);
        }
    }

    // damage stat boost
    damage = base_dmg * multiplier;

    document.getElementById("output").innerHTML = "In these conditions " + move.name + " does " + Math.floor(damage * 10) / 10 + "%.";

    if (document.getElementById("p2_percent").value > 0) {
        document.getElementById("output").innerHTML += " So the final percent of the enemy should be " + (parseFloat(document.getElementById("p2_percent").value) + Math.floor(damage * 10) / 10) + "%.";
    }
}