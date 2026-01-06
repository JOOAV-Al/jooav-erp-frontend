"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    router.push("/super-admin/login")
  }, [])

  return (
    <div className="flex flex-col gap-6 justify-center items-center min-h-screen">
      <h1 className="font-semibold text-4xl">JOOAV Admin Inventory</h1>
      
    </div>
  );
}
