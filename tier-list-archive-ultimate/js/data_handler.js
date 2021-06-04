function loadDoc() {
    function tier_list_names(tier_obj_array) {
        var output = [];
        for (var i = 0; i < tier_obj_array.length; i++) {
            output.push({
                "name": tier_obj_array[i].date + ' (' + tier_obj_array[i].meta + ')',
                "value": tier_obj_array[i].filepath
            });
        }
        return output;
    }

    var tier_list_select_id = "tier_select";

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Get data from file into js object
            var tier_list_info = JSON.parse(this.responseText);

            document.getElementById('tier_img').src = 'tier_lists/' + tier_list_info[1]["lists"][0]['filepath'];

            // Get all names in obj to make select list from
            var tier_lists = [];
            for (var index = 0; index < tier_list_info.length; index++) {
                if (tier_list_info[index].lists.length) {
                    tier_lists.push(tier_list_info[index].name);
                    tier_lists.push(tier_list_names(tier_list_info[index].lists));
                }
            }
            replaceSelectWithArray(tier_lists, tier_list_select_id, true);

            // Default list is most recent CTL
            // code from https://stackoverflow.com/questions/7373058/changing-the-selected-option-of-an-html-select-element
            var val = tier_list_info[1]["lists"][tier_list_info[1]["lists"].length - 1].filepath;
            var opts = document.getElementById(tier_list_select_id).options;
            for (var opt, j = 0; opt = opts[j]; j++) {
                if (opt.value == val) {
                    document.getElementById(tier_list_select_id).selectedIndex = j;
                    break;
                }
            }
            changeTierList(val);
        }
    };
    xhttp.open("GET", "tier_list_metadata.json", true);
    xhttp.send();

}

function changeTierList(filepath) {
    console.log(document.getElementById('tier_select').value);
    document.getElementById('tier_img').src = 'tier_lists/' + filepath;
}