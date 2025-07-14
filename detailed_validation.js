// More detailed coordinate validation
const fs = require('fs');

const sites = JSON.parse(fs.readFileSync('./src/data/sites.json', 'utf8'));

console.log('Detailed coordinate analysis...');

// Define rough US state boundaries to check if coordinates match their stated location
const stateBounds = {
  'Dallas': { minLat: 32.0, maxLat: 33.5, minLng: -97.5, maxLng: -96.0 },
  'Tampa': { minLat: 27.5, maxLat: 28.5, minLng: -83.0, maxLng: -82.0 },
  'Chicago': { minLat: 41.0, maxLat: 42.5, minLng: -88.5, maxLng: -87.0 },
  'Oklahoma City': { minLat: 35.0, maxLat: 36.0, minLng: -98.0, maxLng: -97.0 },
  'St. Louis': { minLat: 38.0, maxLat: 39.0, minLng: -91.0, maxLng: -90.0 },
  'Phoenix': { minLat: 33.0, maxLat: 34.0, minLng: -113.0, maxLng: -111.0 },
  'Miami': { minLat: 25.0, maxLat: 26.5, minLng: -81.0, maxLng: -80.0 },
  'Detroit': { minLat: 42.0, maxLat: 43.0, minLng: -84.0, maxLng: -82.5 },
  'Charlotte': { minLat: 35.0, maxLat: 36.0, minLng: -82.0, maxLng: -80.0 },
  'Seattle': { minLat: 47.0, maxLat: 48.0, minLng: -123.0, maxLng: -122.0 }
};

let mislocatedSites = [];
let stateStats = {};

sites.forEach((site, index) => {
  const { lat, lng, geoId, state } = site;
  
  // Count sites per state
  if (!stateStats[state]) {
    stateStats[state] = 0;
  }
  stateStats[state]++;
  
  // Check if coordinates match the stated location
  const bounds = stateBounds[state];
  if (bounds) {
    if (lat < bounds.minLat || lat > bounds.maxLat || lng < bounds.minLng || lng > bounds.maxLng) {
      mislocatedSites.push({ 
        index, 
        geoId, 
        state, 
        lat, 
        lng, 
        reason: `Coordinates outside expected ${state} area` 
      });
    }
  }
});

console.log('\nSites per state:');
Object.entries(stateStats).forEach(([state, count]) => {
  console.log(`${state}: ${count} sites`);
});

console.log(`\nFound ${mislocatedSites.length} potentially mislocated sites:`);
mislocatedSites.slice(0, 20).forEach(site => {
  console.log(`${site.geoId} (${site.state}): lat=${site.lat}, lng=${site.lng} - ${site.reason}`);
});

if (mislocatedSites.length > 20) {
  console.log(`... and ${mislocatedSites.length - 20} more mislocated sites`);
}

// Look for duplicate coordinates
console.log('\nChecking for duplicate coordinates...');
const coordMap = new Map();
sites.forEach((site, index) => {
  const coordKey = `${site.lat.toFixed(6)},${site.lng.toFixed(6)}`;
  if (coordMap.has(coordKey)) {
    coordMap.get(coordKey).push({index, geoId: site.geoId, state: site.state});
  } else {
    coordMap.set(coordKey, [{index, geoId: site.geoId, state: site.state}]);
  }
});

let duplicates = 0;
coordMap.forEach((sites, coord) => {
  if (sites.length > 1) {
    duplicates++;
    console.log(`Duplicate coordinate ${coord}: ${sites.map(s => s.geoId).join(', ')}`);
  }
});

console.log(`Found ${duplicates} sets of duplicate coordinates`);
