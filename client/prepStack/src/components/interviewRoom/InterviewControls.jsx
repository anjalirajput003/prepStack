const InterviewControls = ({
  isMuted,
  toggleMute,
  isCameraOff,
  toggleCamera,
  isSharingScreen,
  shareScreen,
  stopScreenShare,
  handleEndInterview,
}) => {
  return (
    <>
      <button onClick={toggleMute}>{isMuted ? "Unmute" : "Mute"}</button>
      <br />
      <button onClick={toggleCamera}>
        {isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
      </button>

      <button onClick={isSharingScreen ? stopScreenShare : shareScreen}>
        {isSharingScreen ? "Stop Sharing" : "Share Screen"}
      </button>

      <br />
      <button onClick={handleEndInterview}>End Interview</button>
    </>
  );
};

export default InterviewControls;
