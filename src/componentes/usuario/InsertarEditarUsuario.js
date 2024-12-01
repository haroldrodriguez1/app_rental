import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
const ip = require('../ip/ip');

const InsertarEditarUsuario = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params || {}; 

  const [identificacion, setIdentificacion] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [correo, setCorreo] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState(''); 
  const [pin, setPin] = useState('');

  useEffect(() => {
    if (id) {
      const obtenerUsuario = async () => {
        try {
          const token = await AsyncStorage.getItem('authToken');
          const respuesta = await axios.get(`http://${ip}:3001/api/usuario/buscarusuario?id=${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const usuario = respuesta.data;
          setIdentificacion(usuario.identificacion);
          setNombreUsuario(usuario.nombreUsuario);
          setContrasena(''); 
          setCorreo(usuario.correo);
          setTipoUsuario(usuario.tipoUsuario);
          setPin(usuario.pin);
        } catch (error) {
          console.error('Error al cargar los datos del usuario', error);
          Alert.alert('Error', 'No se pudieron cargar los datos del usuario.');
        }
      };
      obtenerUsuario();
    }
  }, [id]);

  const manejarGuardar = async () => {
    if (!identificacion || !nombreUsuario || !contrasena || !correo || !tipoUsuario) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios.');
      return;
    }

    const usuario = {
      identificacion,
      nombreUsuario,
      contrasena,
      correo,
      tipoUsuario,
      pin,
    };

    try {
      const token = await AsyncStorage.getItem('authToken');
      if (id) {
        const respuesta = await axios.put(`http://${ip}:3001/api/usuario/editar?id=${id}`, usuario, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert('Notificación', 'Usuario actualizado exitosamente.');
      } else {
        const respuesta = await axios.post(`http://${ip}:3001/api/usuario/guardar`, usuario, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert('Notificación', 'Usuario creado exitosamente.');
      }
      navigation.goBack(); 
    } catch (error) {
      console.error('Error al guardar el usuario', error);
      Alert.alert('Error', 'No se pudo guardar el usuario. Intenta de nuevo.');
    }
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>{id ? 'Editar Usuario' : 'Insertar Usuario'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Identificación"
        value={identificacion}
        onChangeText={setIdentificacion}
        color='#fff'
      />
      <TextInput
        style={styles.input}
        placeholder="Nombre de Usuario"
        value={nombreUsuario}
        onChangeText={setNombreUsuario}
        color='#fff'
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={contrasena}
        secureTextEntry
        onChangeText={setContrasena}
        color='#fff'
      />
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        value={correo}
        onChangeText={setCorreo}
        color='#fff'
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Tipo de Usuario (Cliente o Empleado)"
        value={tipoUsuario}
        onChangeText={setTipoUsuario}
        color='#fff'
      />
      <TextInput
        style={styles.input}
        placeholder="PIN (Opcional)"
        value={pin}
        onChangeText={setPin}
        color='#fff'
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.boton} onPress={manejarGuardar}>
        <Text style={styles.textoBoton}>{id ? 'Actualizar' : 'Guardar'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1A1A2E',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    backgroundColor: '#2F2F3E',
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  boton: {
    backgroundColor: '#E94560',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default InsertarEditarUsuario;
