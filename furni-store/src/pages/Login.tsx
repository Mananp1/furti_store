import {
  AuthLayout,
  AuthHeader,
  AuthForm,
  AuthFooter,
  useAuthLogic,
} from "@/components/Auth";

const Login = () => {
  const { handleFormSubmit, isLoading } = useAuthLogic("login");

  return (
    <AuthLayout
      imageSrc="https://images.unsplash.com/photo-1622372738946-62e02505feb3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fGZ1cm5pdHVyZXxlbnwwfDJ8MHx8fDA%3D"
      imageAlt="Furniture store"
    >
      <AuthHeader title="Sign in to Furni Store" />

      <AuthForm
        onSubmit={handleFormSubmit}
        submitButtonText="Send Link"
        isLoading={isLoading}
      />

      <AuthFooter type="login" />
    </AuthLayout>
  );
};

export default Login;
