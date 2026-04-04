import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  useMediaQuery,
  Chip,
  CircularProgress,
  Box,
} from '@mui/material';
import { useTheme } from '@emotion/react';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import {
  InternshipListHead,
  InternshipListToolbar,
  InternshipMoreMenu,
  InternshipUserDialog,
  InternshipAddUserDialog,
  InternshipUserViewDialog,
  InternshipColumnFilter,
} from '../sections/@dashboard/app/User';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'view', label: 'View', alignRight: false },
  { id: 'job_id', label: 'Job ID', alignRight: false },
  { id: 'title', label: 'Title', alignRight: false },
  { id: 'company', label: 'Company', alignRight: false },
  { id: 'location', label: 'Location', alignRight: false },
  { id: 'skills_required', label: 'Skills Required', alignRight: false },
  { id: 'sectors', label: 'Sectors', alignRight: false },
  { id: 'remote_ok', label: 'Remote', alignRight: false },
  { id: 'duration', label: 'Duration', alignRight: false },
  { id: 'stipend', label: 'Stipend', alignRight: false },
  { id: 'applicationDeadline', label: 'Deadline', alignRight: false },
  { id: 'websiteLink', label: 'Website', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'posted_date', label: 'Posted Date', alignRight: false },
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

// Helper function to get sector name from sector object or string
function getSectorName(sector) {
  if (typeof sector === 'string') return sector;
  if (sector && sector.name) return sector.name;
  return 'Unknown Sector';
}

