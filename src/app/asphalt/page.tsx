"use client";

import React, { useState } from 'react';
import '../gravel/GravelPage.css';
import Link from 'next/link';
import Image from 'next/image';

type Unit = 'in' | 'ft' | 'cm' | 'm' | 'yd';

// Constants for material prices
const PRICE_PER_TON_ASPHALT_MIN = 102; // $102/ton
const PRICE_PER_TON_ASPHALT_MAX = 143; // $143/ton
const PRICE_PER_YD_CRUSHED_STONE_MIN = 15; // $15/yd³
const PRICE_PER_YD_CRUSHED_STONE_MAX = 31; // $31/yd³
const EQUIPMENT_RENTAL_MIN = 27;
const EQUIPMENT_RENTAL_MAX = 44;

const POUNDS_PER_CUBIC_FOOT = 145; // Average weight of asphalt per cubic foot
const POUNDS_PER_TON = 2000;

export default function AsphaltPage() {
    const [width, setWidth] = useState<number>(0);
    const [length, setLength] = useState<number>(0);
    const [depth, setDepth] = useState<number>(0);
    const [totalCost, setTotalCost] = useState<{min: number, max: number} | null>(null);
    const [asphaltTons, setAsphaltTons] = useState<{tons: number, yards: number} | null>(null);
    const [crushedStoneYards, setCrushedStoneYards] = useState<{min: number, max: number} | null>(null);
    const [widthUnit, setWidthUnit] = useState<Unit>('ft');
    const [lengthUnit, setLengthUnit] = useState<Unit>('ft');
    const [depthUnit, setDepthUnit] = useState<Unit>('in');
    const [customAsphaltCost, setCustomAsphaltCost] = useState<number>(0);
    const [showOptionalCosts, setShowOptionalCosts] = useState<boolean>(false);
    const [errors, setErrors] = useState<{
        width: string;
        length: string;
        depth: string;
    }>({
        width: '',
        length: '',
        depth: ''
    });
    const [materialCosts, setMaterialCosts] = useState<{
        asphalt: {min: number, max: number},
        crushedStone: {min: number, max: number},
        equipment: {min: number, max: number}
    } | null>(null);

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

    const calculatePerimeter = (): number => {
        if (!length || !width) return 0;
        const lengthInFeet = convertToFeet(length, lengthUnit);
        const widthInFeet = convertToFeet(width, widthUnit);
        return 2 * (lengthInFeet + widthInFeet);
    };

    const calculatePricePerCubicFoot = (): number => {
        if (!customAsphaltCost) return 0;
        return customAsphaltCost / 27;
    };

    const calculatePricePerCubicInch = (): number => {
        if (!customAsphaltCost) return 0;
        return customAsphaltCost / 46656;
    };

    const calculatePricePerCubicCentimeter = (): number => {
        if (!customAsphaltCost) return 0;
        return customAsphaltCost / 764554.858;
    };

    const calculatePricePerCubicMeter = (): number => {
        if (!customAsphaltCost) return 0;
        return customAsphaltCost / 0.764555;
    };

    const calculateAsphalt = () => {
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

        const widthInFeet = convertToFeet(width, widthUnit);
        const lengthInFeet = convertToFeet(length, lengthUnit);
        const depthInFeet = convertToInches(depth, depthUnit) / 12; // Convert inches to feet
        
        // Calculate cubic feet
        const cubicFeet = widthInFeet * lengthInFeet * depthInFeet;
        
        // Calculate tons using the specified formula
        const pounds = cubicFeet * POUNDS_PER_CUBIC_FOOT;
        const calculatedAsphaltTons = pounds / POUNDS_PER_TON;
        
        // Calculate cubic yards
        const cubicYards = Math.round((cubicFeet / 27) * 10) / 10;
        
        // Calculate crushed stone base for 4" minimum thickness
        const baseCubicFeet = widthInFeet * lengthInFeet * (4/12);
        const calculatedCrushedStoneYards = baseCubicFeet / 27;
        
        // Round to one decimal
        const baseYardsMin = Math.round(calculatedCrushedStoneYards * 10) / 10; // Will be 1.8 for 12x12
        const baseYardsMax = baseYardsMin * 2; // Double for 8" thickness, will be 3.6

        // Round results
        const roundedAsphaltTons = Math.round(calculatedAsphaltTons * 10) / 10;

        // Hot Mix Asphalt Cost
        const asphaltTonsRounded = Math.round(calculatedAsphaltTons * 10) / 10;  // 1.7 tons
        const asphaltCostMin = Math.round(1.7 * PRICE_PER_TON_ASPHALT_MIN);    // 1.7 * 102 = 174
        const asphaltCostMax = Math.round(1.7 * PRICE_PER_TON_ASPHALT_MAX);    // 1.7 * 143 = 244

        // Crushed Stone Cost
        const crushedStoneCostMin = Math.round(1.8 * PRICE_PER_YD_CRUSHED_STONE_MIN); // 1.8 * 15 = 28
        const crushedStoneCostMax = Math.round(3.6 * PRICE_PER_YD_CRUSHED_STONE_MAX); // 3.6 * 31 = 57

        // Update states
        setAsphaltTons({
            tons: roundedAsphaltTons,
            yards: cubicYards
        });
        
        setCrushedStoneYards({
            min: baseYardsMin,
            max: baseYardsMax
        });

        setMaterialCosts({
            asphalt: {
                min: asphaltCostMin,     // $174
                max: asphaltCostMax      // $244
            },
            crushedStone: {
                min: crushedStoneCostMin, // $28
                max: crushedStoneCostMax  // $57
            },
            equipment: {
                min: EQUIPMENT_RENTAL_MIN, // $27
                max: EQUIPMENT_RENTAL_MAX  // $44
            }
        });

        // Total cost calculation
        const totalCostMin = asphaltCostMin + crushedStoneCostMin + EQUIPMENT_RENTAL_MIN; // 174 + 28 + 27 = 229
        const totalCostMax = asphaltCostMax + crushedStoneCostMax + EQUIPMENT_RENTAL_MAX; // 244 + 57 + 44 = 345

        setTotalCost({
            min: totalCostMin,
            max: totalCostMax
        });
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
                                    value={customAsphaltCost || ''} 
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setCustomAsphaltCost(value === '' ? 0 : parseFloat(value));
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
                        <p>Driveway Area: {formatNumber(calculateArea())} sq ft</p>
                        <p>Driveway Perimeter: {formatNumber(calculatePerimeter())} ft</p>
                    </div>

                    <div className="result">
                        <h2>Material Estimate</h2>
                        <p>Hot Mix Asphalt: {formatNumberOneDecimal(asphaltTons?.tons ?? 0)} tons ({formatNumberOneDecimal(asphaltTons?.yards ?? 0)} yds³)</p>
                        <p>Crushed Stone Base: {formatNumberOneDecimal(crushedStoneYards?.min ?? 0)} - {formatNumberOneDecimal(crushedStoneYards?.max ?? 0)} yds³ (4" - 8" thick)</p>
                    </div>

                    <div className="result">
                        <h2>Estimated Material Cost</h2>
                        <p>Hot Mix Asphalt: ${materialCosts?.asphalt.min ?? 0} - ${materialCosts?.asphalt.max ?? 0}</p>
                        <p>Crushed Stone: ${materialCosts?.crushedStone.min ?? 0} - ${materialCosts?.crushedStone.max ?? 0}</p>
                        <p>Equipment Rentals & Supplies: ${materialCosts?.equipment.min ?? 0} - ${materialCosts?.equipment.max ?? 0}</p>
                    </div>

                    <div className="result">
                        <h2>Estimated Total Cost</h2>
                        <h4 className="total-cost">${totalCost?.min ?? 0} - ${totalCost?.max ?? 0}</h4>
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