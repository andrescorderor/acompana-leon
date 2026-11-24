import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  INITIAL_APPOINTMENTS,
  INITIAL_COMPANIONS,
  INITIAL_PEOPLE,
  INITIAL_PLAN,
  MILESTONE_LABELS,
} from '../data/seedData';
import type {
  Appointment,
  AssistedPerson,
  Companion,
  CompanionBadges,
  CompanionStatus,
  DeliveryAct,
  PlanSubscription,
  Role,
  ServiceEvaluation,
  ServiceModality,
  TransportMode,
} from '../types';

const STORAGE_KEY = 'acompana_leon_mvp_v1';

interface PersistedState {
  role: Role;
  people: AssistedPerson[];
  companions: Companion[];
  appointments: Appointment[];
  plan: PlanSubscription;
  activeCompanionId: string;
}

export interface NewAppointmentInput {
  personId: string;
  companionId: string;
  bookingType: 'single' | 'plan';
  modality: ServiceModality;
  purpose: string;
  destinationName: string;
  destinationZone: string;
  scheduledDate: string;
  scheduledTime: string;
  estimatedHours: number;
  transportMode: TransportMode;
}

export interface NewCompanionInput {
  fullName: string;
  zone: string;
  phone: string;
  experienceYears: number;
  hasOwnCar: boolean;
  carModel?: string;
  bio: string;
  specialties: string[];
}

interface AppContextValue extends PersistedState {
  setRole: (role: Role) => void;
  setActiveCompanionId: (id: string) => void;
  savePerson: (person: Omit<AssistedPerson, 'id'> & { id?: string }) => void;
  scheduleAppointment: (input: NewAppointmentInput) => Appointment;
  advanceMilestone: (appointmentId: string) => void;
  addLogEntry: (appointmentId: string, author: string, message: string) => void;
  completeDeliveryAct: (appointmentId: string, act: DeliveryAct) => void;
  submitEvaluation: (appointmentId: string, evaluation: ServiceEvaluation) => void;
  applyAsCompanion: (input: NewCompanionInput) => Companion;
  reviewCompanion: (id: string, status: CompanionStatus, badges: CompanionBadges) => void;
  activatePlan: (credits: 4 | 8) => void;
  resetDemo: () => void;
}

const DEFAULT_STATE: PersistedState = {
  role: 'apoderado',
  people: INITIAL_PEOPLE,
  companions: INITIAL_COMPANIONS,
  appointments: INITIAL_APPOINTMENTS,
  plan: INITIAL_PLAN,
  activeCompanionId: 'comp-1',
};

function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      role: parsed.role ?? DEFAULT_STATE.role,
      people: parsed.people?.length ? parsed.people : DEFAULT_STATE.people,
      companions: parsed.companions?.length ? parsed.companions : DEFAULT_STATE.companions,
      appointments: parsed.appointments?.length ? parsed.appointments : DEFAULT_STATE.appointments,
      plan: parsed.plan ?? DEFAULT_STATE.plan,
      activeCompanionId: parsed.activeCompanionId ?? DEFAULT_STATE.activeCompanionId,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

const AppStateContext = createContext<AppContextValue | null>(null);

