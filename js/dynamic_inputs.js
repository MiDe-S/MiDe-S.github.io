/**
 * Removes the given ID from the html
 * @param {string} div_id
 */
function removeDiv(div_id) {
    div_id = "first_slot";
    var obj = document.getElementById(div_id);
    obj.remove();
}

/** @todo
 */
function characterSelected() {

}

/** @todo
 */
function slotManager() {
    balanceAtkDef('slots');
}

/**
 * Calculats the spirit cap / individual max/min given the amount of slots used
 * 
 * @param {number} slots_used int from 0 to 3
 * @returns data structure of cap/max/min
 */
function calculateSpiritsCap(slots_used) {
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
            var cap = 4200;
            var max = 4600;
            var min = -400;
            break;
    }

    // Can be accessed with .cap or .max or .min
    var cap_dictionary = {
        "cap": cap,
        "max": max,
        "min": min,
    };
    return cap_dictionary;
}

/**
 * Changes the values of attack/defense in accordance with stat cap and individual max/min
 * The one that was changed most recently (determined by called_by_id) stays (within max/min)
 * and the other value adjusts to make the build legal
 * 
 * @param {string} called_by_id ID it was called by to determine what to subtract from
 */
function balanceAtkDef(called_by_id) {
    // spirits cap needs to change
    var limits = calculateSpiritsCap(3);
    var atk = parseInt(document.getElementById("p1_attack").value);
    var def = parseInt(document.getElementById("p1_defense").value);
    switch (called_by_id) {
        case 'p1_attack':
            if (atk > limits.max) {
                atk = limits.max
            }
            else if (atk < limits.min) {
                atk = limits.min
            }
            if (atk + def > limits.cap) {
                var difference = limits.cap - (atk + def);
                def += difference;
            }
            break;
    
        case 'p1_defense':
            if (def > limits.max) {
                def = limits.max
            }
            else if (def < limits.min) {
                def = limits.min
            }
            if (atk + def > limits.cap) {
                var difference = limits.cap - (atk + def);
                atk += difference;
            }
            break;
    
        case 'slots':
            if (atk + def > limits.cap) {
                var difference = limits.cap - (atk + def);
                difference = parseInt(difference / 2);
                atk += difference;
                def += difference;
            }
            break;
    }

    document.getElementById("p1_attack").value = atk;
    document.getElementById("p1_defense").value = def;
}