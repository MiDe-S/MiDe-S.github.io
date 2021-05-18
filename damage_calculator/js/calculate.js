/**
 * Calculates the amount of damage done
 *
 */
function calculate() {
    // @todo: implement search buff system
    // @todo: fix weak hit strong hit issue
    var char_info = JSON.parse(sessionStorage.getItem('char_info'));

    var damage = 0;
    var multiplier = 1;

    var attacker = getPlayerType("p1_type");
    var defender = getPlayerType("p2_type");

    var character = char_info[document.getElementById("chars").value].name;

    var move = char_info[document.getElementById("chars").value].moves[document.getElementById("moves").value].name;

    var atk = document.getElementById("p1_attack").value;

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
        multiplier = multiplier * (1 / (1 + (def*6/10000)));
    }

    // short hop damage reduction
    if (document.getElementById("short_hop").checked) {
        multiplier = multiplier * 0.85;
    }

    // damage stat boost
    damage = base_dmg * multiplier;

    document.getElementById("output").innerHTML = "A " + character + " " + attacker + " using " + move + " does " + Math.floor(damage * 10) / 10 + "%.";
    console.log(damage);
}