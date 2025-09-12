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
  const getIconAndColor = () => {
    switch (type) {
      case 'warning':
        return {
          icon: <AlertTriangle className="h-6 w-6 text-orange-500" />,
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-800'
        };
      case 'info':
        return {
          icon: <AlertTriangle className="h-6 w-6 text-blue-500" />,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800'
        };
      case 'error':
      default:
        return {
          icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800'
        };
    }
  };

  const { icon, bgColor, borderColor, textColor } = getIconAndColor();

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
      <DialogContent className="!max-w-[400px] !w-[400px] !p-6">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-4">
            {icon}
            <DialogTitle className="text-lg font-semibold">
              {title || getDefaultTitle()}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className={`${bgColor} ${borderColor} border rounded-lg p-4 mb-6`}>
          <p className={`${textColor} text-sm leading-relaxed`}>
            {message}
          </p>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={onClose}
            className="min-w-[80px]"
          >
            {buttonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};