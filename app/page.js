"use client"
import { UserButton } from "@stackframe/stack";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./(routes)/design/_components/ThemeToggle";

export default function Home() {

  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/workspace');
  };

  return (
    <div className="relative w-full h-screen">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo - top left */}
        <div className="absolute top-4 left-4">
          <Image src="/logo.jpg" alt="Logo" width={100} height={100} />
        </div>

        {/* Title - top center */}
        <h1 className="absolute top-4 left-4/11  text-7xl font-bold">
          VisionCraft
        </h1>
        <h1 className="absolute top-23 left-5/14  text-2xl font-bold">
          Smart Studio for Visual Content Creation
        </h1>

        {/* User Button - top right */}
        <div className="absolute top-10 right-10 scale-150 flex items-center gap-4">
          <ThemeToggle />
          <UserButton />
        </div>
      </div>

      {/* Page Content */}
      <div className="mt-40 text-center">
        <h1 className="text-2xl">Unleash Your Creative Genius</h1>
        <div className="flex justify-center gap-8 mt-6 gap-40">
          <Image src="/interface1.jpeg" alt="Image 1" width={250} height={200} />
          <Image src="/interface2.jpg" alt="Image 2" width={380} height={200} />
        </div>
      </div>

      {/* Step Boxes */}
      <div className="flex justify-center gap-20 mt-12">
        <div className="border-2 border-gray-300 rounded-xl p-6 w-60 shadow-md hover:shadow-xl transition duration-300">
          <h2 className="text-xl font-semibold mb-2">Step 1</h2>
          <p>Create an Account</p>
        </div>
        <div className="border-2 border-gray-300 rounded-xl p-6 w-60 shadow-md hover:shadow-xl transition duration-300">
          <h2 className="text-xl font-semibold mb-2">Step 2</h2>
          <p>Start Crafting Your Vision</p>
        </div>
      </div>
      <button
        onClick={handleGetStarted}
        className="ml-170 mt-8 px-8 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold cursor-pointer"
      >
        Get Started
      </button>

    </div>
  );
}
