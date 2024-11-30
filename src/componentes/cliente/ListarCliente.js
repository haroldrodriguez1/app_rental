import React, { useState, useEffect , useCallback  } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPenToSquare, faTrash, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { TouchableOpacity } from 'react-native';
import { useNavigation ,useFocusEffect} from '@react-navigation/native';
const ip = require('../ip/ip');


const Cliente = () => {
    const navigation = useNavigation();
    const [cliente, setCliente] = useState([]);
    const [cargando, setCargando] = useState(true);

        const obtenerCliente = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                const respuesta = await axios.get('http://'+ip+':3001/api/cliente/listar', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setCliente(respuesta.data);
                setCargando(false);
            } catch (error) {
                console.error("Error al obtener los clientes", error);
            }
        };
     
        useEffect(() => {
            obtenerCliente();
        }, []);
        
        useFocusEffect(
            useCallback(() => {
                obtenerCliente();
            }, [])
        );

    const eliminarCliente = async (Id) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
           const respuesta = await axios.delete(`http://${ip}:3001/api/cliente/eliminar?id=${Id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setCliente((prevCliente) =>
                prevCliente.map((cliente) =>
                    cliente.id === Id ? { ...cliente, activo: false } : cliente
                )
            );
            obtenerCliente();
            Alert.alert('Notificacion', JSON.stringify(respuesta.data, null, 2));
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "No se pudo eliminar el cliente, intenta de nuevo.");
        }
    };

    const confirmarEliminacion = (id) => {
        Alert.alert(
            "Confirmar Eliminación",
            "¿Estás seguro de que deseas eliminar este cliente?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", onPress: () => eliminarCliente(id), style: "destructive" }
            ]
        );
    };

    if (cargando) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.contenedor}>
            <View style={styles.titulo}>
                <Text style={styles.texttitulo}>Listado de Cliente</Text>
                <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate('InsertarEditarCliente')}>
                    <FontAwesomeIcon icon={faCirclePlus} size={30} color="#339ef0" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={cliente.filter((item) => item.estado)}
                keyExtractor={(item) => item.clienteId.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Cliente ID: {item.id}</Text>
                        <View style={styles.cardContent}>
                            <Text style={styles.cardText}>PrimerNombre: {item.primernombre}</Text>
                            <Text style={styles.cardText}>SegundoNombre: L {item.segundonombre}</Text>
                            <Text style={styles.cardText}>PrimerApellido: {item.primerapellido}</Text>
                            <Text style={styles.cardText}>SegundoApellido: {item.segundoapellido}</Text>

                            <View style={styles.botonesContainer}>
                                <TouchableOpacity onPress={() => confirmarEliminacion(item.clienteId)}>
                                    <FontAwesomeIcon icon={faTrash} size={24} color="red" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.navigate('InsertarEditarCliente', { clienteId: item.clienteId })}>
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
        backgroundColor: '#f8f8f8',
    },
    titulo: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    texttitulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    boton: {
        marginLeft: 10,
        marginTop: 5,
    },
    card: {
        backgroundColor: '#fff',
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
        color: '#333',
    },
    cardContent: {
        marginTop: 4,
    },
    cardText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 4,
    },
    botonesContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 22,
    },
});

export default Cliente;
