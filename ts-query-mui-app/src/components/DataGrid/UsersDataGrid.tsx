import React, { useState, useContext } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Tooltip,
  Chip,
  Avatar,
  Fade
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import styled from 'styled-components';
import { User } from '../../types';
import { DataContext } from '../../context/DataContext';

const DataGridContainer = styled(Paper)`
  width: 100%;
  overflow: hidden;
  margin-bottom: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }
`;

const ActionsContainer = styled(Box)`
  display: flex;
  gap: 0.5rem;
`;

const StyledTableHead = styled(TableHead)`
  background-color: rgba(25, 118, 210, 0.04);
  
  th {
    font-weight: 600;
    color: #1976d2;
    padding: 16px;
  }
`;

const StyledTableRow = styled(TableRow)`
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(25, 118, 210, 0.04);
  }
`;

const StyledTableCell = styled(TableCell)`
  padding: 16px;
  font-size: 14px;
`;

const ActionButton = styled(IconButton)`
  transition: transform 0.2s ease, background-color 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const AddButton = styled(Button)`
  && {
    padding: 10px 20px;
    font-weight: 600;
    text-transform: none;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
    transition: all 0.2s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(25, 118, 210, 0.3);
    }
  }
`;

const EmptyState = styled(Box)`
  padding: 3rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  border-radius: 12px;
  margin: 2rem 0;
`;


const StyledDialogTitle = styled(DialogTitle)`
  background-color: #f8f9fa;
  padding: 20px 24px;
  color: #1976d2;
  font-weight: 600;
`;

const StyledDialogContent = styled(DialogContent)`
  padding: 24px;
`;

const StyledDialogActions = styled(DialogActions)`
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
`;

const StyledTextField = styled(TextField)`
  && {
    margin-bottom: 16px;
    
    .MuiOutlinedInput-root {
      border-radius: 8px;
      transition: all 0.2s ease;
      
      &:hover {
        border-color: #1976d2;
      }
      
      &.Mui-focused {
        box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
      }
    }
  }
`;

const UserAvatar = styled(Avatar)`
  background-color: #1976d2;
  width: 36px;
  height: 36px;
  font-size: 16px;
  font-weight: 600;
  margin-right: 12px;
