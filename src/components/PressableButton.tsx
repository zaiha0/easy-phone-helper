import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { triggerHapticFeedback } from '../lib/haptics';

type Variant = 'primary' | 'secondary' | 'danger' | 'safe' | 'warning';

interface Props {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-gray-100',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-red-200',
  safe: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200',
  warning: 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200',
};

export default function PressableButton({
  label,
  icon,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
  type = 'button',
  fullWidth = false,
}: Props) {
  const handleClick = () => {
    triggerHapticFeedback();
    if (onClick) onClick();
  };

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        rounded-2xl font-bold shadow-lg
        flex flex-col items-center justify-center gap-2
        disabled:opacity-40 disabled:cursor-not-allowed
        select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500
        ${className}
      `}
      style={{ minHeight: '72px', fontSize: '20px' }}
    >
      {icon && (
        <span aria-hidden="true" className="flex items-center justify-center" style={{ width: 32, height: 32 }}>
          {icon}
        </span>
      )}
      <span>{label}</span>
    </motion.button>
  );
}
