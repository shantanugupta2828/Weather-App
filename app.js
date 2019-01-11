const yargs = require('yargs');

const weather = require('./weather/weather');
const geocode = require('./geocode/geocode');
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

geocode.geocodeAddress(argv.address, (error, res) => {
    if(error) {
        console.log(error);
    }
    else {
        console.log(res.address);
        weather.getWeather(res.latitude, res.longitude, (errorMessage, weatherRes) => {
            if(errorMessage) {
                console.log(errorMessage);
            }
            else {
                console.log(`It's currently ${weatherRes.temperature}. It feels like ${weatherRes.apparentTemperature} `);
            }
        });
    }
});


