import { getCountries } from "@/api/countryAPI";
import LinkButton from "@/components/LinkButton";

export default function Home() {
  return (
    <main>
      <LinkButton
        title="Iniciar Sesión"
        href="/login"
        style="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      />
      <LinkButton
        title="Register"
        href="/register"
        style="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      />
      <LinkButton
        title="About me"
        href="#"
        style="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      />
    </main>
  );
}
