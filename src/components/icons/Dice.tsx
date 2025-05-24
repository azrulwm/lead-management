const DiceIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-12 w-12 text-indigo-600"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <rect
      width="14"
      height="14"
      x="3"
      y="3"
      rx="2"
      ry="2"
      className="text-indigo-100"
    />
    <circle cx="7" cy="7" r="1" className="text-indigo-600" />
    <circle cx="13" cy="7" r="1" className="text-indigo-600" />
    <circle cx="7" cy="13" r="1" className="text-indigo-600" />
    <circle cx="13" cy="13" r="1" className="text-indigo-600" />
  </svg>
);

export default DiceIcon;
