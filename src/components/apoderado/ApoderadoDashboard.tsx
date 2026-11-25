import { ArrowRight, CalendarPlus, KeyRound, MapPin, MessageSquare, Star } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { MILESTONE_LABELS } from '../../data/seedData';
import { BadgeRow } from '../common/BadgeRow';

export type ApoderadoTab = 'resumen' | 'expedientes' | 'agendar' | 'seguimiento' | 'planes';

interface ApoderadoDashboardProps {
  onNavigate: (tab: ApoderadoTab) => void;
}

export function ApoderadoDashboard({ onNavigate }: ApoderadoDashboardProps) {
  const { people, companions, appointments, plan } = useAppState();
  const activeAppointment = appointments.find((a) => a.status === 'active');
  const activePerson = activeAppointment
    ? people.find((p) => p.id === activeAppointment.personId)
    : undefined;
  const activeCompanion = activeAppointment
    ? companions.find((c) => c.id === activeAppointment.companionId)
    : undefined;

  const remainingCredits = Math.max(0, plan.totalCredits - plan.usedCredits);
  const lastWhatsapp = (activeAppointment?.whatsappFeed ?? appointments[0]?.whatsappFeed ?? []).slice(-1)[0];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Saludo breve */}
      <div className="px-1">
        <h1 className="text-2xl font-bold text-[#1C2024] tracking-tight">Hola, Mariana</h1>
        <p className="text-sm text-[#555B63]">Todo listo para cuidar a tu familia en León.</p>
      </div>

      {/* Tarjeta principal: Cita en Curso */}
      {activeAppointment && activePerson && activeCompanion ? (
        <div className="bg-white rounded-3xl border border-[#E4E1DA] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {MILESTONE_LABELS[activeAppointment.milestone]}
            </span>

            <div className="flex items-center gap-1.5 rounded-xl bg-[#F8F6F2] border border-[#E4E1DA] px-3 py-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#C87D4B]" />
              <span className="text-[11px] font-semibold text-[#555B63]">PIN</span>
              <span className="font-mono-code text-base font-bold text-[#244B3E] tracking-wider">
                {activeAppointment.pinCode}
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#1C2024] leading-snug">
              {activePerson.fullName}
            </h2>
            <p className="text-sm text-[#4B4F56] mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#C87D4B] shrink-0" />
              <span>{activeAppointment.destinationName}</span>
            </p>
          </div>

          <div className="rounded-2xl bg-[#F8F6F2] border border-[#E4E1DA] p-3.5 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#244B3E] text-white font-bold text-sm flex items-center justify-center shrink-0">
                  {activeCompanion.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1C2024]">{activeCompanion.fullName}</p>
                  <p className="text-xs text-[#555B63] flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {activeCompanion.rating} · {activeAppointment.transportMode}
                  </p>
                </div>
              </div>
            </div>
            <BadgeRow badges={activeCompanion.badges} compact />
          </div>

          <button
            type="button"
            onClick={() => onNavigate('seguimiento')}
            className="w-full min-h-12 rounded-2xl bg-[#244B3E] hover:bg-[#1b3a30] active:scale-[0.99] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all"
          >
            <span>Ver mapa y seguimiento</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E4E1DA] p-6 text-center space-y-3">
          <p className="text-base font-bold text-[#1C2024]">Sin citas activas hoy</p>
          <p className="text-sm text-[#555B63]">Agenda un acompañamiento en 3 pasos.</p>
          <button
            type="button"
            onClick={() => onNavigate('agendar')}
            className="w-full min-h-12 rounded-2xl bg-[#244B3E] text-white text-sm font-bold flex items-center justify-center gap-2"
          >
            <CalendarPlus className="w-4 h-4" />
            Agendar cita
          </button>
        </div>
      )}

      {/* Mi Plan + Acceso rápido a Agendar */}
      <div className="bg-white rounded-3xl border border-[#E4E1DA] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#555B63]">{plan.name}</p>
            <p className="text-xl font-bold text-[#1C2024]">
              {remainingCredits} de {plan.totalCredits} <span className="text-sm font-normal text-[#555B63]">citas disponibles</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('planes')}
            className="text-xs font-bold text-[#244B3E] px-3 py-2 rounded-xl bg-[#E8F0ED]"
          >
            Ver plan
          </button>
        </div>

        <div className="h-2.5 w-full rounded-full bg-[#F1EFE9] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#244B3E] transition-all"
            style={{ width: `${Math.round((remainingCredits / plan.totalCredits) * 100)}%` }}
          />
        </div>

        <button
          type="button"
          onClick={() => onNavigate('agendar')}
          className="w-full min-h-12 rounded-2xl bg-[#C87D4B] hover:bg-[#b56d3d] active:scale-[0.99] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all"
        >
          <CalendarPlus className="w-4 h-4" />
          Agendar nueva cita
        </button>
      </div>

      {/* Último aviso WhatsApp */}
      {lastWhatsapp && (
        <div className="bg-white rounded-3xl border border-[#E4E1DA] p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" /> Último aviso WhatsApp
            </span>
            <span className="font-mono-code text-[#555B63]">{lastWhatsapp.timestamp} h</span>
          </div>
          <p className="text-sm text-[#1C2024] bg-[#E7F6EC] border border-emerald-200 rounded-2xl px-3.5 py-2.5 leading-snug">
            {lastWhatsapp.text}
          </p>
        </div>
      )}
    </div>
  );
}
