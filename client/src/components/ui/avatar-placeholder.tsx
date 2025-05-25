import { getInitials } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
];

interface AvatarPlaceholderProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AvatarPlaceholder({ name, size = 'md', className = '' }: AvatarPlaceholderProps) {
  const initials = getInitials(name);
  
  // Generate a consistent color based on the name
  const colorIndex = name
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0) % COLORS.length;
  
  const colorClass = COLORS[colorIndex];
  
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-xl',
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarFallback className={`${colorClass} text-white`}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
