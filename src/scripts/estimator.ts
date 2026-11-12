import { INITIAL_STATE, ESTIMATOR_EMAIL, type EstimatorState, type EquipmentRow } from '../data/estimator';
import { CONTACT } from '../data/site';
import { boundedInteger, estimate, money, requestText } from '../utils/estimator';

export function initEstimator(root: HTMLElement) {
  const find = <T extends HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
  const form = find<HTMLFormElement>('form');
  const rows = find<HTMLDivElement>('[data-rows]');
  const template = rows.firstElementChild!.cloneNode(true) as HTMLElement;
  const controls = find<HTMLFieldSetElement>('[data-controls]');
  const wa = find<HTMLAnchorElement>('[data-whatsapp]');
  const email = find<HTMLAnchorElement>('[data-email]');
  const copy = find<HTMLButtonElement>('[data-copy]');
  const status = find<HTMLParagraphElement>('[data-status]');
  const fallback = find<HTMLTextAreaElement>('[data-fallback]');
  let state: EstimatorState = structuredClone(INITIAL_STATE);
  let message = '';

  function readState() {
    const values = new FormData(form);
    const equipment: EquipmentRow[] = Array.from(rows.querySelectorAll<HTMLElement>('[data-row]')).map(row => {
      const value = (key: string) => row.querySelector<HTMLInputElement | HTMLSelectElement>(`[data-row-key="${key}"]`)!.value;
      return { type: value('type') as EquipmentRow['type'], capacity: value('capacity') as EquipmentRow['capacity'], quantity: boundedInteger(value('quantity'), 0, 99) };
    });
    state = {
      service: values.get('service') as EstimatorState['service'],
      zone: values.get('zone') as EstimatorState['zone'],
      schedule: values.get('schedule') as EstimatorState['schedule'],
      technicians: values.get('technicians') === '1' ? 1 : 2,
      siso: values.has('siso'), heights: values.has('heights'), vehicle: values.has('vehicle'),
      scaffold: boundedInteger(String(values.get('scaffold')), 0, 20),
      scissor: boundedInteger(String(values.get('scissor')), 0, 10),
      manlift: boundedInteger(String(values.get('manlift')), 0, 10), rows: equipment,
    };
    return {
      company: String(values.get('company') || '').trim(), name: String(values.get('contactName') || '').trim(),
      phone: String(values.get('phone') || '').trim(), city: String(values.get('city') || '').trim(),
    };
  }

  function updateLinks() {
    const contact = readState();
    const valid = form.checkValidity() && state.rows.some(row => row.quantity > 0);
    message = valid ? requestText(state, contact) : '';
    for (const anchor of [wa, email]) {
      if (valid) anchor.removeAttribute('aria-disabled');
      else { anchor.setAttribute('aria-disabled', 'true'); anchor.removeAttribute('href'); }
    }
    copy.disabled = !valid;
    if (valid) {
      wa.href = `${CONTACT.whatsappUrl}?text=${encodeURIComponent(message)}`;
      wa.target = '_blank';
      wa.rel = 'noopener noreferrer';
      email.href = `mailto:${ESTIMATOR_EMAIL}?subject=${encodeURIComponent('Solicitud de cotización - estimador web')}&body=${encodeURIComponent(message)}`;
    }
    status.textContent = '';
    fallback.hidden = true;
  }

  function renderPairs(target: HTMLElement, pairs: [string, string][]) {
    target.replaceChildren(...pairs.flatMap(([label, value]) => {
      const dt = document.createElement('dt'); dt.textContent = label;
      const dd = document.createElement('dd'); dd.textContent = value;
      return [dt, dd];
    }));
  }

  function update() {
    updateLinks();
    const result = estimate(state);
    const range = find('[data-range]');
    if (!form.checkValidity() || !result.equipmentCount) {
      range.textContent = 'Revise las cantidades';
      find('[data-scope]').textContent = 'Use cantidades enteras dentro de los límites indicados.';
      find('[data-facts]').replaceChildren();
      find('[data-breakdown]').replaceChildren();
      find('[data-notes]').replaceChildren();
      find('[data-annual]').textContent = '';
      return;
    }
    const high = document.createElement('span'); high.textContent = `a ${money(result.high)}`;
    range.replaceChildren(document.createTextNode(money(result.low)), high);
    find('[data-scope]').textContent = `${result.service.name} · ${result.equipmentCount} equipo${result.equipmentCount === 1 ? '' : 's'}`;
    const facts: [string, string][] = [
      ['Tiempo en sitio', `${result.days.toLocaleString('es-CO')} jornada${result.days === 1 ? '' : 's'}`],
      ['Personal técnico', `${result.technicians} técnico${result.technicians === 1 ? '' : 's'}`],
    ];
    if (state.siso || state.heights) facts.push(['Personal de apoyo', [state.siso && 'SISO', state.heights && 'Alturas'].filter(Boolean).join(' + ')]);
    if (state.scaffold + state.scissor + state.manlift) facts.push(['Alquiler de equipos', `${result.rentalDays} día(s)`]);
    if (result.zone.travel) facts.push(['Días de viaje', result.zone.travel.toLocaleString('es-CO')]);
    if (result.schedule.factor > 1) facts.push(['Recargo de horario', `× ${result.schedule.factor.toFixed(2).replace('.', ',')}`]);
    renderPairs(find('[data-facts]'), facts);
    renderPairs(find('[data-breakdown]'), result.breakdown.map(([label, value]) => [label, money(value)]));
    find('[data-notes]').replaceChildren(...result.notes.map(note => {
      const p = document.createElement('p'); p.textContent = note; return p;
    }));
    find('[data-annual]').textContent = result.service.routine
      ? `Como referencia, 3 visitas al año (cada 4 meses): ${money(result.annualLow)} a ${money(result.annualHigh)}, antes de IVA. La frecuencia se define según el uso del equipo.`
      : 'La frecuencia de inspección se define según el uso y las condiciones del equipo.';
  }

  function updateRows() {
    const groups = rows.querySelectorAll<HTMLElement>('[data-row]');
    groups.forEach((row, index) => {
      const remove = row.querySelector<HTMLButtonElement>('[data-remove]')!;
      remove.disabled = groups.length === 1;
      remove.setAttribute('aria-label', `Quitar grupo de equipos ${index + 1}`);
    });
  }

  controls.disabled = false;
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  // Normalize on leaving a numeric field, not while the person is typing.
  form.addEventListener('focusout', event => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || input.type !== 'number') return;
    input.value = String(boundedInteger(input.value, Number(input.min), Number(input.max)));
    update();
  });
  find('[data-add]').addEventListener('click', () => {
    const row = template.cloneNode(true) as HTMLElement;
    rows.append(row);
    updateRows(); update();
    row.querySelector('select')?.focus();
  });
  rows.addEventListener('click', event => {
    const button = event.target instanceof Element ? event.target.closest<HTMLButtonElement>('[data-remove]') : null;
    if (!button || button.disabled) return;
    const row = button.closest<HTMLElement>('[data-row]')!;
    const neighbor = (row.nextElementSibling || row.previousElementSibling) as HTMLElement;
    row.remove(); updateRows(); update();
    neighbor?.querySelector('select')?.focus();
  });
  copy.addEventListener('click', async () => {
    if (!message) return;
    try {
      await navigator.clipboard.writeText(message);
      status.textContent = 'Resumen copiado. Puede pegarlo en su mensaje.';
    } catch {
      fallback.value = message; fallback.hidden = false;
      status.textContent = 'Seleccione y copie el resumen que aparece a continuación.';
      fallback.focus(); fallback.select();
    }
  });
  update();
}
