function loadSideBar() {
    // hardcoding cause github pages or I don't know how to do it better
    var links = [
        {
            "type": "link",
            "href": "../spirit_compatibility_chart/",
            "name": "Spirit Compatibility Chart"
        },
        {
            "type": "link",
            "href": "../damage_calculator/",
            "name": "Damage Calculator"
        },
        {
            "type": "menu",
            "name": "Tier List Archive",
            "sublinks": [
                {
                    "type": "link",
                    "href": "../tier_list_archive/ultimate-tier-list.html",
                    "name": "Smash Ultimate"
                },
                {
                    "type": "link",
                    "href": "../tier_list_archive/smash-4-tier-list.html",
                    "name": "Smash 4"
                }
            ]
        }
    ];

    var side_bar = document.getElementById("mySidebar");

    // adds header to nav
    var main_link = document.createElement("a");
    main_link.href = "../amiibo/";

    var title = document.createElement("h1");
    title.appendChild(document.createTextNode("Amiichives"));
    title.classList.add("white_text_black_outline");


    main_link.appendChild(title);
    side_bar.appendChild(main_link);

    // adds divider
    side_bar.appendChild(document.createElement("hr"));

    // adds links
    for (let i = 0; i < links.length; i++) {
        if (links[i].type == "link") {
            let link = document.createElement("a");
            link.href = links[i].href;
            // If this points to the current page, mark it as a different color
            if (links[i].href.slice(2) == window.location.pathname) {
                link.classList.add("current_page");
            }
            link.appendChild(document.createTextNode(links[i].name));
            side_bar.appendChild(link);
        }
        else {
            // adds submenu title
            let button = document.createElement("button");
            button.setAttribute('name', links[i].name);
            button.setAttribute('onclick', "toggleSubMenu(this.name)");
            button.classList.add('unbutton');
            button.appendChild(document.createTextNode(links[i].name));
            side_bar.appendChild(button);

            // adds submenu
            let submenu = document.createElement("div");
            submenu.classList.add("submenu");
            submenu.setAttribute('id', links[i].name);
            for (let j = 0; j < links[i].sublinks.length; j++) {
                let link = document.createElement("a");
                link.href = links[i].sublinks[j].href;
                // If this points to the current page, mark it as a different color
                if (links[i].sublinks[j].href.slice(2) == window.location.pathname) {
                    link.classList.add("current_page");
                }
                link.appendChild(document.createTextNode(links[i].sublinks[j].name));
                submenu.appendChild(link);
            }
            side_bar.appendChild(submenu);
        }
    }

    var social_links = [
        {
            "name": "YouTube",
            "href": "https://www.youtube.com/channel/UCIs24FJ7UlsG2V4o_sL0SAg",
            "icon": "../yt_logo.png",
            "alt": "YouTube Logo"
        },
        {
            "name": "Twitter",
            "href": "https://twitter.com/mide_shadowrift",
            "icon": "../twitter_logo.png",
            "alt": "Twitter Logo"
        }
    ]
    var space_from_bottom = 20;
    for (let i = 0; i < social_links.length; i++) {
        let link = document.createElement("a");
        let img = document.createElement("img");

        img.src = social_links[i].icon;
        img.alt = social_links[i].alt;

        img.width = 32;
        img.height = 32;

        link.appendChild(img);
        link.href = social_links[i].href;

        link.appendChild(document.createTextNode(social_links[i].name));
        link.style.position = 'absolute';
        link.style.bottom = space_from_bottom + (40 * i) + 'px';

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
        document.getElementById("nav_button").style.opacity = '1.0';
    }

}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    document.getElementById("nav_button").style.opacity = '.35';
}

function toggleSubMenu(id) {
    if (document.getElementById(id).style.height == "250px") {
        document.getElementById(id).style.height = "0";
    }
    else {
        document.getElementById(id).style.height = "250px";
    }
}

