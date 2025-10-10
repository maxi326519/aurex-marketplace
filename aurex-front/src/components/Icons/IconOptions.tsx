interface IconOptionsProps {
  size?: number;
  className?: string;
  onClick?: () => void;
}

export default function IconOptions({ 
  size = 20, 
  className = "", 
  onClick 
}: IconOptionsProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`cursor-pointer hover:opacity-70 transition-opacity ${className}`}
      onClick={onClick}
    >
      <circle cx="12" cy="6" r="2" fill="currentColor" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <circle cx="12" cy="18" r="2" fill="currentColor" />
    </svg>
  );
}
