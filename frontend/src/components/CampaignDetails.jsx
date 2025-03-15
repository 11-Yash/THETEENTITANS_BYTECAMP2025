import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Box, Typography, Paper, Grid,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Card, CardContent,
  LinearProgress
} from '@mui/material';

const CampaignDetails = ({ campaignId }) => {
  const [campaign, setCampaign] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [allocations, setAllocations] = useState([]);

  useEffect(() => {
    fetchCampaignDetails();
    fetchExpenses();
    fetchAllocations();
  }, [campaignId]);

  const fetchCampaignDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/campaigns/${campaignId}/summary`);
      setCampaign(response.data);
    } catch (error) {
      console.error('Error fetching campaign details:', error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/expenses/campaign/${campaignId}`);
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const fetchAllocations = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/fund-allocations/campaign/${campaignId}`);
      setAllocations(response.data);
    } catch (error) {
      console.error('Error fetching allocations:', error);
    }
  };

  if (!campaign) {
    return <Typography>Loading...</Typography>;
  }

  const progress = (campaign.current_amount / campaign.target_amount) * 100;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {campaign.title}
        </Typography>

        {/* Campaign Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Campaign Overview
              </Typography>
              <Typography paragraph>{campaign.description}</Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Progress: {Math.round(progress)}%
                </Typography>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5 }} />
              </Box>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Target Amount
                  </Typography>
                  <Typography variant="h6">
                    ₹{campaign.target_amount}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Current Amount
                  </Typography>
                  <Typography variant="h6">
                    ₹{campaign.current_amount}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Start Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(campaign.start_date)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    End Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(campaign.end_date)}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Financial Summary
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Expenses
                </Typography>
                <Typography variant="h6" gutterBottom>
                  ₹{campaign.total_expenses}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Allocated Funds
                </Typography>
                <Typography variant="h6">
                  ₹{campaign.allocated_funds}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Expenses Table */}
        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Expenses
        </Typography>
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{formatDate(expense.expense_date)}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell align="right">₹{expense.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Fund Allocations Table */}
        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Fund Allocations
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Purpose</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allocations.map((allocation) => (
                <TableRow key={allocation.id}>
                  <TableCell>{formatDate(allocation.allocation_date)}</TableCell>
                  <TableCell>{allocation.purpose}</TableCell>
                  <TableCell>{allocation.status}</TableCell>
                  <TableCell align="right">₹{allocation.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default CampaignDetails; 