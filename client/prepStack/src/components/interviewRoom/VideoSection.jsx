const VideoSection = ({
  localVideoRef,
  remoteVideoRef,
}) => {
  return (
    <>

<h3>Your Camera Preview</h3>
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        width="400"
        height="300"
      />
      <h3>Remote Participant</h3>
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        width="400"
        height="300"
      />
      </>
  )
}

export default VideoSection;