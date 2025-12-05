'use client';

import {Button} from '@heroui/button';
import {Input} from '@heroui/input';
import {useRouter} from "next/navigation";
import {HiArrowRightCircle} from "react-icons/hi2";
import {useState} from "react";

export default function SetupPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [error, setError] = useState("")

  function handleSubmit() {
    if (name.length < 3) {
      setError("Please enter a name with at least 3 characters");
      return;
    }

    localStorage.setItem("username", name);
    router.push("/auth/setup/passkey");
  }

  return (
    <>
      <h1 className="font-bold text-xl">Welcome to Swifi!</h1>
      <p className="leading-tight mb-3">Start with entering a name for your account.</p>

      <Input
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit()
        }}
        label="Name"
        onValueChange={setName}
        onChange={() => setError("")}
        isRequired
        errorMessage={error}
        isInvalid={!!error}
        variant="bordered"
        autoComplete="username"
        endContent={<div className="h-full grid place-content-center">
          <Button isIconOnly variant="light" onPress={handleSubmit}>
            <HiArrowRightCircle className="size-6" />
          </Button>
        </div>}/>
    </>
  );
}