export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex justify-center px-main py-10 md:py-12 lg:py-16 2xl:py-20">
      <div
        className="
          w-full
          max-w-[90vw]
          md:max-w-[70vw]
          lg:max-w-[55vw]
          xl:max-w-[45vw]
          2xl:max-w-[38vw]
        "
      >
        {children}
      </div>
    </div>
  );
}
