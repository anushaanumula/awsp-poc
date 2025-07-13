import React from 'react';

// Displays static impact summaries in individual panels
const TopImpactPanels = ({ 
  months = 3, 
  onMarketSelect, 
  onKpiCategorySelect,
  selectedMarket = null,
  selectedCategory = null,
  filteredSitesCount = 0 // New prop to show count of filtered sites
}) => {
  const orderedTypes = [
    'Sleepy Cells',
    'Broken Trends',
    'High Runners',
    'Heavy Hitters',
    'Top n Offenders',
    'Micro/Macro',
  ];
  const regions = ['Dallas', 'Tampa', 'Chicago'];

  const handleMarketClick = (market, kpiCategory) => {
    if (onMarketSelect && onKpiCategorySelect) {
      onMarketSelect(market);
      onKpiCategorySelect(kpiCategory);
    }
  };

  return (
    <div className="mb-4">
      <p className="font-semibold mb-2 text-base-content">In the last {months} months, the top</p>
      <div className="flex space-x-4 overflow-x-auto">
        {orderedTypes.map((type) => (
          <div 
            key={type} 
            className={`p-3 border border-base-content rounded text-sm bw min-w-[12rem] transition-all ${
              selectedCategory === type 
                ? 'bg-secondary text-white border-primary' 
                : 'bg-white hover:bg-neutral'
            }`}
          >
            <p className={`font-semibold mb-1 ${selectedCategory === type ? 'text-white' : 'text-base-content'}`}>
              {type} regions:
            </p>
            <p>
              {regions.map((region, i) => (
                <span key={region}>
                  <button
                    onClick={() => handleMarketClick(region, type)}
                    className={`underline transition-colors ${
                      selectedCategory === type 
                        ? 'text-white hover:text-neutral' 
                        : selectedMarket === region && selectedCategory === type
                          ? 'text-primary font-bold'
                          : 'text-secondary hover:text-primary'
                    }`}
                  >
                    {region}
                  </button>
                  {i < regions.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
      {selectedMarket && selectedCategory && (
        <div className="mt-3 p-3 bg-secondary text-white rounded-lg">
          <p className="text-sm">
            📊 Showing <strong>{selectedCategory}</strong> issues for <strong>{selectedMarket}</strong> market
            {filteredSitesCount > 0 && (
              <span className="ml-2 bg-white text-secondary px-2 py-1 rounded text-xs font-semibold">
                {filteredSitesCount} sites found
              </span>
            )}
            <button 
              onClick={() => {
                if (onMarketSelect && onKpiCategorySelect) {
                  onMarketSelect(null);
                  onKpiCategorySelect(null);
                }
              }}
              className="ml-3 text-xs bg-white text-verizon-blue px-2 py-1 rounded hover:bg-verizon-concrete"
            >
              Clear Filter
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default TopImpactPanels;
