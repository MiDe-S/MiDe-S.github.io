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

    condition = ["always", "condition"];
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


/**
 * Calculates the amount of damage done
 *
 */
function calculate() {
    // @todo: fix weak hit strong hit issue
    // @todo: diminishing returns
    var char_info = JSON.parse(sessionStorage.getItem('char_info'));

    var damage = 0;
    var multiplier = 1;

    var attacker = getPlayerType("p1_type");
    var defender = getPlayerType("p2_type");

    var character = char_info[document.getElementById("chars").value].name;

    var move = char_info[document.getElementById("chars").value].moves[document.getElementById("moves").value];

    var atk = document.getElementById("p1_attack").value;

    var def = document.getElementById("p2_defense").value;

    var base_dmg = parseFloat(char_info[document.getElementById("chars").value].moves[document.getElementById("moves").value].hitboxes[document.getElementById("hitboxes").value].damage)

    // amiibo damage multiplier
    // atk scale differently for humans and amiibo
    if (attacker == "amiibo") {
        multiplier = multiplier * 1.3;
        multiplier = multiplier * (1 + (atk * 3.077 / 10000));
    }
    else {
        // need to check if move is a final smash
        multiplier = multiplier * (1 + (atk * 4 / 10000));
    }
    // 1v1 boost
    if (document.getElementById("match_type").checked) {
        multiplier = multiplier * 1.2;
    }


    // amiibo defense multiplier
    // def scale differently for humans and amiibo
    if (defender == "amiibo") {
        multiplier = multiplier * 0.77;
        multiplier = multiplier * (1 / (1 + (def * 3.077 / 10000)));
    }
    else {
        multiplier = multiplier * (1 / (1 + (def * 6/10000)));
    }

    // short hop damage reduction
    if (document.getElementById("short_hop").checked) {
        multiplier = multiplier * 0.85;
    }
    debugger;
    multiplier = multiplier * getEffectMultiplier(document.getElementById("p1_slots1").value, move, document.getElementById("hitboxes").value, "attack_multi").multiplier;
    multiplier = multiplier * getEffectMultiplier(document.getElementById("p1_slots2").value, move, document.getElementById("hitboxes").value, "attack_multi").multiplier;
    multiplier = multiplier * getEffectMultiplier(document.getElementById("p1_slots3").value, move, document.getElementById("hitboxes").value, "attack_multi").multiplier;

    multiplier = multiplier * getEffectMultiplier(document.getElementById("p2_slots1").value, move, document.getElementById("hitboxes").value, "defense_multi").multiplier;
    multiplier = multiplier * getEffectMultiplier(document.getElementById("p2_slots2").value, move, document.getElementById("hitboxes").value, "defense_multi").multiplier;
    multiplier = multiplier * getEffectMultiplier(document.getElementById("p2_slots3").value, move, document.getElementById("hitboxes").value, "defense_multi").multiplier;

    // damage stat boost
    damage = base_dmg * multiplier;

    document.getElementById("output").innerHTML = "A " + character + " " + attacker + " using " + move.name + " does " + Math.floor(damage * 10) / 10 + "%.";
    console.log(damage);
}