import type { SvgIconProps } from "@mui/material/SvgIcon";
import SvgIcon from "@mui/material/SvgIcon";

export default function SterkLogo(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 48 48">
      {/* Shield body */}
      <path
        d="M24 4L6 12v12c0 11.1 7.7 21.5 18 24 10.3-2.5 18-12.9 18-24V12L24 4z"
        fill="url(#shieldGrad)"
        opacity={0.15}
      />
      <path
        d="M24 4L6 12v12c0 11.1 7.7 21.5 18 24 10.3-2.5 18-12.9 18-24V12L24 4z"
        fill="none"
        stroke="url(#shieldGrad)"
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      {/* Lightning bolt */}
      <path
        d="M27 10L17 26h7l-3 12 13-18h-8l1-10z"
        fill="url(#boltGrad)"
      />
      <defs>
        <linearGradient id="shieldGrad" x1="6" y1="4" x2="42" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00E676" />
          <stop offset="100%" stopColor="#00C853" />
        </linearGradient>
        <linearGradient id="boltGrad" x1="17" y1="10" x2="34" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00E676" />
          <stop offset="50%" stopColor="#66FFA6" />
          <stop offset="100%" stopColor="#00E676" />
        </linearGradient>
      </defs>
    </SvgIcon>
  );
}
