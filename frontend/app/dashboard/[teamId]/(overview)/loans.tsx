"use client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils";
import { useUser } from "@stackframe/stack"
import Link from "next/link";
import * as React from "react";
import { NumericFormat } from "react-number-format"; 

export function Loans() {
  const user = useUser({ or: "redirect" });
  const { displayName, primaryEmail, profileImageUrl, selectedTeam } = user;

  const [UserName, setUserName] = React.useState("");
  const [UserEmail, setUserEmail] = React.useState("");
  const [UserImage, setUserImage] = React.useState("");
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [page, setPage] = React.useState(1); 
  const [totalPages, setTotalPages] = React.useState(1); 
  
  React.useEffect(() => {

     // Função assíncrona para pegar os dados da API
     const fetchData = async () => {
      try {
        if(selectedTeam && selectedTeam.id){
        const response = await fetch(`http://localhost:3000/loan?page=${page}&limit=5&clientId=${selectedTeam.id}`);
      
        if (!response.ok) {
          throw new Error("Erro ao buscar os dados");
        }
        const result = await response.json();
        setData(result.loans);
        setTotalPages(result.totalPages);
      }
      

        setLoading(false);  
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error.message);  
        } else {
          console.error("Erro desconhecido");
        }
      }
    };

    fetchData();

    if (user) {
      setUserName(displayName|| "");
      setUserEmail(primaryEmail || "");
      setUserImage(profileImageUrl || "");
    }
  }, [user,page]);

  interface Loan {
    status: any;
    amount: any;
    id: any;
  }
  return (
    <div className="space-y-8">
      
         {loading ? (
          <div>Carregando...</div>
        ) : error ? (
          <div>Erro ao carregar os dados.</div>
        ) : (
          <>
            {data.map((item: Loan) => (
             <>
             <div className="flex items-center">
              <Avatar className="h-9 w-9">
          <AvatarImage src={UserImage} alt="Avatar" />
          <AvatarFallback>{getInitials(UserName)}</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">{UserName}</p>
          <p className={item.status === "Approved" ? "text-green-700" : "text-red-600"}>{item.status === "Approved" ? "Aprovado" : "Rejeitado"}</p>
          <p className="text-sm text-muted-foreground">
            <NumericFormat
                                    id="loanValue"
                                    value={item.amount}
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    prefix="R$ "
                                    displayType="text"
                                    required={true}
                                  />
            
          </p>
          <div className="ml-auto font-medium md:hidden">Ver Detalhes</div>
        </div>
        <div className="ml-auto font-medium hidden md:block">
        {selectedTeam && selectedTeam.id && item.id && ( <Link href={`/dashboard/${selectedTeam.id}/loans/${item.id}`}>
          Ver Detalhes
          </Link>
        )}
          </div>
        </div>
      
             </>
            ))}
              <div className="flex justify-center space-x-2 mt-4">
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-4 py-2 border rounded disabled:opacity-50">
              Anterior
            </button>
            <span>Página {page} de {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-4 py-2 border rounded disabled:opacity-50">
              Próxima
            </button>
          </div>
          </>
        )}
      
     
    </div>
  )
}
