/**
 * TrafficMap Component
 * Swiss Style world map showing country traffic distribution
 * Custom D3 SVG implementation — no external map library
 */
import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCountryTraffic } from '../../api/siteStatistics';
import * as topojson from 'topojson-client';
import { geoEquirectangular, geoPath } from 'd3-geo';
import { scaleLinear } from 'd3-scale';
import { useTheme } from '../../context/ThemeContext';

// ISO 3166-1 numeric (as string) → alpha-2 mapping for world-atlas ids
const ISO_NUMERIC_TO_ALPHA2: Record<string, string> = {
  '004': 'AF', '008': 'AL', '012': 'DZ', '016': 'AS', '020': 'AD', '024': 'AO',
  '028': 'AG', '031': 'AZ', '032': 'AR', '036': 'AU', '040': 'AT', '044': 'BS',
  '048': 'BH', '050': 'BD', '051': 'AM', '052': 'BB', '056': 'BE', '060': 'BM',
  '064': 'BT', '068': 'BO', '070': 'BA', '072': 'BW', '074': 'BV', '076': 'BR',
  '084': 'BZ', '086': 'IO', '090': 'SB', '092': 'VG', '096': 'BN', '100': 'BG',
  '104': 'MM', '108': 'BI', '112': 'BY', '116': 'KH', '120': 'CM', '124': 'CA',
  '132': 'CV', '136': 'KY', '140': 'CF', '144': 'LK', '148': 'TD', '152': 'CL',
  '156': 'CN', '158': 'TW', '162': 'CX', '166': 'CC', '170': 'CO', '174': 'KM',
  '175': 'YT', '178': 'CG', '180': 'CD', '184': 'CK', '188': 'CR', '191': 'HR',
  '192': 'CU', '196': 'CY', '203': 'CZ', '204': 'BJ', '208': 'DK', '212': 'DM',
  '214': 'DO', '218': 'EC', '222': 'SV', '226': 'GQ', '231': 'ET', '232': 'ER',
  '233': 'EE', '234': 'FO', '238': 'FK', '239': 'GS', '242': 'FJ', '246': 'FI',
  '248': 'AX', '250': 'FR', '254': 'GF', '258': 'PF', '260': 'TF', '262': 'DJ',
  '266': 'GA', '268': 'GE', '270': 'GM', '275': 'PS', '276': 'DE', '288': 'GH',
  '292': 'GI', '296': 'KI', '300': 'GR', '304': 'GL', '308': 'GD', '312': 'GP',
  '316': 'GU', '320': 'GT', '324': 'GN', '328': 'GY', '332': 'HT', '334': 'HM',
  '336': 'VA', '340': 'HN', '344': 'HK', '348': 'HU', '352': 'IS', '356': 'IN',
  '360': 'ID', '364': 'IR', '368': 'IQ', '372': 'IE', '376': 'IL', '380': 'IT',
  '384': 'CI', '388': 'JM', '392': 'JP', '398': 'KZ', '400': 'JO', '404': 'KE',
  '408': 'KP', '410': 'KR', '414': 'KW', '417': 'KG', '418': 'LA', '422': 'LB',
  '426': 'LS', '428': 'LV', '430': 'LR', '434': 'LY', '438': 'LI', '440': 'LT',
  '442': 'LU', '446': 'MO', '450': 'MG', '454': 'MW', '458': 'MY', '462': 'MV',
  '466': 'ML', '470': 'MT', '474': 'MQ', '478': 'MR', '480': 'MU', '484': 'MX',
  '492': 'MC', '496': 'MN', '498': 'MD', '499': 'ME', '500': 'MS', '504': 'MA',
  '508': 'MZ', '512': 'OM', '516': 'NA', '520': 'NR', '524': 'NP', '528': 'NL',
  '531': 'CW', '533': 'AW', '534': 'SX', '535': 'BQ', '540': 'NC', '548': 'VU',
  '554': 'NZ', '558': 'NI', '562': 'NE', '566': 'NG', '570': 'NU', '574': 'NF',
  '578': 'NO', '580': 'MP', '581': 'UM', '583': 'FM', '584': 'MH', '585': 'PW',
  '586': 'PK', '591': 'PA', '598': 'PG', '600': 'PY', '604': 'PE', '608': 'PH',
  '612': 'PN', '616': 'PL', '620': 'PT', '624': 'GW', '626': 'TL', '630': 'PR',
  '634': 'QA', '638': 'RE', '642': 'RO', '643': 'RU', '646': 'RW', '652': 'BL',
  '654': 'SH', '659': 'KN', '660': 'AI', '662': 'LC', '663': 'MF', '666': 'PM',
  '670': 'VC', '674': 'SM', '678': 'ST', '682': 'SA', '686': 'SN', '688': 'RS',
  '690': 'SC', '694': 'SL', '702': 'SG', '703': 'SK', '704': 'VN', '705': 'SI',
  '706': 'SO', '710': 'ZA', '716': 'ZW', '724': 'ES', '728': 'SS', '729': 'SD',
  '732': 'EH', '740': 'SR', '744': 'SJ', '748': 'SZ', '752': 'SE', '756': 'CH',
  '760': 'SY', '762': 'TJ', '764': 'TH', '768': 'TG', '772': 'TK', '776': 'TO',
  '780': 'TT', '784': 'AE', '788': 'TN', '792': 'TR', '795': 'TM', '796': 'TC',
  '798': 'TV', '800': 'UG', '804': 'UA', '807': 'MK', '818': 'EG', '826': 'GB',
  '831': 'GG', '832': 'JE', '833': 'IM', '834': 'TZ', '840': 'US', '850': 'VI',
  '854': 'BF', '858': 'UY', '860': 'UZ', '862': 'VE', '876': 'WF', '882': 'WS',
  '887': 'YE', '894': 'ZM',
};

