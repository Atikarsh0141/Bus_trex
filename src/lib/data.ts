
export type Stop = {
    id: string;
    name: string;
    isInterchange: boolean;
    historicalDwellTime: number; // seconds
    crowdSensitivityScore: number; // 0-1
    trafficInfluenceFactor: number; // 0-1
};

export type Route = {
    id: string;
    name: string;
    lineColor: string;
    direction: 'Up' | 'Down';
    stops: Stop[];
    status: 'Active' | 'Inactive';
    historicalTravelTime: number; // minutes
    peakHourCongestionProbability: number; // 0-1
    passengerDemandPattern: 'Low' | 'Medium' | 'High';
    schedule: string;
};

export type Bus = {
    id: string;
    routeId: string;
    position: { lat: number, lng: number };
    passengers: number;
    capacity: number;
    status: 'Running' | 'Delayed' | 'Stopped';
    currentStopIndex: number;
    delayLikelihood: number; // 0-1
    etaConfidence: number; // 0-1
};

// --- Stops Data ---
const stops = {
    // Yellow Line
    samaypurBadli: { id: 's1', name: 'Samaypur Badli', isInterchange: false, historicalDwellTime: 45, crowdSensitivityScore: 0.6, trafficInfluenceFactor: 0.4 },
    rohiniSector18: { id: 's2', name: 'Rohini Sector 18-19', isInterchange: false, historicalDwellTime: 40, crowdSensitivityScore: 0.5, trafficInfluenceFactor: 0.3 },
    haiderpurBadliMor: { id: 's3', name: 'Haiderpur Badli Mor', isInterchange: true, historicalDwellTime: 60, crowdSensitivityScore: 0.7, trafficInfluenceFactor: 0.5 },
    jahangirpuri: { id: 's4', name: 'Jahangirpuri', isInterchange: false, historicalDwellTime: 50, crowdSensitivityScore: 0.6, trafficInfluenceFactor: 0.4 },
    adarshNagar: { id: 's5', name: 'Adarsh Nagar', isInterchange: false, historicalDwellTime: 45, crowdSensitivityScore: 0.5, trafficInfluenceFactor: 0.3 },
    azadpur: { id: 's6', name: 'Azadpur', isInterchange: true, historicalDwellTime: 75, crowdSensitivityScore: 0.8, trafficInfluenceFactor: 0.6 },
    modelTown: { id: 's7', name: 'Model Town', isInterchange: false, historicalDwellTime: 40, crowdSensitivityScore: 0.5, trafficInfluenceFactor: 0.3 },
    gtbNagar: { id: 's8', name: 'G.T.B. Nagar', isInterchange: false, historicalDwellTime: 55, crowdSensitivityScore: 0.7, trafficInfluenceFactor: 0.5 },
    vishwavidyalaya: { id: 's9', name: 'Vishwavidyalaya', isInterchange: false, historicalDwellTime: 60, crowdSensitivityScore: 0.8, trafficInfluenceFactor: 0.4 },
    vidhanSabha: { id: 's10', name: 'Vidhan Sabha', isInterchange: false, historicalDwellTime: 40, crowdSensitivityScore: 0.4, trafficInfluenceFactor: 0.2 },
    civilLines: { id: 's11', name: 'Civil Lines', isInterchange: false, historicalDwellTime: 40, crowdSensitivityScore: 0.4, trafficInfluenceFactor: 0.2 },
    kashmereGate: { id: 's12', name: 'Kashmere Gate', isInterchange: true, historicalDwellTime: 90, crowdSensitivityScore: 0.9, trafficInfluenceFactor: 0.7 },
    chandniChowk: { id: 's13', name: 'Chandni Chowk', isInterchange: false, historicalDwellTime: 70, crowdSensitivityScore: 0.8, trafficInfluenceFactor: 0.6 },
    chawriBazar: { id: 's14', name: 'Chawri Bazar', isInterchange: false, historicalDwellTime: 65, crowdSensitivityScore: 0.7, trafficInfluenceFactor: 0.5 },
    newDelhi: { id: 's15', name: 'New Delhi', isInterchange: true, historicalDwellTime: 85, crowdSensitivityScore: 0.9, trafficInfluenceFactor: 0.7 },
    rajivChowk: { id: 's16', name: 'Rajiv Chowk', isInterchange: true, historicalDwellTime: 120, crowdSensitivityScore: 1.0, trafficInfluenceFactor: 0.8 },
    centralSecretariat: { id: 's17', name: 'Central Secretariat', isInterchange: true, historicalDwellTime: 80, crowdSensitivityScore: 0.8, trafficInfluenceFactor: 0.6 },
    udyogBhawan: { id: 's18', name: 'Udyog Bhawan', isInterchange: false, historicalDwellTime: 45, crowdSensitivityScore: 0.5, trafficInfluenceFactor: 0.3 },
    lokKalyanMarg: { id: 's19', name: 'Lok Kalyan Marg', isInterchange: false, historicalDwellTime: 40, crowdSensitivityScore: 0.4, trafficInfluenceFactor: 0.2 },
    jorbagh: { id: 's20', name: 'Jorbagh', isInterchange: false, historicalDwellTime: 45, crowdSensitivityScore: 0.5, trafficInfluenceFactor: 0.3 },
    ina: { id: 's21', name: 'INA', isInterchange: true, historicalDwellTime: 70, crowdSensitivityScore: 0.8, trafficInfluenceFactor: 0.6 },
    aiims: { id: 's22', name: 'AIIMS', isInterchange: false, historicalDwellTime: 60, crowdSensitivityScore: 0.7, trafficInfluenceFactor: 0.5 },
    greenPark: { id: 's23', name: 'Green Park', isInterchange: false, historicalDwellTime: 50, crowdSensitivityScore: 0.6, trafficInfluenceFactor: 0.4 },
    hauzKhas: { id: 's24', name: 'Hauz Khas', isInterchange: true, historicalDwellTime: 75, crowdSensitivityScore: 0.8, trafficInfluenceFactor: 0.6 },
    majilisPark: {id: 's25', name: 'Majilis Park', isInterchange: false, historicalDwellTime: 40, crowdSensitivityScore: 0.5, trafficInfluenceFactor: 0.3 },
    
    // Red Line
    dilshadGarden: { id: 'r1s1', name: 'Dilshad Garden', isInterchange: false, historicalDwellTime: 50, crowdSensitivityScore: 0.6, trafficInfluenceFactor: 0.5 },
    jhilmil: { id: 'r1s2', name: 'Jhilmil', isInterchange: false, historicalDwellTime: 40, crowdSensitivityScore: 0.5, trafficInfluenceFactor: 0.4 },
    mansarovarPark: { id: 'r1s3', name: 'Mansarovar Park', isInterchange: false, historicalDwellTime: 45, crowdSensitivityScore: 0.5, trafficInfluenceFactor: 0.4 },
    shahdara: { id: 'r1s4', name: 'Shahdara', isInterchange: false, historicalDwellTime: 55, crowdSensitivityScore: 0.7, trafficInfluenceFactor: 0.6 },
    welcome: { id: 'r1s5', name: 'Welcome', isInterchange: true, historicalDwellTime: 70, crowdSensitivityScore: 0.8, trafficInfluenceFactor: 0.7 },
    seelampur: { id: 'r1s6', name: 'Seelampur', isInterchange: false, historicalDwellTime: 60, crowdSensitivityScore: 0.7, trafficInfluenceFactor: 0.6 },
    shastriPark: { id: 'r1s7', name: 'Shastri Park', isInterchange: false, historicalDwellTime: 50, crowdSensitivityScore: 0.6, trafficInfluenceFactor: 0.5 },
    tisHazari: { id: 'r1s9', name: 'Tis Hazari', isInterchange: false, historicalDwellTime: 50, crowdSensitivityScore: 0.6, trafficInfluenceFactor: 0.5 },
    pulbangash: { id: 'r1s10', name: 'Pulbangash', isInterchange: false, historicalDwellTime: 45, crowdSensitivityScore: 0.5, trafficInfluenceFactor: 0.4 },
    pratapNagar: { id: 'r1s11', name: 'Pratap Nagar', isInterchange: false, historicalDwellTime: 45, crowdSensitivityScore: 0.5, trafficInfluenceFactor: 0.4 },
    shastriNagar: { id: 'r1s12', name: 'Shastri Nagar', isInterchange: false, historicalDwellTime: 45, crowdSensitivityScore: 0.5, trafficInfluenceFactor: 0.4 },
    inderlok: { id: 'r1s13', name: 'Inderlok', isInterchange: true, historicalDwellTime: 75, crowdSensitivityScore: 0.8, trafficInfluenceFactor: 0.7 },

    // Blue Line
    dwarkaSector21: { id: 'b1s1', name: 'Dwarka Sector 21', isInterchange: true, historicalDwellTime: 80, crowdSensitivityScore: 0.8, trafficInfluenceFactor: 0.6 },
    dwarka: { id: 'b1s2', name: 'Dwarka', isInterchange: false, historicalDwellTime: 45, crowdSensitivityScore: 0.5, trafficInfluenceFactor: 0.3 },
    dwarkaMor: { id: 'b1s3', name: 'Dwarka Mor', isInterchange: false, historicalDwellTime: 50, crowdSensitivityScore: 0.6, trafficInfluenceFactor: 0.4 },
    uttamNagarWest: { id: 'b1s4', name: 'Uttam Nagar West', isInterchange: false, historicalDwellTime: 55, crowdSensitivityScore: 0.7, trafficInfluenceFactor: 0.5 },
    uttamNagarEast: { id: 'b1s5', name: 'Uttam Nagar East', isInterchange: false, historicalDwellTime: 55, crowdSensitivityScore: 0.7, trafficInfluenceFactor: 0.5 },
    nawada: { id: 'b1s6', name: 'Nawada', isInterchange: false, historicalDwellTime: 45, crowdSensitivityScore: 0.5, trafficInfluenceFactor: 0.4 },
    janakpuriWest: { id: 'b1s7', name: 'Janakpuri West', isInterchange: true, historicalDwellTime: 75, crowdSensitivityScore: 0.8, trafficInfluenceFactor: 0.6 },
    janakpuriEast: { id: 'b1s8', name: 'Janakpuri East', isInterchange: false, historicalDwellTime: 50, crowdSensitivityScore: 0.6, trafficInfluenceFactor: 0.4 },
    tilakNagar: { id: 'b1s9', name: 'Tilak Nagar', isInterchange: false, historicalDwellTime: 60, crowdSensitivityScore: 0.7, trafficInfluenceFactor: 0.5 },
    subhashNagar: { id: 'b1s10', name: 'Subhash Nagar', isInterchange: false, historicalDwellTime: 50, crowdSensitivityScore: 0.6, trafficInfluenceFactor: 0.4 },
    tagoreGarden: { id: 'b1s11', name: 'Tagore Garden', isInterchange: false, historicalDwellTime: 45, crowdSensitivityScore: 0.5, trafficInfluenceFactor: 0.3 },
    rajouriGarden: { id: 'b1s12', name: 'Rajouri Garden', isInterchange: true, historicalDwellTime: 70, crowdSensitivityScore: 0.8, trafficInfluenceFactor: 0.6 },
    rameshNagar: { id: 'b1s13', name: 'Ramesh Nagar', isInterchange: false, historicalDwellTime: 45, crowdSensitivityScore: 0.5, trafficInfluenceFactor: 0.3 },
    motiNagar: { id: 'b1s14', name: 'Moti Nagar', isInterchange: false, historicalDwellTime: 50, crowdSensitivityScore: 0.6, trafficInfluenceFactor: 0.4 },
    kirtiNagar: { id: 'b1s15', name: 'Kirti Nagar', isInterchange: true, historicalDwellTime: 65, crowdSensitivityScore: 0.7, trafficInfluenceFactor: 0.5 },
    shadipur: { id: 'b1s16', name: 'Shadipur', isInterchange: false, historicalDwellTime: 45, crowdSensitivityScore: 0.5, trafficInfluenceFactor: 0.3 },
    patelNagar: { id: 'b1s17', name: 'Patel Nagar', isInterchange: false, historicalDwellTime: 50, crowdSensitivityScore: 0.6, trafficInfluenceFactor: 0.4 },
    rajendraPlace: { id: 'b1s18', name: 'Rajendra Place', isInterchange: false, historicalDwellTime: 45, crowdSensitivityScore: 0.5, trafficInfluenceFactor: 0.3 },
    karolBagh: { id: 'b1s19', name: 'Karol Bagh', isInterchange: false, historicalDwellTime: 60, crowdSensitivityScore: 0.7, trafficInfluenceFactor: 0.5 },
    jhandewalan: { id: 'b1s20', name: 'Jhandewalan', isInterchange: false, historicalDwellTime: 55, crowdSensitivityScore: 0.6, trafficInfluenceFactor: 0.4 },
    ramakrishnaAshram: { id: 'b1s21', name: 'Ramakrishna Ashram Marg', isInterchange: false, historicalDwellTime: 50, crowdSensitivityScore: 0.6, trafficInfluenceFactor: 0.4 },
};

