import { useState } from 'react';
import { Check, CheckCircle2, ClipboardCheck, Star, X } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import type { Appointment } from '../../types';

export function PlanesHistorialView() {
  const { plan, activatePlan, appointments, people, companions, submitEvaluation } = useAppState();
  const completed = appointments.filter((a) => a.status === 'completed');

  const [view, setView] = useState<'planes' | 'historial'>('planes');
  const [actAppointment, setActAppointment] = useState<Appointment | null>(null);
  const [evalAppointment, setEvalAppointment] = useState<Appointment | null>(null);

  const [safety, setSafety] = useState(5);
  const [punctuality, setPunctuality] = useState(5);
  const [dignity, setDignity] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [comment, setComment] = useState('');

  const handleEvalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evalAppointment) return;
    submitEvaluation(evalAppointment.id, {
      safety,
      punctuality,
      dignity,
      communication,
      comment,
      submittedAt: new Date().toISOString().slice(0, 10),
    });
    setEvalAppointment(null);
    setComment('');
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Switcher Planes / Historial */}
      <div className="grid grid-cols-2 gap-1.5 bg-[#E4E1DA]/70 p-1 rounded-2xl">
        <button
          type="button"
          onClick={() => setView('planes')}
          className={`min-h-11 rounded-xl text-sm font-bold transition-all ${
            view === 'planes' ? 'bg-white text-[#244B3E] shadow-xs' : 'text-[#555B63]'
          }`}
        >
          Planes de Citas
        </button>
        <button
          type="button"
          onClick={() => setView('historial')}
          className={`min-h-11 rounded-xl text-sm font-bold transition-all ${
            view === 'historial' ? 'bg-white text-[#244B3E] shadow-xs' : 'text-[#555B63]'
          }`}
        >
          Historial ({completed.length})
        </button>
      </div>

      {view === 'planes' ? (
        <div className="space-y-3">
          {/* Plan 8 Citas */}
          <div
            className={`rounded-3xl border p-5 space-y-3 ${
              plan.totalCredits === 8
                ? 'bg-[#244B3E] text-white border-[#244B3E]'
                : 'bg-white text-[#1C2024] border-[#E4E1DA]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#C87D4B] text-white px-2.5 py-0.5 text-[11px] font-bold">
                Recomendado
              </span>
              <span className="text-xs font-semibold opacity-85">$320 / cita</span>
            </div>
            <div>
              <h3 className="text-lg font-bold">Plan Familiar · 8 Citas/mes</h3>
              <p className="text-2xl font-bold mt-1">
                $2,560 <span className="text-xs font-normal opacity-80">MXN / mes</span>
              </p>
            </div>
            <ul className="space-y-1 text-xs opacity-90">
              <li className="flex items-center gap-1.5">
                <Check className="w-4 h-4" /> 8 citas asistidas · 24% de ahorro
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Expedientes familiares ilimitados
              </li>
            </ul>
            <button
              type="button"
              onClick={() => activatePlan(8)}
              className={`w-full min-h-12 rounded-2xl text-sm font-bold transition-colors ${
                plan.totalCredits === 8 ? 'bg-white text-[#244B3E]' : 'bg-[#244B3E] text-white'
              }`}
            >
              {plan.totalCredits === 8 ? '✓ Plan Activo (Renovar 8)' : 'Activar Plan 8 Citas'}
            </button>
          </div>

          {/* Plan 4 Citas */}
          <div
            className={`rounded-3xl border p-5 space-y-3 ${
              plan.totalCredits === 4 ? 'bg-[#E8F0ED] border-[#244B3E]' : 'bg-white border-[#E4E1DA]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#244B3E]">Plan Mensual</span>
              <span className="text-xs font-semibold text-[#555B63]">$340 / cita</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1C2024]">Plan Esencial · 4 Citas/mes</h3>
              <p className="text-2xl font-bold text-[#244B3E] mt-1">
                $1,360 <span className="text-xs font-normal text-[#555B63]">MXN / mes</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => activatePlan(4)}
              className={`w-full min-h-12 rounded-2xl text-sm font-bold ${
                plan.totalCredits === 4
                  ? 'bg-[#244B3E] text-white'
                  : 'border border-[#244B3E] text-[#244B3E]'
              }`}
            >
              {plan.totalCredits === 4 ? '✓ Plan Activo (Renovar 4)' : 'Activar Plan 4 Citas'}
            </button>
          </div>

          {/* Cita Única */}
          <div className="bg-white rounded-3xl border border-[#E4E1DA] p-5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#1C2024]">Cita Única</h3>
              <p className="text-xs text-[#555B63]">Simple $320 · Asistida $420 MXN</p>
            </div>
            <span className="text-xs font-bold text-[#555B63] bg-[#F8F6F2] px-3 py-1.5 rounded-xl border border-[#E4E1DA]">
              Sin suscripción
            </span>
          </div>
        </div>
      ) : (
        /* Tarjetas móviles apiladas de Historial */
        <div className="space-y-3">
          {completed.map((apt) => {
            const p = people.find((x) => x.id === apt.personId);
            const c = companions.find((x) => x.id === apt.companionId);
            const avg = apt.evaluation
              ? ((apt.evaluation.safety + apt.evaluation.punctuality + apt.evaluation.dignity + apt.evaluation.communication) / 4).toFixed(1)
              : null;

            return (
              <div key={apt.id} className="bg-white rounded-3xl border border-[#E4E1DA] p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono-code text-[#555B63]">{apt.scheduledDate}</span>
                    <h3 className="text-base font-bold text-[#1C2024]">{apt.destinationName}</h3>
                    <p className="text-xs text-[#555B63]">
                      {p?.fullName} · con {c?.fullName}
                    </p>
                  </div>
                  {avg && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {avg}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {apt.deliveryAct && (
                    <button
                      type="button"
                      onClick={() => setActAppointment(apt)}
                      className="min-h-11 rounded-2xl border border-[#E4E1DA] bg-[#F8F6F2] text-xs font-bold text-[#1C2024] flex items-center justify-center gap-1.5"
                    >
                      <ClipboardCheck className="w-4 h-4 text-[#244B3E]" />
                      Ver Acta
                    </button>
                  )}
                  {!apt.evaluation && (
                    <button
                      type="button"
                      onClick={() => setEvalAppointment(apt)}
                      className="min-h-11 rounded-2xl bg-[#C87D4B] text-white text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <Star className="w-4 h-4" />
                      Calificar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Sheet Acta */}
      {actAppointment?.deliveryAct && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-[440px] shadow-2xl overflow-hidden animate-sheet-up">
            <div className="px-5 py-4 bg-[#244B3E] text-white flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Acta de Entrega
              </h3>
              <button type="button" onClick={() => setActAppointment(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-2.5 text-sm text-[#1C2024]">
              <p><strong>Destino:</strong> {actAppointment.destinationName}</p>
              <p><strong>Hora:</strong> {actAppointment.deliveryAct.deliveredAt}</p>
              <p><strong>Recibió:</strong> {actAppointment.deliveryAct.receivedBy}</p>
              <p><strong>Estado:</strong> {actAppointment.deliveryAct.apparentCondition}</p>
              {actAppointment.deliveryAct.observations && (
                <p className="text-[#4B4F56] bg-[#F8F6F2] rounded-2xl p-3">
                  {actAppointment.deliveryAct.observations}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sheet Calificación */}
      {evalAppointment && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-[440px] shadow-2xl overflow-hidden animate-sheet-up">
            <div className="px-5 py-4 bg-[#1C2024] text-white flex items-center justify-between">
              <h3 className="text-base font-bold">Calificar Servicio</h3>
              <button type="button" onClick={() => setEvalAppointment(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEvalSubmit} className="p-5 space-y-4">
              {[
                { label: 'Seguridad', val: safety, set: setSafety },
                { label: 'Puntualidad', val: punctuality, set: setPunctuality },
                { label: 'Trato digno', val: dignity, set: setDignity },
                { label: 'Avisos WhatsApp', val: communication, set: setCommunication },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-[#1C2024]">{item.label}</span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => item.set(star)}
                        className="p-1"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= item.val ? 'fill-amber-500 text-amber-500' : 'text-zinc-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Comentario breve (opcional)"
                className="w-full min-h-12 rounded-2xl border border-[#E4E1DA] px-3.5 text-sm"
              />
              <button
                type="submit"
                className="w-full min-h-13 rounded-2xl bg-[#244B3E] text-white text-sm font-bold"
              >
                Enviar Calificación
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
