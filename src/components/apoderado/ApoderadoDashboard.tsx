import {
  Activity,
  ArrowRight,
  CalendarPlus,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  MapPin,
  ShieldCheck,
  Users,
} from 'lucide-react';
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

  const completedCount = appointments.filter((a) => a.status === 'completed').length;
  const remainingCredits = Math.max(0, plan.totalCredits - plan.usedCredits);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header banner */}
      <div className="rounded-2xl bg-gradient-to-br from-[#2E5A4C] to-[#1F3F35] text-white p-6 sm:p-7 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-mono-code uppercase tracking-wider text-emerald-100">
            <ShieldCheck className="w-3.5 h-3.5" />
            Portal del Apoderado · Mariana López · León, Gto.
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Tranquilidad familiar en cada acompañamiento
          </h1>
          <p className="text-sm text-emerald-50/90 leading-relaxed">
            Gestiona los expedientes de tus familiares, contrata citas individuales o planes mensuales y sigue cada hito en tiempo real con acompañantes validados en 3 niveles.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('agendar')}
            className="inline-flex items-center gap-2 rounded-xl bg-[#C87D4B] hover:bg-[#b56d3d] text-white px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors"
          >
            <CalendarPlus className="w-4 h-4" />
            Agendar Cita
          </button>
          <button
            type="button"
            onClick={() => onNavigate('expedientes')}
            className="inline-flex items-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 text-white px-4 py-2.5 text-sm font-medium transition-colors"
          >
            <Users className="w-4 h-4" />
            Ver Expedientes
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#E6E3DE] p-5">
          <div className="flex items-center justify-between text-xs font-medium text-[#6B7078]">
            <span>Saldo de Plan Activo</span>
            <CreditCard className="w-4 h-4 text-[#2E5A4C]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#33363B]">{remainingCredits}</span>
            <span className="text-xs text-[#6B7078]">de {plan.totalCredits} citas disponibles</span>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-[#F8F6F2] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#2E5A4C] transition-all"
              style={{ width: `${Math.round((remainingCredits / plan.totalCredits) * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-[#6B7078]">{plan.name}</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E6E3DE] p-5">
          <div className="flex items-center justify-between text-xs font-medium text-[#6B7078]">
            <span>Expedientes Registrados</span>
            <ClipboardList className="w-4 h-4 text-[#2E5A4C]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#33363B]">{people.length}</div>
          <p className="mt-2 text-xs text-[#4B4F56]">
            {people.map((p) => p.fullName.split(' ').slice(0, 2).join(' ')).join(' · ')}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E6E3DE] p-5">
          <div className="flex items-center justify-between text-xs font-medium text-[#6B7078]">
            <span>Citas Completadas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#33363B]">{completedCount}</div>
          <p className="mt-2 text-xs text-emerald-700 font-medium">100% con acta de entrega y sin incidentes</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E6E3DE] p-5">
          <div className="flex items-center justify-between text-xs font-medium text-[#6B7078]">
            <span>Acompañantes Certificados</span>
            <ShieldCheck className="w-4 h-4 text-[#C87D4B]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#33363B]">
            {companions.filter((c) => c.status === 'approved').length}
          </div>
          <p className="mt-2 text-xs text-[#4B4F56]">Disponibles en León con 3 insignias activas</p>
        </div>
      </div>

      {/* Active Appointment Highlight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E6E3DE] p-5 sm:p-6 flex flex-col justify-between gap-4">
          {activeAppointment && activePerson && activeCompanion ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Acompañamiento en curso · {MILESTONE_LABELS[activeAppointment.milestone]}
                  </span>
                  <h2 className="text-lg font-bold text-[#33363B] mt-2.5">
                    {activePerson.fullName} → {activeAppointment.destinationName}
                  </h2>
                  <p className="text-xs text-[#6B7078] mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C87D4B]" />
                    {activeAppointment.destinationZone} · Traslado: {activeAppointment.transportMode}
                  </p>
                </div>

                <div className="rounded-xl bg-[#F8F6F2] border border-[#E6E3DE] px-3.5 py-2 text-center">
                  <span className="block text-[10px] font-mono-code uppercase tracking-wider text-[#6B7078]">
                    PIN Seguridad
                  </span>
                  <span className="font-mono-code text-lg font-bold tracking-widest text-[#2E5A4C]">
                    {activeAppointment.pinCode}
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-[#F8F6F2] border border-[#E6E3DE] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2E5A4C] text-white font-bold text-sm flex items-center justify-center shrink-0">
                    {activeCompanion.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#33363B]">{activeCompanion.fullName}</p>
                    <p className="text-xs text-[#6B7078] mb-1">
                      ★ {activeCompanion.rating} · {activeCompanion.completedServices} servicios
                    </p>
                    <BadgeRow badges={activeCompanion.badges} compact />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('seguimiento')}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#2E5A4C] hover:bg-[#23473b] text-white px-4 py-2.5 text-xs font-semibold transition-colors shrink-0"
                >
                  <Activity className="w-4 h-4" />
                  Abrir Seguimiento en Vivo
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          ) : (
            <div className="py-8 text-center space-y-3">
              <p className="text-sm font-semibold text-[#33363B]">No hay citas en curso en este momento</p>
              <p className="text-xs text-[#6B7078]">
                Agenda una cita única o utiliza uno de los créditos de tu {plan.name}.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('agendar')}
                className="inline-flex items-center gap-2 rounded-xl bg-[#2E5A4C] text-white px-4 py-2 text-xs font-semibold"
              >
                <CalendarPlus className="w-4 h-4" />
                Agendar nueva cita
              </button>
            </div>
          )}
        </div>

        {/* Últimos avisos WhatsApp */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E6E3DE] p-5 sm:p-6 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#33363B]">Últimos Avisos Automáticos (WhatsApp)</h3>
            <span className="text-[11px] font-mono-code text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Activo
            </span>
          </div>

          <div className="space-y-2.5">
            {(activeAppointment?.whatsappFeed ?? appointments[0]?.whatsappFeed ?? [])
              .slice(-3)
              .map((msg) => (
                <div
                  key={msg.id}
                  className="rounded-xl bg-[#E8F0ED]/55 border border-[#2E5A4C]/15 p-3 text-xs text-[#33363B]"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono-code text-[#6B7078] mb-1">
                    <span>Para: {msg.recipient}</span>
                    <span>{msg.timestamp} h</span>
                  </div>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              ))}
          </div>

          <button
            type="button"
            onClick={() => onNavigate('planes')}
            className="text-xs font-semibold text-[#2E5A4C] hover:underline flex items-center gap-1 self-start"
          >
            Ver historial de actas y evaluaciones
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
