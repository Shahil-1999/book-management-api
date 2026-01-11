const parseCSV = (fileContent) => {
  const lines = fileContent.toString('utf-8').trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV file must contain header and at least one data row');
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const requiredHeaders = ['title', 'author', 'publishedyear'];
  
  const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
  if (missingHeaders.length > 0) {
    throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
  }

  const data = [];
  const errors = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    
    if (values.every(v => !v)) {
      continue; // Skip empty rows
    }

    const titleIndex = headers.indexOf('title');
    const authorIndex = headers.indexOf('author');
    const yearIndex = headers.indexOf('publishedyear');

    const row = {
      title: values[titleIndex] || '',
      author: values[authorIndex] || '',
      publishedYear: values[yearIndex] || '',
    };

    const validation = validateBookRow(row, i + 1);
    if (validation.error) {
      errors.push({
        row: i + 1,
        data: row,
        error: validation.error,
      });
    } else {
      data.push(validation.data);
    }
  }

  return { data, errors };
};

const validateBookRow = (row, rowNumber) => {
  const errors = [];

  if (!row.title || !row.title.toString().trim()) {
    errors.push('Title is required');
  } else if (row.title.toString().length > 255) {
    errors.push('Title must not exceed 255 characters');
  }

  if (!row.author || !row.author.toString().trim()) {
    errors.push('Author is required');
  } else if (row.author.toString().length > 255) {
    errors.push('Author must not exceed 255 characters');
  }

  const year = parseInt(row.publishedYear, 10);
  if (!row.publishedYear || isNaN(year)) {
    errors.push('Published year must be a valid number');
  } else if (year < 1000 || year > new Date().getFullYear()) {
    errors.push(`Published year must be between 1000 and ${new Date().getFullYear()}`);
  }

  if (errors.length > 0) {
    return {
      error: errors.join('; '),
    };
  }

  return {
    data: {
      title: row.title.toString().trim(),
      author: row.author.toString().trim(),
      publishedYear: year,
    },
  };
};

module.exports = { parseCSV, validateBookRow };
