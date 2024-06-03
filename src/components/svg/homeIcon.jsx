import React from 'react';

function HomeIcon({ size = 20 }) {
  const getSizeSVG = () => {
    return {
      width: size,
      height: size
    };
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...getSizeSVG()} fill="none" viewBox="0 0 15 14">
      <path
        fill="#000"
        fillRule="evenodd"
        d="M13.582 4.793L8.332.714c-.233-.174-.525-.174-.7 0l-5.25 4.08a.53.53 0 00-.233.465v6.41c0 .99.758 1.748 1.75 1.748h8.167c.991 0 1.75-.758 1.75-1.748v-6.41a.53.53 0 00-.234-.466zM9.15 7.59v4.661H6.816V7.59h2.333zm2.917 4.661c.35 0 .583-.233.583-.582V5.55L7.982 1.938 3.316 5.551v6.118c0 .35.233.582.583.582h1.75V7.007c0-.35.233-.582.583-.582h3.5c.35 0 .584.233.584.582v5.244h1.75z"
        clipRule="evenodd"
      ></path>
      <mask
        id="mask0_13992_70664"
        style={{ maskType: 'luminance' }}
        width="12"
        height="14"
        x="2"
        y="0"
        maskUnits="userSpaceOnUse"
      >
        <path
          fill="#fff"
          fillRule="evenodd"
          d="M13.582 4.793L8.332.714c-.233-.174-.525-.174-.7 0l-5.25 4.08a.53.53 0 00-.233.465v6.41c0 .99.758 1.748 1.75 1.748h8.167c.991 0 1.75-.758 1.75-1.748v-6.41a.53.53 0 00-.234-.466zM9.15 7.59v4.661H6.816V7.59h2.333zm2.917 4.661c.35 0 .583-.233.583-.582V5.55L7.982 1.938 3.316 5.551v6.118c0 .35.233.582.583.582h1.75V7.007c0-.35.233-.582.583-.582h3.5c.35 0 .584.233.584.582v5.244h1.75z"
          clipRule="evenodd"
        ></path>
      </mask>
      <g mask="url(#mask0_13992_70664)">
        <path fill="#3A6771" d="M0.982 0H14.982V14H0.982z"></path>
      </g>
    </svg>
  );
}

export default HomeIcon;
