import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accept Invitation",
  description: "Accept your invitation to join the organization",
};

export default function InvitationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen">{children}</div>;
}
