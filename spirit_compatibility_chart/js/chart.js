/**
 * Clears a given table of all rows
 * 
 * @param {any} table_id id of table to clear
 */
function clearTable(table_id) {
    table = document.getElementById(table_id);
    var len = table.rows.length;
    for (var i = len; i > 0; --i) {
        table.removeChild(table.rows[i - 1])
    }
}

/**
 * Adds given array as a row to given table
 * 
 * @param {Array} row_data array to add
 * @param {string} table_id id of table to add row to
 */
function addRow(row_data, table_id) {
    table = document.getElementById(table_id);

    row = document.createElement("tr");

    for (var i = 0; i < row_data.length; i++) {
        col = document.createElement("td");
        if (row_data[i] == "True") {
            let img = document.createElement("img");
            img.src = "img/buff.png";
            img.alt = "True";
            col.appendChild(img);
        }
        else if (row_data[i] == "False") {
            let img = document.createElement("img");
            img.src = "img/nerf.png";
            img.alt = "False";
            col.appendChild(img);
        }
        else if (row_data[i] == "Mixed") {
            let img = document.createElement("img");
            img.src = "img/mixed.png";
            img.alt = "Mixed";
            col.appendChild(img);
        }
        else if (row_data[i] == "Null" || row_data[i] == null) {
            let img = document.createElement("img");
            img.src = "img/none.png";
            img.alt = "No Data";
            col.appendChild(img);
        }
        else {
            col.appendChild(document.createTextNode(row_data[i]));
        }
        row.appendChild(col);
    }

    table.appendChild(row);
}


function generateChart(char_id) {
    clearTable("table_compatibility")
    var char_info = JSON.parse(sessionStorage.getItem('char_info'));
    var connection_info = JSON.parse(sessionStorage.getItem('connection_info'));
    // No point in having both magic up and magic resist, these are the only id's we want
    var notable_ids = ["4", "15", "18", "21", "23", "24", "28", "33", "34", "43", "45", "52", "55", "38"];

    var header = [char_info[char_id].name];


    for (let i = 0; i < notable_ids.length; i++) {
        let name = connection_info["SEARCH"][notable_ids[i]].name;
        name = name.replace(/ \u2191/i, "");
        name = name.replace(/ Attack/i, "");
        header.push(name);
    }
    addRow(header, "table_compatibility");

    for (let i = 0; i < char_info[char_id].moves.length; i++) {
        let row = [char_info[char_id].moves[i].name];
        for (let j = 0; j < notable_ids.length; j++) {
            row.push(doesEffectApply(char_info[char_id].moves[i], connection_info["SEARCH"][notable_ids[j]]));
        }
        addRow(row, "table_compatibility");
    }
}