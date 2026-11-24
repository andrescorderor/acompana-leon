import { useState } from 'react';
import { Check, CheckCircle2, ClipboardCheck, CreditCard, Star, X } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import type { Appointment } from '../../types';

export function PlanesHistorialView() {
  const { plan, activatePlan, appointments, people, companions, submitEvaluation } = useAppState();
  const completed = appointments.filter((a) => a.status === 'completed');

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
    <div className="space-y-7 animate-fade-in">
      {/* Planes de Citas */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#33363B]">Planes de Citas y Contratación</h2>
          <p className="text-xs text-[#6B7078]">
            Contrata una sola ocasión o ahorra con paquetes mensuales recurrentes para consultas y trámites en León.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-[#E6E3DE] p-5 flex flex-col justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono-code uppercase tracking-wider text-[#6B7078]">
                Pago por Evento
              </span>
              <h3 className="text-lg font-bold text-[#33363B] mt-1">Cita Única</h3>
              <p className="text-2xl font-bold text-[#2E5A4C] mt-2">
                $320 – $420 <span className="text-xs font-normal text-[#6B7078]">MXN / cita</span>
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-[#4B4F56]">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#2E5A4C]" /> Simple ($320) o Asistida ($420)
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#2E5A4C]" /> PIN de seguridad + WhatsApp
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#2E5A4C]" /> Acta de entrega verificada
                </li>
              </ul>
            </div>
            <span className="text-center rounded-xl bg-[#F8F6F2] border border-[#E6E3DE] py-2 text-xs font-semibold text-[#4B4F56]">
              Disponible al agendar
            </span>
          </div>

          <div
            className={`rounded-2xl border p-5 flex flex-col justify-between gap-4 ${
              plan.totalCredits === 4 ? 'bg-[#E8F0ED]/45 border-[#2E5A4C]' : 'bg-white border-[#E6E3DE]'
            }`}
          >
            <div>
              <span className="text-[11px] font-mono-code uppercase tracking-wider text-[#2E5A4C]">
                Plan Mensual
              </span>
              <h3 className="text-lg font-bold text-[#33363B] mt-1">Plan Esencial 4 Citas</h3>
              <p className="text-2xl font-bold text-[#2E5A4C] mt-2">
                $1,360 <span className="text-xs font-normal text-[#6B7078]">MXN / mes ($340/cita)</span>
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-[#4B4F56]">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#2E5A4C]" /> 4 citas asistidas incluidas
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#2E5A4C]" /> Hasta 2 expedientes familiares
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#2E5A4C]" /> Prioridad con acompañante favorito
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => activatePlan(4)}
              className={`rounded-xl py-2.5 text-xs font-semibold transition-colors ${
                plan.totalCredits === 4
                  ? 'bg-[#2E5A4C] text-white'
                  : 'border border-[#2E5A4C] text-[#2E5A4C] hover:bg-[#E8F0ED]'
              }`}
            >
              {plan.totalCredits === 4 ? '✓ Plan Activo (Restaurar 4 créditos)' : 'Activar Plan 4 Citas'}
            </button>
          </div>

          <div
            className={`rounded-2xl border p-5 flex flex-col justify-between gap-4 relative ${
              plan.totalCredits === 8
                ? 'bg-[#2E5A4C] text-white border-[#2E5A4C]'
                : 'bg-white text-[#33363B] border-[#E6E3DE]'
            }`}
          >
            <div>
              <span className="inline-block rounded-full bg-[#C87D4B] text-white px-2.5 py-0.5 text-[10px] font-mono-code uppercase tracking-wider">
                Recomendado
              </span>
              <h3 className="text-lg font-bold mt-1.5">Plan Familiar 8 Citas</h3>
              <p className="text-2xl font-bold mt-2">
                $2,560{' '}
                <span className={`text-xs font-normal ${plan.totalCredits === 8 ? 'text-emerald-100' : 'text-[#6B7078]'}`}>
                  MXN / mes ($320/cita)
                </span>
              </p>
              <ul className={`mt-3 space-y-1.5 text-xs ${plan.totalCredits === 8 ? 'text-emerald-50' : 'text-[#4B4F56]'}`}>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> 8 citas asistidas al mes
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> Expedientes familiares ilimitados
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> 24% ahorro vs. citas individuales
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => activatePlan(8)}
              className={`rounded-xl py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                plan.totalCredits === 8
                  ? 'bg-white text-[#2E5A4C] hover:bg-emerald-50'
                  : 'bg-[#2E5A4C] text-white hover:bg-[#23473b]'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              {plan.totalCredits === 8 ? 'Plan Activo · Renovar 8 créditos' : 'Cambiar a Plan 8 Citas'}
            </button>
          </div>
        </div>
      </div>

      {/* Historial y Actas */}
      <div className="bg-white rounded-2xl border border-[#E6E3DE] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#33363B]">Historial de Acompañamientos y Actas de Entrega</h3>
            <p className="text-xs text-[#6B7078]">
              Registro auditable de cada servicio completado y evaluación de calidad del familiar.
            </p>
          </div>
          <span className="text-xs font-mono-code text-[#2E5A4C] bg-[#E8F0ED] px-2.5 py-1 rounded-full">
            {completed.length} completados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E6E3DE] text-[#6B7078] font-mono-code uppercase text-[10px]">
                <th className="py-2.5 pr-4">Fecha</th>
                <th className="py-2.5 pr-4">Asistido</th>
                <th className="py-2.5 pr-4">Destino / Gestión</th>
                <th className="py-2.5 pr-4">Acompañante</th>
                <th className="py-2.5 pr-4">Evaluación</th>
                <th className="py-2.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1EFEA]">
              {completed.map((apt) => {
                const p = people.find((x) => x.id === apt.personId);
                const c = companions.find((x) => x.id === apt.companionId);
                return (
                  <tr key={apt.id} className="hover:bg-[#F8F6F2]/60">
                    <td className="py-3 pr-4 font-mono-code whitespace-nowrap">{apt.scheduledDate}</td>
                    <td className="py-3 pr-4 font-semibold text-[#33363B]">{p?.fullName}</td>
                    <td className="py-3 pr-4">
                      <span className="font-medium text-[#33363B] block">{apt.destinationName}</span>
                      <span className="text-[11px] text-[#6B7078]">{apt.purpose}</span>
                    </td>
                    <td className="py-3 pr-4">{c?.fullName}</td>
                    <td className="py-3 pr-4">
                      {apt.evaluation ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          {(
                            (apt.evaluation.safety +
                              apt.evaluation.punctuality +
                              apt.evaluation.dignity +
                              apt.evaluation.communication) /
                            4
                          ).toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-[#6B7078]">Pendiente</span>
                      )}
                    </td>
                    <td className="py-3 text-right space-x-2 whitespace-nowrap">
                      {apt.deliveryAct && (
                        <button
                          type="button"
                          onClick={() => setActAppointment(apt)}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#E6E3DE] bg-white px-2.5 py-1 text-[11px] font-semibold hover:bg-[#F8F6F2]"
                        >
                          <ClipboardCheck className="w-3 h-3 text-[#2E5A4C]" />
                          Ver Acta
                        </button>
                      )}
                      {!apt.evaluation && (
                        <button
                          type="button"
                          onClick={() => setEvalAppointment(apt)}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#C87D4B] text-white px-2.5 py-1 text-[11px] font-semibold hover:bg-[#b56d3d]"
                        >
                          <Star className="w-3 h-3" />
                          Evaluar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ver Acta */}
      {actAppointment?.deliveryAct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#E6E3DE] overflow-hidden animate-fade-in">
            <div className="px-5 py-4 bg-[#2E5A4C] text-white flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Acta Oficial de Entrega
              </h3>
              <button type="button" onClick={() => setActAppointment(null)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3 text-xs text-[#33363B]">
              <div className="rounded-xl bg-[#F8F6F2] p-3 border border-[#E6E3DE] space-y-1">
                <p>
                  <strong>Destino:</strong> {actAppointment.destinationName}
                </p>
                <p>
                  <strong>Hora de entrega:</strong> {actAppointment.deliveryAct.deliveredAt}
                </p>
                <p>
                  <strong>Recibido por:</strong> {actAppointment.deliveryAct.receivedBy}
                </p>
                <p>
                  <strong>Estado aparente:</strong> {actAppointment.deliveryAct.apparentCondition}
                </p>
                <p>
                  <strong>Pertenencias verificadas:</strong>{' '}
                  {actAppointment.deliveryAct.belongingsVerified ? 'Sí (completo)' : 'Pendiente'}
                </p>
              </div>
              {actAppointment.deliveryAct.observations && (
                <p className="leading-relaxed text-[#4B4F56]">
                  <strong>Observaciones:</strong> {actAppointment.deliveryAct.observations}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Evaluar Servicio */}
      {evalAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#E6E3DE] overflow-hidden animate-fade-in">
            <div className="px-5 py-4 bg-[#33363B] text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">Evaluación de Calidad del Servicio</h3>
              <button type="button" onClick={() => setEvalAppointment(null)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleEvalSubmit} className="p-5 space-y-3 text-xs">
              {[
                { label: 'Seguridad durante el recorrido', val: safety, set: setSafety },
                { label: 'Puntualidad', val: punctuality, set: setPunctuality },
                { label: 'Trato digno y respeto a la autonomía', val: dignity, set: setDignity },
                { label: 'Comunicación y avisos por WhatsApp', val: communication, set: setCommunication },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-2">
                  <span className="font-medium text-[#33363B]">{item.label}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => item.set(star)}
                        className="p-0.5"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= item.val ? 'fill-amber-500 text-amber-500' : 'text-zinc-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div>
                <label className="block font-semibold text-[#33363B] mb-1">¿Qué podríamos mejorar?</label>
                <textarea
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tu opinión ayuda a certificar a los mejores acompañantes en León."
                  className="w-full rounded-xl border border-[#E6E3DE] p-2.5 text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setEvalAppointment(null)}
                  className="rounded-xl border border-[#E6E3DE] px-3.5 py-2 font-semibold"
                >
                  Cancelar
                </button>
                <button type="submit" className="rounded-xl bg-[#2E5A4C] text-white px-4 py-2 font-semibold">
                  Enviar Evaluación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
