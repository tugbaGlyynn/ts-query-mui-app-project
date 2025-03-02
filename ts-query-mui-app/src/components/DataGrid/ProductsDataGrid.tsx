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
  Fade
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { Product } from '../../types';
import { DataContext } from '../../context/DataContext';
import { toast } from 'react-toastify';

interface ProductDialogData {
  id?: number;
  title: string;
  body: string;
  userId: number;
}

interface ProductsDataGridProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

const NoDataState: React.FC<{ onAdd: () => void }> = ({ onAdd }) => (
  <Box
    sx={{
      padding: 6,
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9f9f9',
      borderRadius: 3,
      margin: '2rem 0',
    }}
  >
    <Box sx={{ mb: 2, color: '#999' }}>
      <FolderOpenIcon sx={{ fontSize: 60 }} />
    </Box>
    <Typography variant="h6" gutterBottom color="textSecondary">
      Henüz hiç ürün bulunmuyor
    </Typography>
    <Typography variant="body2" color="textSecondary" paragraph>
      Ürün eklemek için aşağıdaki butona tıklayın.
    </Typography>
    <Button
      variant="contained"
      color="primary"
      startIcon={<ShoppingCartIcon />}
      onClick={onAdd}
      sx={{ 
        mt: 2,
        py: 1.2,
        px: 3,
        fontWeight: 600,
        textTransform: 'none',
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 16px rgba(25, 118, 210, 0.3)',
        }
      }}
    >
      Ürün Ekle
    </Button>
  </Box>
);

