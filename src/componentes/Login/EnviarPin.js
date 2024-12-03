import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
const ip = require('../ip/ip');

const EnviarPin = () => {
  const [correo, setCorreo] = useState('');
  const navigation = useNavigation();

  const enviar = async () => {
    try {
      console.log('enviar PIN'); 
      const respuesta = await axios.post('http://'+ip+':3001/api/usuarios/recuperar', { correo : correo });
      Alert.alert('Mensaje:', respuesta.data.msg);
      navigation.navigate('RecuperarContrasena', { correo });
    } catch (error) {
        Alert.alert('Error', 'Este correo no es valido o no existe.');
    }
  };

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Recuperar Contraseña</Text>
      <TextInput
        style={estilos.entradas}
        placeholder="Correo"
        placeholderTextColor="#AAA"
        value={correo}
        onChangeText={(text) => setCorreo(text)}
      />
      <TouchableOpacity style={estilos.boton} onPress={enviar}>
        <Text style={estilos.textoBoton}>Enviar PIN</Text>
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
    color: '#FFF', 
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
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EnviarPin;
