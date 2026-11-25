import { useState } from 'react';
import { CheckCircle2, ClipboardCheck, HeartHandshake, KeyRound, Send, UserPlus, Wallet } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { MILESTONE_LABELS } from '../../data/seedData';
import { BadgeRow } from '../common/BadgeRow';

const QUICK_NOTES = [
  'Ya en sala de espera',
  'Trámite en orden',
  'Listos para volver',
];

export function AcompanantePortal() {
  const {
    companions,
    activeCompanionId,
    setActiveCompanionId,
    appointments,
    people,
    advanceMilestone,
    addLogEntry,
    completeDeliveryAct,
    applyAsCompanion,
    setRole,
  } = useAppState();

  const [tab, setTab] = useState<'cita' | 'perfil'>('cita');
  const [showApplyForm, setShowApplyForm] = useState(false);

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [noteText, setNoteText] = useState('');
  const [receivedBy, setReceivedBy] = useState('');
  const [obsText, setObsText] = useState('');

  const [appName, setAppName] = useState('');
  const [appZone, setAppZone] = useState('Zona Centro / León');
  const [appPhone, setAppPhone] = useState('477 ');
  const [appCar, setAppCar] = useState(true);
  const [submittedNotice, setSubmittedNotice] = useState<string | null>(null);

  const me = companions.find((c) => c.id === activeCompanionId) ?? companions[0];
  const myActive = appointments.find((a) => a.companionId === me.id && a.status === 'active');
  const myHistory = appointments.filter((a) => a.companionId === me.id && a.status === 'completed');
  const activePerson = myActive ? people.find((p) => p.id === myActive.personId) : undefined;

  const grossMxn = myHistory.reduce((acc, a) => acc + a.priceMxn, 0);
  const feeMxn = myHistory.reduce((acc, a) => acc + a.platformFeeMxn, 0);
  const netMxn = grossMxn - feeMxn;

  const handleValidatePinAndAdvance = () => {
    if (!myActive) return;
    if (myActive.milestone === 0) {
      if (pinInput.trim() !== myActive.pinCode) {
        setPinError(`PIN incorrecto (Demo: ${myActive.pinCode})`);
        return;
      }
      setPinError('');
      setPinInput('');
    }
    advanceMilestone(myActive.id);
  };

  const handleCloseAct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myActive) return;
    completeDeliveryAct(myActive.id, {
      deliveredAt: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) + ' h',
      receivedBy: receivedBy || activePerson?.authorizedReceivers[0] || 'Familiar autorizado',
      apparentCondition: 'Tranquilo y estable',
      belongingsVerified: true,
      observations: obsText,
    });
    setObsText('');
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const created = applyAsCompanion({
      fullName: appName.trim(),
      zone: appZone.trim(),
      phone: appPhone.trim(),
      experienceYears: 3,
      hasOwnCar: appCar,
      carModel: appCar ? 'Auto propio' : undefined,
      bio: 'Acompañante en validación para León, Gto.',
      specialties: ['Citas médicas', 'Trámites'],
    });
    setSubmittedNotice(`Solicitud de ${created.fullName} enviada a Admin.`);
    setAppName('');
    setShowApplyForm(false);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Selector de 2 pestañas grandes */}
      <div className="grid grid-cols-2 gap-1.5 bg-[#E4E1DA]/70 p-1 rounded-2xl">
        <button
          type="button"
          onClick={() => setTab('cita')}
          className={`min-h-11 rounded-xl text-sm font-bold transition-all ${
            tab === 'cita' ? 'bg-white text-[#244B3E] shadow-xs' : 'text-[#555B63]'
          }`}
        >
          Cita Activa
        </button>
        <button
          type="button"
          onClick={() => setTab('perfil')}
          className={`min-h-11 rounded-xl text-sm font-bold transition-all ${
            tab === 'perfil' ? 'bg-white text-[#244B3E] shadow-xs' : 'text-[#555B63]'
          }`}
        >
          Perfil y Registro
        </button>
      </div>

      {tab === 'cita' ? (
        myActive && activePerson ? (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-[#E4E1DA] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#244B3E] uppercase">
                  {MILESTONE_LABELS[myActive.milestone]}
                </span>
                <span className="text-xs font-semibold text-[#555B63]">{myActive.scheduledTime} h</span>
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#1C2024]">{activePerson.fullName}</h2>
                <p className="text-sm text-[#4B4F56]">
                  Destino: <strong>{myActive.destinationName}</strong>
                </p>
                <p className="text-xs text-[#555B63] mt-0.5">{myActive.transportMode}</p>
              </div>

              <div className="rounded-2xl bg-[#E8F0ED]/70 border border-[#244B3E]/15 p-3 text-xs text-[#1F3F35] flex items-start gap-2">
                <HeartHandshake className="w-4 h-4 text-[#244B3E] shrink-0 mt-0.5" />
                <span>
                  <strong>Regla de oro:</strong> Pregunta siempre <em>“¿Desea que le ayude?”</em> antes de asistir.
                </span>
              </div>
            </div>

            {/* Acción principal con una mano */}
            {myActive.milestone < 3 ? (
              <div className="bg-white rounded-3xl border border-[#E4E1DA] p-4 space-y-3">
                <p className="text-sm font-bold text-[#1C2024]">
                  Siguiente: {MILESTONE_LABELS[myActive.milestone + 1]}
                </p>

                {myActive.milestone === 0 && (
                  <div className="space-y-2 text-center">
                    <label className="text-xs font-semibold text-[#555B63] flex items-center justify-center gap-1">
                      <KeyRound className="w-3.5 h-3.5 text-[#C87D4B]" />
                      PIN del familiar (Demo: {myActive.pinCode})
                    </label>
                    <input
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      placeholder="0000"
                      maxLength={4}
                      inputMode="numeric"
                      className="w-full h-14 text-center rounded-2xl border border-[#E4E1DA] bg-[#F8F6F2] font-mono-code text-2xl font-bold tracking-[0.4em]"
                    />
                    {pinError && <p className="text-xs font-semibold text-red-600">{pinError}</p>}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleValidatePinAndAdvance}
                  className="w-full min-h-13 rounded-2xl bg-[#244B3E] hover:bg-[#1b3a30] text-white text-sm font-bold flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Confirmar paso y avisar por WhatsApp
                </button>
              </div>
            ) : (
              <form onSubmit={handleCloseAct} className="bg-white rounded-3xl border border-[#E4E1DA] p-4 space-y-3">
                <p className="text-sm font-bold text-[#1C2024] flex items-center gap-1.5">
                  <ClipboardCheck className="w-4 h-4 text-[#C87D4B]" />
                  Cerrar entrega en casa
                </p>
                <select
                  value={receivedBy}
                  onChange={(e) => setReceivedBy(e.target.value)}
                  className="w-full min-h-12 rounded-2xl border border-[#E4E1DA] px-3 text-sm bg-white"
                >
                  {activePerson.authorizedReceivers.map((r) => (
                    <option key={r} value={r}>
                      Recibe: {r}
                    </option>
                  ))}
                </select>
                <input
                  value={obsText}
                  onChange={(e) => setObsText(e.target.value)}
                  placeholder="Nota final (opcional)"
                  className="w-full min-h-12 rounded-2xl border border-[#E4E1DA] px-3.5 text-sm"
                />
                <button
                  type="submit"
                  className="w-full min-h-13 rounded-2xl bg-[#C87D4B] text-white text-sm font-bold"
                >
                  Firmar Entrega y Finalizar
                </button>
              </form>
            )}

            {/* Botones rápidos de 1 toque para bitácora */}
            <div className="bg-white rounded-3xl border border-[#E4E1DA] p-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#555B63]">Avisos rápidos</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_NOTES.map((msg) => (
                  <button
                    key={msg}
                    type="button"
                    onClick={() => addLogEntry(myActive.id, me.fullName, msg)}
                    className="min-h-10 rounded-full bg-[#F8F6F2] border border-[#E4E1DA] px-3.5 text-xs font-semibold text-[#1C2024] active:bg-[#E8F0ED]"
                  >
                    + {msg}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addLogEntry(myActive.id, me.fullName, noteText);
                  setNoteText('');
                }}
                className="flex gap-2"
              >
                <input
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Otra nota breve..."
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
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#E4E1DA] p-6 text-center text-sm text-[#555B63]">
            {me.fullName} no tiene citas activas. Agenda una en el rol Familiar para probar este flujo.
          </div>
        )
      ) : (
        /* Tab Perfil y Registro KYC */
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-[#E4E1DA] p-4 space-y-3">
            <select
              value={me.id}
              onChange={(e) => setActiveCompanionId(e.target.value)}
              className="w-full min-h-11 rounded-2xl border border-[#E4E1DA] bg-[#F8F6F2] px-3 text-xs font-bold"
            >
              {companions
                .filter((c) => c.status === 'approved')
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    Perfil activo: {c.fullName}
                  </option>
                ))}
            </select>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#244B3E] text-white font-bold flex items-center justify-center shrink-0">
                {me.initials}
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1C2024]">{me.fullName}</h3>
                <p className="text-xs text-[#555B63]">{me.zone}</p>
              </div>
            </div>

            <BadgeRow badges={me.badges} />
          </div>

          <div className="bg-[#1C2024] text-white rounded-3xl p-5 flex items-center justify-between">
            <div>
              <span className="text-xs text-zinc-300">Ingresos netos (82%)</span>
              <p className="text-2xl font-bold text-emerald-300 mt-0.5">
                ${netMxn.toLocaleString('es-MX')} MXN
              </p>
              <span className="text-[11px] text-zinc-400">{myHistory.length} servicios cerrados</span>
            </div>
            <Wallet className="w-8 h-8 text-emerald-300 shrink-0" />
          </div>

          {submittedNotice && (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-950 space-y-2">
              <p className="font-bold">{submittedNotice}</p>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className="min-h-10 rounded-xl bg-[#244B3E] text-white px-4 font-bold"
              >
                Revisar en Admin →
              </button>
            </div>
          )}

          {!showApplyForm ? (
            <button
              type="button"
              onClick={() => setShowApplyForm(true)}
              className="w-full min-h-12 rounded-2xl border border-[#244B3E] bg-white text-[#244B3E] text-sm font-bold flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Postular nuevo acompañante (KYC)
            </button>
          ) : (
            <form onSubmit={handleApply} className="bg-white rounded-3xl border border-[#E4E1DA] p-4 space-y-3">
              <h4 className="text-sm font-bold text-[#1C2024]">Registro rápido KYC</h4>
              <input
                required
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="Nombre completo *"
                className="w-full min-h-11 rounded-2xl border border-[#E4E1DA] px-3.5 text-sm"
              />
              <input
                required
                value={appPhone}
                onChange={(e) => setAppPhone(e.target.value)}
                placeholder="WhatsApp *"
                className="w-full min-h-11 rounded-2xl border border-[#E4E1DA] px-3.5 text-sm"
              />
              <input
                required
                value={appZone}
                onChange={(e) => setAppZone(e.target.value)}
                placeholder="Zona en León *"
                className="w-full min-h-11 rounded-2xl border border-[#E4E1DA] px-3.5 text-sm"
              />
              <label className="flex items-center gap-2 text-xs font-semibold text-[#1C2024] bg-[#F8F6F2] p-3 rounded-2xl">
                <input
                  type="checkbox"
                  checked={appCar}
                  onChange={(e) => setAppCar(e.target.checked)}
                  className="accent-[#244B3E]"
                />
                Tengo auto propio disponible
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setShowApplyForm(false)}
                  className="min-h-11 rounded-2xl border border-[#E4E1DA] text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="min-h-11 rounded-2xl bg-[#244B3E] text-white text-xs font-bold"
                >
                  Enviar a Admin
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
