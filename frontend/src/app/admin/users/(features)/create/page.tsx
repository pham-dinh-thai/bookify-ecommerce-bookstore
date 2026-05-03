import CreateUserHeader from './ui/create-user-header';
import CreateUserForm from './ui/create-user-form';
import UserFormNavigate from '../../components/user-form-navigate';

export default function CreateUser() {
  return (
    <div className="px-12 py-8">
      <div className="max-w-3xl mx-auto">
        <UserFormNavigate label="Create User" />

        <div
          className="rounded-[2rem] p-10 lg:p-16"
          style={{
            backgroundColor: '#ffffff',
            boxShadow: '0px 40px 80px rgba(43,53,47,0.06)',
          }}
        >
          <CreateUserHeader />

          <CreateUserForm />
        </div>
      </div>
    </div>
  );
}
