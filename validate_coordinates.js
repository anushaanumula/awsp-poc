// Script to validate and fix coordinates in sites.json
const fs = require('fs');

// Read the sites data
const sites = JSON.parse(fs.readFileSync('./src/data/sites.json', 'utf8'));

console.log('Analyzing coordinates...');

let invalidSites = [];
let suspiciousSites = [];

sites.forEach((site, index) => {
  const { lat, lng, geoId, state } = site;
  
  // Check for obviously invalid coordinates
  if (lat < 20 || lat > 50) {
    invalidSites.push({ index, geoId, state, lat, lng, reason: 'Latitude out of US range' });
  }
  
  if (lng > -60 || lng < -180) {
    invalidSites.push({ index, geoId, state, lat, lng, reason: 'Longitude out of US range' });
  }
  
  // Check for potentially swapped coordinates
  // US longitude should be negative and between -60 to -180
  // US latitude should be positive and between 20 to 50
  if (lng > lat) {
    suspiciousSites.push({ index, geoId, state, lat, lng, reason: 'Possible lat/lng swap (lng > lat)' });
  }
  
  // Check for coordinates that might be in water (very rough check)
  // East coast ocean would be lng > -70 with lat around 40
  if (lng > -70 && lat > 35 && lat < 45) {
    suspiciousSites.push({ index, geoId, state, lat, lng, reason: 'Possible Atlantic Ocean location' });
  }
  
  // West coast ocean would be lng < -125
  if (lng < -125) {
    suspiciousSites.push({ index, geoId, state, lat, lng, reason: 'Possible Pacific Ocean location' });
  }
  
  // Gulf of Mexico would be lng > -95 and lat < 30
  if (lng > -85 && lat < 30) {
    suspiciousSites.push({ index, geoId, state, lat, lng, reason: 'Possible Gulf of Mexico location' });
  }
});

console.log(`\nFound ${invalidSites.length} invalid coordinates:`);
invalidSites.forEach(site => {
  console.log(`${site.geoId} (${site.state}): lat=${site.lat}, lng=${site.lng} - ${site.reason}`);
});

console.log(`\nFound ${suspiciousSites.length} suspicious coordinates:`);
suspiciousSites.slice(0, 10).forEach(site => {
  console.log(`${site.geoId} (${site.state}): lat=${site.lat}, lng=${site.lng} - ${site.reason}`);
});

if (suspiciousSites.length > 10) {
  console.log(`... and ${suspiciousSites.length - 10} more suspicious sites`);
}
