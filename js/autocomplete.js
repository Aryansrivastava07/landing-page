//function of script !mostimp
function myAmazingFunction(data) {
    for (var i = 0; i < data[1].length; i++) {
        var div = document.createElement("div");
        div.classList.add("autocomp_div");
        div.setAttribute("id", "auto_div_" + i);
        document.getElementById('autocomp').appendChild(div);
        var split1 = data[1][i][0].split("<b>");
        if (split1.length === 2) {
            var split2 = split1[1].split("</b>");
            var newdata = split1[0] + split2[0];
        } else {
            var newdata = split1[0];
        }
        div.innerHTML = newdata;


        // old logic ->
        // var newdata = data[1][i][0].replace('<b>', '');
        // newdata = newdata.replace('</b>', '');
        // newdata = data[1][i][0];
    }
}
var k = 0;
var script_1 = "https://www.google.com/complete/search?client=hp&hl=en&sugexp=msedr&gs_rn=62&gs_ri=hp&cp=1&gs_id=9c&q=";
var script_2 = "&xhr=t&callback=myAmazingFunction";
let excess_phrase = "";
search.addEventListener("keyup", () => {
    //to show dropdown
    document.getElementById('autocomp').style.cssText = 'display:block;';
    // to remove earlier suggestion
    var auto_div = document.querySelectorAll(".autocomp_div");
    for (var i = 0; i < auto_div.length; i++) {
        document.querySelector(".autocomp_div").remove(".autocomp_div");
    }
    //to create new suggestion by script adding
    setTimeout(() => {
        var search = document.getElementById('search');
        if (search.value.length > 2) {
            let plus_count = 0;
            var search_value = document.getElementById('search').value;
            while (search_value.includes(" ")) {
                search_value = search_value.replace(" ", "+");
                plus_count++;
            }
            if (plus_count > 3) {
                search_value = search_value.split("+");
                excess_phrase = search_value.slice(0, search_value.length - 3).join(" ");
                search_value = search_value.slice(search_value.length - 3, search_value.length).join("+");
            }
            var script = document.createElement("script");
            script.src = script_1 + search_value + script_2;
            document.body.appendChild(script);
        }
    }, 1);
    //to add eventlister to suggestion
    setTimeout(() => {
        var auto_div = document.getElementsByClassName("autocomp_div");
        for (let div of auto_div) {
            div.addEventListener("click", addsearch);
        }
    }, 800);
})
//function of suggestion eventlistener
var addsearch = e => {
    var search = document.getElementById('search');
    var target = e.target;
    var addsrch_text = e.target.innerHTML;
    var search = document.getElementById('search');
    search.value = excess_phrase + " " + addsrch_text;
    document.getElementById("search-button").click();
    document.getElementById('autocomp').style.cssText = 'display:none;';
}
document.onclick = () => {
    var search = document.getElementById('search');
    if (document.activeElement === search && search.value != "") {
        document.getElementById('autocomp').style.cssText = 'display:block;';
    } else {
        document.getElementById('autocomp').style.cssText = 'display:none;';
    }
}


document.getElementById('autocomp').oncontextmenu = (e) => {
    e.preventDefault();
    var addsrch_text = e.target.innerHTML;
    var search = document.getElementById('search');
    search.value = addsrch_text;
    document.getElementById('autocomp').style.cssText = 'display:none;';
    search.focus();
};