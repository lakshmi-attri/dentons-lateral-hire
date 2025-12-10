import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
  showText?: boolean;
  textClassName?: string;
  iconClassName?: string;
  height?: number;
  width?: number;
}

export function Logo({
  className = "",
  showText = false,
  textClassName = "text-6xl font-black text-white",
  iconClassName = "",
  height = 80,
  width = 320,
}: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-4 ${className}`}>
      <div className={`relative ${iconClassName}`} style={{ width, height }}>
        <Image
          src="/dentons-logo.svg"
          alt="Dentons Logo"
          height={height}
          width={width}
          priority
          className="object-contain w-full h-full"
          unoptimized
        />
      </div>
      {showText && <span className={textClassName}>DENTONS</span>}
    </Link>
  );
}

export function LogoSmall({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <svg
        className="h-6 w-6 text-primary"
        fill="none"
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clipRule="evenodd"
          d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
      <span className="text-lg font-bold text-foreground">
        Dentons Lateral Partner Integration Platform
      </span>
    </Link>
  );
}
