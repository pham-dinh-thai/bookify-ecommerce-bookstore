import DontHaveAnAccount from './ui/dont-have-an-account';
import LoginForm from './ui/login-form';
import LoginHeader from './ui/login-header';

type LoginProps = {};

export default function Login({}: LoginProps) {
  return (
    <div className="flex flex-col items-center w-full max-w-md">
      <div
        className="bg-white rounded-2xl p-7 w-full"
        style={{ boxShadow: '0px 4px 24px rgba(43,53,47,0.08)' }}
      >
        <LoginHeader />

        <LoginForm />

        <DontHaveAnAccount path="/register" />
      </div>
    </div>
  );
}
