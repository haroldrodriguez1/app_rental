import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';

const RecuperarContrasena = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { correo } = route.params;
  const [pin, setPin] = useState('');
  const [nuevaContrasena, setnuevaContrasena] = useState('');

  const cambiar = async () => {
    try {
      const respuesta = await axios.post('http://192.168.0.8:3001/api/usuarios/contrasena', { pin: pin, contrasena: nuevaContrasena, correo: correo });
      console.log('Cambiar Contraseña:', respuesta.data);
      Alert.alert('Contraseña cambiada', 'Tu contraseña ha sido cambiada exitosamente.');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      Alert.alert('Error', 'Hubo un problema al cambiar la contraseña.');
    }
  };

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Cambiar Contraseña</Text>
      <TextInput
        style={estilos.entradas}
        placeholder={"Escriba el PIN enviado a " + correo}
        placeholderTextColor="#AAA"
        value={pin}
        onChangeText={(text) => setPin(text)}
      />
      <TextInput
        style={estilos.entradas}
        placeholder="Nueva Contraseña"
        secureTextEntry
        placeholderTextColor="#AAA"
        value={nuevaContrasena}
        onChangeText={(text) => setnuevaContrasena(text)}
      />
      <TouchableOpacity style={estilos.boton} onPress={cambiar}>
        <Text style={estilos.textoBoton}>Cambiar Contraseña</Text>
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
});

export default RecuperarContrasena;
