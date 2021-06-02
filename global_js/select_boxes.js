/**
 * Replaces selection list of given ID with given array
 * values of selection box are item's index in array
 * 
 *  reference http://dyn-web.com/tutorials/forms/select/paired.php
 * @param {object} array array to replace list with
 * @param {string} select_id_to_replace ID of selection list to replace with char_info
 * @todo mess with groups
 */
function replaceSelectWithArray(array, select_id_to_replace, group_bool) {
    select_box = document.getElementById(select_id_to_replace);

    // Removes items from select_box
    if (group_bool) {
        groups = select_box.getElementsByTagName('optgroup');
        let len = groups.length
        for (var i = len; i > 0; i--) {
            select_box.removeChild(groups[i - 1])
        }
    }
    let len = select_box.options.length;
    if (len) {
        for (var i = len; i; i--) {
            var par = select_box.options[i - 1].parentNode;
            par.removeChild(select_box.options[i - 1]);
        }
    }

    // Adds items to select_box
    if (group_bool) {
        for (var i = 0; i < array.length; i += 2) {
            group = document.createElement('optgroup')
            group.label = array[i]

            let eff_len = array[i + 1].length
            for (var j = 0; j < eff_len; ++j) {
                var opt = document.createElement('option');
                opt.setAttribute("value", array[i + 1][j].value);
                opt.appendChild(document.createTextNode(array[i + 1][j].name));
                group.appendChild(opt);
            }
            select_box.appendChild(group)
        }
    }
    else {
        for (var i = 0; i < array.length; i++) {
            var opt = document.createElement('option');
            opt.setAttribute("value", i);
            opt.appendChild(document.createTextNode(array[i]));
            select_box.appendChild(opt);
        }
    }
}