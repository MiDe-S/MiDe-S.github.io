/**
 * Calculates the amount of damage done
 * @todo FORMS
 */
function calculate() {
    var player_type = document.getElementsByName("player");
    var player;
    for (i = 0; i < player_type.length; i++) {
        if (player_type[i].checked)
            player = player_type[i].value;
    }
    var character = document.getElementById("chars").value;
    var move = "Forward Smash";

    var damage = document.getElementById("attack").value;
    document.getElementById("output").innerHTML = "A " + character + " " + player + " using " + move + " does " + damage + "%.";
}