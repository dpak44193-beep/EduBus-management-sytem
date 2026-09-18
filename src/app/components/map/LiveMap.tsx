import { useEffect, useRef, useState } from 'react';
import { routes, schoolLocation } from '../../data/mockData';

const stopLabels = ['Stop 1', 'Stop 2', 'Stop 3', 'Stop 4', 'Stop 5'];

interface BusPosition {
  id: string;
  x: number;
  y: number;
  routeIndex: number;
  progress: number;
  color: string;
  busNumber: string;
  routeId: string;
  speed: number;
}

interface LiveMapProps {
  highlightBusId?: string;
  showAllBuses?: boolean;
  selectedRouteId?: string;
  height?: number;
}

const mapEmbedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15672.79621421242!2d77.02190049999999!3d10.87245965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba84ffc9b3ea755%3A0xda7508a90583d22f!2sKarpagam%20College%20of%20Engineering!5e0!3m2!1sen!2sin!4v1789664875528!5m2!1sen!2sin';
const busRouteMap: Record<string, string> = { b1: 'r1', b2: 'r2', b3: 'r3' };
const busColors: Record<string, string> = { b1: '#2563EB', b2: '#059669', b3: '#F59E0B' };
const busNumbers: Record<string, string> = { b1: 'B1', b2: 'B2', b3: 'B3' };

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function LiveMap({ highlightBusId, showAllBuses = true, selectedRouteId, height = 380 }: LiveMapProps) {
  const [busPositions, setBusPositions] = useState<BusPosition[]>(() => ['b1', 'b2', 'b3'].map((id, index) => {
    const routeId = busRouteMap[id];
    const route = routes.find((item) => item.id === routeId)!;
    const startIndex = index % (route.waypoints.length - 1);
    return {
      id,
      x: route.waypoints[startIndex].x,
      y: route.waypoints[startIndex].y,
      routeIndex: startIndex,
      progress: Math.random() * 0.5,
      color: busColors[id],
      busNumber: busNumbers[id],
      routeId,
      speed: 0.004 + Math.random() * 0.002,
    };
  }));
  const [hoveredBus, setHoveredBus] = useState<string | null>(null);
  const [selectedBusId, setSelectedBusId] = useState<string | null>(highlightBusId ?? null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    let last = performance.now();
    const animate = (now: number) => {
      const delta = Math.min(now - last, 50);
      last = now;
      setBusPositions((previous) => previous.map((bus) => {
        const route = routes.find((item) => item.id === bus.routeId)!;
        const waypoints = route.waypoints;
        let { routeIndex, progress } = bus;
        progress += bus.speed * delta;
        if (progress >= 1) {
          progress = 0;
          routeIndex = (routeIndex + 1) % (waypoints.length - 1);
        }
        const from = waypoints[routeIndex];
        const to = waypoints[routeIndex + 1];
        return { ...bus, routeIndex, progress, x: lerp(from.x, to.x, progress), y: lerp(from.y, to.y, progress) };
      }));
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const visibleBuses = showAllBuses ? busPositions : busPositions.filter((bus) => bus.id === highlightBusId);
  const visibleRoutes = selectedRouteId ? routes.filter((route) => route.id === selectedRouteId) : routes;
  const selectedBus = busPositions.find((bus) => bus.id === (selectedBusId ?? highlightBusId)) ?? null;
  const selectedRoute = selectedBus ? routes.find((route) => route.id === selectedBus.routeId) ?? null : null;

  useEffect(() => {
    setSelectedBusId(highlightBusId ?? null);
  }, [highlightBusId]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100" style={{ height }}>
      <iframe
        title="Karpagam College of Engineering campus map"
        src={mapEmbedUrl}
        className="absolute inset-0 h-full w-full border-0"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />

      <div className="pointer-events-none absolute inset-0 bg-sky-900/10" />

      <svg viewBox="0 0 800 480" className="pointer-events-none absolute inset-0 block h-full w-full" aria-label="Demo bus routes and live positions" onClick={() => setSelectedBusId(null)}>
        {visibleRoutes.map((route) => (
          <polyline
            key={route.id}
            points={route.waypoints.map((point) => `${point.x},${point.y}`).join(' ')}
            fill="none"
            stroke={route.color}
            strokeWidth="5"
            strokeDasharray="12,8"
            strokeLinecap="round"
            opacity="0.85"
          />
        ))}

        {visibleRoutes.flatMap((route) => route.stops.map((stop) => (
          <g key={stop.id}>
            <circle cx={stop.coordinates.x} cy={stop.coordinates.y} r="8" fill="white" stroke={route.color} strokeWidth="3" />
            <circle cx={stop.coordinates.x} cy={stop.coordinates.y} r="3" fill={route.color} />
          </g>
        )))}

        <g transform={`translate(${schoolLocation.x},${schoolLocation.y})`}>
          <rect x="-30" y="-24" width="60" height="48" rx="8" fill="#1D4ED8" stroke="white" strokeWidth="3" />
          <path d="M-18 20V-2h12v22M6 20V-2h12v22M-25-24L0-38l25 14" fill="#BFDBFE" stroke="white" strokeWidth="3" />
          <text y="44" textAnchor="middle" fontSize="12" fontWeight="800" fill="#1D4ED8" stroke="white" strokeWidth="3" paintOrder="stroke">CAMPUS</text>
        </g>

        {visibleBuses.map((bus) => {
          const isHighlighted = highlightBusId === bus.id || !highlightBusId;
          const scale = hoveredBus === bus.id ? 1.25 : 1;
          const routeName = routes.find((item) => item.id === bus.routeId)?.name ?? 'Route';
          return (
            <g
              key={bus.id}
              transform={`translate(${bus.x},${bus.y}) scale(${scale})`}
              opacity={isHighlighted ? 1 : 0.4}
              onMouseEnter={() => setHoveredBus(bus.id)}
              onMouseLeave={() => setHoveredBus(null)}
              onClick={(event) => {
                event.stopPropagation();
                setSelectedBusId((current) => current === bus.id ? null : bus.id);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedBusId((current) => current === bus.id ? null : bus.id);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`${bus.busNumber} on ${routeName}. Click to view route direction details.`}
              className="cursor-pointer outline-none"
              style={{ pointerEvents: 'auto' }}
            >
              <circle r="20" fill={bus.color} opacity="0.22">
                <animate attributeName="r" values="16;24;16" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.28;0;0.28" dur="2s" repeatCount="indefinite" />
              </circle>
              <rect x="-15" y="-11" width="30" height="22" rx="5" fill={bus.color} stroke="white" strokeWidth="2" />
              <rect x="-10" y="-7" width="8" height="6" rx="1" fill="white" />
              <rect x="2" y="-7" width="8" height="6" rx="1" fill="white" />
              <text y="-18" textAnchor="middle" fontSize="12" fontWeight="800" fill={bus.color} stroke="white" strokeWidth="3" paintOrder="stroke">{bus.busNumber}</text>
            </g>
          );
        })}
      </svg>

      <div className="absolute left-3 top-3 z-10 rounded-lg border border-white/70 bg-white/90 px-3 py-2 shadow-sm backdrop-blur">
        <div className="text-[10px] font-bold tracking-[0.12em] text-slate-500">LIVE GPS TRACKING</div>
        <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> {visibleBuses.length} active {visibleBuses.length === 1 ? 'bus' : 'buses'}
        </div>
      </div>

      {selectedBus && selectedRoute && (
        <div className="absolute bottom-3 left-3 z-10 w-[290px] rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur">
          <div className="flex items-center justify-between gap-2">
            <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Direction details</div>
            <span className="inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: selectedBus.color }} />
          </div>

          <div className="mt-2 border-l-2 border-slate-200 pl-2">
            <div className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Route</div>
            <div className="mt-1 text-sm font-bold text-slate-800">{selectedRoute.name}</div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
            <div className="rounded-lg bg-slate-50 p-2">
              <div className="text-slate-400">Status</div>
              <div className="mt-1 font-semibold text-emerald-600">On route</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-2">
              <div className="text-slate-400">Speed</div>
              <div className="mt-1 font-semibold text-slate-800">{Math.round((selectedBus.speed || 0.008) * 1000)} km/h</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-2">
              <div className="text-slate-400">Distance</div>
              <div className="mt-1 font-semibold text-slate-800">{selectedRoute.distance} km</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-2">
              <div className="text-slate-400">ETA</div>
              <div className="mt-1 font-semibold text-slate-800">~{selectedRoute.estimatedTime} min</div>
            </div>
          </div>

          <div className="mt-3">
            <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Stops</div>
            <div className="mt-2 space-y-1.5">
              {selectedRoute.stops.map((stop, index) => (
                <div key={stop.id} className="flex items-center gap-2 rounded-md bg-slate-50 px-2 py-1 text-[11px] text-slate-600">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: selectedRoute.color }} />
                  <span className="min-w-[48px] font-semibold text-slate-700">{stopLabels[index] ?? `Stop ${index + 1}`}</span>
                  <span className="truncate">{stop.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-3 right-3 z-10 rounded-md bg-slate-950/75 px-2.5 py-1.5 text-[10px] font-medium text-white backdrop-blur">
        Google Maps · Karpagam College of Engineering
      </div>
    </div>
  );
}
