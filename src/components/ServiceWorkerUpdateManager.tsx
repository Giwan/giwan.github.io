import React from 'react';
import UpdateNotification from './UpdateNotification';
import { useServiceWorkerUpdate } from '../hooks/useServiceWorkerUpdate';

const ServiceWorkerUpdateManager: React.FC = () => {
  const {
    showNotification,
    updateServiceWorker,
    dismissNotification,
  } = useServiceWorkerUpdate();

  return (
    <UpdateNotification
      isVisible={showNotification}
      onUpdate={updateServiceWorker}
      onDismiss={dismissNotification}
    />
  );
};

export default ServiceWorkerUpdateManager;