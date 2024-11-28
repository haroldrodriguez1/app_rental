import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from "axios";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ip = require('../ip/ip');

const Login = () => {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const navigation = useNavigation();

    const iniciarSesion = async () => {
        try {
            const respuesta = await axios.post('http://'+ip+':3001/api/usuarios/iniciosesion', { login: usuario, contrasena: contrasena });
            const datos = respuesta.data;
            if (datos.token) {
                await AsyncStorage.setItem('authToken', datos.token);

                Alert.alert('Login exitoso');
                navigation.navigate('Menu Principal');
            } else {
                Alert.alert(datos.error || 'Error desconocido');
            }
        } catch (error) {
            Alert.alert('Error', 'Hubo un problema al intentar iniciar sesión.');
            console.error(error);
        }
    }

    return (
        <View style={estilos.contenedor}>
            <Text style={estilos.titulo}>Bienvenido</Text>
            <TextInput
                style={estilos.entradas}
                placeholder="Usuario o correo"
                placeholderTextColor="#AAA"
                value={usuario}
                onChangeText={(text) => setUsuario(text)}
            />
            <TextInput
                style={estilos.entradas}
                placeholder="Contraseña"
                placeholderTextColor="#AAA"
                secureTextEntry
                value={contrasena}
                onChangeText={(text) => setContrasena(text)}
            />
            <TouchableOpacity style={estilos.boton} onPress={iniciarSesion}>
                <Text style={estilos.textoBoton}>Iniciar Sesión</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('EnviarPin')}>
                <Text style={estilos.textoLink}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
        </View>
    );
};

const estilos = StyleSheet.create({
    contenedor: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1A1A2E', // Fondo oscuro.
        padding: 20,
    },
    titulo: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF', // Texto blanco.
        marginBottom: 20,
        textAlign: 'center',
    },
    entradas: {
        width: '100%',
        height: 50,
        borderColor: '#FFF',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 16,
        paddingHorizontal: 15,
        color: '#FFF', // Texto blanco.
        backgroundColor: '#2F2F3E', // Fondo más claro para los inputs.
    },
    boton: {
        width: '100%',
        height: 50,
        backgroundColor: '#E94560', // Color principal (rojo).
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 20,
    },
    textoBoton: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    textoLink: {
        color: '#E94560', // Color rojo para el link.
        fontSize: 14,
        marginTop: 15,
        textAlign: 'center',
        textDecorationLine: 'underline', // Subrayado para el texto de enlace.
    },
});

export default Login;
