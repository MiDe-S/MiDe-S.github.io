function loadSideBar() {
    // hardcoding cause github pages or I don't know how to do it better
    var links = [
        {
            "href": "../spirit_compatibility_chart/index.html",
            "name": "Spirit Compatibility Chart"
        },
        {
            "href": "../tier-list-archive-ultimate/ultimate-tier-list.html",
            "name": "Tier List Archive"
        }
    ];

    var side_bar = document.getElementById("mySidebar");

    // adds header to nav
    var title = document.createElement("h1");
    title.appendChild(document.createTextNode("Amiiki"));
    title.classList.add("white_text_black_outline");
    side_bar.appendChild(title);

    // adds divider
    side_bar.appendChild(document.createElement("hr"));

    // adds links
    for (let i = 0; i < links.length; i++) {
        let link = document.createElement("a");
        link.href = links[i].href;
        // If this points to the current page, mark it as a different color
        if (links[i].href.slice(2) == window.location.pathname) {
            link.classList.add("current_page");
        }
        link.appendChild(document.createTextNode(links[i].name));
        side_bar.appendChild(link);
    }

}

function openNav() {
    if (document.getElementById("mySidebar").style.width == "250px") {
        closeNav();
    }
    else {
        document.getElementById("mySidebar").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px";
    }

}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}