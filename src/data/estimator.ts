// Referencia: docs/estimador-colcranes.html, tarifas del 10 de noviembre de 2026.
// Los valores cero pendientes NO equivalen a un servicio gratuito.
export const ESTIMATOR_EMAIL = 'soporte.ventas@colcranes.com';

export const SERVICE_OPTIONS = [
  { id: 'insp', name: 'Inspección periódica', description: 'ASME B30.2. Informe de estado, sin intervención.', hours: 4, routine: false },
  { id: 'A', name: 'Mantenimiento Rutina A', description: 'Ajustes, lubricación y pruebas de funcionamiento.', hours: 6, routine: true },
  { id: 'B', name: 'Mantenimiento Rutina B', description: 'Revisión de frenos, motores y tablero eléctrico.', hours: 8, routine: true },
  { id: 'C', name: 'Mantenimiento Rutina C', description: 'Desarme parcial, cable de acero y reductores.', hours: 16, routine: true },
] as const;

export const EQUIPMENT_OPTIONS = [
  { id: 'poli', name: 'Polipasto en monorriel', factor: 0.7 },
  { id: 'band', name: 'Grúa bandera / pluma', factor: 0.6 },
  { id: 'mono', name: 'Puente grúa monorriel', factor: 1 },
  { id: 'bi', name: 'Puente grúa birriel', factor: 1.2 },
  { id: 'port', name: 'Pórtico o semipórtico', factor: 1.2 },
] as const;

export const CAPACITY_OPTIONS = [
  { id: 'c1', name: 'Hasta 5 t', factor: 1 },
  { id: 'c2', name: '5 a 10 t', factor: 1 },
  { id: 'c3', name: '10 a 20 t', factor: 1.3 },
  { id: 'c4', name: '20 a 50 t', factor: 1.6 },
  { id: 'c5', name: 'Más de 50 t', factor: 2 },
] as const;

export const ZONE_OPTIONS = [
  { id: 'bq', name: 'Barranquilla, perímetro urbano', travel: 0, overnight: false, mobility: false },
  { id: 'bog', name: 'Bogotá, perímetro urbano', travel: 0, overnight: false, mobility: false },
  { id: 'med', name: 'Medellín, perímetro urbano', travel: 0, overnight: false, mobility: false },
  { id: 'per', name: 'Fuera del perímetro urbano', travel: 0, overnight: false, mobility: true },
  { id: 'car', name: 'Costa Caribe: Cartagena, Santa Marta, Valledupar…', travel: 1, overnight: true, mobility: true },
  { id: 'nac', name: 'Otra ciudad del país', travel: 1.5, overnight: true, mobility: true },
] as const;

export const SCHEDULE_OPTIONS = [
  { id: 'hab', name: 'Día hábil, 7 a. m. a 7 p. m.', factor: 1 },
  { id: 'noc', name: 'Día hábil nocturno (+35 %)', factor: 1.35 },
  { id: 'sab', name: 'Sábado (+25 %)', factor: 1.25 },
  { id: 'sabn', name: 'Sábado nocturno (+75 %)', factor: 1.75 },
  { id: 'dom', name: 'Domingo o festivo (+115 %)', factor: 2.15 },
  { id: 'domn', name: 'Domingo o festivo nocturno (+150 %)', factor: 2.5 },
] as const;

export const RATES = {
  technicianHour: 45000, singleTechnicianFactor: 1.7, sisoDay: 250000,
  heightsHour: 0, minimumHours: 8, mobility: 50000, scaffoldDay: 0,
  scissorDay: 400000, scissorTransport: 200000, manliftDay: 900000,
  manliftTransport: 800000, vehicleDay: 379500, overnightPerson: 187500,
  travelFactor: 0.5, consumables: { insp: 45000, A: 90000, B: 150000, C: 350000 },
  lowerMargin: 0.1, upperMargin: 0.15,
} as const;

export interface EquipmentRow {
  type: typeof EQUIPMENT_OPTIONS[number]['id'];
  capacity: typeof CAPACITY_OPTIONS[number]['id'];
  quantity: number;
}

export interface EstimatorState {
  service: typeof SERVICE_OPTIONS[number]['id'];
  zone: typeof ZONE_OPTIONS[number]['id'];
  schedule: typeof SCHEDULE_OPTIONS[number]['id'];
  technicians: 1 | 2;
  siso: boolean;
  heights: boolean;
  vehicle: boolean;
  scaffold: number;
  scissor: number;
  manlift: number;
  rows: EquipmentRow[];
}

export const INITIAL_STATE: EstimatorState = {
  service: 'A', zone: 'bq', schedule: 'hab', technicians: 2,
  siso: false, heights: false, vehicle: false, scaffold: 0, scissor: 0, manlift: 0,
  rows: [{ type: 'mono', capacity: 'c1', quantity: 1 }],
};
