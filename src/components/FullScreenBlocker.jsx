const FullScreenBlocker = () => {
  const requestFullScreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    }
  };

  return (
    <>
      <div className="fullscreen-blocker bg-[#B5C0D0] p-20 mx-[20%] mt-5">
        <h2 className="font-bold text-xl">
          Please switch to full-screen mode to take the test.
        </h2>
        <button
          className="bg-blue-400 rounded-lg px-4 py-2 mt-4 hover:bg-blue-500 hover:shadow-4xl"
          onClick={requestFullScreen}
        >
          Switch to Full Screen
        </button>
      </div>
    </>
  );
};

export default FullScreenBlocker;
