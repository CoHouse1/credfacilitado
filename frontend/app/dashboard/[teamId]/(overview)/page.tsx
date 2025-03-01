import * as React from "react";
import { Loans } from "./loans";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


export default function DashboardPage() {

  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Visão Geral</h2>
          </div>
          <div className="grid gap-4 grid-cols-1">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle className="mb-5">Empréstimos Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <Loans />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
