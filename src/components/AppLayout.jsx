import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, Navigate } from "react-router-dom";
import {
  FolderKanban,
  LayoutDashboard,
  LogIn,
  Search,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "../api/auth.js";

const navItems = [
  { to: "/", label: "Home", icon: LayoutDashboard },
  { to: "/search", label: "Search", icon: Search },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/employees", label: "Employees", icon: Users },
];

export default function AppLayout() {
  const [query, setQuery] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await auth.get();
      setUser(data?.user || null);
      setCheckingAuth(false);
    };

    checkUser();

    const { data: authListener } = auth.onAuthStateChange?.((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user || null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    }) || {};

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const filteredNav = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return navItems;
    return navItems.filter((item) => item.label.toLowerCase().includes(q));
  }, [query]);

  return (
    <SidebarProvider>
      {!checkingAuth && !user ? <Navigate to="/login" replace /> : null}
      <Sidebar variant="inset">
        <SidebarHeader>
          <Link to="/" className="flex items-center gap-3 rounded-lg px-2 py-1">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              PM
            </div>
            <div className="leading-tight">
              <div className="font-semibold">Project Hub</div>
              <div className="text-xs text-muted-foreground">Jira-style workspace</div>
            </div>
          </Link>
          <SidebarInput
            placeholder="Search navigation..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredNav.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      render={
                        <NavLink to={item.to} end={item.to === "/"}>
                          <item.icon />
                          <span>{item.label}</span>
                        </NavLink>
                      }
                    />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarSeparator />

        <SidebarFooter>
          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">
              Projects, teams, tasks, and subtasks stay in Supabase.
            </CardContent>
          </Card>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex items-center gap-3 border-b px-4 py-3 md:px-6">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Search className="size-4" />
            <span>Workspace</span>
          </div>
        </header>
        <main className="p-4 md:p-6">
          {checkingAuth ? <p className="text-sm text-muted-foreground">Checking session...</p> : <Outlet />}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
