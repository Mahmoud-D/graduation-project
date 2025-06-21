import LoginForm from "@/components/shared/LoginForm";
import { redirect } from "next/navigation";

const Login = () => {
  // redirect("/dashboard");

  return (
    <section className="h-screen text-center bg-slate-300">
      <h2 className="pt-20 text-2xl font-bold"> تسجيل الدخول</h2>
      <LoginForm />{" "}
    </section>
  );
};

export default Login;
