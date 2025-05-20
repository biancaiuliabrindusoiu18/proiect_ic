import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ManualEntry.css';

const ManualEntry = () => {
  const [fields, setFields] = useState([
    {
      name: '',
      value: '',
      unit: '',
      date: '',
      referenceType: 'minmax', // sau 'label'
      min: '',
      max: '',
      label: ''
    }
  ]);

  const navigate = useNavigate();

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


  const handleSave = () => {
    console.log(fields); // trimite datele către backend sau context
    navigate('/upload-analysis');
  };

  const handleCancel = () => {
    navigate('/upload-analysis');
  };

  return (
    <div className="manual-entry-container">
      <h2>Add Analysis Manually</h2>

      {fields.map((field, index) => (
    <div key={index} className="manual-entry-row">
      <input
        type="text"
        placeholder="Name"
        value={field.name}
        onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
      />
      <input
        type="text"
        placeholder="Value"
        value={field.value}
        onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
      />
      <input
        type="text"
        placeholder="Unit"
        value={field.unit}
        onChange={(e) => handleFieldChange(index, 'unit', e.target.value)}
      />
      <input
        type="date"
        value={field.date}
        onChange={(e) => handleFieldChange(index, 'date', e.target.value)}
      />
      <select
        value={field.referenceType}
        onChange={(e) => handleFieldChange(index, 'referenceType', e.target.value)}
      >
        <option value="minmax">Min/Max</option>
        <option value="label">Label</option>
      </select>

      {field.referenceType === 'minmax' ? (
        <>
          <input
            type="text"
            placeholder="Min"
            value={field.min}
            onChange={(e) => handleFieldChange(index, 'min', e.target.value)}
          />
          <input
            type="text"
            placeholder="Max"
            value={field.max}
            onChange={(e) => handleFieldChange(index, 'max', e.target.value)}
          />
        </>
      ) : (
        <input
          type="text"
          placeholder="Label (e.g. positive/negative)"
          value={field.label}
          onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
        />
      )}

      <button className="remove-button" onClick={() => removeField(index)}>
        Remove
      </button>
    </div>

      ))}

      <button className="add-field-button" onClick={addNewField}>+ Add Another Field</button>

      <div className="form-actions">
        <button className="cancel-button" onClick={handleCancel}>Cancel</button>
        <button className="save-button" onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default ManualEntry;