function currentTimeStr(): string {
  const now = new Date();
  return now.toTimeString().slice(0, 5);
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota issues in private browsing
    }
  }, [state]);

  const setRole = (role: Role) => setState((prev) => ({ ...prev, role }));

  const setActiveCompanionId = (activeCompanionId: string) =>
    setState((prev) => ({ ...prev, activeCompanionId }));

  const savePerson = (personInput: Omit<AssistedPerson, 'id'> & { id?: string }) => {
    setState((prev) => {
      if (personInput.id) {
        return {
          ...prev,
          people: prev.people.map((p) => (p.id === personInput.id ? { ...personInput, id: p.id } : p)),
        };
      }
      const created: AssistedPerson = {
        ...personInput,
        id: `per-${Date.now()}`,
      };
      return { ...prev, people: [created, ...prev.people] };
    });
  };

  const scheduleAppointment = (input: NewAppointmentInput): Appointment => {
    const person = state.people.find((p) => p.id === input.personId) ?? state.people[0];
    const companion = state.companions.find((c) => c.id === input.companionId) ?? state.companions[0];
    const pinCode = String(Math.floor(1000 + Math.random() * 9000));
    const singlePrice = input.modality === 'asistida' ? 420 : 320;
    const priceMxn = input.bookingType === 'plan' ? state.plan.pricePerVisitMxn : singlePrice;
    const platformFeeMxn = Math.round(priceMxn * 0.18);
    const nowTime = currentTimeStr();

    const created: Appointment = {
      id: `cita-${Date.now()}`,
      personId: person.id,
      companionId: companion.id,
      bookingType: input.bookingType,
      modality: input.modality,
      purpose: input.purpose,
      destinationName: input.destinationName,
      destinationZone: input.destinationZone,
      pickupAddress: person.address,
      scheduledDate: input.scheduledDate,
      scheduledTime: input.scheduledTime,
      estimatedHours: input.estimatedHours,
      transportMode: input.transportMode,
      priceMxn,
      platformFeeMxn,
      pinCode,
      milestone: 0,
      status: 'active',
      logs: [
        {
          id: `log-${Date.now()}`,
          timestamp: nowTime,
          author: 'Sistema Acompaña',
          message: `Cita confirmada con ${companion.fullName}. PIN de seguridad asignado: ${pinCode}.`,
          type: 'milestone',
        },
      ],
      whatsappFeed: [
        {
          id: `wa-${Date.now()}`,
          timestamp: nowTime,
          recipient: `${person.emergencyContact} (Apoderada)`,
          text: `📅 Nueva cita confirmada: ${companion.fullName} acompañará a ${person.fullName} a ${input.destinationName} (${input.scheduledDate} · ${input.scheduledTime} h). PIN: *${pinCode}*.`,
        },
      ],
    };

    setState((prev) => ({
      ...prev,
      appointments: [created, ...prev.appointments],
      plan:
        input.bookingType === 'plan' && prev.plan.usedCredits < prev.plan.totalCredits
          ? { ...prev.plan, usedCredits: prev.plan.usedCredits + 1 }
          : prev.plan,
    }));

    return created;
  };

  const advanceMilestone = (appointmentId: string) => {
    setState((prev) => ({
      ...prev,
      appointments: prev.appointments.map((apt) => {
        if (apt.id !== appointmentId || apt.milestone >= 4) return apt;
        const next = Math.min(4, apt.milestone + 1) as Appointment['milestone'];
        const person = prev.people.find((p) => p.id === apt.personId);
        const companion = prev.companions.find((c) => c.id === apt.companionId);
        const nowTime = currentTimeStr();
        const label = MILESTONE_LABELS[next];

        const waMessages: Record<number, string> = {
          1: `✅ Recogida segura (${nowTime} h): ${companion?.fullName ?? 'Acompañante'} validó el PIN ${apt.pinCode} con ${person?.fullName ?? 'el asistido'} e inicia traslado (${apt.transportMode}).`,
          2: `🏥 Llegada a destino (${nowTime} h): ${person?.fullName ?? 'El asistido'} ya se encuentra en ${apt.destinationName} acompañado en todo momento.`,
          3: `🚗 En camino de regreso (${nowTime} h): Concluyó la actividad en ${apt.destinationName}; regresando al domicilio.`,
          4: `🏠 Servicio finalizado (${nowTime} h): Entrega registrada correctamente en domicilio.`,
        };

        return {
          ...apt,
          milestone: next,
          status: next === 4 ? 'completed' : 'active',
          logs: [
            ...apt.logs,
            {
              id: `log-${Date.now()}`,
              timestamp: nowTime,
              author: companion?.fullName ?? 'Acompañante',
              message: `Hito actualizado: ${label}.`,
              type: 'milestone',
            },
          ],
          whatsappFeed: [
            ...apt.whatsappFeed,
            {
              id: `wa-${Date.now()}`,
              timestamp: nowTime,
              recipient: `${person?.emergencyContact ?? 'Apoderado'} (Apoderado)`,
              text: waMessages[next] ?? `Actualización: ${label}`,
            },
          ],
        };
      }),
    }));
  };

  const addLogEntry = (appointmentId: string, author: string, message: string) => {
    const trimmed = message.trim();
    if (!trimmed) return;
    setState((prev) => ({
      ...prev,
      appointments: prev.appointments.map((apt) =>
        apt.id === appointmentId
          ? {
              ...apt,
              logs: [
                ...apt.logs,
                {
                  id: `log-${Date.now()}`,
                  timestamp: currentTimeStr(),
                  author,
                  message: trimmed,
                  type: 'note',
                },
              ],
            }
          : apt
      ),
    }));
  };

  const completeDeliveryAct = (appointmentId: string, act: DeliveryAct) => {
    setState((prev) => ({
      ...prev,
      appointments: prev.appointments.map((apt) => {
        if (apt.id !== appointmentId) return apt;
        const person = prev.people.find((p) => p.id === apt.personId);
        const companion = prev.companions.find((c) => c.id === apt.companionId);
        const nowTime = currentTimeStr();

        return {
          ...apt,
          milestone: 4,
          status: 'completed',
          deliveryAct: act,
          logs: [
            ...apt.logs,
            {
              id: `log-${Date.now()}`,
              timestamp: nowTime,
              author: companion?.fullName ?? 'Acompañante',
              message: `Acta de entrega cerrada. Recibido por: ${act.receivedBy}. Estado: ${act.apparentCondition}.`,
              type: 'milestone',
            },
          ],
          whatsappFeed: [
            ...apt.whatsappFeed,
            {
              id: `wa-${Date.now()}`,
              timestamp: nowTime,
              recipient: `${person?.emergencyContact ?? 'Apoderado'} (Apoderado)`,
              text: `🏠 Entrega verificada (${nowTime} h): ${person?.fullName ?? 'Tu familiar'} llegó a casa y fue recibido por *${act.receivedBy}*. ${act.observations ? `Nota: ${act.observations}` : ''}`,
            },
          ],
        };
      }),
    }));
  };

  const submitEvaluation = (appointmentId: string, evaluation: ServiceEvaluation) => {
    setState((prev) => ({
      ...prev,
      appointments: prev.appointments.map((apt) =>
        apt.id === appointmentId ? { ...apt, evaluation } : apt
      ),
    }));
  };

  const applyAsCompanion = (input: NewCompanionInput): Companion => {
    const initials = input.fullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase() ?? '')
      .join('');

    const created: Companion = {
      id: `comp-${Date.now()}`,
      fullName: input.fullName,
      initials: initials || 'AC',
      zone: input.zone,
      phone: input.phone,
      experienceYears: input.experienceYears,
      hasOwnCar: input.hasOwnCar,
      carModel: input.carModel,
      bio: input.bio,
      specialties: input.specialties,
      rating: 0,
      completedServices: 0,
      status: 'pending',
      badges: {
        kyc: true,
        references: false,
        certified40h: false,
      },
      documents: {
        ineUploaded: true,
        selfieUploaded: true,
        proofOfAddress: true,
        noCriminalRecord: true,
        referencesCount: 2,
        firstAidCert: false,
      },
      appliedAt: new Date().toISOString().slice(0, 10),
    };

    setState((prev) => ({
      ...prev,
      companions: [created, ...prev.companions],
    }));

    return created;
  };

  const reviewCompanion = (id: string, status: CompanionStatus, badges: CompanionBadges) => {
    setState((prev) => ({
      ...prev,
      companions: prev.companions.map((c) =>
        c.id === id
          ? {
              ...c,
              status,
              badges,
              rating: status === 'approved' && c.rating === 0 ? 5.0 : c.rating,
            }
          : c
      ),
    }));
  };

  const activatePlan = (credits: 4 | 8) => {
    const monthlyPriceMxn = credits === 8 ? 2560 : 1360;
    const pricePerVisitMxn = credits === 8 ? 320 : 340;
    setState((prev) => ({
      ...prev,
      plan: {
        id: `plan-${credits}`,
        name: credits === 8 ? 'Plan Familiar 8 Citas' : 'Plan Esencial 4 Citas',
        totalCredits: credits,
        usedCredits: 0,
        monthlyPriceMxn,
        pricePerVisitMxn,
        renewalDate: '2026-12-24',
        status: 'active',
      },
    }));
  };

  const resetDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(DEFAULT_STATE);
  };

  return (
    <AppStateContext.Provider
      value={{
        ...state,
        setRole,
        setActiveCompanionId,
        savePerson,
        scheduleAppointment,
        advanceMilestone,
        addLogEntry,
        completeDeliveryAct,
        submitEvaluation,
        applyAsCompanion,
        reviewCompanion,
        activatePlan,
        resetDemo,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState debe usarse dentro de AppStateProvider');
  return ctx;
}
