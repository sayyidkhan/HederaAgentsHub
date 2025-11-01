export function HederaLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="40" height="40" rx="8" fill="currentColor" />
      <path
        d="M12 10h4v6h8v-6h4v20h-4v-6h-8v6h-4V10Z"
        fill="white"
        stroke="none"
      />
    </svg>
  );
}

