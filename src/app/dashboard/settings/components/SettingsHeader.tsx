export function SettingsHeader() {
  return (
    <section className="mb-8 text-center md:text-left">
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
        Account Settings
      </h2>
      <div className="h-1 w-12 hidden md:block bg-[#00A082] rounded-full mt-2 mb-3" />
      <p className="text-gray-500 text-sm mt-1">
        Manage your account details and security settings
      </p>
    </section>
  );
}
