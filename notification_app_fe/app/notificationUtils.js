"use client";

import { useEffect, useState } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Card,
  CardContent,
  Chip,
  Box,
  Typography,
} from "@mui/material";

export const READ_STORAGE_KEY = "readNotificationIds";

const PRIORITY_WEIGHT = { Placement: 3, Result: 2, Event: 1 };

export const appTheme = createTheme();

export function MuiAppShell({ children }) {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export function formatTime(ts) {
  if (!ts) return "";
  const d = new Date(ts.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleString();
}

export function getReadIds() {
  try {
    return new Set(JSON.parse(localStorage.getItem(READ_STORAGE_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

export function markRead(id) {
  const ids = getReadIds();
  ids.add(id);
  localStorage.setItem(READ_STORAGE_KEY, JSON.stringify([...ids]));
}

export function getTopPriority(notifications, readIds, limit) {
  return notifications
    .filter((item) => !readIds.has(item.ID))
    .sort((a, b) => {
      const wa = PRIORITY_WEIGHT[a.Type] || 0;
      const wb = PRIORITY_WEIGHT[b.Type] || 0;
      if (wa !== wb) return wb - wa;
      return new Date(b.Timestamp.replace(" ", "T")) - new Date(a.Timestamp.replace(" ", "T"));
    })
    .slice(0, limit);
}

export function useNotifications(typeFilter) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams();
    if (typeFilter && typeFilter !== "All") {
      params.set("notification_type", typeFilter);
    }
    const qs = params.toString();

    fetch(`/api/notifications${qs ? `?${qs}` : ""}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setList(data.notifications || []);
      })
      .catch(() => setError("Failed to load notifications"))
      .finally(() => setLoading(false));
  }, [typeFilter]);

  return { list, loading, error };
}

export function useReadIds() {
  const [readIds, setReadIds] = useState(new Set());

  useEffect(() => {
    setReadIds(getReadIds());
  }, []);

  function markAsRead(id) {
    markRead(id);
    setReadIds(getReadIds());
  }

  return { readIds, markAsRead };
}

export function NotificationCard({ item, read = false, onClick }) {
  return (
    <Card
      variant="outlined"
      onClick={onClick}
      sx={{ mb: 1.5, cursor: read ? "default" : "pointer", opacity: read ? 0.75 : 1 }}
    >
      <CardContent>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
          <Chip label={item.Type} size="small" color={read ? "default" : "primary"} />
          <Typography variant="caption" color="text.secondary">
            {formatTime(item.Timestamp)}
          </Typography>
          {!read && (
            <Typography variant="caption" fontWeight={600} color="primary">
              New
            </Typography>
          )}
        </Box>
        <Typography>{item.Message}</Typography>
      </CardContent>
    </Card>
  );
}
