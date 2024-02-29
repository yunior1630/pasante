import React, { useState, useEffect } from 'react';
import './CreateItem.css';

function CreateItem() {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [formData, setFormData] = useState({
    field1: '',
    field2: '',
    field3: '',
    selectedDescription: '',
    selectedDescriptionStatus: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Verificar si la cédula existe al cargar el componente
    if (formData.field1.length == 11) {
      checkCedulaExists(formData.field1);
    }
  }, [formData.field1]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = name === 'field1' ? value.replace(/-/g, '') : value;
    setFormData({ ...formData, [name]: sanitizedValue });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    return;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.field1 || !formData.field2 || !formData.field3 || !formData.selectedDescription||!formData.selectedDescriptionStatus) {
      setErrorMessage('Todos los campos son obligatorios.');
      setSuccessMessage('');
      return;
    }
  
    const dataToSend = { 
      cedula: formData.field1,
      nombre: formData.field2,
      mobile: formData.field3,
      cargo: formData.selectedDescription,
      estado:formData.selectedDescriptionStatus,
    };
  
    let userData;
    let response;
    try {
      userData = await checkCedulaExists(formData.field1);

      if(userData){
        response = await fetch(`https://prminnova.com:8443/api/v1/actualizar-usuario`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(dataToSend),
      })
      }else{
        response = await fetch(`https://prminnova.com:8443/api/v1/crear-usuario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      }
  
  
      if (response.ok) {
        setSuccessMessage('La solicitud se envió correctamente.');
        setErrorMessage('');
        setFormData({
          field1: '',
          field2: '',
          field3: '',
          selectedDescription: '',
          selectedDescriptionStatus: '',

        });
      } else {
        setErrorMessage('Hubo un error al enviar la solicitud.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error al realizar la solicitud POST:', error);
      setErrorMessage('Hubo un error al enviar la solicitud.');
      setSuccessMessage('');
    }
  };
  
  

  const checkCedulaExists = async (cedula) => {
    try {
      const response = await fetch(`https://prminnova.com:8443/api/v1/obtener-usuario?cedula=${cedula}`);
      const data = await response.json();
      console.log(data.usuario);
      if (data.usuario) {
        setFormData({
          ...formData,
          field2: data.usuario.Nombre,
          field3: data.usuario.Telefono_Celular,
          selectedDescription: data.usuario.Cargo || '', // Si no hay cargo, establecer como cadena vacía
          selectedDescriptionStatus: data.usuario.estado || '',
        });
        return 1;
      }
    } catch (error) {
      console.error('Error al verificar la cédula:', error);
    }
  };
  
  const options = [
    { id: '1', description: 'Delegado(a)' },
    { id: '2', description: 'Reporteador(a)' },
  ];
  const optionsStatus = [
    { id: '1', description: 'Habilitar' },
    { id: '0', description: 'Deshabilitar' },
  ];
  return (
    <div className="container">
      <h1>Crear un Reportero</h1>
      <form onSubmit={handleSubmit}>
        <div className="card">
          <div><label htmlFor="field1">Cédula</label></div>
          <input
            type="text"
            id="field1"
            name="field1"
            value={formData.field1}
            maxLength={11}
            onChange={handleInputChange}
            className="input-field"
            required
          />
        </div>
        <div className="card">
          <div><label htmlFor="field2">Nombre y Apellido</label></div>
          <input
            type="text"
            id="field2"
            name="field2"
            value={formData.field2}
            onChange={handleInputChange}
            className="input-field"
            required
          />
        </div>
        <div className="card">
          <div><label htmlFor="field3">Teléfono</label></div>
          <input
            type="text"
            id="field3"
            name="field3"
            value={formData.field3}
            onChange={handleInputChange}
            className="input-field"
            required
          />
        </div>
        <div className="card">
          <div><label htmlFor="selectedDescription">Cargo</label></div>
          <select
            id="selectedDescription"
            name="selectedDescription"
            value={formData.selectedDescription}
            onChange={handleSelectChange}
            className="select-field"
            required
          >
            <option value="">Seleccionar cargo</option>
            {options.map((option) => (
              <option key={option.id} value={option.description}>
                {option.description}
              </option>
            ))}
          </select>
        </div>
        <div className="card">
          <div><label htmlFor="selectedDescriptionStatus">Estado</label></div>
          <select
            id="selectedDescriptionStatus"
            name="selectedDescriptionStatus"
            value={formData.selectedDescriptionStatus}
            onChange={handleSelectChange}
            className="select-field"
            required
          >
            <option value="">Seleccionar estado</option>
            {optionsStatus.map((option) => (
              <option key={option.id} value={option.id}>
                {option.description}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="submit-button">
          Enviar
        </button>
      </form>
      {successMessage && (
        <div className="modal success-modal">
          <p>{successMessage}</p>
          <button onClick={() => setSuccessMessage('')}>Cerrar</button>
        </div>
      )}
      {errorMessage && (
        <div className="modal error-modal">
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage('')}>Cerrar</button>
        </div>
      )}
    </div>
  );
}

export default CreateItem;
