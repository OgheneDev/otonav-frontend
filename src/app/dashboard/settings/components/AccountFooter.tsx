import React from "react";
import type { AuthUser } from "@/types/auth";

interface AccountFooterProps {
  authUser: AuthUser | null;
}

export function AccountFooter({ authUser }: AccountFooterProps) {
  return (
    <div className="mt-8 mb-4 text-center">
      <p className="text-[10px] text-gray-300 uppercase tracking-widest">
        Account created on{" "}
        <span className="text-gray-400">
          {authUser?.createdAt
            ? new Date(authUser.createdAt).toLocaleDateString()
            : "Unknown"}
        </span>
        {authUser?.lastLoginAt && (
          <>
            <span className="mx-2">•</span>
            Last login{" "}
            <span className="text-gray-400">
              {new Date(authUser.lastLoginAt).toLocaleDateString()}
            </span>
          </>
        )}
      </p>
    </div>
  );
}
