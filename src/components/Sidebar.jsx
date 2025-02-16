import React from "react";
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  Card,
  Avatar,
} from "@mui/material";
import { Link, useLocation } from "react-router";
import entities from "../entities";
import { useAuth } from "../contexts/AuthContext";
import { Logout } from "@mui/icons-material";

function Sidebar() {
  const location = useLocation();
  const auth = useAuth();

  console.log("ROLE: ", auth.user.role);

  return (
    <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }}>
      <Box
        sx={{
          width: 240,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h5">IMEPS</Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <List>
            {(auth.user?.role === "ADMIN"
              ? entities
              : entities.filter((v, index) => index <= 1)
            ).map((entity) => {
              const isActive = location.pathname === entity.url;
              return (
                <ListItem key={entity.name.plural} disablePadding>
                  <ListItemButton
                    selected={isActive}
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "primary.main",
                        color: "primary.contrastText",
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor: "primary.dark",
                      },
                      fontWeight: "700 !important",
                    }}
                    component={Link}
                    to={entity.url}
                  >
                    <ListItemText primary={entity.name.plural} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
        <Box>
          <Card
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
              p: 2,
            }}
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {auth.displayName?.[0]}
            </Avatar>
            <Typography sx={{ flex: 1 }} variant="body2">
              {auth.displayName}
            </Typography>
            <Button
              onClick={() => {
                auth.logout();
              }}
              sx={{ padding: "4px !important", minWidth: "0 !important" }}
            >
              <Logout fontSize="small" />
            </Button>
          </Card>
        </Box>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
