export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <div className="flex flex-1 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 flex-1">
          <div
            className="hidden md:flex flex-col bg-center bg-no-repeat bg-cover"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCeEnaf5vpYwATcT1cJaOlxGRDFwKbVe-ag4Qx49MroULLhgEmOsMkuxqNQHX0R35vryQAgh0Zl3xjJ5r_b_opg-Ag3cOOEunG23SfhjC6c0J8HfAotA2R4C8KM74YJ-ix9VBjhb14Z8u6zBzgbfPw0BjV3rG5RC57TmodJ_ZeTwHI-c_lOKl1MzxQiHevfsNa97DJPvw6AmNNLH4sBmvbb_dPyTpfXYaLjzo2UxaDdhdIwu8E-FkyuFkRERwvXvqoa9KHy39axhjB6")`,
            }}
          />
          <div className="flex flex-col justify-center items-center w-full bg-[#f7f6f8] p-6 sm:p-12 lg:p-16">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
