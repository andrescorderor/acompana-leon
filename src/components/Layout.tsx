import {
  Activity,
  CalendarPlus,
  CreditCard,
  LayoutDashboard,
  Menu,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAppState } from '../context/AppStateContext';
import type { Role } from '../types';
import type { ApoderadoTab } from './apoderado/ApoderadoDashboard';

interface LayoutProps {
  apoderadoTab: ApoderadoTab;
  onApoderadoTab: (tab: ApoderadoTab) => void;
  onOpenEmergency: () => void;
  children: React.ReactNode;
}

const ROLE_OPTIONS: { id: Role; label: string; short: string }[] = [
  { id: 'apoderado', label: 'Apoderado / Familiar', short: 'Apoderado' },
  { id: 'acompanante', label: 'Acompañante', short: 'Acompañante' },
  { id: 'admin', label: 'Admin Validación', short: 'Admin' },
];

export function Layout({ apoderadoTab, onApoderadoTab, onOpenEmergency, children }: LayoutProps) {
  const { role, setRole, companions, resetDemo } = useAppState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingCount = companions.filter((c) => c.status === 'pending').length;

  const navItems: { id: ApoderadoTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'resumen', label: 'Panel Familiar', icon: LayoutDashboard },
    { id: 'expedientes', label: 'Expedientes', icon: Users },
    { id: 'agendar', label: 'Agendar Cita', icon: CalendarPlus },
    { id: 'seguimiento', label: 'Seguimiento en Vivo', icon: Activity },
    { id: 'planes', label: 'Planes e Historial', icon: CreditCard },
  ];

  const handleSelectTab = (tab: ApoderadoTab) => {
    setRole('apoderado');
    onApoderadoTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F8F6F2] text-[#33363B]">
      {/* Sidebar Desktop + Drawer Mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#E6E3DE] flex flex-col justify-between p-4 transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-5">
          <div className="flex items-center justify-between px-1">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#2E5A4C] text-white flex items-center justify-center font-bold text-sm">
                  AL
                </div>
                <div>
                  <span className="block text-base font-bold tracking-tight text-[#33363B]">
                    Acompaña <span className="text-[#2E5A4C]">León</span>
                  </span>
                  <span className="block text-[10px] font-mono-code uppercase tracking-wider text-[#6B7078]">
                    Nombre Provisional
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-[#F8F6F2]"
              aria-label="Cerrar menú"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="rounded-xl bg-[#F8F6F2] border border-[#E6E3DE] px-3 py-2 text-[11px] text-[#4B4F56]">
            Tecnología por <strong className="text-[#2E5A4C]">Uanify</strong> · Piloto León, Gto.
          </div>

          {/* Navegación contextual */}
          <div className="space-y-1">
            <p className="px-2 text-[10px] font-mono-code uppercase tracking-widest text-[#6B7078] mb-1.5">
              {role === 'apoderado'
                ? 'Portal Apoderado'
                : role === 'acompanante'
                  ? 'Portal Acompañante'
                  : 'Torre Admin'}
            </p>

            {role === 'apoderado' &&
              navItems.map((item) => {
                const Icon = item.icon;
                const active = apoderadoTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      active
                        ? 'bg-[#2E5A4C] text-white'
                        : 'text-[#4B4F56] hover:bg-[#F8F6F2]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

            {role === 'acompanante' && (
              <div className="rounded-xl bg-[#E8F0ED]/60 border border-[#2E5A4C]/20 p-3 text-xs text-[#2E5A4C] space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" /> Modo Acompañante
                </p>
                <p className="text-[11px] text-[#4B4F56]">
                  Valida PIN de recogida, actualiza hitos y cierra actas de entrega.
                </p>
              </div>
            )}

            {role === 'admin' && (
              <div className="rounded-xl bg-[#E8F0ED]/60 border border-[#2E5A4C]/20 p-3 text-xs text-[#2E5A4C] space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Modo Validación
                </p>
                <p className="text-[11px] text-[#4B4F56]">
                  Audita KYC, referencias y certificación 40h antes de activar perfiles.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-[#E6E3DE]">
          <button
            type="button"
            onClick={onOpenEmergency}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white py-2.5 px-3 text-xs font-bold transition-colors"
          >
            <ShieldAlert className="w-4 h-4" />
            Protocolo Emergencia 911
          </button>

          <button
            type="button"
            onClick={resetDemo}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-[#E6E3DE] hover:bg-[#F8F6F2] text-[#4B4F56] py-2 px-3 text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restablecer Demo
          </button>
        </div>
      </aside>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar con selector de 3 roles */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#E6E3DE] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-[#E6E3DE] hover:bg-[#F8F6F2]"
              aria-label="Abrir menú"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="text-xs">
              <span className="font-semibold text-[#33363B]">Prototipo Interactivo MVP</span>
              <span className="hidden sm:inline text-[#6B7078]"> · Cambia de vista para probar los 3 roles</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-[#F8F6F2] p-1 rounded-xl border border-[#E6E3DE]">
            {ROLE_OPTIONS.map((opt) => {
              const active = role === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setRole(opt.id)}
                  className={`relative rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition-all ${
                    active
                      ? 'bg-[#2E5A4C] text-white shadow-xs'
                      : 'text-[#4B4F56] hover:text-[#33363B]'
                  }`}
                >
                  <span className="hidden sm:inline">{opt.label}</span>
                  <span className="sm:hidden">{opt.short}</span>
                  {opt.id === 'admin' && pendingCount > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-[#C87D4B] text-white text-[10px] w-4 h-4">
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
