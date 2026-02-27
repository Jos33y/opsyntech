import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency, formatDate } from './formatters';

export async function generateInvoicePDF(invoice, profile) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = margin;

    // Colors
    const orange = [255, 107, 0];
    const darkGray = [51, 51, 51];
    const mediumGray = [102, 102, 102];
    const lightGray = [200, 200, 200];

    // Company info (left side)
    doc.setFontSize(20);
    doc.setTextColor(...darkGray);
    doc.setFont('helvetica', 'bold');
    doc.text(profile?.company_name || 'OPSYN TECHNOLOGIES', margin, y);
    
    y += 6;
    
    if (profile?.tagline) {
        doc.setFontSize(9);
        doc.setTextColor(...mediumGray);
        doc.setFont('helvetica', 'normal');
        doc.text(profile.tagline, margin, y);
        y += 4;
    }

    // Orange underline
    doc.setDrawColor(...orange);
    doc.setLineWidth(1);
    doc.line(margin, y, margin + 60, y);

    // Invoice title (right side)
    doc.setFontSize(28);
    doc.setTextColor(...darkGray);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', pageWidth - margin, margin, { align: 'right' });
    
    doc.setFontSize(10);
    doc.setTextColor(...mediumGray);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.invoice_number, pageWidth - margin, margin + 8, { align: 'right' });

    y = margin + 25;

    // Company contact info
    doc.setFontSize(9);
    doc.setTextColor(...mediumGray);
    
    if (profile?.address) {
        doc.text(profile.address, margin, y);
        y += 4;
    }
    if (profile?.phone) {
        doc.text(profile.phone, margin, y);
        y += 4;
    }
    if (profile?.email) {
        doc.text(profile.email, margin, y);
        y += 4;
    }
    if (profile?.rc_number) {
        doc.text('RC: ' + profile.rc_number, margin, y);
    }

    y = 65;

    // Bill To section
    doc.setFontSize(8);
    doc.setTextColor(...mediumGray);
    doc.setFont('helvetica', 'bold');
    doc.text('BILL TO', margin, y);
    
    y += 5;
    doc.setFontSize(11);
    doc.setTextColor(...darkGray);
    doc.setFont('helvetica', 'bold');
    doc.text(invoice.client_name || 'Client', margin, y);
    
    y += 5;
    doc.setFontSize(9);
    doc.setTextColor(...mediumGray);
    doc.setFont('helvetica', 'normal');
    
    if (invoice.client_address) {
        doc.text(invoice.client_address, margin, y);
        y += 4;
    }
    if (invoice.client_phone) {
        doc.text(invoice.client_phone, margin, y);
        y += 4;
    }
    if (invoice.client_email) {
        doc.text(invoice.client_email, margin, y);
    }

    // Invoice details (right side)
    const detailsX = pageWidth - margin - 60;
    let detailsY = 65;

    doc.setFontSize(9);
    doc.setTextColor(...mediumGray);
    
    doc.text('Invoice Date:', detailsX, detailsY);
    doc.setTextColor(...darkGray);
    doc.text(formatDate(invoice.invoice_date, 'long'), pageWidth - margin, detailsY, { align: 'right' });
    
    detailsY += 6;
    doc.setTextColor(...mediumGray);
    doc.text('Due Date:', detailsX, detailsY);
    doc.setTextColor(...darkGray);
    doc.text(formatDate(invoice.due_date, 'long'), pageWidth - margin, detailsY, { align: 'right' });
    
    if (invoice.project_name) {
        detailsY += 6;
        doc.setTextColor(...mediumGray);
        doc.text('Project:', detailsX, detailsY);
        doc.setTextColor(...darkGray);
        doc.text(invoice.project_name, pageWidth - margin, detailsY, { align: 'right' });
    }

    y = Math.max(y, detailsY) + 15;

    // Items table
    const tableData = invoice.items?.map(item => [
        item.description,
        item.quantity.toString(),
        formatCurrency(item.unit_price),
        formatCurrency(item.total)
    ]) || [];

    doc.autoTable({
        startY: y,
        head: [['Description', 'Qty', 'Unit Price', 'Total']],
        body: tableData,
        margin: { left: margin, right: margin },
        styles: {
            fontSize: 9,
            cellPadding: 4,
            textColor: darkGray,
            lineColor: lightGray,
            lineWidth: 0.1
        },
        headStyles: {
            fillColor: [245, 245, 245],
            textColor: mediumGray,
            fontStyle: 'bold',
            fontSize: 8
        },
        columnStyles: {
            0: { cellWidth: 'auto' },
            1: { cellWidth: 25, halign: 'center' },
            2: { cellWidth: 35, halign: 'right' },
            3: { cellWidth: 35, halign: 'right' }
        },
        alternateRowStyles: {
            fillColor: [252, 252, 252]
        }
    });

    y = doc.lastAutoTable.finalY + 10;

    // Totals section (right aligned)
    const totalsX = pageWidth - margin - 80;
    const totalsValueX = pageWidth - margin;

    doc.setFontSize(9);
    doc.setTextColor(...mediumGray);
    doc.text('Subtotal', totalsX, y);
    doc.setTextColor(...darkGray);
    doc.text(formatCurrency(invoice.subtotal), totalsValueX, y, { align: 'right' });

    if (invoice.adjustments && parseFloat(invoice.adjustments) !== 0) {
        y += 6;
        doc.setTextColor(...mediumGray);
        doc.text(invoice.adjustments_label || 'Adjustments', totalsX, y);
        doc.setTextColor(...darkGray);
        doc.text(formatCurrency(invoice.adjustments), totalsValueX, y, { align: 'right' });
    }

    y += 8;
    doc.setDrawColor(...lightGray);
    doc.setLineWidth(0.5);
    doc.line(totalsX, y, totalsValueX, y);
    
    y += 6;
    doc.setFontSize(12);
    doc.setTextColor(...darkGray);
    doc.setFont('helvetica', 'bold');
    doc.text('Total', totalsX, y);
    doc.setTextColor(...orange);
    doc.text(formatCurrency(invoice.total), totalsValueX, y, { align: 'right' });

    // Notes section
    if (invoice.notes) {
        y += 20;
        doc.setFontSize(8);
        doc.setTextColor(...mediumGray);
        doc.setFont('helvetica', 'bold');
        doc.text('NOTES', margin, y);
        
        y += 5;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const splitNotes = doc.splitTextToSize(invoice.notes, pageWidth - (margin * 2));
        doc.text(splitNotes, margin, y);
    }

    // Footer with orange bar
    const footerY = doc.internal.pageSize.getHeight() - 15;
    doc.setFillColor(...orange);
    doc.rect(0, footerY, pageWidth, 15, 'F');
    
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for your business', pageWidth / 2, footerY + 9, { align: 'center' });

    // Save
    doc.save(invoice.invoice_number + '.pdf');
}
