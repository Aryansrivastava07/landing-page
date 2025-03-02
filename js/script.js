var x = 0; // Variable to track the search engine (0: Google, 1: YouTube, 2: Bing)
const search = document.getElementById("Search");
const engine = document.getElementById("engine");
let temp = "";
var whole_link = "";

// -------------------------------------------------------------------get item from local storage ----------------------------------------------------------------
let container = JSON.parse(localStorage.getItem("container")) || {
  shortcuts: {}, speedDial: {}
};
// console.log(container);
// console.log(localStorage.getItem("container"));
// localStorage.removeItem("container");
for (const key in container.shortcuts) {
  const element = container.shortcuts[key];
  // console.log(element)
  addshortcut(element);
}
for (const key in container.speedDial) {
  const element = container.speedDial[key];
  // console.log(element)
  addSpeedDial(element);
}

// add speed dial -------------------------------------------------------------------------------------------------------------------------------------------------

function addSpeedDial(element) {
  console.log(document.querySelectorAll(".speedDialChild").length);
  if(document.querySelectorAll(".speedDialChild").length >= 3){
    document.querySelector(".speedDialAdd").style.cssText = "opacity:0;display:none;";
  }
  let div = document.createElement("div");
  div.classList.add("speedDialChild");
  div.setAttribute("id", `${element.key}`);
  div.innerHTML = `
  <a href="${element.url}" draggable="false">
            <div class="speedDialElement">
              <img src="${element.logo}" alt="" />
            </div>
            <p>${element.name}</p>
          </a>
  `;
  document.getElementById("SpeedDial").insertBefore(div, document.querySelector(".speedDialAdd"));
}

// add shortcuts  -------------------------------------------------------------------------------------------------------------------------------------------------

function addshortcut(element) {
  let app = document.createElement("div");
  app.classList.add("appContainerElement");
  app.setAttribute("id", `${element.key}`);
  app.innerHTML = `
    <a href = "${element.url}" draggable = "false" >
    <img src = "${element.logo}" draggable = "false" >
    <div>${element.name}</div><div class = "link" >${element.url}</div>
    </a>
    `;
  document.getElementById("AppCont").insertBefore(app, document.querySelector(".appContainerAdd"));
}

//---------------------------------------------------------------------------- dialog Handlers ------------------------------------------------------------------------

function openDialog(className) {
  let dialog = document.querySelector(`.${className}`);
  document.querySelector("#ShortcutForm").reset();
  document.querySelector("#SpeeddialForm").reset();
  dialog.showModal();
}

//Speed-dial dialog event handler -------------------------------------------------------------------------------------------------------------------------------------

let speedDialDialog = document.querySelector(".speeddialDialog");
const speeddialForm = document.forms["SpeeddialForm"];
speeddialForm.addEventListener("submit", (e) => {
  e.preventDefault();
  speedDialDialog.close();
  const keys = Object.keys(container.speedDial);
  const Key = keys.length > 0 ? Math.max(...keys.map(Number)) + 1 : Math.random().toString().substring(2, 10);
  const newkey = Key.toString();
  let name = speeddialForm[0].value;
  let url = speeddialForm[1].value;
  let logo = speeddialForm[2].value;
  console.log(container.speedDial);
  // let id = Math.random().toString().substring(2, 10);
  // console.log(speeddialForm.Name.value);
  container.speedDial[newkey] = { name: name, url: url, logo: logo, key: newkey };
  localStorage.setItem("container", JSON.stringify(container));
  addSpeedDial(container.speedDial[newkey]);
});

//Shortcut dialog event handler -------------------------------------------------------------------------------------------------------------------------------------

let shortcutdialog = document.querySelector(".shortcutDialog");
const form = document.forms["ShortcutForm"];
form.addEventListener("submit", (e) => {
  e.preventDefault();
  shortcutdialog.close();
  const keys = Object.keys(container.shortcuts);
  const Key = keys.length > 0 ? Math.max(...keys.map(Number)) + 1 : Math.random().toString().substring(2, 10);
  const newkey = Key.toString();
  let name = form[0].value;
  let url = form[1].value;
  let logo = form[2].value;
  // let id = Math.random().toString().substring(2, 10);
  container.shortcuts[newkey] = { name: name, url: url, logo: logo, key: newkey };
  localStorage.setItem("container", JSON.stringify(container));
  addshortcut(container.shortcuts[newkey]);
});

