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
  personName = 'Don Roberto López Ramírez',
  emergencyContact = 'Mariana López',
  emergencyPhone = '477 214 8890',
}: EmergencyModalProps) {
  if (!isOpen) return null;

  const steps = [
    {
      num: '01',
      title: 'Detenerse y asegurar el entorno',
      desc: 'Si hay traslado en curso, estacionar en lugar seguro sin movimientos bruscos. Mantener calma y acompañar al adulto mayor sin dejarlo solo en ningún momento.',
    },
    {
      num: '02',
      title: 'Evaluar y marcar al 911 (México)',
      desc: 'Ante caída con dolor agudo, dificultad respiratoria, desmayo o desorientación severa, llamar de inmediato al 911 indicando ubicación exacta en León, Gto.',
    },
    {
      num: '03',
      title: 'Notificar al Apoderado Autorizado',
      desc: `Contactar a ${emergencyContact} (${emergencyPhone}) y enviar ubicación en vivo + bitácora del incidente.`,
    },
    {
      num: '04',
      title: 'Límite estricto No-Médico',
      desc: 'PROHIBIDO administrar medicamentos, diagnosticar o realizar maniobras clínicas para las que no esté autorizado. Esperar a paramédicos o familiar.',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-title"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-red-200 overflow-hidden animate-fade-in">
        <div className="bg-red-700 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <div>
              <p className="text-[11px] font-mono-code uppercase tracking-wider text-red-100">
                Protocolo Oficial de Seguridad
              </p>
              <h2 id="emergency-title" className="text-base font-bold">
                Emergencia y Activación 911
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/15 transition-colors"
            aria-label="Cerrar protocolo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
            <div>
              <strong>Asistido en foco:</strong> {personName}. En caso de incidente real, el acompañante no abandona al usuario bajo ninguna circunstancia.
            </div>
          </div>

          <div className="space-y-2.5">
            {steps.map((s) => (
              <div key={s.num} className="flex gap-3 p-3 rounded-xl bg-[#F8F6F2] border border-[#E6E3DE]">
                <span className="font-mono-code text-xs font-bold text-red-700 bg-red-100 h-6 px-2 rounded-md flex items-center shrink-0">
                  {s.num}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-[#33363B]">{s.title}</h3>
                  <p className="text-xs text-[#4B4F56] mt-0.5 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <a
              href="tel:911"
              className="flex items-center justify-center gap-2 rounded-xl bg-red-700 text-white py-2.5 px-4 text-xs font-semibold hover:bg-red-800 transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              Llamar 911 Emergencias
            </a>
            <a
              href={`tel:${emergencyPhone.replace(/\s+/g, '')}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#2E5A4C] text-white py-2.5 px-4 text-xs font-semibold hover:bg-[#24483d] transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              Llamar a {emergencyContact}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
