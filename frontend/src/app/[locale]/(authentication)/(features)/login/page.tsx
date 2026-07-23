import DontHaveAnAccount from './ui/dont-have-an-account';
import GoogleLoginButton from './ui/google-login-button';
import LoginForm from './ui/login-form';
import LoginHeader from './ui/login-header';

type LoginProps = {};

export default function Login({}: LoginProps) {
  return (
    <div className="flex flex-col items-center w-full max-w-md">
      <div
        className="bg-white rounded-2xl p-5 md:p-7 w-full"
        style={{ boxShadow: '0px 4px 24px rgba(43,53,47,0.08)' }}
      >
        <LoginHeader />

        <LoginForm />

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#e8ede9]" />
          <span className="text-[11px] font-medium text-[#aab4ad] uppercase tracking-wider">
            or
          </span>
          <div className="flex-1 h-px bg-[#e8ede9]" />
        </div>

        <GoogleLoginButton />

        <DontHaveAnAccount path="/register" />
      </div>
    </div>
  );
}