interface TrafficMapProps {
  className?: string;
}

interface HoveredCountry {
  code: string;
  visits: number;
}

export const TrafficMap: React.FC<TrafficMapProps> = ({ className = '' }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const [geoData, setGeoData] = useState<GeoJSON.FeatureCollection | null>(null);
  const [hovered, setHovered] = useState<HoveredCountry | null>(null);
  const { resolved } = useTheme();
  const isDark = resolved === 'dark';

  const { data: trafficData, isLoading, error } = useQuery({
    queryKey: ['countryTraffic', 30],
    queryFn: () => fetchCountryTraffic(30),
    staleTime: 60 * 60 * 1000,
  });

  // Load TopoJSON and convert to GeoJSON
  useEffect(() => {
    fetch('/world-110m.json')
      .then((res) => res.json())
      .then((topology) => {
        const features = topojson.feature(topology, topology.objects.countries) as unknown as GeoJSON.FeatureCollection;
        setGeoData(features);
      })
      .catch((err) => {
        console.error('Failed to load world map:', err);
      });
  }, []);

  // Measure container width
  useEffect(() => {
    const measure = () => {
      if (svgRef.current?.parentElement) {
        const width = svgRef.current.parentElement.clientWidth;
        // Equirectangular aspect ratio is 2:1
        setDimensions({ width, height: width / 2 });
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Build color scale — light: low=white, high=black; dark: low=dark-gray, high=white
  const noDataFill = isDark ? '#1a1a1a' : '#F5F5F5';
  const strokeColor = isDark ? '#2d2d2d' : '#E0E0E0';
  const hoverFill = isDark ? '#ffffff' : '#000000';

  const colorScale = (() => {
    if (!trafficData || trafficData.length === 0) return () => noDataFill;
    const maxVisits = Math.max(...trafficData.map((d) => d.visits));
    return scaleLinear<string>()
      .domain([0, maxVisits])
      .range(isDark ? ['#1a1a1a', '#ffffff'] : ['#F5F5F5', '#000000']);
  })();

  // Create lookup map: alpha-2 → visits
  const visitsByCode = (() => {
    const map = new Map<string, number>();
    trafficData?.forEach((d) => {
      map.set(d.countryCode, d.visits);
    });
    return map;
  })();

  // Compute projection and paths
  const projection = geoEquirectangular()
    .scale(dimensions.width / (2 * Math.PI))
    .translate([dimensions.width / 2, dimensions.height / 2]);

  const pathGenerator = geoPath().projection(projection);

  if (isLoading || !geoData) {
    return (
      <div className={`flex items-center justify-center py-24 ${className}`}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-200 dark:border-gray-700 border-t-[#0047FF] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[11px] font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider">Loading</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`py-12 text-center ${className}`}>
        <p className="text-sm text-red-600 dark:text-red-400 font-mono">
          ERROR: COULD NOT LOAD TRAFFIC DATA
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="w-full"
        style={{ background: 'transparent' }}
      >
        {geoData.features.map((feature) => {
          const numericId = String(feature.id || '');
          const alpha2 = ISO_NUMERIC_TO_ALPHA2[numericId];
          const visits = alpha2 ? visitsByCode.get(alpha2) : undefined;
          const fill = visits !== undefined ? colorScale(visits) : noDataFill;
          const d = pathGenerator(feature as GeoJSON.Feature);
          if (!d) return null;
          return (
            <path
              key={numericId}
              d={d}
              fill={fill}
              stroke={strokeColor}
              strokeWidth={0.5}
              className="transition-colors duration-200 cursor-pointer"
              style={{ outline: 'none' }}
              onMouseEnter={(e) => {
                e.currentTarget.setAttribute('data-fill', fill);
                e.currentTarget.setAttribute('fill', hoverFill);
                if (alpha2 && visits !== undefined) {
                  setHovered({ code: alpha2, visits });
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.setAttribute('fill', e.currentTarget.getAttribute('data-fill') || fill);
                setHovered(null);
              }}
            />
          );
        })}
      </svg>
      {/* Hover info bar */}
      <div className="mt-4 flex items-center justify-between border-t-[0.5px] border-gray-200 dark:border-gray-800 pt-3">
        <p className="text-[11px] font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {hovered ? (
            <span className="text-black dark:text-white">
              [{hovered.code}] — {hovered.visits.toLocaleString()} visits
            </span>
          ) : (
            <span>Hover over a region to see details</span>
          )}
        </p>
        {trafficData && (
          <p className="text-[10px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Total: {trafficData.reduce((sum, d) => sum + d.visits, 0).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
};
