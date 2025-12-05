'use client';

import {Button} from '@heroui/button';
import {GoPasskeyFill} from "react-icons/go";
import {Input} from '@heroui/input';
import {Alert, Divider, Form} from "@heroui/react";
import {FormEvent, useState} from "react";
import {authenticate, getAuthenticationOpts} from "@/api/modules/auth";
import {capitalize} from "@/util/string";
import {hashWithSalt} from "@/crypto/hash";
import {useRouter} from "next/navigation";

function validate({email, password}: { email: string; password: string }, serverError?: string) {
  if (serverError) return {email: true, password: true};
  const errors: { email?: string; password?: string } = {};
  if (!email) errors.email = "Please enter an email";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email";
  if (!password) errors.password = "Please enter a password";
  return errors;
}

export default function LoginPage() {
  const router = useRouter()

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const opts = await getAuthenticationOpts(formValue.email)
      const hash = await hashWithSalt(opts.salt, formValue.password);
      await authenticate({ method: 'email', hash });
      router.push('/auth/login/otp');
    } catch (e) {
      setServerError(capitalize((e as Error).message || 'Server Error'));
    }

    setIsLoading(false);
  };

  return (
    <div className="w-64">
      <h1 className="font-bold text-xl">Welcome Back</h1>

      <Button color="primary" className="w-full" startContent={<GoPasskeyFill/>}>Use Passkey</Button>
      <Divider className="my-4"/>
      {serverError && <Alert color="danger"
                             title={serverError}
                             className="my-4"/>}
      <Form onSubmit={handleSubmit} className="min-w-64 flex flex-col items-center">
        <Input
          label="Email"
          isRequired
          onValueChange={v => handleChange('email', v)}
          isInvalid={touched.email && !!errors.email}
          errorMessage={touched.email ? errors.email : undefined}
          type="email"
          name="email"
          autoComplete="email"/>
        <Input
          label="Password"
          isRequired
          onValueChange={v => handleChange('password', v)}
          isInvalid={touched.password && !!errors.password}
          errorMessage={touched.password ? errors.password : undefined}
          type="password"
          name="password"
          autoComplete="current-password"/>
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
          isLoading={isLoading}>
          Submit
        </Button>
      </Form>
    </div>
  );
}