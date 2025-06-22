'use client';

import Link from 'next/link';
import {useEffect} from "react";
import {getStatus} from "@/api/modules/auth";
import {useRouter} from "next/navigation";

export default function AuthLayout({
 children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isLogin = typeof window !== "undefined" && window.location.pathname === '/auth/login';
  const router = useRouter()

  useEffect(() => {
    getStatus()
      .catch()
      .then(r => {
        if (r.setupStep === 4 && r.sentKey) router.push('/home');
      });
  })

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <header className="flex items-center flex-col flex-wrap w-screen gap-3">
        <div
          className="w-16 h-16 rounded-lg text-white text-3xl font-bold grid place-content-center [background:radial-gradient(circle_at_90%_80%,var(--color-violet-400),transparent_70px),radial-gradient(circle_at_80%_0%,var(--color-green-400),transparent_40px),radial-gradient(circle_at_0%_0%,var(--color-yellow-400),transparent_80px),radial-gradient(circle_at_10%_60%,var(--color-orange-400),transparent_30px)]">
          S
        </div>
        <h1 className="font-bold text-xl">Welcome Back</h1>
      </header>

      <main className="my-6 flex flex-col items-center text-center">
        {children}
      </main>

      <footer className="text-center">
        {isLogin ? (
          <p className="text-sm">Dont have an Account? <Link href="/auth/setup">Sign Up</Link></p>
        ) : (
          <p className="text-sm">Already have an Account? <Link href="/auth/login">Log In</Link></p>
        )}
      </footer>
    </main>
  );
}