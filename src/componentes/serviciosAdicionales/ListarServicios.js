import React, { useState, useEffect , useCallback  } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPenToSquare, faTrash, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { TouchableOpacity } from 'react-native';
import { useNavigation,useFocusEffect } from '@react-navigation/native';
const ip = require('../ip/ip');


const Servicios = () => {
    const navigation = useNavigation();
    const [servicios, setservicios] = useState([]);
    const [cargando, setCargando] = useState(true);

    
        const obtenerservicios = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                const respuesta = await axios.get('http://'+ip+':3001/api/servicio/listar', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setservicios(respuesta.data);
                setCargando(false);
            } catch (error) {
                console.error("Error al obtener los servicios", error);
            }
        };
        
        useEffect(() => {
            obtenerservicios();
        }, []);
        
        useFocusEffect(
            useCallback(() => {
                obtenerservicios();
            }, [])
        );


    const eliminarservicio = async (Id) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const respuesta = await axios.delete(`http://${ip}:3001/api/servicio/eliminar?id=${Id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setservicios((prevservicios) =>
                prevservicios.map((servicio) =>
                    servicio.id === Id ? { ...servicio, activo: false } : servicio
                )
            );
            Alert.alert('Notificacion', JSON.stringify(respuesta.data, null, 2));
            obtenerservicios();
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "No se pudo eliminar el servicio, intenta de nuevo.");
        }
    };

    const confirmarEliminacion = (id) => {
        Alert.alert(
            "Confirmar Eliminación",
            "¿Estás seguro de que deseas eliminar este servicio?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", onPress: () => eliminarservicio(id), style: "destructive" }
            ]
        );
    };

    if (cargando) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.contenedor}>
            <View style={styles.titulo}>
                <Text style={styles.texttitulo}>Listado de servicios</Text>
                <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate('Insertar Editar Servicios')}>
                    <FontAwesomeIcon icon={faCirclePlus} size={30} color="#339ef0" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={servicios}
                 keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>servicio ID: {item.id}</Text>
                        <View style={styles.cardContent}>
                            <Text style={styles.cardText}>Nombre: {item.nombre}</Text>
                            <Text style={styles.cardText}>Costo: L {item.precio}</Text>
                            <Text style={styles.cardText}>Descripción: {item.descripcion}</Text>
                            <View style={styles.botonesContainer}>
                                <TouchableOpacity onPress={() => confirmarEliminacion(item.id)}>
                                    <FontAwesomeIcon icon={faTrash} size={24} color="red" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.navigate('Insertar Editar Servicios', { id: item.id })}>
                                    <FontAwesomeIcon icon={faPenToSquare} size={24} color="#339ef0" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        padding: 13,
        backgroundColor: '#0F3460',

    },
    titulo:{
        flexDirection: 'row', 
        justifyContent:'center',
        marginTop:25
    },
    texttitulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff'
    },
    boton:{
        marginLeft:10,
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
export default Servicios;
