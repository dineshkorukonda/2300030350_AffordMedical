"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

const LINKS = [
  { href: "/", label: "All" },
  { href: "/priority", label: "Priority" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Toolbar sx={{ maxWidth: 720, width: "100%", mx: "auto", px: { xs: 1, sm: 2 } }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Campus Notifications
        </Typography>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          {LINKS.map(({ href, label }) => (
            <Button
              key={href}
              component={Link}
              href={href}
              color={pathname === href ? "primary" : "inherit"}
            >
              {label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
