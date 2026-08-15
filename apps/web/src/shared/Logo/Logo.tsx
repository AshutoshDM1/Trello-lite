export interface LogoProps {
  className?: string;
  imageClassName?: string;
  textClassName?: string;
  showText?: boolean;
  text?: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
}

const sizeMap = {
  sm: { img: 'size-7', text: 'text-sm font-bold' },
  md: { img: 'size-8', text: 'text-base font-bold' },
  lg: { img: 'size-9 font-bold', text: 'text-lg font-bold' },
  xl: { img: 'size-11 font-bold', text: 'text-xl font-bold' },
};

export function Logo({
  className = '',
  imageClassName = '',
  textClassName = '',
  showText = true,
  text = 'Trello Lite',
  subtitle,
  size = 'md',
  onClick,
}: LogoProps) {
  const currentSize = sizeMap[size];

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <img
        src="/logo.webp"
        alt="Trello Lite Logo"
        className={`object-contain rounded-lg shrink-0 ${currentSize.img} ${imageClassName}`}
      />
      {showText && (
        <div className="flex flex-col">
          <span
            className={`tracking-tight text-foreground leading-tight ${currentSize.text} ${textClassName}`}
          >
            {text}
          </span>
          {subtitle && (
            <span className="text-[11px] text-muted-foreground font-mono leading-tight">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default Logo;
