import { useState } from 'react';
import { Award, CheckCircle2, FileCheck2, ShieldCheck, TrendingUp, UserCheck, Users, X, XCircle } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { MILESTONE_LABELS } from '../../data/seedData';
import type { Companion, CompanionBadges } from '../../types';
import { BadgeRow } from '../common/BadgeRow';

export function AdminPortal() {
  const { companions, appointments, people, reviewCompanion } = useAppState();
  const [inspecting, setInspecting] = useState<Companion | null>(null);
  const [draftBadges, setDraftBadges] = useState<CompanionBadges>({
    kyc: true,
    references: true,
    certified40h: true,
  });

  const pendingList = companions.filter((c) => c.status === 'pending');
  const approvedList = companions.filter((c) => c.status === 'approved');
  const activeCitas = appointments.filter((a) => a.status === 'active');

  const openInspection = (comp: Companion) => {
    setInspecting(comp);
    setDraftBadges({ ...comp.badges });
  };

  const handleDecision = (status: 'approved' | 'rejected') => {
    if (!inspecting) return;
    reviewCompanion(inspecting.id, status, draftBadges);
    setInspecting(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-[#33363B]">Panel Operativo y Validación (Admin / Rosi)</h2>
          <p className="text-xs text-[#6B7078]">
            Control de calidad del marketplace curado: acreditación de 3 insignias, torre de citas y metas del Sistema de Seguridad.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F0ED] border border-[#2E5A4C]/25 px-3 py-1 text-xs font-semibold text-[#2E5A4C]">
          <ShieldCheck className="w-3.5 h-3.5" />
          Piloto León, Gto.
        </span>
      </div>

      {/* KPIs de Calidad del Piloto (metas propuestas) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#E6E3DE] p-4">
          <span className="text-[11px] font-medium text-[#6B7078]">Servicios sin incidentes</span>
          <p className="text-2xl font-bold text-[#2E5A4C] mt-1">100%</p>
          <span className="text-[11px] text-emerald-700">Meta piloto: ≥ 99%</span>
        </div>
        <div className="bg-white rounded-2xl border border-[#E6E3DE] p-4">
          <span className="text-[11px] font-medium text-[#6B7078]">Puntualidad en recogida</span>
          <p className="text-2xl font-bold text-[#33363B] mt-1">98.2%</p>
          <span className="text-[11px] text-emerald-700">Meta piloto: ≥ 95%</span>
        </div>
        <div className="bg-white rounded-2xl border border-[#E6E3DE] p-4">
          <span className="text-[11px] font-medium text-[#6B7078]">Satisfacción familiar</span>
          <p className="text-2xl font-bold text-[#33363B] mt-1">4.93 / 5</p>
          <span className="text-[11px] text-emerald-700">Meta piloto: ≥ 90%</span>
        </div>
        <div className="bg-white rounded-2xl border border-[#E6E3DE] p-4">
          <span className="text-[11px] font-medium text-[#6B7078]">Cola de validación KYC</span>
          <p className="text-2xl font-bold text-[#C87D4B] mt-1">{pendingList.length}</p>
          <span className="text-[11px] text-[#6B7078]">{approvedList.length} acompañantes activos</span>
        </div>
      </div>

      {/* Cola de Validación de Acompañantes */}
      <div className="bg-white rounded-2xl border border-[#E6E3DE] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#33363B] flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-[#C87D4B]" />
              Cola de Validación y Certificación de Acompañantes
            </h3>
            <p className="text-xs text-[#6B7078]">
              Ningún acompañante puede recibir citas sin aprobar Identidad KYC, Referencias y Certificación 40h.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {companions.map((comp) => (
            <div
              key={comp.id}
              className={`rounded-2xl border p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                comp.status === 'pending'
                  ? 'border-amber-300 bg-amber-50/40'
                  : comp.status === 'rejected'
                    ? 'border-red-200 bg-red-50/30 opacity-75'
                    : 'border-[#E6E3DE] bg-[#F8F6F2]/50'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <div className="w-9 h-9 rounded-full bg-[#33363B] text-white text-xs font-bold flex items-center justify-center">
                    {comp.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#33363B]">{comp.fullName}</span>
                      <span
                        className={`text-[10px] font-mono-code uppercase px-2 py-0.5 rounded-full font-semibold ${
                          comp.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : comp.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {comp.status === 'pending'
                          ? 'Pendiente revisión'
                          : comp.status === 'approved'
                            ? 'Aprobado'
                            : 'Rechazado'}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7078]">
                      {comp.zone} · {comp.experienceYears} años exp. · Postulado {comp.appliedAt}
                    </p>
                  </div>
                </div>
                <BadgeRow badges={comp.badges} />
              </div>

              <button
                type="button"
                onClick={() => openInspection(comp)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#33363B] hover:bg-[#2E5A4C] text-white px-4 py-2 text-xs font-semibold transition-colors shrink-0"
              >
                Revisar Expediente KYC
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Torre de Control de Citas Activas */}
      <div className="bg-white rounded-2xl border border-[#E6E3DE] p-5 sm:p-6 space-y-3">
        <h3 className="text-base font-bold text-[#33363B] flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#2E5A4C]" />
          Torre de Control · Citas Activas en León ({activeCitas.length})
        </h3>
        {activeCitas.length === 0 ? (
          <p className="text-xs text-[#6B7078]">Sin citas activas en curso.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeCitas.map((apt) => {
              const p = people.find((x) => x.id === apt.personId);
              const c = companions.find((x) => x.id === apt.companionId);
              return (
                <div key={apt.id} className="rounded-xl border border-[#E6E3DE] bg-[#F8F6F2] p-4 text-xs space-y-1.5">
                  <div className="flex justify-between font-bold text-[#33363B]">
                    <span>{p?.fullName}</span>
                    <span className="font-mono-code text-[#2E5A4C]">PIN {apt.pinCode}</span>
                  </div>
                  <p className="text-[#4B4F56]">
                    Destino: <strong>{apt.destinationName}</strong> · Acompañante: <strong>{c?.fullName}</strong>
                  </p>
                  <p className="text-[#2E5A4C] font-semibold">
                    Estatus actual: {MILESTONE_LABELS[apt.milestone]}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Revisión KYC 3 Niveles */}
      {inspecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#E6E3DE] overflow-hidden animate-fade-in">
            <div className="px-5 py-4 bg-[#33363B] text-white flex items-center justify-between">
              <div>
                <p className="text-[10px] font-mono-code uppercase tracking-wider text-zinc-300">
                  Auditoría de Seguridad y Acreditación
                </p>
                <h3 className="text-sm font-bold">{inspecting.fullName}</h3>
              </div>
              <button type="button" onClick={() => setInspecting(null)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="rounded-xl bg-[#F8F6F2] border border-[#E6E3DE] p-3 space-y-1">
                <p>
                  <strong>Zona:</strong> {inspecting.zone} · <strong>Tel:</strong> {inspecting.phone}
                </p>
                <p>
                  <strong>Vehículo:</strong>{' '}
                  {inspecting.hasOwnCar ? inspecting.carModel : 'Opera sin vehículo propio (Taxi / Familiar)'}
                </p>
                <p className="text-[#4B4F56]">{inspecting.bio}</p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-[#33363B]">Activa las 3 insignias tras validar documentos:</p>

                <label className="flex items-start gap-2.5 p-3 rounded-xl border border-[#E6E3DE] cursor-pointer hover:bg-[#F8F6F2]">
                  <input
                    type="checkbox"
                    checked={draftBadges.kyc}
                    onChange={(e) => setDraftBadges((b) => ({ ...b, kyc: e.target.checked }))}
                    className="mt-0.5 accent-[#2E5A4C]"
                  />
                  <div>
                    <span className="font-bold text-[#33363B] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#2E5A4C]" /> Nivel 1 · Identidad KYC
                    </span>
                    <span className="text-[#6B7078]">
                      INE ({inspecting.documents.ineUploaded ? 'OK' : 'Falta'}), Selfie biométrica, Comprobante domicilio y Carta No Antecedentes.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-xl border border-[#E6E3DE] cursor-pointer hover:bg-[#F8F6F2]">
                  <input
                    type="checkbox"
                    checked={draftBadges.references}
                    onChange={(e) => setDraftBadges((b) => ({ ...b, references: e.target.checked }))}
                    className="mt-0.5 accent-[#2E5A4C]"
                  />
                  <div>
                    <span className="font-bold text-[#33363B] flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-[#2E5A4C]" /> Nivel 2 · Aptitud y Referencias
                    </span>
                    <span className="text-[#6B7078]">
                      Entrevista psicosocial de Rosi + {inspecting.documents.referencesCount} referencias verificadas.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-xl border border-[#E6E3DE] cursor-pointer hover:bg-[#F8F6F2]">
                  <input
                    type="checkbox"
                    checked={draftBadges.certified40h}
                    onChange={(e) => setDraftBadges((b) => ({ ...b, certified40h: e.target.checked }))}
                    className="mt-0.5 accent-[#2E5A4C]"
                  />
                  <div>
                    <span className="font-bold text-[#33363B] flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-[#2E5A4C]" /> Nivel 3 · Certificación 40h + Primeros Auxilios
                    </span>
                    <span className="text-[#6B7078]">
                      Curso de trato digno, movilidad asistida y protocolo 911 (mín. 80% en evaluación).
                    </span>
                  </div>
                </label>
              </div>

              <div className="flex flex-wrap justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleDecision('rejected')}
                  className="inline-flex items-center gap-1 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 px-3.5 py-2 font-semibold"
                >
                  <XCircle className="w-4 h-4" />
                  Rechazar
                </button>
                <button
                  type="button"
                  onClick={() => handleDecision('approved')}
                  disabled={!draftBadges.kyc || !draftBadges.references}
                  className="inline-flex items-center gap-1 rounded-xl bg-[#2E5A4C] disabled:bg-zinc-300 text-white px-4 py-2 font-semibold hover:bg-[#23473b]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Aprobar y Activar Perfil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
