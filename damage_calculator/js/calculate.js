/**
 * Calculates the amount of damage done
 * @todo FORMS
 */
function calculate() {
    var char_info = JSON.parse(sessionStorage.getItem('char_info'));

    var player_type = document.getElementsByName("player1");
    var player;
    for (i = 0; i < player_type.length; i++) {
        if (player_type[i].checked)
            player = player_type[i].value;
    }
    var character = char_info[document.getElementById("chars").value].name;

    var move = char_info[document.getElementById("chars").value].moves[document.getElementById("moves").value].move_name;

    var damage = document.getElementById("p1_attack").value;
    document.getElementById("output").innerHTML = "A " + character + " " + player + " using " + move + " does " + damage + "%.";
}