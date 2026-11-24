import { useState } from 'react';
import { CalendarCheck, Car, CheckCircle2, Clock, MapPin, ShieldCheck, Star } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { LEON_DESTINATIONS } from '../../data/seedData';
import type { ServiceModality, TransportMode } from '../../types';
import { BadgeRow } from '../common/BadgeRow';

interface AgendarCitaViewProps {
  onBooked: () => void;
}

const TRANSPORT_OPTIONS: { value: TransportMode; desc: string }[] = [
  { value: 'Vehículo propio del acompañante', desc: 'El acompañante certificado coordina el traslado en su unidad' },
  { value: 'Taxi / App de plataforma', desc: 'Acompañante aborda y asiste junto con el adulto mayor en taxi/app' },
  { value: 'Vehículo familiar', desc: 'La familia traslada o presta unidad y el acompañante asiste todo el recorrido' },
  { value: 'A pie / cercano', desc: 'Trámites, paseos o citas cercanas dentro de la misma zona' },
];

export function AgendarCitaView({ onBooked }: AgendarCitaViewProps) {
  const { people, companions, plan, scheduleAppointment } = useAppState();
  const approvedCompanions = companions.filter((c) => c.status === 'approved');
  const remainingCredits = Math.max(0, plan.totalCredits - plan.usedCredits);

  const [personId, setPersonId] = useState(people[0]?.id ?? '');
  const [bookingType, setBookingType] = useState<'plan' | 'single'>(remainingCredits > 0 ? 'plan' : 'single');
  const [modality, setModality] = useState<ServiceModality>('asistida');
  const [destinationName, setDestinationName] = useState(LEON_DESTINATIONS[0].name);
  const [destinationZone, setDestinationZone] = useState(LEON_DESTINATIONS[0].zone);
  const [purpose, setPurpose] = useState('Consulta médica y entrega de resultados');
  const [scheduledDate, setScheduledDate] = useState('2026-11-26');
  const [scheduledTime, setScheduledTime] = useState('10:30');
  const [estimatedHours, setEstimatedHours] = useState(2);
  const [transportMode, setTransportMode] = useState<TransportMode>('Vehículo propio del acompañante');
  const [companionId, setCompanionId] = useState(approvedCompanions[0]?.id ?? '');

  const estimatedPrice =
    bookingType === 'plan'
      ? `${plan.pricePerVisitMxn} MXN (1 crédito de tu ${plan.name})`
      : `${modality === 'asistida' ? 420 : 320} MXN (Cita única)`;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personId || !companionId) return;
    scheduleAppointment({
      personId,
      companionId,
      bookingType,
      modality,
      purpose,
      destinationName,
      destinationZone,
      scheduledDate,
      scheduledTime,
      estimatedHours,
      transportMode,
    });
    onBooked();
  };

  return (
    <form onSubmit={handleConfirm} className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-[#33363B]">Agendar Nuevo Acompañamiento</h2>
          <p className="text-xs text-[#6B7078]">
            Elige a tu familiar, modalidad de cita, traslado flexible y al acompañante validado ideal en León.
          </p>
        </div>
        <div className="rounded-xl bg-[#E8F0ED] border border-[#2E5A4C]/20 px-3.5 py-2 text-xs font-semibold text-[#2E5A4C]">
          Créditos disponibles en plan: {remainingCredits} / {plan.totalCredits}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna izquierda: Pasos 1 y 2 */}
        <div className="lg:col-span-7 space-y-5">
          {/* Paso 1 */}
          <div className="bg-white rounded-2xl border border-[#E6E3DE] p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#2E5A4C] text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h3 className="text-sm font-bold text-[#33363B]">Persona Asistida y Modalidad de Contratación</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#33363B] mb-1.5">¿A quién acompañaremos?</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {people.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPersonId(p.id)}
                    className={`text-left rounded-xl border p-3 transition-all ${
                      personId === p.id
                        ? 'border-[#2E5A4C] bg-[#E8F0ED]/50'
                        : 'border-[#E6E3DE] hover:bg-[#F8F6F2]'
                    }`}
                  >
                    <p className="text-sm font-bold text-[#33363B]">{p.fullName}</p>
                    <p className="text-[11px] text-[#6B7078] mt-0.5">
                      {p.neighborhood} · {p.mobilityAids.join(', ')}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#33363B] mb-1.5">Forma de contratación</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={remainingCredits === 0}
                    onClick={() => setBookingType('plan')}
                    className={`rounded-xl border p-2.5 text-left text-xs transition-all ${
                      bookingType === 'plan'
                        ? 'border-[#2E5A4C] bg-[#E8F0ED]/60 font-semibold'
                        : 'border-[#E6E3DE]'
                    } disabled:opacity-40`}
                  >
                    <span className="block text-[#33363B]">Usar Plan</span>
                    <span className="block text-[11px] text-[#2E5A4C]">${plan.pricePerVisitMxn}/cita</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingType('single')}
                    className={`rounded-xl border p-2.5 text-left text-xs transition-all ${
                      bookingType === 'single'
                        ? 'border-[#2E5A4C] bg-[#E8F0ED]/60 font-semibold'
                        : 'border-[#E6E3DE]'
                    }`}
                  >
                    <span className="block text-[#33363B]">Cita Única</span>
                    <span className="block text-[11px] text-[#6B7078]">Desde $320 MXN</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#33363B] mb-1.5">Nivel de acompañamiento</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setModality('simple')}
                    className={`rounded-xl border p-2.5 text-left text-xs transition-all ${
                      modality === 'simple'
                        ? 'border-[#2E5A4C] bg-[#E8F0ED]/60 font-semibold'
                        : 'border-[#E6E3DE]'
                    }`}
                  >
                    <span className="block text-[#33363B]">Simple</span>
                    <span className="block text-[11px] text-[#6B7078]">Compañía / mandado</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setModality('asistida')}
                    className={`rounded-xl border p-2.5 text-left text-xs transition-all ${
                      modality === 'asistida'
                        ? 'border-[#2E5A4C] bg-[#E8F0ED]/60 font-semibold'
                        : 'border-[#E6E3DE]'
                    }`}
                  >
                    <span className="block text-[#33363B]">Asistido</span>
                    <span className="block text-[11px] text-[#2E5A4C]">Espera + trámites</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Paso 2 */}
          <div className="bg-white rounded-2xl border border-[#E6E3DE] p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#2E5A4C] text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h3 className="text-sm font-bold text-[#33363B]">Destino en León y Traslado Flexible</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#33363B] mb-1.5">Destinos frecuentes en León</label>
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {LEON_DESTINATIONS.slice(0, 5).map((d) => (
                  <button
                    key={d.name}
                    type="button"
                    onClick={() => {
                      setDestinationName(d.name);
                      setDestinationZone(d.zone);
                      setPurpose(d.type);
                    }}
                    className={`rounded-full px-3 py-1 text-[11px] font-medium border transition-colors ${
                      destinationName === d.name
                        ? 'bg-[#2E5A4C] text-white border-[#2E5A4C]'
                        : 'bg-[#F8F6F2] text-[#4B4F56] border-[#E6E3DE] hover:border-[#2E5A4C]'
                    }`}
                  >
                    {d.name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#33363B] mb-1">Lugar de destino *</label>
                  <input
                    required
                    value={destinationName}
                    onChange={(e) => setDestinationName(e.target.value)}
                    className="w-full rounded-xl border border-[#E6E3DE] px-3 py-2 text-sm focus:border-[#2E5A4C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#33363B] mb-1">Zona / Referencia *</label>
                  <input
                    required
                    value={destinationZone}
                    onChange={(e) => setDestinationZone(e.target.value)}
                    className="w-full rounded-xl border border-[#E6E3DE] px-3 py-2 text-sm focus:border-[#2E5A4C] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#33363B] mb-1">Motivo o gestión a realizar *</label>
              <input
                required
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full rounded-xl border border-[#E6E3DE] px-3 py-2 text-sm focus:border-[#2E5A4C] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#33363B] mb-1">Fecha *</label>
                <input
                  type="date"
                  required
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full rounded-xl border border-[#E6E3DE] px-3 py-2 text-sm focus:border-[#2E5A4C] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#33363B] mb-1">Hora de recogida *</label>
                <input
                  type="time"
                  required
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full rounded-xl border border-[#E6E3DE] px-3 py-2 text-sm focus:border-[#2E5A4C] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#33363B] mb-1">Duración estimada</label>
                <select
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#E6E3DE] px-3 py-2 text-sm focus:border-[#2E5A4C] focus:outline-none bg-white"
                >
                  <option value={1.5}>1.5 horas</option>
                  <option value={2}>2 horas</option>
                  <option value={3}>3 horas</option>
                  <option value={4}>4 horas</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#33363B] mb-1.5">
                Modalidad de traslado (flexible según la cita)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TRANSPORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTransportMode(opt.value)}
                    className={`text-left rounded-xl border p-2.5 transition-all ${
                      transportMode === opt.value
                        ? 'border-[#2E5A4C] bg-[#E8F0ED]/50'
                        : 'border-[#E6E3DE] hover:bg-[#F8F6F2]'
                    }`}
                  >
                    <p className="text-xs font-semibold text-[#33363B] flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-[#2E5A4C]" />
                      {opt.value}
                    </p>
                    <p className="text-[11px] text-[#6B7078] mt-0.5 leading-snug">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha: Paso 3 - Selección de Acompañante + Resumen */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-[#E6E3DE] p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#2E5A4C] text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h3 className="text-sm font-bold text-[#33363B]">Elige Acompañante Validado</h3>
            </div>

            <div className="space-y-3">
              {approvedCompanions.map((comp) => {
                const needsCarWarning =
                  transportMode === 'Vehículo propio del acompañante' && !comp.hasOwnCar;
                return (
                  <button
                    key={comp.id}
                    type="button"
                    onClick={() => setCompanionId(comp.id)}
                    className={`w-full text-left rounded-2xl border p-4 transition-all ${
                      companionId === comp.id
                        ? 'border-[#2E5A4C] bg-[#E8F0ED]/45 ring-1 ring-[#2E5A4C]/30'
                        : 'border-[#E6E3DE] hover:bg-[#F8F6F2]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#2E5A4C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {comp.initials}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#33363B]">{comp.fullName}</p>
                          <p className="text-[11px] text-[#6B7078] flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {comp.zone}
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {comp.rating}
                      </span>
                    </div>

                    <p className="text-xs text-[#4B4F56] mt-2 leading-relaxed">{comp.bio}</p>

                    <div className="mt-2.5">
                      <BadgeRow badges={comp.badges} compact />
                    </div>

                    <div className="mt-2 text-[11px] text-[#6B7078] flex items-center justify-between">
                      <span>{comp.hasOwnCar ? `🚗 ${comp.carModel}` : '🚶 Traslado en taxi / familiar'}</span>
                      <span>{comp.completedServices} citas</span>
                    </div>

                    {needsCarWarning && (
                      <p className="mt-2 text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1">
                        Nota: Este acompañante opera sin auto propio; cambiará a Taxi/App o vehículo familiar.
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl bg-[#33363B] text-white p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-300">
              <span>Resumen de Reservación</span>
              <span className="inline-flex items-center gap-1 text-emerald-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> PIN automático + WhatsApp
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">Destino:</span>
                <span className="font-semibold text-right">{destinationName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Horario:</span>
                <span className="font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {scheduledDate} · {scheduledTime} h
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Inversión:</span>
                <span className="font-bold text-emerald-300">{estimatedPrice}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#C87D4B] hover:bg-[#b56d3d] text-white py-3 px-4 text-sm font-bold transition-colors"
            >
              <CalendarCheck className="w-4 h-4" />
              Confirmar Cita y Generar PIN
            </button>
            <p className="text-[11px] text-zinc-400 text-center flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Se enviará confirmación automática al apoderado.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
