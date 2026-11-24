export type Role = 'apoderado' | 'acompanante' | 'admin';

export type MobilityLevel = 1 | 2 | 3;

export type ServiceModality = 'simple' | 'asistida';

export type TransportMode =
  | 'A pie / cercano'
  | 'Vehículo familiar'
  | 'Taxi / App de plataforma'
  | 'Vehículo propio del acompañante';

export type CompanionStatus = 'pending' | 'approved' | 'rejected';

export interface AssistedPerson {
  id: string;
  fullName: string;
  age: number;
  relationship: string;
  neighborhood: string;
  address: string;
  mobilityLevel: MobilityLevel;
  mobilityAids: string[];
  dignityNotes: string;
  authorizedReceivers: string[];
  emergencyContact: string;
  emergencyPhone: string;
  nonMedicalConsent: boolean;
}

export interface CompanionBadges {
  kyc: boolean;
  references: boolean;
  certified40h: boolean;
}

export interface CompanionDocuments {
  ineUploaded: boolean;
  selfieUploaded: boolean;
  proofOfAddress: boolean;
  noCriminalRecord: boolean;
  referencesCount: number;
  firstAidCert: boolean;
  training40hScore?: number;
}

export interface Companion {
  id: string;
  fullName: string;
  initials: string;
  zone: string;
  phone: string;
  experienceYears: number;
  hasOwnCar: boolean;
  carModel?: string;
  bio: string;
  specialties: string[];
  rating: number;
  completedServices: number;
  status: CompanionStatus;
  badges: CompanionBadges;
  documents: CompanionDocuments;
  appliedAt: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  author: string;
  message: string;
  type: 'milestone' | 'note' | 'alert';
}

export interface WhatsappNotice {
  id: string;
  timestamp: string;
  recipient: string;
  text: string;
}

export interface DeliveryAct {
  deliveredAt: string;
  receivedBy: string;
  apparentCondition: string;
  belongingsVerified: boolean;
  observations: string;
}

export interface ServiceEvaluation {
  safety: number;
  punctuality: number;
  dignity: number;
  communication: number;
  comment: string;
  submittedAt: string;
}

export interface Appointment {
  id: string;
  personId: string;
  companionId: string;
  bookingType: 'single' | 'plan';
  modality: ServiceModality;
  purpose: string;
  destinationName: string;
  destinationZone: string;
  pickupAddress: string;
  scheduledDate: string;
  scheduledTime: string;
  estimatedHours: number;
  transportMode: TransportMode;
  priceMxn: number;
  platformFeeMxn: number;
  pinCode: string;
  /**
   * 0: Confirmada / En camino a domicilio
   * 1: Recogido con PIN + Checklist OK
   * 2: En cita o trámite
   * 3: De regreso a domicilio
   * 4: Entregado con Acta
   */
  milestone: 0 | 1 | 2 | 3 | 4;
  status: 'active' | 'completed';
  logs: LogEntry[];
  whatsappFeed: WhatsappNotice[];
  deliveryAct?: DeliveryAct;
  evaluation?: ServiceEvaluation;
}

export interface PlanSubscription {
  id: string;
  name: string;
  totalCredits: number;
  usedCredits: number;
  monthlyPriceMxn: number;
  pricePerVisitMxn: number;
  renewalDate: string;
  status: 'active' | 'inactive';
}
