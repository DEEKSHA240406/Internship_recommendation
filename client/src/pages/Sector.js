import { filter, set } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, SectorListToolbar, UserMoreMenu } from '../sections/@dashboard/app/User';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'view', label: 'View', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query, roleFilter) {
  // Add safety check to ensure array is actually an array
  if (!Array.isArray(array)) {
    console.error('applySortFilter received non-array:', array);
    return [];
  }

  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  let filteredArray = stabilizedThis.map((el) => el[0]);

  // Apply text query filter
  if (query) {
    filteredArray = filteredArray.filter(
      (sector) => sector.name && sector.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Apply role filter (if needed for sectors)
  if (roleFilter) {
    filteredArray = filteredArray.filter(
      (sector) => sector.role && sector.role.toLowerCase() === roleFilter.toLowerCase()
    );
  }

  return filteredArray;
}

export default function Sector() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('email'); // Default sort by email
  const [filterName, setFilterName] = useState('');
  const [roleFilter, setRoleFilter] = useState(''); // State for role filter
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // State for sectors
  const [sectors, setSectors] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState('');
  // const [role, setRole] = useState('');
  const [selectedSector, setSelectedSector] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch sectors from the server on component mount
  useEffect(() => {
    fetchSectors();
  }, []);

  // Fetch sectors from the server
  // Fetch sectors from the server
  const fetchSectors = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://internship-recommendation-u8d3.onrender.com/api/sectors');

      // Check if response has the expected structure
      if (response.data && response.data.success && Array.isArray(response.data.sectors)) {
        setSectors(response.data.sectors);
      } else if (Array.isArray(response.data)) {
        // Fallback for direct array response
        setSectors(response.data);
      } else {
        console.error('API did not return expected format:', response.data);
        setSectors([]);
        toast.error('Invalid data format received from server');
      }
    } catch (error) {
      console.error('Error fetching sectors:', error);
      setSectors([]); // Ensure it's always an array
      toast.error('Failed to fetch sectors');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = sectors.map((n) => n.email); // Use email as unique identifier
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, email) => {
    const selectedIndex = selected.indexOf(email);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, email);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  // show date and time
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle opening and closing of modal for editing Sector
  const handleOpenModal = (userId) => {
    if (userId) {
      setEditingUserId(userId);
      const userToEdit = sectors.find((sector) => sector._id === userId);
      if (userToEdit) {
        setName(userToEdit.name || '');
      }
    } else {
      setEditingUserId(null);
      setName('');
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setName('');

    setEditingUserId(null);
  };

  // Handle adding a new Sector
  const handleAddSector = async () => {
    try {
      const response = await axios.post('https://internship-recommendation-u8d3.onrender.com/api/sectors', { name }); // Adjust based on your actual data structure
      toast.success('Sector added successfully');
      fetchSectors(); // Refresh Sector list after adding
      handleCloseModal(); // Close modal after adding
    } catch (error) {
      console.error('Error adding Sector:', error);
    }
  };

  // Handle updating a Sector
  const handleUpdateSector = async () => {
    try {
      const response = await axios.put(
        `https://internship-recommendation-u8d3.onrender.com/api/sectors/${editingUserId}`,
        { name }
      ); // Adjust endpoint as necessary
      toast.success(response.data.message);
      fetchSectors(); // Refresh Sector list after updating
      handleCloseModal(); // Close modal after updating
    } catch (error) {
      console.error('Error updating Sector:', error);
    }
  };

  // Handle deleting a Sector
  const handleDeleteSector = async (userId) => {
    if (window.confirm('Are you sure you want to delete this Sector?')) {
      try {
        const response = await axios.delete(
          `https://internship-recommendation-u8d3.onrender.com/api/sectors/${userId}`
        ); // Adjust endpoint as necessary
        toast.success(response.data.message);
        fetchSectors(); // Refresh Sector list after deletion
      } catch (error) {
        console.error('Error deleting Sector:', error);
      }
    }
  };

  const handleViewSector = (Sector) => {
    // Open a modal or set state to display Sector details
    setSelectedSector(Sector); // Assuming you have state to hold selected Sector data
    setViewModalOpen(true); // Open the modal for viewing Sector details
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - sectors.length) : 0;

  // Apply sorting and filtering
  const filteredSectors = applySortFilter(sectors, getComparator(order, orderBy), filterName, roleFilter);

  const isUserNotFound = filteredSectors.length === 0;

  return (
    <Page title="Sector">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Sector
          </Typography>
          <Button
            variant="contained"
            onClick={() => handleOpenModal(null)}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Sector
          </Button>
        </Stack>

        <Card>
          <SectorListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            roleFilter={roleFilter}
            onRoleFilterChange={(e) => setRoleFilter(e.target.value)}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={sectors.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredSectors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, name } = row; // Adjust based on your actual data structure
                    const isItemSelected = selected.indexOf(name) !== -1;

                    return (
                      <TableRow
                        hover
                        key={_id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell align="left">
                          <IconButton onClick={() => handleViewSector(row)} aria-label="view Sector">
                            <Iconify icon="eva:eye-fill" />
                          </IconButton>
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} src="/path/to/default/avatar.png" />{' '}
                            {/* Use a default avatar or Sector's avatar */}
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">
                          <UserMoreMenu
                            onEdit={() => handleOpenModal(row._id)}
                            onDelete={() => handleDeleteSector(row._id)}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={sectors.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

        {/* Modal for Editing Sector */}
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>{editingUserId ? 'Edit Sector' : 'Add New Sector'}</DialogTitle>
          <DialogContent>
            {/* Name Field */}
            <TextField
              label="Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancel</Button>
            {editingUserId ? (
              <Button onClick={handleUpdateSector}>Update Sector</Button>
            ) : (
              <Button onClick={handleAddSector}>Add Sector</Button>
            )}
          </DialogActions>
        </Dialog>

        <Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)}>
          <DialogTitle>Sector Details</DialogTitle>
          <DialogContent>
            <TextField label="Name" value={selectedSector?.name} fullWidth margin="normal" disabled />
            <TextField
              label="Created At"
              value={formatDate(selectedSector?.createdAt)}
              fullWidth
              margin="normal"
              disabled
            />
            <TextField
              label="Updated At"
              value={formatDate(selectedSector?.updatedAt)}
              fullWidth
              margin="normal"
              disabled
            />
            {/* Add more fields as necessary */}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewModalOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Page>
  );
}
