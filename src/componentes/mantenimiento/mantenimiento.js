import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TextInput } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPenToSquare, faTrash, faCirclePlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ip = require('../ip/ip');

const Mantenimiento = () => {
    const navigation = useNavigation();
    const [mantenimiento, setmantenimiento] = useState([]);
    const [mantenimientoBusqueda, setmantenimientoBusqueda] = useState([]); 
    const [cargando, setCargando] = useState(true);
    const [idBusqueda, setIdBusqueda] = useState(''); 

    useEffect(() => {
        const actualizar = navigation.addListener('focus', () => {
            obtenerMantenimiento();
        });
        return actualizar;
    }, [navigation]);

    const obtenerMantenimiento = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const respuesta = await axios.get('http://' + ip + ':3001/api/mantenimiento/listar', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setmantenimiento(respuesta.data.filter((item) => item.activo)); 
            setmantenimientoBusqueda(respuesta.data); 
            setCargando(false);
        } catch (error) {
            console.error("Error al obtener los mantenimiento", error);
        }
    };

    useEffect(() => {
        obtenerMantenimiento();
    }, []);

    const buscarMantenimientoPorId = () => {
        if (idBusqueda.trim() === '') {
            setmantenimiento(mantenimientoBusqueda.filter((item) => item.activo)); 
            return;
        }

        const resultado = mantenimientoBusqueda.find(
            (item) => item.IdMantenimiento === parseInt(idBusqueda) && item.activo
        );

        if (resultado) {
            setmantenimiento([resultado]); 
        } else {
            Alert.alert("No encontrado", `No se encontró ningún mantenimiento activo con el ID ${idBusqueda}`);
            setIdBusqueda(''); 
            setmantenimiento(mantenimientoBusqueda.filter((item) => item.activo)); 
        }
    };

    const eliminarMantenimiento = async (Id) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            await axios.put(`http://${ip}:3001/api/mantenimiento/eliminar?IdMantenimiento=${Id}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setmantenimiento((prevMantenimiento) =>
                prevMantenimiento.filter((mto) => mto.IdMantenimiento !== Id) 
            );
            setmantenimientoBusqueda((prevMantenimiento) =>
                prevMantenimiento.map((mto) =>
                    mto.IdMantenimiento === Id ? { ...mto, activo: false } : mto
                )
            );
            Alert.alert("Éxito", "El mantenimiento fue eliminado correctamente");
        } catch (error) {
            Alert.alert("Error", "No se pudo eliminar el mantenimiento, intenta de nuevo.");
        }
    };

    const confirmarEliminacion = (IdMantenimiento) => {
        Alert.alert(
            "Confirmar eliminación",
            `¿Estás seguro de que deseas eliminar el mantenimiento ${IdMantenimiento}?`,
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", onPress: () => eliminarMantenimiento(IdMantenimiento), style: "destructive" }
            ]
        );
    };

    if (cargando) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.contenedor}>
            <View style={styles.titulo}>
                <Text style={styles.texttitulo}>Listado de mantenimiento</Text>
                <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate('Insertar mantenimiento')}>
                    <FontAwesomeIcon icon={faCirclePlus} size={30} color="#339ef0" />
                </TouchableOpacity>
            </View>
            <View style={styles.barraBusqueda}>
                <TextInput
                    style={styles.inputBusqueda}
                    placeholder="Buscar por ID"
                    placeholderTextColor="#aaa"
                    value={idBusqueda}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                        setIdBusqueda(text);
                        if (text.trim() === '') {
                            setmantenimiento(mantenimientoBusqueda.filter((item) => item.activo)); 
                        }
                    }}
                />
                <TouchableOpacity style={styles.botonBusqueda} onPress={buscarMantenimientoPorId}>
                    <FontAwesomeIcon icon={faSearch} size={20} color="#fff" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={mantenimiento} 
                keyExtractor={(item) => item.IdMantenimiento.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Mantenimiento ID: {item.IdMantenimiento}</Text>
                        <View style={styles.cardContent}>
                            <Text style={styles.cardText}>Descripción: {item.descripcion}</Text>
                            <Text style={styles.cardText}>Costo: L {item.costo}</Text>
                            <Text style={styles.cardText}>
                                Fecha: {item.fecha_mantenimiento.split('T')[0]}
                            </Text>
                            <Text style={styles.cardText}>Vehículo: {item.vehiculoId}</Text>
                            <View style={styles.botonesContainer}>
                                <TouchableOpacity onPress={() => confirmarEliminacion(item.IdMantenimiento)}>
                                    <FontAwesomeIcon icon={faTrash} size={24} color="red" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.navigate('Editar mantenimiento', { mantenimiento: item })}>
                                    <FontAwesomeIcon icon={faPenToSquare} size={24} color="#339ef0" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        padding: 13,
        backgroundColor: '#0F3460',
    },
    titulo: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25,
    },
    texttitulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    boton: {
        marginLeft: 10,
        marginTop: 5,
    },
    barraBusqueda: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        backgroundColor: '#1A1A2E',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    inputBusqueda: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
    },
    botonBusqueda: {
        marginLeft: 10,
        padding: 5,
    },
    card: {
        backgroundColor: '#1A1A2E',
        padding: 16,
        marginVertical: 8,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#ffffff',
    },
    cardContent: {
        marginTop: 4,
    },
    cardText: {
        fontSize: 16,
        color: '#ffffff',
        marginBottom: 4,
    },
    botonesContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 22,
    },
});

export default Mantenimiento;
