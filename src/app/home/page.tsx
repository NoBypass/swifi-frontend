'use client'

import {Button} from "@heroui/react";
import {logout} from "@/api/modules/auth";
import {useRouter} from "next/navigation";

export default function Home() {
  const router = useRouter();

  async function handleLogout() {
    localStorage.removeItem("encryptionKey");
    await logout()
    router.push("/auth/login");
  }

  return (
    <>
      <Button onPress={handleLogout}>Log Out</Button>
    </>
  );
}
