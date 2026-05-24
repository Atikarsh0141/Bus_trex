import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
        <path d="M6 13.5V13c0-2.2 1.8-4 4-4h4c2.2 0 4 1.8 4 4v.5" />
        <path d="M18 18.5V18c0-2.2-1.8-4-4-4H9" />
        <path d="M5 6.8A3.3 3.3 0 0 1 8.3 5h7.4a3.3 3.3 0 0 1 3.3 1.8" />
        <path d="M5 18.2A3.3 3.3 0 0 0 8.3 20h7.4a3.3 3.3 0 0 0 3.3-1.8" />
        <path d="M22 10v4" />
        <path d="M2 10v4" />
        <circle cx="8" cy="10" r="2" />
        <circle cx="16" cy="10" r="2" />
    </svg>
  ),
};
