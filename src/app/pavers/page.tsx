"use client";

import React, { useState } from 'react';
import '../gravel/GravelPage.css';
import Link from 'next/link';
import Image from 'next/image';

type Unit = 'in' | 'ft' | 'cm' | 'm' | 'yd';

interface VolumeInCubicYards {
    gravel: number;
    sand: number;
    polymericSand: string;
    paversPerSqFt: number;
    pavers: number;
}

export default function PaversPage() {
    const [projectDimensions, setProjectDimensions] = useState({
        width: 0,
        length: 0,
        widthUnit: 'ft' as Unit,
        lengthUnit: 'ft' as Unit
    });

    const [paverDimensions, setPaverDimensions] = useState({
        width: 4,
        length: 8,
        widthUnit: 'in' as Unit,
        lengthUnit: 'in' as Unit
    });

    const [errors, setErrors] = useState<{
        width: string;
        length: string;
        paverWidth: string;
        paverLength: string;
    }>({
        width: '',
        length: '',
        paverWidth: '',
        paverLength: ''
    });

    const [pricePerCubicYard, setPricePerCubicYard] = useState<number>(0);
    const [totalCost, setTotalCost] = useState<number | null>(null);
    const [materialCosts, setMaterialCosts] = useState<{
        pavers: {min: number, max: number, custom?: number},
        gravel: {min: number, max: number},
        sand: {min: number, max: number},
        polymericSand: {min: number, max: number}
    } | null>(null);
    const [installationCost, setInstallationCost] = useState<number>(0);
    const [totalInstallationCost, setTotalInstallationCost] = useState<number>(0);
    const paverPriceUnit = 'per paver' as const;
    const [volumeInCubicYards, setVolumeInCubicYards] = useState<VolumeInCubicYards | null>(null);

    const calculatePavers = () => {
        // Reset errors
        setErrors({
            width: '',
            length: '',
            paverWidth: '',
            paverLength: ''
        });

        // Validate inputs
        let hasErrors = false;
        const newErrors = {
            width: '',
            length: '',
            paverWidth: '',
            paverLength: ''
        };

        if (!projectDimensions.width || projectDimensions.width <= 0) {
            newErrors.width = 'Width is required and must be greater than 0';
            hasErrors = true;
        }

        if (!projectDimensions.length || projectDimensions.length <= 0) {
            newErrors.length = 'Length is required and must be greater than 0';
            hasErrors = true;
        }

        if (!paverDimensions.width || paverDimensions.width <= 0) {
            newErrors.paverWidth = 'Paver width is required and must be greater than 0';
            hasErrors = true;
        }

        if (!paverDimensions.length || paverDimensions.length <= 0) {
            newErrors.paverLength = 'Paver length is required and must be greater than 0';
            hasErrors = true;
        }

        if (hasErrors) {
            setErrors(newErrors);
            return;
        }
        
        // Step 1: Calculate Patio Size in Square Feet
        const widthInFeet = convertToFeet(projectDimensions.width, projectDimensions.widthUnit);
        const lengthInFeet = convertToFeet(projectDimensions.length, projectDimensions.lengthUnit);
        const patioSquareFootage = widthInFeet * lengthInFeet;

        // Step 2: Calculate Paver Size in Square Feet
        const paverWidthInFeet = convertToInches(paverDimensions.width, paverDimensions.widthUnit) / 12;
        const paverLengthInFeet = convertToInches(paverDimensions.length, paverDimensions.lengthUnit) / 12;
        const paverSquareFootage = paverWidthInFeet * paverLengthInFeet;

        // Step 3: Calculate Number of Pavers Needed
        const totalPaversNeeded = Math.ceil(patioSquareFootage / paverSquareFootage);

        // Calculate Base Materials for Material Estimate
        const area = widthInFeet * lengthInFeet;
        const depth = 0.4;
        const gravelCubicYards = (area * depth) / 27;
        const roundedGravelCubicYards = Number(gravelCubicYards.toFixed(2));

        // Calculate Base Sand Volume
        const sandDepth = 1/12;                         // 1 inch = 1/12 foot
        const sandCubicYards = (area * sandDepth) / 27; // (144 * 1/12) / 27 = 0.44
        
        // Format to always show 2 decimal places
        const roundedSandCubicYards = Number(sandCubicYards.toFixed(2));

        // Calculate Polymeric Sand Bags Range
        const minCoveragePerBag = 50;                   // Maximum coverage: 75 sq ft per bag
        const maxCoveragePerBag = 100;                   // Minimum coverage: 50 sq ft per bag
        
        const minBags = Math.ceil(area / maxCoveragePerBag);  // Note: switched to maxCoverage for minBags
        const maxBags = Math.ceil(area / minCoveragePerBag);  // Note: switched to minCoverage for maxBags
        
        // Calculate material costs using maximum bags for worst case scenario
        const polymericSandCost = maxBags * 25;  // $25 per bag

        // Calculate paver cost based on selected unit
        let paverCost = 0;
        switch (paverPriceUnit) {
            case 'per paver':
                paverCost = totalPaversNeeded * (pricePerCubicYard || 0);
                break;
            case 'per sq ft':
                paverCost = area * (pricePerCubicYard || 0);
                break;
            case 'per sq m':
                paverCost = (area * 0.092903) * (pricePerCubicYard || 0); // Convert sq ft to sq m
                break;
        }

        const gravelCost = Math.round(roundedGravelCubicYards * 45); // $45 per cubic yard
        const sandCost = sandCubicYards * 15;      // $15 per cubic yard

        const calculatedInstallationCost = installationCost * area;
        setTotalInstallationCost(calculatedInstallationCost);
        setTotalCost(paverCost + calculatedInstallationCost);

        setMaterialCosts({
            pavers: { min: paverCost, max: paverCost, custom: paverCost },
            gravel: { min: gravelCost, max: gravelCost },
            sand: { min: sandCost, max: sandCost },
            polymericSand: { min: polymericSandCost, max: polymericSandCost }
        });

        console.log('Width in feet:', widthInFeet);
        console.log('Length in feet:', lengthInFeet);

        // Update the display in the Estimated Material Cost section:
        <div className="result">
            <h2 className="text-xl font-semibold mb-4">Estimated Material Cost</h2>
            <div className="space-y-2">
                <p>
                    Pavers Cost: {pricePerCubicYard === 0 ? 
                        <span className="warning-text">Please enter Paver Price to calculate Pavers Cost</span> : 
                        `$${formatNumber(materialCosts?.pavers.custom ?? 0)}`
                    }
                </p>
                <p>
                    Total installation cost: {installationCost === 0 ? 
                        <span className="warning-text">Please enter Cost of Installation to calculate Total Installation Cost</span> : 
                        `$${formatNumber(totalInstallationCost)}`
                    }
                </p>
            </div>
        </div>

        setVolumeInCubicYards({
            gravel: roundedGravelCubicYards,
            sand: roundedSandCubicYards,
            polymericSand: `${minBags}-${maxBags} bags`,
            paversPerSqFt: patioSquareFootage / totalPaversNeeded,
            pavers: totalPaversNeeded
        });
    };

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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        if (!projectDimensions.length || !projectDimensions.width) return 0;
        const lengthInFeet = convertToFeet(projectDimensions.length, projectDimensions.lengthUnit);
        const widthInFeet = convertToFeet(projectDimensions.width, projectDimensions.widthUnit);
        return lengthInFeet * widthInFeet;
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
                        strokeWidth="2" 
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                </svg>
                Back to Home
            </Link>
            <div className="content-wrapper">
                <div className="calculator-section">
                    <h1 className="page-title font-roboto">Paver Driveway Calculator</h1>
                    <div className="calculator-section1">
                        <h3>Project Dimensions</h3>
                        
                        <div className="input-group">
                            <label>
                                Width: <span className="required">*</span>
                                <div className="input-with-unit">
                                    <input
                                        type="number"
                                        value={projectDimensions.width || ''}
                                        onChange={(e) => {
                                            setProjectDimensions({
                                                ...projectDimensions,
                                                width: e.target.value ? parseFloat(e.target.value) : 0
                                            });
                                            if (errors.width) {
                                                setErrors({...errors, width: ''});
                                            }
                                        }}
                                        className={errors.width ? 'error' : ''}
                                        placeholder="Enter width"
                                    />
                                    <select 
                                        className="unit-select"
                                        value={projectDimensions.widthUnit}
                                        onChange={(e) => setProjectDimensions({
                                            ...projectDimensions,
                                            widthUnit: e.target.value as Unit
                                        })}
                                    >
                                        <option value="in">in</option>
                                        <option value="ft">ft</option>
                                        <option value="cm">cm</option>
                                        <option value="m">m</option>
                                        <option value="yd">yd</option>
                                    </select>
                                </div>
                                {errors.width && <span className="error-message">{errors.width}</span>}
                            </label>
                        </div>

                        <div className="input-group">
                            <label>
                                Length: <span className="required">*</span>
                                <div className="input-with-unit">
                                    <input
                                        type="number"
                                        value={projectDimensions.length || ''}
                                        onChange={(e) => {
                                            setProjectDimensions({
                                                ...projectDimensions,
                                                length: e.target.value ? parseFloat(e.target.value) : 0
                                            });
                                            if (errors.length) {
                                                setErrors({...errors, length: ''});
                                            }
                                        }}
                                        className={errors.length ? 'error' : ''}
                                        placeholder="Enter length"
                                    />
                                    <select 
                                        className="unit-select"
                                        value={projectDimensions.lengthUnit}
                                        onChange={(e) => setProjectDimensions({
                                            ...projectDimensions,
                                            lengthUnit: e.target.value as Unit
                                        })}
                                    >
                                        <option value="in">in</option>
                                        <option value="ft">ft</option>
                                        <option value="cm">cm</option>
                                        <option value="m">m</option>
                                        <option value="yd">yd</option>
                                    </select>
                                </div>
                                {errors.length && <span className="error-message">{errors.length}</span>}
                            </label>
                        </div>
                    </div>
                    
                    <div className="calculator-paver">
                        <br/>
                        <h3>Paver's Dimensions</h3>
                        
                        <div className="input-group">
                            <label>
                                Width: <span className="required">*</span>
                                <div className="input-with-unit">
                                    <input 
                                        type="number" 
                                        value={paverDimensions.width || ''} 
                                        onChange={(e) => {
                                            setPaverDimensions({
                                                ...paverDimensions,
                                                width: e.target.value ? parseFloat(e.target.value) : 0
                                            });
                                            if (errors.paverWidth) {
                                                setErrors({...errors, paverWidth: ''});
                                            }
                                        }} 
                                        className={errors.paverWidth ? 'error' : ''}
                                        placeholder="Enter paver width"
                                    />
                                    <select 
                                        value={paverDimensions.widthUnit} 
                                        onChange={(e) => setPaverDimensions({
                                            ...paverDimensions,
                                            widthUnit: e.target.value as Unit
                                        })}
                                        className="unit-select"
                                    >
                                        <option value="in">in</option>
                                        <option value="ft">ft</option>
                                        <option value="cm">cm</option>
                                        <option value="m">m</option>
                                        <option value="yd">yd</option>
                                    </select>
                                </div>
                                {errors.paverWidth && <span className="error-message">{errors.paverWidth}</span>}
                            </label>
                        </div>

                        <div className="input-group">
                            <label>
                                Length: <span className="required">*</span>
                                <div className="input-with-unit">
                                    <input 
                                        type="number" 
                                        value={paverDimensions.length || ''} 
                                        onChange={(e) => {
                                            setPaverDimensions({
                                                ...paverDimensions,
                                                length: e.target.value ? parseFloat(e.target.value) : 0
                                            });
                                            if (errors.paverLength) {
                                                setErrors({...errors, paverLength: ''});
                                            }
                                        }} 
                                        className={errors.paverLength ? 'error' : ''}
                                        placeholder="Enter paver length"
                                    />
                                    <select 
                                        value={paverDimensions.lengthUnit} 
                                        onChange={(e) => setPaverDimensions({
                                            ...paverDimensions,
                                            lengthUnit: e.target.value as Unit
                                        })}
                                        className="unit-select"
                                    >
                                        <option value="in">in</option>
                                        <option value="ft">ft</option>
                                        <option value="cm">cm</option>
                                        <option value="m">m</option>
                                        <option value="yd">yd</option>
                                    </select>
                                </div>
                                {errors.paverLength && <span className="error-message">{errors.paverLength}</span>}
                            </label>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>
                            <h4>Paver Price per piece (Optional):</h4>
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

                    <div className="input-group">
                        <label>
                            <h4>Cost of installation per sq ft (Optional):</h4>
                            <div className="price-input-container">
                                <input 
                                    type="number" 
                                    value={installationCost || ''} 
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setInstallationCost(value === '' ? 0 : parseFloat(value));
                                    }} 
                                    placeholder="0.00"
                                    className="price-input"
                                />
                                <span className="price-prefix">$</span>
                            </div>
                        </label>
                    </div>

                    <button className="calculate-button" onClick={calculatePavers}>Calculate</button>

                    <div className="result">
                        <h2>Dimensions</h2>
                        <p>Driveway Area: {formatNumber(calculateArea())} sq ft</p>
                        <p>Driveway Perimeter: {formatNumber(projectDimensions.length && projectDimensions.width ? 2 * (convertToFeet(projectDimensions.length, projectDimensions.lengthUnit) + convertToFeet(projectDimensions.width, projectDimensions.widthUnit)) : 0)} ft</p>
                    </div>

                    <div className="result">
                        <h2 className="text-xl font-semibold mb-4">Paver Estimate</h2>
                        <div className="space-y-2">
                            <p>Pavers per sq ft: {formatNumberOneDecimal(volumeInCubicYards?.paversPerSqFt ?? 0)}</p>
                            <p>Pavers: {formatNumberOneDecimal(volumeInCubicYards?.pavers ?? 0)} pieces</p>
                        </div>
                    </div>

                    <div className="result">
                        <h2 className="text-xl font-semibold mb-4">Estimated Material Cost</h2>
                        <div className="space-y-2">
                            <p>
                                Pavers Cost: {pricePerCubicYard === 0 ? 
                                    <span className="warning-text">Please enter Paver Price to calculate Pavers cost</span> : 
                                    `$${formatNumber(materialCosts?.pavers.custom ?? 0)}`
                                }
                            </p>
                            <p>
                                Total installation cost: {installationCost === 0 ? 
                                    <span className="warning-text">Please enter Cost of Installation to calculate installation cost</span> : 
                                    `$${formatNumber(totalInstallationCost)}`
                                }
                            </p>
                        </div>
                    </div>

                    <div className="result">
                        <h2>Estimated Total Cost</h2>
                        <h4 className="total-cost">${formatNumber(totalCost ?? 0)}</h4>
                        <p className="estimate-note">*Estimate only - costs vary by location/vendor</p>
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
                            <Link href="/asphalt" className="compare-button-clear">
                                <span>Compare to Asphalt</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14m-7-7l7 7-7 7"/>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="info-section">
                    <h2>How the Paver Driveway Calculator Works</h2>

                    <p className="info-paragraph">
                        The Paver Driveway Calculator is a simple, yet powerful tool designed to help you estimate the amount of pavers and base materials needed for your driveway project. Whether you're planning a new driveway or replacing an existing one, this calculator provides an accurate estimate based on the specific dimensions of your project.
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

                    <h3>Why Use the Paver Calculator?</h3>
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