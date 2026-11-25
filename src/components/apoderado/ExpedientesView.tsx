import { useState } from 'react';
import { AlertTriangle, Edit3, HeartHandshake, MapPin, Plus, UserCheck, X } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import type { AssistedPerson, MobilityLevel } from '../../types';

const MOBILITY_LABELS: Record<MobilityLevel, { badge: string; desc: string; color: string }> = {
  1: {
    badge: 'Nivel 1 · Independiente',
    desc: 'Camina solo; requiere compañía y guía.',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  2: {
    badge: 'Nivel 2 · Movilidad Asistida',
    desc: 'Usa bastón o andador; apoyo suave.',
    color: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  3: {
    badge: 'Nivel 3 · Atención Médica',
    desc: 'Requiere camilla o personal clínico.',
    color: 'bg-red-50 text-red-800 border-red-200',
  },
};

export function ExpedientesView() {
  const { people, savePerson } = useAppState();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);

  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState(75);
  const [neighborhood, setNeighborhood] = useState('Jardines del Moral');
  const [address, setAddress] = useState('');
  const [mobilityLevel, setMobilityLevel] = useState<MobilityLevel>(2);
  const [aidsText, setAidsText] = useState('Bastón');
  const [dignityNotes, setDignityNotes] = useState('');
  const [receiversText, setReceiversText] = useState('Mariana López (Hija)');
  const [emergencyPhone, setEmergencyPhone] = useState('477 214 8890');

  const openCreate = () => {
    setEditingId(undefined);
    setFullName('');
    setAge(75);
    setNeighborhood('Jardines del Moral');
    setAddress('');
    setMobilityLevel(2);
    setAidsText('Bastón');
    setDignityNotes('');
    setReceiversText('Mariana López (Hija)');
    setEmergencyPhone('477 214 8890');
    setModalOpen(true);
  };

  const openEdit = (p: AssistedPerson) => {
    setEditingId(p.id);
    setFullName(p.fullName);
    setAge(p.age);
    setNeighborhood(p.neighborhood);
    setAddress(p.address);
    setMobilityLevel(p.mobilityLevel);
    setAidsText(p.mobilityAids.join(', '));
    setDignityNotes(p.dignityNotes);
    setReceiversText(p.authorizedReceivers.join(', '));
    setEmergencyPhone(p.emergencyPhone);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobilityLevel === 3) return;
    savePerson({
      id: editingId,
      fullName: fullName.trim(),
      age: Number(age),
      relationship: 'Familiar',
      neighborhood: neighborhood.trim(),
      address: address.trim(),
      mobilityLevel,
      mobilityAids: aidsText.split(',').map((s) => s.trim()).filter(Boolean),
      dignityNotes: dignityNotes.trim(),
      authorizedReceivers: receiversText.split(',').map((s) => s.trim()).filter(Boolean),
      emergencyContact: receiversText.split(',')[0]?.trim() || 'Familiar',
      emergencyPhone: emergencyPhone.trim(),
      nonMedicalConsent: true,
    });
    setModalOpen(false);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-[#1C2024]">Mi Familia</h2>
          <p className="text-xs text-[#555B63]">Expedientes y personas autorizadas para recibir.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="min-h-11 rounded-2xl bg-[#244B3E] text-white px-4 text-xs font-bold flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Agregar
        </button>
      </div>

      <div className="space-y-3">
        {people.map((person) => {
          const meta = MOBILITY_LABELS[person.mobilityLevel];
          return (
            <div key={person.id} className="bg-white rounded-3xl border border-[#E4E1DA] p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full border ${meta.color}`}>
                    {meta.badge}
                  </span>
                  <h3 className="text-lg font-bold text-[#1C2024] mt-1.5">{person.fullName}</h3>
                  <p className="text-xs text-[#555B63]">
                    {person.age} años · {person.neighborhood}, León
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openEdit(person)}
                  className="min-h-11 px-3 rounded-xl border border-[#E4E1DA] text-xs font-bold text-[#1C2024] flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Editar
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {person.mobilityAids.map((aid) => (
                  <span
                    key={aid}
                    className="rounded-full bg-[#F8F6F2] border border-[#E4E1DA] px-3 py-1 text-xs font-semibold text-[#1C2024]"
                  >
                    {aid}
                  </span>
                ))}
              </div>

              {person.dignityNotes && (
                <div className="rounded-2xl bg-[#E8F0ED]/60 border border-[#244B3E]/15 p-3 text-xs text-[#1F3F35] flex items-start gap-2">
                  <HeartHandshake className="w-4 h-4 text-[#244B3E] shrink-0 mt-0.5" />
                  <p className="leading-snug">{person.dignityNotes}</p>
                </div>
              )}

              <div className="text-xs text-[#4B4F56] space-y-1 pt-1">
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C87D4B] shrink-0" />
                  <span className="truncate">{person.address}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#244B3E] shrink-0" />
                  <span>Reciben: {person.authorizedReceivers.join(', ')}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Sheet Expediente */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-[440px] shadow-2xl overflow-hidden animate-sheet-up">
            <div className="px-5 py-4 bg-[#244B3E] text-white flex items-center justify-between">
              <h3 className="text-base font-bold">
                {editingId ? 'Editar familiar' : 'Nuevo familiar'}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)} className="p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 max-h-[82dvh] overflow-y-auto">
              <div className="grid grid-cols-3 gap-2.5">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-[#555B63] mb-1">Nombre *</label>
                  <input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej. Sra. Carmen Navarro"
                    className="w-full min-h-11 rounded-2xl border border-[#E4E1DA] px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#555B63] mb-1">Edad *</label>
                  <input
                    type="number"
                    required
                    min={18}
                    max={110}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full min-h-11 rounded-2xl border border-[#E4E1DA] px-3 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#555B63] mb-1">Colonia y Domicilio en León *</label>
                <input
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Calle, número y colonia"
                  className="w-full min-h-11 rounded-2xl border border-[#E4E1DA] px-3 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#555B63]">Nivel de Movilidad *</label>
                <div className="space-y-1.5">
                  {([1, 2, 3] as MobilityLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setMobilityLevel(lvl)}
                      className={`w-full text-left rounded-2xl border px-3.5 py-2.5 text-xs ${
                        mobilityLevel === lvl
                          ? lvl === 3
                            ? 'border-red-500 bg-red-50'
                            : 'border-[#244B3E] bg-[#E8F0ED]/60'
                          : 'border-[#E4E1DA]'
                      }`}
                    >
                      <strong className="block text-[#1C2024]">{MOBILITY_LABELS[lvl].badge}</strong>
                      <span className="text-[#555B63]">{MOBILITY_LABELS[lvl].desc}</span>
                    </button>
                  ))}
                </div>

                {mobilityLevel === 3 && (
                  <div className="rounded-2xl bg-red-50 border border-red-200 p-3 flex items-start gap-2 text-xs text-red-900">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Fuera de alcance no-médico:</strong> este caso requiere ambulancia o personal clínico.
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-[#555B63] mb-1">Apoyos</label>
                  <input
                    value={aidsText}
                    onChange={(e) => setAidsText(e.target.value)}
                    placeholder="Bastón, Andador"
                    className="w-full min-h-11 rounded-2xl border border-[#E4E1DA] px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#555B63] mb-1">Tel. emergencia</label>
                  <input
                    required
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full min-h-11 rounded-2xl border border-[#E4E1DA] px-3 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#555B63] mb-1">¿Quiénes pueden recibirlo?</label>
                <input
                  required
                  value={receiversText}
                  onChange={(e) => setReceiversText(e.target.value)}
                  className="w-full min-h-11 rounded-2xl border border-[#E4E1DA] px-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#555B63] mb-1">Nota de trato digno</label>
                <input
                  value={dignityNotes}
                  onChange={(e) => setDignityNotes(e.target.value)}
                  placeholder="Ej. Caminar sin prisas; preguntar antes de ayudar"
                  className="w-full min-h-11 rounded-2xl border border-[#E4E1DA] px-3 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={mobilityLevel === 3}
                className="w-full min-h-13 rounded-2xl bg-[#244B3E] disabled:bg-zinc-300 text-white text-sm font-bold"
              >
                Guardar Expediente
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
