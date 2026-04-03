import { useEffect, useState, useRef } from 'react';
import { routes, buses, schoolLocation } from '../../data/mockData';

interface BusPosition {
  id: string;
  x: number;
  y: number;
  routeIndex: number;
  progress: number; // 0-1 along current segment
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

const routeColors: Record<string, string> = {
  r1: '#3B82F6',
  r2: '#10B981',
  r3: '#F59E0B',
};

const busRouteMap: Record<string, string> = {
  b1: 'r1', b2: 'r2', b3: 'r3'
};

const busColors: Record<string, string> = {
  b1: '#3B82F6', b2: '#10B981', b3: '#F59E0B'
};

const busNumbers: Record<string, string> = {
  b1: 'B1', b2: 'B2', b3: 'B3'
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function LiveMap({ highlightBusId, showAllBuses = true, selectedRouteId, height = 380 }: LiveMapProps) {
  const [busPositions, setBusPositions] = useState<BusPosition[]>(() => {
    return ['b1', 'b2', 'b3'].map((id, i) => {
      const routeId = busRouteMap[id];
      const route = routes.find(r => r.id === routeId)!;
      const startIdx = i % (route.waypoints.length - 1);
      return {
        id,
        x: route.waypoints[startIdx].x,
        y: route.waypoints[startIdx].y,
        routeIndex: startIdx,
        progress: Math.random() * 0.5,
        color: busColors[id],
        busNumber: busNumbers[id],
        routeId,
        speed: 0.004 + Math.random() * 0.002,
      };
    });
  });

  const [hoveredBus, setHoveredBus] = useState<string | null>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    let last = performance.now();

    const animate = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;

      setBusPositions(prev => prev.map(bus => {
        const route = routes.find(r => r.id === bus.routeId)!;
        const wps = route.waypoints;
        let { routeIndex, progress } = bus;
        progress += bus.speed * dt;

        if (progress >= 1) {
          progress = 0;
          routeIndex = (routeIndex + 1) % (wps.length - 1);
        }

        const from = wps[routeIndex];
        const to = wps[(routeIndex + 1) % wps.length];
        return {
          ...bus,
          routeIndex,
          progress,
          x: lerp(from.x, to.x, progress),
          y: lerp(from.y, to.y, progress),
        };
      }));

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  const visibleBuses = showAllBuses
    ? busPositions
    : busPositions.filter(b => b.id === highlightBusId);

  const visibleRoutes = selectedRouteId
    ? routes.filter(r => r.id === selectedRouteId)
    : routes;

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50" style={{ height }}>
      {/* Map Legend */}
      <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur rounded-lg px-3 py-2 shadow-sm border border-slate-200">
        <div className="text-xs font-semibold text-slate-500 mb-1">LIVE TRACKING</div>
        <div className="flex items-center gap-1 mb-1">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs text-slate-600">3 buses active</span>
        </div>
        {routes.map(r => (
          <div key={r.id} className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-1 rounded" style={{ background: r.color }}></span>
            <span className="text-xs text-slate-500">{r.name.split('–')[0]}</span>
          </div>
        ))}
      </div>

      {/* Time Badge */}
      <div className="absolute top-3 right-3 z-10 bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow">
        🕐 Live · {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
      </div>

      <svg
        viewBox="0 0 800 480"
        width="100%"
        height="100%"
        className="block"
        style={{ background: '#EFF6FF' }}
      >
        {/* Background grid / city blocks */}
        <rect x="0" y="0" width="800" height="480" fill="#EFF6FF" />

        {/* Parks */}
        <rect x="20" y="20" width="120" height="80" rx="6" fill="#DCFCE7" stroke="#86EFAC" strokeWidth="1" />
        <text x="80" y="65" textAnchor="middle" fontSize="9" fill="#16A34A" fontWeight="600">City Park</text>

        <rect x="620" y="300" width="100" height="80" rx="6" fill="#DCFCE7" stroke="#86EFAC" strokeWidth="1" />
        <text x="670" y="344" textAnchor="middle" fontSize="9" fill="#16A34A" fontWeight="600">South Park</text>

        <rect x="30" y="350" width="90" height="60" rx="6" fill="#DCFCE7" stroke="#86EFAC" strokeWidth="1" />
        <text x="75" y="383" textAnchor="middle" fontSize="9" fill="#16A34A" fontWeight="600">West Garden</text>

        {/* Water */}
        <rect x="700" y="20" width="90" height="140" rx="8" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1" />
        <text x="745" y="95" textAnchor="middle" fontSize="9" fill="#1D4ED8" fontWeight="600">Lake</text>

        {/* City buildings (gray rectangles) */}
        {[
          [180,20,80,50],[300,20,70,60],[420,20,60,50],[520,20,80,50],
          [20,160,70,60],[20,250,60,70],[20,350,70,40],
          [720,180,70,60],[720,270,70,60],[720,370,60,50],
          [160,380,80,55],[300,400,90,60],[460,400,80,55],
        ].map(([x,y,w,h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx="3" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="0.5" opacity="0.6" />
        ))}

        {/* Main roads (horizontal) */}
        <line x1="0" y1="80" x2="800" y2="80" stroke="#E2E8F0" strokeWidth="14" />
        <line x1="0" y1="240" x2="800" y2="240" stroke="#E2E8F0" strokeWidth="18" />
        <line x1="0" y1="400" x2="800" y2="400" stroke="#E2E8F0" strokeWidth="14" />

        {/* Main roads (vertical) */}
        <line x1="160" y1="0" x2="160" y2="480" stroke="#E2E8F0" strokeWidth="14" />
        <line x1="400" y1="0" x2="400" y2="480" stroke="#E2E8F0" strokeWidth="14" />
        <line x1="640" y1="0" x2="640" y2="480" stroke="#E2E8F0" strokeWidth="14" />

        {/* Secondary roads */}
        <line x1="0" y1="160" x2="800" y2="160" stroke="#F1F5F9" strokeWidth="8" />
        <line x1="0" y1="320" x2="800" y2="320" stroke="#F1F5F9" strokeWidth="8" />
        <line x1="280" y1="0" x2="280" y2="480" stroke="#F1F5F9" strokeWidth="8" />
        <line x1="520" y1="0" x2="520" y2="480" stroke="#F1F5F9" strokeWidth="8" />

        {/* Road center lines */}
        {[80,240,400].map(y => (
          <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="12,8" />
        ))}
        {[160,400,640].map(x => (
          <line key={x} x1={x} y1="0" x2={x} y2="480" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="12,8" />
        ))}

        {/* Road labels */}
        <text x="400" y="73" textAnchor="middle" fontSize="8" fill="#94A3B8" fontWeight="500">ANNA SALAI</text>
        <text x="400" y="233" textAnchor="middle" fontSize="8" fill="#94A3B8" fontWeight="500">GST ROAD (NH-48)</text>
        <text x="155" y="120" textAnchor="middle" fontSize="8" fill="#94A3B8" fontWeight="500" transform="rotate(-90,155,120)">MOUNT ROAD</text>
        <text x="635" y="120" textAnchor="middle" fontSize="8" fill="#94A3B8" fontWeight="500" transform="rotate(-90,635,120)">OMR ROAD</text>

        {/* Route paths */}
        {visibleRoutes.map(route => (
          <polyline
            key={route.id}
            points={route.waypoints.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke={route.color}
            strokeWidth="3"
            strokeDasharray="8,4"
            opacity="0.7"
          />
        ))}

        {/* Stop markers */}
        {visibleRoutes.flatMap(route =>
          route.stops.filter(s => s.id !== `stop-${route.id.replace('r','')}-last`).map(stop => (
            <g key={stop.id}>
              <circle cx={stop.coordinates.x} cy={stop.coordinates.y} r="7" fill="white" stroke={route.color} strokeWidth="2.5" />
              <circle cx={stop.coordinates.x} cy={stop.coordinates.y} r="3" fill={route.color} />
            </g>
          ))
        )}

        {/* School / College */}
        <rect
          x={schoolLocation.x - 32}
          y={schoolLocation.y - 28}
          width="64"
          height="56"
          rx="6"
          fill="#1D4ED8"
          stroke="#1E40AF"
          strokeWidth="2"
        />
        <rect x={schoolLocation.x - 26} y={schoolLocation.y - 4} width="22" height="30" rx="2" fill="#BFDBFE" />
        <rect x={schoolLocation.x + 4} y={schoolLocation.y - 4} width="22" height="30" rx="2" fill="#BFDBFE" />
        <polygon points={`${schoolLocation.x},${schoolLocation.y - 36} ${schoolLocation.x - 28},${schoolLocation.y - 20} ${schoolLocation.x + 28},${schoolLocation.y - 20}`} fill="#1E40AF" />
        <text x={schoolLocation.x} y={schoolLocation.y + 42} textAnchor="middle" fontSize="9" fill="#1D4ED8" fontWeight="700">SCHOOL</text>

        {/* Animated Bus Icons */}
        {visibleBuses.map(bus => {
          const isHighlighted = highlightBusId === bus.id || !highlightBusId;
          const opacity = isHighlighted ? 1 : 0.4;
          const scale = hoveredBus === bus.id ? 1.3 : 1;
          return (
            <g
              key={bus.id}
              transform={`translate(${bus.x},${bus.y}) scale(${scale})`}
              opacity={opacity}
              onMouseEnter={() => setHoveredBus(bus.id)}
              onMouseLeave={() => setHoveredBus(null)}
              style={{ cursor: 'pointer', transition: 'transform 0.1s' }}
            >
              {/* Pulse ring */}
              <circle r="18" fill={bus.color} opacity="0.15">
                <animate attributeName="r" values="16;22;16" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0;0.2" dur="2s" repeatCount="indefinite" />
              </circle>
              {/* Bus body */}
              <rect x="-14" y="-10" width="28" height="20" rx="4" fill={bus.color} />
              <rect x="-10" y="-7" width="8" height="6" rx="1" fill="white" opacity="0.9" />
              <rect x="2" y="-7" width="8" height="6" rx="1" fill="white" opacity="0.9" />
              <rect x="-14" y="6" width="28" height="4" rx="2" fill="white" opacity="0.3" />
              <circle cx="-8" cy="12" r="3" fill="#1E293B" />
              <circle cx="8" cy="12" r="3" fill="#1E293B" />
              {/* Label */}
              <text y="-16" textAnchor="middle" fontSize="9" fill={bus.color} fontWeight="800">
                {bus.busNumber}
              </text>
            </g>
          );
        })}

        {/* Hover tooltip */}
        {hoveredBus && (() => {
          const bus = busPositions.find(b => b.id === hoveredBus);
          const route = routes.find(r => r.id === bus?.routeId);
          if (!bus || !route) return null;
          const tx = bus.x + (bus.x > 640 ? -110 : 20);
          const ty = bus.y + (bus.y > 380 ? -70 : 10);
          return (
            <g>
              <rect x={tx} y={ty} width="105" height="60" rx="6" fill="white" stroke="#E2E8F0" strokeWidth="1" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))" />
              <text x={tx + 8} y={ty + 16} fontSize="9" fontWeight="700" fill={bus.color}>{bus.busNumber}</text>
              <text x={tx + 8} y={ty + 28} fontSize="8" fill="#64748B">{route.name.split('–')[0].trim()}</text>
              <circle cx={tx + 8} cy={ty + 41} r="3" fill="#22C55E">
                <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
              </circle>
              <text x={tx + 16} y={ty + 44} fontSize="8" fill="#22C55E" fontWeight="600">Active · {buses.find(b => b.id === hoveredBus)?.speed} km/h</text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
