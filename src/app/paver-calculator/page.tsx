"use client";

import React, { useState, useEffect } from 'react';
import '../gravel-calculator/GravelPage.css';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

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

    const [pricePerCubicYard, setPricePerCubicYard] = useState<number>(0.60);
    const [totalCost, setTotalCost] = useState<number | null>(null);
    const [materialCosts, setMaterialCosts] = useState<{
        pavers: {min: number, max: number, custom?: number},
        gravel: {min: number, max: number},
        sand: {min: number, max: number},
        polymericSand: {min: number, max: number}
    } | null>(null);
    const [installationCost, setInstallationCost] = useState<number>(13);
    const [totalInstallationCost, setTotalInstallationCost] = useState<number>(0);
    const [volumeInCubicYards, setVolumeInCubicYards] = useState<VolumeInCubicYards | null>(null);
    const [calculationAttempted, setCalculationAttempted] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [showPaverPriceInfo, setShowPaverPriceInfo] = useState<boolean>(false);
    const [showInstallationCostInfo, setShowInstallationCostInfo] = useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

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

        // Calculate Pavers per Square Foot
        const paversPerSqFt = paverSquareFootage > 0 ? 1 / paverSquareFootage : 0;

        // Calculate Base Materials for Material Estimate
        const area = widthInFeet * lengthInFeet;
        const depth = 0.4;
        const gravelCubicYards = (area * depth) / 27;
        const roundedGravelCubicYards = Number(gravelCubicYards.toFixed(2));

        // Calculate Base Sand Volume
        const sandDepth = 1/12; // 1 inch = 1/12 foot
        const sandCubicYards = (area * sandDepth) / 27; // (144 * 1/12) / 27 = 0.44
        const roundedSandCubicYards = Number(sandCubicYards.toFixed(2));

        // Calculate Polymeric Sand Bags Range
        const minCoveragePerBag = 50; // Maximum coverage: 75 sq ft per bag
        const maxCoveragePerBag = 100; // Minimum coverage: 50 sq ft per bag
        const minBags = Math.ceil(area / maxCoveragePerBag);
        const maxBags = Math.ceil(area / minCoveragePerBag);
        const polymericSandCost = maxBags * 25; // $25 per bag

        const paverCost = totalPaversNeeded * (pricePerCubicYard || 0);
        const gravelCost = Math.round(roundedGravelCubicYards * 45); // $45 per cubic yard
        const sandCost = sandCubicYards * 15; // $15 per cubic yard

        const calculatedInstallationCost = installationCost * area;
        setTotalInstallationCost(calculatedInstallationCost);
        setTotalCost(paverCost + calculatedInstallationCost);

        setMaterialCosts({
            pavers: { min: paverCost, max: paverCost, custom: paverCost },
            gravel: { min: gravelCost, max: gravelCost },
            sand: { min: sandCost, max: sandCost },
            polymericSand: { min: polymericSandCost, max: polymericSandCost }
        });

        // Update the display in the Estimated Material Cost section:
        setVolumeInCubicYards({
            gravel: roundedGravelCubicYards,
            sand: roundedSandCubicYards,
            polymericSand: `${minBags}-${maxBags} bags`,
            paversPerSqFt: paversPerSqFt,
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
        <div className="min-h-screen bg-gray-800 flex flex-col">
            <Header />
            <main className="flex-1">
                <div className="gravel-page-container font-roboto">
                    <div className="content-wrapper">
                        <div className="calculator-section">
                            <h1 className="page-title text-26px whitespace-nowrap">Paver Driveway Calculator</h1>
                            <div className="calculator-section1">
                                <h3 style={{ fontWeight: 'bold', fontSize: '20px' }}>Project Dimensions</h3>
                                
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
                                <h3 style={{ fontWeight: 'bold', fontSize: '20px' }}>Paver's Dimensions</h3>
                                
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
                                    <h4 style={{ display: 'inline', marginRight: '5px' }}>Paver Price per piece:</h4>
                                    <span 
                                        className="info-icon cursor-pointer inline-block align-middle"
                                        title="Click for more information"
                                        style={{ display: 'inline-block', verticalAlign: 'middle' }}
                                        onClick={() => setShowPaverPriceInfo(!showPaverPriceInfo)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm1 12H7V7h2v5zm0-6H7V4h2v2z"/>
                                        </svg>
                                    </span>
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
                                    {showPaverPriceInfo && (
                                        <>
                                            <br />
                                            <p className="text-sm text-gray-400 mt-2">
                                            For our calculations, we use an average price of $0.60 per brick for brick pavers, with typical prices ranging from $0.35 to $0.90 per brick or $2 to $6 per square foot, excluding installation. Prices may vary depending on the material used, such as clay brick, concrete, stone, slate, or cobblestone. We recommend checking with local suppliers for the most accurate estimate of paver prices.
                                            </p>
                                        </>
                                    )}
                                </label>
                            </div>

                            <div className="input-group">
                                <label>
                                    <h4 style={{ display: 'inline', marginRight: '5px' }}>Cost of installation per sq ft:</h4>
                                    <span 
                                        className="info-icon cursor-pointer inline-block align-middle"
                                        title="Click for more information"
                                        style={{ display: 'inline-block', verticalAlign: 'middle' }}
                                        onClick={() => setShowInstallationCostInfo(!showInstallationCostInfo)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm1 12H7V7h2v5zm0-6H7V4h2v2z"/>
                                        </svg>
                                    </span>
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
                                    {showInstallationCostInfo && (
                                        <>
                                            <br />
                                            <p className="text-sm text-gray-400 mt-2">
                                            We use an average of $13 per square foot for installation, with typical installation costs ranging from $10 to $17 per square foot. We recommend checking with local suppliers for the most accurate estimate of installation costs.
                                            </p>
                                        </>
                                    )}
                                </label>
                            </div>

                            <button className="calculate-button" onClick={() => {
                                setCalculationAttempted(true);
                                calculatePavers();
                            }}>Calculate</button>

                            <div className="result">
                                <p style={{ fontWeight: 'bold', fontSize: '20px' }}>Dimensions</p>
                                <p>Driveway Area: {formatNumber(calculateArea())} sq ft</p>
                                <p>Driveway Perimeter: {formatNumber(projectDimensions.length && projectDimensions.width ? 2 * (convertToFeet(projectDimensions.length, projectDimensions.lengthUnit) + convertToFeet(projectDimensions.width, projectDimensions.widthUnit)) : 0)} ft</p>
                            </div>

                            <div className="result">
                                <p style={{ fontWeight: 'bold', fontSize: '20px' }}>Paver Estimate</p>
                                <p>Pavers per sq ft: {formatNumberOneDecimal(volumeInCubicYards?.paversPerSqFt ?? 0)}</p>
                                <p>Pavers: {formatNumberOneDecimal(volumeInCubicYards?.pavers ?? 0)} pieces</p>
                            </div>

                            <div className="result">
                                <p style={{ fontWeight: 'bold', fontSize: '20px' }}>Estimated Material Cost</p>
                                <div className="space-y-2">
                                    <p>
                                        Pavers Cost: {pricePerCubicYard === 0 ? 
                                            <span className="warning-text">Please enter Paver Price to calculate Pavers cost</span> : 
                                            `$${formatNumber(materialCosts?.pavers.custom ?? 0)}`
                                        }
                                    </p>
                                    <p>
                                        Total installation cost: {installationCost === 0 && isMounted && calculationAttempted ? 
                                            <span className="warning-text">Please enter Cost of Installation to calculate installation cost</span> : 
                                            `$${formatNumber(totalInstallationCost)}`
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="result">
                                <p style={{ fontWeight: 'bold', fontSize: '20px' }}>Estimated Total Cost</p>
                                {(!pricePerCubicYard || pricePerCubicYard <= 0) ? (
                                    <p className="warning-text">Please enter Paver Price to calculate total cost</p>
                                ) : (
                                    <>
                                        <h4 className="total-cost" style={{ fontWeight: 'bold', fontSize: '24px' }}>${formatNumber(totalCost ?? 0)}</h4>
                                        <p className="estimate-note">*Estimate only - costs vary by location/vendor</p>
                                    </>
                                )}
                            </div>

                            <div className="compare-section">
                                <div className="compare-buttons">
                                    <Link href="/gravel-calculator" className="compare-button-clear">
                                        <span>Compare to Gravel</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14m-7-7l7 7-7 7"/>
                                        </svg>
                                    </Link>
                                    <Link href="/concrete-calculator" className="compare-button-clear">
                                        <span>Compare to Concrete</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14m-7-7l7 7-7 7"/>
                                        </svg>
                                    </Link>
                                    <Link href="/asphalt-calculator" className="compare-button-clear">
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
                                    alt="Paver driveway" 
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
                            Paver Dimensions: The size of each individual paver is essential for calculating how many pavers you will need. Measure the length, width, and thickness of the pavers you plan to use in inches or feet.
                            </p>

                            <h3>How the Calculator Works:</h3>
                            <p className="info-paragraph">
                                Using our paver calculator is quick and straightforward. Follow these steps to plan your project efficiently:
                            </p>

                            <h4>Step 1: Calculate the Patio Area</h4>
                            <ul className="info-list">
                                <li>Single Rectangle: If your patio is rectangular, simply input its length and width to calculate the total area.</li>
                                <li>Irregular Shape: For irregular patios, divide the area into smaller rectangles and calculate each separately. Then, sum the areas to get the total. Use our Square Footage Calculator for a quick estimate.</li>
                                <li>Tip: If the subareas vary in size, calculate them individually and sum up the results.</li>
                            </ul>

                            <h4>Step 2: Enter Paver Brick Dimensions</h4>
                            <p className="info-paragraph">
                                Input the dimensions of a single paver brick—its width and length. This will help calculate the area each paver covers. Refer to the Common Paver Sizes table below for typical dimensions.
                            </p>

                            <h4>Step 3: Get the Paver Requirements</h4>
                            <p className="info-paragraph">
                                The calculator will determine:
                            </p>
                            <ul className="info-list">
                                <li>Number of pavers per square foot: Based on the size of a single brick.</li>
                                <li>Total pavers needed: The total number of pavers required to cover your patio area.</li>
                            </ul>

                            <h4>Step 4: Estimate Costs</h4>
                            <ul className="info-list">
                                <li>Paver Cost: Enter the price of a single paver to calculate the total material cost. Typical rates range between $0.35 to $0.90 per brick or $2 to $6 per square foot, depending on your location.</li>
                                <li>Installation Cost: Add the professional installation cost per square foot. Typical rates range between $10 to $17, depending on your location.</li>
                            </ul>

                            <h4>Common Paver Sizes</h4>
                            <table className="paver-sizes-table" style={{ fontSize: '16px' }}>
                                <thead>
                                    <tr>
                                        <th style={{ color: '#333333', textAlign: 'center' }}>Size (in)</th>
                                        <th style={{ color: '#333333', textAlign: 'center' }}>Size (cm)</th>
                                        <th style={{ color: '#333333', textAlign: 'center' }}>Area (ft²)</th>
                                        <th style={{ color: '#333333', textAlign: 'center' }}>Area (cm²)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td>4 × 8</td><td>10 × 20</td><td>0.22</td><td>200</td></tr>
                                    <tr><td>6 × 6</td><td>15 × 15</td><td>0.25</td><td>225</td></tr>
                                    <tr><td>6 × 9</td><td>15 × 23</td><td>0.38</td><td>245</td></tr>
                                    <tr><td>8 × 8</td><td>20 × 20</td><td>0.44</td><td>400</td></tr>
                                    <tr><td>12 × 12</td><td>30 × 30</td><td>1.00</td><td>900</td></tr>
                                    <tr><td>14 × 14</td><td>36 × 36</td><td>1.36</td><td>1296</td></tr>
                                    <tr><td>12 × 18</td><td>30 × 46</td><td>1.50</td><td>1380</td></tr>
                                </tbody>
                            </table>

                            <h4>Additional Costs to Consider</h4>
                            <h5>1. Base Materials for Paver Installation</h5>
                            <p className="info-paragraph">
                                A solid base is critical for long-term durability. Most installations require:
                            </p>
                            <ul className="info-list">
                                <li>4" to 6" of compacted gravel</li>
                                <li>1" layer of sand</li>
                            </ul>

                            <h5>2. Polymeric Sand</h5>
                            <p className="info-paragraph">
                                Used to lock pavers together and prevent weed growth between joints.
                                A 50 lb bag typically covers 25–50 square feet.
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
            </main>
            <Footer />
        </div>
    );
} 