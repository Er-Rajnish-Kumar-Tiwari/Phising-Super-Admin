export const createExcelFileDownloadbleLink = (args: {
    data: any
    fName: string
  }) => {
    const { data, fName } = args
    const file = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
    })
    const fileURL = window.URL.createObjectURL(file)
  
    const linkElement = document.createElement('a')
    linkElement.href = fileURL
    linkElement.setAttribute('download', `${fName}`)
    document.body.appendChild(linkElement)
    linkElement.click()
    document.body.removeChild(linkElement)
    window.URL.revokeObjectURL(fileURL)
  }

  export const createCSVFileDownloadableLink = (args: {
    data: string
    fName: string
  }) => {
    const { data, fName } = args;
  
    const file = new Blob([data], {
      type: 'text/csv;charset=utf-8;',
    });
  
    const fileURL = window.URL.createObjectURL(file);
    const linkElement = document.createElement('a');
    linkElement.href = fileURL;
    linkElement.setAttribute('download', fName.endsWith('.csv') ? fName : `${fName}.csv`);
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    window.URL.revokeObjectURL(fileURL);
  };


  export const createTextFileDownloadableLink = (args: {
  content: string;
  fileName: string;
  mimeType?: string;
}) => {
  const { content, fileName, mimeType = 'text/plain' } = args;
  
  // Create blob with proper MIME type
  // const tableContent = formatTable(content);
  const blob = new Blob([content], { type: mimeType });
  const fileURL = URL.createObjectURL(blob);

  // Create and trigger download link
  const link = document.createElement('a');
  link.href = fileURL;
  link.setAttribute('download', fileName);
  
  // Append, click, and clean up
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(fileURL);
  }, 0);
};