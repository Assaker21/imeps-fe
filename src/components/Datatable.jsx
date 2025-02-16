import React, { useEffect, useReducer, useRef, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  CardActions,
  ButtonGroup,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import entities from "../entities";
import { useReactToPrint } from "react-to-print";

/**
 * A helper to convert a related object (like row.country) into a display label:
 *  - Collect all string or number fields
 *  - Join them by ", "
 */
function getObjectLabel(obj) {
  if (!obj || typeof obj !== "object") return "";

  if (obj.name) return obj.name;
  if (obj.firstName) return obj.firstName + " " + obj.lastName;
  // Filter out fields we don't want to display (like "id", "createdAt", etc.)
  const IGNORE_FIELDS = ["id", "createdAt", "updatedAt", "deletedAt"];
  const displayVals = [];
  for (const key of Object.keys(obj)) {
    if (IGNORE_FIELDS.includes(key) || key.includes("Id")) continue;
    const val = obj[key];
    // Only add if it's a string or number
    if (typeof val === "string" || typeof val === "number") {
      displayVals.push(val);
    }
  }
  return displayVals.join(", ");
}

/**
 * Main Datatable component.
 */
export default function Datatable({ entity, allEntities = [] }) {
  // If no allEntities provided, default to "entities" import:
  allEntities = allEntities.length ? allEntities : entities;
  const layout = localStorage.getItem("layout") || "cards";

  const [rows, setRows] = useState([]);
  const [, triggerRerender] = useReducer((x) => x + 1, 0);
  // Will hold options for any resourceIndex-based fields
  // Example: resourcesMap[4] => array of Diplomas
  const [resourcesMap, setResourcesMap] = useState({});

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedRow, setSelectedRow] = useState(null);

  const contentRef = useRef();
  const reactToPrint = useReactToPrint({ contentRef });

  const dataGridRef = useRef();

  // Fetch main entity rows
  useEffect(() => {
    refreshRows();
  }, [entity.url]);

  const refreshRows = async () => {
    const res = await fetch(`https://imepsapi.onrender.com${entity.url}`, {
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("token"),
      },
    });
    const data = await res.json();
    setRows(data);
  };

  // Identify which resourceIndexes we need to fetch
  useEffect(() => {
    const indexesToFetch = new Set();
    entity.form.forEach((f) => {
      if (typeof f.resourceIndex === "number") {
        indexesToFetch.add(f.resourceIndex);
      }
    });

    // For each resourceIndex, fetch if not already in resourcesMap
    indexesToFetch.forEach((idx) => {
      if (!resourcesMap[idx]) {
        fetchResource(idx);
      }
    });
  }, [entity, resourcesMap]);

  // Fetch data from another entity’s URL and store in resourcesMap
  const fetchResource = async (resourceIdx) => {
    const resourceEntity = allEntities[resourceIdx];
    if (!resourceEntity) return; // safety check

    const res = await fetch(
      `https://imepsapi.onrender.com${resourceEntity.url}`,
      {
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
      }
    );
    const data = await res.json();
    setResourcesMap((prev) => ({
      ...prev,
      [resourceIdx]: data,
    }));
  };

  /**
   * For a given row & field definition, produce the displayed value:
   * 1. If there's a resourceIndex, we might have a nested object (e.g. row.country if field = countryId).
   * 2. We attempt to find that nested object by removing "Id" from the field name.
   * 3. If found, we join its string/number fields with commas. Otherwise, fallback to row[field].
   */
  const getDisplayValue = (row, f) => {
    // If there's no row or field, just return ""
    if (!row || !f) return "";

    // If this is a relationship field with resourceIndex
    if (typeof f.resourceIndex === "number") {
      // relationshipName = e.g. "countryId" => "country"; "userId" => "user"
      const relationshipName = f.field.replace(/Id$/, "");

      const relatedObj = row[relationshipName];
      // If it's an array (for multi-relations) or an object (for single-relations)
      if (Array.isArray(relatedObj)) {
        // e.g. row.diplomas = [{...}, {...}], join each object label
        console.log("ARRAY: ", relatedObj);
        return relatedObj.map((obj) => getObjectLabel(obj)).join(", ");
      } else if (relatedObj && typeof relatedObj === "object") {
        // Single nested object
        return getObjectLabel(relatedObj);
      }
      // If not found or the relationship wasn't populated, fallback to row[f.field]
    }

    // If not a relationship field, or no nested object, fallback
    const val = row[f.field];
    if (Array.isArray(val)) {
      // For multiSelect fields that might store array of IDs
      console.log("ARRAY: 2", val);
      return val.map((v) => v.name).join(", ");
    } else if (val != null) {
      return val.toString();
    }
    return "";
  };

  // DataGrid columns
  const columns = [
    ...entity.form.map((f) => ({
      field: f.field,
      headerName: f.label || f.field,
      flex: 1,
      // We override the valueGetter to display nested relationships nicely
      valueGetter: (params, row) => getDisplayValue(row, f),
    })),
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Button variant="text" onClick={() => handleEditClick(params.row)}>
            Edit
          </Button>
          <Button
            variant="text"
            color="error"
            size="small"
            sx={{ ml: 1 }}
            onClick={() => handleDeleteClick(params.row)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  // Handle "Edit" from either DataGrid or Cards
  const handleEditClick = (row) => {
    setSelectedRow(row);
    setFormData(row);
    setOpenUpdate(true);
  };

  // Handle "Delete" from either DataGrid or Cards
  const handleDeleteClick = (row) => {
    setSelectedRow(row);
    setOpenDelete(true);
  };

  // CREATE
  const handleCreate = async () => {
    await fetch(`https://imepsapi.onrender.com${entity.url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify(formData),
    });
    setOpenCreate(false);
    refreshRows();
    setFormData({});
  };

  // UPDATE
  const handleUpdate = async () => {
    await fetch(
      `https://imepsapi.onrender.com${entity.url}/${selectedRow.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(formData),
      }
    );
    setOpenUpdate(false);
    refreshRows();
    setFormData({});
    setSelectedRow(null);
  };

  // DELETE
  const handleDelete = async () => {
    await fetch(
      `https://imepsapi.onrender.com${entity.url}/${selectedRow.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
      }
    );
    setOpenDelete(false);
    refreshRows();
    setSelectedRow(null);
  };

  /**
   * Helper function to handle form field changes.
   * If it's a multiSelect, "value" will be an array of selected IDs.
   */
  const handleFieldChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  /**
   * Helper function to render a single form field based on type.
   */
  const renderFormField = (f) => {
    const value = formData[f.field] ?? (f.type === "multiselect" ? [] : "");

    // If resourceIndex is defined, we can load options from resourcesMap
    const resourceItems =
      typeof f.resourceIndex === "number"
        ? resourcesMap[f.resourceIndex]
        : null;

    switch (f.type) {
      case "text":
        return (
          <TextField
            fullWidth
            label={f.label}
            value={value}
            onChange={(e) => handleFieldChange(f.field, e.target.value)}
          />
        );

      case "password":
        return (
          <TextField
            fullWidth
            type="password"
            label={f.label}
            value={value}
            onChange={(e) => handleFieldChange(f.field, e.target.value)}
          />
        );

      case "number":
        return (
          <TextField
            fullWidth
            type="number"
            label={f.label}
            value={value}
            onChange={(e) => handleFieldChange(f.field, Number(e.target.value))}
          />
        );

      case "date":
        return (
          <TextField
            fullWidth
            type="date"
            label={f.label}
            value={value ? value.substring(0, 10) : ""}
            onChange={(e) => handleFieldChange(f.field, e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        );

      case "checkbox":
        return (
          <FormControlLabel
            label={f.label}
            checked={!!value}
            onChange={(e) => handleFieldChange(f.field, e.target.checked)}
            control={<Checkbox />}
          />
        );

      case "textarea":
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            label={f.label}
            value={value}
            onChange={(e) => handleFieldChange(f.field, e.target.value)}
          />
        );

      case "select":
        // Single select from either fixed options (enums) or resourceIndex
        return (
          <FormControl fullWidth>
            <InputLabel>{f.label}</InputLabel>
            <Select
              label={f.label}
              value={value}
              onChange={(e) => handleFieldChange(f.field, e.target.value)}
            >
              {/* If we have static options (enums) */}
              {f.options?.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}

              {/* If we have dynamic resource items */}
              {resourceItems?.map((item) => {
                // We'll guess a 'name' or 'email' or 'id' field for the label
                // or combine them if there's more than one
                const label = getObjectLabel(item) || item.id;
                return (
                  <MenuItem key={item.id} value={item.id}>
                    {label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        );

      case "multiselect":
        // Multi select from resourceIndex
        return (
          <FormControl fullWidth>
            <InputLabel>{f.label}</InputLabel>
            <Select
              label={f.label}
              multiple
              value={Array.isArray(value) ? value : []}
              onChange={(e) => handleFieldChange(f.field, e.target.value)}
            >
              {resourceItems?.map((item) => {
                const label = getObjectLabel(item) || item.id;
                return (
                  <MenuItem key={item.id} value={item.id}>
                    {label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        );

      default:
        // Fallback if 'type' is unrecognized
        return (
          <TextField
            fullWidth
            label={f.label}
            value={value}
            onChange={(e) => handleFieldChange(f.field, e.target.value)}
          />
        );
    }
  };

  /**
   *  Renders a Card Layout instead of DataGrid
   */
  const renderCardLayout = () => {
    if (!rows || rows.length === 0) {
      return <Typography sx={{ mt: 2 }}>No data found.</Typography>;
    }

    return (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
        {rows?.map?.((row) => (
          <Card key={row.id} sx={{ width: 300 }}>
            <CardContent>
              {entity.form.map((f) => (
                <Box key={f.field} sx={{ mb: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
                  >
                    <strong>{f.label || f.field}:</strong>{" "}
                    {getDisplayValue(row, f)}
                  </Typography>
                </Box>
              ))}
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end" }}>
              <Button size="small" onClick={() => handleEditClick(row)}>
                Edit
              </Button>
              <Button
                color="error"
                size="small"
                sx={{ ml: 1 }}
                onClick={() => handleDeleteClick(row)}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    );
  };

  return (
    <Box>
      <Typography variant="h6">{entity.name.plural}</Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          alignItems: "center",
          pt: 2,
        }}
      >
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          Create
        </Button>

        <Button
          onClick={() => {
            reactToPrint();
          }}
        >
          Print
        </Button>

        <Button
          onClick={() => {
            dataGridRef.current.exportDataAsCsv();
          }}
        >
          Export to EXCEL
        </Button>

        <Box sx={{ flex: 1 }} />
        <ButtonGroup>
          <Button
            onClick={() => {
              localStorage.setItem("layout", "table");
              triggerRerender();
            }}
            variant={layout == "table" ? "contained" : "outlined"}
          >
            Table
          </Button>
          <Button
            onClick={() => {
              localStorage.setItem("layout", "cards");
              triggerRerender();
            }}
            variant={layout == "cards" ? "contained" : "outlined"}
          >
            Cards
          </Button>
        </ButtonGroup>
      </Box>

      <div ref={contentRef}>
        {/* Conditional Rendering: Table or Cards */}
        {layout === "cards"
          ? // Card Layout
            renderCardLayout()
          : // DataGrid Layout
            null}

        <div style={layout === "table" ? {} : { display: "none" }}>
          <Box sx={{ height: 400, mt: 2 }}>
            <DataGrid
              apiRef={dataGridRef}
              density="compact"
              rows={rows}
              columns={columns}
              getRowId={(row) => row.id}
              paginationMode="server"
              rowCount={rows.length}
              hideFooterPagination
              sx={{
                "& .MuiDataGrid-footerContainer": { display: "none" },
              }}
            />
          </Box>
        </div>
      </div>

      {/* CREATE DIALOG */}
      <Dialog fullScreen open={openCreate} onClose={() => setOpenCreate(false)}>
        <DialogTitle>Create {entity.name.singular}</DialogTitle>
        <DialogContent>
          {entity.form.map((f) => (
            <Box key={f.field} sx={{ mt: 2 }}>
              {renderFormField(f)}
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* UPDATE DIALOG */}
      <Dialog fullScreen open={openUpdate} onClose={() => setOpenUpdate(false)}>
        <DialogTitle>Update {entity.name.singular}</DialogTitle>
        <DialogContent>
          {entity.form.map((f) => (
            <Box key={f.field} sx={{ mt: 2 }}>
              {renderFormField(f)}
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdate(false)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Delete {entity.name.singular}</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
