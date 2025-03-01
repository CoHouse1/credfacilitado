"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NumericFormat } from "react-number-format";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet"
import "leaflet/dist/leaflet.css"; // Importar o CSS do Leaflet

const LoanPage = () => {
  const { loanId } = useParams(); // Obter loanId da URL usando useParams

  const [loanData, setLoanData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    if (!loanId) return; 

    const fetchLoanData = async () => {
      setLoading(true);  
      try {
        const response = await fetch(`http://localhost:3000/loan/${loanId}`);
        if (!response.ok) {
          throw new Error("Erro ao carregar os dados do empréstimo.");
        }
        const data = await response.json();
        setLoanData(data);
        setLoading(false); // Atualizar estado de carregamento
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        setLoading(false); // Atualizar estado de erro
      }
    };

    fetchLoanData();
  }, [loanId]); 

  // Mensagens de erro ou carregamento
  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  const latitude = loanData?.latitude;
  const longitude = loanData?.longitude;
  const lucideIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" viewBox="0 0 293.334 293.334" xml:space="preserve">
<g>
	<g>
		<path style="fill:#FF0000;" d="M146.667,0C94.903,0,52.946,41.957,52.946,93.721c0,22.322,7.849,42.789,20.891,58.878    c4.204,5.178,11.237,13.331,14.903,18.906c21.109,32.069,48.19,78.643,56.082,116.864c1.354,6.527,2.986,6.641,4.743,0.212    c5.629-20.609,20.228-65.639,50.377-112.757c3.595-5.619,10.884-13.483,15.409-18.379c6.554-7.098,12.009-15.224,16.154-24.084    c5.651-12.086,8.882-25.466,8.882-39.629C240.387,41.962,198.43,0,146.667,0z M146.667,144.358    c-28.892,0-52.313-23.421-52.313-52.313c0-28.887,23.421-52.307,52.313-52.307s52.313,23.421,52.313,52.307    C198.98,120.938,175.559,144.358,146.667,144.358z"/>
		<circle style="fill:#FF0000;" cx="146.667" cy="90.196" r="21.756"/>
	</g>
</g>
</svg>`;

  const customIcon = new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(lucideIconSvg)}`, 
    iconSize: [32, 32], 
    iconAnchor: [16, 32], 
    popupAnchor: [0, -32], 
  });


  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <h1>Detalhes do Empréstimo (ID: {loanId})</h1>
        <div className="flex gap-4 items-center justify-center">
          {loanData ? (
            <Card className="w-[550px]">
              <CardHeader>
                <CardTitle>Detalhes do Empréstimo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-1.5">
                    <label>Nome do Cliente</label>
                    <Input value={loanData.clientName} disabled />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label>Valor do Empréstimo</label>
                    <NumericFormat
                      value={loanData.amount}
                      thousandSeparator="."
                      decimalSeparator=","
                      prefix="R$ "
                      displayType="text"
                      disabled
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label>Localização</label>
                    <div className="flex gap-4">
                      <Input value={loanData.city} disabled placeholder="Cidade" />
                      <Input value={loanData.state} disabled placeholder="Estado" />
                      <Input value={loanData.country} disabled placeholder="País" />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label>Status do Empréstimo</label>
                    <Input
                      className={loanData.status === "Approved" ? "text-green-700" : "text-red-600"}
                      value={loanData.status === "Approved" ? "Aprovado" : "Reprovado"}
                      disabled
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label>Pontuação de Crédito</label>
                    <Input value={loanData.creditScore} disabled />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label>Data de Criação</label>
                    <Input value={new Date(loanData.createdAt).toLocaleString()} disabled />
                  </div>
                </div>
              </CardContent>
              
            </Card>
          ) : (
            <div>Empréstimo não encontrado!</div>
          )}
        </div>

 
        {latitude && longitude && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold">Localização no Mapa</h2>
            <MapContainer
              center={[latitude, longitude]} // Coordenadas para o centro do mapa
              zoom={12} // Nível de zoom
              style={{ width: "100%", height: "400px" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
              />
              <Marker icon={customIcon} position={[latitude, longitude]}>
                <Popup>
                  {loanData.city}, {loanData.state}, {loanData.country}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanPage;
