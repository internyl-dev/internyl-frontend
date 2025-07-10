"use client";

import Link from "next/link";
import { useAdminCheck } from "@/lib/hooks/useAdminCheck";
import { usePathname, useRouter } from "next/navigation";
import { Box, Drawer, List, ListItemButton, ListItemText, Typography, CircularProgress } from "@mui/material";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = useAdminCheck();  // should return: null | true | false
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isAdmin === false) {
      router.push("/");
    }
  }, [isAdmin, router]);

  if (isAdmin === null) {
    // still loading admin status
    return (
      <Box sx={{ mt: 12, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isAdmin === false) {
    // Optionally show message briefly if you want (or blank since redirecting)
    return null;
  }

  // isAdmin === true here
  return (
    <Box sx={{ display: "flex", pt: 8 }}>
      <Drawer
        variant="permanent"
        open
        PaperProps={{ sx: { width: 240, top: 64 } }}
      >
        <List>
          <ListItemButton component={Link} href="/admin" selected={pathname === "/admin"}>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
          <ListItemButton
            component={Link}
            href="/admin/manage-internships"
            selected={pathname.startsWith("/admin/manage-internships")}
          >
            <ListItemText primary="Manage Internships" />
          </ListItemButton>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: 30 }}>
        {children}
      </Box>
    </Box>
  );
}
