import { useState } from 'react';
import { AdminPortal } from './components/admin/AdminPortal';
import { AcompanantePortal } from './components/acompanante/AcompanantePortal';
import { AgendarCitaView } from './components/apoderado/AgendarCitaView';
import { ApoderadoDashboard, type ApoderadoTab } from './components/apoderado/ApoderadoDashboard';
import { ExpedientesView } from './components/apoderado/ExpedientesView';
import { PlanesHistorialView } from './components/apoderado/PlanesHistorialView';
import { SeguimientoVivoView } from './components/apoderado/SeguimientoVivoView';
import { Layout } from './components/Layout';
import { EmergencyModal } from './components/modals/EmergencyModal';
import { AppStateProvider, useAppState } from './context/AppStateContext';

function MainShell() {
  const { role, people } = useAppState();
  const [apoderadoTab, setApoderadoTab] = useState<ApoderadoTab>('resumen');
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  const primaryPerson = people[0];

  return (
    <Layout
      apoderadoTab={apoderadoTab}
      onApoderadoTab={setApoderadoTab}
      onOpenEmergency={() => setEmergencyOpen(true)}
    >
      {role === 'apoderado' && (
        <>
          {apoderadoTab === 'resumen' && <ApoderadoDashboard onNavigate={setApoderadoTab} />}
          {apoderadoTab === 'expedientes' && <ExpedientesView />}
          {apoderadoTab === 'agendar' && (
            <AgendarCitaView onBooked={() => setApoderadoTab('seguimiento')} />
          )}
          {apoderadoTab === 'seguimiento' && (
            <SeguimientoVivoView onOpenEmergency={() => setEmergencyOpen(true)} />
          )}
          {apoderadoTab === 'planes' && <PlanesHistorialView />}
        </>
      )}

      {role === 'acompanante' && <AcompanantePortal />}

      {role === 'admin' && <AdminPortal />}

      <EmergencyModal
        isOpen={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
        personName={primaryPerson?.fullName}
        emergencyContact={primaryPerson?.emergencyContact}
        emergencyPhone={primaryPerson?.emergencyPhone}
      />
    </Layout>
  );
}

export function App() {
  return (
    <AppStateProvider>
      <MainShell />
    </AppStateProvider>
  );
}

export default App;
