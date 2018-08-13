import React from "react";

const DocIcon = ({ ...props }) => (
  <svg {...props} fill="#2c3456" width="12" height="12" viewBox="0 0 10 15">
    <defs id="SvgjsDefs1009">
      <filter id="SvgjsFilter1011" width="200%" height="200%" x="-50%" y="-50%">
        <feMorphology
          id="SvgjsFeMorphology1012"
          operator="dilate"
          radius="0"
          result="SvgjsFeMorphology1012Out"
          in="SourceGraphic"
        />
        <feOffset
          id="SvgjsFeOffset1013"
          dx="0"
          dy="1"
          result="SvgjsFeOffset1013Out"
          in="SvgjsFeMorphology1012Out"
        />
        <feGaussianBlur
          id="SvgjsFeGaussianBlur1014"
          stdDeviation="0 "
          result="SvgjsFeGaussianBlur1014Out"
          in="SvgjsFeOffset1013Out"
        />
        <feComposite
          id="SvgjsFeComposite1015"
          in="SvgjsFeGaussianBlur1014Out"
          in2="SourceAlpha"
          operator="out"
          result="SvgjsFeComposite1015Out"
        />
      </filter>
    </defs>
    <path
      id="SvgjsPath1010"
      d="M69.1107 397.998H64.0013V410.99199999999996H73.997V403.14699999999993ZM69.3211 399.29L72.7403 402.894H70V403H66V402H69.3211ZM66 409V408H72V409ZM66 407V406H72V407ZM66 405V404H72V405Z "
      fillOpacity="0.08"
      filter="url(#SvgjsFilter1011)"
      transform="matrix(1,0,0,1,-64,-397)"
    />
    <path
      id="SvgjsPath1016"
      d="M69.1107 397.998H64.0013V410.99199999999996H73.997V403.14699999999993ZM69.3211 399.29L72.7403 402.894L70 402.894V403H66V402H69.3211ZM66 409V408H72V409ZM66 407V406H72V407ZM66 405V404H72V405Z "
      fillOpacity="1"
      transform="matrix(1,0,0,1,-64,-397)"
    />
    <path
      id="SvgjsPath1017"
      d="M69.1107 397.998H64.0013V410.99199999999996H73.997V403.14699999999993ZM69.3211 399.29L72.7403 402.894L70 402.894V403H66V402H69.3211ZM66 409V408H72V409ZM66 407V406H72V407ZM66 405V404H72V405Z "
      fillOpacity="1"
      transform="matrix(1,0,0,1,-64,-397)"
    />
    <path
      id="SvgjsPath1018"
      d="M69.1107 397.998H64.0013V410.99199999999996H73.997V403.14699999999993ZM69.3211 399.29L72.7403 402.894H70V403H66V402H69.3211ZM66 409V408H72V409ZM66 407V406H72V407ZM66 405V404H72V405Z "
      fill="#2c3456"
      fillOpacity="1"
      transform="matrix(1,0,0,1,-64,-397)"
    />
  </svg>
);

export default DocIcon;
