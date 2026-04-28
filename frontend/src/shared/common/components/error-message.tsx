type ErrorMessageProps = {
  message: string | null;
};

export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;
  return <p className="mb-3 text-xs text-red-600">{message}</p>;
}