// paste navigator -------------------------------------------------------------------------------------------------------------------------------------------

document.getElementById("Img").onclick = () => {
  let searchField = document.getElementById("Search");
  navigator.clipboard.readText().then((text) => {
    if (searchField.value.length > 1) {
      searchField.value = "";
    } else if (searchField.value.length <= 1) {
      searchField.value = text;
    }
  });
  search.focus();
};

// keyboard events ----------------------------------------------------------------------------------------------------------------------------------------------

const keybinds = (event) => {
  const ignoredKeys = new Set(["Control", "Shift", "Tab", "CapsLock", "Enter", "AltGraph", "Alt"]);
  const search = document.getElementById("Search");
  const youtubeImg = document.getElementById("YoutubeImg");
  const bingImg = document.getElementById("BingImg");
  const googleImg = document.getElementById("GoogleImg");
  if (!ignoredKeys.has(event.key) && document.activeElement !== search) {
    search.focus();
  }

  const searchValue = search.value.toLowerCase();
  if (searchValue === "y ") {
    x = 1;
    displayImage(youtubeImg, bingImg, googleImg);
    search.value = "";
  } else if (searchValue === "g ") {
    x = 0;
    displayImage(googleImg, youtubeImg, bingImg);
    search.value = "";
  } else if (searchValue === "b ") {
    x = 2;
    displayImage(bingImg, youtubeImg, googleImg);
    search.value = "";
  } 
  // else if (event.ctrlKey && event.key === "v") {
  //   event.preventDefault();
  //   navigator.clipboard.readText().then((text) => {
  //     search.value += text;
  //     search.focus();
  //   });
  // } 
  else if (event.key === "Escape") {
    search.blur();
  } else if (event.key === "Enter" && document.activeElement === search) {
    Search();
  } else if (event.shiftKey && event.key === "Backspace") {
    event.preventDefault();
    search.value = "";
  } else if (event.ctrlKey && event.key === "z") {
    event.preventDefault();
    search.value = temp;
  } else if (document.activeElement === search) {
    debounceThrottle(() => optimizedApiCall(search.value), 100, 500)();
  } 
}

document.addEventListener("keydown", keybinds);

function displayImage(show, ...hide) {
  show.style.cssText = "display:block;";
  hide.forEach(img => img.style.cssText = "display:none;");
}

// search bar ------------------------------------------------------------------------------------------------------------------------------------------

function Search(text = search.value) {
  var link = "";
  for (var i = 0; i < 4; i++) {
    link += String(text[i]);
  }
  if (link === "http" || link === "www.") {
    window.location.href = text;
  } else {
    if (x === 1) {
      var url = "http://www.youtube.com/search?q=";
    } else if (x === 0) {
      var url = "http://www.google.com/search?q=";
    } else if (x === 2) {
      var url = "http://www.bing.com/search?q=";
    }
    var cleanQuery = text.replace(" ", "+", text);
    const encodedSet = encodeURIComponent(cleanQuery);
    var set = url + encodedSet;
    window.location.href = set;
  }
}


// Background Image -------------------------------------------------------------------------------------------------------------------------------------

var downloadingImage = new Image();
downloadingImage.onload = function () {
  // Add class "aftBack" and remove class "befBack" when the image is fully loaded
  document.getElementById("LazyLoad").classList.add("aftBack");
  document.getElementById("LazyLoad").classList.remove("befBack");
};
downloadingImage.src = "../assets/walpaper2.jpg";

// Clock ------------------------------------------------------------------------------------------------------------------------------------------------

const hour = document.getElementById("Hour");
const min = document.getElementById("Minute");
const sec = document.getElementById("Second");

