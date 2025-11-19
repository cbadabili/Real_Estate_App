import { useEffect, useMemo, useRef, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

type Props = {
  initialArea?: string;
  initialCoords?: { lat: number; lng: number } | null;
  onChange: (loc: {
    area_text: string;
    place_name?: string;
    place_id?: string;
    latitude?: number;
    longitude?: number;
    location_source: 'user_pin' | 'geocode';
  }) => void;
};

type Suggestion = {
  description: string;
  placeId: string;
};

const defaultCenter: google.maps.LatLngLiteral = { lat: -24.65, lng: 25.91 };
const isWithinBotswana = (lng: number, lat: number) => lng >= 20 && lng <= 29 && lat >= -27 && lat <= -17;

export default function PropertyLocationStep({ initialArea = '', initialCoords = null, onChange }: Props) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const [area, setArea] = useState(initialArea);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(initialCoords);

  const mapRef = useRef<google.maps.Map | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'property-location-map',
    googleMapsApiKey: apiKey ?? '',
    libraries: ['places'],
  });

  useEffect(() => {
    if (isLoaded) {
      geocoderRef.current = new google.maps.Geocoder();
      autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
    }
  }, [isLoaded]);

  useEffect(() => {
    setMarkerPosition(initialCoords);
  }, [initialCoords]);

  useEffect(() => {
    if (!area || !autocompleteServiceRef.current) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const service = autocompleteServiceRef.current;
    setLoading(true);

    const timeout = setTimeout(() => {
      service.getPlacePredictions(
        {
          input: area,
          componentRestrictions: { country: 'bw' },
        },
        predictions => {
          if (controller.signal.aborted) return;
          const next = (predictions ?? []).map(prediction => ({
            description: prediction.description ?? '',
            placeId: prediction.place_id ?? '',
          }));
          setSuggestions(next);
          setLoading(false);
        }
      );
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timeout);
      setLoading(false);
    };
  }, [area]);

  const center = useMemo<google.maps.LatLngLiteral>(() => {
    if (markerPosition) return markerPosition;
    return defaultCenter;
  }, [markerPosition]);

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    setArea(suggestion.description);
    setSuggestions([]);

    if (!geocoderRef.current) return;

    geocoderRef.current.geocode({ placeId: suggestion.placeId }, (results, status) => {
      if (status !== 'OK' || !results?.length) return;

      const location = results[0].geometry?.location;
      if (!location) return;

      const lat = location.lat();
      const lng = location.lng();

      if (!isWithinBotswana(lng, lat)) return;

      const latLng: google.maps.LatLngLiteral = { lat, lng };
      setMarkerPosition(latLng);
      mapRef.current?.panTo(latLng);
      mapRef.current?.setZoom(14);

      onChange({
        area_text: suggestion.description,
        place_name: suggestion.description,
        place_id: suggestion.placeId,
        latitude: lat,
        longitude: lng,
        location_source: 'geocode',
      });
    });
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;

    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    if (!isWithinBotswana(lng, lat)) return;

    const latLng = { lat, lng };
    setMarkerPosition(latLng);

    onChange({
      area_text: area,
      latitude: lat,
      longitude: lng,
      location_source: 'user_pin',
    });
  };

  const handleMarkerDrag = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;

    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    if (!isWithinBotswana(lng, lat)) return;

    const latLng = { lat, lng };
    setMarkerPosition(latLng);

    onChange({
      area_text: area,
      latitude: lat,
      longitude: lng,
      location_source: 'user_pin',
    });
  };

  if (!apiKey) {
    return (
      <div className="flex flex-col gap-3">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
          <strong>Map functionality unavailable:</strong> Google Maps API key not configured. Add VITE_GOOGLE_MAPS_API_KEY to use the
          interactive location picker.
        </div>
        <label className="text-sm font-medium">City / Town / Village</label>
        <input
          value={area}
          onChange={event => {
            setArea(event.target.value);
            onChange({ area_text: event.target.value, location_source: 'geocode' });
          }}
          placeholder="e.g., Gaborone, Francistown, Maun, Block 8..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        Unable to load Google Maps. Please check your API key and network connection.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-gray-700">City / Town / Village</label>

      <div className="relative">
        <input
          value={area}
          onChange={e => setArea(e.target.value)}
          placeholder="e.g., Gaborone, Francistown, Maun, Block 8..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 transform">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          </div>
        )}
      </div>

      {!!suggestions.length && (
        <div className="max-h-56 overflow-auto rounded-md border border-gray-200 bg-white shadow-sm">
          {suggestions.map(suggestion => (
            <button
              key={suggestion.placeId}
              className="w-full border-b border-gray-100 px-3 py-2 text-left hover:bg-gray-50 last:border-b-0 focus:bg-blue-50 focus:outline-none"
              onClick={() => handleSelectSuggestion(suggestion)}
              type="button"
            >
              <div className="text-sm font-medium text-gray-900">{suggestion.description}</div>
            </button>
          ))}
        </div>
      )}

      {isLoaded ? (
        <GoogleMap
          onLoad={map => {
            mapRef.current = map;
            if (markerPosition) {
              map.setCenter(markerPosition);
              map.setZoom(14);
            }
          }}
          onClick={handleMapClick}
          mapContainerStyle={{ height: '24rem', width: '100%' }}
          center={center}
          zoom={markerPosition ? 14 : 11}
          options={{
            streetViewControl: false,
            fullscreenControl: false,
            mapTypeControl: false,
          }}
        >
          {markerPosition && (
            <Marker
              position={markerPosition}
              draggable
              onDragEnd={handleMarkerDrag}
            />
          )}
        </GoogleMap>
      ) : (
        <div className="flex h-96 w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
          <div className="text-center text-gray-500">
            <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
            <p className="text-sm">Loading Google Maps...</p>
          </div>
        </div>
      )}
    </div>
  );
}
