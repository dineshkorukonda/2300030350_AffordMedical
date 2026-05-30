"use client";

import { Container } from "@mui/material";
import { MuiAppShell } from "./notificationUtils";
import Navbar from "./Navbar";

export default function AppLayout({ children }) {
  return (
    <MuiAppShell>
      <Navbar />
      <Container maxWidth="sm" component="main" sx={{ py: 3 }}>
        {children}
      </Container>
    </MuiAppShell>
  );
}
