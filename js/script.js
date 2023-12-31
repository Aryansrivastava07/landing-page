var x = 0;
const search = document.getElementById('search');
const engine = document.getElementById('engine');
var whole_link = "";
// document.onload = chick();
document.getElementById('img').onclick = () => {
    navigator.clipboard.readText()
        .then(text => {
            // var link = "";
            // for (var i = 0; i < 4; i++) {
            //     link += String(text[i]);
            // }
            // if (link === "http" || link === "www.") {
            //     document.getElementById('search').value = text;
            //     whole_link = text;
            // }
            if(document.getElementById('search').value.length >1)
            {
                document.getElementById('search').value = "";
            }
            else if(document.getElementById('search').value.length <= 1){
                document.getElementById('search').value = text;
            }
        })
};

document.addEventListener('keypress', (event) => {
    if (document.activeElement != search) {
        search.focus();
    }
});
document.addEventListener('keydown', (event) => {
    if (search.value == "Y " || search.value == "y ") {
        x = 1;
        document.getElementById("youtube_img").style.cssText = 'display:block;';
        document.getElementById("bing_img").style.cssText = 'display:none;';
        document.getElementById("google_img").style.cssText = 'display:none;';
        document.getElementById('search').value = "";
    }
    else if (search.value == "G " || search.value == "g ") {
        x = 0;
        document.getElementById("youtube_img").style.cssText = 'display:none;';
        document.getElementById("bing_img").style.cssText = 'display:none;';
        document.getElementById("google_img").style.cssText = 'display:block;';
        document.getElementById('search').value = "";
    }
    else if (search.value == "B " || search.value == "b ") {
        x = 2;
        document.getElementById("youtube_img").style.cssText = 'display:none;';
        document.getElementById("bing_img").style.cssText = 'display:block;';
        document.getElementById("google_img").style.cssText = 'display:none;';
        document.getElementById('search').value = "";
    }
    else if (event.ctrlKey && event.key === "v") {
        navigator.clipboard.readText()
            .then(text => {
                document.getElementById('search').value += text;
                search.focus();
            })
    }
});
function Search() {
    var text = document.getElementById("search").value;
    var link = "";
    for (var i = 0; i < 4; i++) {
        link += String(text[i]);
    }
    if (link === "http" || link === "www.") {
        window.location.href = text;
    }
    else {
        if (x === 1) {
            var url = 'http://www.youtube.com/search?q=';
        }
        else if (x === 0) {
            var url = 'http://www.google.com/search?q=';
        }
        else if (x === 2) {
            var url = 'http://www.bing.com/search?q=';
        }
        var cleanQuery = text.replace(" ", "+", text);
        var set = url + cleanQuery;
        window.location.href = set;
    }
}
function clear() {
    var text = "";
    document.getElementById('search').value = text;
}

search.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("search-button").click();
    }
});

setTimeout(function () {
    document.getElementById("loadlazy").style.cssText = 'display:block';
}, 5000);

setTimeout(function () {
    var downloadingImage = new Image();
    downloadingImage.onload = function () {
        document.getElementById("lazyload").classList.add("aftback");
        document.getElementById("lazyload").classList.remove("befback");
    };
    downloadingImage.src = "walpaper2.jpg";
}, 2000);

// document.querySelector(".app-container-plus").onclick = ()=>{
//     var app = document.getElementById("app_cont");
//     var div = document.createElement("div");
//     app.append(div);
//     div.classList.add("app-container-plus-added");
//     this.classList.replace("app-container-plus","app-container-element-added");
//     var new_app = document
// }
function changeloc(){
    var newloc = document.getElementById("weather_input").value ;
    var setloc =  document.getElementById("weather_old").href.split("/",5);
    var newloc_link ="";
    for(var i=0;i<setloc.length;i++){
        newloc_link += setloc[i] + "/" ;
    } 
    newloc_link = newloc_link + newloc + "/";
    document.getElementById("weather_old").href = newloc_link;
    document.getElementById("loadlazy").style.cssText = 'display:none';
    setTimeout(function () {
        document.getElementById("loadlazy").style.cssText = 'display:block';
    }, 50);
    console.log(document.getElementById("weather_old").href);
}
const hour = document.getElementById("hour");
const min = document.getElementById("minute");
const sec = document.getElementById("second");

const setClock = () => {
	let day = new Date();
	let hh = day.getHours();
	let mm = day.getMinutes() ;
	let ss = day.getSeconds() ;
	// hour.style.rotate = `${(hh+(mm/60))*30-180}deg`;
	// min.style.rotate = `${(mm*6)-180}deg`;
	// sec.style.rotate = `${(ss*6)-180}deg`;
    hour.style.setProperty('--hr-deg-start',`${(hh+(mm/60))*30-180}deg`); 
    hour.style.setProperty('--hr-deg-end',`${(hh+(mm/60))*30+180}deg`); 
    min.style.setProperty('--mn-deg-start',`${(mm+(ss/60))*6-180}deg`); 
    min.style.setProperty('--mn-deg-end',`${(mm+(ss/60))*6+180}deg`); 
    sec.style.setProperty('--sc-deg-start',`${(ss*6)-180}deg`); 
    sec.style.setProperty('--sc-deg-end',`${(ss*6)+180}deg`); 
};
setClock();