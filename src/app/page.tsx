"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "@/components/ui/Loader";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);

  return <Loader text="Loading..." />; // Or a loading spinner
};

export default Page;
