import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main>
      <Navbar />

      <section className="flex flex-col items-center justify-center text-center h-[80vh] px-6">
        <h1 className="text-5xl font-bold text-gray-900">
          Earn. Sell. Survive College.
        </h1>

        <p className="text-gray-500 mt-4 max-w-xl">
          UniHive is a student marketplace where you can turn your skills,
          creativity, and unused items into income.
        </p>

        <button className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded text-lg">
          Start Exploring
        </button>
      </section>
    </main>
  );
}