'use client'

import { Input } from '@heroui/input';
import { useTheme } from 'next-themes';

export default function Home() {
  const { theme, setTheme } = useTheme()

  return (
    <>
      <p>abc</p>
      <p className="dark:text-red-300 text-red-700">abcd</p>
      <Input />
      <button onClick={() => setTheme('light')}>Light Mode</button>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
    </>
    );
}
