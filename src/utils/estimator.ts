import { SERVICE_OPTIONS, ZONE_OPTIONS, SCHEDULE_OPTIONS, EQUIPMENT_OPTIONS, CAPACITY_OPTIONS, RATES as r, type EstimatorState } from '../data/estimator';

export const money = (value: number) => '$ ' + Math.round(value).toLocaleString('es-CO');
const round = (value: number) => Math.round(value / 10000) * 10000;
export const boundedInteger = (value: string | number, min: number, max: number) =>
  Math.max(min, Math.min(max, Math.trunc(Number(value) || 0)));

export function estimate(state: EstimatorState) {
  const service = SERVICE_OPTIONS.find(item => item.id === state.service)!;
  const zone = ZONE_OPTIONS.find(item => item.id === state.zone)!;
  const schedule = SCHEDULE_OPTIONS.find(item => item.id === state.schedule)!;
  const rows = state.rows.filter(row => row.quantity > 0);
  const equipmentCount = rows.reduce((sum, row) => sum + row.quantity, 0);
  const technicians = state.technicians === 1 ? 1 : 2;
  const baseHours = rows.reduce((sum, row) => sum + row.quantity * service.hours *
    EQUIPMENT_OPTIONS.find(item => item.id === row.type)!.factor *
    CAPACITY_OPTIONS.find(item => item.id === row.capacity)!.factor, 0);
  const hours = baseHours * (technicians === 1 ? r.singleTechnicianFactor : 1);
  const days = equipmentCount ? Math.max(0.5, Math.ceil(hours / 8 * 2) / 2) : 0;
  const billedHours = equipmentCount ? Math.max(hours, r.minimumHours) : 0;
  const supportHours = equipmentCount ? Math.max(days * 8, r.minimumHours) : 0;
  const people = technicians + Number(state.siso) + Number(state.heights);
  const rentalDays = Math.ceil(days);
  const nights = zone.overnight && equipmentCount ? Math.ceil(days) + Math.max(0, Math.ceil(zone.travel) - 1) : 0;
  const parts: [string, number][] = equipmentCount ? [
    ['Mano de obra técnica', billedHours * technicians * r.technicianHour * schedule.factor + (zone.mobility ? r.mobility : 0)],
    ['Coordinador SISO', Number(state.siso) * supportHours / 8 * r.sisoDay * schedule.factor],
    ['Coordinador de alturas', Number(state.heights) * supportHours * r.heightsHour * schedule.factor],
    ['Desplazamiento del personal', zone.travel * r.travelFactor * (8 * (technicians * r.technicianHour + Number(state.heights) * r.heightsHour) + Number(state.siso) * r.sisoDay)],
    ['Vehículo y herramienta', state.vehicle ? (days + zone.travel) * r.vehicleDay : 0],
    ['Viáticos y hospedaje', nights * people * r.overnightPerson],
    ['Consumibles', equipmentCount * r.consumables[service.id]],
    ['Equipos de apoyo', rentalDays * (state.scaffold * r.scaffoldDay + state.scissor * r.scissorDay + state.manlift * r.manliftDay) + state.scissor * r.scissorTransport + state.manlift * r.manliftTransport],
  ] : [];
  const breakdown = parts.filter(([, value]) => value > 0);
  const total = breakdown.reduce((sum, [, value]) => sum + value, 0);
  const pending = [state.heights && !r.heightsHour && 'coordinador de alturas', state.scaffold && !r.scaffoldDay && 'andamios'].filter(Boolean) as string[];
  const notes: string[] = [];
  if (pending.length) notes.push(`No incluido en el rango: ${pending.join(' y ')}. Su valor se confirma al cotizar.`);
  if (equipmentCount && hours < r.minimumHours) notes.push(`Aplica un mínimo facturable de ${r.minimumHours} horas por técnico y visita.`);
  if (zone.id === 'nac') notes.push('El desplazamiento a esta ciudad se confirma al cotizar.');
  return {
    service, zone, schedule, rows, equipmentCount, technicians, hours, days, rentalDays,
    breakdown, total, pending, notes,
    low: round(total * (1 - r.lowerMargin)), high: round(total * (1 + r.upperMargin)),
    annualLow: round(total * 3 * (1 - r.lowerMargin)), annualHigh: round(total * 3 * (1 + r.upperMargin)),
  };
}

export interface ContactDetails { company: string; name: string; phone: string; city: string }

export function requestText(state: EstimatorState, contact: ContactDetails) {
  const result = estimate(state);
  if (!result.equipmentCount) return '';
  const support = [state.scaffold && `${state.scaffold} andamio(s) de 6 m`, state.scissor && `${state.scissor} plataforma(s) tipo tijera`, state.manlift && `${state.manlift} manlift`].filter(Boolean).join(', ') || 'Ninguno';
  return [
    'Solicitud de cotización — COLCRANES', '',
    `Servicio: ${result.service.name}`, `Ubicación: ${result.zone.name}`, `Horario: ${result.schedule.name}`,
    `Cuadrilla: ${result.technicians} técnico(s)`, `Coordinador SISO en sitio: ${state.siso ? 'Sí' : 'No'}`,
    `Coordinador de alturas en sitio: ${state.heights ? 'Sí' : 'No'}`, `Equipos de apoyo: ${support}`,
    `Vehículo de COLCRANES: ${state.vehicle ? 'Sí' : 'No'}`, 'Equipos:',
    ...result.rows.map(row => `- ${row.quantity} × ${EQUIPMENT_OPTIONS.find(item => item.id === row.type)!.name}, ${CAPACITY_OPTIONS.find(item => item.id === row.capacity)!.name}`), '',
    `Tiempo estimado en sitio: ${result.days.toLocaleString('es-CO')} jornada(s)`,
    `Rango estimado (COP, antes de IVA): ${money(result.low)} – ${money(result.high)}`,
    ...result.notes, 'No incluye repuestos. Sujeto a confirmación por Presupuestos.', '',
    `Empresa: ${contact.company}`, `Contacto: ${contact.name}`, `Teléfono: ${contact.phone}`, `Ciudad o municipio: ${contact.city}`,
  ].join('\n');
}
