// Clientes.js
import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import Config from './Config'; // Importa el archivo Config.js
import axios from 'axios';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newClienteData, setNewClienteData] = useState({
        id: '',
        nombres: '',
        apellidos: '',
        identidad: '',
        telefono: ''
    });
    const apiUrl = Config.apiUrl;
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [rowDataToDelete, setRowDataToDelete] = useState(null); // Guarda la fila que se eliminará
    const [loading, setLoading] = useState(true);

    //http://localhost:3000/clientes
    //https://quoterb.onrender.com/clientes
    // const fetchClientes = () => {
    const fetchClientes = useCallback(() => {
        axios.get(`${apiUrl}/clientes`)
            .then(response => {
                setClientes(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al obtener los clientes:', error);
                setLoading(false);
            });
    }, [apiUrl]);


    useEffect(() => {
        fetchClientes();
    }, [fetchClientes]);


    const handleInsert = () => {
        console.log('Datos a enviar newClienteData: ', newClienteData);
        console.log('newClienteData.id', newClienteData.id);
        if (newClienteData.id) {
            // Si existe el id, se trata de una modificación
            axios.put(`${apiUrl}/clientes/${newClienteData.id}`, newClienteData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    console.log('Cliente actualizado:', response.data);
                    setShowModal(false);
                    fetchClientes(); // Otra función para recargar la lista de clientes
                    resetNewClienteData();
                })
                .catch(error => {
                    console.error('Error al actualizar el cliente:', error);
                    // Manejar el error según sea necesario
                });
        } else {
            // Si no existe el id, se trata de una inserción
            axios.post(`${apiUrl}/clientes`, newClienteData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    console.log('Cliente agregado:', response.data);
                    setShowModal(false);
                    fetchClientes(); // Otra función para recargar la lista de clientes
                    resetNewClienteData();
                })
                .catch(error => {
                    console.error('Error al agregar el cliente:', error);
                    // Manejar el error según sea necesario
                });
        }
    }

    const handleEdit = (rowData) => {
        // Implementa la lógica para editar el cliente
        console.log('Editar cliente:', rowData);
        setNewClienteData({
            id: rowData.IDCLIENTES,
            nombre: rowData.NOMBRES,
            apellido: rowData.APELLIDOS,
            identidad: rowData.IDENTIDAD,
            telefono: rowData.TELEFONO
        });
        setShowModal(true); // Mostrar el modal de edición
    }

    // Función para establecer los valores en blanco en newClienteData
    const resetNewClienteData = () => {
        setNewClienteData({
            id: '',
            nombres: '',
            apellidos: '',
            identidad: '',
            telefono: ''
        });
    }

    const handleDelete = (rowData) => {
        // Mostrar el diálogo de confirmación antes de eliminar
        setRowDataToDelete(rowData);
        setConfirmDialogVisible(true);
    }

    const confirmDelete = () => {
        // Implementa la lógica para eliminar el cliente
        axios.delete(`${apiUrl}/clientes/${rowDataToDelete.id}`)
            .then(response => {
                console.log(response.data.message);
                fetchClientes(); // Volver a cargar la lista de clientes después de eliminar
            })
            .catch(error => {
                console.error('Error al eliminar el cliente:', error);
                // Manejar el error según sea necesario
            });
        setConfirmDialogVisible(false); // Oculta el diálogo después de eliminar
    }

    const cancelDelete = () => {
        setConfirmDialogVisible(false); // Oculta el diálogo si se cancela la eliminación
    }

    const footerContent = (
        <div>
            <Button label="Cancelar" icon="pi pi-times" onClick={() => cancelDelete(false)} className="p-button-text" />
            <Button label="Sí" icon="pi pi-check" onClick={() => confirmDelete(false)} autoFocus />
        </div>
    );

    const renderActions = (rowData) => {
        return (
            <div className="flex flex-wrap justify-content-center gap-3 ">
                <Button icon="pi pi-pencil" rounded text raised size='medium' aria-label="Editar" tooltip="Editar" tooltipOptions={{ position: 'left' }} style={{ color: 'slateblue', textAlign: 'center' }} onClick={() => handleEdit(rowData)} />
                <Button icon="pi pi-times" rounded text raised size='medium' aria-label="Eliminar" tooltip="Eliminar" style={{ color: 'red' }} onClick={() => handleDelete(rowData)} />
            </div>
        );
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-content-left">
                <Button type="button" icon="pi pi-plus" label='Añadir cliente' onClick={() => setShowModal(true)} />
            </div>
        );
    };

    const header = renderHeader();

    return (
        <div >
            <div className="card">
                <div>
                    <h1>Listado de clientes</h1>
                </div>
                <div>
                    <DataTable value={clientes} header={header} loading={loading}
                        responsive="true" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} id="IDCLIENTE">
                        <Column field="NOMBRES" header="Nombres" sortable headerStyle={{ textAlign: 'center', fontSize: '1.2em' }} />
                        <Column field="APELLIDOS" header="Apellidos" sortable headerStyle={{ textAlign: 'center', fontSize: '1.2em' }} />
                        <Column field="IDENTIDAD" header="Identidad" sortable headerStyle={{ textAlign: 'center', fontSize: '1.2em' }} />
                        <Column field="TELEFONO" header="Telefono" sortable headerStyle={{ textAlign: 'center', fontSize: '1.2em' }} />
                        <Column header="Acciones" headerStyle={{ textAlign: 'center', fontSize: '1.2em' }} body={renderActions} />
                        {/* Agrega más columnas según tus datos */}
                    </DataTable>
                </div>
                {/* Modal para agregar nuevo cliente */}
                <Dialog visible={showModal} onHide={() => setShowModal(false)} header="Agregar Cliente">
                    <div className="card">
                        <div className="flex flex-wrap gap-3 mb-4">
                            <input type="hidden" id="id" value={newClienteData.id} /> {/* Input oculto para el id del cliente */}
                            <div className="flex-auto">
                                <label htmlFor="nombres" className="font-bold block mb-2">Nombres</label>
                                <InputText id="nombres" type="text" className="p-inputtext-sm" placeholder="Nombres" value={newClienteData.nombres} onChange={(e) => setNewClienteData({ ...newClienteData, nombres: e.target.value })} />
                            </div>
                            <div className="flex-auto">
                                <label htmlFor="apellidos" className="font-bold block mb-2">Apellidos</label>
                                <InputText id="apellidos" type="text" className="p-inputtext-sm" placeholder="Apellidos" value={newClienteData.apellidos} onChange={(e) => setNewClienteData({ ...newClienteData, apellidos: e.target.value })} />
                            </div>
                            <div className="flex-auto">
                                <label htmlFor="identidad" className="font-bold block mb-2">Identidad</label>
                                <InputText id="identidad" type="text" className="p-inputtext-sm" placeholder="Identidad" value={newClienteData.identidad} onChange={(e) => setNewClienteData({ ...newClienteData, identidad: e.target.value })} />
                            </div>
                            <div className="flex-auto">
                                <label htmlFor="telefono" className="font-bold block mb-2">Teléfono</label>
                                <InputText id="telefono" type="text" className="p-inputtext-sm" placeholder="Telefono" value={newClienteData.telefono} onChange={(e) => setNewClienteData({ ...newClienteData, telefono: e.target.value })} />
                            </div>
                            <div className="flex flex-wrap justify-content-center gap-3">
                                <Button label="Guardar" className="p-button-success" onClick={handleInsert} />
                                <Button label="Cancelar" className="p-button-secondary" onClick={() => setShowModal(false)} />
                            </div>
                        </div>
                    </div>
                </Dialog>
                {/* Diálogo de confirmación para eliminar */}
                <Dialog header="Confirmar Eliminación" visible={confirmDialogVisible} onHide={() => setConfirmDialogVisible(false)} footer={footerContent}>
                    <div>
                        <p>¿Estás seguro que deseas eliminar al cliente {rowDataToDelete && `${rowDataToDelete.NOMBRES} ${rowDataToDelete.APELLIDOS}`}?</p>
                    </div>
                </Dialog>
            </div>
        </div >
    );
}

export default Clientes;
