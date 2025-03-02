import React from "react";

const FormSelector = ({ selectedForm, setSelectedForm }) => {
  const forms = ["Form 1", "Form 2", "Form 3", "Form 4"];

  return (
    <div className="form-selector">
      <label>Select Form:</label>
      <select
        value={selectedForm}
        onChange={(e) => setSelectedForm(e.target.value)}
      >
        {forms.map((form) => (
          <option key={form} value={form}>
            {form}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelector;