// --- Routes Data ---
export const routes: Route[] = [
    { 
        id: 'YL-1', 
        name: 'Yellow Line',
        lineColor: '#FFD700',
        direction: 'Up', 
        stops: [
            stops.samaypurBadli, stops.rohiniSector18, stops.haiderpurBadliMor, stops.jahangirpuri,
            stops.adarshNagar, stops.azadpur, stops.modelTown, stops.gtbNagar, stops.vishwavidyalaya,
            stops.vidhanSabha, stops.civilLines, stops.kashmereGate, stops.chandniChowk, stops.chawriBazar,
            stops.newDelhi, stops.rajivChowk, stops.centralSecretariat, stops.udyogBhawan,
            stops.lokKalyanMarg, stops.jorbagh, stops.ina, stops.aiims, stops.greenPark, stops.hauzKhas, stops.majilisPark
        ], 
        status: 'Active',
        historicalTravelTime: 65,
        peakHourCongestionProbability: 0.75,
        passengerDemandPattern: 'High',
        schedule: 'Every 5 mins'
    },
    { 
        id: 'RL-1', 
        name: 'Red Line',
        lineColor: '#FF0000',
        direction: 'Up', 
        stops: [
            stops.dilshadGarden, stops.jhilmil, stops.mansarovarPark, stops.shahdara, stops.welcome,
            stops.seelampur, stops.shastriPark, stops.kashmereGate, stops.tisHazari, stops.pulbangash,
            stops.pratapNagar, stops.shastriNagar, stops.inderlok
        ], 
        status: 'Active',
        historicalTravelTime: 40,
        peakHourCongestionProbability: 0.85,
        passengerDemandPattern: 'High',
        schedule: 'Every 4 mins'
    },
    { 
        id: 'BL-1', 
        name: 'Blue Line',
        lineColor: '#0000FF',
        direction: 'Up', 
        stops: [
            stops.dwarkaSector21, stops.dwarka, stops.dwarkaMor, stops.uttamNagarWest, stops.uttamNagarEast,
            stops.nawada, stops.janakpuriWest, stops.janakpuriEast, stops.tilakNagar, stops.subhashNagar,
            stops.tagoreGarden, stops.rajouriGarden, stops.rameshNagar, stops.motiNagar, stops.kirtiNagar,
            stops.shadipur, stops.patelNagar, stops.rajendraPlace, stops.karolBagh, stops.jhandewalan,
            stops.ramakrishnaAshram, stops.rajivChowk
        ], 
        status: 'Active',
        historicalTravelTime: 55,
        peakHourCongestionProbability: 0.80,
        passengerDemandPattern: 'High',
        schedule: 'Every 6 mins'
    },
     { 
        id: 'BL-2', 
        name: 'Blue Line - Branch',
        lineColor: '#0000FF',
        direction: 'Down', 
        stops: [
            stops.rajivChowk, stops.newDelhi, stops.kashmereGate, stops.welcome
        ], 
        status: 'Inactive',
        historicalTravelTime: 20,
        peakHourCongestionProbability: 0.60,
        passengerDemandPattern: 'Medium',
        schedule: 'Every 10 mins'
    }
];

