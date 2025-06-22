'use client';

import {InputOtp} from "@heroui/react";
import {useEffect, useState} from "react";
import {authenticate} from "@/api/modules/auth";
import {AxiosError} from "axios";
import {useRouter} from "next/navigation";

export default function LoginPage() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (value.length === 6) {
      setLoading(true);

      (async function () {
        try {
          const resp = await authenticate({otp: value});
          if (resp) localStorage.setItem("encryptionKey", resp.encryptionKey)
          router.push("/home");
        } catch (e) {
          if (e instanceof AxiosError) {
            setError(e.message);
          }
        }

        setValue("");
        setLoading(false);
      })()
    } else if (value.length > 0) {
      setError("");
    }
  }, [value]);

  return (
    <>
      <p className="w-64">
        Please enter the OTP code that was sent to the Email you provided
      </p>
      <InputOtp isInvalid={error.length !== 0}
                errorMessage={error}
                isDisabled={loading}
                length={6}
                value={value}
                onValueChange={setValue} />
    </>
  );
}