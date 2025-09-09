import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

type Props = {
  initialArea?: string;
  initialCoords?: { lat: number; lng: number } | null;
  onChange: (loc: {
    area_text: string;
    place_name?: string;
    place_id?: string;
    latitude?: number;
    longitude?: number;
    location_source: "user_pin" | "geocode";
  }) => void;
};

const IN_BW = (lng: number, lat: number) =>
  lng >= 20 && lng <= 29 && lat >= -27 && lat <= -17;

export default function PropertyLocationStep({ 
  initialArea = "", 
  initialCoords = null, 
  onChange 
}: Props) {
  const [area, setArea] = useState(initialArea);
  const [suggestions, setSuggestions] = useState<Array<{ 
    id: string; 
    name: string; 
    center: [number, number] 
  }>>([]);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const mapEl = useRef<HTMLDivElement | null>(null);

  useEffect(() => { 
    if (MAPBOX_TOKEN) {
      mapboxgl.accessToken = MAPBOX_TOKEN; 
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapEl.current || mapRef.current || !MAPBOX_TOKEN) return;
    
    mapRef.current = new mapboxgl.Map({
      container: mapEl.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: initialCoords ? [initialCoords.lng, initialCoords.lat] : [25.91, -24.65], // Gaborone
      zoom: initialCoords ? 13 : 11,
    });

    // Add navigation controls
    mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // If we have initial coordinates, place marker
    if (initialCoords) {
      markerRef.current = new mapboxgl.Marker({ draggable: true })
        .setLngLat([initialCoords.lng, initialCoords.lat])
        .addTo(mapRef.current);
      markerRef.current.on("dragend", handleDragEnd);
    }

    // Add click handler for placing marker
    mapRef.current.on('click', handleMapClick);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapEl.current]);

  // Search suggestions (Mapbox forward geocode, BW only)
  useEffect(() => {
    const q = area.trim();
    if (!q || !MAPBOX_TOKEN) { 
      setSuggestions([]); 
      return; 
    }

    const ctl = new AbortController();
    const run = async () => {
      try {
        setLoading(true);
        const url =
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q + ", Gaborone, Botswana")}.json` +
          `?access_token=${MAPBOX_TOKEN}&country=bw&limit=5&proximity=25.91,-24.65`;
        const res = await fetch(url, { signal: ctl.signal });
        if (!res.ok) return;
        const data = await res.json();
        const sug = (data.features || []).map((f: any) => ({
          id: f.id,
          name: f.place_name as string,
          center: f.center as [number, number], // [lng, lat]
        }));
        setSuggestions(sug);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Geocoding error:', error);
        }
      } finally {
        setLoading(false);
      }
    };
    
    const t = setTimeout(run, 250); // debounce
    return () => { 
      clearTimeout(t); 
      ctl.abort(); 
    };
  }, [area]);

  function handleChooseSuggestion(s: { id: string; name: string; center: [number, number] }) {
    setArea(s.name);
    setSuggestions([]);
    const [lng, lat] = s.center;

    if (!IN_BW(lng, lat)) {
      console.warn('Selected location is outside Botswana bounds');
      return;
    }

    // Place or move marker
    if (!markerRef.current && mapRef.current) {
      markerRef.current = new mapboxgl.Marker({ draggable: true, color: '#3B82F6' })
        .setLngLat([lng, lat])
        .addTo(mapRef.current);
      markerRef.current.on("dragend", handleDragEnd);
    } else if (markerRef.current) {
      markerRef.current.setLngLat([lng, lat]);
    }

    if (mapRef.current) {
      mapRef.current.flyTo({ center: [lng, lat], zoom: 14, essential: true });
    }

    onChange({
      area_text: area || s.name,
      place_name: s.name,
      place_id: s.id,
      latitude: lat,
      longitude: lng,
      location_source: "geocode",
    });
  }

  function handleDragEnd() {
    if (!markerRef.current) return;
    const { lng, lat } = markerRef.current.getLngLat();
    if (!IN_BW(lng, lat)) {
      console.warn('Marker dragged outside Botswana bounds');
      return;
    }
    
    onChange({
      area_text: area,
      latitude: lat,
      longitude: lng,
      location_source: "user_pin",
    });
  }

  function handleMapClick(e: mapboxgl.MapMouseEvent) {
    const { lng, lat } = e.lngLat;
    
    if (!IN_BW(lng, lat)) {
      console.warn('Click location is outside Botswana bounds');
      return;
    }

    // Place or move marker
    if (!markerRef.current && mapRef.current) {
      markerRef.current = new mapboxgl.Marker({ draggable: true, color: '#3B82F6' })
        .setLngLat([lng, lat])
        .addTo(mapRef.current);
      markerRef.current.on("dragend", handleDragEnd);
    } else if (markerRef.current) {
      markerRef.current.setLngLat([lng, lat]);
    }

    onChange({
      area_text: area,
      latitude: lat,
      longitude: lng,
      location_source: "user_pin",
    });
  }

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex flex-col gap-3">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            <strong>Map functionality unavailable:</strong> Mapbox access token not configured.
            Please add your VITE_MAPBOX_ACCESS_TOKEN to use the interactive location picker.
          </p>
        </div>
        <label className="text-sm font-medium">Area / Neighborhood</label>
        <input
          value={area}
          onChange={(e) => {
            setArea(e.target.value);
            onChange({
              area_text: e.target.value,
              location_source: "geocode",
            });
          }}
          placeholder="e.g., Block 8, Phakalane, Village..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-gray-700">
        Area / Neighborhood
      </label>
      
      <div className="relative">
        <input
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="e.g., Block 8, Phakalane, Village..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {!!suggestions.length && (
        <div className="rounded-md border border-gray-200 max-h-56 overflow-auto bg-white shadow-sm">
          {suggestions.map((s) => (
            <button
              key={s.id}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:bg-blue-50 focus:outline-none"
              onClick={() => handleChooseSuggestion(s)}
              type="button"
            >
              <div className="text-sm font-medium text-gray-900">{s.name}</div>
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        <div 
          ref={mapEl} 
          className="h-80 w-full rounded-lg border border-gray-300 bg-gray-100" 
        />
        
        {/* Map overlay instructions */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-md px-2 py-1 text-xs text-gray-600 shadow-sm">
          Click or drag pin to set exact location
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-700 flex items-start gap-2">
          <svg className="h-4 w-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>
            <strong>Tip:</strong> Type the area name to center the map, then click or drag the pin to mark the exact property location within Botswana.
          </span>
        </p>
      </div>
    </div>
  );
}