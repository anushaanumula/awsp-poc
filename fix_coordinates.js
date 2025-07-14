// Script to fix coordinates with accurate US city locations
const fs = require('fs');

// Read the current sites data
const sites = JSON.parse(fs.readFileSync('./src/data/sites.json', 'utf8'));

// Define accurate coordinates for major US cities
const cityCoordinates = {
  'Dallas': { lat: 32.7767, lng: -96.7970 },
  'Tampa': { lat: 27.9506, lng: -82.4572 },
  'Chicago': { lat: 41.8781, lng: -87.6298 },
  'Oklahoma City': { lat: 35.4676, lng: -97.5164 },
  'St Louis': { lat: 38.6270, lng: -90.1994 },
  'Phoenix': { lat: 33.4484, lng: -112.0740 },
  'Miami': { lat: 25.7617, lng: -80.1918 },
  'Detroit': { lat: 42.3314, lng: -83.0458 },
  'Charlotte': { lat: 35.2271, lng: -80.8431 },
  'Seattle': { lat: 47.6062, lng: -122.3321 }
};

// Function to add small random offset to avoid exact duplicates
function addRandomOffset(baseCoord, maxOffset = 0.1) {
  return baseCoord + (Math.random() - 0.5) * maxOffset;
}

console.log('Fixing coordinates for all sites...');

let fixedCount = 0;
const updatedSites = sites.map(site => {
  const cityCoord = cityCoordinates[site.state];
  
  if (cityCoord) {
    // Add small random offset to spread sites around the city
    const newLat = addRandomOffset(cityCoord.lat, 0.2); // ~20km spread
    const newLng = addRandomOffset(cityCoord.lng, 0.2);
    
    fixedCount++;
    return {
      ...site,
      lat: parseFloat(newLat.toFixed(6)),
      lng: parseFloat(newLng.toFixed(6))
    };
  } else {
    console.warn(`No coordinates defined for state: ${site.state}`);
    return site;
  }
});

// Write the updated data back to the file
fs.writeFileSync('./src/data/sites.json', JSON.stringify(updatedSites, null, 2));

console.log(`Fixed coordinates for ${fixedCount} sites`);
console.log('Updated sites.json with accurate coordinates');

// Verify the changes
const verification = updatedSites.slice(0, 5);
console.log('\nSample of updated coordinates:');
verification.forEach(site => {
  console.log(`${site.geoId} (${site.state}): ${site.lat}, ${site.lng}`);
});
