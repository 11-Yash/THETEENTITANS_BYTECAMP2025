import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Box, Typography, Button, Paper,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField,
  Grid, Card, CardContent
} from '@mui/material';

const NGODashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [openNewCampaign, setOpenNewCampaign] = useState(false);
  const [openNewExpense, setOpenNewExpense] = useState(false);
  const [openNewAllocation, setOpenNewAllocation] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaignForm, setCampaignForm] = useState({
    title: '',
    description: '',
    targetAmount: '',
    startDate: '',
    endDate: '',
    beneficiaries: '',
    impactDetails: '',
    bankDetails: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      ifscCode: ''
    },
    transparencyStatement: ''
  });

  const [expenseForm, setExpenseForm] = useState({
    amount: '',
    description: '',
    category: '',
    expenseDate: ''
  });

  const [allocationForm, setAllocationForm] = useState({
    amount: '',
    purpose: '',
    allocationDate: '',
    status: 'planned'
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [ngoId, setNgoId] = useState(null);

  useEffect(() => {
    const storedNgoId = localStorage.getItem('ngoId');
    console.log('Retrieved NGO ID from localStorage:', storedNgoId);
    
    if (!storedNgoId) {
      setError('No NGO ID found. Please log in again.');
      return;
    }

    setNgoId(parseInt(storedNgoId, 10));
    fetchCampaigns(storedNgoId);
  }, []);

  const fetchCampaigns = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/campaigns/ngo/${id}`);
      setCampaigns(response.data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setError('Failed to fetch campaigns');
    }
  };

  const handleCreateCampaign = async () => {
    try {
      const storedNgoId = localStorage.getItem('ngoId');
      console.log('Creating campaign for NGO ID:', storedNgoId);
      
      if (!storedNgoId) {
        setError('No NGO ID available. Please log in again.');
        return;
      }

      if (!campaignForm.title || !campaignForm.description || !campaignForm.targetAmount || 
          !campaignForm.startDate || !campaignForm.endDate) {
        setError('Please fill in all required campaign fields');
        return;
      }

      if (!campaignForm.bankDetails?.accountName || !campaignForm.bankDetails?.accountNumber ||
          !campaignForm.bankDetails?.bankName || !campaignForm.bankDetails?.ifscCode) {
        setError('Please provide complete bank details');
        return;
      }

      const amount = parseFloat(campaignForm.targetAmount);
      if (isNaN(amount) || amount <= 0) {
        setError('Please enter a valid positive target amount');
        return;
      }

      const startDate = new Date(campaignForm.startDate);
      const endDate = new Date(campaignForm.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate < today) {
        setError('Start date cannot be in the past');
        return;
      }

      if (endDate <= startDate) {
        setError('End date must be after start date');
        return;
      }

      const campaignData = {
        ...campaignForm,
        ngoId: parseInt(storedNgoId, 10),
        targetAmount: amount,
        mediaUrls: [],
        bankDetails: {
          accountName: campaignForm.bankDetails.accountName.trim(),
          accountNumber: campaignForm.bankDetails.accountNumber.trim(),
          bankName: campaignForm.bankDetails.bankName.trim(),
          ifscCode: campaignForm.bankDetails.ifscCode.trim()
        }
      };

      console.log('Submitting campaign data:', campaignData);

      const response = await axios.post('http://localhost:3000/api/campaigns', campaignData);
      console.log('Campaign created successfully:', response.data);

      setCampaignForm({
        title: '',
        description: '',
        targetAmount: '',
        startDate: '',
        endDate: '',
        beneficiaries: '',
        impactDetails: '',
        bankDetails: {
          accountName: '',
          accountNumber: '',
          bankName: '',
          ifscCode: ''
        },
        transparencyStatement: ''
      });
      setOpenNewCampaign(false);
      
      fetchCampaigns(storedNgoId);
      
      setSuccess('Campaign created successfully!');
    } catch (error) {
      console.error('Error creating campaign:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.details || 
                          'Failed to create campaign. Please try again.';
      setError(errorMessage);
    }
  };

  const handleCreateExpense = async () => {
    try {
      await axios.post('http://localhost:3000/api/expenses', {
        ...expenseForm,
        campaignId: selectedCampaign.id
      });
      setOpenNewExpense(false);
      setExpenseForm({
        amount: '',
        description: '',
        category: '',
        expenseDate: ''
      });
      fetchCampaigns(ngoId);
    } catch (error) {
      console.error('Error creating expense:', error);
    }
  };

  const handleCreateAllocation = async () => {
    try {
      await axios.post('http://localhost:3000/api/fund-allocations', {
        ...allocationForm,
        campaignId: selectedCampaign.id
      });
      setOpenNewAllocation(false);
      setAllocationForm({
        amount: '',
        purpose: '',
        allocationDate: '',
        status: 'planned'
      });
      fetchCampaigns(ngoId);
    } catch (error) {
      console.error('Error creating fund allocation:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          NGO Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenNewCampaign(true)}
          sx={{ mb: 3 }}
        >
          Launch New Campaign
        </Button>

        {/* Campaigns Table */}
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Target Amount</TableCell>
                <TableCell>Current Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>{campaign.title}</TableCell>
                  <TableCell>{campaign.target_amount}</TableCell>
                  <TableCell>{campaign.current_amount}</TableCell>
                  <TableCell>{campaign.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setSelectedCampaign(campaign);
                        setOpenNewExpense(true);
                      }}
                    >
                      Add Expense
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ ml: 1 }}
                      onClick={() => {
                        setSelectedCampaign(campaign);
                        setOpenNewAllocation(true);
                      }}
                    >
                      Allocate Funds
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* New Campaign Dialog */}
        <Dialog open={openNewCampaign} onClose={() => setOpenNewCampaign(false)} maxWidth="md" fullWidth>
          <DialogTitle>Launch New Campaign</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Campaign Title"
                  value={campaignForm.title}
                  onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  label="Campaign Description"
                  value={campaignForm.description}
                  onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Target Amount"
                  value={campaignForm.targetAmount}
                  onChange={(e) => setCampaignForm({ ...campaignForm, targetAmount: e.target.value })}
                  inputProps={{ min: "0", step: "0.01" }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="date"
                  label="Start Date"
                  value={campaignForm.startDate}
                  onChange={(e) => setCampaignForm({ ...campaignForm, startDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="date"
                  label="End Date"
                  value={campaignForm.endDate}
                  onChange={(e) => setCampaignForm({ ...campaignForm, endDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Bank Details
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Account Name"
                  value={campaignForm.bankDetails.accountName}
                  onChange={(e) => setCampaignForm({
                    ...campaignForm,
                    bankDetails: { ...campaignForm.bankDetails, accountName: e.target.value }
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Account Number"
                  value={campaignForm.bankDetails.accountNumber}
                  onChange={(e) => setCampaignForm({
                    ...campaignForm,
                    bankDetails: { ...campaignForm.bankDetails, accountNumber: e.target.value }
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Bank Name"
                  value={campaignForm.bankDetails.bankName}
                  onChange={(e) => setCampaignForm({
                    ...campaignForm,
                    bankDetails: { ...campaignForm.bankDetails, bankName: e.target.value }
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="IFSC Code"
                  value={campaignForm.bankDetails.ifscCode}
                  onChange={(e) => setCampaignForm({
                    ...campaignForm,
                    bankDetails: { ...campaignForm.bankDetails, ifscCode: e.target.value }
                  })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenNewCampaign(false)}>Cancel</Button>
            <Button onClick={handleCreateCampaign} variant="contained">
              Create Campaign
            </Button>
          </DialogActions>
        </Dialog>

        {/* New Expense Dialog */}
        <Dialog open={openNewExpense} onClose={() => setOpenNewExpense(false)}>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Amount"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Category"
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="date"
                  label="Expense Date"
                  value={expenseForm.expenseDate}
                  onChange={(e) => setExpenseForm({ ...expenseForm, expenseDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenNewExpense(false)}>Cancel</Button>
            <Button onClick={handleCreateExpense} variant="contained">
              Add Expense
            </Button>
          </DialogActions>
        </Dialog>

        {/* New Fund Allocation Dialog */}
        <Dialog open={openNewAllocation} onClose={() => setOpenNewAllocation(false)}>
          <DialogTitle>Allocate Funds</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Amount"
                  value={allocationForm.amount}
                  onChange={(e) => setAllocationForm({ ...allocationForm, amount: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Purpose"
                  value={allocationForm.purpose}
                  onChange={(e) => setAllocationForm({ ...allocationForm, purpose: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="date"
                  label="Allocation Date"
                  value={allocationForm.allocationDate}
                  onChange={(e) => setAllocationForm({ ...allocationForm, allocationDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenNewAllocation(false)}>Cancel</Button>
            <Button onClick={handleCreateAllocation} variant="contained">
              Allocate Funds
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default NGODashboard; 