import {
  AuthLayout,
  AuthHeader,
  AuthForm,
  AuthFooter,
  useAuthLogic,
} from "@/components/Auth";

const SignUp = () => {
  const { handleFormSubmit, isLoading } = useAuthLogic("signup");

  return (
    <AuthLayout
      imageSrc="https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      imageAlt="Furniture store"
    >
      <AuthHeader title="Join Furni Store" />

      <AuthForm
        onSubmit={handleFormSubmit}
        submitButtonText="Send Link"
        isLoading={isLoading}
      />

      <AuthFooter type="signup" />
    </AuthLayout>
  );
};

export default SignUp;
