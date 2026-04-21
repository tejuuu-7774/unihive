import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
      <div className="flex items-center gap-2">
        <Image
          src="/logo-icon.png"
          alt="UniHive"
          width={40}
          height={40}
          style={{ width: "auto", height: "auto" }}
        />
        <span className="text-xl font-semibold text-purple-700">
          UniHive
        </span>
      </div>

      <div className="space-x-4">
        <button className="text-gray-600 hover:text-purple-700">
          Login
        </button>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
          Register
        </button>
      </div>
    </nav>
  );
}
