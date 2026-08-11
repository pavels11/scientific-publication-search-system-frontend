const getErrorMessage = (error) => {
  const data = error.response?.data;

  if (!data) {
    return 'Произошла непредвиденная ошибка';
  }

  if (typeof data === 'string') {
    return data;
  }

  if (data.detail) {
    return data.detail;
  }

  if (data.error) {
    return data.error;
  }

  return Object.entries(data)
    .map(([field, messages]) => {
      if (Array.isArray(messages)) {
        return `${field}: ${messages.join(', ')}`;
      }

      return `${field}: ${messages}`;
    })
    .join(' | ');
};

export default getErrorMessage;
