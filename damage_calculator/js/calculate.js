/**
 * Calculates the amount of damage done
 * @todo FORMS
 */
function calculate() {
    var char_info = JSON.parse(sessionStorage.getItem('char_info'));

    var damage = 0;
    var multiplier = 1;

    var player_type = document.getElementsByName("player1");
    var attacker;
    for (i = 0; i < player_type.length; i++) {
        if (player_type[i].checked)
            attacker = player_type[i].value;
    }
    var character = char_info[document.getElementById("chars").value].name;

    var move = char_info[document.getElementById("chars").value].moves[document.getElementById("moves").value].name;

    var atk = document.getElementById("p1_attack").value;

    var base_dmg = parseFloat(char_info[document.getElementById("chars").value].moves[document.getElementById("moves").value].hitboxes[document.getElementById("hitboxes").value].damage)

    // amiibo damage multiplier
    // atk and def scale differently for humans and amiibo
    if (attacker == "amiibo") {
        multiplier = multiplier * 1.3;
    }
    else {
        // need to check if move is a final smash
        multiplier = multiplier * (1 + (atk * 4 / 10000));
    }
    // 1v1 boost
    if (document.getElementById("match_type").checked) {
        multiplier = multiplier * 1.2;
        console.log("yes");
    }
    // damage stat boost
    damage = base_dmg * multiplier;

    document.getElementById("output").innerHTML = "A " + character + " " + attacker + " using " + move + " does " + Math.round(damage * 10) / 10 + "%.";
}