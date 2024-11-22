"use client";

import React, { useState } from 'react';
import '../gravel/GravelPage.css';
import Link from 'next/link';
import Image from 'next/image';

type Unit = 'in' | 'ft' | 'cm' | 'm' | 'yd';

const PRICE_PER_CUBIC_YARD_CONCRETE = 125;
const PRICE_PER_CUBIC_YARD_GRAVEL = 16;
const PRICE_PER_LINEAR_FOOT_REBAR = 0.75;
const PRICE_PER_LINEAR_FOOT_FORM = 0.50;
const PRICE_PER_STAKE = 0.50;

export default function ConcretePage() {
    const [width, setWidth] = useState<number>(0);
    const [length, setLength] = useState<number>(0);
    const [depth, setDepth] = useState<number>(0);
    const [totalCost, setTotalCost] = useState<number | null>(null);
    const [volumeInCubicYards, setVolumeInCubicYards] = useState<number | null>(null);
    const [widthUnit, setWidthUnit] = useState<Unit>('ft');
    const [lengthUnit, setLengthUnit] = useState<Unit>('ft');
    const [depthUnit, setDepthUnit] = useState<Unit>('in');
    const [customConcreteCost, setCustomConcreteCost] = useState<number>(0);
    const [customGravelCost, setCustomGravelCost] = useState<number>(0);
    const [customRebarCost, setCustomRebarCost] = useState<number>(0);
    const [customFormCost, setCustomFormCost] = useState<number>(0);
    const [customStakeCost, setCustomStakeCost] = useState<number>(0);
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

    const calculateConcretePrice = (): number => {
        const pricePerYard = customConcreteCost > 0 ? customConcreteCost : PRICE_PER_CUBIC_YARD_CONCRETE;
        return (volumeInCubicYards ?? 0) * pricePerYard;
    };

    const calculateGravelVolume = (): number => {
        const lengthInFeet = convertToFeet(length, lengthUnit);
        const widthInFeet = convertToFeet(width, widthUnit);
        
        // Calculate volume in cubic feet (using 4" = 1/3 ft thickness)
        const volumeInCubicFeet = lengthInFeet * widthInFeet * (4/12);
        
        // Convert to cubic yards (27 cubic feet = 1 cubic yard)
        return Math.round((volumeInCubicFeet / 27) * 10) / 10;
    };

    const calculateGravelPrice = (): number => {
        const pricePerYard = customGravelCost > 0 ? customGravelCost : PRICE_PER_CUBIC_YARD_GRAVEL;
        return calculateGravelVolume() * pricePerYard;
    };

    const calculateRebarLength = (): number => {
        // Convert measurements to feet
        const lengthInFeet = convertToFeet(length, lengthUnit);
        const widthInFeet = convertToFeet(width, widthUnit);
        
        // Calculate number of rows and columns (one every 12")
        const numberOfRows = Math.ceil(widthInFeet) + 1;  // Add 1 for extra row
        const numberOfColumns = Math.ceil(lengthInFeet) + 1;  // Add 1 for extra column
        
        // Calculate total rebar length
        // Rows: number of rows × length
        const rowLength = numberOfRows * lengthInFeet;
        // Columns: number of columns × width
        const columnLength = numberOfColumns * widthInFeet;
        
        // Total length is sum of rows and columns
        return Math.ceil(rowLength + columnLength);
    };

    const calculateRebarPrice = (): number => {
        const pricePerFoot = customRebarCost > 0 ? customRebarCost : PRICE_PER_LINEAR_FOOT_REBAR;
        return calculateRebarLength() * pricePerFoot;
    };

    const calculateFormPrice = (): number => {
        const pricePerFoot = customFormCost > 0 ? customFormCost : PRICE_PER_LINEAR_FOOT_FORM;
        const perimeterInFeet = 2 * (convertToFeet(length, lengthUnit) + convertToFeet(width, widthUnit));
        return perimeterInFeet * pricePerFoot;
    };

    const calculateFormStakes = (): number => {
        const lengthInFeet = convertToFeet(length, lengthUnit);
        const widthInFeet = convertToFeet(width, widthUnit);
        
        // Calculate perimeter
        const perimeter = 2 * (lengthInFeet + widthInFeet);
        
        // Place stakes every 3 inches (4 stakes per foot)
        return Math.ceil(perimeter * 3);
    };

    const calculateFormStakePrice = (): number => {
        const pricePerStake = customStakeCost > 0 ? customStakeCost : PRICE_PER_STAKE;
        return calculateFormStakes() * pricePerStake;
    };

    const calculateConcrete = () => {
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

        // Calculate all values first before updating state
        const widthInFeet = convertToFeet(width, widthUnit);
        const lengthInFeet = convertToFeet(length, lengthUnit);
        const depthInInches = convertToInches(depth, depthUnit);
        
        const widthYards = widthInFeet / 3;
        const lengthYards = lengthInFeet / 3;
        const depthYards = depthInInches / 36;
        
        const calculatedVolume = Math.round((widthYards * lengthYards * depthYards) * 10) / 10;
        
        // Calculate total cost using the calculated volume directly
        const concreteCost = calculatedVolume * (customConcreteCost > 0 ? customConcreteCost : PRICE_PER_CUBIC_YARD_CONCRETE);
        const gravelCost = calculateGravelPrice();
        const rebarCost = calculateRebarPrice();
        const formCost = calculateFormPrice();
        const stakeCost = calculateFormStakePrice();
        
        const totalMaterialCost = concreteCost + gravelCost + rebarCost + formCost + stakeCost;
        
        // Update all states at once
        setVolumeInCubicYards(calculatedVolume);
        setTotalCost(Math.round(totalMaterialCost * 100) / 100);
    };

    // Add a function to round to whole numbers
    const formatWholeNumber = (num: number): string => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(Math.round(num));
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
                    <h1 className="page-title font-roboto">Concrete Driveway Calculator</h1>
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
                        </label>
                    </div>
                    <div className="result">
                        <button 
                            className="toggle-button" 
                            onClick={() => setShowOptionalCosts(!showOptionalCosts)}
                        >
                            <h3 className="toggle-header">
                                Optional Material Costs <span className="toggle-arrow">{showOptionalCosts ? '▼' : '▶'}</span>
                            </h3>
                        </button>
                        
                        {showOptionalCosts && (
                            <div className="optional-costs">
                                <div className="input-group">
                                    <label>
                                        Concrete (per yd³):
                                        <div className="price-input-container">
                                            <input 
                                                type="number" 
                                                value={customConcreteCost || ''} 
                                                onChange={(e) => setCustomConcreteCost(e.target.value === '' ? 0 : parseFloat(e.target.value))} 
                                                placeholder={PRICE_PER_CUBIC_YARD_CONCRETE.toString()}
                                                className="price-input"
                                            />
                                            <span className="price-prefix">$</span>
                                        </div>
                                    </label>
                                </div>
                                <div className="input-group">
                                    <label>
                                        Gravel (per yd³):
                                        <div className="price-input-container">
                                            <input 
                                                type="number" 
                                                value={customGravelCost || ''} 
                                                onChange={(e) => setCustomGravelCost(e.target.value === '' ? 0 : parseFloat(e.target.value))} 
                                                placeholder={PRICE_PER_CUBIC_YARD_GRAVEL.toString()}
                                                className="price-input"
                                            />
                                            <span className="price-prefix">$</span>
                                        </div>
                                    </label>
                                </div>
                                <div className="input-group">
                                    <label>
                                        Rebar (per ft):
                                        <div className="price-input-container">
                                            <input 
                                                type="number" 
                                                value={customRebarCost || ''} 
                                                onChange={(e) => setCustomRebarCost(e.target.value === '' ? 0 : parseFloat(e.target.value))} 
                                                placeholder={PRICE_PER_LINEAR_FOOT_REBAR.toString()}
                                                className="price-input"
                                            />
                                            <span className="price-prefix">$</span>
                                        </div>
                                    </label>
                                </div>
                                <div className="input-group">
                                    <label>
                                        Form (per ft):
                                        <div className="price-input-container">
                                            <input 
                                                type="number" 
                                                value={customFormCost || ''} 
                                                onChange={(e) => setCustomFormCost(e.target.value === '' ? 0 : parseFloat(e.target.value))} 
                                                placeholder={PRICE_PER_LINEAR_FOOT_FORM.toString()}
                                                className="price-input"
                                            />
                                            <span className="price-prefix">$</span>
                                        </div>
                                    </label>
                                </div>
                                <div className="input-group">
                                    <label>
                                        Form Stake (per piece):
                                        <div className="price-input-container">
                                            <input 
                                                type="number" 
                                                value={customStakeCost || ''} 
                                                onChange={(e) => setCustomStakeCost(e.target.value === '' ? 0 : parseFloat(e.target.value))} 
                                                placeholder={PRICE_PER_STAKE.toString()}
                                                className="price-input"
                                            />
                                            <span className="price-prefix">$</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                    <button className="calculate-button" onClick={calculateConcrete}>Calculate</button>

                    <div className="result">
                        <h2>Dimensions</h2>
                        <p>Driveway Area: {formatNumber(calculateArea())} sq ft</p>
                        <p>Driveway Perimeter: {formatNumber(length && width ? 2 * (convertToFeet(length, lengthUnit) + convertToFeet(width, widthUnit)) : 0)} ft</p>
                    </div>

                    <div className="result">
                        <h2>Material Estimations</h2>
                        <p>Concrete Volume: {formatNumberOneDecimal(volumeInCubicYards ?? 0)} cubic yards</p>
                        <p>Gravel Volume: {formatNumberOneDecimal(calculateGravelVolume())} cubic yards</p>
                        <p>Rebar Length: {formatNumber(calculateRebarLength())} ft ({Math.ceil(calculateRebarLength() / 20)} pieces of 20' #4 rebar)</p>
                        <p>Forms: {formatNumber(2 * (convertToFeet(length, lengthUnit) + convertToFeet(width, widthUnit)))} ft</p>
                        <p>Form Stakes: {calculateFormStakes()} pieces</p>
                    </div>

                    <div className="result">
                        <h2>Cost Breakdown</h2>
                        <p>Concrete: ${formatWholeNumber(calculateConcretePrice())}</p>
                        <p>Gravel: ${formatWholeNumber(calculateGravelPrice())}</p>
                        <p>Rebar: ${formatWholeNumber(calculateRebarPrice())}</p>
                        <p>Form: ${formatWholeNumber(calculateFormPrice())}</p>
                        <p>Form Stake: ${formatWholeNumber(calculateFormStakePrice())}</p>
                    </div>

                    <div className="result">
                        <h2>Estimated Total Cost</h2>
                        <h4 className="total-cost">${formatWholeNumber(totalCost ?? 0)}</h4>
                        <p className="estimate-note">Estimate only – weight varies by material</p>
                    </div>

                    <div className="compare-section">
                        <div className="compare-buttons">
                            <Link href="/gravel" className="compare-button-clear">
                                <span>Compare to Gravel</span>
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
                    <h2>How the Concrete Driveway Calculator Works</h2>

                    <p className="info-paragraph">
                        A concrete driveway is a durable, low-maintenance, and visually appealing choice for your home. Proper planning and accurate material estimation are essential to ensure a successful project. Use this guide to calculate the materials needed for your driveway, or let our concrete calculator do the heavy lifting for you.
                    </p>

                    <div className="info-image-container">
                        <Image 
                            src="/images/concrete.jpg" 
                            alt="Concrete driveway with a professional finish" 
                            width={800}
                            height={600}
                            className="info-image"
                            priority
                        />
                    </div>

                    <h3>Key Inputs Required:</h3>
                    <p className="info-paragraph">
                        Length of the Driveway: This is the total distance you want to cover with concrete. Measure the driveway's length in feet.
                    </p>
                    <p className="info-paragraph">
                        Width of the Driveway: Measure how wide your driveway will be in feet. This is typically the most variable measurement, as driveways can vary in size depending on your needs.
                    </p>
                    <p className="info-paragraph">
                        Concrete Depth: Choose the depth or thickness of the concrete layer. This is often measured in inches and typically ranges from 4 to 6 inches for residential driveways.
                    </p>

                    <div className="info-paragraph">
                        <h3>How to Calculate Concrete for Your Driveway</h3>
                        <p>Concrete is measured and sold in cubic yards, a unit of volume. To determine the amount of concrete required, follow these steps:</p>
                        
                        <div className="calculation-steps">
                            <h4>Calculate the Area:</h4>
                            <p>Multiply the driveway's length and width in feet to find the square footage.</p>

                            <h4>Determine Depth:</h4>
                            <p>Convert the driveway's depth from inches to feet by dividing the inch measurement by 12.</p>

                            <h4>Find the Volume in Cubic Feet:</h4>
                            <p>Multiply the area (in square feet) by the depth (in feet).</p>

                            <h4>Convert to Cubic Yards:</h4>
                            <p>Divide the cubic footage by 27 to calculate the required volume in cubic yards.</p>
                        </div>

                        <div className="example-box">
                            <h4>Example: For a 20' x 50' driveway with a depth of 8″:</h4>
                            <p>Area: 20 × 50 = 1,000 ft²</p>
                            <p>Depth: 8" ÷ 12 = 0.67 ft</p>
                            <p>Volume: 1,000 × 0.67 = 666.67 ft³</p>
                            <p>Cubic Yards: 666.67 ÷ 27 = 24.69 yd³</p>
                        </div>
                    </div>

                    <h4>Our calculator uses standard industry prices for materials:</h4>
                    
                    <div className="info-paragraph">
                        <h4>Default Material Prices:</h4>
                        <ul className="price-list">
                            <li style={{ fontWeight: 400 }}>Concrete: $125 per cubic yard</li>
                            <li style={{ fontWeight: 400 }}>Gravel: $16 per cubic yard</li>
                            <li style={{ fontWeight: 400 }}>Rebar: $0.75 per linear foot</li>
                            <li style={{ fontWeight: 400 }}>Forms: $0.50 per linear foot</li>
                            <li style={{ fontWeight: 400 }}>Form Stakes: $0.50 per stake</li>
                        </ul>
                    </div>

                    <div className="info-paragraph">
                        <h4>Advanced Mode Available</h4>
                        <p>
                            For more precise estimates, our calculator includes an advanced mode accessible through the "Optional Material Costs" section. This feature allows you to input your local material prices for more accurate cost calculations. You can customize the price of each material independently while keeping default prices for others, ensuring your total cost estimate matches your specific market prices and requirements.
                        </p>
                    </div>

                    <div className="info-paragraph">
                        <h4>Rebar Requirements</h4>
                        <p>Adding reinforcement like rebar or wire mesh helps prevent cracking due to shifting.</p>

                        <h5 style={{ fontWeight: 'bold' }}>Rebar vs. Mesh:</h5>
                        <p>Use wire mesh for driveways 4–5″ thick. Opt for #3 or #4 rebar in a 12″ grid for driveways thicker than 5″.</p>

                        <h5>Estimating Rebar for Rectangular Driveways:</h5>
                        <p>Measure the length and width of the driveway. Subtract 6–12″ from each to account for the grid's edge spacing. Calculate rows and columns of rebar spaced every 12″.</p>

                        <h5>Estimating Rebar for Irregular Driveways:</h5>
                        <p>Use the formula: (square footage × 2) + (perimeter ÷ 2) = total rebar length (ft).</p>
                    </div>

                    <div className="info-paragraph">
                        <h4>Base Gravel Requirements</h4>
                        <p>A compacted gravel base, 4–12″ deep, is crucial for stability, drainage, and preventing erosion. Most driveways require around 6″ of gravel.</p>

                        <h5>Calculating Gravel Volume:</h5>
                        <p>Gravel is measured in cubic yards. Use the same method as for concrete to estimate the amount.</p>

                        <p className="pro-tip"><strong>Pro Tip:</strong> Compact gravel takes up less space. Order about 20% more than your loose gravel estimate.</p>
                    </div>

                    <div className="info-paragraph">
                        <h4>Formwork for Concrete Driveways</h4>
                        <p>Forms hold the concrete in place while it cures. Use 2×4 or 2×6 boards for straight sections and flexible hardboard siding for curves.</p>

                        <h5>Calculating Form Material:</h5>
                        <p>Measure the driveway's perimeter in feet and round up to the nearest whole number. This equals the linear feet of lumber required.</p>

                        <h5>Stakes for Securing Forms:</h5>
                        <p>Choose steel concrete pins for reusability or wooden stakes for a cost-effective, single-use option.</p>
                    </div>

                    <h4>Summary</h4>

                    <p className="info-paragraph">
                        Concrete driveways typically cost $4,000–$8,500 and require precise material planning. Use our calculators to estimate concrete, rebar, gravel, and forms easily, ensuring your project stays on track and within budget.
                    </p>

                    <p className="info-paragraph">
                        Let’s get started! Use our concrete calculator now to plan your project effortlessly.
                    </p>

                    <h3>Why Use the Concrete Calculator?</h3>
                    <p className="info-paragraph">
                        Accurate Estimates: This tool helps ensure that you order the right amount of concrete, reducing the risk of over- or under-ordering.
                    </p>
                    <p className="info-paragraph">
                        Cost Efficiency: With accurate volume calculations, you can more efficiently estimate the costs for materials, labor, and any additional requirements for your project.
                    </p>
                    <p className="info-paragraph">
                        Convenience: By inputting simple measurements, you get an immediate estimate of the concrete needed, saving you time and effort in planning your driveway project.
                    </p>
                </div>
            </div>
        </div>
    );
} 