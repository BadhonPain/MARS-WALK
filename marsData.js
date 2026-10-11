// NASA Mars Exploration GIS Datasets (Jezero Crater & Ground-Truth Missions)
// Note: All scientific metadata conforms to NASA PDS & Mars 2020 mission archives.

export const JEZERO_CENTER = {
  lat: 18.384, // North
  lon: 77.581, // East
  elevation: -2530 // meters below Mars datum
};

export const MARS_LANDMARKS = [
  {
    id: 'landing_site',
    name: 'Octavia E. Butler Landing Site',
    type: 'base',
    lat: 18.384,
    lon: 77.581,
    x: 0,
    y: 0,
    desc: 'Touchdown point of the Mars 2020 Perseverance Rover (Feb 18, 2021).',
    status: 'ACTIVE_BASE'
  },
  {
    id: 'delta_front',
    name: 'Western Fan Delta (Hawksbill Gap)',
    type: 'science',
    lat: 18.420,
    lon: 77.442,
    x: -360,
    y: -120,
    desc: 'Ancient river delta front deposited into Jezero lake 3.5 billion years ago.',
    status: 'PRIMARY_OBJECTIVE'
  },
  {
    id: 'seitah',
    name: 'Séítah Formation',
    type: 'geology',
    lat: 18.362,
    lon: 77.520,
    x: -160,
    y: 110,
    desc: 'Dune-covered crater floor with layered olivine-rich igneous rock.',
    status: 'SAMPLED'
  },
  {
    id: 'kodiak',
    name: 'Kodiak Butte',
    type: 'geology',
    lat: 18.405,
    lon: 77.485,
    x: -245,
    y: -40,
    desc: 'Isolated delta remnant butte displaying distinct bottomset and topset sedimentary beds.',
    status: 'ANALYZED'
  },
  {
    id: 'belva_crater',
    name: 'Belva Crater Rim',
    type: 'crater',
    lat: 18.455,
    lon: 77.410,
    x: -430,
    y: -230,
    desc: 'Impact crater within the delta exposing deep cross-bedding layers.',
    status: 'SURVEYED'
  },
  {
    id: 'neretva_vallis',
    name: 'Neretva Vallis Canyon Inlet',
    type: 'channel',
    lat: 18.480,
    lon: 77.340,
    x: -580,
    y: -310,
    desc: 'Major inflow river channel that carved through Jezero rim to feed the paleolake.',
    status: 'INSPECTION_PENDING'
  }
];

export const PERSEVERANCE_TRAVERSE = [
  { x: 0, y: 0, sol: 0, name: 'Octavia E. Butler Landing' },
  { x: -50, y: 30, sol: 120, name: 'South Séítah Entry' },
  { x: -110, y: 80, sol: 195, name: 'Séítah Outcrop (Guillaumes)' },
  { x: -160, y: 110, sol: 260, name: 'Brac Sample Site' },
  { x: -120, y: 20, sol: 340, name: 'Traverse North' },
  { x: -180, y: -20, sol: 380, name: 'Three Forks' },
  { x: -245, y: -40, sol: 420, name: 'Kodiak Remnant Vista' },
  { x: -310, y: -80, sol: 500, name: 'Hawksbill Gap' },
  { x: -360, y: -120, sol: 700, name: 'Delta Scarp Entry' },
  { x: -400, y: -170, sol: 950, name: 'Tenby Outcrop' },
  { x: -430, y: -230, sol: 1200, name: 'Belva Crater Overlook' }
];

