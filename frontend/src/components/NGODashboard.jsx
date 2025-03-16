import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Button, Paper,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField,
  Grid, Card, CardContent, IconButton
} from '@mui/material';

const NGODashboard = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalExpenses: 0,
    activeCampaigns: 0,
    completedCampaigns: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const storedNgoId = localStorage.getItem('ngoId');
        if (!storedNgoId) {
          throw new Error('No NGO ID found. Please log in again.');
        }

        // Fetch campaigns
        const campaignsResponse = await axios.get(`http://localhost:3000/api/campaigns/ngo/${storedNgoId}`);
        setCampaigns(campaignsResponse.data);

        // Fetch statistics
        const statsResponse = await axios.get(`http://localhost:3000/api/ngo/${storedNgoId}/statistics`);
        setStats(statsResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 8 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Welcome to Your NGO Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage your campaigns, track donations, and make a difference
          </Typography>
        </Box>

        {error && (
          <Paper sx={{ p: 2, mb: 4, bgcolor: 'error.light', color: 'error.contrastText' }}>
            <Typography>{error}</Typography>
          </Paper>
        )}

        {/* Quick Stats */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', bgcolor: 'primary.light' }}>
              <CardContent>
                <Typography color="primary.contrastText" gutterBottom>
                  Total Donations
                </Typography>
                <Typography variant="h4" component="div" color="primary.contrastText">
                  ₹{stats.totalDonations?.toLocaleString() || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', bgcolor: 'success.light' }}>
              <CardContent>
                <Typography color="success.contrastText" gutterBottom>
                  Active Campaigns
                </Typography>
                <Typography variant="h4" component="div" color="success.contrastText">
                  {stats.activeCampaigns || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', bgcolor: 'warning.light' }}>
              <CardContent>
                <Typography color="warning.contrastText" gutterBottom>
                  Total Expenses
                </Typography>
                <Typography variant="h4" component="div" color="warning.contrastText">
                  ₹{stats.totalExpenses?.toLocaleString() || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', bgcolor: 'info.light' }}>
              <CardContent>
                <Typography color="info.contrastText" gutterBottom>
                  Completed Campaigns
                </Typography>
                <Typography variant="h4" component="div" color="info.contrastText">
                  {stats.completedCampaigns || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => navigate('/ngo/ngo-dashboard/campaigns/new')}
                sx={{ height: '100%', py: 2 }}
              >
                Launch New Campaign
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={() => navigate('/ngo/ngo-dashboard/expenses/add')}
                sx={{ height: '100%', py: 2 }}
              >
                Add Expense
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                onClick={() => navigate('/ngo/ngo-dashboard/statistics')}
                sx={{ height: '100%', py: 2 }}
              >
                View Statistics
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                color="info"
                onClick={() => navigate('/ngo/ngo-dashboard/transactions')}
                sx={{ height: '100%', py: 2 }}
              >
                View Transactions
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Recent Campaigns */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" gutterBottom>
            Recent Campaigns
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Campaign</TableCell>
                  <TableCell>Target Amount</TableCell>
                  <TableCell>Raised</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {campaigns.slice(0, 5).map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>{campaign.title}</TableCell>
                    <TableCell>₹{campaign.target_amount?.toLocaleString()}</TableCell>
                    <TableCell>₹{campaign.current_amount?.toLocaleString()}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: '100%',
                            mr: 1,
                            height: 8,
                            borderRadius: 1,
                            bgcolor: 'grey.300',
                          }}
                        >
                          <Box
                            sx={{
                              width: `${Math.min((campaign.current_amount / campaign.target_amount) * 100, 100)}%`,
                              height: '100%',
                              borderRadius: 1,
                              bgcolor: 'primary.main',
                            }}
                          />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2" color="text.secondary">
                            {Math.round((campaign.current_amount / campaign.target_amount) * 100)}%
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          display: 'inline-block',
                          bgcolor: campaign.status === 'active' ? 'success.light' : 'info.light',
                          color: campaign.status === 'active' ? 'success.dark' : 'info.dark',
                        }}
                      >
                        {campaign.status}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => navigate(`/ngo/dashboard/campaigns/${campaign.id}`)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {campaigns.length > 5 && (
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Button
                color="primary"
                onClick={() => navigate('/ngo/dashboard/campaigns')}
              >
                View All Campaigns
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default NGODashboard;