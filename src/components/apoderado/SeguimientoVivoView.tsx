import { useState } from 'react';
import { CheckCircle2, ClipboardCheck, KeyRound, MessageSquare, Navigation, Play, Send, X } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { MILESTONE_LABELS } from '../../data/seedData';

interface SeguimientoVivoViewProps {
  onOpenEmergency: () => void;
}

const PIN_POSITIONS: Record<number, { x: number; y: number; label: string }> = {
  0: { x: 88, y: 175, label: 'En camino' },
  1: { x: 165, y: 145, label: 'Blvd. Campestre' },
  2: { x: 270, y: 78, label: 'En destino' },
  3: { x: 175, y: 122, label: 'De regreso' },
  4: { x: 112, y: 168, label: 'En domicilio' },
};

export function SeguimientoVivoView({ onOpenEmergency }: SeguimientoVivoViewProps) {
  const { people, companions, appointments, advanceMilestone, addLogEntry, completeDeliveryAct } =
    useAppState();

  const activeAppointments = appointments.filter((a) => a.status === 'active');
  const [selectedId, setSelectedId] = useState(activeAppointments[0]?.id ?? appointments[0]?.id ?? '');
  const current = appointments.find((a) => a.id === selectedId) ?? appointments[0];

  const [feedTab, setFeedTab] = useState<'whatsapp' | 'bitacora'>('whatsapp');
  const [noteInput, setNoteInput] = useState('');
  const [actModalOpen, setActModalOpen] = useState(false);
  const [receivedBy, setReceivedBy] = useState('');
  const [observations, setObservations] = useState('');

  if (!current) {
    return (
      <div className="bg-white rounded-3xl border border-[#E4E1DA] p-6 text-center text-sm text-[#555B63]">
        No hay citas para mostrar seguimiento.
      </div>
    );
  }

  const person = people.find((p) => p.id === current.personId);
  const companion = companions.find((c) => c.id === current.companionId);
  const coords = PIN_POSITIONS[current.milestone];

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    addLogEntry(current.id, 'Mariana (Familiar)', noteInput);
    setNoteInput('');
  };

  const handleCompleteDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    completeDeliveryAct(current.id, {
      deliveredAt: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) + ' h',
      receivedBy: receivedBy || person?.authorizedReceivers[0] || 'Familiar autorizado',
      apparentCondition: 'Tranquilo y estable',
      belongingsVerified: true,
      observations,
    });
    setActModalOpen(false);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Selector compacto de cita */}
      <select
        value={current.id}
        onChange={(e) => setSelectedId(e.target.value)}
        className="w-full min-h-12 rounded-2xl border border-[#E4E1DA] bg-white px-3.5 text-sm font-bold text-[#1C2024]"
      >
        {appointments.map((apt) => {
          const p = people.find((x) => x.id === apt.personId);
          return (
            <option key={apt.id} value={apt.id}>
              {apt.status === 'active' ? '🟢 ' : '✅ '}
              {p?.fullName.split(' ').slice(0, 2).join(' ')} → {apt.destinationName}
            </option>
          );
        })}
      </select>

      {/* PIN + Estado actual */}
      <div className="bg-white rounded-3xl border border-[#E4E1DA] p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-bold text-[#244B3E] uppercase tracking-wider">
              Paso {current.milestone + 1} de 5
            </p>
            <h2 className="text-lg font-bold text-[#1C2024] leading-snug">
              {MILESTONE_LABELS[current.milestone]}
            </h2>
            <p className="text-xs text-[#555B63]">{companion?.fullName}</p>
          </div>

          <div className="rounded-2xl bg-[#E8F0ED] border border-[#244B3E]/20 px-3.5 py-2 text-center shrink-0">
            <span className="text-[10px] font-bold uppercase text-[#244B3E] flex items-center gap-1 justify-center">
              <KeyRound className="w-3 h-3" /> PIN
            </span>
            <span className="font-mono-code text-xl font-bold text-[#1C2024] tracking-widest">
              {current.pinCode}
            </span>
          </div>
        </div>

        {/* Barra visual de 5 pasos */}
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {MILESTONE_LABELS.map((label, idx) => (
            <div
              key={label}
              className={`h-2 rounded-full transition-colors ${
                idx <= current.milestone ? 'bg-[#244B3E]' : 'bg-[#E4E1DA]'
              }`}
              title={label}
            />
          ))}
        </div>

        {/* Acción principal */}
        {current.status === 'active' && current.milestone < 3 && (
          <button
            type="button"
            onClick={() => advanceMilestone(current.id)}
            className="w-full min-h-12 rounded-2xl bg-[#244B3E] hover:bg-[#1b3a30] text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Play className="w-4 h-4" />
            Simular siguiente paso
          </button>
        )}

        {current.status === 'active' && current.milestone === 3 && (
          <button
            type="button"
            onClick={() => {
              setReceivedBy(person?.authorizedReceivers[0] ?? '');
              setActModalOpen(true);
            }}
            className="w-full min-h-12 rounded-2xl bg-[#C87D4B] hover:bg-[#b56d3d] text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <ClipboardCheck className="w-4 h-4" />
            Registrar entrega en casa
          </button>
        )}
      </div>

      {/* Mapa de León */}
      <div className="bg-white rounded-3xl border border-[#E4E1DA] p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#1C2024] flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-[#244B3E]" /> Ubicación en León
          </span>
          <span className="text-xs font-semibold text-[#244B3E] bg-[#E8F0ED] px-2.5 py-0.5 rounded-full">
            {coords.label}
          </span>
        </div>

        <div className="rounded-2xl border border-[#E4E1DA] bg-[#F4F1EA] overflow-hidden">
          <svg viewBox="0 0 360 210" className="w-full h-44 block">
            <defs>
              <pattern id="gridLeonMob" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#E5E0D6" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="360" height="210" fill="url(#gridLeonMob)" />
            <path d="M 20 185 Q 150 150 340 115" stroke="#DDD6C7" strokeWidth="8" fill="none" strokeLinecap="round" />
            <path d="M 55 28 Q 170 82 320 62" stroke="#DDD6C7" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M 112 168 Q 170 135 270 78" stroke="#244B3E" strokeWidth="3" strokeDasharray="6 4" fill="none" />
            <circle cx="112" cy="168" r="7" fill="#1C2024" />
            <text x="58" y="188" fontSize="10" fontWeight="700" fill="#1C2024">Casa</text>
            <circle cx="270" cy="78" r="7" fill="#C87D4B" />
            <text x="220" y="100" fontSize="10" fontWeight="700" fill="#9A5629">
              {current.destinationName.slice(0, 18)}
            </text>
            <g style={{ transition: 'all 0.6s ease' }}>
              <circle cx={coords.x} cy={coords.y} r="16" fill="#244B3E" opacity="0.22" className="animate-pulse-soft" />
              <circle cx={coords.x} cy={coords.y} r="7" fill="#244B3E" stroke="#FFFFFF" strokeWidth="2.5" />
            </g>
          </svg>
        </div>
      </div>

      {/* Tabs WhatsApp / Bitácora */}
      <div className="bg-white rounded-3xl border border-[#E4E1DA] p-4 space-y-3">
        <div className="grid grid-cols-2 gap-1.5 bg-[#F1EFE9] p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setFeedTab('whatsapp')}
            className={`min-h-10 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              feedTab === 'whatsapp' ? 'bg-white text-[#244B3E] shadow-xs' : 'text-[#555B63]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            WhatsApp ({current.whatsappFeed.length})
          </button>
          <button
            type="button"
            onClick={() => setFeedTab('bitacora')}
            className={`min-h-10 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              feedTab === 'bitacora' ? 'bg-white text-[#244B3E] shadow-xs' : 'text-[#555B63]'
            }`}
          >
            Bitácora ({current.logs.length})
          </button>
        </div>

        {feedTab === 'whatsapp' ? (
          <div className="space-y-2 max-h-52 overflow-y-auto">
            {current.whatsappFeed.map((w) => (
              <div
                key={w.id}
                className="rounded-2xl bg-[#E7F6EC] border border-emerald-200 px-3.5 py-2.5 text-sm text-[#1F3F35]"
              >
                <span className="block text-[11px] font-mono-code text-emerald-800/75 mb-0.5">
                  {w.timestamp} h
                </span>
                <p className="leading-snug">{w.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-2 max-h-44 overflow-y-auto">
              {current.logs.map((log) => (
                <div key={log.id} className="text-sm border-b border-[#F1EFE9] pb-2 last:border-none">
                  <span className="font-mono-code text-xs text-[#555B63] mr-2">{log.timestamp}</span>
                  <span className="font-semibold text-[#1C2024]">{log.author}: </span>
                  <span className="text-[#4B4F56]">{log.message}</span>
                </div>
              ))}
            </div>

            {current.status === 'active' && (
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Enviar nota al acompañante..."
                  className="flex-1 min-h-11 rounded-2xl border border-[#E4E1DA] px-3.5 text-sm bg-[#F8F6F2]"
                />
                <button
                  type="submit"
                  aria-label="Enviar nota"
                  className="min-h-11 min-w-11 rounded-2xl bg-[#244B3E] text-white flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        )}

        {current.deliveryAct && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-sm text-emerald-950 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              Entregado a {current.deliveryAct.receivedBy}
            </p>
            <p className="text-xs text-emerald-900">{current.deliveryAct.deliveredAt}</p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onOpenEmergency}
        className="w-full min-h-11 rounded-2xl border border-red-200 bg-red-50 text-red-700 text-xs font-bold"
      >
        ¿Ocurrió un incidente? Abrir Protocolo 911
      </button>

      {/* Bottom Sheet Acta de Entrega */}
      {actModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-[440px] shadow-2xl overflow-hidden animate-sheet-up">
            <div className="px-5 py-4 bg-[#244B3E] text-white flex items-center justify-between">
              <h3 className="text-base font-bold">Registrar Entrega Segura</h3>
              <button type="button" onClick={() => setActModalOpen(false)} className="p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCompleteDelivery} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#555B63] mb-1">¿Quién recibe en casa?</label>
                <select
                  value={receivedBy}
                  onChange={(e) => setReceivedBy(e.target.value)}
                  className="w-full min-h-12 rounded-2xl border border-[#E4E1DA] px-3.5 text-sm bg-white"
                >
                  {(person?.authorizedReceivers ?? ['Familiar autorizado']).map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#555B63] mb-1">Nota opcional</label>
                <input
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Ej. Todo completo, receta en carpeta"
                  className="w-full min-h-12 rounded-2xl border border-[#E4E1DA] px-3.5 text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full min-h-13 rounded-2xl bg-[#244B3E] text-white text-sm font-bold"
              >
                Confirmar Entrega y Avisar por WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
