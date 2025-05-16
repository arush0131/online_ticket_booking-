import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface Ticket {
  id: string;
  name: string;
  price: number;
  description: string;
  available: number;
}

const TicketsManagement: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [open, setOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    available: '',
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/admin/tickets');
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const handleOpen = (ticket?: Ticket) => {
    if (ticket) {
      setEditingTicket(ticket);
      setFormData({
        name: ticket.name,
        price: ticket.price.toString(),
        description: ticket.description,
        available: ticket.available.toString(),
      });
    } else {
      setEditingTicket(null);
      setFormData({
        name: '',
        price: '',
        description: '',
        available: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTicket(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingTicket
        ? `/api/admin/tickets/${editingTicket.id}`
        : '/api/admin/tickets';
      const method = editingTicket ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
          available: parseInt(formData.available),
        }),
      });

      if (response.ok) {
        fetchTickets();
        handleClose();
      }
    } catch (error) {
      console.error('Error saving ticket:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        const response = await fetch(`/api/admin/tickets/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchTickets();
        }
      } catch (error) {
        console.error('Error deleting ticket:', error);
      }
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Manage Tickets</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Add New Ticket
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Available</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.name}</TableCell>
                <TableCell>${ticket.price}</TableCell>
                <TableCell>{ticket.description}</TableCell>
                <TableCell>{ticket.available}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(ticket)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(ticket.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingTicket ? 'Edit Ticket' : 'Add New Ticket'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Available Tickets"
              type="number"
              value={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.value })}
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingTicket ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default TicketsManagement; 