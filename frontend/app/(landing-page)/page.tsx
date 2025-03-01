import { Hero } from "@/components/hero";
import { stackServerApp } from "@/stack";

export default async function IndexPage() {
  const project = await stackServerApp.getProject();
  if (!project.config.clientTeamCreationEnabled) {
    return (
      <div className="w-full min-h-96 flex items-center justify-center">
        <div className="max-w-xl gap-4">
          <p className="">
            {
              "Um erro inesperado ocorreu."
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Hero
        title="Seu Empréstimo Sem Complicação!"
        primaryCtaText="Solicitar Empréstimo Agora!"
        primaryCtaLink={stackServerApp.urls.signUp}
      />
    </>
  );
}
