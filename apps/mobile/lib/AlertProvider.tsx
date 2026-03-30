import { createContext, useCallback, useContext, useState } from 'react';
import { ThemedAlert } from '@/components/ui/ThemedAlert';

interface AlertConfig {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
}

interface AlertContextValue {
  showAlert: (title: string, message: string, options?: Partial<AlertConfig>) => void;
}

const AlertContext = createContext<AlertContextValue>({
  showAlert: () => {},
});

export function useThemedAlert() {
  return useContext(AlertContext);
}

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AlertConfig & { visible: boolean }>({
    visible: false,
    title: '',
    message: '',
  });

  const showAlert = useCallback(
    (title: string, message: string, options?: Partial<AlertConfig>) => {
      setConfig({
        visible: true,
        title,
        message,
        confirmLabel: options?.confirmLabel,
        cancelLabel: options?.cancelLabel,
        onConfirm: options?.onConfirm,
      });
    },
    []
  );

  const handleDismiss = useCallback(() => {
    setConfig((prev) => ({ ...prev, visible: false }));
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <ThemedAlert
        visible={config.visible}
        title={config.title}
        message={config.message}
        confirmLabel={config.confirmLabel}
        cancelLabel={config.cancelLabel}
        onConfirm={config.onConfirm}
        onDismiss={handleDismiss}
      />
    </AlertContext.Provider>
  );
}
