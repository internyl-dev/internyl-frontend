"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/config/firebaseConfig";
import { useAdminCheck } from "@/lib/hooks/useAdminCheck";

import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Typography,
  IconButton,
  Avatar,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import WorkIcon from "@mui/icons-material/Work";
import ReportIcon from "@mui/icons-material/Report";
import LogoutIcon from "@mui/icons-material/Logout";

// ----------------------------------
// CONFIG
// ----------------------------------
const drawerWidth = 280;

const navItems = [
  { label: "Dashboard", href: "/admin", icon: <DashboardIcon /> },
  { label: "Manage Internships", href: "/admin/manage-internships", icon: <WorkIcon /> },
  { label: "Reports", href: "/admin/reports", icon: <ReportIcon /> },
];

// ----------------------------------
// COMPONENT
// ----------------------------------
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
  const isAdmin = useAdminCheck();

  const [open, setOpen] = useState(!isSmDown);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // -----------------------------
  // AUTH STATE
  // -----------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return () => unsubscribe();
  }, []);

  // -----------------------------
  // REDIRECT NON-ADMINS
  // -----------------------------
  useEffect(() => {
    if (isAdmin === false) router.push("/");
  }, [isAdmin, router]);

  // -----------------------------
  // ADAPT SIDEBAR TO SCREEN SIZE
  // -----------------------------
  useEffect(() => {
    setOpen(!isSmDown);
  }, [isSmDown]);

  // -----------------------------
  // HANDLERS
  // -----------------------------
  const handleLogout = async () => {
    await auth.signOut();
    router.push("/");
  };

  // -----------------------------
  // LOADING & AUTH GUARDS
  // -----------------------------
  if (isAdmin === null) {
    return (
      <Box sx={{ mt: 12, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isAdmin === false) return null;

  // -----------------------------
  // USER INFO
  // -----------------------------
  const displayName = currentUser?.displayName || "Admin";
  const email = currentUser?.email || "admin@example.com";
  const photoURL = currentUser?.photoURL;

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <Box sx={{ display: "flex", pt: 8, minHeight: "100vh" }}>
      {/* Floating Sidebar Toggle (Mobile) */}
      <IconButton
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close sidebar" : "Open sidebar"}
        sx={{
          position: "fixed",
          bottom: 16,
          left: 16,
          zIndex: 1301,
          bgcolor: "background.paper",
          boxShadow: 2,
          borderRadius: "50%",
          "&:hover": { bgcolor: "grey.200" },
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Sidebar Drawer */}
      <Drawer
        variant={isSmDown ? "temporary" : "persistent"}
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: drawerWidth,
            top: 64,
            px: 2,
            pt: 2.5,
            borderRight: "none",
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            color: "black",
            boxShadow: "6px 0 18px rgba(0,0,0,0.08)",
            borderTopRightRadius: 16,
            borderBottomRightRadius: 16,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* User Info */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 3,
            px: 1,
            flexWrap: "wrap",
          }}
        >
          <Avatar
            src={photoURL || undefined}
            sx={{ bgcolor: "primary.main", width: 48, height: 48 }}
          >
            {!photoURL && displayName.charAt(0).toUpperCase()}
          </Avatar>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              component="div"
              fontWeight="bold"
              sx={{ lineHeight: 1.2, display: "flex", alignItems: "center" }}
            >
              {displayName}
              <Chip
                label="Admin"
                size="small"
                color="primary"
                sx={{ ml: 1, height: 20, fontSize: "0.7rem", fontWeight: "bold" }}
              />
            </Typography>

            <Typography variant="caption" color="text.secondary" noWrap>
              {email}
            </Typography>
          </Box>
        </Box>

        {/* Navigation Links */}
        <List>
          {navItems.map(({ label, href, icon }) => {
            const isSelected = pathname === href || pathname.startsWith(href + "/");

            return (
              <ListItemButton
                key={href}
                component={Link}
                href={href}
                selected={isSelected}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  color: "text.primary",
                  backgroundColor: isSelected ? "primary.main" : "transparent",
                  "&:hover": {
                    backgroundColor: isSelected
                      ? "primary.dark"
                      : "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: isSelected ? "inherit" : "text.secondary" }}>
                  {icon}
                </ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            );
          })}
        </List>

        {/* Logout Button */}
        <Box sx={{ mt: "auto", px: 1, mb: 2 }}>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              color: "error.main",
              "&:hover": {
                backgroundColor: "rgba(255,0,0,0.05)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "error.main" }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </Box>
      </Drawer>

      {/* Main Page Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          ml: open && !isSmDown ? `${drawerWidth}px` : 0,
          transition: "margin-left 0.3s ease",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
