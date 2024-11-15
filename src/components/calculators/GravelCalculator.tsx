import React, { useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
  Paper,
} from '@mui/material';

interface MaterialDensity {
  name: string;
  densityRange: {
    min: number;
    max: number;
  };
}

const materials: MaterialDensity[] = [
  { name: 'Gravel (¼" - 2")', densityRange: { min: 1.4, max: 1.7 } },
  { name: 'Rock (2" - 6")', densityRange: { min: 1.5, max: 1.7 } },
  { name: 'Sand (dry)', densityRange: { min: 1.3, max: 1.5 } },
  { name: 'Sand (wet)', densityRange: { min: 1.5, max: 1.7 } },
  { name: 'Topsoil (dry)', densityRange: { min: 1.0, max: 1.3 } },
  { name: 'Topsoil (wet)', densityRange: { min: 1.5, max: 1.7 } },
  { name: 'Riprap', densityRange: { min: 1.7, max: 2.0 } },
];

const GravelCalculator: React.FC = () => {
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [depth, setDepth] = useState<string>('');
  const [material, setMaterial] = useState<string>(materials[0].name);
  const [pricePerUnit, setPricePerUnit] = useState<string>('');

  const calculateResults = () => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const d = parseFloat(depth);
    
    if (isNaN(l) || isNaN(w) || isNaN(d)) return null;

    // Convert to cubic yards (divide by 27 as there are 27 cubic feet in a cubic yard)
    const cubicYards = (l * w * d) / 27;
    
    const selectedMaterial = materials.find(m => m.name === material);
    if (!selectedMaterial) return null;

    const minTons = cubicYards * selectedMaterial.densityRange.min;
    const maxTons = cubicYards * selectedMaterial.densityRange.max;

    const price = parseFloat(pricePerUnit) || 0;
    const minCost = minTons * price;
    const maxCost = maxTons * price;

    return {
      cubicYards: cubicYards.toFixed(2),
      minTons: minTons.toFixed(2),
      maxTons: maxTons.toFixed(2),
      minCost: minCost.toFixed(2),
      maxCost: maxCost.toFixed(2),
    };
  };

  const results = calculateResults();

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Gravel Calculator
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Length (feet)"
            type="number"
            value={length}
            onChange={(e) => setLength(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Width (feet)"
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Depth (feet)"
            type="number"
            value={depth}
            onChange={(e) => setDepth(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Material</InputLabel>
            <Select
              value={material}
              label="Material"
              onChange={(e) => setMaterial(e.target.value)}
            >
              {materials.map((mat) => (
                <MenuItem key={mat.name} value={mat.name}>
                  {mat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Price per ton ($)"
            type="number"
            value={pricePerUnit}
            onChange={(e) => setPricePerUnit(e.target.value)}
          />
        </Grid>
      </Grid>

      {results && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Results
          </Typography>
          <Typography>Cubic Yards: {results.cubicYards}</Typography>
          <Typography>
            Weight: {results.minTons} - {results.maxTons} tons
          </Typography>
          {parseFloat(pricePerUnit) > 0 && (
            <Typography>
              Estimated Cost: ${results.minCost} - ${results.maxCost}
            </Typography>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default GravelCalculator; 