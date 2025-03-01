"use client";
import * as React from "react";
import { useUser } from "@stackframe/stack";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NumericFormat } from "react-number-format"; 

export default function DashboardPage() {
  const [UserName, setUserName] = React.useState("");
  const [userId, setUserId] = React.useState("");
  const [loanValue, setLoanValue] = React.useState(""); 
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [latitude, setLatitude] = React.useState<number | null>(null);
  const [longitude, setLongitude] = React.useState<number | null>(null);

const user = useUser({ or: "redirect" });
const { displayName, selectedTeam } = user;

  // Função para mudança no valor do empréstimo
  const handleLoanValueChange = (values:any) => {
    setLoanValue(values.value); 
  };

React.useEffect(() => {
  getGeolocation();
  if (user) {
    setUserName(displayName || "");
    setUserId(selectedTeam?.id || "");
  }
}, [user]);

const getGeolocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);

        try {
          const response = await fetch(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=67c2607ac107a830994265hnm8658f4`);
          const data = await response.json();

          if (data?.address) {
            setCity(data.address.town || data.address.city || "Não disponível");
            setState(data.address.state || "Não disponível");
            setCountry(data.address.country || "Não disponível");
          }
        } catch (error) {
          console.error("Erro ao buscar dados da localização:", error);
          alert("Erro ao obter informações detalhadas da localização.");
        }
      },
      (error) => {
        console.error("Erro ao obter a localização", error);
        if (error.code === error.PERMISSION_DENIED) {
          alert("Você precisa permitir o acesso à localização.");
        } else {
          alert("Não foi possível obter a localização.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  } else {
    alert("Geolocalização não é suportada pelo seu navegador.");
  }
};

  // Função de envio do formulário
  const handleSubmit = async (e: any) => {
    e.preventDefault();
  
    const loanData = {
      clientName: UserName,
      clientId: userId,
      amount: parseFloat(loanValue),
      latitude: latitude,
      longitude: longitude,
      city: city,
      state: state,
      country: country,
    };
  console.log(loanData);
    try {
      const response = await fetch('http://localhost:3000/loan', {  // URL do backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loanData),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        alert('Solicitação de empréstimo enviada com sucesso para a análise');
      } else {
        throw new Error('Erro ao enviar solicitação de empréstimo');
      }
    } catch (error) {
      console.error('Erro ao enviar dados para o backend:', error);
      alert('Erro ao enviar a solicitação de empréstimo. Tente novamente.');
    }
  };

  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Solicitar Empréstimo</h2>
          </div>

          <div className="flex gap-4 items-center justify-center">
            <Card className="w-[550px]">
              <CardHeader>
                <CardTitle>Solicite seu empréstimo agora mesmo!</CardTitle>
                <CardDescription>Preencha os campos abaixo para enviar a solicitação para análise:</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
              <CardContent>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input id="name" value={UserName || ""} name="nomeCompleto" disabled />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="loanValue">Valor do Empréstimo</Label>
                      <NumericFormat
                        id="loanValue"
                        value={loanValue}
                        onValueChange={handleLoanValueChange}
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="R$ "
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        displayType="input"
                        required={true}
                      />
                    </div>

                  
                    <div className="flex flex-col space-y-3">
                      <Label className="mb-3" htmlFor="location">Localização:</Label>
                     
                    
                    <div className="flex flex-col space-y-1 mb-2 gap-2">
                      <Label htmlFor="name">País</Label>
                      <Input id="name" value={country || ""} name="nomeCompleto" disabled />
                    </div>
                    <div className="flex flex-row" style={{justifyContent:"space-between"}}>
                     <div  className="flex flex-col space-y-1 mb-2 gap-2">
                      <Label htmlFor="name">Estado</Label>
                      <Input id="name" value={state || ""} name="nomeCompleto" disabled />
                      </div>

                      <div className="flex flex-col space-y-1 mb-2 gap-2">
                      <Label htmlFor="name">Cidade</Label>
                      <Input id="name" value={city || ""} name="nomeCompleto" disabled />
                      </div>
                    </div>
                    
                        
                        
                     
                    </div>
                  </div>
                  
               
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancelar</Button>
                <Button>Enviar Solicitação</Button>
              </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
