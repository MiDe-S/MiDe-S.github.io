/**
 * Round every value in the second column to 4 decimal places + adds multiplication symbol at end
 * @param {string} table_id id of table to do operation on
 */
function cleanSummaryTable(table_id) {
    table = document.getElementById(table_id);
    var len = table.rows.length;
    for (let i = 2; i < len; ++i) {
        let cell = table.rows[i].children[1];
        let num = parseFloat(cell.innerHTML);
        num = Math.round(num * 10000) / 10000;
        cell.innerHTML = num + '\u00D7';
    }
}

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
 * Gets the name of an effect
 * @param {any} effect_id id of effect
 * @param {any} eff_info eff_info from session storage
 * @returns {string} name of effect
 */
function getEffectName(effect_id, eff_info) {
    if (effect_id == -1) {
        return None;
    }
    // Need to do this to get proper effect because of group label
    else if (effect_id < eff_info[0].effects.length) {
        return eff_info[0].effects[effect_id]["name"];
    }
    else {
        return eff_info[1].effects[effect_id - eff_info[0].effects.length]["name"];
    }
}

/**
 * Calculates the diminishing returns of an effect
 *
 * @param {string} effect_id id of effect to check
 * @param {string} atk_or_def HAS TO BE attack_multi OR defense_multi
 * @param {number} repeats the number of times the effect has appeared (inclusive)
 * @param {Object} eff_info from session storage
 * @returns {number} multiplier of effect buff/debuff
 */
function getDiminshedEffect(effect_id, atk_or_def, repeats, eff_info) {
    var multiplier = 1;

    // -1 value indicates None
    if (effect_id == -1) {
        return multiplier;
    }
    // Need to do this to get proper effect because of group label
    else if (effect_id < eff_info[0].effects.length) {
        effect = eff_info[0].effects[effect_id];
    }
    else {
        effect = eff_info[1].effects[effect_id - eff_info[0].effects.length];
    }

    if (repeats == 2) {
        multiplier = effect[atk_or_def + '_2'] / effect[atk_or_def];
    }
    else if (repeats == 3) {
        multiplier = effect[atk_or_def + '_3'] / effect[atk_or_def + '_2'];
    }

    if (atk_or_def == "defense_multi" && multiplier > 1) {
        multiplier = 1 / multiplier;
    }

    return multiplier;
}

/**
 * Calculates the multiplier from the given move and given effect
 * 
 * @param {string} effect_id id of effect to check
 * @param {Object} move move object from moves.json
 * @param {string} hitbox_id id of hitbox to check
 * @param {string} atk_or_def HAS TO BE attack_multi OR defense_multi
 * @param {Object} eff_info from session storage
 * @returns {number} multiplier of effect buff/debuff
 */
