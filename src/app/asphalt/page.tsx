"use client";

import React, { useState } from 'react';
import '../gravel/GravelPage.css';
import Link from 'next/link';
import Image from 'next/image';

type Unit = 'in' | 'ft' | 'cm' | 'm' | 'yd';

export default function AsphaltPage() {
    const [width, setWidth] = useState<number>(0);
    const [length, setLength] = useState<number>(0);
    const [depth, setDepth] = useState<number>(0);
    const [pricePerCubicYard, setPricePerCubicYard] = useState<number>(0);
    const [totalCost, setTotalCost] = useState<number | null>(null);
    const [volumeInCubicYards, setVolumeInCubicYards] = useState<number | null>(null);
    const [tonsNeeded, setTonsNeeded] = useState<number | null>(null);
    const [widthUnit, setWidthUnit] = useState<Unit>('ft');
    const [lengthUnit, setLengthUnit] = useState<Unit>('ft');
    const [depthUnit, setDepthUnit] = useState<Unit>('in');

    const formatNumber = (num: number): string => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(num);
    };

    const formatNumberOneDecimal = (num: number): string => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        }).format(num);
    };

    const convertToFeet = (value: number, unit: Unit): number => {
        let result: number;
        switch (unit) {
            case 'in':
                result = value / 12;          // 1 ft = 12 in
                break;
            case 'ft':
                result = value;
                break;
            case 'cm':
                result = value / 30.48;       // 1 ft = 30.48 cm
                break;
            case 'm':
                result = value * 3.28084;     // 1 m = 3.28084 ft
                break;
            case 'yd':
                result = value * 3;           // 1 yd = 3 ft
                break;
            default:
                result = value;
        }
        return Math.round(result * 100) / 100;
    };

    const convertToInches = (value: number, unit: Unit): number => {
        let result: number;
        switch (unit) {
            case 'in':
                result = value;
                break;
            case 'ft':
                result = value * 12;          // 1 ft = 12 in
                break;
            case 'cm':
                result = value / 2.54;        // 1 in = 2.54 cm
                break;
            case 'm':
                result = value * 39.3701;     // 1 m = 39.3701 in
                break;
            case 'yd':
                result = value * 36;          // 1 yd = 36 in
                break;
            default:
                result = value;
        }
        return Math.round(result * 100) / 100;
    };

    const calculateArea = (): number => {
        if (!length || !width) return 0;
        const lengthInFeet = convertToFeet(length, lengthUnit);
        const widthInFeet = convertToFeet(width, widthUnit);
        return lengthInFeet * widthInFeet;
    };

    const calculatePricePerCubicFoot = (): number => {
        if (!pricePerCubicYard) return 0;
        return pricePerCubicYard / 27;
    };

    const calculatePricePerCubicInch = (): number => {
        if (!pricePerCubicYard) return 0;
        return pricePerCubicYard / 46656;
    };

    const calculatePricePerCubicCentimeter = (): number => {
        if (!pricePerCubicYard) return 0;
        return pricePerCubicYard / 764554.858;
    };

    const calculatePricePerCubicMeter = (): number => {
        if (!pricePerCubicYard) return 0;
        return pricePerCubicYard / 0.764555;
    };

    const calculateAsphalt = () => {
        if (width <= 0 || length <= 0 || depth <= 0) {
            return;
        }
        
        // Ensure pricePerCubicYard is 0 if empty or invalid
        const price = pricePerCubicYard || 0;
        setPricePerCubicYard(price);
        
        // Convert all measurements to standard units
        const widthInFeet = convertToFeet(width, widthUnit);
        const lengthInFeet = convertToFeet(length, lengthUnit);
        const depthInInches = convertToInches(depth, depthUnit);
        
        // Convert to yards
        const widthYards = widthInFeet / 3;
        const lengthYards = lengthInFeet / 3;
        const depthYards = depthInInches / 36;
        
        // Calculate volume in cubic yards and round to 1 decimal place
        const calculatedVolume = Math.round((widthYards * lengthYards * depthYards) * 10) / 10;
        setVolumeInCubicYards(calculatedVolume);
        
        // Calculate tons based on rounded volume and round to 1 decimal place
        const calculatedTons = Math.round(calculatedVolume * 1.35 * 10) / 10;
        setTonsNeeded(calculatedTons);
        
        // Calculate cost and round to 2 decimal places
        const cost = price > 0 ? Math.round(calculatedVolume * price * 100) / 100 : 0;
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
                    <h1 className="page-title font-roboto">Asphalt Driveway Calculator</h1>
                    <div className="input-group">
                        <label>
                            Width: <span className="required">*</span>
                            <div className="input-with-unit">
                                <input 
                                    type="number" 
                                    value={width} 
                                    onChange={(e) => setWidth(parseFloat(e.target.value))} 
                                    required 
                                    placeholder={width <= 0 ? "This field is required" : "Please fill in this field"}
                                />
                                <select 
                                    value={widthUnit} 
                                    onChange={(e) => setWidthUnit(e.target.value as Unit)}
                                    className="unit-select"
                                >
                                    <option value="in">in</option>
                                    <option value="ft">ft</option>
                                    <option value="cm">cm</option>
                                    <option value="m">m</option>
                                    <option value="yd">yd</option>
                                </select>
                            </div>
                        </label>
                    </div>
                    <div className="input-group">
                        <label>
                            Length: <span className="required">*</span>
                            <div className="input-with-unit">
                                <input 
                                    type="number" 
                                    value={length} 
                                    onChange={(e) => setLength(parseFloat(e.target.value))} 
                                    required 
                                    placeholder={length <= 0 ? "This field is required" : "Please fill in this field"}
                                />
                                <select 
                                    value={lengthUnit} 
                                    onChange={(e) => setLengthUnit(e.target.value as Unit)}
                                    className="unit-select"
                                >
                                    <option value="in">in</option>
                                    <option value="ft">ft</option>
                                    <option value="cm">cm</option>
                                    <option value="m">m</option>
                                    <option value="yd">yd</option>
                                </select>
                            </div>
                        </label>
                    </div>
                    <div className="input-group">
                        <label>
                            Depth: <span className="required">*</span>
                            <div className="input-with-unit">
                                <input 
                                    type="number" 
                                    value={depth} 
                                    onChange={(e) => setDepth(parseFloat(e.target.value))} 
                                    required 
                                    placeholder={depth <= 0 ? "This field is required" : "Please fill in this field"}
                                />
                                <select 
                                    value={depthUnit} 
                                    onChange={(e) => setDepthUnit(e.target.value as Unit)}
                                    className="unit-select"
                                >
                                    <option value="in">in</option>
                                    <option value="ft">ft</option>
                                    <option value="cm">cm</option>
                                    <option value="m">m</option>
                                    <option value="yd">yd</option>
                                </select>
                            </div>
                        </label>
                    </div>
                    <div className="input-group">
                        <label>
                            Price per Cubic Yard (Optional):
                            <div className="price-input-container">
                                <input 
                                    type="number" 
                                    value={pricePerCubicYard || ''} 
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setPricePerCubicYard(value === '' ? 0 : parseFloat(value));
                                    }} 
                                    placeholder="0.00"
                                    className="price-input"
                                />
                                <span className="price-prefix">$</span>
                            </div>
                        </label>
                    </div>
                    <button className="calculate-button" onClick={calculateAsphalt}>Calculate</button>

                    <div className="result">
                        <h2>Dimensions</h2>
                        <p>Area: {formatNumber(calculateArea())} sq ft</p>
                        <p>Perimeter: {formatNumber(length && width ? 2 * (convertToFeet(length, lengthUnit) + convertToFeet(width, widthUnit)) : 0)} ft</p>
                        <p>Volume: {formatNumberOneDecimal(volumeInCubicYards ?? 0)} cubic yards</p>
                        <p>Weight: {formatNumberOneDecimal(tonsNeeded ?? 0)} tons</p>
                    </div>

                    <div className="result">
                        <h2>Cost Breakdown</h2>
                        <p>Price per Cubic Yard: ${formatNumber(pricePerCubicYard ?? 0)}</p>
                        <p>Price per Cubic Foot: ${formatNumber(calculatePricePerCubicFoot())}</p>
                        <p>Price per Cubic Inch: ${formatNumber(calculatePricePerCubicInch())}</p>
                        <p>Price per Cubic Centimeter: ${formatNumber(calculatePricePerCubicCentimeter())}</p>
                        <p>Price per Cubic Meter: ${formatNumber(calculatePricePerCubicMeter())}</p>
                    </div>

                    <div className="result">
                        <h2>Estimated Total Cost</h2>
                        {(!pricePerCubicYard || pricePerCubicYard <= 0) ? (
                            <p className="warning-text">Please enter Price per Cubic Yard to calculate total cost</p>
                        ) : (
                            <>
                                <h4 className="total-cost">${formatNumber(totalCost ?? 0)}</h4>
                                <p className="estimate-note">Estimate only – weight varies by material</p>
                            </>
                        )}
                    </div>

                    <div className="compare-section">
                        <div className="compare-buttons">
                            <Link href="/gravel" className="compare-button-clear">
                                <span>Compare to Gravel</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14m-7-7l7 7-7 7"/>
                                </svg>
                            </Link>
                            <Link href="/concrete" className="compare-button-clear">
                                <span>Compare to Concrete</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14m-7-7l7 7-7 7"/>
                                </svg>
                            </Link>
                            <Link href="/pavers" className="compare-button-clear">
                                <span>Compare to Pavers</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14m-7-7l7 7-7 7"/>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="info-section">
                    <h2>How the Asphalt Driveway Calculator Works</h2>

                    <p>
                        The Asphalt Driveway Calculator is a simple, yet powerful tool designed to help you estimate the amount of asphalt needed for your driveway project. Whether you're planning a new driveway or resurfacing an existing one, this calculator provides an accurate estimate based on the specific dimensions of your project.
                    </p>

                    <div className="info-image-container">
                        <Image 
                            src="/images/asphalt.jpg" 
                            alt="Smooth asphalt driveway with professional finish" 
                            width={800}
                            height={600}
                            className="info-image"
                        />
                    </div>

                    <h3>Key Inputs Required:</h3>
                    <p className="info-paragraph">
                        Length of the Driveway: This is the total distance you want to cover with asphalt. Measure the driveway's length in feet.
                    </p>
                    <p className="info-paragraph">
                        Width of the Driveway: Measure how wide your driveway will be in feet. This is typically the most variable measurement, as driveways can vary in size depending on your needs.
                    </p>
                    <p className="info-paragraph">
                        Asphalt Depth: Choose the depth or thickness of the asphalt layer. This is often measured in inches and typically ranges from 2 to 4 inches for residential driveways.
                    </p>

                    <h3>How the Calculator Works:</h3>
                    <p className="info-paragraph">
                        Volume Calculation: The calculator first multiplies the length, width, and depth of your driveway to determine the total volume of asphalt required in cubic feet. This gives you the overall amount of asphalt necessary for the project.
                    </p>
                    <p className="info-paragraph">
                        Conversion to Cubic Yards: Asphalt is typically sold in cubic yards, so the calculator then converts the total volume from cubic feet to cubic yards. Since there are 27 cubic feet in a cubic yard, the calculator divides the cubic feet value by 27 to provide an estimate in cubic yards.
                    </p>

                    <h3>Why Use the Asphalt Calculator?</h3>
                    <p className="info-paragraph">
                        Accurate Estimates: This tool helps ensure that you order the right amount of asphalt, reducing the risk of over- or under-ordering.
                    </p>
                    <p className="info-paragraph">
                        Cost Efficiency: With accurate volume calculations, you can more efficiently estimate the costs for materials, labor, and any additional requirements for your project.
                    </p>
                    <p className="info-paragraph">
                        Convenience: By inputting simple measurements, you get an immediate estimate of the asphalt needed, saving you time and effort in planning your driveway project.
                    </p>
                </div>
            </div>
        </div>
    );
} 