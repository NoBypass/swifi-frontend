'use client';

import {Button} from '@heroui/button';
import {GoPasskeyFill} from "react-icons/go";
import Link from 'next/link';
import {Input} from '@heroui/input';
import {Divider, Form} from "@heroui/react";
import {FormEvent, useState} from "react";

function validate({email, password}: { email: string; password: string }, serverError?: string) {
  if (serverError) return {email: true, password: true};
  const errors: { email?: string; password?: string } = {};
  if (!email) errors.email = "Please enter an email";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email";
  if (!password) errors.password = "Please enter a password";
  return errors;
}

export default function LoginPage() {
  const isLogin = typeof window !== "undefined" && window.location.pathname === '/auth/login';

  const [formValue, setFormValue] = useState({email: '', password: ''});
  const [touched, setTouched] = useState({email: false, password: false});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const errors = validate(formValue, serverError);

  const handleChange = (field: 'email' | 'password', value: string) => {
    setFormValue(f => ({...f, [field]: value}));
    setTouched(t => ({...t, [field]: true}));
    setServerError("");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setServerError("Server Error");
      setIsLoading(false);
    }, 2000);
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <header className="flex items-center flex-col flex-wrap w-screen gap-3">
        <div
          className="w-16 h-16 rounded-lg text-white text-3xl font-bold grid place-content-center [background:radial-gradient(circle_at_90%_80%,var(--color-violet-400),transparent_70px),radial-gradient(circle_at_80%_0%,var(--color-green-400),transparent_40px),radial-gradient(circle_at_0%_0%,var(--color-yellow-400),transparent_80px),radial-gradient(circle_at_10%_60%,var(--color-orange-400),transparent_30px)]">
          S
        </div>
        <h1 className="font-bold text-xl">Welcome Back</h1>
      </header>
      <div className="my-6 flex flex-col items-center">
        <Button color="primary" className="w-full" startContent={<GoPasskeyFill/>}>Use Passkey</Button>
        <Divider className="my-4"/>
        <Form onSubmit={handleSubmit} className="min-w-64 flex flex-col">
          <Input
            label="Email"
            isRequired
            onValueChange={v => handleChange('email', v)}
            isInvalid={touched.email && !!errors.email}
            errorMessage={touched.email ? errors.email : undefined}
            type="email"
            name="email"
            autoComplete="email"
          />
          <Input
            label="Password"
            isRequired
            onValueChange={v => handleChange('password', v)}
            isInvalid={touched.password && !!errors.password}
            errorMessage={touched.password ? errors.password : undefined}
            type="password"
            name="password"
            autoComplete="current-password"
          />
          <p className="text-danger">{serverError}</p>
          <Button
            isDisabled={
              isLoading ||
              !!errors.email ||
              !!errors.password ||
              !formValue.email ||
              !formValue.password
            }
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            Submit
          </Button>
        </Form>
      </div>
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