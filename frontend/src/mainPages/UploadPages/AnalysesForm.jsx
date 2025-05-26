import React from 'react';

const analysesForm = ({ fields, setFields }) => {

    const handleFieldChange = (index, field, value) => {
    const newFields = [...fields];
    newFields[index][field] = value;
    setFields(newFields);
  };

  const addNewField = () => {
    setFields([
      ...fields,
      {
        name: '',
        value: '',
        unit: '',
        date: '',
        referenceType: 'minmax',
        min: '',
        max: '',
        label: ''
      }
    ]);
  };

  const removeField = (index) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  return (
    <div className="manual-entry-container">
      {fields.map((field, index) => (
        <div key={index} className="manual-entry-row">
          <input
            type="date"
            value={field.date}
            onChange={(e) => handleFieldChange(index, 'date', e.target.value)}
            className="manual-entry-date-input"
          />
          <input
            type="text"
            placeholder="analysis Name"
            value={field.name}
            onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
            className="manual-entry-name-input"
          />
          <input
            type="text"
            placeholder="Value"
            value={field.value}
            onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
            className="manual-entry-value-input"
          />
          <input
            type="text"
            placeholder="Unit"
            value={field.unit}
            onChange={(e) => handleFieldChange(index, 'unit', e.target.value)}
            className="manual-entry-unit-input"
          />

          <select
            value={field.referenceType}
            onChange={(e) => handleFieldChange(index, 'referenceType', e.target.value)}
            className="manual-entry-reference-type-select"
          >
            <option value="minmax">Min - Max type reference</option>
            <option value="label">Non-value type reference</option>
          </select>

          {field.referenceType === 'minmax' ? (
            <>
              <input
                type="text"
                placeholder="Min value (optional)"
                value={field.min}
                onChange={(e) => handleFieldChange(index, 'min', e.target.value)}
                className="manual-entry-ref-input"
              />
              <input
                type="text"
                placeholder="Max value (optional)"
                value={field.max}
                onChange={(e) => handleFieldChange(index, 'max', e.target.value)}
                className="manual-entry-ref-input"
              />
            </>
          ) : (
            <input
              type="text"
              placeholder="Label (e.g. positive/negative)"
              value={field.label}
              onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
              className="manual-entry-noval-input"
            />
          )}

{index !== 0 && (
  <button
    className="remove-button"
    onClick={() => removeField(index)}
  >
    Remove
  </button>
)}
        </div>
      ))}

      <button className="add-field-button" onClick={addNewField}>
        + Add Another Field
      </button>
    </div>
  );
};

export default analysesForm;
