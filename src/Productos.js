// Productos.js
import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import Config from './Config';
import axios from 'axios';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

const Productos = () => {
    const apiUrl = Config.apiUrl;
    const [productos, setProductos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newProductoData, setNewProductoData] = useState({
        nombre: '',
        referencia: '',
        precio: ''
    });
    const [loading, setLoading] = useState(true);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [rowDataToDelete, setRowDataToDelete] = useState(null);

    // Función para cargar los productos
    const fetchProductos = useCallback(() => {
        // Realiza la llamada a la API para obtener los productos
        axios.get(`${apiUrl}/productos`)
            .then(response => {
                console.log(response.data);
                setProductos(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al obtener los productos:', error);
                setLoading(false);
            });
    }, [apiUrl]);

    useEffect(() => {
        fetchProductos();
    }, [fetchProductos]);

    // Función para agregar o actualizar un producto
    const handleInsertOrUpdate = () => {
        console.log('Datos a enviar newProductoData: ', newProductoData);
        console.log('newProductoData.id', newProductoData.id);
        if (newProductoData.id) {
            // Si existe el id, se trata de una modificación
            axios.put(`${apiUrl}/productos/${newProductoData.id}`, newProductoData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    console.log('productos actualizado:', response.data);
                    setShowModal(false);
                    fetchProductos(); // Otra función para recargar la lista de productos
                    resetNewProductoData();
                })
                .catch(error => {
                    console.error('Error al actualizar el productos:', error);
                    // Manejar el error según sea necesario
                });
        } else {
            // Si no existe el id, se trata de una inserción
            axios.post(`${apiUrl}/productos`, newProductoData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    console.log('Producto agregado:', response.data);
                    setShowModal(false);
                    fetchProductos(); // Otra función para recargar la lista de productos
                    resetNewProductoData();
                })
                .catch(error => {
                    console.error('Error al agregar el producto:', error);
                    // Manejar el error según sea necesario
                });
        }
    };

    const resetNewProductoData = () => {
        setNewProductoData({
            id: '',
            nombre: '',
            referencia: '',
            precio: ''
        });
    }

    // Función para editar un producto
    const handleEdit = (rowData) => {
        // Implementa la lógica para editar el cliente
        console.log('Editar cliente:', rowData);
        setNewProductoData({
            id: rowData.IDPRODUCTOS,
            nombre: rowData.NOMBRE,
            referencia: rowData.REFERENCIA,
            precio: rowData.PRECIO
        });
        setShowModal(true); // Mostrar el modal de edición
    };

    // Función para eliminar un producto
    const handleDelete = (rowData) => {
        // Mostrar el diálogo de confirmación antes de eliminar
        setRowDataToDelete(rowData);
        setConfirmDialogVisible(true);
    };

    const confirmDelete = () => {
        // Implementa la lógica para eliminar el cliente
        axios.delete(`${apiUrl}/productos/${rowDataToDelete.id}`)
            .then(response => {
                console.log(response.data.message);
                fetchProductos(); // Volver a cargar la lista de clientes después de eliminar
            })
            .catch(error => {
                console.error('Error al eliminar el producto:', error);
                // Manejar el error según sea necesario
            });
        setConfirmDialogVisible(false); // Oculta el diálogo después de eliminar
    }

    const cancelDelete = () => {
        setConfirmDialogVisible(false); // Oculta el diálogo si se cancela la eliminación
    }

    const footerContent = (
        <div>
            <Button label="Cancelar" icon="pi pi-times"
                onClick={() => cancelDelete(false)} className="p-button-text" />
            <Button label="Sí" icon="pi pi-check"
                onClick={() => confirmDelete(false)} autoFocus />
        </div>
    );


    // Función para renderizar las acciones (editar y eliminar)
    const renderActions = (rowData) => {
        return (
            <div className="flex flex-wrap justify-content-center gap-3 ">
                <Button icon="pi pi-pencil" rounded text raised size='medium' aria-label="Editar"
                    tooltip="Editar" tooltipOptions={{ position: 'left' }}
                    style={{ color: 'slateblue', textAlign: 'center' }}
                    onClick={() => handleEdit(rowData)} />
                <Button icon="pi pi-times" rounded text raised size='medium' aria-label="Eliminar"
                    tooltip="Eliminar" style={{ color: 'red' }}
                    onClick={() => handleDelete(rowData)} />
            </div>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-left">
                <Button type="button" icon="pi pi-plus" label='Añadir Producto' onClick={() => setShowModal(true)} />
            </div>
        );
    };

    const header = renderHeader();

    const formatCurrency = (rowData) => {
        return rowData.PRECIO.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }); // Cambia 'EUR' según la moneda que desees
    }


    return (
        <div>
            <div className="card">
                <div>
                    <h1>Listado de Productos</h1>
                </div>
                <div>
                    <DataTable value={productos} header={header} responsive="true" id="IDPRODUCTO"
                        loading={loading} paginator rows={10} rowsPerPageOptions={[5, 10, 25]}>
                        <Column field="NOMBRE" header="Nombre" sortable headerStyle={{ textAlign: 'center', fontSize: '1.2em' }} />
                        <Column field="REFERENCIA" header="Referencia" sortable headerStyle={{ textAlign: 'center', fontSize: '1.2em' }} />
                        <Column field="PRECIO" header="Precio" sortable headerStyle={{ textAlign: 'center', fontSize: '1.2em' }} body={formatCurrency} />
                        <Column header="Acciones" headerStyle={{ textAlign: 'center', fontSize: '1.2em' }} body={renderActions} />
                    </DataTable>
                </div>
                {/* Modal para agregar/editar producto */}
                <Dialog visible={showModal} onHide={() => setShowModal(false)} header="Agregar/Editar Producto">
                    <div className="card">
                        <div >
                            {/* Formulario para agregar/editar producto */}
                            <input type="hidden" id="id" value={newProductoData.id} />
                            <div className="flex-auto">
                                <label htmlFor="Nombre" className="font-bold block mb-2">Nombre</label>
                                <InputText value={newProductoData.nombre} onChange={(e) => setNewProductoData({ ...newProductoData, nombre: e.target.value })} />
                            </div>
                            <div className="flex-auto">
                                <label htmlFor="Referencia" className="font-bold block mb-2">Referencia</label>
                                <InputText value={newProductoData.referencia} onChange={(e) => setNewProductoData({ ...newProductoData, referencia: e.target.value })} />
                            </div>
                            <div className="flex-auto">
                                <label htmlFor="Precio" className="font-bold block mb-2">Precio</label>
                                <InputText value={newProductoData.precio} onChange={(e) => setNewProductoData({ ...newProductoData, precio: e.target.value })} />
                            </div>
                            <div className="flex flex-wrap justify-content-center gap-4 -mb-3 " >
                                <Button label="Guardar" className="p-button-success" onClick={handleInsertOrUpdate} />
                                <Button label="Cancelar" className="p-button-secondary" onClick={() => setShowModal(false)} />
                            </div>
                        </div>
                    </div>
                </Dialog>
                {/* Diálogo de confirmación para eliminar */}
                <Dialog header="Confirmar Eliminación" visible={confirmDialogVisible} onHide={() => setConfirmDialogVisible(false)} footer={footerContent}>
                    <div>
                        <p>¿Estás seguro que deseas eliminar el producto {rowDataToDelete && `${rowDataToDelete.NOMBRE} ${rowDataToDelete.REFERENCIA}`}?</p>
                    </div>
                </Dialog>
            </div>
        </div>
    );
}

export default Productos;
