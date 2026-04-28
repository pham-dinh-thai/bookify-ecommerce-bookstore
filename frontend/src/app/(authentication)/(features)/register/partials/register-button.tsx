export default function RegisterButton({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <button className="w-full h-[42px] bg-[#2d6a4f] text-white text-[13px] font-semibold rounded-xl hover:bg-[#1a3d2b] transition-colors mb-4">
      {children}
    </button>
  );
}
