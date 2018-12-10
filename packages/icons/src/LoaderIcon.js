import React from "react";

const LoaderIcon = props => (
  <svg
    width="100"
    height="20"
    viewBox="0 0 100 20"
    fill="currentColor"
    {...props}
  >
    <circle cy="10" cx="5" r="5">
      <animate
        attributeName="opacity"
        calcMode="spline"
        values="1;0.2;1"
        keyTimes="0;0.5;1"
        dur="2"
        keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
        begin="-1.2s"
        repeatCount="indefinite"
      />
    </circle>
    <circle cy="10" cx="35" r="5">
      <animate
        attributeName="opacity"
        calcMode="spline"
        values="1;0.2;1"
        keyTimes="0;0.5;1"
        dur="2"
        keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
        begin="-0.8s"
        repeatCount="indefinite"
      />
    </circle>
    <circle cy="10" r="5" cx="65">
      <animate
        attributeName="opacity"
        calcMode="spline"
        values="1;0.2;1"
        keyTimes="0;0.5;1"
        dur="2"
        keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
        begin="-0.4s"
        repeatCount="indefinite"
      />
    </circle>
    <circle xmlns="http://www.w3.org/2000/svg" r="5" cx="95" cy="10">
      <animate
        attributeName="opacity"
        calcMode="spline"
        values="1;0.2;1"
        keyTimes="0;0.5;1"
        dur="2"
        keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
        begin="0s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);

export default LoaderIcon;
