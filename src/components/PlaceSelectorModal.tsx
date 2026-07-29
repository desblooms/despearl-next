'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, Search, Store, X, Check, Building2, Sparkles, Compass } from 'lucide-react';
import { useStore, Place } from '@/context/StoreContext';

// All 14 Districts of Kerala, India
const KERALA_DISTRICTS: Place[] = [
  { id: 'kl-ekm', name: 'Ernakulam (Kochi)', city: 'Ernakulam', pincode: '682001', address: 'MG Road, Marine Drive & Kakkanad Hub', type: 'delivery' },
  { id: 'kl-tvm', name: 'Thiruvananthapuram', city: 'Trivandrum', pincode: '695001', address: 'Kowdiar, East Fort & Technopark', type: 'delivery' },
  { id: 'kl-clt', name: 'Kozhikode (Calicut)', city: 'Kozhikode', pincode: '673001', address: 'Mavoor Road, Beach & Hilite Zone', type: 'delivery' },
  { id: 'kl-tsr', name: 'Thrissur', city: 'Thrissur', pincode: '680001', address: 'Swaraj Round, West Fort & East Fort', type: 'delivery' },
  { id: 'kl-mlp', name: 'Malappuram', city: 'Malappuram', pincode: '676505', address: 'Manjeri, Perinthalmanna & Town Hub', type: 'delivery' },
  { id: 'kl-knr', name: 'Kannur', city: 'Kannur', pincode: '670001', address: 'Thavakkara, Payyannur & Fort Road', type: 'delivery' },
  { id: 'kl-klm', name: 'Kollam', city: 'Kollam', pincode: '691001', address: 'Chinnakada, Ashramam & Beach Road', type: 'delivery' },
  { id: 'kl-pkd', name: 'Palakkad', city: 'Palakkad', pincode: '678001', address: 'GB Road, Stadium Bypass & Fort Area', type: 'delivery' },
  { id: 'kl-alp', name: 'Alappuzha (Alleppey)', city: 'Alappuzha', pincode: '688001', address: 'Mullakkal, Boat Jetty & Beach Hub', type: 'delivery' },
  { id: 'kl-ktm', name: 'Kottayam', city: 'Kottayam', pincode: '686001', address: 'KK Road, Nagampadam & Thirunakara', type: 'delivery' },
  { id: 'kl-wyd', name: 'Wayanad', city: 'Wayanad', pincode: '673121', address: 'Kalpetta, Sulthan Bathery & Mananthavady', type: 'delivery' },
  { id: 'kl-ksd', name: 'Kasaragod', city: 'Kasaragod', pincode: '671121', address: 'MG Road, Kanhangad & Central Hub', type: 'delivery' },
  { id: 'kl-pta', name: 'Pathanamthitta', city: 'Pathanamthitta', pincode: '689645', address: 'Central Junction, Thiruvalla & Adoor', type: 'delivery' },
  { id: 'kl-idk', name: 'Idukki', city: 'Idukki', pincode: '685603', address: 'Painavu, Thodupuzha & Munnar Valley', type: 'delivery' },
];

// Stores in Kerala
const STORE_BRANCHES: Place[] = [
  { id: 'store-kochi', name: 'Kochi Flagship Store', city: 'Ernakulam', pincode: '682016', address: 'MG Road, Shenoys, Kochi, Kerala', type: 'store' },
  { id: 'store-calicut', name: 'Calicut Gallery', city: 'Kozhikode', pincode: '673004', address: 'Mavoor Road Junction, Kozhikode, Kerala', type: 'store' },
  { id: 'store-tvm', name: 'Trivandrum Atelier', city: 'Thiruvananthapuram', pincode: '695003', address: 'Kowdiar Avenue, Trivandrum, Kerala', type: 'store' },
  { id: 'store-thrissur', name: 'Thrissur Boutique', city: 'Thrissur', pincode: '680001', address: 'Swaraj Round West, Thrissur, Kerala', type: 'store' },
];

