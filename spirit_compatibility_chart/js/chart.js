/**
 * Clears a given table of all rows
 * 
 * @param {any} table_id id of table to clear
 */
function clearTable(table_id) {
    table = document.getElementById(table_id);
    var len = table.rows.length;
    for (var i = len; i > 1; --i) {
        table.removeChild(table.rows[i - 1])
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
            let img = document.createElement("img");
            img.src = "img/buff.png";
            img.alt = "True";
            img.classList.add("center");
            col.appendChild(img);
        }
        else if (row_data[i] == "False") {
            let img = document.createElement("img");
            img.src = "img/nerf.png";
            img.alt = "False";
            img.classList.add("center");
            col.appendChild(img);
        }
        else if (row_data[i] == "Mixed") {
            let img = document.createElement("img");
            img.src = "img/mixed.png";
            img.alt = "Mixed";
            img.classList.add("center");
            col.appendChild(img);
        }
        else if (row_data[i] == "Null" || row_data[i] == null) {
            let img = document.createElement("img");
            img.src = "img/none.png";
            img.alt = "No Data";
            img.classList.add("center");
            col.appendChild(img);
        }
        else {
            col.appendChild(document.createTextNode(row_data[i]));
        }
        row.appendChild(col);
    }

    table.appendChild(row);
}


function generateChart(char_id, draw_header) {
    clearTable("table_compatibility")
    var char_info = JSON.parse(sessionStorage.getItem('char_info'));
    var connection_info = JSON.parse(sessionStorage.getItem('connection_info'));
    // No point in having both magic up and magic resist, these are the only id's we want
    var notable_ids = ["4", "15", "18", "21", "23", "24", "28", "33", "34", "43", "45", "52", "55", "38"];

    if (draw_header) {
        var header = [];

        for (let i = 0; i < notable_ids.length; i++) {
            let name = connection_info["SEARCH"][notable_ids[i]].name;
            name = name.replace(/ \u2191/i, "");
            name = name.replace(/ Attack/i, "");
            header.push(name);
        }
        addRow(header, "table_compatibility", true);
    }

    // Used to calculate which effects are most effective
    var moves_impacted = [];
    for (let i = 0; i < notable_ids.length; i++) {
        moves_impacted.push({ "id": notable_ids[i], "value": 0})
    }


    for (let i = 0; i < char_info[char_id].moves.length; i++) {
        var move_counter = 0
        let row = [char_info[char_id].moves[i].name];
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

            /*
            if (row[0].slice(0, 12) == "Floor attack") {
                value_addon = value_addon * 0;
            }
            else if (row[0].slice(-5) == "throw") {
                value_addon = value_addon * 0;
            }
            else if (row[0].slice(0, 14) == "Neutral attack") {
                value_addon = value_addon * 0;
            }
            else if (row[0] == "Edge attack" || row[0] == "Pummel") {
                value_addon = value_addon * 0;
            }
            else {
                move_counter += 1;
            }
            */

            moves_impacted[j]["value"] += value_addon;
        }
        addRow(row, "table_compatibility", false);
    }

    moves_impacted.sort(function (a, b) {
        return b.value - a.value;
    });
    document.getElementById("first").innerHTML = connection_info["SEARCH"][moves_impacted[0]["id"]]["name"] + " " + Math.round(moves_impacted[0]["value"] / char_info[char_id].moves.length * 1000) / 10 + "%";
    document.getElementById("second").innerHTML = connection_info["SEARCH"][moves_impacted[1]["id"]]["name"] + " " + Math.round(moves_impacted[1]["value"] / char_info[char_id].moves.length * 1000) / 10 + "%";
    document.getElementById("third").innerHTML = connection_info["SEARCH"][moves_impacted[2]["id"]]["name"] + " " + Math.round(moves_impacted[2]["value"] / char_info[char_id].moves.length * 1000) / 10 + "%";
}