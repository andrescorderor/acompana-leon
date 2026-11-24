import { useState } from 'react';
import {
  CheckCircle2,
  ClipboardCheck,
  KeyRound,
  MapPin,
  MessageSquare,
  Navigation,
  Play,
  Send,
  ShieldAlert,
  X,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { MILESTONE_LABELS } from '../../data/seedData';
import { BadgeRow } from '../common/BadgeRow';

interface SeguimientoVivoViewProps {
  onOpenEmergency: () => void;
}

const PIN_POSITIONS: Record<number, { x: number; y: number; label: string }> = {
  0: { x: 88, y: 175, label: 'Acompañante en ruta a domicilio' },
  1: { x: 165, y: 145, label: 'Av. Panorama / Blvd. Campestre' },
  2: { x: 270, y: 78, label: 'En destino (Hospital / Trámite)' },
  3: { x: 175, y: 122, label: 'De regreso por Blvd. López Mateos' },
  4: { x: 112, y: 168, label: 'Entregado en domicilio con acta' },
};

export function SeguimientoVivoView({ onOpenEmergency }: SeguimientoVivoViewProps) {
  const { people, companions, appointments, advanceMilestone, addLogEntry, completeDeliveryAct } =
    useAppState();

  const activeAppointments = appointments.filter((a) => a.status === 'active');
  const [selectedId, setSelectedId] = useState(activeAppointments[0]?.id ?? appointments[0]?.id ?? '');
  const current = appointments.find((a) => a.id === selectedId) ?? appointments[0];

  const [noteInput, setNoteInput] = useState('');
  const [actModalOpen, setActModalOpen] = useState(false);
  const [receivedBy, setReceivedBy] = useState('');
  const [apparentCondition, setApparentCondition] = useState('Tranquilo, estable y de buen ánimo');
  const [observations, setObservations] = useState('');

  if (!current) {
    return (
      <div className="bg-white rounded-2xl border border-[#E6E3DE] p-8 text-center text-sm text-[#6B7078]">
        No hay citas registradas para mostrar seguimiento.
      </div>
    );
  }

  const person = people.find((p) => p.id === current.personId);
  const companion = companions.find((c) => c.id === current.companionId);
  const coords = PIN_POSITIONS[current.milestone];

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    addLogEntry(current.id, 'Mariana López (Apoderada)', noteInput);
    setNoteInput('');
  };

  const handleCompleteDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    completeDeliveryAct(current.id, {
      deliveredAt: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) + ' h',
      receivedBy: receivedBy || person?.authorizedReceivers[0] || 'Familiar autorizado',
      apparentCondition,
      belongingsVerified: true,
      observations,
    });
    setActModalOpen(false);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Selector si hay más de una cita */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#33363B]">Seguimiento en Vivo y Bitácora</h2>
          <p className="text-xs text-[#6B7078]">
            Hitos con PIN de seguridad + mapa en tiempo real + notificaciones automáticas por WhatsApp.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={current.id}
            onChange={(e) => setSelectedId(e.target.value)}
            className="rounded-xl border border-[#E6E3DE] bg-white px-3 py-2 text-xs font-semibold text-[#33363B]"
          >
            {appointments.map((apt) => {
              const p = people.find((x) => x.id === apt.personId);
              return (
                <option key={apt.id} value={apt.id}>
                  {apt.status === 'active' ? '🟢 EN CURSO: ' : '✅ '}
                  {p?.fullName.split(' ').slice(0, 2).join(' ')} → {apt.destinationName}
                </option>
              );
            })}
          </select>

          <button
            type="button"
            onClick={onOpenEmergency}
            className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 text-xs font-bold transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Protocolo 911
          </button>
        </div>
      </div>

      {/* Timeline de 5 Hitos + PIN */}
      <div className="bg-white rounded-2xl border border-[#E6E3DE] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E6E3DE]">
          <div>
            <p className="text-xs font-mono-code uppercase tracking-wider text-[#2E5A4C]">
              {person?.fullName} · {current.scheduledDate} {current.scheduledTime} h
            </p>
            <h3 className="text-lg font-bold text-[#33363B]">
              {current.destinationName} — {current.purpose}
            </h3>
            <p className="text-xs text-[#6B7078] mt-0.5">
              Modalidad: <strong className="capitalize">{current.modality}</strong> · Traslado:{' '}
              <strong>{current.transportMode}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#F8F6F2] border border-[#E6E3DE] px-4 py-2 text-center">
              <span className="text-[10px] font-mono-code uppercase tracking-wider text-[#6B7078] flex items-center gap-1 justify-center">
                <KeyRound className="w-3 h-3 text-[#C87D4B]" /> PIN Recogida
              </span>
              <span className="font-mono-code text-xl font-bold tracking-widest text-[#2E5A4C]">
                {current.pinCode}
              </span>
            </div>

            {current.status === 'active' && current.milestone < 3 && (
              <button
                type="button"
                onClick={() => advanceMilestone(current.id)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#2E5A4C] hover:bg-[#23473b] text-white px-4 py-2.5 text-xs font-semibold transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                Simular siguiente hito
              </button>
            )}

            {current.status === 'active' && current.milestone === 3 && (
              <button
                type="button"
                onClick={() => {
                  setReceivedBy(person?.authorizedReceivers[0] ?? '');
                  setActModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#C87D4B] hover:bg-[#b56d3d] text-white px-4 py-2.5 text-xs font-semibold transition-colors"
              >
                <ClipboardCheck className="w-4 h-4" />
                Cerrar Acta de Entrega
              </button>
            )}
          </div>
        </div>

        {/* Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {MILESTONE_LABELS.map((label, idx) => {
            const done = idx <= current.milestone;
            const isCurrent = idx === current.milestone && current.status === 'active';
            return (
              <div
                key={label}
                className={`rounded-xl border p-2.5 text-xs transition-all ${
                  isCurrent
                    ? 'border-[#2E5A4C] bg-[#E8F0ED] text-[#2E5A4C] font-bold'
                    : done
                      ? 'border-emerald-200 bg-emerald-50/70 text-emerald-800 font-medium'
                      : 'border-[#E6E3DE] bg-[#F8F6F2] text-[#6B7078]'
                }`}
              >
                <span className="block font-mono-code text-[10px] opacity-75">HITO 0{idx + 1}</span>
                <span className="block mt-0.5 leading-snug">{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mapa Visual León + Feed WhatsApp + Bitácora */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Mapa SVG León, Gto. */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-[#E6E3DE] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#33363B] flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-[#2E5A4C]" />
              Mapa de Recorrido en Vivo · León, Gto.
            </h3>
            <span className="text-[11px] font-mono-code text-[#2E5A4C] bg-[#E8F0ED] px-2.5 py-0.5 rounded-full">
              {coords.label}
            </span>
          </div>

          <div className="rounded-xl border border-[#E6E3DE] bg-[#F4F1EA] overflow-hidden relative">
            <svg viewBox="0 0 360 220" className="w-full h-56 block">
              {/* Retícula urbana sutil */}
              <defs>
                <pattern id="gridLeon" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#E5E0D6" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="360" height="220" fill="url(#gridLeon)" />

              {/* Vialidades principales de León */}
              <path d="M 20 190 Q 150 155 340 120" stroke="#DDD6C7" strokeWidth="8" fill="none" strokeLinecap="round" />
              <path d="M 55 30 Q 170 85 320 65" stroke="#DDD6C7" strokeWidth="6" fill="none" strokeLinecap="round" />
              <path d="M 110 15 L 145 205" stroke="#DDD6C7" strokeWidth="5" fill="none" strokeLinecap="round" />

              <text x="210" y="156" fontSize="8" fill="#7B7E85" fontFamily="JetBrains Mono">
                Blvd. Adolfo López Mateos
              </text>
              <text x="155" y="52" fontSize="8" fill="#7B7E85" fontFamily="JetBrains Mono">
                Blvd. Campestre / Cerro Gordo
              </text>

              {/* Ruta trazada */}
              <path
                d="M 112 168 Q 170 135 270 78"
                stroke="#2E5A4C"
                strokeWidth="3"
                strokeDasharray="6 4"
                fill="none"
              />

              {/* Domicilio origen */}
              <circle cx="112" cy="168" r="7" fill="#33363B" />
              <text x="48" y="188" fontSize="9" fontWeight="600" fill="#33363B">
                Domicilio ({person?.neighborhood})
              </text>

              {/* Destino */}
              <circle cx="270" cy="78" r="7" fill="#C87D4B" />
              <text x="215" y="100" fontSize="9" fontWeight="600" fill="#9A5629">
                {current.destinationName.slice(0, 22)}
              </text>

              {/* Marcador en vivo */}
              <g style={{ transition: 'all 0.6s ease' }}>
                <circle cx={coords.x} cy={coords.y} r="15" fill="#2E5A4C" opacity="0.22" className="animate-pulse-soft" />
                <circle cx={coords.x} cy={coords.y} r="7" fill="#2E5A4C" stroke="#FFFFFF" strokeWidth="2.5" />
              </g>
            </svg>
          </div>

          {companion && (
            <div className="rounded-xl bg-[#F8F6F2] border border-[#E6E3DE] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#2E5A4C] text-white font-bold text-xs flex items-center justify-center">
                  {companion.initials}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#33363B]">{companion.fullName}</p>
                  <p className="text-[11px] text-[#6B7078]">{companion.phone}</p>
                </div>
              </div>
              <BadgeRow badges={companion.badges} compact />
            </div>
          )}
        </div>

        {/* WhatsApp + Bitácora */}
        <div className="lg:col-span-6 space-y-5">
          {/* Simulador WhatsApp */}
          <div className="bg-white rounded-2xl border border-[#E6E3DE] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#33363B] flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-700" />
                Notificaciones Automáticas por WhatsApp
              </h3>
              <span className="text-[11px] text-emerald-700 font-medium">Canal Familiar Activo</span>
            </div>

            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {current.whatsappFeed.length === 0 ? (
                <p className="text-xs text-[#6B7078]">Sin mensajes registrados en esta cita.</p>
              ) : (
                current.whatsappFeed.map((w) => (
                  <div
                    key={w.id}
                    className="rounded-xl bg-[#E7F6EC] border border-emerald-200 px-3.5 py-2.5 text-xs text-[#1F3F35]"
                  >
                    <div className="flex justify-between text-[10px] font-mono-code text-emerald-800/75 mb-0.5">
                      <span>{w.recipient}</span>
                      <span>{w.timestamp} h</span>
                    </div>
                    <p className="leading-relaxed">{w.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bitácora en tiempo real */}
          <div className="bg-white rounded-2xl border border-[#E6E3DE] p-5 space-y-3">
            <h3 className="text-sm font-bold text-[#33363B] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#C87D4B]" />
              Bitácora Trazable del Servicio
            </h3>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {current.logs.map((log) => (
                <div key={log.id} className="flex gap-2.5 text-xs border-b border-[#F1EFEA] pb-2 last:border-none">
                  <span className="font-mono-code text-[11px] text-[#6B7078] shrink-0">{log.timestamp}</span>
                  <div>
                    <span className="font-semibold text-[#33363B]">{log.author}: </span>
                    <span className="text-[#4B4F56]">{log.message}</span>
                  </div>
                </div>
              ))}
            </div>

            {current.status === 'active' && (
              <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
                <input
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Enviar indicación al acompañante..."
                  className="flex-1 rounded-xl border border-[#E6E3DE] px-3 py-2 text-xs focus:border-[#2E5A4C] focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 rounded-xl bg-[#2E5A4C] text-white px-3.5 py-2 text-xs font-semibold hover:bg-[#23473b]"
                >
                  <Send className="w-3.5 h-3.5" />
                  Enviar
                </button>
              </form>
            )}

            {current.deliveryAct && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-950 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  Acta de Entrega Validada ({current.deliveryAct.deliveredAt})
                </p>
                <p>
                  <strong>Recibió:</strong> {current.deliveryAct.receivedBy} ·{' '}
                  <strong>Estado:</strong> {current.deliveryAct.apparentCondition}
                </p>
                {current.deliveryAct.observations && <p>{current.deliveryAct.observations}</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Acta de Entrega */}
      {actModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#E6E3DE] overflow-hidden animate-fade-in">
            <div className="px-5 py-4 bg-[#2E5A4C] text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">Registrar Acta de Entrega Segura</h3>
              <button type="button" onClick={() => setActModalOpen(false)} className="p-1 rounded hover:bg-white/15">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCompleteDelivery} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#33363B] mb-1">
                  ¿Quién recibe al adulto mayor? *
                </label>
                <select
                  value={receivedBy}
                  onChange={(e) => setReceivedBy(e.target.value)}
                  className="w-full rounded-xl border border-[#E6E3DE] px-3 py-2 text-sm bg-white"
                >
                  {(person?.authorizedReceivers ?? ['Familiar autorizado']).map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#33363B] mb-1">Condición aparente *</label>
                <input
                  required
                  value={apparentCondition}
                  onChange={(e) => setApparentCondition(e.target.value)}
                  className="w-full rounded-xl border border-[#E6E3DE] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#33363B] mb-1">
                  Observaciones y pertenencias (bastón, carpeta, recetas)
                </label>
                <textarea
                  rows={2}
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Ej. Regresa con receta médica y estudios completos."
                  className="w-full rounded-xl border border-[#E6E3DE] px-3 py-2 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActModalOpen(false)}
                  className="rounded-xl border border-[#E6E3DE] px-4 py-2 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#2E5A4C] text-white px-4 py-2 text-xs font-semibold"
                >
                  Confirmar Entrega y Notificar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
