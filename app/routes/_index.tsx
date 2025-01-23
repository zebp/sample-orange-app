import { PropsWithChildren } from "react";
import { Link } from "react-router";

function OrangeLink({ to, children }: PropsWithChildren<{ to: string }>) {
  return (
    <Link
      className="bg-orange-500 rounded text-xl text-white p-3 transition-colors hover:bg-orange-600"
      to={to}
    >
      {children}
    </Link>
  );
}

export default function Home() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-10">
      <h1 className="text-6xl font-bold text-center">Hello World 🍊</h1>
      <div className="flex gap-2">
        <OrangeLink to="/chat">🗣️ Chat</OrangeLink>
        <OrangeLink to="/count">📈 Counter</OrangeLink>
      </div>
    </div>
  );
}
