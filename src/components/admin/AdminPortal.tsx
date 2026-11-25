import { useState } from 'react';
import { Award, CheckCircle2, ShieldCheck, UserCheck, X, XCircle } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { MILESTONE_LABELS } from '../../data/seedData';
import type { Companion, CompanionBadges } from '../../types';
import { BadgeRow } from '../common/BadgeRow';

export function AdminPortal() {
  const { companions, appointments, people, reviewCompanion } = useAppState();
  const [tab, setTab] = useState<'validar' | 'vivo'>('validar');
  const [inspecting, setInspecting] = useState<Companion | null>(null);
  const [draftBadges, setDraftBadges] = useState<CompanionBadges>({
    kyc: true,
    references: true,
    certified40h: true,
  });

  const pendingCount = companions.filter((c) => c.status === 'pending').length;
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
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-lg font-bold text-[#1C2024]">Control Rosa María / Uanify</h2>
          <p className="text-xs text-[#555B63]">Validación KYC y calidad en León.</p>
        </div>
      </div>

      {/* 2 pestañas móviles */}
      <div className="grid grid-cols-2 gap-1.5 bg-[#E4E1DA]/70 p-1 rounded-2xl">
        <button
          type="button"
          onClick={() => setTab('validar')}
          className={`min-h-11 rounded-xl text-sm font-bold transition-all ${
            tab === 'validar' ? 'bg-white text-[#244B3E] shadow-xs' : 'text-[#555B63]'
          }`}
        >
          Validar ({pendingCount})
        </button>
        <button
          type="button"
          onClick={() => setTab('vivo')}
          className={`min-h-11 rounded-xl text-sm font-bold transition-all ${
            tab === 'vivo' ? 'bg-white text-[#244B3E] shadow-xs' : 'text-[#555B63]'
          }`}
        >
          En Vivo y Metas
        </button>
      </div>

      {tab === 'validar' ? (
        <div className="space-y-3">
          {companions.map((comp) => (
            <div
              key={comp.id}
              className={`rounded-3xl border p-4 space-y-3 ${
                comp.status === 'pending'
                  ? 'border-amber-300 bg-amber-50/40'
                  : 'border-[#E4E1DA] bg-white'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-[#1C2024] text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {comp.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1C2024]">{comp.fullName}</p>
                    <p className="text-xs text-[#555B63]">{comp.zone}</p>
                  </div>
                </div>
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    comp.status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : comp.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                  }`}
                >
                  {comp.status === 'pending' ? 'Pendiente' : comp.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                </span>
              </div>

              <BadgeRow badges={comp.badges} compact />

              <button
                type="button"
                onClick={() => openInspection(comp)}
                className="w-full min-h-11 rounded-2xl bg-[#1C2024] hover:bg-[#244B3E] text-white text-xs font-bold transition-colors"
              >
                Revisar y Aprobar
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-3xl border border-[#E4E1DA] p-4">
              <span className="text-xs text-[#555B63]">Sin incidentes</span>
              <p className="text-2xl font-bold text-[#244B3E] mt-1">100%</p>
              <span className="text-[11px] text-emerald-700 font-semibold">Meta: ≥ 99%</span>
            </div>
            <div className="bg-white rounded-3xl border border-[#E4E1DA] p-4">
              <span className="text-xs text-[#555B63]">Puntualidad</span>
              <p className="text-2xl font-bold text-[#1C2024] mt-1">98.2%</p>
              <span className="text-[11px] text-emerald-700 font-semibold">Meta: ≥ 95%</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#E4E1DA] p-4 space-y-2.5">
            <h3 className="text-sm font-bold text-[#1C2024]">Citas activas ({activeCitas.length})</h3>
            {activeCitas.map((apt) => {
              const p = people.find((x) => x.id === apt.personId);
              const c = companions.find((x) => x.id === apt.companionId);
              return (
                <div key={apt.id} className="rounded-2xl bg-[#F8F6F2] border border-[#E4E1DA] p-3 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-[#1C2024]">
                    <span>{p?.fullName}</span>
                    <span className="font-mono-code text-[#244B3E]">PIN {apt.pinCode}</span>
                  </div>
                  <p className="text-[#555B63]">
                    {apt.destinationName} · {c?.fullName}
                  </p>
                  <p className="font-bold text-[#244B3E]">{MILESTONE_LABELS[apt.milestone]}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Sheet Validación 3 Badges */}
      {inspecting && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-[440px] shadow-2xl overflow-hidden animate-sheet-up">
            <div className="px-5 py-4 bg-[#1C2024] text-white flex items-center justify-between">
              <h3 className="text-base font-bold">{inspecting.fullName}</h3>
              <button type="button" onClick={() => setInspecting(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#E4E1DA] cursor-pointer">
                <input
                  type="checkbox"
                  checked={draftBadges.kyc}
                  onChange={(e) => setDraftBadges((b) => ({ ...b, kyc: e.target.checked }))}
                  className="w-5 h-5 accent-[#244B3E]"
                />
                <div className="text-xs">
                  <strong className="flex items-center gap-1 text-sm text-[#1C2024]">
                    <ShieldCheck className="w-4 h-4 text-[#244B3E]" /> Identidad KYC
                  </strong>
                  <span className="text-[#555B63]">INE, selfie, domicilio y no antecedentes</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#E4E1DA] cursor-pointer">
                <input
                  type="checkbox"
                  checked={draftBadges.references}
                  onChange={(e) => setDraftBadges((b) => ({ ...b, references: e.target.checked }))}
                  className="w-5 h-5 accent-[#244B3E]"
                />
                <div className="text-xs">
                  <strong className="flex items-center gap-1 text-sm text-[#1C2024]">
                    <UserCheck className="w-4 h-4 text-[#244B3E]" /> Referencias y Entrevista
                  </strong>
                  <span className="text-[#555B63]">Entrevista con Rosa María y referencias</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#E4E1DA] cursor-pointer">
                <input
                  type="checkbox"
                  checked={draftBadges.certified40h}
                  onChange={(e) => setDraftBadges((b) => ({ ...b, certified40h: e.target.checked }))}
                  className="w-5 h-5 accent-[#244B3E]"
                />
                <div className="text-xs">
                  <strong className="flex items-center gap-1 text-sm text-[#1C2024]">
                    <Award className="w-4 h-4 text-[#244B3E]" /> Curso 40h + 1os Auxilios
                  </strong>
                  <span className="text-[#555B63]">Trato digno, movilidad y protocolo 911</span>
                </div>
              </label>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => handleDecision('rejected')}
                  className="min-h-12 rounded-2xl border border-red-200 text-red-700 text-xs font-bold flex items-center justify-center gap-1"
                >
                  <XCircle className="w-4 h-4" />
                  Rechazar
                </button>
                <button
                  type="button"
                  onClick={() => handleDecision('approved')}
                  disabled={!draftBadges.kyc || !draftBadges.references}
                  className="min-h-12 rounded-2xl bg-[#244B3E] disabled:bg-zinc-300 text-white text-xs font-bold flex items-center justify-center gap-1"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Aprobar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
