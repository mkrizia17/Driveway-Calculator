"use client";

import React, { useState } from 'react';
import '../gravel/GravelPage.css';
import Link from 'next/link';
import Image from 'next/image';

export default function PaversPage() {
    const [width, setWidth] = useState<number>(0);
    const [length, setLength] = useState<number>(0);
    const [depth, setDepth] = useState<number>(0);
    const [pricePerCubicYard, setPricePerCubicYard] = useState<number>(0);
    const [totalCost, setTotalCost] = useState<number | null>(null);
    const [volumeInCubicYards, setVolumeInCubicYards] = useState<number | null>(null);
    const [tonsNeeded, setTonsNeeded] = useState<number | null>(null);

    const calculatePavers = () => {
        if (width <= 0 || length <= 0 || depth <= 0) {
            return;
        }
        
        // Convert feet to yards for length and width
        const widthYards = Math.round(width / 3);
        const lengthYards = Math.round(length / 3);
        // Convert inches to yards for depth
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
            <Link href="/" className="back-button">
                <svg 
                    className="w-5 h-5 mr-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                </svg>
                Back to Home
            </Link>
            <div className="content-wrapper">
                <div className="calculator-section">
                    <h1 className="page-title font-roboto">Paver Driveway Calculator</h1>
                    <div className="input-group">
                        <label>
                            Width (feet): <span className="required">*</span>
                            <input 
                                type="number" 
                                value={width} 
                                onChange={(e) => setWidth(parseFloat(e.target.value))} 
                                required 
                                placeholder="Please fill in this field"
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
                                placeholder="Please fill in this field"
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
                                placeholder="Please fill in this field"
                            />
                        </label>
                    </div>
                    <div className="input-group">
                        <label>
                            Price per Cubic Yard (Optional):
                            <input 
                                type="number" 
                                value={pricePerCubicYard} 
                                onChange={(e) => setPricePerCubicYard(parseFloat(e.target.value))} 
                            />
                        </label>
                    </div>
                    <button className="calculate-button" onClick={calculatePavers}>Calculate</button>

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
                    <h2>How the Pavers Driveway Calculator Works</h2>

                    <p>
                        The Pavers Driveway Calculator is a simple, yet powerful tool designed to help you estimate the amount of pavers and base materials needed for your driveway project. Whether you're planning a new driveway or replacing an existing one, this calculator provides an accurate estimate based on the specific dimensions of your project.
                    </p>

                    <div className="info-image-container">
                        <Image 
                            src="/images/pavers.jpg" 
                            alt="Beautiful paver driveway with intricate pattern design" 
                            width={800}
                            height={600}
                            className="info-image"
                        />
                    </div>

                    <h3>Key Inputs Required:</h3>
                    <p className="info-paragraph">
                        Length of the Driveway: This is the total distance you want to cover with pavers. Measure the driveway's length in feet.
                    </p>
                    <p className="info-paragraph">
                        Width of the Driveway: Measure how wide your driveway will be in feet. This is typically the most variable measurement, as driveways can vary in size depending on your needs.
                    </p>
                    <p className="info-paragraph">
                        Base Material Depth: Choose the depth or thickness of the base material layer. This is often measured in inches and typically ranges from 4 to 8 inches for residential driveways, depending on soil conditions and climate.
                    </p>

                    <h3>How the Calculator Works:</h3>
                    <p className="info-paragraph">
                        Volume Calculation: The calculator first multiplies the length, width, and depth of your driveway to determine the total volume of base materials required in cubic feet. This gives you the overall amount of materials necessary for the project.
                    </p>
                    <p className="info-paragraph">
                        Conversion to Cubic Yards: Base materials are typically sold in cubic yards, so the calculator then converts the total volume from cubic feet to cubic yards. Since there are 27 cubic feet in a cubic yard, the calculator divides the cubic feet value by 27 to provide an estimate in cubic yards.
                    </p>

                    <h3>Why Use the Pavers Calculator?</h3>
                    <p className="info-paragraph">
                        Accurate Estimates: This tool helps ensure that you order the right amount of pavers and base materials, reducing the risk of over- or under-ordering.
                    </p>
                    <p className="info-paragraph">
                        Cost Efficiency: With accurate calculations, you can more efficiently estimate the costs for materials, labor, and any additional requirements for your project.
                    </p>
                    <p className="info-paragraph">
                        Convenience: By inputting simple measurements, you get an immediate estimate of the materials needed, saving you time and effort in planning your driveway project.
                    </p>
                </div>
            </div>
        </div>
    );
} 