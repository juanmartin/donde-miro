import React, { useState, useEffect } from 'react';
import { MapPin, ChevronDown, Loader2, Check, Search } from 'lucide-react';
import { ALL_REGIONS, POPULAR_REGIONS, searchRegions } from '../data/regions';
import type { Region } from '../types';

interface RegionSelectorProps {
  selectedRegion: Region;
  onRegionChange: (region: Region) => void;
}

export const RegionSelector: React.FC<RegionSelectorProps> = ({
  selectedRegion,
  onRegionChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRegions, setFilteredRegions] = useState<Region[]>(POPULAR_REGIONS);

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredRegions(searchRegions(searchQuery));
    } else {
      setFilteredRegions(POPULAR_REGIONS);
    }
  }, [searchQuery]);

  const handleAutoDetect = async () => {
    setIsDetecting(true);
    
    try {
      // Try to get user's location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: true
        });
      });

      // Use a reverse geocoding service to get country from coordinates
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
      );
      
      if (response.ok) {
        const data = await response.json();
        const countryCode = data.countryCode;
        
        // Find the region in our list
        const detectedRegion = ALL_REGIONS.find(region => region.code === countryCode);
        
        if (detectedRegion) {
          onRegionChange(detectedRegion);
          setIsOpen(false);
        } else {
          // Fallback to US if country not found
          onRegionChange(ALL_REGIONS[0]);
          setIsOpen(false);
        }
      }
    } catch (error) {
      console.error('Failed to detect location:', error);
      // Fallback to showing popular regions
    } finally {
      setIsDetecting(false);
    }
  };

  const handleRegionSelect = (region: Region) => {
    onRegionChange(region);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/15 transition-all duration-200"
        >
          <MapPin className="w-5 h-5 text-purple-300" />
          <span className="flex items-center gap-2">
            <span className="text-lg">{selectedRegion.flag}</span>
            <span className="font-medium">{selectedRegion.name}</span>
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden z-50 min-w-80 max-h-96">
              {/* Auto-detect option */}
              <button
                onClick={handleAutoDetect}
                disabled={isDetecting}
                className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors duration-150 border-b border-white/10 flex items-center gap-3"
              >
                {isDetecting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-purple-300" />
                ) : (
                  <MapPin className="w-4 h-4 text-purple-300" />
                )}
                <span className={isDetecting ? 'text-slate-300' : ''}>
                  {isDetecting ? 'Detecting your location...' : 'Auto-detect my location'}
                </span>
              </button>

              {/* Search box */}
              <div className="p-3 border-b border-white/10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search countries..."
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 text-sm outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              {/* Region options */}
              <div className="max-h-64 overflow-y-auto">
                {!searchQuery.trim() && (
                  <div className="px-4 py-2 text-xs text-slate-400 uppercase tracking-wide">
                    Popular Regions
                  </div>
                )}
                
                {filteredRegions.length > 0 ? (
                  filteredRegions.map((region) => (
                    <button
                      key={region.code}
                      onClick={() => handleRegionSelect(region)}
                      className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors duration-150 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{region.flag}</span>
                        <span>{region.name}</span>
                        <span className="text-xs text-slate-400">({region.code})</span>
                      </div>
                      {selectedRegion.code === region.code && (
                        <Check className="w-4 h-4 text-green-400" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-slate-400">
                    No regions found matching "{searchQuery}"
                  </div>
                )}

                {!searchQuery.trim() && (
                  <>
                    <div className="px-4 py-2 text-xs text-slate-400 uppercase tracking-wide border-t border-white/10 mt-2">
                      All Regions
                    </div>
                    {ALL_REGIONS.slice(15).map((region) => (
                      <button
                        key={region.code}
                        onClick={() => handleRegionSelect(region)}
                        className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors duration-150 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{region.flag}</span>
                          <span>{region.name}</span>
                          <span className="text-xs text-slate-400">({region.code})</span>
                        </div>
                        {selectedRegion.code === region.code && (
                          <Check className="w-4 h-4 text-green-400" />
                        )}
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Overlay to close dropdown */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            ></div>
          </>
        )}
      </div>
    </div>
  );
};