<script lang="ts">
  import { Separator } from "@components/ui/separator";
  import { Input } from "@components/ui/input";
  import { Button } from "@components/ui/button";
  import RegisterPasskeyButton from '@components/auth/RegisterPasskeyButton.svelte';
  import { getRegistrationOptions, register } from '@api/auth.ts';
  import { toast } from "svelte-sonner";
  import { hashWithSalt } from '@util/encryption/hash.ts';
  import { encryptAESKey, generateAESKey } from '@util/encryption/key.ts';
  import { navigate } from 'astro:transitions/client';

  let email = $state('');
  let password = $state('');
  let confirmedPassword = $state('');

  let emailVariant: 'success' | 'error' | 'default' = $derived(email.length > 0 &&  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'success' : email.length > 0 ? 'error' : 'default');
  let passwordVariant: 'success' | 'error' | 'default' = $derived(password.length > 0 && password.length >= 8 ? 'success' : password.length > 0 ? 'error' : 'default');
  let confirmedPasswordVariant: 'success' | 'error' | 'default' = $derived(confirmedPassword.length > 0 && confirmedPassword === password ? 'success' : confirmedPassword.length > 0 ? 'error' : 'default');

  async function handleSubmit(event: Event) {
    event.preventDefault();

    if (emailVariant === 'error') {
      toast.warning("Invalid email address.")
    } else if (passwordVariant === 'error') {
      toast.warning("Password must be at least 8 characters long.")
    } else if (confirmedPasswordVariant === 'error') {
      toast.warning("Passwords do not match.")
    }

    if (emailVariant === 'success' && passwordVariant === 'success' && confirmedPasswordVariant === 'success') {
      const name = localStorage.getItem("name")
      if (!name) {
        toast.error("Name not found. Please go back and enter your name.")
        return
      }

      try {
        const opts = await getRegistrationOptions("password", name);

        const aesKey = await generateAESKey();
        localStorage.setItem("aesKey", aesKey)

        await register({
          email,
          hash: await hashWithSalt(opts.salt, password),
          encodedKey: await encryptAESKey(password, aesKey)
        }, false)

        await navigate("/home")
      } catch (e) {
        toast.error((e as Error).message)
      }
    }
  }
</script>

<div class="my-2 w-1/3">
  <RegisterPasskeyButton class="w-full" />
  <div class="relative flex justify-center mb-5">
    <Separator class="mt-3" />
    <p class="text-neutral-500 absolute bg-white px-1">or</p>
  </div>
  <form onsubmit={handleSubmit} class="flex flex-col gap-2">
    <Input insetLabel="Email"
           autocomplete="email"
           variant={emailVariant}
           bind:value={email}
           required />
    <Input insetLabel="Password"
           autocomplete="new-password"
           type="password"
           variant={passwordVariant}
           bind:value={password}
           required />
    <Input insetLabel="Confirm Password"
           autocomplete="new-password"
           type="password"
           variant={confirmedPasswordVariant}
           bind:value={confirmedPassword}
           required />
    <Button type="submit">Create Account</Button>
  </form>
</div>

