import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Divider,
  CircularProgress
} from '@mui/material';

const NGODetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ngo, setNgo] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [donationDialog, setDonationDialog] = useState({ open: false, campaignId: null });
  const [donationAmount, setDonationAmount] = useState('');
  const [donationStatus, setDonationStatus] = useState({ success: false, message: '' });

  useEffect(() => {
    const fetchNGODetails = async () => {
      try {
        console.log('Fetching details for NGO ID:', id);
        const [ngoResponse, campaignsResponse] = await Promise.all([
          axios.get(`http://localhost:3000/api/ngos/${id}`),
          axios.get(`http://localhost:3000/api/campaigns/ngo/${id}`)
        ]);
        
        console.log('NGO Response:', ngoResponse.data);
        console.log('Campaigns Response:', campaignsResponse.data);
        
        setNgo(ngoResponse.data);
        setCampaigns(campaignsResponse.data);
      } catch (err) {
        console.error('Error details:', err.response || err);
        const errorMessage = err.response?.data?.error || err.message;
        setError(`Failed to fetch NGO details: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNGODetails();
    } else {
      setError('No NGO ID provided');
      setLoading(false);
    }
  }, [id]);

  const handleDonationClick = (campaignId) => {
    if (!localStorage.getItem('isLoggedIn') || localStorage.getItem('userType') !== 'donor') {
      navigate('/donorlogin', { state: { from: `/donor/dashboard/ngo/${id}` } });
      return;
    }
    
    setDonationDialog({ open: true, campaignId });
    setDonationAmount('');
    setDonationStatus({ success: false, message: '' });
  };

  const handleDonationSubmit = async () => {
    try {
      const amount = parseFloat(donationAmount);
      if (isNaN(amount) || amount <= 0) {
        setDonationStatus({ success: false, message: 'Please enter a valid amount' });
        return;
      }

      const donorId = localStorage.getItem('donorId');
      if (!donorId) {
        setDonationStatus({ success: false, message: 'Please login as a donor to make a donation' });
        return;
      }

      await axios.post('http://localhost:3000/api/donations', {
        campaign_id: donationDialog.campaignId,
        donor_id: donorId,
        amount: amount,
        payment_method: 'online',
        is_anonymous: false
      });

      setDonationStatus({ success: true, message: 'Donation successful! Thank you for your contribution.' });
      
      // Refresh campaign data
      const campaignsResponse = await axios.get(`http://localhost:3000/api/campaigns/ngo/${id}`);
      setCampaigns(campaignsResponse.data);
      
      setTimeout(() => {
        setDonationDialog({ open: false, campaignId: null });
      }, 2000);
    } catch (err) {
      setDonationStatus({ 
        success: false, 
        message: err.response?.data?.error || 'Failed to process donation. Please try again.'
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={() => navigate('/discover-ngos')}>
              Back to NGO List
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  if (!ngo) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert 
          severity="info"
          action={
            <Button color="inherit" size="small" onClick={() => navigate('/discover-ngos')}>
              Back to NGO List
            </Button>
          }
        >
          NGO not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* NGO Details Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            {ngo.organization_name}
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" color="text.secondary" paragraph>
                <strong>Registration Number:</strong> {ngo.registration_number}
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                <strong>Address:</strong> {ngo.address}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" color="text.secondary" paragraph>
                <strong>Contact:</strong> {ngo.phone}
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                <strong>Email:</strong> {ngo.email}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Active Campaigns Section */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 3 }}>
        Active Campaigns
      </Typography>

      <Grid container spacing={4}>
        {campaigns.length === 0 ? (
          <Grid item xs={12}>
            <Alert severity="info">No active campaigns at the moment.</Alert>
          </Grid>
        ) : (
          campaigns.map((campaign) => (
            <Grid item xs={12} key={campaign.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {campaign.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {campaign.description}
                  </Typography>
                  
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        ₹{campaign.current_amount?.toLocaleString() || 0} raised of ₹{campaign.target_amount?.toLocaleString()}
                      </Typography>
                      <Typography variant="body2">
                        {Math.round((campaign.current_amount / campaign.target_amount) * 100)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min((campaign.current_amount / campaign.target_amount) * 100, 100)} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleDonationClick(campaign.id)}
                    >
                      Donate Now
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => window.open(`/campaigns/${campaign.id}`, '_blank')}
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Donation Dialog */}
      <Dialog open={donationDialog.open} onClose={() => setDonationDialog({ open: false, campaignId: null })}>
        <DialogTitle>Make a Donation</DialogTitle>
        <DialogContent>
          {donationStatus.message && (
            <Alert 
              severity={donationStatus.success ? "success" : "error"} 
              sx={{ mb: 2 }}
            >
              {donationStatus.message}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Amount (₹)"
            type="number"
            fullWidth
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            disabled={donationStatus.success}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDonationDialog({ open: false, campaignId: null })}
            color="primary"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDonationSubmit} 
            color="primary" 
            variant="contained"
            disabled={donationStatus.success}
          >
            Donate
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default NGODetails; 