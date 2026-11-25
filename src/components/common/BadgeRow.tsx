import { Award, Check, ShieldCheck, UserCheck } from 'lucide-react';
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
      label: compact ? 'Identidad' : 'Identidad KYC',
      icon: ShieldCheck,
    },
    {
      key: 'references',
      active: badges.references,
      label: 'Referencias',
      icon: UserCheck,
    },
    {
      key: 'certified40h',
      active: badges.certified40h,
      label: 'Curso 40h',
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
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold border ${
              item.active
                ? 'bg-[#E8F0ED] text-[#244B3E] border-[#244B3E]/25'
                : 'bg-zinc-100 text-zinc-400 border-zinc-200'
            }`}
          >
            {item.active ? <Check className="w-3 h-3 shrink-0" /> : <Icon className="w-3 h-3 shrink-0" />}
            <span>{item.label}</span>
          </span>
        );
      })}
    </div>
  );
}
