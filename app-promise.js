const yargs = require('yargs');
const axios = require('axios');

const argv = yargs
    .options({
        a: {
            demand: true,
            alias: 'address',
            describe: 'Address to fetch weather for',
            string: true
        }
    })
    .help()
    .alias('help', 'h')
    .argv;
var encodedAddress = encodeURIComponent(argv.address);
var geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyCkOH_M7cQAUCUhAyrt1DEh9Avm9Thsw1o`;

axios.get(geocodeURL).then((response) => {
    if(response.data.status === 'ZERO_RESULTS') {
        throw new Error('Unable to find that address');
    }
    var lat = response.data.results[0].geometry.location.lat;
    var lng = response.data.results[0].geometry.location.lng;
    var weatherURL = `https://api.darksky.net/forecast/7b63b0f9b1e6c09205e672b6cbef2ae8/${lat},${lng}`;
    console.log(response.data.results[0].formatted_address);
    return axios.get(weatherURL);
}).then((response) => {

    var FtoC = (degrees) => {
        return Math.round((degrees-32)*50/9)/10;
    };

    var temperature = FtoC(response.data.currently.temperature);
    var apparentTemperature = FtoC(response.data.currently.apparentTemperature);
    console.log(`It's currently ${temperature}\xB0C. It feels like ${apparentTemperature}\xB0C `);
}).catch((e) => {
    if(e.code === 'ENOTFOUND') {
        console.log('Unable to connect');
    } else {
        console.log(e.message);
    }
});
