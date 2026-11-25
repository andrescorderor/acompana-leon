import {
  Activity,
  CalendarPlus,
  CreditCard,
  Home,
  PhoneCall,
  RotateCcw,
  ShieldCheck,
  UserCheck,
  Users,
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import type { Role } from '../types';
import type { ApoderadoTab } from './apoderado/ApoderadoDashboard';

interface LayoutProps {
  apoderadoTab: ApoderadoTab;
  onApoderadoTab: (tab: ApoderadoTab) => void;
  onOpenEmergency: () => void;
  children: React.ReactNode;
}

const ROLE_OPTIONS: {
  id: Role;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'apoderado', label: 'Familiar', icon: Users },
  { id: 'acompanante', label: 'Acompañante', icon: UserCheck },
  { id: 'admin', label: 'Admin', icon: ShieldCheck },
];

export function Layout({ apoderadoTab, onApoderadoTab, onOpenEmergency, children }: LayoutProps) {
  const { role, setRole, companions, appointments, resetDemo } = useAppState();

  const pendingCount = companions.filter((c) => c.status === 'pending').length;
  const hasActiveAppointment = appointments.some((a) => a.status === 'active');

  const navItems: {
    id: ApoderadoTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    featured?: boolean;
  }[] = [
    { id: 'resumen', label: 'Inicio', icon: Home },
    { id: 'seguimiento', label: 'En Vivo', icon: Activity },
    { id: 'agendar', label: 'Agendar', icon: CalendarPlus, featured: true },
    { id: 'expedientes', label: 'Familia', icon: Users },
    { id: 'planes', label: 'Planes', icon: CreditCard },
  ];

  return (
    <div className="min-h-dvh w-full bg-[#ECE9E2] flex justify-center">
      {/* Contenedor Mobile-First: pantalla completa en móvil, marco tipo app en escritorio */}
      <div className="w-full sm:max-w-[460px] min-h-dvh bg-[#F8F6F2] text-[#1C2024] sm:shadow-2xl sm:border-x sm:border-[#DFDBD2] flex flex-col relative">
        {/* Header compacto fijo */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E4E1DA] px-4 pt-3 pb-2.5 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#244B3E] text-white flex items-center justify-center font-bold text-sm shrink-0">
                AL
              </div>
              <div className="min-w-0">
                <span className="block text-base font-bold tracking-tight text-[#1C2024] leading-tight truncate">
                  Acompaña León
                </span>
                <span className="block text-[11px] font-medium text-[#555B63] truncate">
                  by Uanify · Piloto móvil
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={resetDemo}
                title="Restablecer datos de demostración"
                aria-label="Restablecer demo"
                className="min-h-11 min-w-11 rounded-full border border-[#E4E1DA] bg-[#F8F6F2] text-[#4B4F56] hover:bg-[#ECE9E2] flex items-center justify-center transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenEmergency}
                className="min-h-11 px-3.5 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>SOS 911</span>
              </button>
            </div>
          </div>

          {/* Selector segmentado de 3 roles */}
          <div className="grid grid-cols-3 gap-1 bg-[#F1EFE9] p-1 rounded-xl border border-[#E4E1DA]">
            {ROLE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const active = role === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setRole(opt.id)}
                  className={`min-h-10 rounded-lg px-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    active
                      ? 'bg-[#244B3E] text-white shadow-xs'
                      : 'text-[#4B4F56] hover:text-[#1C2024]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{opt.label}</span>
                  {opt.id === 'admin' && pendingCount > 0 && (
                    <span
                      className={`inline-flex items-center justify-center rounded-full text-[10px] font-bold w-4 h-4 ${
                        active ? 'bg-[#C87D4B] text-white' : 'bg-[#C87D4B] text-white'
                      }`}
                    >
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </header>

        {/* Área de contenido principal */}
        <main className={`flex-1 px-4 pt-4 ${role === 'apoderado' ? 'pb-24' : 'pb-8'}`}>
          {children}
        </main>

        {/* Bottom Navigation Bar fija para el rol Familiar */}
        {role === 'apoderado' && (
          <nav
            aria-label="Navegación principal"
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full sm:max-w-[460px] z-30 bg-white/95 backdrop-blur-md border-t border-[#E4E1DA] px-2 py-1.5 grid grid-cols-5 items-center"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = apoderadoTab === item.id;
              if (item.featured) {
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onApoderadoTab(item.id)}
                    className="flex flex-col items-center justify-center gap-0.5 py-1"
                  >
                    <span
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm transition-transform active:scale-95 ${
                        active ? 'bg-[#244B3E] text-white' : 'bg-[#C87D4B] text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </span>
                    <span
                      className={`text-[11px] font-bold ${
                        active ? 'text-[#244B3E]' : 'text-[#1C2024]'
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onApoderadoTab(item.id)}
                  className={`min-h-14 flex flex-col items-center justify-center gap-1 rounded-xl transition-colors relative ${
                    active ? 'text-[#244B3E] font-bold' : 'text-[#555B63] font-medium'
                  }`}
                >
                  <div className="relative">
                    <Icon className="w-5 h-5" />
                    {item.id === 'seguimiento' && hasActiveAppointment && (
                      <span className="absolute -top-0.5 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                    )}
                  </div>
                  <span className="text-[11px] leading-none">{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
}
