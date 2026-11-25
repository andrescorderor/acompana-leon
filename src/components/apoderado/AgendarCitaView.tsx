import { useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarCheck, Car, Check, Star } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { LEON_DESTINATIONS } from '../../data/seedData';
import type { ServiceModality, TransportMode } from '../../types';
import { BadgeRow } from '../common/BadgeRow';

interface AgendarCitaViewProps {
  onBooked: () => void;
}

const TRANSPORT_OPTIONS: { value: TransportMode; short: string }[] = [
  { value: 'Vehículo propio del acompañante', short: 'Auto acompañante' },
  { value: 'Taxi / App de plataforma', short: 'Taxi / App' },
  { value: 'Vehículo familiar', short: 'Auto familiar' },
  { value: 'A pie / cercano', short: 'A pie' },
];

export function AgendarCitaView({ onBooked }: AgendarCitaViewProps) {
  const { people, companions, plan, scheduleAppointment } = useAppState();
  const approvedCompanions = companions.filter((c) => c.status === 'approved');
  const remainingCredits = Math.max(0, plan.totalCredits - plan.usedCredits);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [personId, setPersonId] = useState(people[0]?.id ?? '');
  const [bookingType, setBookingType] = useState<'plan' | 'single'>(remainingCredits > 0 ? 'plan' : 'single');
  const [modality, setModality] = useState<ServiceModality>('asistida');
  const [destinationName, setDestinationName] = useState(LEON_DESTINATIONS[0].name);
  const [destinationZone, setDestinationZone] = useState(LEON_DESTINATIONS[0].zone);
  const [purpose, setPurpose] = useState(LEON_DESTINATIONS[0].type);
  const [scheduledDate, setScheduledDate] = useState('2026-11-26');
  const [scheduledTime, setScheduledTime] = useState('10:30');
  const [transportMode, setTransportMode] = useState<TransportMode>('Vehículo propio del acompañante');
  const [companionId, setCompanionId] = useState(approvedCompanions[0]?.id ?? '');

  const priceLabel =
    bookingType === 'plan'
      ? `1 crédito ($${plan.pricePerVisitMxn} MXN)`
      : `$${modality === 'asistida' ? 420 : 320} MXN`;

  const handleConfirm = () => {
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
      estimatedHours: 2,
      transportMode,
    });
    onBooked();
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Indicador de pasos */}
      <div className="bg-white rounded-2xl border border-[#E4E1DA] px-4 py-3 flex items-center justify-between">
        <span className="text-sm font-bold text-[#1C2024]">
          {step === 1 ? '¿Para quién es la cita?' : step === 2 ? '¿A dónde y cuándo?' : 'Elige acompañante'}
        </span>
        <span className="text-xs font-mono-code font-bold text-[#244B3E] bg-[#E8F0ED] px-2.5 py-1 rounded-full">
          Paso {step} / 3
        </span>
      </div>

      {/* PASO 1 */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-[#E4E1DA] p-4 space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#555B63]">Familiar</p>
            {people.map((p) => {
              const selected = personId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPersonId(p.id)}
                  className={`w-full min-h-14 text-left rounded-2xl border p-3.5 flex items-center justify-between transition-all ${
                    selected ? 'border-[#244B3E] bg-[#E8F0ED]/60' : 'border-[#E4E1DA]'
                  }`}
                >
                  <div>
                    <p className="text-base font-bold text-[#1C2024]">{p.fullName}</p>
                    <p className="text-xs text-[#555B63]">
                      {p.neighborhood} · {p.mobilityAids.join(', ')}
                    </p>
                  </div>
                  {selected && (
                    <span className="w-6 h-6 rounded-full bg-[#244B3E] text-white flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="bg-white rounded-3xl border border-[#E4E1DA] p-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#555B63]">Forma de pago</p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                disabled={remainingCredits === 0}
                onClick={() => setBookingType('plan')}
                className={`min-h-16 rounded-2xl border p-3 text-left transition-all disabled:opacity-40 ${
                  bookingType === 'plan' ? 'border-[#244B3E] bg-[#E8F0ED]/60' : 'border-[#E4E1DA]'
                }`}
              >
                <span className="block text-sm font-bold text-[#1C2024]">Usar mi Plan</span>
                <span className="block text-xs text-[#244B3E] font-semibold">
                  {remainingCredits} disponibles
                </span>
              </button>

              <button
                type="button"
                onClick={() => setBookingType('single')}
                className={`min-h-16 rounded-2xl border p-3 text-left transition-all ${
                  bookingType === 'single' ? 'border-[#244B3E] bg-[#E8F0ED]/60' : 'border-[#E4E1DA]'
                }`}
              >
                <span className="block text-sm font-bold text-[#1C2024]">Cita Única</span>
                <span className="block text-xs text-[#555B63]">Desde $320 MXN</span>
              </button>
            </div>

            <p className="text-xs font-bold uppercase tracking-wider text-[#555B63] pt-1">Tipo de apoyo</p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setModality('simple')}
                className={`min-h-16 rounded-2xl border p-3 text-left transition-all ${
                  modality === 'simple' ? 'border-[#244B3E] bg-[#E8F0ED]/60' : 'border-[#E4E1DA]'
                }`}
              >
                <span className="block text-sm font-bold text-[#1C2024]">Simple</span>
                <span className="block text-xs text-[#555B63]">Compañía o mandado</span>
              </button>

              <button
                type="button"
                onClick={() => setModality('asistida')}
                className={`min-h-16 rounded-2xl border p-3 text-left transition-all ${
                  modality === 'asistida' ? 'border-[#244B3E] bg-[#E8F0ED]/60' : 'border-[#E4E1DA]'
                }`}
              >
                <span className="block text-sm font-bold text-[#1C2024]">Asistido</span>
                <span className="block text-xs text-[#244B3E] font-semibold">Citas y trámites</span>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full min-h-13 rounded-2xl bg-[#244B3E] text-white text-base font-bold flex items-center justify-center gap-2"
          >
            <span>Continuar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* PASO 2 */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-[#E4E1DA] p-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#555B63]">Destinos frecuentes</p>
            <div className="flex flex-wrap gap-2">
              {LEON_DESTINATIONS.slice(0, 5).map((d) => (
                <button
                  key={d.name}
                  type="button"
                  onClick={() => {
                    setDestinationName(d.name);
                    setDestinationZone(d.zone);
                    setPurpose(d.type);
                  }}
                  className={`min-h-10 rounded-full px-3.5 text-xs font-semibold border transition-colors ${
                    destinationName === d.name
                      ? 'bg-[#244B3E] text-white border-[#244B3E]'
                      : 'bg-[#F8F6F2] text-[#1C2024] border-[#E4E1DA]'
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#555B63] mb-1">Lugar de destino</label>
              <input
                value={destinationName}
                onChange={(e) => setDestinationName(e.target.value)}
                className="w-full min-h-12 rounded-2xl border border-[#E4E1DA] px-3.5 text-sm bg-[#F8F6F2]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#555B63] mb-1">Motivo breve</label>
              <input
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full min-h-12 rounded-2xl border border-[#E4E1DA] px-3.5 text-sm bg-[#F8F6F2]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-[#555B63] mb-1">Fecha</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full min-h-12 rounded-2xl border border-[#E4E1DA] px-3 text-sm bg-[#F8F6F2]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#555B63] mb-1">Hora</label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full min-h-12 rounded-2xl border border-[#E4E1DA] px-3 text-sm bg-[#F8F6F2]"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#E4E1DA] p-4 space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#555B63]">¿Cómo se trasladan?</p>
            <div className="grid grid-cols-2 gap-2">
              {TRANSPORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTransportMode(opt.value)}
                  className={`min-h-12 rounded-2xl border px-3 py-2 text-xs font-bold flex items-center gap-1.5 transition-all ${
                    transportMode === opt.value
                      ? 'border-[#244B3E] bg-[#E8F0ED]/60 text-[#244B3E]'
                      : 'border-[#E4E1DA] text-[#1C2024]'
                  }`}
                >
                  <Car className="w-4 h-4 shrink-0" />
                  <span>{opt.short}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="min-h-13 rounded-2xl border border-[#E4E1DA] bg-white text-sm font-bold flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Atrás
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="min-h-13 rounded-2xl bg-[#244B3E] text-white text-sm font-bold flex items-center justify-center gap-1.5"
            >
              Acompañante
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* PASO 3 */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="space-y-3">
            {approvedCompanions.map((comp) => {
              const selected = companionId === comp.id;
              return (
                <button
                  key={comp.id}
                  type="button"
                  onClick={() => setCompanionId(comp.id)}
                  className={`w-full text-left rounded-3xl border p-4 space-y-2.5 transition-all ${
                    selected
                      ? 'bg-[#E8F0ED]/60 border-[#244B3E] ring-1 ring-[#244B3E]/30'
                      : 'bg-white border-[#E4E1DA]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-[#244B3E] text-white font-bold text-sm flex items-center justify-center shrink-0">
                        {comp.initials}
                      </div>
                      <div>
                        <p className="text-base font-bold text-[#1C2024]">{comp.fullName}</p>
                        <p className="text-xs text-[#555B63]">{comp.zone}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {comp.rating}
                    </span>
                  </div>

                  <BadgeRow badges={comp.badges} compact />

                  <p className="text-xs text-[#4B4F56]">
                    {comp.hasOwnCar ? `🚗 ${comp.carModel}` : '🚶 Sin auto propio (taxi / familiar)'} · {comp.completedServices} citas
                  </p>
                </button>
              );
            })}
          </div>

          <div className="bg-white rounded-3xl border border-[#E4E1DA] p-4 flex items-center justify-between text-sm">
            <span className="text-[#555B63]">Total estimado:</span>
            <strong className="text-base text-[#244B3E]">{priceLabel}</strong>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="min-h-13 rounded-2xl border border-[#E4E1DA] bg-white text-sm font-bold flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Atrás
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="col-span-2 min-h-13 rounded-2xl bg-[#C87D4B] hover:bg-[#b56d3d] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm"
            >
              <CalendarCheck className="w-4 h-4" />
              Confirmar Cita
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
