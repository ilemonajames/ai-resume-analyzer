export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;
    if (loadPromise) return loadPromise;

    isLoading = true;
    
    try {
        // Use the standard pdfjs-dist import
        loadPromise = import("pdfjs-dist").then((lib) => {
            // Use the worker from the same package - this ensures version compatibility
            lib.GlobalWorkerOptions.workerSrc = new URL(
                'pdfjs-dist/build/pdf.worker.min.mjs',
                import.meta.url
            ).toString();
            pdfjsLib = lib;
            isLoading = false;
            return lib;
        });
        
        return await loadPromise;
    } catch (error) {
        isLoading = false;
        loadPromise = null;
        throw new Error(`Failed to load PDF.js: ${error}`);
    }
}

export async function convertPdfToImage(
    file: File
): Promise<PdfConversionResult> {
    try {
        // Validate input file
        if (!file) {
            return {
                imageUrl: "",
                file: null,
                error: "No file provided",
            };
        }

        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
            return {
                imageUrl: "",
                file: null,
                error: "File is not a PDF",
            };
        }

        console.log('Loading PDF.js library...');
        const lib = await loadPdfJs();
        
        console.log('Converting file to ArrayBuffer...');
        const arrayBuffer = await file.arrayBuffer();
        
        console.log('Loading PDF document...');
        const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
        
        console.log('Getting first page...');
        const page = await pdf.getPage(1);

        // Use a reasonable scale to avoid memory issues
        const scale = 2.0; // Reduced from 4 to avoid potential memory issues
        const viewport = page.getViewport({ scale });
        
        console.log(`Canvas dimensions: ${viewport.width}x${viewport.height}`);
        
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
            return {
                imageUrl: "",
                file: null,
                error: "Failed to get canvas 2D context",
            };
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Enable image smoothing for better quality
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";

        console.log('Rendering PDF page to canvas...');
        await page.render({ 
            canvasContext: context, 
            viewport 
        }).promise;

        console.log('Converting canvas to blob...');
        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        // Create a File from the blob with the same name as the pdf
                        const originalName = file.name.replace(/\.pdf$/i, "");
                        const imageFile = new File([blob], `${originalName}.png`, {
                            type: "image/png",
                        });

                        console.log('PDF conversion successful');
                        resolve({
                            imageUrl: URL.createObjectURL(blob),
                            file: imageFile,
                        });
                    } else {
                        console.error('Failed to create blob from canvas');
                        resolve({
                            imageUrl: "",
                            file: null,
                            error: "Failed to create image blob",
                        });
                    }
                },
                "image/png",
                1.0 // Reduced quality slightly for smaller file size
            );
        });
    } catch (err) {
        console.error('PDF conversion error:', err);
        return {
            imageUrl: "",
            file: null,
            error: `Failed to convert PDF: ${err instanceof Error ? err.message : String(err)}`,
        };
    }
}