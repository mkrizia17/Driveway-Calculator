"use client";

import React, { useState } from 'react';
import './GravelPage.css';

export default function GravelPage() {
    const [width, setWidth] = useState<number>(0);
    const [length, setLength] = useState<number>(0);
    const [depth, setDepth] = useState<number>(0);
    const [pricePerCubicYard, setPricePerCubicYard] = useState<number>(0);
    const [totalCost, setTotalCost] = useState<number | null>(null);
    const [volumeInCubicYards, setVolumeInCubicYards] = useState<number | null>(null);
    const [tonsNeeded, setTonsNeeded] = useState<number | null>(null);
    const [showRequired, setShowRequired] = useState(false);

    const calculateGravel = () => {
        if (width <= 0 || length <= 0 || depth <= 0) {
            setShowRequired(true);
            return;
        }
        
        // If all fields are filled, proceed with calculation
        setShowRequired(false);
        const widthYards = Math.round(width / 3);
        const lengthYards = Math.round(length / 3);
        const depthYards = depth / 36;
        
        // Calculate volume in cubic yards and round to 1 decimal place
        const calculatedVolume = Math.round((widthYards * lengthYards * depthYards) * 10) / 10;
        setVolumeInCubicYards(calculatedVolume);
        
        // Calculate tons based on rounded volume
        setTonsNeeded(calculatedVolume * 1.35);
        
        // Calculate cost
        const cost = pricePerCubicYard > 0 ? calculatedVolume * pricePerCubicYard : 0;
        setTotalCost(cost);
    };

    return (
        <div className="gravel-page-container font-roboto">
            <div className="content-wrapper">
                <div className="calculator-section">
                    <h1 className="page-title font-roboto">Gravel Driveway Calculator</h1>
                    <div className="input-group">
                        <label>
                            Width (feet): <span className="required">*</span>
                            <input 
                                type="number" 
                                value={width} 
                                onChange={(e) => setWidth(parseFloat(e.target.value))} 
                                required 
                                placeholder={showRequired && width <= 0 ? "This field is required" : "Please fill in this field"}
                            />
                        </label>
                    </div>
                    <div className="input-group">
                        <label>
                            Length (feet): <span className="required">*</span>
                            <input 
                                type="number" 
                                value={length} 
                                onChange={(e) => setLength(parseFloat(e.target.value))} 
                                required 
                                placeholder={showRequired && length <= 0 ? "This field is required" : "Please fill in this field"}
                            />
                        </label>
                    </div>
                    <div className="input-group">
                        <label>
                            Depth (inches): <span className="required">*</span>
                            <input 
                                type="number" 
                                value={depth} 
                                onChange={(e) => setDepth(parseFloat(e.target.value))} 
                                required 
                                placeholder={showRequired && depth <= 0 ? "This field is required" : "Please fill in this field"}
                            />
                        </label>
                    </div>
                    <div className="input-group">
                        <label>
                            Price per Cubic Yard (Optional):
                            <input type="number" value={pricePerCubicYard} onChange={(e) => setPricePerCubicYard(parseFloat(e.target.value))} />
                        </label>
                    </div>
                    <button className="calculate-button" onClick={calculateGravel}>Calculate</button>

                    <div className="result">
                        <h2>Dimensions</h2>
                        <p>Area: {(length && width ? length * width : 0).toFixed(2)} sq ft</p>
                        <p>Volume: {(volumeInCubicYards ?? 0).toFixed(1)} cubic yards</p>
                        <p>Weight: {(tonsNeeded ?? 0).toFixed(1)} tons</p>
                    </div>

                    <div className="result">
                        <h2>Cost Breakdown</h2>
                        <p>Price per Cubic Yard: ${(pricePerCubicYard ?? 0).toFixed(2)}</p>
                        <p>Price per Cubic Foot: ${((pricePerCubicYard ?? 0) / 27).toFixed(2)}</p>
                        <p>Price per Square Foot: ${(length && width && (length * width) !== 0) ? 
                            ((totalCost ?? 0) / (length * width)).toFixed(2) : 
                            (0).toFixed(2)}
                        </p>
                    </div>

                    <div className="result">
                        <h2>Estimated Total Cost</h2>
                        {(!pricePerCubicYard || pricePerCubicYard <= 0) ? (
                            <p className="warning-text">Please enter Price per Cubic Yard to calculate total cost</p>
                        ) : (
                            <>
                                <h4 className="total-cost">${(totalCost ?? 0).toFixed(2)}</h4>
                                <p className="estimate-note">Estimate only – weight varies by material</p>
                            </>
                        )}
                    </div>
                </div>
                <div className="info-section">
                    <h2>How the Gravel Driveway Calculator Works</h2>

                    <p>
                        The Gravel Driveway Calculator is a simple, yet powerful tool designed to help you estimate the amount of gravel needed for your driveway project. Whether you're laying gravel for a new driveway or replenishing an existing one, this calculator provides an accurate estimate based on the specific dimensions of your project.
                    </p>

                    <div className="info-image-container">
                        <img 
                            src="/images/gravel.jpg" 
                            alt="Gravel driveway leading to a red brick house surrounded by trees" 
                            className="info-image"
                        />
                    </div>
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