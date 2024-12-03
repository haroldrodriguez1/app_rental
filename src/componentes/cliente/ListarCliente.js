import React, { useState, useEffect , useCallback  } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TextInput,Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPenToSquare, faTrash, faCirclePlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { TouchableOpacity } from 'react-native';
import { useNavigation ,useFocusEffect} from '@react-navigation/native';
const ip = require('../ip/ip');


const Cliente = () => {
    const navigation = useNavigation();
    const [cliente, setCliente] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [clientebusqueda, setClienteBusqueda] = useState([])
    const [idBusqueda, setIdBusqueda] = useState(''); 
    useEffect(() => {
        const actualizar = navigation.addListener('focus', () => {
            obtenerCliente();
        });
        return actualizar;
    }, [navigation]);

        const obtenerCliente = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken')
                const respuesta = await axios.get('http://'+ip+':3001/api/cliente/listar', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setCliente(respuesta.data);
                setCargando(false);
                setClienteBusqueda(respuesta.data);
            } catch (error) {
                console.error("Error al obtener los clientes", error);
            }
        };
     
        useEffect(() => {
            obtenerCliente();
        }, []);

        const buscarclientePorId = () => {
            if (idBusqueda.trim() === '') {
                setCliente(clientebusqueda.filter((item) => item.estado === 'AC')); 
                return;
            }
            const resultado = clientebusqueda.find(
                (item) => item.clienteId === parseInt(idBusqueda) && item.estado === 'AC'
            );
    
            if (resultado) {
                setCliente([resultado]); 
            } else {
                Alert.alert("No encontrado", `No se encontró ningún cliente con el ID ${idBusqueda}`);
                setIdBusqueda(''); 
                setCliente(clientebusqueda.filter((item) => item.estado)); 
            }
        };
    const eliminarCliente = async (Id) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
           const respuesta = await axios.put(`http://${ip}:3001/api/cliente/eliminar?id=${Id}`,{estado: 'IN'}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            obtenerCliente();
            Alert.alert('Notificacion', JSON.stringify(respuesta.data, null, 2));
            setIdBusqueda('');
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "No se pudo eliminar el cliente, intenta de nuevo.");
        }
    };

    const confirmarEliminacion = (id) => {
        Alert.alert(
            "Confirmar Eliminación",
            `¿Estás seguro de que deseas eliminar el cliente ${id}?`,
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
                <Text style={styles.texttitulo}>Listado de cliente</Text>
                <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate('InsertarEditarCliente')}>
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
                            setCliente(clientebusqueda.filter((item) => item.estado)); 
                        }
                    }}
                />
                <TouchableOpacity style={styles.botonBusqueda} onPress={buscarclientePorId}>
                    <FontAwesomeIcon icon={faSearch} size={20} color="#fff" />
                </TouchableOpacity>
            </View>
            <FlatList

                data={cliente.filter((item) => item.estado === 'AC')}
                keyExtractor={(item) => item.clienteId.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                    <View style={styles.imagenContainer}>
          <Image 
            source={{ uri: `http://${ip}:3001/clientesIMG/${item.nombreImagen}` }} 
            style={styles.imagenVehiculo} 
            resizeMode="cover" 
          />
        </View>
                        <Text style={styles.cardTitle}>Cliente ID: {item.clienteId}</Text>
                        <View style={styles.cardContent}>
                            <Text style={styles.cardText}>PrimerNombre: {item.primernombre}</Text>
                            <Text style={styles.cardText}>SegundoNombre:  {item.segundonombre}</Text>
                            <Text style={styles.cardText}>PrimerApellido: {item.primerapellido}</Text>
                            <Text style={styles.cardText}>SegundoApellido: {item.segundoapellido}</Text>
                            <View style={styles.botonesContainer}>
                                <TouchableOpacity onPress={() => confirmarEliminacion(item.clienteId)}>
                                    <FontAwesomeIcon icon={faTrash} size={24} color="red" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.navigate('Editar cliente',  { cliente: item })}>
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
    imagenVehiculo: {
        width: 150, // Ajusta el tamaño según tus necesidades
        height: 100,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
      },
      imagenContainer: {
        alignItems: 'center', 
        justifyContent: 'center', 
        marginBottom: 10, 
    },
    
});

export default Cliente;