export default function PlaceSelectorModal() {
  const { selectedPlace, setSelectedPlace, placeModalOpen, setPlaceModalOpen } = useStore();
  const [activeTab, setActiveTab] = useState<'delivery' | 'store'>('delivery');
  const [searchQuery, setSearchQuery] = useState('');
  const [customPincode, setCustomPincode] = useState('');
  const [locating, setLocating] = useState(false);

  if (!placeModalOpen) return null;

  const handleSelectPlace = (place: Place) => {
    setSelectedPlace(place);
    setPlaceModalOpen(false);
  };

  const handleDetectLocation = () => {
    setLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocating(false);
          const detectedPlace: Place = {
            id: `geo-${Date.now()}`,
            name: `Kerala Area (${pos.coords.latitude.toFixed(2)}°, ${pos.coords.longitude.toFixed(2)}°)`,
            city: 'Kerala GPS',
            pincode: 'Kerala',
            address: 'Verified Geolocation in Kerala',
            type: 'delivery'
          };
          handleSelectPlace(detectedPlace);
        },
        () => {
          setLocating(false);
          // Fallback to Kochi
          handleSelectPlace(KERALA_DISTRICTS[0]);
        },
        { timeout: 5000 }
      );
    } else {
      setLocating(false);
      handleSelectPlace(KERALA_DISTRICTS[0]);
    }
  };

  const handleCustomPincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPincode.trim()) return;
    const customPlace: Place = {
      id: `custom-${Date.now()}`,
      name: `Kerala Location (${customPincode.toUpperCase()})`,
      city: 'Kerala Zipcode',
      pincode: customPincode.toUpperCase(),
      address: `Kerala Delivery Zone - Pincode ${customPincode.toUpperCase()}`,
      type: 'delivery'
    };
    handleSelectPlace(customPlace);
    setCustomPincode('');
  };

  const filteredPlaces = (activeTab === 'delivery' ? KERALA_DISTRICTS : STORE_BRANCHES).filter((p) => {
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || (p.city && p.city.toLowerCase().includes(q)) || (p.pincode && p.pincode.toLowerCase().includes(q));
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-md transition-all animate-fadeIn">
      {/* Backdrop clickable overlay */}
      <div className="absolute inset-0" onClick={() => setPlaceModalOpen(false)} />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-brand-rose/20 z-10 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 via-brand-espresso to-brand-burgundy text-white p-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-brand-rose border border-white/10">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white font-outfit">Select Kerala District / Store</h2>
              <p className="text-xs text-brand-cream/80 font-medium">Choose delivery district across 14 Kerala districts or store pickup</p>
            </div>
          </div>
          <button
            onClick={() => setPlaceModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-100 bg-gray-50/50 p-1.5 gap-2">
          <button
            onClick={() => setActiveTab('delivery')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'delivery'
                ? 'bg-white text-brand-burgundy shadow-sm border border-brand-rose/20'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Kerala Districts (14)</span>
          </button>
          <button
            onClick={() => setActiveTab('store')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'store'
                ? 'bg-white text-brand-burgundy shadow-sm border border-brand-rose/20'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Kerala Stores</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          
          {/* Quick Geolocation Trigger */}
          {activeTab === 'delivery' && (
            <button
              onClick={handleDetectLocation}
              disabled={locating}
              className="w-full py-3 px-4 rounded-xl border border-brand-burgundy/20 bg-gradient-to-r from-brand-cream/40 via-white to-brand-cream/20 hover:border-brand-burgundy flex items-center justify-between text-brand-burgundy transition shadow-sm group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-burgundy text-white flex items-center justify-center group-hover:scale-110 transition">
                  <Compass className={`w-4 h-4 ${locating ? 'animate-spin' : ''}`} />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold font-outfit">
                    {locating ? 'Detecting Kerala location...' : 'Detect Current Location'}
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium">Auto-detect GPS location in Kerala</div>
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-brand-rose animate-pulse" />
            </button>
          )}

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === 'delivery' ? "Search Kerala district or pincode..." : "Search Kerala store branch..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-burgundy focus:bg-white transition"
            />
          </div>

          {/* Custom Pincode Input */}
          {activeTab === 'delivery' && (
            <form onSubmit={handleCustomPincodeSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Kerala 6-Digit Pincode (e.g. 682001)"
                value={customPincode}
                onChange={(e) => setCustomPincode(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-burgundy focus:bg-white transition"
              />
              <button
                type="submit"
                disabled={!customPincode.trim()}
                className="px-4 py-2 bg-brand-burgundy text-white rounded-xl text-xs font-bold hover:bg-brand-wine disabled:opacity-40 transition cursor-pointer"
              >
                Apply
              </button>
            </form>
          )}

          {/* Location / Branch List */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-1 font-outfit">
              {activeTab === 'delivery' ? 'Kerala Districts' : 'Flagship Stores in Kerala'}
            </div>

            {filteredPlaces.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-xs font-medium">
                No matching Kerala district found. Try entering your 6-digit pincode above.
              </div>
            ) : (
              filteredPlaces.map((place) => {
                const isSelected = selectedPlace?.id === place.id;
                return (
                  <div
                    key={place.id}
                    onClick={() => handleSelectPlace(place)}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-brand-burgundy bg-brand-cream/30 shadow-sm'
                        : 'border-gray-100 hover:border-brand-rose/40 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                        isSelected ? 'bg-brand-burgundy text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {place.type === 'store' ? <Building2 className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900 font-outfit flex items-center gap-1.5">
                          {place.name}
                          {place.pincode && (
                            <span className="bg-gray-100 text-gray-600 font-mono text-[10px] px-1.5 py-0.5 rounded-md">
                              {place.pincode}
                            </span>
                          )}
                        </div>
                        {place.address && (
                          <div className="text-[11px] text-gray-500 font-medium mt-0.5 line-clamp-1">
                            {place.address}
                          </div>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-brand-burgundy text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-gray-50 p-3 text-center text-[11px] text-gray-500 border-t border-gray-100">
          🌴 Delivery & Express Availability across all 14 Districts of Kerala.
        </div>
      </div>
    </div>
  );
}