const ProductsDataGrid: React.FC<ProductsDataGridProps> = ({ products, isLoading, error }) => {

  const dataContext = useContext(DataContext);
  
  if (!dataContext) {
    throw new Error('ProductsDataGrid must be used within a DataProvider');
  }
  
  const { addProduct, updateProduct, deleteProduct } = dataContext;
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ProductDialogData>({
    title: '',
    body: '',
    userId: 1, // Default user ID
  });
  
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleOpenAddDialog = () => {
    setCurrentProduct({ title: '', body: '', userId: 1 });
    setOpenAddDialog(true);
  };
  
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };
  
  const handleOpenEditDialog = (product: Product) => {
    setCurrentProduct({
      id: product.id,
      title: product.title,
      body: product.body,
      userId: product.userId,
    });
    setOpenEditDialog(true);
  };
  
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };
  
  const handleOpenDeleteDialog = (product: Product) => {
    setCurrentProduct({
      id: product.id,
      title: product.title,
      body: product.body,
      userId: product.userId,
    });
    setOpenDeleteDialog(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({
      ...prev,
      [name]: name === 'userId' ? Number(value) : value,
    }));
  };
  

  const handleCreateProduct = async () => {
    try {
      // Ürün eklemeden önce gerekli alanların dolu olduğundan emin olalım
      if (!currentProduct.title || !currentProduct.body) {
        toast.warning("Başlık ve içerik alanları zorunludur!");
        return;
      }
      
      // Context fonksiyonunu kullan
      addProduct({
        title: currentProduct.title,
        body: currentProduct.body,
        userId: currentProduct.userId,
      });
      
      // Debug için log ekleme
      console.log("Eklenen ürün:", {
        title: currentProduct.title,
        body: currentProduct.body,
        userId: currentProduct.userId,
      });
      
      handleCloseAddDialog();
      toast.success("Ürün başarıyla eklendi!");
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error("Ürün eklenirken bir hata oluştu!");
    }
  };
  

  const handleUpdateProduct = async () => {
    if (!currentProduct.id) return;
    
    try {
      updateProduct(currentProduct.id, {
        title: currentProduct.title,
        body: currentProduct.body,
        userId: currentProduct.userId,
      });
      handleCloseEditDialog();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };
  

  const handleDeleteProduct = async () => {
    if (!currentProduct.id) return;
    
    try {
      deleteProduct(currentProduct.id);
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, products.length - page * rowsPerPage);
  const paginatedProducts = products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={5} height="300px">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box p={3} bgcolor="#FFF4F4" borderRadius={3}>
        <Typography variant="h6" color="error" gutterBottom>
          Ürünler yüklenirken hata oluştu
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
              Ürünler
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Tüm ürünleri yönetin, ekleyin ve düzenleyin
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ShoppingCartIcon />}
            onClick={handleOpenAddDialog}
            sx={{ 
              py: 1,
              px: 2,
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(25, 118, 210, 0.3)',
              }
            }}
          >
            Yeni Ürün
          </Button>
        </Box>
        
        {products.length === 0 ? (
          <NoDataState onAdd={handleOpenAddDialog} />
        ) : (
          <Paper 
            sx={{
              width: '100%',
              overflow: 'hidden',
              marginBottom: 3,
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              transition: 'box-shadow 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
              }
            }}
          >
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'rgba(25, 118, 210, 0.04)' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: 'primary.main', py: 2 }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'primary.main', py: 2 }}>Başlık</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'primary.main', py: 2 }}>İçerik</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'primary.main', py: 2 }}>Kullanıcı ID</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: 'primary.main', py: 2 }}>İşlemler</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedProducts.map((product) => (
                    <TableRow 
                      key={product.id}
                      sx={{ 
                        transition: 'background-color 0.2s ease',
                        '&:hover': {
                          bgcolor: 'rgba(25, 118, 210, 0.04)',
                        }
                      }}
                    >
                      <TableCell>{product.id}</TableCell>
                      <TableCell 
                        sx={{ 
                          maxWidth: 300, 
                          whiteSpace: 'nowrap', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          fontWeight: 500
                        }}
                      >
                        {product.title}
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          maxWidth: 400, 
                          whiteSpace: 'nowrap', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis' 
                        }}
                      >
                        {product.body}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={product.userId.toString()} 
                          size="small" 
                          sx={{ 
                            fontWeight: 500,
                            bgcolor: 'rgba(25, 118, 210, 0.1)',
                            color: 'primary.main',
                          }} 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          <Tooltip title="Düzenle">
                            <IconButton 
                              color="primary" 
                              onClick={() => handleOpenEditDialog(product)}
                              size="small"
                              sx={{ 
                                bgcolor: 'rgba(25, 118, 210, 0.08)',
                                transition: 'transform 0.2s ease',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                }
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Sil">
                            <IconButton 
                              color="error" 
                              onClick={() => handleOpenDeleteDialog(product)}
                              size="small"
                              sx={{ 
                                bgcolor: 'rgba(244, 67, 54, 0.08)',
                                transition: 'transform 0.2s ease',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 72 * emptyRows }}>
                      <TableCell colSpan={5} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={products.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Sayfa başına:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
            />
          </Paper>
        )}
        
        <Dialog 
          open={openAddDialog} 
          onClose={handleCloseAddDialog}
          fullWidth
          maxWidth="sm"
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: 3,
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle sx={{ 
            bgcolor: '#f8f9fa', 
            py: 2.5, 
            px: 3,
            color: 'primary.main',
            fontWeight: 600
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ShoppingCartIcon sx={{ mr: 1.5, color: 'primary.main' }} />
              Yeni Ürün Ekle
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Box component="form" sx={{ pt: 1 }} gap={2} display="flex" flexDirection="column">
              <TextField
                fullWidth
                label="Başlık"
                name="title"
                value={currentProduct.title}
                onChange={handleInputChange}
                variant="outlined"
                autoFocus
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              <TextField
                fullWidth
                label="İçerik"
                name="body"
                value={currentProduct.body}
                onChange={handleInputChange}
                variant="outlined"
                multiline
                rows={4}
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              <TextField
                fullWidth
                label="Kullanıcı ID"
                name="userId"
                type="number"
                value={currentProduct.userId}
                onChange={handleInputChange}
                variant="outlined"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ 
            p: 3, 
            borderTop: '1px solid #f0f0f0' 
          }}>
            <Button 
              onClick={handleCloseAddDialog} 
              color="inherit"
              sx={{ 
                textTransform: 'none', 
                fontWeight: 500,
                borderRadius: 2
              }}
            >
              İptal
            </Button>
            <Button
              onClick={handleCreateProduct}
              color="primary"
              variant="contained"
              disabled={!currentProduct.title || !currentProduct.body}
              sx={{ 
                textTransform: 'none', 
                fontWeight: 600,
                borderRadius: 2
              }}
              startIcon={<AddIcon />}
            >
              Ekle
            </Button>
          </DialogActions>
        </Dialog>
        
        <Dialog 
          open={openEditDialog} 
          onClose={handleCloseEditDialog}
          fullWidth
          maxWidth="sm"
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: 3,
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle sx={{ 
            bgcolor: '#f8f9fa', 
            py: 2.5, 
            px: 3,
            color: 'primary.main',
            fontWeight: 600
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EditIcon sx={{ mr: 1.5, color: 'primary.main' }} />
              Ürünü Düzenle
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Box component="form" sx={{ pt: 1 }} gap={2} display="flex" flexDirection="column">
              <TextField
                fullWidth
                label="Başlık"
                name="title"
                value={currentProduct.title}
                onChange={handleInputChange}
                variant="outlined"
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              <TextField
                fullWidth
                label="İçerik"
                name="body"
                value={currentProduct.body}
                onChange={handleInputChange}
                variant="outlined"
                multiline
                rows={4}
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              <TextField
                fullWidth
                label="Kullanıcı ID"
                name="userId"
                type="number"
                value={currentProduct.userId}
                onChange={handleInputChange}
                variant="outlined"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ 
            p: 3, 
            borderTop: '1px solid #f0f0f0' 
          }}>
            <Button 
              onClick={handleCloseEditDialog} 
              color="inherit"
              sx={{ 
                textTransform: 'none', 
                fontWeight: 500,
                borderRadius: 2
              }}
            >
              İptal
            </Button>
            <Button
              onClick={handleUpdateProduct}
              color="primary"
              variant="contained"
              disabled={!currentProduct.title || !currentProduct.body}
              sx={{ 
                textTransform: 'none', 
                fontWeight: 600,
                borderRadius: 2
              }}
            >
              Güncelle
            </Button>
          </DialogActions>
        </Dialog>
        
        <Dialog 
          open={openDeleteDialog} 
          onClose={handleCloseDeleteDialog}
          fullWidth
          maxWidth="sm"
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: 3,
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle sx={{ 
            bgcolor: '#f8f9fa', 
            py: 2.5, 
            px: 3,
            color: 'error.main',
            fontWeight: 600
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <DeleteIcon sx={{ mr: 1.5, color: 'error.main' }} />
              Ürünü Sil
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <DialogContentText>
              <Typography variant="body1" gutterBottom>
                <strong>"{currentProduct.title}"</strong> başlıklı ürünü silmek istediğinize emin misiniz?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bu işlem geri alınamaz ve ürünün tüm verileri silinir.
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ 
            p: 3, 
            borderTop: '1px solid #f0f0f0' 
          }}>
            <Button 
              onClick={handleCloseDeleteDialog} 
              color="inherit"
              sx={{ 
                textTransform: 'none', 
                fontWeight: 500,
                borderRadius: 2
              }}
            >
              İptal
            </Button>
            <Button
              onClick={handleDeleteProduct}
              color="error"
              variant="contained"
              sx={{ 
                textTransform: 'none', 
                fontWeight: 600,
                borderRadius: 2
              }}
              startIcon={<DeleteIcon />}
            >
              Sil
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default ProductsDataGrid;