const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:3847';
const OUTPUT_DIR = '/home/clawdbot/clawd/psph-website-jotform/audit-screenshots';
const PAGES = [
    '/index.html',
    '/schedule.html', 
    '/privacy.html',
    '/terms.html'
];

const VIEWPORTS = {
    desktop: [
        { width: 1920, height: 1080, name: 'desktop-1920x1080' },
        { width: 1440, height: 900, name: 'desktop-1440x900' },
        { width: 1280, height: 800, name: 'desktop-1280x800' }
    ],
    tablet: [
        { width: 1024, height: 768, name: 'tablet-1024x768' },
        { width: 768, height: 1024, name: 'tablet-768x1024' }
    ],
    mobile: [
        { width: 425, height: 900, name: 'mobile-425x900' },
        { width: 375, height: 812, name: 'mobile-375x812' },
        { width: 320, height: 568, name: 'mobile-320x568' }
    ]
};

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function captureScreenshots() {
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        for (const pagePath of PAGES) {
            const pageUrl = BASE_URL + pagePath;
            const pageName = pagePath.replace(/^\/|\.html$/g, '');
            
            console.log(`\n📄 Processing page: ${pageUrl}`);
            
            // Basic viewport screenshots
            for (const category in VIEWPORTS) {
                for (const viewport of VIEWPORTS[category]) {
                    await capturePageScreenshot(browser, pageUrl, pageName, viewport, '');
                }
            }
            
            // Special interaction screenshots for index page
            if (pagePath === '/index.html') {
                await captureInteractionScreenshots(browser, pageUrl, pageName);
            }
            
            // Mobile menu open state
            await captureMobileMenuOpen(browser, pageUrl, pageName);
            
            // Scrolled header (sticky behavior)
            await captureScrolledHeader(browser, pageUrl, pageName);
            
            // Stress test: 320px width
            await capturePageScreenshot(browser, pageUrl, pageName, { width: 320, height: 1000 }, 'stress-320px');
        }
        
        console.log(`\n✅ Screenshot capture complete! Files saved to: ${OUTPUT_DIR}`);
    } catch (error) {
        console.error('❌ Error during screenshot capture:', error);
    } finally {
        await browser.close();
    }
}

async function capturePageScreenshot(browser, url, pageName, viewport, suffix = '') {
    const page = await browser.newPage();
    
    try {
        await page.setViewport(viewport);
        await page.goto(url, { waitUntil: 'networkidle0' });
        
        const filename = suffix 
            ? `${pageName}-${viewport.name}-${suffix}.png`
            : `${pageName}-${viewport.name}.png`;
        const filePath = path.join(OUTPUT_DIR, filename);
        
        // Take full page screenshot
        await page.screenshot({ 
            path: filePath,
            fullPage: true
        });
        
        console.log(`📸 Captured: ${filename}`);
    } catch (error) {
        console.error(`❌ Error capturing ${pageName} at ${viewport.name}:`, error);
    } finally {
        await page.close();
    }
}

async function captureInteractionScreenshots(browser, url, pageName) {
    const page = await browser.newPage();
    
    try {
        await page.setViewport({ width: 1440, height: 900 });
        await page.goto(url, { waitUntil: 'networkidle0' });
        
        // Capture button hover states
        const buttons = await page.$$('button, .btn, .cta');
        for (let i = 0; i < Math.min(buttons.length, 5); i++) {
            await buttons[i].hover();
            await page.screenshot({ 
                path: path.join(OUTPUT_DIR, `${pageName}-button-hover-${i + 1}.png`),
                fullPage: true
            });
            console.log(`📸 Captured: ${pageName}-button-hover-${i + 1}.png`);
        }
        
        // Test testimonial carousel if present
        const carouselNext = await page.$('.testimonials .next, .carousel-next, [aria-label*="next"]');
        if (carouselNext) {
            await carouselNext.click();
            await page.waitForTimeout(1000);
            await page.screenshot({ 
                path: path.join(OUTPUT_DIR, `${pageName}-carousel-next.png`),
                fullPage: true
            });
            console.log(`📸 Captured: ${pageName}-carousel-next.png`);
        }
        
    } catch (error) {
        console.error(`❌ Error capturing interactions for ${pageName}:`, error);
    } finally {
        await page.close();
    }
}

async function captureMobileMenuOpen(browser, url, pageName) {
    const page = await browser.newPage();
    
    try {
        await page.setViewport({ width: 375, height: 812 });
        await page.goto(url, { waitUntil: 'networkidle0' });
        
        // Look for mobile menu button
        const menuBtn = await page.$('.mobile-menu-btn, .hamburger, [aria-label*="menu"], [aria-label*="toggle"]');
        if (menuBtn) {
            await menuBtn.click();
            await page.waitForTimeout(500);
            
            await page.screenshot({ 
                path: path.join(OUTPUT_DIR, `${pageName}-mobile-menu-open.png`),
                fullPage: true
            });
            console.log(`📸 Captured: ${pageName}-mobile-menu-open.png`);
        }
        
    } catch (error) {
        console.error(`❌ Error capturing mobile menu for ${pageName}:`, error);
    } finally {
        await page.close();
    }
}

async function captureScrolledHeader(browser, url, pageName) {
    const page = await browser.newPage();
    
    try {
        await page.setViewport({ width: 1440, height: 900 });
        await page.goto(url, { waitUntil: 'networkidle0' });
        
        // Scroll down to test sticky header
        await page.evaluate(() => {
            window.scrollTo(0, 800);
        });
        await page.waitForTimeout(500);
        
        await page.screenshot({ 
            path: path.join(OUTPUT_DIR, `${pageName}-header-scrolled.png`),
            fullPage: true
        });
        console.log(`📸 Captured: ${pageName}-header-scrolled.png`);
        
    } catch (error) {
        console.error(`❌ Error capturing scrolled header for ${pageName}:`, error);
    } finally {
        await page.close();
    }
}

// Run the screenshot capture
captureScreenshots().catch(console.error);