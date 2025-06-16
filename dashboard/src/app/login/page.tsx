import LoginForm from "@/components/shared/LoginForm";

const Login = () => {
  return (
    <section className="text-center h-screen  bg-slate-300">
      <h2 className="text-2xl font-bold pt-20"> Login</h2>
      <LoginForm />{" "}
    </section>
  );
};

export default Login;
