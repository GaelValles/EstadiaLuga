import React, { useEffect, useState } from 'react';
import Sidepage from "../components/sidebar";
import { getAllPermisos } from '../api/auth.permiso';
import { getAllCamiones } from '../api/auth.camion';
import { useAuth } from '../context/auth.context';

function InicioPage() {
    const { user } = useAuth();
    const [permisos, setPermisos] = useState([]);
    const [camiones, setCamiones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPermisos = async () => {
            try {
                const response = await getAllPermisos();
                setPermisos(response.data);
            } catch (error) {
                console.error('Error al obtener los permisos:', error);
            }
        };

        const fetchCamiones = async () => {
            try {
                const response = await getAllCamiones();
                setCamiones(response.data);
            } catch (error) {
                console.error('Error al obtener los camiones:', error);
            }
        };

        fetchPermisos();
        fetchCamiones();
        setLoading(false);
    }, []);

    const today = new Date();

    const categorizeItems = (items, avisoAntelacionField) => {
        const categorized = {
            oneWeek: [],
            oneMonth: [],
            moreThanMonth: [],
            expired: []
        };

        items.forEach(item => {
            const avisoDate = new Date(item.fechaFinal);
            avisoDate.setDate(avisoDate.getDate() - item[avisoAntelacionField]);
            const timeDiff = avisoDate - today;
            const daysDiff = timeDiff / (1000 * 3600 * 24);

            if (new Date(item.fechaFinal) < today) {
                categorized.expired.push(item);
            } else if (daysDiff <= 7) {
                categorized.oneWeek.push(item);
            } else if (daysDiff <= 30) {
                categorized.oneMonth.push(item);
            } else {
                categorized.moreThanMonth.push(item);
            }
        });

        return categorized;
    };

    const permisosCategorized = categorizeItems(permisos, 'avisoAntelacion');
    const camionesCategorized = categorizeItems(camiones, 'avisoAntelacion');

    return (
        <div className="flex">
            <Sidepage />
            <div className="flex-1 p-6 bg-gray-100 min-h-screen ml-[300px]">

                <h2 className="text-2xl font-semibold mb-4 text-right">Bienvenido, {user.nombreCompleto}!</h2>
                {loading ? (
                    <p className="text-center">Cargando permisos y camiones...</p>
                ) : (
                    <div>
                        {/* Permisos */}
                        <h1 className="text-3xl font-bold mb-6 text-center">Permisos</h1>  
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold mb-4">Permisos Próximos a Vencer</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">1 Semana</h3>
                                    {permisosCategorized.oneWeek.length > 0 ? permisosCategorized.oneWeek.map(permiso => (
                                        <div key={permiso._id} className="bg-white p-4 rounded shadow-md transition-transform transform hover:scale-105 mb-4">
                                            <h3 className="text-xl font-bold">{permiso.titulo}</h3>
                                            <p className="text-gray-600">{permiso.descripcion}</p>
                                            <p className="text-gray-600">Fecha Final: {new Date(permiso.fechaFinal).toLocaleDateString()}</p>
                                        </div>
                                    )) : (
                                        <p>No hay permisos próximos a vencer en 1 semana.</p>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">1 Mes</h3>
                                    {permisosCategorized.oneMonth.length > 0 ? permisosCategorized.oneMonth.map(permiso => (
                                        <div key={permiso._id} className="bg-white p-4 rounded shadow-md transition-transform transform hover:scale-105 mb-4">
                                            <h3 className="text-xl font-bold">{permiso.titulo}</h3>
                                            <p className="text-gray-600">{permiso.descripcion}</p>
                                            <p className="text-gray-600">Fecha Final: {new Date(permiso.fechaFinal).toLocaleDateString()}</p>
                                        </div>
                                    )) : (
                                        <p>No hay permisos próximos a vencer en 1 mes.</p>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Más de 1 Mes</h3>
                                    {permisosCategorized.moreThanMonth.length > 0 ? permisosCategorized.moreThanMonth.map(permiso => (
                                        <div key={permiso._id} className="bg-white p-4 rounded shadow-md transition-transform transform hover:scale-105 mb-4">
                                            <h3 className="text-xl font-bold">{permiso.titulo}</h3>
                                            <p className="text-gray-600">{permiso.descripcion}</p>
                                            <p className="text-gray-600">Fecha Final: {new Date(permiso.fechaFinal).toLocaleDateString()}</p>
                                        </div>
                                    )) : (
                                        <p>No hay permisos próximos a vencer en más de 1 mes.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Permisos Vencidos</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {permisosCategorized.expired.length > 0 ? permisosCategorized.expired.map(permiso => (
                                    <div key={permiso._id} className="bg-white p-4 rounded shadow-md transition-transform transform hover:scale-105 mb-4">
                                        <h3 className="text-xl font-bold">{permiso.titulo}</h3>
                                        <p className="text-gray-600">{permiso.descripcion}</p>
                                        <p className="text-gray-600">Fecha Final: {new Date(permiso.fechaFinal).toLocaleDateString()}</p>
                                    </div>
                                )) : (
                                    <p>No hay permisos vencidos.</p>
                                )}
                            </div>
                        </div>
                        {/* Camiones */}
                        <div className="mt-8">
                        <h1 className="text-3xl font-bold mb-6 text-center">camiones</h1> 
                            <h2 className="text-2xl font-semibold mb-4">Camiones Próximos a Mantenimiento</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">1 Semana</h3>
                                    {camionesCategorized.oneWeek.length > 0 ? camionesCategorized.oneWeek.map(camion => (
                                        <div key={camion._id} className="bg-white p-4 rounded shadow-md transition-transform transform hover:scale-105 mb-4">
                                            <h3 className="text-xl font-bold">{camion.nombre}</h3>
                                            <p className="text-gray-600">Fecha de Mantenimiento: {new Date(camion.fechaMantenimiento).toLocaleDateString()}</p>
                                        </div>
                                    )) : (
                                        <p>No hay camiones próximos a mantenimiento en 1 semana.</p>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">1 Mes</h3>
                                    {camionesCategorized.oneMonth.length > 0 ? camionesCategorized.oneMonth.map(camion => (
                                        <div key={camion._id} className="bg-white p-4 rounded shadow-md transition-transform transform hover:scale-105 mb-4">
                                            <h3 className="text-xl font-bold">{camion.nombre}</h3>
                                            <p className="text-gray-600">Fecha de Mantenimiento: {new Date(camion.fechaMantenimiento).toLocaleDateString()}</p>
                                        </div>
                                    )) : (
                                        <p>No hay camiones próximos a mantenimiento en 1 mes.</p>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Más de 1 Mes</h3>
                                    {camionesCategorized.moreThanMonth.length > 0 ? camionesCategorized.moreThanMonth.map(camion => (
                                        <div key={camion._id} className="bg-white p-4 rounded shadow-md transition-transform transform hover:scale-105 mb-4">
                                            <h3 className="text-xl font-bold">{camion.marca} {camion.modelo}</h3>
                                            <p className="text-gray-600">Fecha de Mantenimiento: {new Date(camion.mantenimiento).toLocaleDateString()}</p>
                                        </div>
                                    )) : (
                                        <p>No hay camiones próximos a mantenimiento en más de 1 mes.</p>
                                    )}
                                                                    </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Camiones con Mantenimiento Vencido</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {camionesCategorized.expired.length > 0 ? camionesCategorized.expired.map(camion => (
                                    <div key={camion._id} className="bg-white p-4 rounded shadow-md transition-transform transform hover:scale-105 mb-4">
                                        <h3 className="text-xl font-bold">{camion.marca} {camion.modelo}</h3>
                                        <p className="text-gray-600">Ultimo mantenimiento: {new Date(camion.mantenimiento).toLocaleDateString()}</p>
                                    </div>
                                )) : (
                                    <p>No hay camiones con mantenimiento vencido.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default InicioPage;

