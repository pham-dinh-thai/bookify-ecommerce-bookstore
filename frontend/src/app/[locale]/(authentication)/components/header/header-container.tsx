import AuthHeaderPresenter from './header-presenter';

type AuthHeaderContainerProps = {};

export default function AuthHeaderContainer({}: AuthHeaderContainerProps) {
  return <AuthHeaderPresenter appName="Bookify" />;
}
