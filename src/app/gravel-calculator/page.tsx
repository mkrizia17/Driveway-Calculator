"use client";

import React, { useState } from 'react';
import './GravelPage.css';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { metadata } from './metadata';

type Unit = 'in' | 'ft' | 'cm' | 'm' | 'yd';

export default function GravelPage() {
    const [width, setWidth] = useState<number>(0);
    const [length, setLength] = useState<number>(0);
    const [depth, setDepth] = useState<number>(6);
    const [pricePerCubicYard, setPricePerCubicYard] = useState<number>(65);
    const [totalCost, setTotalCost] = useState<number | null>(null);
    const [volumeInCubicYards, setVolumeInCubicYards] = useState<number | null>(null);
    const [tonsNeeded, setTonsNeeded] = useState<number | null>(null);
    const [widthUnit, setWidthUnit] = useState<Unit>('ft');
    const [lengthUnit, setLengthUnit] = useState<Unit>('ft');
    const [depthUnit, setDepthUnit] = useState<Unit>('in');
    const [errors, setErrors] = useState<{
        width: string;
        length: string;
        depth: string;
    }>({
        width: '',
        length: '',
        depth: ''
    });
    const [showPriceInfo, setShowPriceInfo] = useState<boolean>(false);
    const [showDepthInfo, setShowDepthInfo] = useState<boolean>(false);

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
        return Math.round(result * 100) / 100;  // Round to 2 decimal places
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
        return Math.round(result * 100) / 100;  // Round to 2 decimal places
    };

    const calculateGravel = () => {
        // Reset errors
        setErrors({
            width: '',
            length: '',
            depth: ''
        });

        // Validate inputs
        let hasErrors = false;
        const newErrors = {
            width: '',
            length: '',
            depth: ''
        };

        if (!width || width <= 0) {
            newErrors.width = 'Width is required and must be greater than 0';
            hasErrors = true;
        }

        if (!length || length <= 0) {
            newErrors.length = 'Length is required and must be greater than 0';
            hasErrors = true;
        }

        if (!depth || depth <= 0) {
            newErrors.depth = 'Depth is required and must be greater than 0';
            hasErrors = true;
        }

        if (hasErrors) {
            setErrors(newErrors);
            return;
        }

        // Convert all measurements to standard units (feet for length/width, inches for depth)
        const widthInFeet = convertToFeet(width, widthUnit);
        const lengthInFeet = convertToFeet(length, lengthUnit);
        const depthInInches = convertToInches(depth, depthUnit);
        
        // Convert feet to yards for length and width
        const widthYards = widthInFeet / 3;
        const lengthYards = lengthInFeet / 3;
        // Convert inches to yards for depth
        const depthYards = depthInInches / 36;
        
        // Calculate volume in cubic yards and round to 1 decimal place
        const calculatedVolume = Math.round((widthYards * lengthYards * depthYards) * 10) / 10;
        setVolumeInCubicYards(calculatedVolume);
        
        // Calculate tons based on rounded volume and round to 1 decimal place
        const calculatedTons = Math.round(calculatedVolume * 1.35 * 10) / 10;
        setTonsNeeded(calculatedTons);
        
        // Calculate cost and round to 2 decimal places
        const cost = pricePerCubicYard > 0 ? 
            Math.round(calculatedVolume * pricePerCubicYard * 100) / 100 : 0;
        setTotalCost(cost);
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

    const calculateArea = (): number => {
        if (!length || !width) return 0;

        // Convert both measurements to feet first
        const lengthInFeet = convertToFeet(length, lengthUnit);
        const widthInFeet = convertToFeet(width, widthUnit);
        
        // Calculate area in square feet
        return lengthInFeet * widthInFeet;
    };

    const calculatePricePerCubicFoot = (): number => {
        if (!pricePerCubicYard) return 0;
        return pricePerCubicYard / 27; // 1 cubic yard = 27 cubic feet
    };

    const calculatePricePerCubicInch = (): number => {
        if (!pricePerCubicYard) return 0;
        return pricePerCubicYard / 46656; // 1 cubic yard = 46,656 cubic inches
    };

    const calculatePricePerCubicCentimeter = (): number => {
        if (!pricePerCubicYard) return 0;
        return pricePerCubicYard / 764554.858; // 1 cubic yard = 764,554.858 cubic centimeters
    };

    const calculatePricePerCubicMeter = (): number => {
        if (!pricePerCubicYard) return 0;
        return pricePerCubicYard / 0.764555; // 1 cubic yard = 0.764555 cubic meters
    };

    return (
        <>
            <Header />
            <div className="gravel-page-container" style={{ fontFamily: '__Inter_d65c78, __Inter_Fallback_d65c78, sans-serif' }}>
                <div className="content-wrapper mt-8 px-4">
                    <div className="calculator-section">
                        <h1 className="page-title text-26px whitespace-nowrap">Gravel Driveway Calculator</h1>
                        <div className="input-group">
                            <label>
                                Width: <span className="required">*</span>
                                <div className="input-with-unit">
                                    <input 
                                        type="number" 
                                        value={width || ''} 
                                        onChange={(e) => {
                                            setWidth(e.target.value ? parseFloat(e.target.value) : 0);
                                            if (errors.width) {
                                                setErrors({...errors, width: ''});
                                            }
                                        }} 
                                        className={errors.width ? 'error' : ''}
                                        placeholder="Enter width"
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
                                {errors.width && <span className="error-message">{errors.width}</span>}
                            </label>
                        </div>
                        <div className="input-group">
                            <label>
                                Length: <span className="required">*</span>
                                <div className="input-with-unit">
                                    <input 
                                        type="number" 
                                        value={length || ''} 
                                        onChange={(e) => {
                                            setLength(e.target.value ? parseFloat(e.target.value) : 0);
                                            if (errors.length) {
                                                setErrors({...errors, length: ''});
                                            }
                                        }} 
                                        className={errors.length ? 'error' : ''}
                                        placeholder="Enter length"
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
                                {errors.length && <span className="error-message">{errors.length}</span>}
                            </label>
                        </div>
                        <div className="input-group">
                            <label>
                                Depth: <span className="required">*</span>
                                <span 
                                    className="info-icon cursor-pointer inline-block align-middle ml-1"
                                    title="Click for more information"
                                    onClick={() => setShowDepthInfo(!showDepthInfo)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm1 12H7V7h2v5zm0-6H7V4h2v2z"/>
                                    </svg>
                                </span>
                                <div className="input-with-unit">
                                    <input 
                                        type="number" 
                                        value={depth || ''} 
                                        onChange={(e) => {
                                            setDepth(e.target.value ? parseFloat(e.target.value) : 0);
                                            if (errors.depth) {
                                                setErrors({...errors, depth: ''});
                                            }
                                        }} 
                                        className={errors.depth ? 'error' : ''}
                                        placeholder="Enter depth"
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
                                {errors.depth && <span className="error-message">{errors.depth}</span>}
                                {showDepthInfo && (
                                    <>
                                        <br />
                                        <p className="text-sm text-gray-400 mt-2">
                                            For our calculations, we use a gravel depth of 6 inches, with the typical range being 4 to 6 inches. However, you can adjust the depth as needed depending on the type of gravel used.
                                        </p>
                                    </>
                                )}
                            </label>
                        </div>
                        <div className="input-group">
                            <label>
                                Price per Cubic Yard:
                                <span 
                                    className="info-icon cursor-pointer inline-block align-middle ml-1"
                                    title="Click for more information"
                                    onClick={() => setShowPriceInfo(!showPriceInfo)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm1 12H7V7h2v5zm0-6H7V4h2v2z"/>
                                    </svg>
                                </span>
                                <div className="price-input-container">
                                    <input 
                                        type="number" 
                                        value={pricePerCubicYard} 
                                        onChange={(e) => setPricePerCubicYard(parseFloat(e.target.value))} 
                                        placeholder="65"
                                        className="price-input"
                                    />
                                    <span className="price-prefix">$</span>
                                </div>
                                {showPriceInfo && (
                                    <>
                                        <br />
                                        <p className="text-sm text-gray-400 mt-2">
                                            For our calculations, we use an average gravel price of $65 per cubic yard, with typical local prices ranging from $20 to $100. We recommend confirming rates with local suppliers for the most accurate estimate.
                                        </p>
                                    </>
                                )}
                            </label>
                        </div>
                        <button className="calculate-button" onClick={calculateGravel}>Calculate</button>

                        <div className="result">
                            <p style={{ fontWeight: 'bold', fontSize: '20px' }}>Dimensions</p>
                            <p>Driveway Area: {formatNumber(calculateArea())} sq ft</p>
                            <p>Driveway Perimeter: {formatNumber(length && width ? 2 * (convertToFeet(length, lengthUnit) + convertToFeet(width, widthUnit)) : 0)} ft</p>
                            <p>Volume: {formatNumberOneDecimal(volumeInCubicYards ?? 0)} cubic yards</p>
                            <p>Weight: {formatNumberOneDecimal(tonsNeeded ?? 0)} tons</p>
                        </div>

                        <div className="result">
                            <p style={{ fontWeight: 'bold', fontSize: '20px' }}>Cost Breakdown</p>
                            <p>Price per Cubic Yard: ${formatNumber(pricePerCubicYard ?? 0)}</p>
                            <p>Price per Cubic Foot: ${formatNumber(calculatePricePerCubicFoot())}</p>
                            <p>Price per Cubic Inch: ${formatNumber(calculatePricePerCubicInch())}</p>
                            <p>Price per Cubic Centimeter: ${formatNumber(calculatePricePerCubicCentimeter())}</p>
                            <p>Price per Cubic Meter: ${formatNumber(calculatePricePerCubicMeter())}</p>
                        </div>

                        <div className="result">
                            <p style={{ fontWeight: 'bold', fontSize: '20px' }}>Estimated Total Cost</p>
                            {(!pricePerCubicYard || pricePerCubicYard <= 0) ? (
                                <p className="warning-text">Please enter Price per Cubic Yard to calculate total cost</p>
                            ) : (
                                <>
                                    <h4 className="total-cost" style={{ fontWeight: 'bold', fontSize: '24px' }}>${formatNumber(totalCost ?? 0)}</h4>
                                    <p className="estimate-note">Estimate only – weight varies by material</p>
                                </>
                            )}
                        </div>

                        <div className="compare-section">
                            <div className="compare-buttons">
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
                                <Link href="/paver-calculator" className="compare-button-clear">
                                    <span>Compare to Paver</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14m-7-7l7 7-7 7"/>
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="info-section">
                        <h2>How the Gravel Driveway Calculator Works</h2>
                        <p className="info-paragraph">
                            The Gravel Driveway Calculator is a simple, yet powerful tool designed to help you estimate the amount of gravel needed for your driveway project. Whether you're planning a new driveway or refreshing an existing one, this calculator provides an accurate estimate based on the specific dimensions of your project.
                        </p>
                        <div className="info-image-container">
                            <Image 
                                src="/images/gravel.jpg" 
                                alt="Gravel driveway with clean edges" 
                                fill
                                sizes="(max-width: 768px) 100vw,
                                       (max-width: 1200px) 80vw,
                                       70vw"
                                priority
                                className="info-image"
                            />
                        </div>
                        <h3>Key Inputs Required:</h3>
                        <p className="info-paragraph">
                            Length of the Driveway: This is the total distance you want to cover with gravel. Measure the driveway's length in feet.
                        </p>
                        <p className="info-paragraph">
                            Width of the Driveway: Measure how wide your driveway will be in feet. This is typically the most variable measurement, as driveways can vary in size depending on your needs.
                        </p>
                        <p className="info-paragraph">
                            Gravel Depth: Choose the depth or thickness of the gravel layer. This is often measured in inches and typically ranges from 4 to 6 inches for residential driveways.
                        </p>

                        <h3>How the Calculator Works:</h3>
                        <p className="info-paragraph">
                            Gravel is a popular and budget-friendly choice for driveways, offering durability, aesthetic appeal, and resistance to weeds. However, maintaining a gravel driveway requires periodic replenishment as the material tends to migrate over time. If you’re planning to build or maintain a gravel driveway, knowing how to estimate the amount of gravel required is essential.
                        </p>
                        <p className="info-paragraph">
                            Our calculator can help you estimate the amount of material needed for your project, whether you're adding new layers or replenishing an existing driveway. Gravel is typically sold by the cubic yard or ton, so understanding how to calculate these measurements is key.
                        </p>
                        <h4>Step 1: Calculate the Volume in Cubic Yards</h4>
                        <p className="info-paragraph">
                            To determine the gravel volume required, measure the length, width, and depth of the driveway in yards. If your measurements are in feet, divide each by 3 to convert to yards. If the depth is in inches, divide it by 36 to convert to yards.
                        </p>
                        <p className="info-paragraph">
                            Use the formula: Length × Width × Depth = Volume (in cubic yards)
                        </p>
                        <p className="info-paragraph">
                            For example, if your driveway is 30 feet long, 12 feet wide, and 18 inches deep:
                        </p>
                        <ul className="info-list">
                            <li>Convert measurements: 30 ÷ 3 = 10 yards (length), 12 ÷ 3 = 4 yards (width), and 18 ÷ 36 = 0.5 yards (depth).</li>
                            <li>Multiply: 10 × 4 × 0.5 = 20 cubic yards</li>
                        </ul>
                        <h4>Step 2: Consider Layering</h4>
                        <p className="info-paragraph">
                            A well-constructed gravel driveway typically includes three layers:
                        </p>
                        <ul className="info-list">
                            <li>Sub-base Layer: 6 inches deep, made of larger gravel like #3 crushed stone (up to 2 inches in size).</li>
                            <li>Base Layer: 6 inches deep, often using #57 crushed stone (golf ball-sized, rough and round).</li>
                            <li>Surface Layer: 4 to 6 inches deep, composed of finer and more decorative gravel such as pea gravel, river rocks, or marble chips.</li>
                        </ul>
                        <p className="info-paragraph">
                            Calculate the volume for each layer separately, and if you are building a new driveway, add up the totals for all layers.
                        </p>
                        <p className="info-paragraph">
                            For example, if each layer is 6 inches (0.5 yards) deep: 10 × 4 × 0.5 = 20 cubic yards per layer. For three layers, multiply: 20 × 3 = 60 cubic yards total.
                        </p>
                        <h4>Step 3: Convert to Tons (If Necessary)</h4>
                        <p className="info-paragraph">
                            If gravel is sold by weight, convert cubic yards to tons using the conversion factor: 1 cubic yard = 1.35 tons
                        </p>
                        <p className="info-paragraph">
                            For instance, if you need 20 cubic yards: 20 × 1.35 = 27 tons
                        </p>
                        <h4>Step 4: Account for Waste</h4>
                        <p className="info-paragraph">
                            To avoid running short, order about 10% more material than calculated to account for spillage or shifting during transport.
                        </p>
                        <p className="info-paragraph">
                            For example, if you need 20 cubic yards: 20 × 1.1 = 22 cubic yards
                        </p>
                        <h4>Additional Considerations</h4>
                        <ul className="info-list">
                            <li>Different gravel types have varying weights and volumes per ton. Smaller gravel compacts more tightly and may require less material for the same coverage.</li>
                            <li>For wet or rainy climates, ensure your base layers facilitate proper drainage to avoid driveway damage.</li>
                        </ul>
                        <p className="info-paragraph">
                            Let Our Calculator Do the Work
                        </p>
                        <p className="info-paragraph">
                            Save time and effort with our gravel driveway calculator! Input your driveway dimensions, and we’ll handle the math, providing an accurate estimate of the material required in cubic yards or tons.
                        </p>
                        <p className="info-paragraph">
                            Make sure to explore your gravel options and choose the layers best suited for your area’s conditions. Proper planning and material selection will ensure your gravel driveway looks great and stands the test of time!
                        </p>

                        <h3>Why Use the Concrete Calculator?</h3>
                        <p className="info-paragraph">
                            <strong>Accurate Estimates:</strong> This tool helps ensure that you order the right amount of concrete, reducing the risk of over- or under-ordering.
                        </p>
                        <p className="info-paragraph">
                            <strong>Cost Efficiency:</strong> With accurate volume calculations, you can more efficiently estimate the costs for materials, labor, and any additional requirements for your project.
                        </p>
                        <p className="info-paragraph">
                            <strong>Convenience:</strong> By inputting simple measurements, you get an immediate estimate of the concrete needed, saving you time and effort in planning your driveway project.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
} 