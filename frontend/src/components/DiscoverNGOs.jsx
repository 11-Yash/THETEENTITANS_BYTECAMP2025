import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Divider
} from '@mui/material';

const DiscoverNGOs = () => {
  const navigate = useNavigate();
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        console.log('Fetching NGOs...');
        const response = await axios.get('http://localhost:3000/api/ngos/verified');
        console.log('NGOs response:', response.data);
        setNgos(response.data);
      } catch (err) {
        console.error('Error details:', err.response || err);
        setError('Failed to fetch NGOs: ' + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchNGOs();
  }, []);

  console.log('Current state:', { loading, error, ngosCount: ngos.length });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 1 }}>
          <Typography>{error}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Discover NGOs Making a Difference
      </Typography>

      <Grid container spacing={4}>
        {ngos.length === 0 ? (
          <Grid item xs={12}>
            <Box sx={{ p: 2, bgcolor: 'info.light', color: 'info.contrastText', borderRadius: 1 }}>
              <Typography>No verified NGOs found. Check back later!</Typography>
            </Box>
          </Grid>
        ) : (
          ngos.map((ngo) => (
            <Grid item xs={12} key={ngo.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {ngo.organization_name}
                    </Typography>
                    <Typography color="text.secondary" gutterBottom>
                      {ngo.address}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Active Campaigns: {ngo.active_campaigns}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Funds Raised: ₹{ngo.total_funds_raised?.toLocaleString() || 0}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate(`/donor/dashboard/ngo/${ngo.id}`)}
                      sx={{ mr: 2 }}
                    >
                      View Campaigns
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => window.open(`mailto:${ngo.email}`)}
                    >
                      Contact NGO
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default DiscoverNGOs; 