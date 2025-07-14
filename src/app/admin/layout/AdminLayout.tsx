"use client";

import Link from "next/link";
import { useAdminCheck } from "@/lib/hooks/useAdminCheck";
import { usePathname, useRouter } from "next/navigation";
import {
    Box,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    CircularProgress,
    IconButton,
} from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const isAdmin = useAdminCheck(); // null | true | false
    const pathname = usePathname();
    const router = useRouter();

    const drawerWidth = 240;
    const [open, setOpen] = useState(true);

    useEffect(() => {
        if (isAdmin === false) {
            router.push("/");
        }
    }, [isAdmin, router]);

    if (isAdmin === null) {
        return (
            <Box sx={{ mt: 12, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
            </Box>
        );
    }
    if (isAdmin === false) return null;

    return (
        <Box sx={{ display: "flex", pt: 8, minHeight: "100vh" }}>
            {/* Toggle Sidebar Button */}
            {/* <IconButton
        onClick={() => setOpen(!open)}
        sx={{
          position: "fixed",
          top: 50,
          left: 16,
          zIndex: 1301,
          bgcolor: "background.paper",
          boxShadow: 1,
          borderRadius: "50%",
          "&:hover": { bgcolor: "grey.200" },
        }}
        aria-label={open ? "Close sidebar" : "Open sidebar"}
      >
        <MenuIcon />
      </IconButton> */}

            <Drawer
                variant="persistent"
                open={open}
                PaperProps={{
                    sx: {
                        width: drawerWidth,
                        top: 64,
                        borderRadius: "0 12px 12px 0",
                        boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
                        backgroundImage: "linear-gradient(-25deg, #AEAEF3 0%, #D3D3EA 88%)",
                        color: "black",
                        borderRight: "none",
                        overflowX: "hidden",
                        transition: "width 0.3s ease",
                        px: 1,
                        pt: 2,
                    },
                }}
            >
                <List>
                    <ListItemButton
                        component={Link}
                        href="/admin"
                        selected={pathname === "/admin"}
                        sx={{
                            borderRadius: 1,
                            mb: 1,
                            "&.Mui-selected": {
                                bgcolor: "primary.main",
                                color: "primary.contrastText",
                                "&:hover": { bgcolor: "primary.dark" },
                            },
                            "&:hover": { bgcolor: "grey.100" },
                        }}
                    >
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>

                    <ListItemButton
                        component={Link}
                        href="/admin/manage-internships"
                        selected={pathname.startsWith("/admin/manage-internships")}
                        sx={{
                            borderRadius: 1,
                            "&.Mui-selected": {
                                bgcolor: "primary.main",
                                color: "primary.contrastText",
                                "&:hover": { bgcolor: "primary.dark" },
                            },
                            "&:hover": { bgcolor: "grey.100" },
                        }}
                    >
                        <ListItemText primary="Manage Internships" />
                    </ListItemButton>
                </List>
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    ml: open ? `${drawerWidth}px` : 0,
                    transition: "margin-left 0.3s ease",
                }}
            >
                {children}
            </Box>
        </Box>
    );
}
