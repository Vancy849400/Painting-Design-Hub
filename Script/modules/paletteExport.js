import { hexToRgb } from './colorUtils.js';

export function generateStyledPaletteDocument(currentScheme) {
    const colors = [];

    document.querySelectorAll(".palette-color-card").forEach((card) => {
        const name = card.querySelector(".palette-color-name").textContent;
        const hex = card.querySelector(".palette-color-hex").textContent;
        const rgb = card.querySelector(".palette-color-rgb").textContent;
        const swatchStyle = card.querySelector(".palette-color-swatch").getAttribute("style");
        colors.push({ name, hex, rgb, swatchStyle });
    });

    if (colors.length === 0) {
        alert("No palette generated yet!");
        return;
    }

    const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Color Palette - ${currentScheme.charAt(0).toUpperCase() + currentScheme.slice(1)}</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                background: #f9fafb;
                padding: 40px 20px;
                color: #111827;
            }
            
            .container {
                max-width: 1000px;
                margin: 0 auto;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            
            .header {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                padding: 40px;
                text-align: center;
            }
            
            .header h1 {
                font-size: 2.5rem;
                margin-bottom: 10px;
                font-weight: 800;
            }
            
            .header p {
                font-size: 1rem;
                opacity: 0.95;
                margin-bottom: 20px;
            }
            
            .metadata {
                display: flex;
                justify-content: space-around;
                background: rgba(255, 255, 255, 0.1);
                padding: 20px;
                border-radius: 8px;
                margin-top: 20px;
            }
            
            .metadata-item {
                text-align: center;
            }
            
            .metadata-label {
                font-size: 0.85rem;
                opacity: 0.8;
                margin-bottom: 5px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .metadata-value {
                font-size: 1.1rem;
                font-weight: 600;
            }
            
            .content {
                padding: 40px;
            }
            
            .intro {
                margin-bottom: 40px;
                padding: 20px;
                background: #f0fdf4;
                border-left: 4px solid #10b981;
                border-radius: 8px;
            }
            
            .intro p {
                color: #374151;
                line-height: 1.7;
                font-size: 0.95rem;
            }
            
            .palette-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 40px;
            }
            
            .color-item {
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                overflow: hidden;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            .color-item:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            }
            
            .color-swatch {
                width: 100%;
                height: 150px;
            }
            
            .color-info {
                padding: 15px;
            }
            
            .color-name {
                font-size: 0.85rem;
                color: #6b7280;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 8px;
                font-weight: 600;
            }
            
            .color-value {
                font-size: 1.2rem;
                font-weight: 700;
                color: #10b981;
                margin-bottom: 5px;
                font-family: 'Courier New', monospace;
            }
            
            .color-rgb {
                font-size: 0.8rem;
                color: #9ca3af;
                font-family: 'Courier New', monospace;
            }
            
            .usage-section {
                background: #f3f4f6;
                padding: 30px;
                border-radius: 8px;
                margin-bottom: 30px;
            }
            
            .usage-section h2 {
                font-size: 1.3rem;
                margin-bottom: 20px;
                color: #111827;
            }
            
            .usage-tips {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 20px;
            }
            
            .tip {
                background: white;
                padding: 15px;
                border-radius: 6px;
                border-left: 3px solid #10b981;
            }
            
            .tip h3 {
                font-size: 0.95rem;
                color: #10b981;
                margin-bottom: 8px;
                font-weight: 600;
            }
            
            .tip p {
                font-size: 0.9rem;
                color: #6b7280;
                line-height: 1.6;
            }
            
            .footer {
                background: #f9fafb;
                padding: 20px 40px;
                border-top: 1px solid #e5e7eb;
                text-align: center;
                color: #6b7280;
                font-size: 0.85rem;
            }
            
            @media print {
                body {
                    background: white;
                    padding: 0;
                }
                .container {
                    box-shadow: none;
                }
            }
            
            @media (max-width: 768px) {
                .header {
                    padding: 30px 20px;
                }
                
                .header h1 {
                    font-size: 1.8rem;
                }
                
                .content {
                    padding: 20px;
                }
                
                .palette-grid {
                    grid-template-columns: 1fr;
                }
                
                .metadata {
                    flex-direction: column;
                    gap: 15px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎨 Color Palette</h1>
                <p>${currentScheme.charAt(0).toUpperCase() + currentScheme.slice(1)} Color Scheme</p>
                <div class="metadata">
                    <div class="metadata-item">
                        <div class="metadata-label">Scheme</div>
                        <div class="metadata-value">${currentScheme.charAt(0).toUpperCase() + currentScheme.slice(1)}</div>
                    </div>
                    <div class="metadata-item">
                        <div class="metadata-label">Colors</div>
                        <div class="metadata-value">${colors.length}</div>
                    </div>
                    <div class="metadata-item">
                        <div class="metadata-label">Generated</div>
                        <div class="metadata-value">${currentDate}</div>
                    </div>
                </div>
            </div>
            
            <div class="content">
                <div class="intro">
                    <p><strong>Color Palette Documentation</strong> - This palette was generated using the ${currentScheme.charAt(0).toUpperCase() + currentScheme.slice(1)} color harmony method. Each color in the palette has been carefully calculated to work harmoniously together in your design projects.</p>
                </div>
                
                <div class="palette-grid">
                    ${colors.map((color) => `
                        <div class="color-item">
                            <div class="color-swatch" ${color.swatchStyle}></div>
                            <div class="color-info">
                                <div class="color-name">${color.name}</div>
                                <div class="color-value">${color.hex}</div>
                                <div class="color-rgb">${color.rgb}</div>
                            </div>
                        </div>
                    `).join("")}
                </div>
                
                <div class="usage-section">
                    <h2>📋 Usage Guidelines</h2>
                    <div class="usage-tips">
                        <div class="tip">
                            <h3>Web Design</h3>
                            <p>Use these colors for websites, apps, and digital interfaces. The palette works well for both light and dark backgrounds.</p>
                        </div>
                        <div class="tip">
                            <h3>Print Materials</h3>
                            <p>These colors are optimized for screen display. For print, consult a color conversion chart and adjust accordingly.</p>
                        </div>
                        <div class="tip">
                            <h3>Accessibility</h3>
                            <p>Test color combinations for color-blind accessibility. Ensure sufficient contrast ratios for text legibility.</p>
                        </div>
                        <div class="tip">
                            <h3>Brand Consistency</h3>
                            <p>Keep these hex values in your brand guidelines. Use them consistently across all digital and print materials.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <p>Generated by Vancy Painter Design Hub | ${currentDate}</p>
            </div>
        </div>
    </body>
    </html>
    `;

    // Open in new window
    const newWindow = window.open("", "_blank");
    newWindow.document.write(htmlContent);
    newWindow.document.close();
}