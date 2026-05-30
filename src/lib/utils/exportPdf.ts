import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const HEADER_TEXT = 'FitForecast — 8-Month Fitness Transformation Analysis';
const FOOTER_TEXT =
	'This document is for informational purposes only. Not medical advice.';

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MARGIN_MM = 10;
const HEADER_HEIGHT_MM = 12;
const FOOTER_HEIGHT_MM = 10;

const CONTENT_WIDTH_MM = A4_WIDTH_MM - MARGIN_MM * 2;
const CONTENT_HEIGHT_MM = A4_HEIGHT_MM - MARGIN_MM * 2 - HEADER_HEIGHT_MM - FOOTER_HEIGHT_MM;

function addHeaderAndFooter(doc: jsPDF, pageNumber: number, totalPages: number): void {
	doc.setFontSize(9);
	doc.setTextColor(200, 200, 200);
	doc.text(HEADER_TEXT, A4_WIDTH_MM / 2, MARGIN_MM + 6, { align: 'center' });

	doc.setFontSize(7);
	doc.setTextColor(160, 160, 160);
	doc.text(FOOTER_TEXT, A4_WIDTH_MM / 2, A4_HEIGHT_MM - MARGIN_MM, { align: 'center' });
	doc.text(
		`Page ${pageNumber} of ${totalPages}`,
		A4_WIDTH_MM - MARGIN_MM,
		A4_HEIGHT_MM - MARGIN_MM,
		{ align: 'right' }
	);
}

/**
 * Captures an HTML element and exports it as a multi-page A4 PDF.
 * Each page includes a header and medical disclaimer footer.
 */
export async function exportDashboardPdf(
	element: HTMLElement,
	title?: string
): Promise<void> {
	if (typeof window === 'undefined') return;

	const canvas = await html2canvas(element, {
		scale: 2,
		useCORS: true,
		backgroundColor: '#1a1a2e',
		logging: false
	});

	const imgData = canvas.toDataURL('image/png');
	const imgWidthPx = canvas.width;
	const imgHeightPx = canvas.height;

	const scaleFactor = CONTENT_WIDTH_MM / imgWidthPx;
	const scaledHeightMm = imgHeightPx * scaleFactor;

	const totalPages = Math.ceil(scaledHeightMm / CONTENT_HEIGHT_MM);
	const doc = new jsPDF('p', 'mm', 'a4');

	if (title) {
		doc.setProperties({ title });
	}

	for (let page = 0; page < totalPages; page++) {
		if (page > 0) doc.addPage();

		addHeaderAndFooter(doc, page + 1, totalPages);

		const srcY = (page * CONTENT_HEIGHT_MM) / scaleFactor;
		const srcHeight = Math.min(
			CONTENT_HEIGHT_MM / scaleFactor,
			imgHeightPx - srcY
		);

		const sliceCanvas = document.createElement('canvas');
		sliceCanvas.width = imgWidthPx;
		sliceCanvas.height = srcHeight;

		const ctx = sliceCanvas.getContext('2d');
		if (!ctx) continue;
		ctx.drawImage(canvas, 0, srcY, imgWidthPx, srcHeight, 0, 0, imgWidthPx, srcHeight);

		const sliceData = sliceCanvas.toDataURL('image/png');
		const sliceHeightMm = srcHeight * scaleFactor;

		doc.addImage(
			sliceData,
			'PNG',
			MARGIN_MM,
			MARGIN_MM + HEADER_HEIGHT_MM,
			CONTENT_WIDTH_MM,
			sliceHeightMm
		);
	}

	doc.save('fitforecast-report.pdf');
}

/**
 * Generates a text-based PDF with key metrics (no html2canvas).
 * Includes a disclaimer at the bottom per BRU-006.
 */
export async function exportSummaryPdf(summaryData: {
	title: string;
	metrics: { label: string; value: string }[];
	disclaimer: string;
}): Promise<void> {
	if (typeof window === 'undefined') return;

	const doc = new jsPDF('p', 'mm', 'a4');

	doc.setFontSize(9);
	doc.setTextColor(200, 200, 200);
	doc.text(HEADER_TEXT, A4_WIDTH_MM / 2, MARGIN_MM + 6, { align: 'center' });

	let y = MARGIN_MM + HEADER_HEIGHT_MM + 10;

	doc.setFontSize(18);
	doc.setTextColor(40, 40, 40);
	doc.text(summaryData.title, A4_WIDTH_MM / 2, y, { align: 'center' });
	y += 14;

	doc.setDrawColor(220, 220, 220);
	doc.line(MARGIN_MM, y, A4_WIDTH_MM - MARGIN_MM, y);
	y += 10;

	for (const metric of summaryData.metrics) {
		if (y > A4_HEIGHT_MM - MARGIN_MM - FOOTER_HEIGHT_MM - 20) {
			addHeaderAndFooter(doc, doc.getNumberOfPages(), doc.getNumberOfPages());
			doc.addPage();
			y = MARGIN_MM + HEADER_HEIGHT_MM + 10;
		}

		doc.setFontSize(11);
		doc.setTextColor(100, 100, 100);
		doc.text(metric.label, MARGIN_MM + 5, y);

		doc.setFontSize(13);
		doc.setTextColor(30, 30, 30);
		doc.text(metric.value, A4_WIDTH_MM - MARGIN_MM - 5, y, { align: 'right' });

		y += 9;
	}

	y += 10;
	doc.setDrawColor(220, 220, 220);
	doc.line(MARGIN_MM, y, A4_WIDTH_MM - MARGIN_MM, y);
	y += 8;

	doc.setFontSize(8);
	doc.setTextColor(140, 140, 140);
	const disclaimerLines = doc.splitTextToSize(
		summaryData.disclaimer,
		CONTENT_WIDTH_MM - 10
	);
	doc.text(disclaimerLines, MARGIN_MM + 5, y);

	addHeaderAndFooter(doc, doc.getNumberOfPages(), doc.getNumberOfPages());
	doc.save('fitforecast-report.pdf');
}
