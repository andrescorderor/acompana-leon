import { AlertTriangle, PhoneCall, ShieldAlert, X } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  personName?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

export function EmergencyModal({
  isOpen,
  onClose,
  personName = 'Don Roberto López',
  emergencyContact = 'Mariana López',
  emergencyPhone = '477 214 8890',
}: EmergencyModalProps) {
  if (!isOpen) return null;

  const steps = [
    'Detén el recorrido en un lugar seguro y acompaña sin dejarlo solo.',
    'Llama al 911 si hay caída, mareo severo o falta de aire.',
    'Avisa al familiar autorizado con tu ubicación exacta.',
    'No administres medicamentos ni realices maniobras clínicas.',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-title"
    >
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-[440px] shadow-2xl overflow-hidden animate-sheet-up">
        <div className="bg-red-600 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <h2 id="emergency-title" className="text-base font-bold">
              Protocolo de Emergencia
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 min-w-10 rounded-full hover:bg-white/15 flex items-center justify-center"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[82dvh] overflow-y-auto">
          <div className="grid grid-cols-1 gap-2.5">
            <a
              href="tel:911"
              className="min-h-14 flex items-center justify-center gap-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-base font-bold shadow-sm transition-colors"
            >
              <PhoneCall className="w-5 h-5" />
              Llamar ahora al 911
            </a>
            <a
              href={`tel:${emergencyPhone.replace(/\s+/g, '')}`}
              className="min-h-12 flex items-center justify-center gap-2 rounded-2xl bg-[#244B3E] hover:bg-[#1b3a30] text-white text-sm font-bold transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              Llamar a {emergencyContact} ({emergencyPhone})
            </a>
          </div>

          <div className="rounded-2xl bg-amber-50 border border-amber-200 px-3.5 py-2.5 flex items-center gap-2 text-xs text-amber-950 font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Asistido: {personName}</span>
          </div>

          <ol className="space-y-2">
            {steps.map((text, i) => (
              <li
                key={text}
                className="flex items-start gap-2.5 rounded-xl bg-[#F8F6F2] border border-[#E4E1DA] px-3.5 py-2.5 text-sm text-[#1C2024]"
              >
                <span className="font-mono-code text-xs font-bold text-red-700 bg-red-100 rounded-md px-1.5 py-0.5 shrink-0 mt-0.5">
                  0{i + 1}
                </span>
                <span className="leading-snug">{text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
