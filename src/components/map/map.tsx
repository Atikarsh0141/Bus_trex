
'use client';

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, MapContainerProps } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import L from 'leaflet';

import { Card, CardContent } from '@/components/ui/card';
import { buses, type Bus } from '@/lib/data';
import { Badge } from '@/components/ui/badge';

const busIcon = new L.Icon({
  iconUrl: '/bus.svg',
  iconRetinaUrl: '/bus.svg',
  iconSize: new L.Point(40, 40),
  className: 'leaflet-bus-icon',
});

const getStatusVariant = (status: Bus['status']) => {
  switch (status) {
    case 'Running':
      return 'default';
    case 'Delayed':
      return 'destructive';
    case 'Stopped':
      return 'outline';
    default:
      return 'secondary';
  }
};

export function Map() {
  const [client, setClient] = useState(false);

  useEffect(() => {
    setClient(true);
  }, []);

  const position: L.LatLngExpression = [28.6448, 77.216721]; // Centered on Delhi

  if (!client) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="h-[70vh] w-full rounded-lg z-0 overflow-hidden">
          <MapContainer
            center={position}
            zoom={11}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {buses.map((bus) => (
              <Marker
                key={bus.id}
                position={[bus.position.lat, bus.position.lng]}
                icon={busIcon}
              >
                <Popup>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-headline font-semibold">
                      Bus {bus.id}
                    </h4>
                    <p>
                      Route:{' '}
                      <span className="font-semibold">{bus.routeId}</span>
                    </p>
                    <p>
                      Status:{' '}
                      <Badge variant={getStatusVariant(bus.status)}>
                        {bus.status}
                      </Badge>
                    </p>
                    <p>
                      Passengers:{' '}
                      <span className="font-semibold">
                        {bus.passengers} / {bus.capacity}
                      </span>
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
}
