import LoginForm from "@/features/auth/components/LoginForm";

export default function Home() {
  return (
    <div className="flex flex-col gap-6 justify-center items-center min-h-screen">
      <h1 className="font-semibold text-4xl">JOOAV Inventory</h1>
      <LoginForm />
    </div>
  );
}
