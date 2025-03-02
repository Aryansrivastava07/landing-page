async function doo(loc){
    const ans = await fetch(`https://api.weatherapi.com/v1/current.json?key=0dc6ac6acd894f5a91d91701251502&q=${loc}`);
    const data = await ans.json();
    document.querySelector(".icon").setAttribute('src',data.current.condition.icon);
    document.querySelector(".weatherReport").classList.remove("disabled");
    document.querySelector(".sum").textContent= data.current.condition.text;
    document.querySelector(".temp").textContent= data.current.feelslike_c + "°C";
    console.log( data.location);
    document.querySelector(".locationName").textContent = data.location.name;
    // document.querySelector(".location").textContent= data.location.name + ", " + data.location.region + ", " + data.location.country;
    // document.querySelector(".wind").textContent= "Wind: " + data.current.wind_kph + " km/h";
    document.querySelector(".locationInput").value = "";
    document.querySelector(".locationInputPopup").value = "";
    localStorage.setItem('city',data.location.name);
}
// document.getElementById('form').addEventListener('submit', function(e){
//     e.preventDefault();
//     if(document.getElementById('name').value === ''){
//         alert('Please enter a valid city name');
//         return;
//     }
//     if(validateInput()){
//         doo();
//         document.querySelector('.datalist').innerHTML  = "";
//     }
// });
document.getElementById('LocationInput').addEventListener('input', function(e){
    auto(document.getElementById('LocationInput').value, 'datalist');
});
document.getElementById('Location').addEventListener('input', function(e){
    auto(document.getElementById('Location').value, 'datalistPopup');
});

async function auto(name, datalist){
    // var name = document.getElementById('locationInput').value;
    // console.log(name);
    if(name === ''){
        return;
    }
    // console.log(`http://api.weatherapi.com/v1/search.json?key=0dc6ac6acd894f5a91d91701251502&q=${encodeURIComponent(name)}`);
    const ans = await fetch(`http://api.weatherapi.com/v1/search.json?key=0dc6ac6acd894f5a91d91701251502&q=${encodeURIComponent(name)}`);
    const data = await ans.json();
    if(data.length === 0){
        return;
    }
    if(data.length>=1){
    data.forEach(element => {
        if(!(exists(element.name,datalist))){
            document.querySelector("."+datalist).innerHTML += `
            <option value="${element.name}" label = "${element.region}" class="option" >
                `;
        }
    });
}}
function exists(name, datalist){
    const options = document.querySelector("."+datalist).options;
    for (let i = 0; i < options.length; i++) {
        if (name === options[i].value) {
            return true;
        }
    }
    return false;
}

function validateInput(input, datalist){
        // const input = document.getElementById("locationInput").value;
        const options = document.querySelector("."+datalist).options;
        for (let i = 0; i < options.length; i++) {
            if (input === options[i].value) {
                return true;
            }
        }
        // console.log(document.querySelector('.datalist').innerHTML);
        alert("Please select a valid option from the list.");
        return false;
    }

let lat , long;

    if ("geolocation" in navigator) {
        // Prompt user for permission to access their location
        navigator.geolocation.getCurrentPosition(
          // Success callback function
          (position) => {
            // Get the user's latitude and longitude coordinates
            lat = position.coords.latitude;
            long = position.coords.longitude;
            getPlace(lat,long);


            // Do something with the location data, e.g. display on a map
          },
          // Error callback function
          (error) => {
            // Handle errors, e.g. user denied location sharing permissions
            console.error("Error getting user location:", error);
            doo(localStorage.getItem('city'));
          }
        );
      } else {
        // Geolocation is not supported by the browser
        console.error("Geolocation is not supported by this browser.");
        doo(localStorage.getItem('city'));
      }

async function getPlace(lat,long){ 
   const ans = await fetch(`https://us1.api-bdc.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`);
    const data = await ans.json();
    doo(data.city);
}



function locinputtoggle(){
    if(document.querySelector(".locationInput").classList.contains("locationInputActive")){
      setWeather("locationInput",'datalist');
      document.addEventListener("keydown",keybinds);
    }
    else document.removeEventListener("keydown",keybinds);
    document.querySelector(".locationInput").value = "";
    document.querySelector(".locationInput").classList.toggle("locationInputActive");
    document.querySelector(".locationButton").classList.toggle("locationButtonActive");
    document.querySelector(".cancelButton").classList.toggle("cancelButtonActive");
  }
  function locinputcancel(){
    document.querySelector(".locationInput").classList.toggle("locationInputActive");
    document.querySelector(".locationButton").classList.toggle("locationButtonActive");
    document.querySelector(".cancelButton").classList.toggle("cancelButtonActive");
    document.querySelector(".locationInput").value = "";
    document.addEventListener("keydown",keybinds);
  }
  
  function setWeather(loca, datalist){
    // console.log(loca);
    let loc = document.querySelector("."+loca).value;
    // const weather = document.querySelector(".weatherwidget-io");
    // console.log(`https://forecast7.com/en/28d4777d50/${loc}/`)
    // weather.href = `https://forecast7.com/en/28d4777d50/${loc}/`;
    // var script = document.createElement('script');
    // script.src = "https://weatherwidget.io/js/widget.min.js";
    // document.body.appendChild(script);
  
  // console.log("dss");
  
    if(loc === ''){
      alert('Please enter a valid city name');
      return;
  }
  if(validateInput(loc,datalist)){
      doo(loc);
      document.querySelector('.datalist').innerHTML  = "";
      document.querySelector('.datalistPopup').innerHTML  = "";
  }}
  
  document.querySelector(".locationFormPopup").addEventListener("submit", (e) => {
    e.preventDefault();
    setWeather("locationInputPopup",'datalistPopup');
  });
