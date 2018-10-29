import React from "react";

const StampIcon = ({ innerRef, ...props }) => (
  <svg
    {...props}
    ref={innerRef}
    fill="currentColor"
    width="27"
    height="28"
    viewBox="0 0 26.8 28.9"
  >
    <path d="M26.5 20.3c-.2-1-.9-1.9-1.9-2.3-.4-.1-.5-.1-3.8-.2h-3.2l-.1-.1c-.2-.1-.3-.3-.4-.5-.1-.2-.5-1.7-.6-2.3-.1-.3-.1-.8-.1-1.3 0-1.5.1-2 1.1-4.6.1-.2.8-2.1.8-2.4.1-.5.1-1.9 0-2.4-.3-1-.7-1.8-1.5-2.5C16 .9 14.9.5 13.7.4h-.9c-2 .3-3.6 1.7-4.2 3.7-.2.7-.2 1.9-.1 2.5.1.2.5 1.3.9 2.4.9 2.5 1 2.8 1.1 4v.8c0 .1 0 .3.2.5s.6.3.8.4c.2 0 .6-.1.7-.3.2-.2.2-.3.2-.5v-.2c0-1.8-.1-2.4-1.2-5.3-.4-1.2-.8-2.2-.8-2.3-.1-.3-.1-1 0-1.4.3-1.1 1.2-2 2.2-2.3.4-.1 1.1-.1 1.4 0 .4.1.8.3 1.1.5.5.4.9 1.1 1.1 1.7.1.4.1 1.2 0 1.5 0 .1-.4 1-.8 2.1-.9 2.5-1.1 3-1.2 4.2-.1.7 0 2.2.1 2.9.1.8.6 2.5.8 2.9.2.5.7 1 1.2 1.2.7.4.8.4 4.3.4h3.2c.2.1.5.3.6.5l.1.2v4.2H2.2v-4.1l.1-.2c0-.1.2-.2.2-.3.2-.2.3-.2 3.3-.2H6c3.5 0 3.6 0 4.3-.4.4-.2 1-.8 1.2-1.2.1-.2.3-1 .4-1.4v-.3l-.1-.2c-.2-.3-.7-.4-.8-.4-.3 0-.9.1-1 .6-.3 1-.4 1.1-.6 1.3-.1.1-.2.1-.3.1H6c-3.4 0-3.4 0-3.8.2-.8.3-1.5.9-1.8 1.7-.2.4-.2.4-.2 3.2 0 2.8 0 2.9.1 3 .1.3.5.5.9.6v.3c0 .8 0 1.4.7 1.6.2 0 5.9.1 11.5.1s11.2 0 11.3-.1c.7-.2.7-.8.7-1.6v-.3c.1 0 .2 0 .3-.1.7-.2.7-.3.7-3.4.1-1.7.1-2.6.1-2.9z" />
  </svg>
);

export default StampIcon;
