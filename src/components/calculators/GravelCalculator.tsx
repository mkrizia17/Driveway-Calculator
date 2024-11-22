import React, { useState } from 'react';
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent } from "../../components/ui/card"

interface Dimensions {
  length: string;
  width: string;
  depth: string;
}

interface CalculationResults {
  cubicYards: number;
  tons: number;
  totalCost: number;
}

const GravelCalculator: React.FC = () => {
  const [dimensions, setDimensions] = useState<Dimensions>({
    length: '',
    width: '',
    depth: ''
  });
  const [customPrice, setCustomPrice] = useState<string>('');
  const [results, setResults] = useState<CalculationResults | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    
    const length = parseFloat(dimensions.length);
    const width = parseFloat(dimensions.width);
    const depth = parseFloat(dimensions.depth);
    
    if (isNaN(length) || isNaN(width) || isNaN(depth)) return;

    // Convert inches to feet for depth
    const depthInFeet = depth / 12;
    
    // Calculate cubic feet
    const cubicFeet = length * width * depthInFeet;
    
    // Convert to cubic yards (27 cubic feet = 1 cubic yard)
    const cubicYards = cubicFeet / 27;
    
    // Calculate tons (1 cubic yard of gravel ≈ 1.4 tons)
    const tons = cubicYards * 1.4;
    
    // Calculate total cost if price is provided
    const price = parseFloat(customPrice) || 0;
    const totalCost = cubicYards * price;

    setResults({
      cubicYards,
      tons,
      totalCost
    });
  };

  return (
    <Card className="max-w-[1200px] mx-auto bg-white border-[#b0a36e]">
      <CardContent className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleCalculate} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              <div className="space-y-3">
                <Label htmlFor="length" className="text-xl font-bold text-[#1a2039]">
                  Length (feet)
                </Label>
                <Input
                  id="length"
                  type="number"
                  placeholder="Enter length"
                  value={dimensions.length}
                  onChange={(e) => setDimensions(prev => ({ ...prev, length: e.target.value }))}
                  required
                  className="h-14 text-3xl px-4 [&::-webkit-inner-spin-button]:appearance-none text-[#1a2039]"
                  style={{ fontSize: '1.75rem' }}
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="width" className="text-xl font-bold text-[#1a2039]">
                  Width (feet)
                </Label>
                <Input
                  id="width"
                  type="number"
                  placeholder="Enter width"
                  value={dimensions.width}
                  onChange={(e) => setDimensions(prev => ({ ...prev, width: e.target.value }))}
                  required
                  className="h-14 text-3xl px-4 [&::-webkit-inner-spin-button]:appearance-none text-[#1a2039]"
                  style={{ fontSize: '1.75rem' }}
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="depth" className="text-xl font-bold text-[#1a2039]">
                  Depth (inches)
                </Label>
                <Input
                  id="depth"
                  type="number"
                  placeholder="Enter depth"
                  value={dimensions.depth}
                  onChange={(e) => setDimensions(prev => ({ ...prev, depth: e.target.value }))}
                  required
                  className="h-14 text-3xl px-4 [&::-webkit-inner-spin-button]:appearance-none text-[#1a2039]"
                  style={{ fontSize: '1.75rem' }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="price" className="text-xl font-bold text-[#1a2039]">
                Price per Cubic Yard (optional)
              </Label>
              <Input
                id="price"
                type="number"
                placeholder="Enter price per cubic yard"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                className="h-14 text-3xl px-4 [&::-webkit-inner-spin-button]:appearance-none text-[#1a2039]"
                style={{ fontSize: '1.75rem' }}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-16 text-xl font-medium bg-[#b0a36e] hover:bg-[#8f845a] transition-colors text-[#f6f6f7]"
            >
              Calculate
            </Button>
          </form>

          {results && (
            <div className="mt-8 space-y-4">
              <div className="text-2xl font-bold text-[#1a2039]">
                Results:
              </div>
              <div className="text-xl text-[#1a2039]">
                Cubic Yards Needed: {results.cubicYards.toFixed(2)}
              </div>
              <div className="text-xl text-[#1a2039]">
                Approximate Weight: {results.tons.toFixed(2)} tons
              </div>
              {results.totalCost > 0 && (
                <div className="text-xl text-[#1a2039]">
                  Estimated Cost: ${results.totalCost.toFixed(2)}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GravelCalculator; 