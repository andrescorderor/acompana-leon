import { Award, ShieldCheck, UserCheck } from 'lucide-react';
import type { CompanionBadges } from '../../types';

interface BadgeRowProps {
  badges: CompanionBadges;
  compact?: boolean;
}

export function BadgeRow({ badges, compact = false }: BadgeRowProps) {
  const items = [
    {
      key: 'kyc',
      active: badges.kyc,
      label: compact ? 'KYC' : '1. Identidad KYC',
      title: 'INE, selfie biométrica, comprobante y carta de no antecedentes validados',
      icon: ShieldCheck,
    },
    {
      key: 'references',
      active: badges.references,
      label: compact ? 'Referencias' : '2. Aptitud & Referencias',
      title: 'Entrevista psicosocial, ética y referencias verificadas',
      icon: UserCheck,
    },
    {
      key: 'certified40h',
      active: badges.certified40h,
      label: compact ? 'Cert. 40h' : '3. Certificación 40h + 1os Aux.',
      title: 'Programa 40h de Trato Digno, Movilidad Asistida y Primeros Auxilios',
      icon: Award,
    },
  ];

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <span
            key={item.key}
            title={item.title}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium border transition-colors ${
              item.active
                ? 'bg-[#E8F0ED] text-[#2E5A4C] border-[#2E5A4C]/25'
                : 'bg-zinc-100 text-zinc-400 border-zinc-200'
            }`}
          >
            <Icon className="w-3 h-3 shrink-0" />
            <span>{item.label}</span>
          </span>
        );
      })}
    </div>
  );
}
