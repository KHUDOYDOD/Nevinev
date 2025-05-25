import { Link } from 'wouter';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'primary' | 'white';
  showTagline?: boolean;
  className?: string;
}

export function Logo({ 
  variant = 'primary', 
  showTagline = true, 
  className 
}: LogoProps) {
  const textColor = variant === 'primary' 
    ? 'text-primary' 
    : 'text-white';
  
  const taglineColor = variant === 'primary' 
    ? 'text-gray-500' 
    : 'text-gray-300';

  return (
    <Link href="/">
      <a className={cn("flex items-center", className)}>
        <span className={cn("font-bold text-2xl", textColor)}>
          TRADEPO
        </span>
        {showTagline && (
          <span className={cn("text-sm ml-2 hidden sm:inline", taglineColor)}>
            | Smart Profit System
          </span>
        )}
      </a>
    </Link>
  );
}
