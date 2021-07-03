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

        // Replaces words with smash icon pictures
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
        // So total has "explain" value on it
        else if (row_data[i] == "Total") {
            let explain = document.createElement("span");
            explain.classList.add("explain");
            explain.title = "Mixed effectiveness counts as half; Jabs, throws, and getup attacks are weighted";
            explain.appendChild(document.createTextNode("Total"));

            col.appendChild(explain);
        }
        else {
            // adds percents to totals
            if (row_data[0] == "Total") {
                col.appendChild(document.createTextNode(row_data[i] + '%'));
            }
            else {
                col.appendChild(document.createTextNode(row_data[i]));
            }
        }
        row.appendChild(col);
    }

    table.appendChild(row);
}

/**
 * Takes a matrix representing a matrix and adds it to table_id
 * 
 * @param {Array} matrix representing the data needed to be added to the table
 * @param {string} table_id id of table to add matrix too
 */
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

/**
 * Takes a given matrix and sorts it by the last row
 * 
 * @param {any} matrix table of values to be sorted
 * @param {number} row_index index of row to sort by
 */
function sortByRow(matrix, row_index) {
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

    // sort rows based on given row_index
    sorting_matrix.sort(function (x, y) {
        if (x[row_index] < y[row_index]) {
            return 1;
        }
        if (x[row_index] > y[row_index]) {
            return -1;
        }
        return 0;
    })
    
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

/**
 * 
 * 
 * @param {number} char_id id of charcter to generate chart of
 * @param {string} coverage whether to sort by coverage or not, "True" or "False"
 */
function generateChart(char_id, coverage) {
    clearTable("table_compatibility");
    var compatibility_info = JSON.parse(sessionStorage.getItem('compatibility_info'));
    var matrix;
    if (coverage == "true") {
        matrix = sortByRow(compatibility_info[parseInt(char_id)].compatibility_matrix, compatibility_info[parseInt(char_id)].compatibility_matrix.length - 1);
    }
    else {
        matrix = compatibility_info[parseInt(char_id)].compatibility_matrix;
    }

    addMatrix(matrix, 'table_compatibility');
}