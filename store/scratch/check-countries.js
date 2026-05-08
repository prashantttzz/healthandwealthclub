const { Country } = require('country-state-city');
const countries = Country.getAllCountries();
console.log('Total countries:', countries.length);
console.log('First 5 countries:', countries.slice(0, 5).map(c => c.name));
