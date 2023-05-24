// get user location
async function getCoords() {
    userPos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    return [userPos.coords.latitude, userPos.coords.longitude]
}
//map object
let myMap = {
    location: [],
    map: {},
    markers: {},

    // build Leaflet map and pinpoint user location on it
    buildMap() {
        this.map = L.map('map', {
            center: [36.272103, -115.268744],
            zoom: 12
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            minZoom: 15,
        }).addTo(this.map)

        const marker = L.marker(this.coordinates)
        marker
            .addTo(this.map)
            .bindPopup('<p1><b>You are here</b><br></p1>')
            .openPopup()


    },

    // add business markers
    addMarkers() {
        for (var i = 0; i < this.businesses.length; i++) {
            this.markers = L.marker([
                this.businesses[i].lat,
                this.businesses[i].long,
            ])
                .bindPopup(`<p1>${this.businesses[i].name}</p1>`)
                .addTo(this.map)
        }
    },
}

// get coordinates via geolocation api
async function getCoords() {
    const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    });
    return [pos.coords.latitude, pos.coords.longitude]
}

// get foursquare businesses
async function getFoursquare(business) {
    const options = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: 'fsq3UEOcGz9cjG2oEyLHeObV8mV51PIuapsrg+5wRJQCgaQ='
        }
    }
    let limit = 5
    let lat = myMap.coordinates[0]
    let lon = myMap.coordinates[1]
    let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
    let data = await response.text()
    let parsedData = JSON.parse(data)
    let businesses = parsedData.results
    return businesses
}
// process foursquare array
function processBusinesses(data) {
    let businesses = data.map((element) => {
        let location = {
            name: element.name,
            lat: element.geocodes.main.latitude,
            long: element.geocodes.main.longitude
        };
        return location
    })
    return businesses
}

// event handlers
// window load
window.onload = async () => {
    let coords = await getCoords()
    myMap.coordinates = coords
    console.log(coords)
    myMap.location = coords
    myMap.buildMap()
}

document.getElementById('submit').addEventListener('click', async (event) => {
    event.preventDefault()
    let business = document.getElementById('business').value
    let data = await getFoursquare(business)
    myMap.businesses = processBusinesses(data)
    myMap.addMarkers()
});


// get foursquare businesses
// process foursquare array
// async function fetchBusinesses(location, businessType) {
// 	const apiKey = 'fsq3UEOcGz9cjG2oEyLHeObV8mV51PIuapsrg+5wRJQCgaQ=';
// 	const apiUrl = `https://api.foursquare.com/v2/venues/search?ll=${location[0]},${location[1]}&query=${businessType}&limit=10&client_id=${apiKey.clientId}&client_secret=${apiKey.clientSecret}&v=20230523`;

// 	try {
// 		const response = await fetch(apiUrl);
// 		const data = await response.json();
// 		return data.response.venues;
// 	} catch (error) {
// 		console.error('Error fetching business data:', error);
// 		return [];
// 	}
// }

// business submit button

// function onMapClick(e) {
//     popup
//     .setLatLng(e.latlng)
//     .setContent(`You clicked the map at ${e.latlng.toString()}`)
//     .openOn(map);
// }

// map.on('click', onMapClick);
