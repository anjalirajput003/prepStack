const AvailabilityBadge = ({ isAvailable }) => {
  return <span>{isAvailable ? "Available 🟢" : "Unavailable 🔴"}</span>;
};

export default AvailabilityBadge;
