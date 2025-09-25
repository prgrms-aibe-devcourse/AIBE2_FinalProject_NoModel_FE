import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { AlertTriangle, X } from 'lucide-react';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  buttonText?: string;
  type?: 'error' | 'warning' | 'info';
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  buttonText = '확인',
  type = 'error'
}) => {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <AlertTriangle className="h-5 w-5 text-blue-500" />;
      case 'error':
      default:
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
    }
  };

  const icon = getIcon();

  const getBgColor = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-950/20';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-950/20';
      case 'error':
      default:
        return 'bg-destructive/10';
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'warning':
        return 'border-yellow-200 dark:border-yellow-800';
      case 'info':
        return 'border-blue-200 dark:border-blue-800';
      case 'error':
      default:
        return 'border-destructive/20';
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case 'warning':
        return '주의';
      case 'info':
        return '알림';
      case 'error':
      default:
        return '오류';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full p-0 gap-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0">
              {icon}
            </div>
            <DialogTitle className="text-lg font-semibold">
              {title || getDefaultTitle()}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="px-6 pb-4">
          <div className={`${getBgColor()} rounded-lg p-4 border ${getBorderColor()}`}>
            <p className="text-sm text-foreground leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 pb-6">
          <Button
            onClick={onClose}
            variant="default"
            className="min-w-[80px]"
          >
            {buttonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};