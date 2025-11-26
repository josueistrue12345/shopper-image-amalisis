import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  startIcon?: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: "filled" | "text" | "icon";
  disabled?: boolean;
}

export function Button({
  className = "",
  children,
  startIcon,
  onClick,
  variant = "filled",
  disabled = false,
}: ButtonProps) {
  const variantClasses = {
    filled:
      "bg-sky-700 dark:bg-sky-300 text-white dark:text-black hover:bg-sky-800 dark:hover:bg-sky-400",
    text: "text-sky-800 hover:bg-sky-500/10 dark:text-sky-300",
    icon: "text-sky-800 hover:bg-sky-500/10 dark:text-sky-300",
  };
  const getPaddingX = () => {
    if (variant == "icon") {
      return "px-2";
    }
    return startIcon ? "pl-3 pr-6" : "px-6";
  };
  return (
    <button
      onClick={(e) => onClick?.(e)}
      className={`w-max flex ${getPaddingX()} py-2 text-base cursor-pointer tracking-wide items-center gap-2 rounded-full 
      ${
        disabled
          ? "disabled:bg-gray-500/20 disabled:text-gray-500 disabled:cursor-auto"
          : variantClasses[variant]
      }
       ${className}`}
      disabled={disabled}
    >
      {startIcon}
      {children}
    </button>
  );
}
