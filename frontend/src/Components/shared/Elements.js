import React from 'react';

export const LoadingSpinner = () => (
  <div className="spinner-border text-primary" role="status">
    <span className="visually-hidden">Loading...</span>
  </div>
);

export const ErrorMessage = ({ message }) => (
  <div className="alert alert-danger" role="alert">
    {message}
  </div>
);

export const SaveButton = ({ isSubmitting }) => (
  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
    {isSubmitting ? (
      <span>
        <span className="spinner-border spinner-border-sm me-2" />
        Saving...
      </span>
    ) : (
      <span>
        <i className="bi bi-save me-2" />
        Save Changes
      </span>
    )}
  </button>
);
