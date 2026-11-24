import { useState } from 'react';
import {
  CheckCircle2,
  ClipboardCheck,
  HeartHandshake,
  KeyRound,
  Send,
  ShieldCheck,
  UserPlus,
  Wallet,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { MILESTONE_LABELS } from '../../data/seedData';
import { BadgeRow } from '../common/BadgeRow';

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

  const [tab, setTab] = useState<'operacion' | 'postulacion'>('operacion');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [noteText, setNoteText] = useState('');
  const [receivedBy, setReceivedBy] = useState('');
  const [obsText, setObsText] = useState('');

  // Form state for new companion KYC application
  const [appName, setAppName] = useState('');
  const [appZone, setAppZone] = useState('Zona Centro / León Moderno');
  const [appPhone, setAppPhone] = useState('477 ');
  const [appExp, setAppExp] = useState(3);
  const [appCar, setAppCar] = useState(true);
  const [appCarModel, setAppCarModel] = useState('Toyota Avanza 2023');
  const [appBio, setAppBio] = useState('');
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
        setPinError(`PIN incorrecto. Solicítalo al familiar (Demo PIN: ${myActive.pinCode}).`);
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
      apparentCondition: 'Tranquilo y en buen estado',
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
      experienceYears: Number(appExp),
      hasOwnCar: appCar,
      carModel: appCar ? appCarModel.trim() : undefined,
      bio: appBio.trim() || 'Comprometido con el trato digno y puntualidad para adultos mayores en León.',
      specialties: ['Consultas médicas', 'Trámites y banco', 'Trato digno'],
    });
    setSubmittedNotice(
      `Solicitud de ${created.fullName} enviada a la cola de Validación Admin. Cambia al rol "Admin Validación" para aprobar sus 3 badges.`
    );
    setAppName('');
    setAppBio('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#33363B]">Portal del Acompañante Verificado</h2>
          <p className="text-xs text-[#6B7078]">
            Gestiona tus citas activas, bitácora de trato digno, ganancias y registro de acreditación KYC.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTab('operacion')}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
              tab === 'operacion'
                ? 'bg-[#2E5A4C] text-white'
                : 'bg-white border border-[#E6E3DE] text-[#4B4F56]'
            }`}
          >
            Mi Operación
          </button>
          <button
            type="button"
            onClick={() => setTab('postulacion')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
              tab === 'postulacion'
                ? 'bg-[#C87D4B] text-white'
                : 'bg-white border border-[#E6E3DE] text-[#4B4F56]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Postularme (Registro KYC)
          </button>
        </div>
      </div>

      {tab === 'operacion' ? (
        <div className="space-y-5">
          {/* Perfil + Selector de acompañante demo + Ganancias */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E6E3DE] p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#2E5A4C] text-white font-bold flex items-center justify-center">
                    {me.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-[#33363B]">{me.fullName}</h3>
                      <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                        {me.status === 'approved' ? 'Activo en Plataforma' : 'En revisión'}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7078]">{me.zone}</p>
                  </div>
                </div>

                <select
                  value={me.id}
                  onChange={(e) => setActiveCompanionId(e.target.value)}
                  className="rounded-xl border border-[#E6E3DE] bg-[#F8F6F2] px-3 py-1.5 text-xs font-medium"
                >
                  {companions
                    .filter((c) => c.status === 'approved')
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        Ver como: {c.fullName}
                      </option>
                    ))}
                </select>
              </div>

              <BadgeRow badges={me.badges} />
            </div>

            <div className="lg:col-span-4 bg-[#33363B] text-white rounded-2xl p-5 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between text-xs text-zinc-300">
                <span>Resumen de Ingresos</span>
                <Wallet className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-300">${netMxn.toLocaleString('es-MX')} MXN</p>
                <p className="text-[11px] text-zinc-400">
                  Neto tras 18% comisión plataforma (${feeMxn} MXN) en {myHistory.length} servicios cerrados
                </p>
              </div>
            </div>
          </div>

          {/* Cita asignada activa */}
          {myActive && activePerson ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E6E3DE] p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono-code uppercase tracking-wider text-[#2E5A4C]">
                      Servicio Asignado · {MILESTONE_LABELS[myActive.milestone]}
                    </span>
                    <h3 className="text-lg font-bold text-[#33363B] mt-1">
                      {activePerson.fullName} → {myActive.destinationName}
                    </h3>
                    <p className="text-xs text-[#6B7078]">
                      Recogida: {myActive.pickupAddress} · {myActive.scheduledTime} h
                    </p>
                  </div>
                  <span className="rounded-xl bg-[#F8F6F2] border border-[#E6E3DE] px-3 py-1.5 text-xs font-semibold">
                    {myActive.transportMode}
                  </span>
                </div>

                {/* Regla de oro */}
                <div className="rounded-xl bg-[#E8F0ED]/65 border border-[#2E5A4C]/20 p-3.5 flex items-start gap-2.5 text-xs text-[#1F3F35]">
                  <HeartHandshake className="w-4 h-4 text-[#2E5A4C] shrink-0 mt-0.5" />
                  <div>
                    <strong>Regla de Oro de Trato Digno:</strong> “Ayudar sin sustituir la autonomía.” Antes de tomar del brazo o manipular el bastón/andador, pregunta: <em>“¿Desea que le ayude?”</em>. Notas del expediente: {activePerson.dignityNotes}
                  </div>
                </div>

                {/* Control de avance de hito */}
                {myActive.milestone < 3 ? (
                  <div className="rounded-xl bg-[#F8F6F2] border border-[#E6E3DE] p-4 space-y-3">
                    <p className="text-xs font-bold text-[#33363B]">
                      Siguiente paso: {MILESTONE_LABELS[myActive.milestone + 1]}
                    </p>

                    {myActive.milestone === 0 && (
                      <div className="space-y-1.5">
                        <label className="text-xs text-[#4B4F56] flex items-center gap-1 font-medium">
                          <KeyRound className="w-3.5 h-3.5 text-[#C87D4B]" />
                          Ingresa el PIN de 4 dígitos proporcionado por el familiar (Demo: {myActive.pinCode})
                        </label>
                        <input
                          value={pinInput}
                          onChange={(e) => setPinInput(e.target.value)}
                          placeholder="Ej. 4829"
                          maxLength={4}
                          className="w-40 rounded-xl border border-[#E6E3DE] bg-white px-3 py-2 font-mono-code text-sm tracking-widest"
                        />
                        {pinError && <p className="text-xs text-red-600">{pinError}</p>}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleValidatePinAndAdvance}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#2E5A4C] hover:bg-[#23473b] text-white px-4 py-2.5 text-xs font-semibold transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Confirmar Hito y Notificar por WhatsApp
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCloseAct} className="rounded-xl bg-[#F8F6F2] border border-[#E6E3DE] p-4 space-y-3">
                    <p className="text-xs font-bold text-[#33363B] flex items-center gap-1.5">
                      <ClipboardCheck className="w-4 h-4 text-[#C87D4B]" />
                      Cerrar Servicio con Acta de Entrega
                    </p>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#33363B] mb-1">
                        Persona autorizada que recibe
                      </label>
                      <select
                        value={receivedBy}
                        onChange={(e) => setReceivedBy(e.target.value)}
                        className="w-full rounded-xl border border-[#E6E3DE] bg-white px-3 py-2 text-xs"
                      >
                        {activePerson.authorizedReceivers.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#33363B] mb-1">
                        Observaciones finales
                      </label>
                      <input
                        value={obsText}
                        onChange={(e) => setObsText(e.target.value)}
                        placeholder="Pertenencias completas, entrega sin incidentes..."
                        className="w-full rounded-xl border border-[#E6E3DE] bg-white px-3 py-2 text-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#C87D4B] hover:bg-[#b56d3d] text-white px-4 py-2 text-xs font-semibold"
                    >
                      Firmar Entrega y Finalizar
                    </button>
                  </form>
                )}
              </div>

              {/* Bitácora rápida */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E6E3DE] p-5 space-y-3">
                <h4 className="text-sm font-bold text-[#33363B]">Bitácora de Acompañamiento</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {myActive.logs.map((l) => (
                    <div key={l.id} className="text-xs border-b border-[#F1EFEA] pb-2">
                      <span className="font-mono-code text-[10px] text-[#6B7078] mr-2">{l.timestamp}</span>
                      <span className="text-[#33363B]">{l.message}</span>
                    </div>
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
                    placeholder="Registrar nota (ej. Esperando turno)..."
                    className="flex-1 rounded-xl border border-[#E6E3DE] px-3 py-2 text-xs"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-[#2E5A4C] text-white px-3 py-2 text-xs font-semibold inline-flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E6E3DE] p-6 text-center text-xs text-[#6B7078]">
              {me.fullName} no tiene citas activas en este momento. Agenda una cita desde el rol "Apoderado / Familiar" para probar el flujo completo.
            </div>
          )}
        </div>
      ) : (
        /* Registro KYC como nuevo acompañante */
        <div className="bg-white rounded-2xl border border-[#E6E3DE] p-6 max-w-2xl space-y-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-[#2E5A4C] shrink-0" />
            <div>
              <h3 className="text-base font-bold text-[#33363B]">
                Postulación al Marketplace Curado (Validación en 3 Niveles)
              </h3>
              <p className="text-xs text-[#6B7078] mt-0.5">
                Los aspirantes cargan su expediente de identidad y experiencia; el equipo de operación (Rosa María / Admin) revisa y otorga las 3 insignias antes de activar el perfil.
              </p>
            </div>
          </div>

          {submittedNotice && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-900 space-y-2">
              <p className="font-semibold">{submittedNotice}</p>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className="rounded-lg bg-[#2E5A4C] text-white px-3 py-1.5 text-xs font-semibold"
              >
                Ir a Admin Validación →
              </button>
            </div>
          )}

          <form onSubmit={handleApply} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#33363B] mb-1">Nombre completo *</label>
                <input
                  required
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="Ej. Mónica Salgado Pérez"
                  className="w-full rounded-xl border border-[#E6E3DE] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#33363B] mb-1">Teléfono WhatsApp *</label>
                <input
                  required
                  value={appPhone}
                  onChange={(e) => setAppPhone(e.target.value)}
                  className="w-full rounded-xl border border-[#E6E3DE] px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#33363B] mb-1">Zona de cobertura en León *</label>
                <input
                  required
                  value={appZone}
                  onChange={(e) => setAppZone(e.target.value)}
                  className="w-full rounded-xl border border-[#E6E3DE] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#33363B] mb-1">Años de experiencia</label>
                <input
                  type="number"
                  min={0}
                  max={40}
                  value={appExp}
                  onChange={(e) => setAppExp(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#E6E3DE] px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <label className="flex items-center gap-2 rounded-xl border border-[#E6E3DE] p-2.5 bg-[#F8F6F2]">
                <input
                  type="checkbox"
                  checked={appCar}
                  onChange={(e) => setAppCar(e.target.checked)}
                  className="accent-[#2E5A4C]"
                />
                <span className="font-medium text-[#33363B]">Cuento con automóvil propio disponible</span>
              </label>
              {appCar && (
                <input
                  value={appCarModel}
                  onChange={(e) => setAppCarModel(e.target.value)}
                  placeholder="Marca, modelo y año"
                  className="rounded-xl border border-[#E6E3DE] px-3 py-2 text-sm"
                />
              )}
            </div>

            <div>
              <label className="block font-semibold text-[#33363B] mb-1">Presentación y motivación</label>
              <textarea
                rows={2}
                value={appBio}
                onChange={(e) => setAppBio(e.target.value)}
                placeholder="Describe tu experiencia acompañando adultos mayores o realizando trámites..."
                className="w-full rounded-xl border border-[#E6E3DE] px-3 py-2 text-sm"
              />
            </div>

            <div className="rounded-xl bg-[#F8F6F2] border border-[#E6E3DE] p-3 text-[11px] text-[#4B4F56]">
              Documentos simulados cargados en este demo: <strong>INE vigente + Selfie biométrica + Comprobante de domicilio León + Carta de no antecedentes</strong>.
            </div>

            <button
              type="submit"
              className="rounded-xl bg-[#2E5A4C] hover:bg-[#23473b] text-white px-5 py-2.5 text-xs font-bold"
            >
              Enviar Solicitud a Validación Admin
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
