'use client';

import { Logo } from "@/components/logo";
import SidebarLayout, { SidebarItem } from "@/components/sidebar-layout";
import { SelectedTeamSwitcher, useUser } from "@stackframe/stack";
import { Plus, HandCoins, BadgePercent, BarChart4, Columns3, Globe, Locate, Settings2, ShoppingBag, ShoppingCart, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const navigationItems: SidebarItem[] = [
  {
    name: "Visão Geral",
    href: "/",
    icon: Globe,
    type: "item",
  },
  {
    type: 'label',
    name: 'Financeiro',
  },
  {
    name: "Meus Empréstimos",
    href: "/loans",
    icon: HandCoins,
    type: "item",
  },
  {
    name: "Novo Empréstimo",
    href: "/newLoan",
    icon: Plus,
    type: "item",
  }
];

export default function Layout(props: { children: React.ReactNode }) {
  const params = useParams<{ teamId: string }>();
  const user = useUser({ or: 'redirect' });
  const team = user.useTeam(params.teamId);
  const router = useRouter();

  if (!team) {
    router.push('/dashboard');
    return null;
  }

  return (
    <SidebarLayout 
      items={navigationItems}
      basePath={`/dashboard/${team.id}`}
      sidebarTop={<Logo 
        link={`/dashboard/${team.id}`}
      />}

    >
      {props.children}
    </SidebarLayout>
  );
}