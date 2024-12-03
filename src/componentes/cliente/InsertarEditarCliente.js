import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView,Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import FormData from 'form-data';
import * as ImagePicker from 'expo-image-picker';

const ip = require('../ip/ip');

const InsertarEditarCliente = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { clienteId } = route.params || {};
  const [nombreUsuario, setNombreUsuario] = useState('pruebac');
  const [tipoUsuario, setTipoUsuario] = useState('Cliente');
  const [correo, setCorreo] = useState('haroldwinstonr2001@yahoo.com');
  const [contrasena, setContrasena] = useState('contrasena');
  const [identificacion, setIdentificacion] = useState('1234');
  const [identidad, setIdentidad] = useState('1234');
  const [primernombre, setPrimerNombre] = useState('Juan');
  const [segundonombre, setSegundoNombre] = useState('Carlos');
  const [primerapellido, setPrimerApellido] = useState('Pérez');
  const [segundoapellido, setSegundoApellido] = useState('Gómez');
  const [telefono, setTelefono] = useState('12345678');
  const [direccion, setDireccion] = useState('Calle Principal #123, Ciudad');
  const [imagenUri, setImagenUri] = useState(null);
  const [imagen, setImagen] = useState(new FormData());

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
       const respuesta = await axios.post(`http://${ip}:3001/api/cliente/guardar`, cliente, {
        headers: { Authorization: `Bearer ${token}` },
      }); 
       const idcliente = JSON.stringify(respuesta.data.data.clienteId);
      const respuestas = await axios.post(`http://${ip}:3001/api/archivos/imagen/cliente?id=${idcliente}`, imagen, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }); 
      Alert.alert('Notificación', 'Cliente guardado correctamente.');
      navigation.goBack();
    } catch (error) {
      console.error('Error al guardar el cliente', error.response?.data || error);
      Alert.alert('Error', error.response?.data?.msg || 'No se pudo guardar el cliente. Intenta de nuevo.');
    }
  };

  const seleccionarImagen = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert('Permiso denegado', 'Se necesita acceso a la galería para seleccionar imágenes.');
      return;
    }
  
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!resultado.canceled) {
      const uriParts = resultado.assets[0].uri.split('.');
      const tipo = resultado.assets[0].type + '/' + uriParts[uriParts.length - 1];
      const nombre = resultado.assets[0].uri.split('/').pop();
      console.log(nombre);
      
      imagen.append('imagen', {
        name: nombre,
        type: tipo,
        uri: resultado.assets[0].uri,
      });
  
      setImagenUri(resultado.assets[0].uri);
  

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
        <TouchableOpacity style={styles.button} onPress={seleccionarImagen}>
  <Text style={styles.buttonText}>Seleccionar Imagen</Text>
</TouchableOpacity>

{imagenUri && (
  <View style={styles.previewContenedor}>
    <Image source={{ uri: imagenUri }} style={styles.previewImagen} />
  </View>
)}
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
    marginBottom :20
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewContenedor: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom :20
  },
  previewImagen: {
    width: 150,
    height: 150,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D8E0',
  },
});

export default InsertarEditarCliente;
