export const formStyles = () => {
  const fieldStyle = { backgroundColor: '#e2eae3', color: '#2b352f' };
  const inputClass =
    'w-full border border-[#c1ecd4] rounded-2xl py-4 px-6 outline-none transition-all placeholder:opacity-40 focus:ring-2 focus:ring-[#3f6754]/20';
  const selectClass =
    'w-full border border-[#c1ecd4] rounded-2xl py-4 px-6 pr-10 outline-none transition-all appearance-none focus:ring-2 focus:ring-[#3f6754]/20';
  const labelClass = 'block text-[13px] font-bold uppercase ml-1';
  const labelStyle = { letterSpacing: '0.08em', color: '#58615b' };

  return { fieldStyle, inputClass, selectClass, labelClass, labelStyle };
};
