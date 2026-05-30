"use client";

import { useMemo, useState } from "react";
import {
  Typography,
  CircularProgress,
  Alert,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  useNotifications,
  useReadIds,
  getTopPriority,
  NotificationCard,
} from "../notificationUtils";

export default function PriorityPage() {
  const [topN, setTopN] = useState(10);
  const [typeFilter, setTypeFilter] = useState("All");
  const { list, loading, error } = useNotifications(typeFilter);
  const { readIds, markAsRead } = useReadIds();

  const priority = useMemo(
    () => getTopPriority(list, readIds, topN),
    [list, readIds, topN]
  );

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Priority Notifications
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Top unread by priority: Placement → Result → Event
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <FormControl size="small" sx={{ minWidth: 80 }}>
          <InputLabel>Top</InputLabel>
          <Select label="Top" value={topN} onChange={(e) => setTopN(Number(e.target.value))}>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Type</InputLabel>
          <Select label="Type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading && <CircularProgress size={24} />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Showing {priority.length} of top {topN} new
            {typeFilter !== "All" ? ` · filtered by ${typeFilter}` : ""}
          </Typography>
          {priority.map((item) => (
            <NotificationCard
              key={item.ID}
              item={item}
              onClick={() => markAsRead(item.ID)}
            />
          ))}
          {priority.length === 0 && (
            <Typography color="text.secondary">No new priority notifications</Typography>
          )}
        </>
      )}
    </>
  );
}