const setClock = () => {
  let day = new Date();
  let hh = day.getHours();
  let mm = day.getMinutes();
  let ss = day.getSeconds();
  
  // Set the start and end rotation angles for the hour, minute, and second hands using CSS variables---------------------------------------------------------
  hour.style.setProperty("--hr-deg-start", `${(hh + mm / 60) * 30 - 180}deg`);
  hour.style.setProperty("--hr-deg-end", `${(hh + mm / 60) * 30 + 180}deg`);
  min.style.setProperty("--mn-deg-start", `${(mm + ss / 60) * 6 - 180}deg`);
  min.style.setProperty("--mn-deg-end", `${(mm + ss / 60) * 6 + 180}deg`);
  sec.style.setProperty("--sc-deg-start", `${ss * 6 - 180}deg`);
  sec.style.setProperty("--sc-deg-end", `${ss * 6 + 180}deg`);
};
setClock(); // Call the setClock function to initialize the clock

let lastResponse = ""; // Variable to store the last response

// Function to perform autocomplete based on the search term---------------------------------------------------------------------------------------------------

async function auto(term) {
  if (term != search.value.trim() || term == "" || term == lastResponse) {
    return; // Exit if the term is the same as the current search value or the last response
  }

  // Create a script element for the Google autocomplete API--------------------------------------------------------------------------------------------------
  var script_1 = "https://www.google.com/complete/search?client=hp&hl=en&sugexp=msedr&gs_rn=62&gs_ri=hp&cp=1&gs_id=9c&q=";
  var script_2 = "&xhr=t&callback=myAmazingFunction";
  const script = document.createElement("script");
  script.src = `${script_1}${term}${script_2}`;
  document.body.appendChild(script);
}

// Callback function for the Google autocomplete API ---------------------------------------------------------------------------------------------------------
function myAmazingFunction(data) {
  lastResponse = data[0]; // Update the last response
  setcompletions(data[1]); // Update the autocomplete suggestions
}

// Debounce and Throttle Function ----------------------------------------------------------------------------------------------------------------------------

function debounceThrottle(func, debounceDelay, throttleDelay) {
  let debounceTimer;
  let throttleTimer;
  let lastArgs;
  let throttled = false;
  let search = document.getElementById("Search");

  return function (...args) {
    lastArgs = args;

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      if (!throttled || search.value.trim() != lastArgs[0]) {
        func.apply(this, lastArgs);
        throttled = true;

        throttleTimer = setTimeout(() => {
          throttled = false;
        }, throttleDelay);
      }
    }, debounceDelay);
  };
}

const debounceDelay = 250; // Time to wait after the user stops typing (in milliseconds)
const throttleDelay = 500; // Minimum time between API calls (in milliseconds)

const optimizedApiCall = debounceThrottle(auto, debounceDelay, throttleDelay); // Optimized API call with debounce and throttle

// Function to set autocomplete suggestions
function setcompletions(res) {
  const autoDiv = document.querySelectorAll(".autoCompDiv");
  for (var i = 0; i < autoDiv.length; i++) {
    document.querySelector(".autoCompDiv").remove(".autoCompDiv");
  }
  res.forEach((element) => {
    const div = document.createElement("div");
    div.classList.add("autoCompDiv");
    document.getElementById('AutoComp').appendChild(div);
    element[0] = element[0].replace(/<[^>]*>/g, ''); // Remove HTML tags from the suggestion
    div.textContent = element[0];
    div.addEventListener("click", () => {
      Search(div.textContent);
    });
  });
}

// Key actions for navigating autocomplete suggestions using keyboard-----------------------------------------------------------------------------------------------

