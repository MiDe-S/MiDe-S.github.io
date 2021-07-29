function loadDoc(metadata_file, prefix) {
    // Needed to load side bar
    loadSideBar();

    /**
     * Converts tier_list obj into something useable by ReplaceSelectArray
     * @param {any} tier_obj_array
     */
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

            document.getElementById('tier_img').src = prefix + tier_list_info[1]["lists"][0]['filepath'];

            // Get all names in obj to make select list from
            var tier_lists = [];
            for (var index = 0; index < tier_list_info.length; index++) {
                if (tier_list_info[index].lists.length) {
                    tier_lists.push(tier_list_info[index].name);
                    tier_lists.push(tier_list_names(tier_list_info[index].lists));
                }
            }
            replaceSelectWithArray(tier_lists, tier_list_select_id, true);


            // either load default or load specified addition
            let url = new URL(window.location.href);
            if (url.search == "") {
                // default option is most recent CTL
                var val = tier_list_info[1]["lists"][tier_list_info[1]["lists"].length - 1].filepath;
            }
            else {
                let params = url.searchParams;
                var val = params.get('list');
            }
            changeTierList(val, prefix);

            // Sets default item in option box
            // code from https://stackoverflow.com/questions/7373058/changing-the-selected-option-of-an-html-select-element
            var opts = document.getElementById(tier_list_select_id).options;
            for (var opt, j = 0; opt = opts[j]; j++) {
                if (opt.value == val) {
                    document.getElementById(tier_list_select_id).selectedIndex = j;
                    break;
                }
            }
        }
    };
    xhttp.open("GET", metadata_file, true);
    xhttp.send();
}

function changeTierList(filepath, prefix) {
    document.getElementById('tier_img').src = prefix + filepath;

    // Sets URL to selected tier list
    let url = new URL(window.location.href);
    if (url.search == "") {
        url.searchParams.append('list', filepath);
        window.history.replaceState(filepath, 'Tier List', url);
        document.querySelector('meta[name="image"]').setAttribute("content", prefix + filepath);
    }
    else if (url.searchParams.get('list') != filepath) {
        url.searchParams.set('list', filepath);
        window.history.replaceState(filepath, 'Tier List', url);
        document.querySelector('meta[name="image"]').setAttribute("content", prefix + filepath);
    }
}