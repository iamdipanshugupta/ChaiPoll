const Loader = ({ text = "Loading…" }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="w-9 h-9 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-neutral-500">{text}</p>
    </div>
  );
};

export default Loader;