export const SCIENCE_TARGETS = [
  {
    id: 'sci_01',
    code: 'ST-01',
    name: 'Sedimentary Delta Mudstone',
    type: 'Sedimentary Rock',
    x: -340,
    y: -105,
    lat: 18.415,
    lon: 77.452,
    priority: 'HIGH',
    valueScore: 94,
    interest: 'Finely-laminated lacustrine mudstone ideal for organic preservation and ancient microbial biosignatures.',
    source: 'MRO HiRISE + Perseverance PIXL',
    actions: ['📷 High-Resolution Micro-Imagery', '🔬 PIXL Elemental X-Ray Mapping', '🪨 Core Sample Caching']
  },
  {
    id: 'sci_02',
    code: 'ST-02',
    name: 'Marginal Carbonate Unit',
    type: 'Carbonate Mineral',
    x: -280,
    y: -140,
    lat: 18.428,
    lon: 77.472,
    priority: 'HIGH',
    valueScore: 91,
    interest: 'Precipitated magnesium carbonates along the paleolake shoreline, indicating non-acidic habitable water.',
    source: 'CRISM Hyperspectral Spectra',
    actions: ['🔬 SHERLOC Raman Spectroscopy', '📷 Mastcam-Z Multispectral', '🪨 Abrasion Patch Inspection']
  },
  {
    id: 'sci_03',
    code: 'ST-03',
    name: 'Olivine-Rich Igneous Floor',
    type: 'Igneous Cumulate',
    x: -160,
    y: 110,
    lat: 18.362,
    lon: 77.520,
    priority: 'MEDIUM',
    valueScore: 82,
    interest: 'Cumulate olivine minerals allowing precise radiometric dating of the Jezero impact basin formation.',
    source: 'Perseverance SuperCam',
    actions: ['🔬 Laser-Induced Breakdown (LIBS)', '📷 Surface Texture Profiling']
  },
  {
    id: 'sci_04',
    code: 'ST-04',
    name: 'Hydrated Silica Vein',
    type: 'Silica Mineral',
    x: -385,
    y: -150,
    lat: 18.432,
    lon: 77.435,
    priority: 'HIGH',
    valueScore: 96,
    interest: 'Micro-crystalline silica deposited by ancient hydrothermal fluids with supreme biosignature fossilization.',
    source: 'CRISM + SuperCam Infrared',
    actions: ['🪨 Priority Core Drill', '🔬 Deep Raman Resonance', '📷 Panoramic Focus Stack']
  },
  {
    id: 'sci_05',
    code: 'ST-05',
    name: 'Neretva Boulder Conglomerate',
    type: 'Riverbed Gravel',
    x: -470,
    y: -260,
    lat: 18.465,
    lon: 77.385,
    priority: 'MEDIUM',
    valueScore: 78,
    interest: 'High-energy flood deposit carrying exotic volcanic rock fragments from outside the Jezero catchment.',
    source: 'HiRISE Digital Terrain Model',
    actions: ['📷 Grain Size Distribution', '🔬 Alpha Particle X-Ray']
  },
  {
    id: 'sci_06',
    code: 'ST-06',
    name: 'Belva Impact Melt Breccia',
    type: 'Impact Melt',
    x: -430,
    y: -230,
    lat: 18.455,
    lon: 77.410,
    priority: 'MEDIUM',
    valueScore: 75,
    interest: 'Shock-metamorphosed rock providing kinetic energy and shock heating constraints.',
    source: 'Perseverance RIMFAX Radar',
    actions: ['🔬 Subsurface Radar Sounding', '📷 Structural Bedding Mapping']
  }
];

export const HAZARDS = [
  {
    id: 'haz_01',
    code: 'HAZ-01',
    name: 'Delta Scarp Escarpment',
    type: 'Steep Slope',
    severity: 'HIGH',
    x: -330,
    y: -60,
    lat: 18.402,
    lon: 77.465,
    gradient: '28° Grade',
    desc: 'Unstable cliff face exceeding rover and suit mobility thresholds. High slip risk.',
    mitigation: 'Bypass south via Hawksbill Gap valley floor (Route B).'
  },
  {
    id: 'haz_02',
    code: 'HAZ-02',
    name: 'Séítah Sand Ripple Field',
    type: 'Perilous Regolith',
    severity: 'MEDIUM',
    x: -90,
    y: 120,
    lat: 18.355,
    lon: 77.545,
    gradient: 'Active Dunes',
    desc: 'Soft, loose basaltic sand dunes with high wheel/boot entrapment hazard.',
    mitigation: 'Remain on exposed bedrock ridges.'
  },
  {
    id: 'haz_03',
    code: 'HAZ-03',
    name: 'Belva Ejecta Boulder Cluster',
    type: 'Rocky Surface',
    severity: 'MEDIUM',
    x: -450,
    y: -200,
    lat: 18.448,
    lon: 77.400,
    gradient: '1.2m Boulders',
    desc: 'Dense field of jagged boulders exceeding 1m diameter causing trip hazards and line-of-sight loss.',
    mitigation: 'Navigate along marked navigation corridor.'
  },
  {
    id: 'haz_04',
    code: 'HAZ-04',
    name: 'Dust Devil Vortex Corridor',
    type: 'Atmospheric Dust',
    severity: 'LOW',
    x: -210,
    y: 30,
    lat: 18.378,
    lon: 77.502,
    gradient: '45 km/h Gusts',
    desc: 'Localized thermal vortices creating rapid electrostatic charge and dust obscuration.',
    mitigation: 'Seal optical suit lenses, engage visor polarization.'
  }
];

export const GEOLOGY_REGIONS = [
  {
    name: 'Western Fan Delta Deposits',
    color: 'rgba(56, 189, 248, 0.22)',
    borderColor: '#38bdf8',
    points: [
      { x: -280, y: -70 },
      { x: -370, y: -90 },
      { x: -440, y: -190 },
      { x: -390, y: -240 },
      { x: -320, y: -180 },
      { x: -250, y: -110 }
    ]
  },
  {
    name: 'Séítah Olivine Cumulate Unit',
    color: 'rgba(217, 119, 6, 0.22)',
    borderColor: '#d97706',
    points: [
      { x: -40, y: 20 },
      { x: -140, y: 70 },
      { x: -180, y: 150 },
      { x: -80, y: 170 },
      { x: 10, y: 80 }
    ]
  },
  {
    name: 'Marginal Carbonate Ring',
    color: 'rgba(168, 85, 247, 0.2)',
    borderColor: '#a855f7',
    points: [
      { x: -260, y: -130 },
      { x: -300, y: -160 },
      { x: -340, y: -150 },
      { x: -310, y: -120 }
    ]
  }
];

