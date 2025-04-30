import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateTimetablePDF = async (timetableElement, fileName) => {
  try {
    // Create canvas from timetable element
    const canvas = await html2canvas(timetableElement, {
      scale: 2,
      useCORS: true,
      logging: false
    });

    // PDF settings
    const imgWidth = 208;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Add title
    pdf.setFontSize(16);
    pdf.text('Academic Timetable', 105, 15, { align: 'center' });

    // Add timetable image
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 25, imgWidth, imgHeight);

    // Add footer
    const today = new Date().toLocaleDateString();
    pdf.setFontSize(10);
    pdf.text(`Generated on: ${today}`, 105, 285, { align: 'center' });

    // Download PDF
    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const generateBulkTimetablePDF = async (timetables, year, specialization) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    let currentPage = 1;
    const totalPages = timetables.length;

    for (let i = 0; i < timetables.length; i++) {
      // Add title for each timetable
      pdf.setFontSize(16);
      pdf.text(`Timetable ${i + 1} of ${totalPages}`, 105, 15, { align: 'center' });
      pdf.setFontSize(14);
      pdf.text(`Year ${year} - ${specialization}`, 105, 25, { align: 'center' });

      const element = document.getElementById(`timetable-${timetables[i]._id}`);
      if (element) {
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false
        });

        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 35, imgWidth, imgHeight);

        // Add page number
        pdf.setFontSize(10);
        pdf.text(`Page ${currentPage} of ${totalPages}`, 105, 285, { align: 'center' });

        // Add new page if not last timetable
        if (i < timetables.length - 1) {
          pdf.addPage();
          currentPage++;
        }
      }
    }

    // Add footer on last page
    const today = new Date().toLocaleDateString();
    pdf.text(`Generated on: ${today}`, 105, 292, { align: 'center' });

    pdf.save(`timetables_year${year}_${specialization.replace(/\s+/g, '_')}.pdf`);
  } catch (error) {
    console.error('Error generating bulk PDF:', error);
    throw error;
  }
};