const keyactions = {
  ArrowUp: () => {
    let children = Array.from(document.getElementById("AutoComp").children);
    let index = children.findIndex((element) => element.classList.contains("autoCompDivHighlight"));
    if (index > 0) {
      children[index].classList.remove("autoCompDivHighlight");
      children[index - 1].classList.add("autoCompDivHighlight");
      children[index - 1].scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else if (index == 0) {
      children[index].classList.remove("autoCompDivHighlight");
      children[children.length - 1].classList.add("autoCompDivHighlight");
      children[children.length - 1].scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else {
      children[children.length - 1].classList.add("autoCompDivHighlight");
      children[children.length - 1].scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  },
  ArrowDown: () => {
    let children = Array.from(document.getElementById("AutoComp").children);
    let index = children.findIndex((element) => element.classList.contains("autoCompDivHighlight"));
    if (index < children.length - 1 && index != -1) {
      children[index].classList.remove("autoCompDivHighlight");
      children[index + 1].classList.add("autoCompDivHighlight");
      children[index + 1].scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else if (index == children.length - 1) {
      children[index].classList.remove("autoCompDivHighlight");
      children[0].classList.add("autoCompDivHighlight");
      children[0].scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else {
      children[0].classList.add("autoCompDivHighlight");
      children[0].scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  },
  ArrowRight: () => {
    let children = Array.from(document.getElementById("AutoComp").children);
    let index = children.findIndex((element) => element.classList.contains("autoCompDivHighlight"));
    if (index != -1) {
      temp = search.value;
      search.value = children[index].textContent;
    }
  },
  Enter: () => {
    let children = Array.from(document.getElementById("AutoComp").children);
    let index = children.findIndex((element) => element.classList.contains("autoCompDivHighlight"));
    if (index != -1) {
      search.value = children[index].textContent;
      document.getElementById("autocomp").style.cssText = "display:none;";
      Search();
    }
  },
};

// Event listener for keydown events on the search input
const keydown = search.addEventListener("keydown", (event) => {
  if (document.activeElement === search) {
    if (keyactions[event.key]) {
      keyactions[event.key]();
    }
  }
});

let scroll_index = 2; // Variable to store the current feature index

// Function to scroll to the next feature
function nextFeature(index = scroll_index) {
  document.getElementById(`Feature${index}`).scrollIntoView({ behavior: "smooth", inline: "center" });
  document.querySelector('.indicatorHighlight').classList.remove("indicatorHighlight");
  document.getElementById(`Indicator${index}`).classList.add("indicatorHighlight");
  if (index > 3) {
    document.getElementById(`NextPopup`).style.cssText = "opacity:0.3;cursor:not-allowed";
  } else {
    document.getElementById(`NextPopup`).style.cssText = "opacity:1;cursor:pointer";
  }
  scroll_index = (index + 1);
}

// Function to close the popup
function closePopup() {
  document.getElementById("Popup").classList.remove("popupShow");
  document.getElementById("Popup").classList.add("popupHide");
  document.addEventListener("keydown", keybinds);
}

// Function to run on window load
window.onload = () => {
  setTimeout(() => {
    if (localStorage.getItem("container") === null) {
      document.getElementById("Popup").classList.add("popupShow");
      document.removeEventListener("keydown", keybinds);
    } else {
      // console.log(container.shortcuts.length);
    }
  }, 2000);
}

// Event listener for deleting shortcuts
document.getElementById("DeleteShortcut").addEventListener("click", function() {
  const elements = document.querySelectorAll(".appContainerElement");
  elements.forEach(element => {
    element.addEventListener("click", removeShortcut);
  });
});

// Function to remove a shortcut
function removeShortcut(event) {
  event.preventDefault();
  const elements = document.querySelectorAll(".appContainerElement");
  elements.forEach(element => {
    element.removeEventListener("click", removeShortcut);
  });
  delete container.shortcuts[event.currentTarget.id];
  event.currentTarget.remove();
  localStorage.setItem("container", JSON.stringify(container));
}

// Event listener for deleting speed dials
document.getElementById("DeleteSpeeddial").addEventListener("click", function() {
  const elements = document.querySelectorAll(".speedDialChild");
  elements.forEach(element => {
    element.addEventListener("click", removeSpeeddial);
  });
});

// Function to remove a speed dial
function removeSpeeddial(event) {
  event.preventDefault();
  const elements = document.querySelectorAll(".speedDialChild");
  elements.forEach(element => {
    element.removeEventListener("click", removeSpeeddial);
  });
  delete container.speedDial[event.currentTarget.id];
  event.currentTarget.remove();
  localStorage.setItem("container", JSON.stringify(container));
  console.log(document.querySelectorAll(".speedDialChild").length);
  if (document.querySelectorAll(".speedDialChild").length <= 3) {
    document.querySelector(".speedDialAdd").style.cssText = "opacity:1;display:block;";
  }
}

// Function to cancel the speed dial dialog
function SpeedDialDialogCancel() {
  document.querySelector(".speeddialDialog").close();
  document.querySelector(".speeddialForm").reset();
}

// Function to cancel the shortcut dialog
function ShortcutDialogCancel() {
  document.querySelector(".shortcutDialog").close();
  document.querySelector(".shortcutForm").reset();
}
