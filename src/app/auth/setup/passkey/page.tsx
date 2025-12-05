'use client';

import {useRouter} from "next/navigation";
import {GoPasskeyFill} from "react-icons/go";
import {getRegistrationOpts, register} from "@/api/modules/auth";
import {addToast, Button} from "@heroui/react";
import {useState} from "react";
import {parseSignupOptions} from "@/api/util";

export default function SetupPage() {
  const router = useRouter()

  const [credentials, setCredentials] = useState<Credential[]>(
    localStorage.getItem("credentials") ? JSON.parse(localStorage.getItem("credentials")!) : [])

  const username = localStorage.getItem("username")

  async function handleSubmit() {
    if (!username) {
      return addToast({
        title: "Please enter a name",
        description: "No username found. Please go back and enter a name",
        color: "danger",
      });
    }

    try {
      await webauthnRegistration(username)
    } catch (e) {
      if (!(e instanceof Error)) {
        addToast({description: "An unknown error occurred. Please try again.", color: "danger"});
      } else if (e.name === "NotAllowedError") {
        addToast({description: "The operation was aborted. Please try again.", color: "warning"});
      } else {
        addToast({title: "Unknown Error", description: e.message, color: "danger"});
      }
    }
  }

  async function webauthnRegistration(name: string) {
    const opts = await getRegistrationOpts(name)
    const credential = await navigator.credentials.create({
      publicKey: parseSignupOptions(opts.options)
    }) as PublicKeyCredential | null;
    if (!credential) throw new Error("No credential found");

    setCredentials(c => [...c, credential.toJSON()])
    localStorage.setItem("credentials", credentials.toString())

    await register(credential.toJSON());
  }

  return (
    <>
      <h1 className="font-bold text-xl mb-2">Welcome <strong className="text-primary"> {username}</strong></h1>
      <p className="leading-tight mb-3 max-w-80">Let's set up authentication for your account. We recommend using
        passkeys as they offer the best security.</p>

      <Button color="primary"
              onPress={handleSubmit}
              startContent={<GoPasskeyFill/>}>Create Passkey</Button>

    </>
  );
}