"use client";

import React, { useState } from 'react';
import '../gravel-calculator/GravelPage.css';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';


type Unit = 'in' | 'ft' | 'cm' | 'm' | 'yd';

const POUNDS_PER_CUBIC_FOOT = 145; // Average weight of asphalt per cubic foot
const POUNDS_PER_TON = 2000;

// Define the type for exactCosts
type ExactCosts = {
    asphalt: {
        min: number;
        max: number;
        custom?: boolean;
    };
    crushedStone: {
        min: number;
        max: number;
    };
    equipment: {
        min: number;
        max: number;
    };
};

export default function AsphaltPage() {
    const [width, setWidth] = useState<string>('');
    const [length, setLength] = useState<string>('');
    const [depth, setDepth] = useState<number>(3);
    const [totalCost, setTotalCost] = useState<{min: number, max: number} | null>(null);
    const [asphaltTons, setAsphaltTons] = useState<{tons: number, yards: number} | null>(null);
    const [crushedStoneYards, setCrushedStoneYards] = useState<{min: number, max: number} | null>(null);
    const [widthUnit, setWidthUnit] = useState<Unit>('ft');
    const [lengthUnit, setLengthUnit] = useState<Unit>('ft');
    const [depthUnit, setDepthUnit] = useState<Unit>('in');
    const [customAsphaltCost, setCustomAsphaltCost] = useState<number>(0);
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
        asphalt: {min: number, max: number, custom?: number},
        crushedStone: {min: number, max: number},
        equipment: {min: number, max: number}
    } | null>(null);
    const [showPriceInfo, setShowPriceInfo] = useState<boolean>(false);
    const [showDepthInfo, setShowDepthInfo] = useState<boolean>(false);

    const formatNumber = (num: number): string => {
        return num.toLocaleString('en-US');
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
        const lengthInFeet = convertToFeet(parseFloat(length), lengthUnit);
        const widthInFeet = convertToFeet(parseFloat(width), widthUnit);
        return lengthInFeet * widthInFeet;
    };

    const calculatePerimeter = (): number => {
        if (!length || !width) return 0;
        const lengthInFeet = convertToFeet(parseFloat(length), lengthUnit);
        const widthInFeet = convertToFeet(parseFloat(width), widthUnit);
        return 2 * (lengthInFeet + widthInFeet);
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

        if (!width || parseFloat(width) <= 0) {
            newErrors.width = 'Width is required and must be greater than 0';
            hasErrors = true;
        }

        if (!length || parseFloat(length) <= 0) {
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

        const widthInFeet = convertToFeet(parseFloat(width), widthUnit);
        const lengthInFeet = convertToFeet(parseFloat(length), lengthUnit);
        const depthInFeet = convertToInches(depth, depthUnit) / 12;
        
        const exactAsphaltTons = (widthInFeet * lengthInFeet * depthInFeet * POUNDS_PER_CUBIC_FOOT) / POUNDS_PER_TON;
        const roundedTons = Math.ceil(exactAsphaltTons * 100) / 100;

        // Crushed stone base (4" - 8" thick)
        const baseCubicFeet = widthInFeet * lengthInFeet * (4/12);
        const baseYardsMin = baseCubicFeet / 27;
        const baseYardsMax = baseYardsMin * 2;

        // 1. Calculate exact costs (no rounding)
        const exactCosts: ExactCosts = {
            asphalt: {
                min: Number((roundedTons * 100).toFixed(0)),    
                max: Number((roundedTons * 140).toFixed(0))    
            },
            crushedStone: {
                min: baseYardsMin * 16,                   // 1.8 * 16 = 28.8
                max: baseYardsMax * 16                    // 3.6 * 16 = 57.6
            },
            equipment: {
                min: roundedTons * 15.3256,  // 1.74 * 15.3256 = 26.666544
                max: roundedTons * 25.5428   // 1.74 * 25.5428 = 44.444472
            }
        };

        // 2. Handle custom price if provided
        if (customAsphaltCost) {
            const exactAsphaltCost = roundedTons * customAsphaltCost;
            exactCosts.asphalt = {
                min: exactAsphaltCost,
                max: exactAsphaltCost,
                custom: true
            };
        }

        // 3. Set Material Costs (rounded for display)
        setMaterialCosts({
            asphalt: {
                min: Math.round(exactCosts.asphalt.min),
                max: Math.round(exactCosts.asphalt.max),
                custom: customAsphaltCost ? Math.round(exactCosts.asphalt.min) : undefined
            },
            crushedStone: {
                min: Math.round(exactCosts.crushedStone.min),
                max: Math.round(exactCosts.crushedStone.max)
            },
            equipment: {
                min: Math.round(exactCosts.equipment.min),
                max: Math.round(exactCosts.equipment.max)
            }
        });

        // 4. Calculate Total (using unrounded values)
        const exactTotalMin = exactCosts.asphalt.min + 
                             exactCosts.crushedStone.min + 
                             exactCosts.equipment.min;

        const exactTotalMax = exactCosts.asphalt.max + 
                             exactCosts.crushedStone.max + 
                             exactCosts.equipment.max;

        // 5. Round only the final totals
        setTotalCost({
            min: Math.round(exactTotalMin),
            max: Math.round(exactTotalMax)
        });

        // For display purposes only, round asphalt tons to one decimal
        const cubicYards = (roundedTons * POUNDS_PER_TON) / (POUNDS_PER_CUBIC_FOOT * 27);
        setAsphaltTons({
            tons: Math.round(roundedTons * 10) / 10,
            yards: Math.round(cubicYards * 10) / 10
        });
        
        setCrushedStoneYards({
            min: Math.round(baseYardsMin * 10) / 10,
            max: Math.round(baseYardsMax * 10) / 10
        });
    };

    return (
        <div className="min-h-screen bg-gray-800 flex flex-col">
            <Header />
            <main className="flex-1">
                <div className="gravel-page-container font-roboto">
                    <div className="content-wrapper">
                        <div className="calculator-section">
                            <h1 className="page-title text-26px whitespace-nowrap">Asphalt Driveway Calculator</h1>
                            <div className="input-group">
                                <label>
                                    Width: <span className="required">*</span>
                                    <div className="input-with-unit">
                                        <input 
                                            type="number" 
                                            value={width} 
                                            onChange={(e) => setWidth(e.target.value)} 
                                            required 
                                            placeholder="Enter Width"
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
                                {errors.width && <div className="error-message">{errors.width}</div>}
                            </div>
                            <div className="input-group">
                                <label>
                                    Length: <span className="required">*</span>
                                    <div className="input-with-unit">
                                        <input 
                                            type="number" 
                                            value={length} 
                                            onChange={(e) => setLength(e.target.value)} 
                                            required 
                                            placeholder="Enter Length"
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
                                {errors.length && <div className="error-message">{errors.length}</div>}
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
                                    {errors.depth && <div className="error-message">{errors.depth}</div>}
                                    {showDepthInfo && (
                                        <>
                                            <br />
                                            <p className="text-sm text-gray-400 mt-2">
                                                The average asphalt driveway thickness varies based on its purpose and usage:
                                            </p>
                                            <ul className="text-sm text-gray-400 mt-2">
                                                <li>Residential Driveways: Typically 2–3 inches, though 3 inches is recommended for larger vehicles like trucks.</li>
                                                <li>Commercial Driveways: Typically 3 inches, but 4–7 inches is ideal for heavy-duty use.</li>
                                                <li>Parking Lots: Usually 3 inches, but 6 inches is better for standard lots.</li>
                                                <li>Extra Heavy-Duty Driveways: Typically 8–10 inches, designed for trucks and buses.</li>
                                            </ul>
                                            <p className="text-sm text-gray-400 mt-2">
                                                For our calculations, we are using a standard thickness of 3 inches. You can adjust the thickness based on specific needs and usage.
                                            </p>
                                        </>
                                    )}
                                </label>
                            </div>
                            <div className="input-group">
                                <label>
                                    Price per Ton:
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
                                            value={customAsphaltCost || ''} 
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setCustomAsphaltCost(value === '' ? 0 : parseFloat(value));
                                            }} 
                                            placeholder="100-140"
                                            className="price-input"
                                        />
                                        <span className="price-prefix">$</span>
                                    </div>
                                    {showPriceInfo && (
                                        <>
                                            <br />
                                            <p className="text-sm text-gray-400 mt-2">
                                                For our calculations, we use the following fixed per-unit costs:
                                            </p>
                                            <ul className="text-sm text-gray-400 mt-2">
                                                <li>Hot Mix Asphalt: Average price ranges from $100 to $140 per ton.</li>
                                                <li>Crushed Stone: Priced at $16 per cubic yard.</li>
                                                <li>Equipment Rentals & Supplies: Average costs range from $15.33 to $25.54 per ton of asphalt.</li>
                                            </ul>
                                            <p className="text-sm text-gray-400 mt-2">
                                                However, you can adjust the prices as needed. We recommend confirming rates with local suppliers for the most accurate estimate.
                                            </p>
                                        </>
                                    )}
                                </label>
                            </div>
                            <button className="calculate-button" onClick={calculateAsphalt}>Calculate</button>

                            <div className="result">
                                <p style={{ fontWeight: 'bold', fontSize: '20px' }}>Dimensions</p>
                                <p>Driveway Area: {formatNumber(calculateArea())} sq ft</p>
                                <p>Driveway Perimeter: {formatNumber(calculatePerimeter())} ft</p>
                            </div>

                            <div className="result">
                                <p style={{ fontWeight: 'bold', fontSize: '20px' }}>Material Estimate</p>
                                <p>Hot Mix Asphalt: {formatNumberOneDecimal(asphaltTons?.tons ?? 0)} tons ({formatNumberOneDecimal(asphaltTons?.yards ?? 0)} yds³)</p>
                                <p>Crushed Stone Base: {formatNumberOneDecimal(crushedStoneYards?.min ?? 0)} - {formatNumberOneDecimal(crushedStoneYards?.max ?? 0)} yds³</p>
                            </div>

                            <div className="result">
                                <p style={{ fontWeight: 'bold', fontSize: '20px' }}>Estimated Material Cost</p>
                                {materialCosts?.asphalt.custom ? (
                                    <p>Asphalt: ${formatNumber(materialCosts.asphalt.custom)}</p>
                                ) : (
                                    <p>Asphalt: ${formatNumber(materialCosts?.asphalt.min ?? 0)} - ${formatNumber(materialCosts?.asphalt.max ?? 0)}</p>
                                )}
                                <p>Crushed Stone: ${formatNumber(materialCosts?.crushedStone.min ?? 0)} - ${formatNumber(materialCosts?.crushedStone.max ?? 0)}</p>
                                <p>Equipment Rentals & Supplies: ${formatNumber(materialCosts?.equipment.min ?? 0)} - ${formatNumber(materialCosts?.equipment.max ?? 0)}</p>
                            </div>

                            <div className="result">
                                <p style={{ fontWeight: 'bold', fontSize: '20px' }}>Estimated Total Cost</p>
                                <h4 className="total-cost" style={{ fontWeight: 'bold', fontSize: '24px' }}>
                                    ${formatNumber(totalCost?.min ?? 0)} - ${formatNumber(totalCost?.max ?? 0)}
                                </h4>
                                <p className="estimate-note">*Estimate only - costs vary by location/vendor</p>
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
                            <h2>How the Asphalt Driveway Calculator Works</h2>

                            <p className="info-paragraph">
                                The Asphalt Driveway Calculator is a simple, yet powerful tool designed to help you estimate the amount of asphalt needed for your driveway project. Whether you're planning a new driveway or resurfacing an existing one, this calculator provides an accurate estimate based on the specific dimensions of your project.
                            </p>

                            <div className="info-image-container">
                                <Image 
                                    src="/images/asphalt.jpg" 
                                    alt="Asphalt Driveway" 
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
                                Asphalt Depth: Choose the depth or thickness of the asphalt layer. This is often measured in inches and typically ranges from 2 to 3 inches for residential driveways.
                            </p>

                            <h3>How to Calculate Asphalt for Your Driveway</h3>
                            <p className="info-paragraph">
                                Asphalt is a fantastic choice for driveways and parking lots, offering a combination of affordability, durability, and low maintenance. Unlike concrete, asphalt is better at withstanding freeze-thaw cycles, making it a go-to material in colder climates. Its deep, dark finish also provides a sleek look while camouflaging imperfections. Made from a mix of aggregates like sand, crushed stone, or gravel, held together with a bitumen binder, asphalt is available in various grades to suit different projects and budgets.
                            </p>

                            <p className="info-paragraph">
                                When planning a new driveway or parking lot, estimating the amount of asphalt needed is crucial. Having a clear understanding of the required materials and labor costs ensures that you get the best value for your investment. Here's a step-by-step guide to help you estimate accurately.
                            </p>

                            <h4>Calculating How Much Asphalt You Need</h4>
                            <p className="info-paragraph">
                                Asphalt is typically sold by the ton, and the coverage it provides depends on its density. Most mixes for driveways and parking lots weigh between 142-148 pounds per cubic foot, with 145 pounds being a reliable average. To calculate the amount needed, start by finding the cubic footage of your project. Multiply the length, width, and depth (in feet) of the area. Keep in mind that 3 inches of asphalt equals 0.25 feet.
                            </p>

                            <div className="info-paragraph">
                                <p>For example, a 10-foot by 20-foot driveway with a depth of 3 inches would require:</p>
                                <p>10′ × 20′ × 0.25′ = 50ft³</p>
                                <p>Next, multiply the cubic footage by 145 to get the total weight in pounds, then divide by 2,000 to convert to tons:</p>
                                <p>50ft³ × 145 = 7,250lbs</p>
                                <p>7,250lbs ÷ 2,000 = 3.63tons</p>
                                <p>In this case, you'd need approximately 3.63 tons of asphalt for the project.</p>
                            </div>

                            <h4>Choosing the Right Thickness</h4>
                            <p className="info-paragraph">
                                The thickness of your asphalt layer plays a significant role in its performance and longevity. For residential driveways, a minimum thickness of 3 inches is recommended. This typically consists of 2 inches of base layer asphalt topped with 1 inch of surface asphalt.
                            </p>

                            <p className="info-paragraph">
                                In regions with harsh winters, it's wise to increase the thickness to 4-6 inches of full-depth asphalt to prevent cracking and frost heaves. Parking lots also have specific requirements: light-duty lots should have 4-5 inches of asphalt, while heavy-duty lots used by trucks should be at least 7-8 inches thick.
                            </p>

                            <h4>Building a Strong Base</h4>
                            <p className="info-paragraph">
                                A solid base is essential for ensuring your asphalt surface remains durable over time. Most professionals recommend a compacted crushed rock base to provide stability, particularly for areas with loose or clay-rich soil. For driveways on sandy soil, a 4-inch gravel base is sufficient. However, for clay soil, an 8-inch gravel base is ideal to support the asphalt and prevent shifting.
                            </p>

                            <p className="info-paragraph">
                                Parking lots, regardless of soil type, typically require an 8-inch crushed gravel base. Using a gravel base not only adds strength but can also reduce the amount of asphalt required. For example, a driveway with a 4-6 inch gravel base and 3 inches of asphalt can be a cost-effective and durable solution.
                            </p>

                            <h4>Planning for Success</h4>
                            <p className="info-paragraph">
                                Estimating asphalt correctly involves more than just calculations—it requires thoughtful planning and consideration of factors like climate, soil type, and expected usage. A well-prepared project with the right thickness and a sturdy base will ensure your driveway or parking lot remains smooth and resilient for years to come. With careful planning, you'll not only save money but also enjoy a finished surface that can handle whatever comes its way.
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
            </main>
            <Footer />
        </div>
    );
} 