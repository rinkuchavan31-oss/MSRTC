import { AppError } from '../utils/response';

const SPEED_LIMIT_KMH = 80;

// In-memory driver duty state (per session)
interface DriverDutyState {
  checklist: Array<{ id: string; title: string; checked: boolean }>;
  currentSpeedKmh: number;
  sosTriggered: boolean;
  lastUpdated: string;
}

const DEFAULT_CHECKLIST = [
  { id: '1', title: 'Tire Pressure & Tread Depth (All 6 wheels)', checked: true },
  { id: '2', title: 'Speed Governor 80 km/h Calibration & Seal', checked: true },
  { id: '3', title: 'Dual Air Brakes & Emergency Retarder Check', checked: true },
  { id: '4', title: 'First Aid Kit & ABC Dry Powder Extinguisher', checked: true },
  { id: '5', title: 'Headlights, Fog Lamps & Hazard Blinkers', checked: true },
  { id: '6', title: 'ETIM GPS Transmitter Power Linked', checked: false },
];

const WAYPOINTS = [
  { stop: 'Swargate Depot Platform 3', time: '07:30 AM', status: 'DEPARTED', delay: 'On Time' },
  { stop: 'Shivajinagar Station Bay 2', time: '07:55 AM', status: 'DEPARTED', delay: '+2 min' },
  { stop: 'Urse Expressway Toll Plaza', time: '08:40 AM', status: 'PASSED', delay: 'On Time' },
  { stop: 'Khalapur Rest Plaza (Mandatory Break)', time: '09:30 AM', status: 'NEXT', delay: 'On Time' },
  { stop: 'Vashi Highway Interchange', time: '10:35 AM', status: 'PENDING', delay: 'Est. 10:35' },
  { stop: 'Dadar Asiad Terminus', time: '11:15 AM', status: 'PENDING', delay: 'Est. 11:15' },
];

const driverState: DriverDutyState = {
  checklist: [...DEFAULT_CHECKLIST],
  currentSpeedKmh: 72,
  sosTriggered: false,
  lastUpdated: new Date().toISOString(),
};

export const driverService = {
  getDutyInfo() {
    return {
      checklist: driverState.checklist,
      waypoints: WAYPOINTS,
      currentSpeedKmh: driverState.currentSpeedKmh,
      speedLimitKmh: SPEED_LIMIT_KMH,
      isSpeeding: driverState.currentSpeedKmh > SPEED_LIMIT_KMH,
      sosTriggered: driverState.sosTriggered,
      allChecksComplete: driverState.checklist.every((c) => c.checked),
    };
  },

  submitChecklist(items: Array<{ id: string; checked: boolean }>): typeof driverState.checklist {
    if (!Array.isArray(items)) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Checklist items must be an array.');
    }

    for (const update of items) {
      const item = driverState.checklist.find((c) => c.id === update.id);
      if (item) item.checked = !!update.checked;
    }

    driverState.lastUpdated = new Date().toISOString();
    return driverState.checklist;
  },

  updateTelemetry(speedKmh: number): { speedKmh: number; speedLimitKmh: number; isSpeeding: boolean } {
    if (typeof speedKmh !== 'number' || speedKmh < 0 || speedKmh > 200) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Speed must be a number between 0 and 200 km/h.');
    }

    driverState.currentSpeedKmh = speedKmh;
    driverState.lastUpdated = new Date().toISOString();

    return {
      speedKmh,
      speedLimitKmh: SPEED_LIMIT_KMH,
      isSpeeding: speedKmh > SPEED_LIMIT_KMH,
    };
  },

  triggerSos(message?: string): { sosId: string; status: string; message: string } {
    driverState.sosTriggered = true;
    driverState.lastUpdated = new Date().toISOString();

    const sosId = `SOS-${Date.now()}`;
    return {
      sosId,
      status: 'BROADCAST',
      message: message || 'Highway breakdown SOS alert triggered. Emergency response notified.',
    };
  },
};