export const DEFAULT_ROUTES = {
  route_a: {
    id: 'route_a',
    code: 'ROUTE A',
    name: 'Route A — Shortest Path',
    type: 'Shortest Path',
    recommended: false,
    distanceKm: 3.9,
    timeEva: '2h 45m',
    elevationChange: '+190 m',
    terrainDiff: 'High (22% Scarp Grade)',
    hazardLevel: 'Moderate to High',
    scienceCount: 1,
    scienceTargetIds: ['sci_01'],
    missionScore: 68,
    color: '#f59e0b',
    rationale: 'Direct straight-line path across Jezero floor. Saves 0.9 km compared to Route B, but forces astronauts to scale a hazardous 28° scarp cliff with loose basaltic talus.',
    factorScores: {
      safety: 55,
      science: 60,
      terrain: 45,
      distance: 98,
      environment: 85
    },
    waypoints: [
      { name: 'Start: Octavia Landing', x: 0, y: 0, lat: 18.384, lon: 77.581 },
      { name: 'Scarp Approach', x: -160, y: -30, lat: 18.392, lon: 77.536 },
      { name: 'Delta Wall Climb', x: -280, y: -70, lat: 18.404, lon: 77.472 },
      { name: 'End: Delta Crest', x: -360, y: -120, lat: 18.420, lon: 77.442 }
    ]
  },
  route_b: {
    id: 'route_b',
    code: 'ROUTE B',
    name: 'Route B — Safest Path (RECOMMENDED)',
    type: 'Safest Path',
    recommended: true,
    distanceKm: 4.8,
    timeEva: '3h 42m',
    elevationChange: '+65 m',
    terrainDiff: 'Moderate (8% Grade)',
    hazardLevel: 'Low',
    scienceCount: 3,
    scienceTargetIds: ['sci_01', 'sci_02', 'sci_04'],
    missionScore: 87,
    color: '#10b981',
    rationale: 'Route B is recommended because it avoids steep terrain, reduces hazard exposure, and passes two high-value geological targets (Marginal Carbonate & Delta Mudstone) while adding only 0.9 km to the journey.',
    factorScores: {
      safety: 92,
      science: 90,
      terrain: 88,
      distance: 82,
      environment: 85
    },
    waypoints: [
      { name: 'Start: Octavia Landing', x: 0, y: 0, lat: 18.384, lon: 77.581 },
      { name: 'Three Forks Valley', x: -120, y: 15, lat: 18.379, lon: 77.547 },
      { name: 'Kodiak Butte South Pass', x: -220, y: -25, lat: 18.391, lon: 77.519 },
      { name: 'Hawksbill Gap Entry', x: -290, y: -90, lat: 18.409, lon: 77.469 },
      { name: 'Carbonate Outcrop ST-02', x: -320, y: -115, lat: 18.416, lon: 77.458 },
      { name: 'End: Delta Front ST-01', x: -360, y: -120, lat: 18.420, lon: 77.442 }
    ]
  },
  route_c: {
    id: 'route_c',
    code: 'ROUTE C',
    name: 'Route C — Science Optimized',
    type: 'Science Optimized',
    recommended: false,
    distanceKm: 6.2,
    timeEva: '5h 10m',
    elevationChange: '+120 m',
    terrainDiff: 'Moderate-High (14% Grade)',
    hazardLevel: 'Moderate',
    scienceCount: 5,
    scienceTargetIds: ['sci_03', 'sci_02', 'sci_01', 'sci_04', 'sci_06'],
    missionScore: 81,
    color: '#38bdf8',
    rationale: 'Science-first trajectory traversing the olivine-rich Séítah floor, the shoreline carbonate ring, and the Delta crest. Maximizes sample return but pushes suit consumable limits near 5+ hours.',
    factorScores: {
      safety: 72,
      science: 98,
      terrain: 70,
      distance: 65,
      environment: 80
    },
    waypoints: [
      { name: 'Start: Octavia Landing', x: 0, y: 0, lat: 18.384, lon: 77.581 },
      { name: 'Séítah Olivine Basin ST-03', x: -140, y: 90, lat: 18.358, lon: 77.531 },
      { name: 'West Séítah Ridge', x: -210, y: 30, lat: 18.375, lon: 77.512 },
      { name: 'Carbonate Ring ST-02', x: -280, y: -130, lat: 18.420, lon: 77.472 },
      { name: 'Silica Vein ST-04', x: -370, y: -145, lat: 18.425, lon: 77.439 },
      { name: 'End: Delta Overlook', x: -360, y: -120, lat: 18.420, lon: 77.442 }
    ]
  }
};
