function DashboardContainer({ children }) {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[1550px] px-10 xl:px-16 py-10 flex flex-col gap-10">
        {children}
      </div>
    </div>
  );
}

export default DashboardContainer;
