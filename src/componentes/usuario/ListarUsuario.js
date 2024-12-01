import React, { useState, useEffect, useCallback } from 'react'; 
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPenToSquare, faTrash, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
const ip = require('../ip/ip');

const Usuarios = () => {
    const navigation = useNavigation();
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);

    const obtenerUsuarios = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const respuesta = await axios.get(`http://${ip}:3001/api/usuario/listar`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            setUsuarios(respuesta.data);
            setCargando(false);
        } catch (error) {
            console.error("Error al obtener los usuarios", error);
        }
    };

    useEffect(() => {
        obtenerUsuarios();
    }, []);

    useFocusEffect(
        useCallback(() => {
            obtenerUsuarios();
        }, [])
    );

    const eliminarUsuario = async (id) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const respuesta = await axios.delete(`http://${ip}:3001/api/usuario/eliminar?id=${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            setUsuarios((prevUsuarios) =>
                prevUsuarios.map((usuario) =>
                    usuario.id === id ? { ...usuario, estado: 'BL' } : usuario
                )
            );
            obtenerUsuarios();
            Alert.alert('Notificación', JSON.stringify(respuesta.data, null, 2));
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "No se pudo eliminar el usuario, intenta de nuevo.");
        }
    };

    const confirmarEliminacion = (id) => {
        Alert.alert(
            "Confirmar Eliminación",
            "¿Estás seguro de que deseas eliminar este usuario?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", onPress: () => eliminarUsuario(id), style: "destructive" }
            ]
        );
    };

    if (cargando) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.contenedor}>
            <View style={styles.titulo}>
                <Text style={styles.texttitulo}>Listado de Usuarios</Text>
                <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate('InsertarEditarUsuarios')}>
                    <FontAwesomeIcon icon={faCirclePlus} size={30} color="#339ef0" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={usuarios.filter((item) => item.estado === 'AC')}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Usuario ID: {item.id}</Text>
                        <View style={styles.cardContent}>
                            <Text style={styles.cardText}>Nombre de usuario: {item.nombreUsuario}</Text>
                            <Text style={styles.cardText}>Correo: {item.correo}</Text>
                            <Text style={styles.cardText}>Tipo de usuario: {item.tipoUsuario}</Text>
                            <View style={styles.botonesContainer}>
                                <TouchableOpacity onPress={() => confirmarEliminacion(item.id)}>
                                    <FontAwesomeIcon icon={faTrash} size={24} color="red" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.navigate('InsertarEditarUsuarios', { id: item.id })}>
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
        marginTop: 25
    },
    texttitulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff'
    },
    boton: {
        marginLeft: 10,
        marginTop: 5
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
        gap: 22
    },
});

export default Usuarios;