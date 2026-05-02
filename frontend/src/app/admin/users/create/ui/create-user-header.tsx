export default function CreateUserHeader() {
  return (
    <div className="">
      <span
        className="text-xs font-bold uppercase mb-4 block"
        style={{ letterSpacing: '0.3em', color: '#3f6754' }}
      >
        User Management
      </span>
      <h2
        className="text-5xl font-extrabold tracking-tighter mb-6 leading-[1.1]"
        style={{ color: '#2b352f' }}
      >
        <span className="italic" style={{ color: '#335b48' }}>
          CREATE NEW USER
        </span>
      </h2>
    </div>
  );
}