// --- Buses Data ---
export const buses: Bus[] = [
    { id: 'BUS-Y1', routeId: 'YL-1', position: { lat: 28.7231, lng: 77.1235 }, passengers: 30, capacity: 50, status: 'Running', currentStopIndex: 2, delayLikelihood: 0.1, etaConfidence: 0.95 },
    { id: 'BUS-Y2', routeId: 'YL-1', position: { lat: 28.6328, lng: 77.2196 }, passengers: 45, capacity: 50, status: 'Delayed', currentStopIndex: 14, delayLikelihood: 0.8, etaConfidence: 0.65 },
    { id: 'BUS-R1', routeId: 'RL-1', position: { lat: 28.6792, lng: 77.2509 }, passengers: 48, capacity: 60, status: 'Running', currentStopIndex: 5, delayLikelihood: 0.2, etaConfidence: 0.90 },
    { id: 'BUS-R2', routeId: 'RL-1', position: { lat: 28.6692, lng: 77.2167 }, passengers: 55, capacity: 60, status: 'Stopped', currentStopIndex: 8, delayLikelihood: 0.5, etaConfidence: 0.75 },
    { id: 'BUS-B1', routeId: 'BL-1', position: { lat: 28.6129, lng: 77.2295 }, passengers: 35, capacity: 50, status: 'Running', currentStopIndex: 10, delayLikelihood: 0.15, etaConfidence: 0.92 },
    { id: 'BUS-B2', routeId: 'BL-1', position: { lat: 28.6210, lng: 77.0853 }, passengers: 25, capacity: 50, status: 'Running', currentStopIndex: 18, delayLikelihood: 0.1, etaConfidence: 0.98 },
];


// Analytics Data (can be derived from the above data in a real app)
export const passengerRidershipData = [
  { month: "January", passengers: 18600 },
  { month: "February", passengers: 20500 },
  { month: "March", passengers: 23700 },
  { month: "April", passengers: 25300 },
  { month: "May", passengers: 28900 },
  { month: "June", passengers: 30100 },
];

export const onTimePerformanceData = [
  { month: "January", performance: 88 },
  { month: "February", performance: 91 },
  { month: "March", performance: 90 },
  { month: "April", performance: 92 },
  { month: "May", performance: 94 },
  { month: "June", performance: 93 },
];

export const routeEfficiencyData = [
  { route: 'Yellow Line', passengers: 135 },
  { route: 'Red Line', passengers: 160 },
  { route: 'Blue Line', passengers: 145 },
];
