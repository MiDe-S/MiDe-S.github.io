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
        col.classList.add("outline");

        if (row_data[i] == "True") {
            let hover_text = document.createElement("a");
            hover_text.title = "Effective";

            let img = document.createElement("img");
            img.src = "img/buff.png";
            img.alt = "True";
            img.classList.add("center");

            hover_text.appendChild(img);
            col.appendChild(hover_text);
        }
        else if (row_data[i] == "False") {
            let hover_text = document.createElement("a");
            hover_text.title = "Not Effective";

            let img = document.createElement("img");
            img.src = "img/nerf.png";
            img.alt = "False";
            img.classList.add("center");

            hover_text.appendChild(img);
            col.appendChild(hover_text);
        }
        else if (row_data[i] == "Mixed") {
            let hover_text = document.createElement("a");
            hover_text.title = "Mixed Effectiveness";

            let img = document.createElement("img");
            img.src = "img/mixed.png";
            img.alt = "Mixed";
            img.classList.add("center");

            hover_text.appendChild(img);
            col.appendChild(hover_text);
        }
        else if (row_data[i] == "Null" || row_data[i] == null) {
            let hover_text = document.createElement("a");
            hover_text.title = "No Data";

            let img = document.createElement("img");
            img.src = "img/none.png";
            img.alt = "No Data";
            img.classList.add("center");

            hover_text.appendChild(img);
            col.appendChild(hover_text);
        }
        else {
            col.appendChild(document.createTextNode(row_data[i]));
        }
        row.appendChild(col);
    }

    table.appendChild(row);
}

function addMatrix(matrix, table_id) {
    for (let i = 0; i < matrix.length; i++) {
        if (i == 0) {
            addRow(matrix[i], table_id, true);
        }
        else {
            addRow(matrix[i], table_id, false);
        }
    }
}

function sortByMoveCoverage(matrix, sort_key) {
    var sorting_matrix = [];
    // transpose matrix without touching 1st column
    for (let j = 1; j < matrix[1].length; j++) {
        let new_row = []
        for (let i = 0; i < matrix.length; i++) {
            // header row has one less item
            if (i == 0) {
                new_row.push(matrix[i][j-1]);
            }
            else {
                new_row.push(matrix[i][j]);
            }
        }
        sorting_matrix.push(new_row);
    }

    // swap sort rows based on order of IDs in sort_key
    console.log(sorting_matrix.length, sort_key.length);
    for (let i = 0; i < sort_key.length; i++) {
        for (let j = 0; j < sorting_matrix.length; j++) {
            if (sorting_matrix[j][0] == sort_key[i].name) {
                let temp_switch = sorting_matrix[i];
                sorting_matrix[i] = sorting_matrix[j];
                sorting_matrix[j] = temp_switch;
            }
        }
    }
    
    // tranpose matrix again so it is facing correct direction
    for (let i = 0; i < sorting_matrix.length; i++) {
        for (let j = 0; j < sorting_matrix[1].length; j++) {
            if (j == 0) {
                matrix[j][i] = sorting_matrix[i][j];
            }
            else {
                matrix[j][i + 1] = sorting_matrix[i][j];
            }
        }

    }
    return matrix;
}


function generateChart(char_id, coverage) {
    clearTable("table_compatibility")
    var char_info = JSON.parse(sessionStorage.getItem('char_info'));
    var connection_info = JSON.parse(sessionStorage.getItem('connection_info'));
    // No point in having both magic up and magic resist, these are the only id's we want
    var notable_ids = ["4", "15", "18", "21", "23", "24", "28", "33", "34", "38", "43", "45", "52", "55"];

    var table_matrix = [];

    // Used to calculate which effects are most effective
    var moves_impacted = [];

    // Does header row, removes extra words from header names
    var header = [];
    for (let i = 0; i < notable_ids.length; i++) {
        let name = connection_info["SEARCH"][notable_ids[i]].name;
        name = name.replace(/ \u2191/i, "");
        name = name.replace(/ Attack/i, "");
        header.push(name);
        moves_impacted.push({ "id": notable_ids[i], "value": 0 , "name": name})
    }
    table_matrix.push(header);


    var move_counter = 3;
    for (let i = 0; i < char_info[char_id].moves.length; i++) {
        // Starts at 3 to account for weighted moves
        let row = [char_info[char_id].moves[i].name];

        // Starts counting moves, ignores moves weighted as 1
        if (row[0].slice(0, 12) != "Floor attack" && row[0] != "Edge attack" && row[0].slice(0, 14) != "Neutral attack" && row[0].slice(-5) != "throw" && row[0] != "Pummel") {
            move_counter += 1;
        }

        for (let j = 0; j < notable_ids.length; j++) {
            let applies = doesEffectApply(char_info[char_id].moves[i], connection_info["SEARCH"][notable_ids[j]])
            row.push(applies);

            if (applies == "Null" || applies == "False") {
                var value_addon = 0;
            }
            else if (applies == "True") {
                var value_addon = 1;
            }
            else if (applies == "Mixed") {
                var value_addon = 0.5;
            }

            // Weighs multi-part moves to count as one move
            if (row[0].slice(0, 12) == "Floor attack" || row[0] == "Edge attack") {
                value_addon = value_addon * 0.25;
            }
            else if (row[0].slice(-5) == "throw" || row[0] == "Pummel") {
                value_addon = value_addon * 0.20;
            }
            else if (row[0].slice(-5) == "Hit 1" || row[0].slice(-5) == "Hit 2") {
                value_addon = value_addon * 0.50;
            }
            else if (row[0].slice(-5) == "Hit 3") {
                moves_impacted[j]["value"] = moves_impacted[j]["value"] * 0.6666; // re-weigh options 
                value_addon = value_addon * 0.33333;
            }
            else if (row[0].slice(-8) == "Infinite") {
                if (char_info[char_id].moves[i - 1].name.slice(-5) == "Hit 2") {
                    moves_impacted[j]["value"] = moves_impacted[j]["value"] * 0.6666; // re-weigh options 
                    value_addon = value_addon * 0.33333;
                }
                else if (char_info[char_id].moves[i - 1].name.slice(-5) == "Hit 3") {
                    moves_impacted[j]["value"] = moves_impacted[j]["value"] * 0.75; // re-weigh options 
                    value_addon = value_addon * 0.33333;
                }
            }
            moves_impacted[j]["value"] += value_addon;

        }
        table_matrix.push(row);
    }

    moves_impacted.sort(function (a, b) {
        return b.value - a.value;
    });

    if (coverage == "true") {
        table_matrix = sortByMoveCoverage(table_matrix, moves_impacted);
    }


    addMatrix(table_matrix, "table_compatibility");


    document.getElementById("first").innerHTML = connection_info["SEARCH"][moves_impacted[0]["id"]]["name"] + " " + Math.round(moves_impacted[0]["value"] / move_counter * 1000) / 10 + "%";
    document.getElementById("second").innerHTML = connection_info["SEARCH"][moves_impacted[1]["id"]]["name"] + " " +  Math.round(moves_impacted[1]["value"] / move_counter * 1000) / 10 + "%";
    document.getElementById("third").innerHTML = connection_info["SEARCH"][moves_impacted[2]["id"]]["name"] + " " + Math.round(moves_impacted[2]["value"] / move_counter * 1000) / 10 + "%";
}