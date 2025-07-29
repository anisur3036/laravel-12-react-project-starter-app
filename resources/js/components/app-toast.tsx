import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

export const AppToast = () => {
    return <Toaster position="top-right" duration={1500} richColors />;
};

export { toast };
