import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
const ip = require('../ip/ip');

const InsertarEditarCliente = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { clienteId } = route.params || {};
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('Cliente');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [identificacion, setIdentificacion] = useState('');
  const [identidad, setIdentidad] = useState('');
  const [primernombre, setPrimerNombre] = useState('');
  const [segundonombre, setSegundoNombre] = useState('');
  const [primerapellido, setPrimerApellido] = useState('');
  const [segundoapellido, setSegundoApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');

  const manejarGuardar = async () => {
    if (!nombreUsuario ||!correo ||!contrasena ||!identificacion ||!identidad ||!primernombre ||!primerapellido ||!telefono ||!direccion) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios.');
      return;
    }
    const esCorreoValido = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

    const cliente = {nombreUsuario,tipoUsuario,correo,contrasena,identificacion,identidad,primernombre,segundonombre,primerapellido,
      segundoapellido,telefonos: { numero: telefono },direcciones: { descripcion: direccion },
    };

    if (!esCorreoValido(correo)) {
      Alert.alert('Error', 'Por favor ingresa un correo electrónico válido.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      await axios.post(`http://${ip}:3001/api/cliente/guardar`, cliente, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Notificación', 'Cliente guardado correctamente.');
      navigation.goBack();
    } catch (error) {
      console.error('Error al guardar el cliente', error.response?.data || error);
      Alert.alert('Error', error.response?.data?.msg || 'No se pudo guardar el cliente. Intenta de nuevo.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Ingresar cliente</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de Usuario"
        value={nombreUsuario}
        onChangeText={setNombreUsuario}
      />
      <TextInput
        style={styles.input}
        placeholder="Tipo de usuario"
        value={tipoUsuario}
        onChangeText={setTipoUsuario}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={correo}
        onChangeText={setCorreo}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={contrasena}
        secureTextEntry
        onChangeText={setContrasena}
      />
      <TextInput
        style={styles.input}
        placeholder="Identificación"
        value={identificacion}
        onChangeText={setIdentificacion}
        maxLength={4}
      />
      <TextInput
        style={styles.input}
        placeholder="Identidad"
        value={identidad}
        keyboardType="numeric"
        onChangeText={setIdentidad}
      />
      <TextInput
        style={styles.input}
        placeholder="Primer nombre"
        value={primernombre}
        onChangeText={setPrimerNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Segundo nombre"
        value={segundonombre}
        onChangeText={setSegundoNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Primer apellido"
        value={primerapellido}
        onChangeText={setPrimerApellido}
      />
      <TextInput
        style={styles.input}
        placeholder="Segundo apellido"
        value={segundoapellido}
        onChangeText={setSegundoApellido}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        keyboardType="numeric"
        value={telefono}
        onChangeText={setTelefono}
      />
      <TextInput
        style={styles.input}
        placeholder="Dirección"
        value={direccion}
        onChangeText={setDireccion}
      />

      <TouchableOpacity style={styles.button} onPress={manejarGuardar}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1A1A2E',
  },
  scrollContainer: {
    padding: 3,
  },
 
  title: {
    marginTop: 25,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFF',
  },
  input: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    backgroundColor: '#2F2F3E',
    color: '#fff',
  },
  button: {
    backgroundColor: '#E94560',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default InsertarEditarCliente;
