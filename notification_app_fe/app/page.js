"use client";

import { Typography, CircularProgress, Alert } from "@mui/material";
import { useNotifications, useReadIds, NotificationCard } from "./notificationUtils";

export default function AllNotificationsPage() {
  const { list, loading, error } = useNotifications();
  const { readIds, markAsRead } = useReadIds();

  const newCount = list.filter((n) => !readIds.has(n.ID)).length;

  return (
    <>
      <Typography variant="h5" gutterBottom>
        All Notifications
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Click a new notification to mark it as read
      </Typography>

      {loading && <CircularProgress size={24} />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {list.length} total · {newCount} new
          </Typography>
          {list.map((item) => (
            <NotificationCard
              key={item.ID}
              item={item}
              read={readIds.has(item.ID)}
              onClick={() => !readIds.has(item.ID) && markAsRead(item.ID)}
            />
          ))}
        </>
      )}
    </>
  );
}