function getEffectMultiplier(effect_id, move, hitbox_id, atk_or_def, eff_info) {
    var connection_info = JSON.parse(sessionStorage.getItem('connection_info'));
    var effect;
    var multiplier = 1;
    var conditional = false;
    var global = false;

    // -1 value indicates None
    if (effect_id == -1) {
        return { "multiplier": multiplier, "conditional": "always", "global": global }
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
        // one with both always and condition is air attack, so all other become correct
        if (effect[condition[j]] != null) {
            // should reset for correct status unless this is air attack, cause air attack is always true for global
            if (effect_id != 0) {
                global = false;
            }
            // if this loop is running then it means this is a conditional
            if (j == 1) {
                conditional = true;
            }
            if (effect[condition[j]] == "ALL") {
                multiplier = multiplier * parseFloat(effect[atk_or_def]);
                global = true;
            }
            else if (effect[condition[j]] == "AERIALS" && move.name.slice(-6) == "aerial") {
                multiplier = multiplier * parseFloat(effect[atk_or_def]);
                global = true;
            }
            else if (effect[condition[j]] == "SMASH_ATTACKS" && move.name.slice(-5) == "smash" && move.name != "Final Smash") {
                multiplier = multiplier * parseFloat(effect[atk_or_def]);
                global = true;
            }
            else if (effect[condition[j]] == "SPECIAL_MOVES" && move.name.slice(-7) == "special") {
                multiplier = multiplier * parseFloat(effect[atk_or_def]);
                global = true;
            }
            else if (effect[condition[j]] == "ONE" && connection_info["ONE"][effect.name] == move.name) {
                multiplier = multiplier * parseFloat(effect[atk_or_def]);
                global = true;
            }
            else if (effect[condition[j]] == "SEARCH") {
                // checks for weapon type because for some reason it is considered global according to ssbwiki
                if (effect_id == 55 || effect_id == 54) {
                    global = true;
                }

                if (connection_info["SEARCH"][effect_id].type == "type") {
                    for (let i = 0; i < connection_info["SEARCH"][effect_id].indicators.length; i++) {
                        if (move.hitboxes[hitbox_id].type == connection_info["SEARCH"][effect_id].indicators[i]) {
                            multiplier = multiplier * parseFloat(effect[atk_or_def]);
                        }
                    }
                }
                else if (connection_info["SEARCH"][effect_id].type == "effect") {
                    for (let i = 0; i < connection_info["SEARCH"][effect_id].indicators.length; i++)
                        if (move.hitboxes[hitbox_id].type == connection_info["SEARCH"][effect_id].indicators[i]) {
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
    // shield damage up and 'killers' are not considered global
    if (effect_id == 37 || effect_id == 3 || effect_id == 26 || effect_id == 31) {
        global = false;
    }
    return { "multiplier": multiplier, "conditional": conditional, "global": global };
}

/**
 * Calculates the staleness of the used move 
 * @returns {number} the staleness debuff multiplier, 0 if no reduction
 */
function calculateStaleQueue() {
    // stale debuffs for each level of move
    const debuffs = [0.09,	0.08545, 0.07635, 0.0679, 0.05945, 0.05035, 0.04255, 0.03345, 0.025]

    var base_stale_id = "stale";
    var base_shield_id = "shield";

    var multiplier = 0;

    for (let i = 1; i < 10; i++) {
        if (document.getElementById(base_stale_id + i).checked) {
            // If move hit shield, it is reduced by .85
            if (document.getElementById(base_shield_id + i).checked) {
                multiplier = multiplier + (debuffs[i - 1] * 0.85);
            }
            else {
                multiplier = multiplier + debuffs[i - 1];
            }
        }
    }

    return multiplier;
}

/**
 * Calculates the amount of damage done
 *
 */
function calculate() {
    // @todo: 12.0.0 disclaimer
    // @todo: ~0.1% error disclaimer

    // enables summary table div
    document.getElementById("summary_div").style.display = 'block';

    // clears summary table for new info
    var table_id = "summary_table";
    clearTable(table_id);

    // reset smash attack charge, needed to avoid unintended behavior
    document.getElementById("prev_charge").innerHTML = 0;
    document.getElementById("charge_range").value = 0;
    document.getElementById("charge_percent").innerHTML = '0%';

    var char_info = JSON.parse(sessionStorage.getItem('char_info'));
    var eff_info = JSON.parse(sessionStorage.getItem('eff_info'));

    var damage = 0;
    var multiplier = 1;
    var conditions = [];

    var char_id = document.getElementById("chars").value;
    var move = char_info[char_id].moves[document.getElementById("moves").value];


    var attacker = getPlayerClassification("p1_HorA");
    var defender = getPlayerClassification("p2_HorA");
    var atk = document.getElementById("p1_attack").value;
    var def = document.getElementById("p2_defense").value;

    var base_dmg = parseFloat(char_info[document.getElementById("chars").value].moves[document.getElementById("moves").value].hitboxes[document.getElementById("hitboxes").value].damage);
    addRow(["Base Damage", base_dmg + '%'], table_id, false);

    // 1v1 boost
    if (document.getElementById("match_type").checked) {
        multiplier = multiplier * 1.2;
        addRow(["1v1 Buff", 1.2], table_id, false);
    }

    // For freshness bonus / stale queue
    // only calculate staling if enabled
    if (document.getElementById("staleEnable").checked) {
        let staleness_debuff = calculateStaleQueue();
        // move gets damage buff if it has 0 stale
        if (staleness_debuff == 0) {
            multiplier = multiplier * 1.05;
            addRow(["Freshness Bonus", 1.05], table_id, false);
        }
        else {
            staleness_debuff = 1 - staleness_debuff;
            multiplier = multiplier * staleness_debuff;
            addRow(["Move Staling", staleness_debuff], table_id, false);
        }
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

    // Calculates lucario aura
    // formulas from https://www.ssbwiki.com/Aura
    if (char_id == 45) {
        var aura_multi = 1;

        var stock_diff = document.getElementById("luc_stock_diff").value;
        if (stock_diff == 2) {
            aura_multi *= 0.83;
        }
        else if (stock_diff == 1) {
            aura_multi *= 0.915;
        }
        else if (stock_diff == -1) {
            aura_multi *= 1.2;
        }
        else if (stock_diff == -2) {
            aura_multi *= 1.4;
        }

        var percent = document.getElementById("luc_percent").value;
        if (percent <= 65) {
            aura_multi *= (66 + (34 / 65) * percent) / 100; 
        }
        else if (percent <= 190) {
            aura_multi *= (100 + 0.536 * (percent - 65)) / 100; 
        }
        else {
            // formula stops scaling at 190 percent
            aura_multi *= (100 + 0.536 * (190 - 65)) / 100; 
        }

        // aura boost is capped between 0.6 and 1.8
        if (aura_multi < .6) {
            aura_multi = .6;
        }
        else if (aura_multi > 1.8) {
            aura_multi = 1.8;
        }

        multiplier = multiplier * aura_multi;

        addRow(["Aura", aura_multi], table_id, false);
    }

    // Calculates type advantage
    var attacker_type = document.getElementById("p1_type").value;
    var defender_type = document.getElementById("p2_type").value;
    if (attacker_type != defender_type && attacker_type != "Neutral" && defender_type != "Neutral") {
        let advantage_multi = 1;
        if (attacker_type == "Attack") {
            if (defender_type == "Shield") {
                advantage_multi *= 0.85;
            }
            else {
                advantage_multi *= 1.3;
            }
        }
        if (attacker_type == "Shield") {
            if (defender_type == "Attack") {
                advantage_multi *= 1.3;
            }
            else {
                advantage_multi *= 0.85;
            }
        }
        if (attacker_type == "Grab") {
            if (defender_type == "Attack") {
                advantage_multi *= 0.85;
            }
            else {
                advantage_multi *= 1.3;
            }
        }
        multiplier = multiplier * advantage_multi;

        addRow(["Type Advantage", advantage_multi], table_id, false);
    }


    var p1_slot_ids = ["p1_slots1", "p1_slots2", "p1_slots3"];
    // if this is >1.3x, it needs to be diminished
    var global_eff_atk_boost = 1;

    for (let i = 0; i < p1_slot_ids.length; i++) {
        let curr_id = document.getElementById(p1_slot_ids[i]).value;

        let eff_properties = getEffectMultiplier(curr_id, move, document.getElementById("hitboxes").value, "attack_multi", eff_info);

        // calculate diminishing returns
        if (i == 1 && eff_properties.multiplier != 1) {
            if (document.getElementById(p1_slot_ids[1]).value == document.getElementById(p1_slot_ids[0]).value) {
                eff_properties.multiplier = getDiminshedEffect(curr_id, "attack_multi", 2, eff_info);
            }
        }
        if (i == 2 && eff_properties.multiplier != 1) {
            if (document.getElementById(p1_slot_ids[2]).value == document.getElementById(p1_slot_ids[0]).value || document.getElementById(p1_slot_ids[2]).value == document.getElementById(p1_slot_ids[1]).value) {
                // triple diminish
                if (document.getElementById(p1_slot_ids[1]).value == document.getElementById(p1_slot_ids[0]).value) {
                    eff_properties.multiplier = getDiminshedEffect(curr_id, "attack_multi", 3, eff_info);
                }
                else {
                    eff_properties.multiplier = getDiminshedEffect(curr_id, "attack_multi", 2, eff_info);
                }
            }
        }

        if (eff_properties.conditional == true && eff_properties.multiplier != 1) {
            conditions.push({
                "multiplier": eff_properties.multiplier,
                "name": getEffectName(curr_id, eff_info)
            });
        }
        else if (eff_properties.multiplier != 1) {
            multiplier = multiplier * eff_properties.multiplier;
            addRow([getEffectName(curr_id, eff_info), eff_properties.multiplier], table_id, false);
        }

        if (eff_properties.global == true) {
            global_eff_atk_boost *= eff_properties.multiplier;
        }
    }

    // If effects that buff 'all' moves result in >1.3x or >1.5x the attack is diminished
    if (global_eff_atk_boost > 1.3 && conditions.length < 2) {
        if (global_eff_atk_boost > 1.5) {
            var actual = global_eff_atk_boost * 0.2 + 1.2
        }
        else {
            var actual = global_eff_atk_boost * 0.5 + 0.65
        }

        let diminish_multi = actual / global_eff_atk_boost;

        multiplier = multiplier * diminish_multi;

        addRow([">1.3x Eff Atk Penalty", diminish_multi], table_id, false);
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
        let curr_id = document.getElementById(p2_slot_ids[i]).value;
        let eff_properties = getEffectMultiplier(curr_id, move, document.getElementById("hitboxes").value, "defense_multi", eff_info);

        // calculate diminishing returns
        if (i == 1) {
            if (document.getElementById(p2_slot_ids[1]).value == document.getElementById(p2_slot_ids[0]).value) {
                eff_properties.multiplier = getDiminshedEffect(curr_id, "defense_multi", 2, eff_info);
            }
        }
        if (i == 2) {
            if (document.getElementById(p2_slot_ids[2]).value == document.getElementById(p2_slot_ids[0]).value || document.getElementById(p2_slot_ids[2]).value == document.getElementById(p2_slot_ids[1]).value) {
                // triple diminish
                if (document.getElementById(p2_slot_ids[1]).value == document.getElementById(p2_slot_ids[0]).value) {
                    eff_properties.multiplier = getDiminshedEffect(curr_id, "defense_multi", 3, eff_info);
                }
                else {
                    eff_properties.multiplier = getDiminshedEffect(curr_id, "defense_multi", 2, eff_info);
                }
            }
        }

        if (eff_properties.conditional == true && eff_properties.multiplier != 1) {
            conditions.push({
                "multiplier": eff_properties.multiplier,
                "name": getEffectName(curr_id, eff_info)
            });
        }
        else if (eff_properties.multiplier != 1) {
            multiplier = multiplier * eff_properties.multiplier;
            addRow([getEffectName(curr_id, eff_info), eff_properties.multiplier], table_id, false);
        }
    }


    // damage stat boost
    damage = base_dmg * multiplier;

    // smash attack charging
    if (move.name.slice(-5) == "smash" && move.name != "Final Smash") {
        document.getElementById("charge").style.display = "block";
    }
    else {
        document.getElementById("charge").style.display = "none";
    }

    let conditional_div = document.getElementById("conditionals");
    while (conditional_div.firstChild) {
        conditional_div.removeChild(conditional_div.firstChild);
    }

    for (let i = 0; i < conditions.length; i++) {
        // avoids weird double critical hit
        if (conditions[i].multiplier != 0 && conditions[i].multiplier != 1) {

            let label = document.createElement("label");
            label.for = 'c' + i;

            // any higher precision is not needed
            conditions[i].multiplier = Math.round(conditions[i].multiplier * 100) / 100;

            label.appendChild(document.createTextNode(conditions[i].name + ' (' + conditions[i].multiplier + '\u00D7)'));

            let check_box = document.createElement("input");
            check_box.classList.add("conditionals");
            check_box.type = "checkbox";
            check_box.id = 'c' + i;
            check_box.value = conditions[i].multiplier;
            check_box.onchange = function () { updateDamage(this.value, this.id) };

            conditional_div.appendChild(label);
            conditional_div.appendChild(check_box);
        }
    }

    document.getElementById("output").innerHTML = Math.floor(damage * 10) / 10 + '%';
    document.getElementById("output").style.visibility = "visible";

    // adjust summary table so numbers are rounded + multiplication symbol
    cleanSummaryTable(table_id);
}