`;

interface UserDialogData {
  id?: number;
  name: string;
  email: string;
  username: string;
}

interface UsersDataGridProps {
  users: User[];
  isLoading: boolean;
  error: string | null;
}

const NoDataState: React.FC<{ onAdd: () => void }> = ({ onAdd }) => (
  <EmptyState>
    <Box sx={{ mb: 2, color: '#999' }}>
      <FolderOpenIcon sx={{ fontSize: 60 }} />
    </Box>
    <Typography variant="h6" gutterBottom color="textSecondary">
      Henüz hiç kullanıcı bulunmuyor
    </Typography>
    <Typography variant="body2" color="textSecondary" paragraph>
      Kullanıcı eklemek için aşağıdaki butona tıklayın.
    </Typography>
    <AddButton
      variant="contained"
      color="primary"
      startIcon={<PersonAddIcon />}
      onClick={onAdd}
      sx={{ mt: 2 }}
    >
      Kullanıcı Ekle
    </AddButton>
  </EmptyState>
);

const UsersDataGrid: React.FC<UsersDataGridProps> = ({ users, isLoading, error }) => {
  const dataContext = useContext(DataContext);
  
  if (!dataContext) {
    throw new Error('UsersDataGrid must be used within a DataProvider');
  }
  
  const { addUser, updateUser, deleteUser } = dataContext;
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserDialogData>({
    name: '',
    email: '',
    username: '',
  });
  

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleOpenAddDialog = () => {
    setCurrentUser({ name: '', email: '', username: '' });
    setOpenAddDialog(true);
  };
  
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };
  
  const handleOpenEditDialog = (user: User) => {
    setCurrentUser({
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
    });
    setOpenEditDialog(true);
  };
  
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };
  
  const handleOpenDeleteDialog = (user: User) => {
    setCurrentUser({
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
    });
    setOpenDeleteDialog(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentUser(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleCreateUser = async () => {
    try {
      addUser({
        name: currentUser.name,
        email: currentUser.email,
        username: currentUser.username,
      });
      handleCloseAddDialog();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };
  
  const handleUpdateUser = async () => {
    if (!currentUser.id) return;
    
    try {
      updateUser(currentUser.id, {
        name: currentUser.name,
        email: currentUser.email,
        username: currentUser.username,
      });
      handleCloseEditDialog();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  

  const handleDeleteUser = async () => {
    if (!currentUser.id) return;
    
    try {
      deleteUser(currentUser.id);
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage);
  const paginatedUsers = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={5} height="300px">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box p={3} bgcolor="#FFF4F4" borderRadius="12px">
        <Typography variant="h6" color="error" gutterBottom>
          Kullanıcılar yüklenirken hata oluştu
        </Typography>
        <Typography variant="body2">{error}</Typography>
      </Box>
    );
  }
  
  return (
    <Fade in={true} timeout={500}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h5" component="h2" fontWeight={600} color="primary">
              Kullanıcılar
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Tüm kullanıcıları yönetin, ekleyin ve düzenleyin
            </Typography>
          </Box>
          <AddButton
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            onClick={handleOpenAddDialog}
          >
            Yeni Kullanıcı
          </AddButton>
        </Box>
        
        {users.length === 0 ? (
          <NoDataState onAdd={handleOpenAddDialog} />
        ) : (
          <DataGridContainer>
            <TableContainer>
              <Table>
                <StyledTableHead>
                  <TableRow>
                    <StyledTableCell>Kullanıcı</StyledTableCell>
                    <StyledTableCell>Kullanıcı Adı</StyledTableCell>
                    <StyledTableCell>Email</StyledTableCell>
                    <StyledTableCell align="right">İşlemler</StyledTableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <StyledTableRow key={user.id}>
                      <StyledTableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <UserAvatar>{user.name.charAt(0)}</UserAvatar>
                          <Box>
                            <Typography variant="body1" fontWeight={500}>
                              {user.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              ID: {user.id}
                            </Typography>
                          </Box>
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Chip 
                          label={user.username} 
                          size="small" 
                          variant="outlined" 
                          sx={{ 
                            fontWeight: 500,
                            color: '#1976d2',
                            borderColor: 'rgba(25, 118, 210, 0.3)'
                          }} 
                        />
                      </StyledTableCell>
                      <StyledTableCell>{user.email}</StyledTableCell>
                      <StyledTableCell align="right">
                        <ActionsContainer>
                          <Tooltip title="Düzenle">
                            <ActionButton 
                              color="primary" 
                              onClick={() => handleOpenEditDialog(user)}
                              size="small"
                              sx={{ bgcolor: 'rgba(25, 118, 210, 0.08)' }}
                            >
                              <EditIcon fontSize="small" />
                            </ActionButton>
                          </Tooltip>
                          <Tooltip title="Sil">
                            <ActionButton 
                              color="error" 
                              onClick={() => handleOpenDeleteDialog(user)}
                              size="small"
                              sx={{ bgcolor: 'rgba(244, 67, 54, 0.08)' }}
                            >
                              <DeleteIcon fontSize="small" />
                            </ActionButton>
                          </Tooltip>
                        </ActionsContainer>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                  
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 72 * emptyRows }}>
                      <TableCell colSpan={4} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={users.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Sayfa başına:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
            />
          </DataGridContainer>
        )}
        
        <Dialog 
          open={openAddDialog} 
          onClose={handleCloseAddDialog}
          fullWidth
          maxWidth="sm"
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: '12px',
              overflow: 'hidden'
            }
          }}
        >
          <StyledDialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PersonAddIcon sx={{ mr: 1.5, color: '#1976d2' }} />
              Yeni Kullanıcı Ekle
            </Box>
          </StyledDialogTitle>
          <StyledDialogContent>
            <Box component="form" sx={{ pt: 1 }} gap={2} display="flex" flexDirection="column">
              <StyledTextField
                fullWidth
                label="Ad"
                name="name"
                value={currentUser.name}
                onChange={handleInputChange}
                variant="outlined"
                autoFocus
              />
              <StyledTextField
                fullWidth
                label="Kullanıcı Adı"
                name="username"
                value={currentUser.username}
                onChange={handleInputChange}
                variant="outlined"
              />
              <StyledTextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={currentUser.email}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Box>
          </StyledDialogContent>
          <StyledDialogActions>
            <Button 
              onClick={handleCloseAddDialog} 
              color="inherit"
              sx={{ 
                textTransform: 'none', 
                fontWeight: 500,
                borderRadius: '8px'
              }}
            >
              İptal
            </Button>
            <Button
              onClick={handleCreateUser}
              color="primary"
              variant="contained"
              disabled={!currentUser.name || !currentUser.email || !currentUser.username}
              sx={{ 
                textTransform: 'none', 
                fontWeight: 600,
                borderRadius: '8px'
              }}
              startIcon={<AddIcon />}
            >
              Ekle
            </Button>
          </StyledDialogActions>
        </Dialog>
        
        <Dialog 
          open={openEditDialog} 
          onClose={handleCloseEditDialog}
          fullWidth
          maxWidth="sm"
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: '12px',
              overflow: 'hidden'
            }
          }}
        >
          <StyledDialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EditIcon sx={{ mr: 1.5, color: '#1976d2' }} />
              Kullanıcıyı Düzenle
            </Box>
          </StyledDialogTitle>
          <StyledDialogContent>
            <Box component="form" sx={{ pt: 1 }} gap={2} display="flex" flexDirection="column">
              <StyledTextField
                fullWidth
                label="Ad"
                name="name"
                value={currentUser.name}
                onChange={handleInputChange}
                variant="outlined"
              />
              <StyledTextField
                fullWidth
                label="Kullanıcı Adı"
                name="username"
                value={currentUser.username}
                onChange={handleInputChange}
                variant="outlined"
              />
              <StyledTextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={currentUser.email}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Box>
          </StyledDialogContent>
          <StyledDialogActions>
            <Button 
              onClick={handleCloseEditDialog} 
              color="inherit"
              sx={{ 
                textTransform: 'none', 
                fontWeight: 500,
                borderRadius: '8px'
              }}
            >
              İptal
            </Button>
            <Button
              onClick={handleUpdateUser}
              color="primary"
              variant="contained"
              disabled={!currentUser.name || !currentUser.email || !currentUser.username}
              sx={{ 
                textTransform: 'none', 
                fontWeight: 600,
                borderRadius: '8px'
              }}
            >
              Güncelle
            </Button>
          </StyledDialogActions>
        </Dialog>
        
        <Dialog 
          open={openDeleteDialog} 
          onClose={handleCloseDeleteDialog}
          fullWidth
          maxWidth="sm"
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: '12px',
              overflow: 'hidden'
            }
          }}
        >
          <StyledDialogTitle sx={{ color: '#f44336' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <DeleteIcon sx={{ mr: 1.5, color: '#f44336' }} />
              Kullanıcıyı Sil
            </Box>
          </StyledDialogTitle>
          <StyledDialogContent>
            <DialogContentText>
              <Typography variant="body1" gutterBottom>
                <strong>{currentUser.name}</strong> adlı kullanıcıyı silmek istediğinize emin misiniz?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bu işlem geri alınamaz ve kullanıcının tüm verileri silinir.
              </Typography>
            </DialogContentText>
          </StyledDialogContent>
          <StyledDialogActions>
            <Button 
              onClick={handleCloseDeleteDialog} 
              color="inherit"
              sx={{ 
                textTransform: 'none', 
                fontWeight: 500,
                borderRadius: '8px'
              }}
            >
              İptal
            </Button>
            <Button
              onClick={handleDeleteUser}
              color="error"
              variant="contained"
              sx={{ 
                textTransform: 'none', 
                fontWeight: 600,
                borderRadius: '8px'
              }}
              startIcon={<DeleteIcon />}
            >
              Sil
            </Button>
          </StyledDialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default UsersDataGrid;