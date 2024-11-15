"use client";

import React, { useState } from 'react';
import './GravelPage.css';

export default function GravelPage() {
    const [width, setWidth] = useState<number>(0);
    const [length, setLength] = useState<number>(0);
    const [depth, setDepth] = useState<number>(0);
    const [pricePerCubicYard, setPricePerCubicYard] = useState<number>(0);
    const [totalCost, setTotalCost] = useState<number | null>(null);

    const calculateGravel = () => {
        const depthInFeet = depth / 12;
        const volumeInCubicFeet = width * length * depthInFeet;
        const volumeInCubicYards = volumeInCubicFeet / 27;
        const cost = volumeInCubicYards * pricePerCubicYard;
        setTotalCost(cost);
    };

    return (
        <div className="gravel-page-container">
            <div className="content-wrapper">
                <div className="calculator-section">
                    <h1 className="page-title">Gravel Driveway Calculator</h1>
                    <div className="input-group">
                        <label>
                            Width (feet):
                            <input type="number" value={width} onChange={(e) => setWidth(parseFloat(e.target.value))} />
                        </label>
                    </div>
                    <div className="input-group">
                        <label>
                            Length (feet):
                            <input type="number" value={length} onChange={(e) => setLength(parseFloat(e.target.value))} />
                        </label>
                    </div>
                    <div className="input-group">
                        <label>
                            Depth (inches):
                            <input type="number" value={depth} onChange={(e) => setDepth(parseFloat(e.target.value))} />
                        </label>
                    </div>
                    <div className="input-group">
                        <label>
                            Price per Cubic Yard:
                            <input type="number" value={pricePerCubicYard} onChange={(e) => setPricePerCubicYard(parseFloat(e.target.value))} />
                        </label>
                    </div>
                    <button className="calculate-button" onClick={calculateGravel}>Calculate</button>
                    {totalCost !== null && (
                        <div className="result">
                            <h2>Total Cost: ${totalCost.toFixed(2)}</h2>
                        </div>
                    )}
                </div>
                <div className="info-section">
                    <h2>How the Gravel Driveway Calculator Works</h2>
                    <p>
                        The Gravel Driveway Calculator is a simple, yet powerful tool designed to help you estimate the amount of gravel needed for your driveway project. Whether you're laying gravel for a new driveway or replenishing an existing one, this calculator provides an accurate estimate based on the specific dimensions of your project.
                    </p>
                    <h3>Key Inputs Required:</h3>
                    <ul>
                        <li><strong>Length of the Driveway:</strong> This is the total distance you want to cover with gravel. Measure the driveway’s length in feet.</li>
                        <li><strong>Width of the Driveway:</strong> Measure how wide your driveway will be in feet. This is typically the most variable measurement, as driveways can vary in size depending on your needs.</li>
                        <li><strong>Gravel Depth (Thickness):</strong> Choose the depth or thickness of the gravel layer you want to apply. This is often measured in inches and can range from a few inches for a light gravel coverage to several inches for a more robust surface. The calculator assumes a standard depth, but you can adjust this based on your specific needs.</li>
                    </ul>
                    <h3>How the Calculator Works:</h3>
                    <ul>
                        <li><strong>Volume Calculation:</strong> The calculator first multiplies the length, width, and depth of your driveway to determine the total volume of gravel required in cubic feet. This gives you the overall amount of gravel necessary for the project.</li>
                        <li><strong>Conversion to Cubic Yards:</strong> Gravel is typically sold in cubic yards, so the calculator then converts the total volume from cubic feet to cubic yards. Since there are 27 cubic feet in a cubic yard, the calculator divides the cubic feet value by 27 to provide an estimate in cubic yards.</li>
                    </ul>
                    <h3>Additional Features:</h3>
                    <ul>
                        <li><strong>Weight Estimate:</strong> In some cases, the calculator may also provide an estimate of the weight of the gravel needed. This can help you determine how much gravel to order from suppliers, as gravel is often sold by weight.</li>
                        <li><strong>Adjustable Gravel Depth:</strong> You can adjust the depth of the gravel depending on how thick you want the layer to be. Typically, a 3-inch depth is common for a gravel driveway, but this can vary depending on traffic and the type of gravel you choose.</li>
                    </ul>
                    <h3>Why Use the Gravel Calculator?</h3>
                    <ul>
                        <li><strong>Accurate Estimates:</strong> This tool helps ensure that you buy the right amount of gravel, reducing the risk of over- or under-ordering.</li>
                        <li><strong>Cost Efficiency:</strong> With accurate volume and weight calculations, you can more efficiently estimate the costs for materials, labor, and any additional requirements for your project.</li>
                        <li><strong>Convenience:</strong> By inputting simple measurements, you get an immediate estimate of the gravel needed, saving you time and effort in planning your driveway project.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
} 