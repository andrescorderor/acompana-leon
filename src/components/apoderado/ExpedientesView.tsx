import { useState } from 'react';
import { AlertTriangle, Edit3, HeartHandshake, MapPin, Phone, Plus, ShieldCheck, UserCheck, X } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import type { AssistedPerson, MobilityLevel } from '../../types';

const MOBILITY_LABELS: Record<MobilityLevel, { badge: string; title: string; color: string }> = {
  1: {
    badge: 'Nivel 1 · Independiente',
    title: 'Camina y sube sin apoyo físico; requiere compañía y guía en trámites',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  2: {
    badge: 'Nivel 2 · Movilidad Asistida',
    title: 'Usa bastón, andador o requiere apoyo suave para ascensos, descensos y pausas',
    color: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  3: {
    badge: 'Nivel 3 · Atención Médica Especializada',
    title: 'Requiere camilla, oxígeno o personal clínico (Fuera de alcance no-médico)',
    color: 'bg-red-50 text-red-800 border-red-200',
  },
};

export function ExpedientesView() {
  const { people, savePerson } = useAppState();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);

  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState(75);
  const [relationship, setRelationship] = useState('Padre / Madre');
  const [neighborhood, setNeighborhood] = useState('Jardines del Moral');
  const [address, setAddress] = useState('');
  const [mobilityLevel, setMobilityLevel] = useState<MobilityLevel>(2);
  const [aidsText, setAidsText] = useState('Bastón');
  const [dignityNotes, setDignityNotes] = useState('');
  const [receiversText, setReceiversText] = useState('Mariana López (Hija)');
  const [emergencyContact, setEmergencyContact] = useState('Mariana López');
  const [emergencyPhone, setEmergencyPhone] = useState('477 214 8890');
  const [nonMedicalConsent, setNonMedicalConsent] = useState(true);

  const openCreate = () => {
    setEditingId(undefined);
    setFullName('');
    setAge(75);
    setRelationship('Padre / Madre');
    setNeighborhood('Jardines del Moral');
    setAddress('');
    setMobilityLevel(2);
    setAidsText('Bastón');
    setDignityNotes('');
    setReceiversText('Mariana López (Hija)');
    setEmergencyContact('Mariana López');
    setEmergencyPhone('477 214 8890');
    setNonMedicalConsent(true);
    setModalOpen(true);
  };

  const openEdit = (p: AssistedPerson) => {
    setEditingId(p.id);
    setFullName(p.fullName);
    setAge(p.age);
    setRelationship(p.relationship);
    setNeighborhood(p.neighborhood);
    setAddress(p.address);
    setMobilityLevel(p.mobilityLevel);
    setAidsText(p.mobilityAids.join(', '));
    setDignityNotes(p.dignityNotes);
    setReceiversText(p.authorizedReceivers.join(', '));
    setEmergencyContact(p.emergencyContact);
    setEmergencyPhone(p.emergencyPhone);
    setNonMedicalConsent(p.nonMedicalConsent);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobilityLevel === 3 || !nonMedicalConsent) return;
    savePerson({
      id: editingId,
      fullName: fullName.trim(),
      age: Number(age),
      relationship: relationship.trim(),
      neighborhood: neighborhood.trim(),
      address: address.trim(),
      mobilityLevel,
      mobilityAids: aidsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      dignityNotes: dignityNotes.trim(),
      authorizedReceivers: receiversText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      emergencyContact: emergencyContact.trim(),
      emergencyPhone: emergencyPhone.trim(),
      nonMedicalConsent,
    });
    setModalOpen(false);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#33363B]">Expedientes de Personas Asistidas</h2>
          <p className="text-xs text-[#6B7078] mt-0.5">
            Ficha de movilidad, preferencias de trato digno y personas autorizadas para entrega (Privacidad LFPDPPP: solo datos esenciales).
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2E5A4C] hover:bg-[#23473b] text-white px-4 py-2.5 text-xs font-semibold transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Nuevo Expediente
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {people.map((person) => {
          const levelMeta = MOBILITY_LABELS[person.mobilityLevel];
          return (
            <div
              key={person.id}
              className="bg-white rounded-2xl border border-[#E6E3DE] p-5 sm:p-6 flex flex-col justify-between gap-4 shadow-2xs"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${levelMeta.color}`}>
                      {levelMeta.badge}
                    </span>
                    <h3 className="text-lg font-bold text-[#33363B] mt-2">{person.fullName}</h3>
                    <p className="text-xs text-[#6B7078]">
                      {person.age} años · {person.relationship} · {person.neighborhood}, León
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openEdit(person)}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#E6E3DE] px-2.5 py-1.5 text-xs font-medium text-[#4B4F56] hover:bg-[#F8F6F2]"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Editar
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {person.mobilityAids.map((aid) => (
                    <span
                      key={aid}
                      className="rounded-lg bg-[#F8F6F2] border border-[#E6E3DE] px-2.5 py-1 text-xs font-medium text-[#33363B]"
                    >
                      {aid}
                    </span>
                  ))}
                </div>

                <div className="rounded-xl bg-[#E8F0ED]/50 border border-[#2E5A4C]/15 p-3.5 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2E5A4C]">
                    <HeartHandshake className="w-3.5 h-3.5" />
                    Notas de Trato Digno y Autonomía
                  </div>
                  <p className="text-xs text-[#33363B] leading-relaxed">{person.dignityNotes}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl bg-[#F8F6F2] p-3 border border-[#E6E3DE]">
                    <span className="text-[11px] text-[#6B7078] flex items-center gap-1 font-medium">
                      <MapPin className="w-3 h-3 text-[#C87D4B]" /> Domicilio de recogida
                    </span>
                    <p className="mt-1 text-[#33363B] font-medium">{person.address}</p>
                  </div>
                  <div className="rounded-xl bg-[#F8F6F2] p-3 border border-[#E6E3DE]">
                    <span className="text-[11px] text-[#6B7078] flex items-center gap-1 font-medium">
                      <Phone className="w-3 h-3 text-[#2E5A4C]" /> Contacto de emergencia
                    </span>
                    <p className="mt-1 text-[#33363B] font-medium">
                      {person.emergencyContact} · {person.emergencyPhone}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7078] flex items-center gap-1 mb-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#2E5A4C]" /> Personas autorizadas para recibirlo
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {person.authorizedReceivers.map((r) => (
                      <span
                        key={r}
                        className="rounded-full bg-white border border-[#E6E3DE] px-2.5 py-0.5 text-[11px] font-medium text-[#4B4F56]"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E6E3DE] flex items-center justify-between text-[11px] text-[#6B7078]">
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Consentimiento de alcance no-médico firmado
                </span>
                <span>ID: {person.id}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Crear / Editar Expediente */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-[#E6E3DE] overflow-hidden animate-fade-in">
            <div className="px-6 py-4 bg-[#2E5A4C] text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">
                  {editingId ? 'Editar Expediente del Asistido' : 'Nuevo Expediente Familiar'}
                </h3>
                <p className="text-xs text-emerald-100">
                  Recopilamos solo información necesaria para brindar un acompañamiento seguro y respetuoso.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/15"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#33363B] mb-1">
                    Nombre completo del asistido *
                  </label>
                  <input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej. Sra. Carmen Navarro"
                    className="w-full rounded-xl border border-[#E6E3DE] px-3 py-2 text-sm focus:border-[#2E5A4C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#33363B] mb-1">Edad *</label>
                  <input
                    type="number"
                    min={18}
                    max={110}
                    required
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#E6E3DE] px-3 py-2 text-sm focus:border-[#2E5A4C] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#33363B] mb-1">Parentesco / Relación</label>
                  <input
                    required
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full rounded-xl border border-[#E6E3DE] px-3 py-2 text-sm focus:border-[#2E5A4C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#33363B] mb-1">Colonia / Zona en León</label>
                  <input
                    required
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full rounded-xl border border-[#E6E3DE] px-3 py-2 text-sm focus:border-[#2E5A4C] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#33363B] mb-1">Domicilio completo *</label>
                <input
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Calle, número, colonia y referencias en León, Gto."
                  className="w-full rounded-xl border border-[#E6E3DE] px-3 py-2 text-sm focus:border-[#2E5A4C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#33363B] mb-1.5">
                  Clasificación de Movilidad (Filtro de Seguridad) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {([1, 2, 3] as MobilityLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setMobilityLevel(lvl)}
                      className={`text-left rounded-xl border p-3 transition-all ${
                        mobilityLevel === lvl
                          ? lvl === 3
                            ? 'border-red-500 bg-red-50'
                            : 'border-[#2E5A4C] bg-[#E8F0ED]/60'
                          : 'border-[#E6E3DE] hover:bg-[#F8F6F2]'
                      }`}
                    >
                      <span className="block text-xs font-bold text-[#33363B]">
                        {MOBILITY_LABELS[lvl].badge}
                      </span>
                      <span className="block text-[11px] text-[#6B7078] mt-1 leading-snug">
                        {MOBILITY_LABELS[lvl].title}
                      </span>
                    </button>
                  ))}
                </div>

                {mobilityLevel === 3 && (
                  <div className="mt-3 rounded-xl bg-red-50 border border-red-200 p-3.5 flex items-start gap-2.5 text-xs text-red-900">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Servicio fuera de alcance no-médico:</strong> Para personas que requieren camilla, oxígeno continuo o personal sanitario durante el traslado, nuestra plataforma canaliza a servicios de ambulancia o enfermería certificada para proteger la seguridad del paciente.
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#33363B] mb-1">
                    Apoyos de movilidad (separados por coma)
                  </label>
                  <input
                    value={aidsText}
                    onChange={(e) => setAidsText(e.target.value)}
                    placeholder="Bastón, Andador plegable, Lentes"
                    className="w-full rounded-xl border border-[#E6E3DE] px-3 py-2 text-sm focus:border-[#2E5A4C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#33363B] mb-1">
                    Personas autorizadas para recibirlo
                  </label>
                  <input
                    required
                    value={receiversText}
                    onChange={(e) => setReceiversText(e.target.value)}
                    className="w-full rounded-xl border border-[#E6E3DE] px-3 py-2 text-sm focus:border-[#2E5A4C] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#33363B] mb-1">
                  Notas de trato digno y preferencias
                </label>
                <textarea
                  rows={2}
                  value={dignityNotes}
                  onChange={(e) => setDignityNotes(e.target.value)}
                  placeholder="Ej. Prefiere caminar sin prisas; preguntar antes de tomar del brazo."
                  className="w-full rounded-xl border border-[#E6E3DE] px-3 py-2 text-sm focus:border-[#2E5A4C] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#33363B] mb-1">Contacto de emergencia *</label>
                  <input
                    required
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    className="w-full rounded-xl border border-[#E6E3DE] px-3 py-2 text-sm focus:border-[#2E5A4C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#33363B] mb-1">Teléfono emergencia *</label>
                  <input
                    required
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full rounded-xl border border-[#E6E3DE] px-3 py-2 text-sm focus:border-[#2E5A4C] focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex items-start gap-2.5 text-xs text-[#4B4F56] bg-[#F8F6F2] p-3 rounded-xl border border-[#E6E3DE]">
                <input
                  type="checkbox"
                  checked={nonMedicalConsent}
                  onChange={(e) => setNonMedicalConsent(e.target.checked)}
                  className="mt-0.5 accent-[#2E5A4C]"
                />
                <span>
                  Confirmo que el servicio solicitado es de <strong>acompañamiento, movilidad y gestión no-médica</strong> (el acompañante no administra medicamentos ni realiza procedimientos clínicos).
                </span>
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-[#E6E3DE] px-4 py-2 text-xs font-semibold text-[#4B4F56] hover:bg-[#F8F6F2]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={mobilityLevel === 3 || !nonMedicalConsent}
                  className="rounded-xl bg-[#2E5A4C] disabled:bg-zinc-300 disabled:cursor-not-allowed text-white px-5 py-2 text-xs font-semibold hover:bg-[#23473b] transition-colors"
                >
                  Guardar Expediente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