// Updated filter function to handle sector references
function applySortFilter(array, comparator, query, filters) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  let filteredArray = stabilizedThis.map((el) => el[0]);

  // Apply text query filter across all fields
  if (query) {
    filteredArray = filteredArray.filter(
      (internship) =>
        internship.job_id?.toLowerCase().includes(query.toLowerCase()) ||
        internship.title?.toLowerCase().includes(query.toLowerCase()) ||
        internship.company?.toLowerCase().includes(query.toLowerCase()) ||
        internship.location?.toLowerCase().includes(query.toLowerCase()) ||
        internship.skills_required?.some((skill) => skill.toLowerCase().includes(query.toLowerCase())) ||
        internship.sectors?.some((sector) => {
          const sectorName = getSectorName(sector);
          return sectorName.toLowerCase().includes(query.toLowerCase());
        }) ||
        internship.duration?.toLowerCase().includes(query.toLowerCase()) ||
        internship.status?.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Apply filters based on selected filters
  if (filters) {
    filteredArray = filteredArray.filter((internship) => {
      // Basic filters
      const titleMatch = !filters.title || internship.title?.toLowerCase().includes(filters.title.toLowerCase());
      const companyMatch =
        !filters.company || internship.company?.toLowerCase().includes(filters.company.toLowerCase());
      const locationMatch =
        !filters.location || internship.location?.toLowerCase().includes(filters.location.toLowerCase());
      const skillsMatch =
        !filters.skills ||
        internship.skills_required?.some((skill) => skill.toLowerCase().includes(filters.skills.toLowerCase()));
      const statusMatch = !filters.status || internship.status?.toLowerCase() === filters.status.toLowerCase();
      const remoteMatch =
        !filters.remote_ok || (filters.remote_ok === 'true' ? internship.remote_ok : !internship.remote_ok);

      // Duration filter
      const durationMatch =
        !filters.duration || internship.duration?.toLowerCase().includes(filters.duration.toLowerCase());

      // Job ID filter
      const jobIdMatch = !filters.job_id || internship.job_id?.toLowerCase().includes(filters.job_id.toLowerCase());

      // Minimum stipend filter
      const stipendMatch =
        !filters.minStipend ||
        (internship.stipend?.amount && internship.stipend.amount >= parseInt(filters.minStipend, 10));

      // Sector filtering
      const sectorsMatch =
        !filters.sectors ||
        internship.sectors?.some((sector) => {
          const sectorName = getSectorName(sector);
          return sectorName.toLowerCase().includes(filters.sectors.toLowerCase());
        });

      return (
        titleMatch &&
        companyMatch &&
        locationMatch &&
        skillsMatch &&
        sectorsMatch &&
        statusMatch &&
        remoteMatch &&
        durationMatch &&
        jobIdMatch &&
        stipendMatch
      );
    });
  }
  return filteredArray;
}

export default function Internship() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('title');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State for internships and sectors
  const [internships, setInternships] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSectors, setLoadingSectors] = useState(true);
  const [editingInternshipId, setEditingInternshipId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [AddModalOpen, setAddModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    title: '',
    company: '',
    location: '',
    skills: '',
    sectors: '',
    status: '',
    remote_ok: '',
    duration: '',
    minStipend: '',
    job_id: '',
  });
  const [visibleColumns, setVisibleColumns] = useState(TABLE_HEAD.map((column) => column.id));

  const token = localStorage.getItem('token');

  // Fetch data on component mount
  useEffect(() => {
    Promise.all([fetchInternships(), fetchSectors()]).finally(() => {
      setLoading(false);
    });
  }, []);

  // Fetch sectors from the server
  const fetchSectors = async () => {
    setLoadingSectors(true);
    try {
      const response = await axios.get('https://internship-recommendation-u8d3.onrender.com/api/sectors');
      setSectors(response.data.sectors || []);
    } catch (error) {
      console.error('Error fetching sectors:', error);
      toast.error('Error fetching sectors');
    } finally {
      setLoadingSectors(false);
    }
  };

  // Fetch internships from the server with sector population
  const fetchInternships = async () => {
    setLoading(true);
    try {
      // Fetch internships with populated sectors
      const response = await axios.get(
        'https://internship-recommendation-u8d3.onrender.com/api/internships/internships'
      );

      // If sectors are not populated, we need to populate them manually
      const internshipsData = response.data.internships || [];

      // Map sector IDs to sector names if needed
      const processedInternships = await Promise.all(
        internshipsData.map(async (internship) => {
          if (internship.sectors && internship.sectors.length > 0) {
            // Check if sectors are already populated (have 'name' property)
            const firstSector = internship.sectors[0];
            if (typeof firstSector === 'string' || (firstSector && !firstSector.name)) {
              // Sectors are not populated, fetch sector details
              try {
                const sectorPromises = internship.sectors.map(async (sectorId) => {
                  if (typeof sectorId === 'string') {
                    const sectorResponse = await axios.get(
                      `https://internship-recommendation-u8d3.onrender.com/api/sectors/${sectorId}`
                    );
                    return sectorResponse.data.sector;
                  }
                  return sectorId;
                });
                internship.sectors = await Promise.all(sectorPromises);
              } catch (error) {
                console.warn('Error fetching sector details for internship:', internship._id);
                // Keep original sectors if fetching fails
              }
            }
          }
          return internship;
        })
      );

      setInternships(processedInternships);
    } catch (error) {
      console.error('Error fetching internships:', error);
      toast.error('Error fetching internships');
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
      const newSelecteds =
        filteredInternships.length > 0
          ? filteredInternships.map((internship) => internship._id)
          : internships.map((internship) => internship._id);
      setSelected(newSelecteds);
    } else {
      setSelected([]);
    }
  };

  const getVisibleSelectedCount = () => {
    return selected.filter((id) => filteredInternships.some((internship) => internship._id === id)).length;
  };

  const getSelectedIds = () => {
    return selected;
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleToggleColumn = (columnId) => {
    setVisibleColumns((prev) => {
      if (prev.includes(columnId)) {
        return prev.filter((id) => id !== columnId);
      }
      return [...prev, columnId];
    });
  };

  const handleResetColumns = () => {
    setVisibleColumns(TABLE_HEAD.map((column) => column.id));
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
    setPage(0); // Reset to first page when filter changes
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
    setPage(0); // Reset to first page when search changes
  };

  const handleResetFilters = () => {
    setFilters({
      title: '',
      company: '',
      location: '',
      skills: '',
      sectors: '',
      status: '',
      remote_ok: '',
      duration: '',
      minStipend: '',
      job_id: '',
    });
    setFilterName('');
    setPage(0);
  };

  const handleDeleteInternship = async (internshipId) => {
    if (window.confirm('Are you sure you want to delete this internship?')) {
      try {
        await axios.delete(
          `https://internship-recommendation-u8d3.onrender.com/api/internships/admin/internships/${internshipId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success('Internship deleted successfully');
        fetchInternships();
        setSelected((prev) => prev.filter((id) => id !== internshipId));
      } catch (error) {
        console.error('Error deleting internship:', error);
        toast.error('Error deleting internship');
      }
    }
  };

  const handleOpenModal = (internshipId) => {
    setOpenModal(true);
    setEditingInternshipId(internshipId);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingInternshipId(null);
  };

  const handleAddModal = () => {
    setAddModalOpen(true);
    setEditingInternshipId(null);
  };

  const handleCloseAddModal = () => {
    setAddModalOpen(false);
    setEditingInternshipId(null);
  };

  const handleViewInternship = (internship) => {
    setSelectedInternship(internship);
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedInternship(null);
  };

  // Export functions with proper sector handling
  const handleExportCSV = () => {
    if (filteredInternships.length === 0) {
      toast.warning('No data available for export!');
      return;
    }

    const processedData = filteredInternships.map((internship) => {
      const internshipData = {};

      if (visibleColumns.includes('job_id')) internshipData.job_id = internship.job_id;
      if (visibleColumns.includes('title')) internshipData.title = internship.title;
      if (visibleColumns.includes('company')) internshipData.company = internship.company;
      if (visibleColumns.includes('location')) internshipData.location = internship.location;
      if (visibleColumns.includes('skills_required')) {
        internshipData.skills_required = internship.skills_required?.join(', ') || '';
      }
      if (visibleColumns.includes('sectors')) {
        internshipData.sectors = internship.sectors?.map((sector) => getSectorName(sector)).join(', ') || '';
      }
      if (visibleColumns.includes('remote_ok')) internshipData.remote_ok = internship.remote_ok ? 'Yes' : 'No';
      if (visibleColumns.includes('duration')) internshipData.duration = internship.duration || '';
      if (visibleColumns.includes('stipend')) {
        internshipData.stipend = internship.stipend?.amount
          ? `₹${internship.stipend.amount.toLocaleString()}`
          : 'Not specified';
      }
      if (visibleColumns.includes('applicationDeadline')) {
        internshipData.applicationDeadline = new Date(internship.applicationDeadline).toLocaleDateString();
      }
      if (visibleColumns.includes('status')) internshipData.status = internship.status;
      if (visibleColumns.includes('websiteLink')) internshipData.websiteLink = internship.websiteLink || '';
      if (visibleColumns.includes('posted_date')) {
        internshipData.posted_date = new Date(internship.posted_date || internship.createdAt).toLocaleDateString();
      }

      return internshipData;
    });

    const csvData = Papa.unparse(processedData);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'internships_data.csv');
    toast.success('CSV exported successfully!');
  };

  const handleExportExcel = () => {
    if (filteredInternships.length === 0) {
      toast.warning('No data available for export!');
      return;
    }

    const processedData = filteredInternships.map((internship) => {
      const internshipData = {};

      if (visibleColumns.includes('job_id')) internshipData.job_id = internship.job_id;
      if (visibleColumns.includes('title')) internshipData.title = internship.title;
      if (visibleColumns.includes('company')) internshipData.company = internship.company;
      if (visibleColumns.includes('location')) internshipData.location = internship.location;
      if (visibleColumns.includes('skills_required')) {
        internshipData.skills_required = internship.skills_required?.join(', ') || '';
      }
      if (visibleColumns.includes('sectors')) {
        internshipData.sectors = internship.sectors?.map((sector) => getSectorName(sector)).join(', ') || '';
      }
      if (visibleColumns.includes('remote_ok')) internshipData.remote_ok = internship.remote_ok ? 'Yes' : 'No';
      if (visibleColumns.includes('duration')) internshipData.duration = internship.duration || '';
      if (visibleColumns.includes('stipend')) {
        internshipData.stipend = internship.stipend?.amount
          ? `₹${internship.stipend.amount.toLocaleString()}`
          : 'Not specified';
      }
      if (visibleColumns.includes('applicationDeadline')) {
        internshipData.applicationDeadline = new Date(internship.applicationDeadline).toLocaleDateString();
      }
      if (visibleColumns.includes('status')) internshipData.status = internship.status;
      if (visibleColumns.includes('websiteLink')) internshipData.websiteLink = internship.websiteLink || '';
      if (visibleColumns.includes('posted_date')) {
        internshipData.posted_date = new Date(internship.posted_date || internship.createdAt).toLocaleDateString();
      }

      return internshipData;
    });

    const worksheet = XLSX.utils.json_to_sheet(processedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Internships');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    saveAs(blob, 'internships_data.xlsx');
    toast.success('Excel exported successfully!');
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await axios.get(
        'https://internship-recommendation-u8d3.onrender.com/api/internships/admin/internships/template',
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      );

      const blob = new Blob([response.data]);
      saveAs(blob, 'internship_upload_template.xlsx');
      toast.success('Template downloaded successfully');
    } catch (error) {
      console.error('Error downloading template:', error);
      toast.error('Error downloading template');
    }
  };

  const getColor = (internship) => {
    if (internship === 'Active') return 'success';
    if (internship === 'Paused') return 'warning';
    return 'error';
  };

  const filteredInternships = applySortFilter(internships, getComparator(order, orderBy), filterName, filters);
  const isInternshipNotFound = filteredInternships.length === 0 && !loading;
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredInternships.length) : 0;

  if (loading) {
    return (
      <Page title="Internships">
        <Container>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ ml: 2 }}>
              Loading internships...
            </Typography>
          </Box>
        </Container>
      </Page>
    );
  }

  return (
    <Page title="Internships">
      <Container>
        <Stack
          direction={isMobile ? 'column' : 'row'}
          alignItems={isMobile ? 'stretch' : 'center'}
          justifyContent="space-between"
          spacing={2}
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Internships
            {/* ({internships.length}) */}
          </Typography>

          <Stack direction={isMobile ? 'column' : 'row'} spacing={2} width={isMobile ? '100%' : 'auto'}>
            <Button
              variant="contained"
              onClick={handleAddModal}
              startIcon={<Iconify icon="eva:plus-fill" />}
              fullWidth={isMobile}
            >
              New Internship
            </Button>

            <Button
              variant="outlined"
              onClick={handleDownloadTemplate}
              startIcon={<Iconify icon="eva:download-outline" />}
              fullWidth={isMobile}
            >
              Download Template
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleExportCSV}
              startIcon={<Iconify icon="eva:download-fill" />}
              fullWidth={isMobile}
              disabled={filteredInternships.length === 0}
            >
              Export CSV
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleExportExcel}
              startIcon={<Iconify icon="eva:download-fill" />}
              fullWidth={isMobile}
              disabled={filteredInternships.length === 0}
            >
              Export Excel
            </Button>
          </Stack>
        </Stack>

        <Card sx={{ minHeight: '500px', position: 'relative' }}>
          <InternshipListToolbar
            numSelected={getVisibleSelectedCount()}
            selectedIds={getSelectedIds()}
            filterName={filterName}
            onFilterName={handleFilterByName}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            sectors={sectors}
            loadingSectors={loadingSectors}
          />
          <InternshipColumnFilter
            columns={TABLE_HEAD}
            visibleColumns={visibleColumns}
            onToggleColumn={handleToggleColumn}
            onResetColumns={handleResetColumns}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <InternshipListHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={filteredInternships.length}
                  numSelected={getVisibleSelectedCount()}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  headLabel={TABLE_HEAD.filter((column) => visibleColumns.includes(column.id))}
                />
                <TableBody>
                  {filteredInternships.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const isItemSelected = selected.indexOf(row._id) !== -1;

                    return (
                      <TableRow
                        hover
                        key={row._id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, row._id)} />
                        </TableCell>
                        {visibleColumns.includes('view') && (
                          <TableCell align="left">
                            <IconButton onClick={() => handleViewInternship(row)} aria-label="view internship">
                              <Iconify icon="eva:eye-fill" />
                            </IconButton>
                          </TableCell>
                        )}
                        {visibleColumns.includes('job_id') && <TableCell align="left">{row.job_id}</TableCell>}
                        {visibleColumns.includes('title') && <TableCell align="left">{row.title}</TableCell>}
                        {visibleColumns.includes('company') && <TableCell align="left">{row.company}</TableCell>}
                        {visibleColumns.includes('location') && <TableCell align="left">{row.location}</TableCell>}
                        {visibleColumns.includes('skills_required') && (
                          <TableCell align="left">
                            <Box sx={{ maxWidth: 200 }}>
                              {row.skills_required?.slice(0, 3).map((skill, index) => (
                                <Chip key={index} label={skill} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                              ))}
                              {row.skills_required?.length > 3 && (
                                <Chip
                                  label={`+${row.skills_required.length - 3} more`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ mr: 0.5, mb: 0.5 }}
                                />
                              )}
                            </Box>
                          </TableCell>
                        )}
                        {visibleColumns.includes('sectors') && (
                          <TableCell align="left">
                            <Box sx={{ maxWidth: 200 }}>
                              {row.sectors?.slice(0, 2).map((sector, index) => {
                                const sectorName = getSectorName(sector);
                                const sectorId = typeof sector === 'string' ? sector : sector?._id;

                                return (
                                  <Chip
                                    key={sectorId || index}
                                    label={sectorName}
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    sx={{ mr: 0.5, mb: 0.5 }}
                                  />
                                );
                              })}
                              {row.sectors?.length > 2 && (
                                <Chip
                                  label={`+${row.sectors.length - 2} more`}
                                  size="small"
                                  variant="filled"
                                  color="secondary"
                                  sx={{ mr: 0.5, mb: 0.5 }}
                                />
                              )}
                            </Box>
                          </TableCell>
                        )}
                        {visibleColumns.includes('remote_ok') && (
                          <TableCell align="left">
                            <Label color={row.remote_ok ? 'success' : 'default'}>{row.remote_ok ? 'Yes' : 'No'}</Label>
                          </TableCell>
                        )}
                        {visibleColumns.includes('duration') && <TableCell align="left">{row.duration}</TableCell>}
                        {visibleColumns.includes('stipend') && (
                          <TableCell align="left">
                            {row.stipend?.amount ? `₹${row.stipend.amount.toLocaleString()}` : 'Not specified'}
                          </TableCell>
                        )}
                        {visibleColumns.includes('applicationDeadline') && (
                          <TableCell align="left">{new Date(row.applicationDeadline).toLocaleDateString()}</TableCell>
                        )}
                        {visibleColumns.includes('websiteLink') && (
                          <TableCell align="left">
                            {row.websiteLink ? (
                              <a href={row.websiteLink} target="_blank" rel="noopener noreferrer">
                                {row.websiteLink.length > 30 ? `${row.websiteLink.slice(0, 30)}...` : row.websiteLink}
                              </a>
                            ) : (
                              'N/A'
                            )}
                          </TableCell>
                        )}
                        {visibleColumns.includes('status') && (
                          <TableCell align="left">
                            <Label color={getColor(row.status)}>{row.status}</Label>
                          </TableCell>
                        )}

                        {visibleColumns.includes('posted_date') && (
                          <TableCell align="left">
                            {new Date(row.posted_date || row.createdAt).toLocaleDateString()}
                          </TableCell>
                        )}
                        {visibleColumns.includes('action') && (
                          <TableCell align="left">
                            <InternshipMoreMenu
                              onEdit={() => handleOpenModal(row._id)}
                              onDelete={() => handleDeleteInternship(row._id)}
                            />
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={visibleColumns.length + 1} />
                    </TableRow>
                  )}
                </TableBody>

                {isInternshipNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={visibleColumns.length + 1} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredInternships.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          <InternshipUserDialog
            open={openModal}
            onClose={handleCloseModal}
            internshipId={editingInternshipId}
            fetchInternships={fetchInternships}
          />
          <InternshipAddUserDialog
            open={AddModalOpen}
            onClose={handleCloseAddModal}
            internshipId={editingInternshipId}
            fetchInternships={fetchInternships}
          />
          <InternshipUserViewDialog
            open={viewModalOpen}
            onClose={handleCloseViewModal}
            internship={selectedInternship}
            internshipId={editingInternshipId}
          />
        </Card>
      </Container>
    </Page>
  );
}
