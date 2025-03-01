"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";

export function PageClient() {
  const router = useRouter();
  const user = useUser({ or: "redirect" });
  const teams = user.useTeams();
  const [teamDisplayName, setTeamDisplayName] = React.useState("");
  const [userDisplayName, setuserDisplayName] = React.useState("");
  
  React.useEffect(() => {
    if (teams.length > 0 && !user.selectedTeam) {
      user.setSelectedTeam(teams[0]);
    }
  }, [teams, user]);

  if (teams.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <div className="max-w-sm w-full">
          <h1 className="text-center text-2xl font-semibold">Bem vindo(a)!</h1>
          <p className="text-center text-white-500">
            Preencha os dados abaixo para prosseguir!
          </p>
          <form
            className="mt-4"
            onSubmit={(e) => {
              e.preventDefault();
              user.createTeam({ displayName: teamDisplayName });
              user.setDisplayName(userDisplayName )
            }}
          >
            <div>
            <Label className="text-sm ">Nome Completo</Label>
               <Input
                // placeholder="Nome Completo"
                value={userDisplayName}
                onChange={(e) => setuserDisplayName(e.target.value)}
                className="mb-2 mt-1"
              />
              <Label className="text-sm">Nome de Usuário <small>(* o username não pode ser alterado posteriormente)</small></Label>
              <Input
                
                // placeholder="nomedeusuario"
                value={teamDisplayName}
                onChange={(e) => setTeamDisplayName(e.target.value)}
                className="mt-1"
              />
             
             
            </div>
            <Button className="mt-4 w-full">Salvar</Button>
          </form>
        </div>
      </div>
    );
  } else if (user.selectedTeam) {
    router.push(`/dashboard/${user.selectedTeam.id}`);
  }

  return null;
}
