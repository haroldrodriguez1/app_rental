import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import FormData from 'form-data';
import { ScrollView } from 'react-native-gesture-handler';
const ip = require('../ip/ip');

const InsertarEditarVehiculo = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { vehiculoid } = route.params || {}; 
  const [marca, setMarca] = useState('Hyundai');
  const [modelo, setModelo] = useState('Elantra');
  const [anio, setanio] = useState('2010');
  const [precioPorDia, setPrecioPorDia] = useState('50.00');
  const [tipoVehiculo, setTipoVehiculo] = useState('Sedan');
  const [estado, setEstado] = useState(true);
  const [placa, setPlaca] = useState('HCD2525');
  const [imagenUri, setImagenUri] = useState(null);
  const [imagen, setImagen] = useState(new FormData());
  const [imagenUriOriginal, setImagenUriOriginal] = useState(null);

  useEffect(() => {
    if (vehiculoid) {
      const obtenerVehiculo = async () => {
        try {
          const token = await AsyncStorage.getItem('authToken');
          const respuesta = await axios.get(`http://${ip}:3001/api/vehiculo/buscarvehiculoid?vehiculoid=${vehiculoid}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const vehiculo = respuesta.data[0];
          setMarca(vehiculo.marca);
          setModelo(vehiculo.modelo);
          setanio(vehiculo.año.toString());
          setPrecioPorDia(vehiculo.precioPorDia);
          setTipoVehiculo(vehiculo.tipoVehiculo);
          setEstado(vehiculo.estado);
          setPlaca(vehiculo.placa);
          if (vehiculo.imagen) {
            const imagenURL = `http://${ip}:3001/uploads/${vehiculo.nombreImagen}`;
            setImagenUri(imagenURL);
          setImagenUriOriginal(imagenURL);
          }
        } catch (error) {
          console.error('Error al cargar los datos del vehículo', error);
          Alert.alert('Error', 'No se pudieron cargar los datos del vehículo.');
        }
      };
      obtenerVehiculo();
    }
  }, [vehiculoid]);

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
  

  
  const manejarGuardar = async () => {
    if (!marca || !modelo || !anio || !precioPorDia || !tipoVehiculo  || !placa ) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }
    
    const vehiculo = {
      marca,
      modelo,
      año : parseInt(anio),
      precioPorDia: parseFloat(precioPorDia),
      tipoVehiculo,
      estado,
      placa
    };
    
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (vehiculoid) {
        
        const respuesta = await axios.put(`http://${ip}:3001/api/vehiculo/editar?id=${vehiculoid}`, vehiculo, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert('Notificación', JSON.stringify(respuesta.data, null, 2));
        
        if (imagenUri && imagenUri !== imagenUriOriginal) {
          const respuestas = await axios.post(`http://${ip}:3001/api/archivos/imagen/vehiculo?id=${vehiculoid}`, imagen, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          });
        }
        
      } else {
         const respuesta = await axios.post(`http://${ip}:3001/api/vehiculo/guardar`, vehiculo, {
          headers: { Authorization: `Bearer ${token}` },
        });

              
        Alert.alert('Notificación', JSON.stringify(respuesta.data, null, 2)); 
        
        const vid = JSON.stringify(respuesta.data.data.vehiculoid);
        console.log(vid);
        console.log(imagen);
          const respuestas = await axios.post(`http://${ip}:3001/api/archivos/imagen/vehiculo?id=${vid}`, imagen, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

      }
      navigation.goBack(); 
    } catch (error) {
     console.error('Error al guardar el vehículo', error);
      //Alert.alert('Error', 'No se pudo guardar el vehículo. Intenta de nuevo.');
    }
  };

  return (
    <ScrollView style={styles.contenedor}>
      <Text style={styles.titulo}>{vehiculoid ? 'Editar Vehículo' : 'Insertar Vehículo'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Marca"
        value={marca}
        onChangeText={setMarca}
        color= '#fff'
      />
      <TextInput
        style={styles.input}
        placeholder="Modelo"
        value={modelo}
        onChangeText={setModelo}
        color= '#fff'
      />
      <TextInput
        style={styles.input}
        placeholder="Año"
        value={anio}
        onChangeText={setanio}
        color= '#fff'
      />
      <TextInput
        style={styles.input}
        placeholder="Precio por Día"
        value={precioPorDia}
        keyboardType="numeric"
        onChangeText={setPrecioPorDia}
        color= '#fff'
      />
      <TextInput
        style={styles.input}
        placeholder="Tipo de Vehículo"
        value={tipoVehiculo}
        onChangeText={setTipoVehiculo}
        color= '#fff'
      />
     
      <TextInput
        style={styles.input}
        placeholder="Placa"
        value={placa}
        onChangeText={setPlaca}
        color= '#fff'
      />

<View style={styles.radioGroup}>
        <TouchableOpacity
          style={[styles.radioButton, estado && styles.radioSelected]}
          onPress={() => setEstado(true)}
        >
          <Text style={styles.radioText}>Disponible</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.radioButton, !estado && styles.radioSelected]}
          onPress={() => setEstado(false)}
        >
          <Text style={styles.radioText}>No Disponible</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.boton} onPress={seleccionarImagen}>
  <Text style={styles.textoBoton}>Seleccionar Imagen</Text>
</TouchableOpacity>

{imagenUri && (
  <View style={styles.previewContenedor}>
    <Image source={{ uri: imagenUri }} style={styles.previewImagen} />
  </View>
)}


{/* {imagenUri && (
  <TouchableOpacity style={[styles.boton, { marginTop: 10 }]} onPress={subirImagen}>
    <Text style={styles.textoBoton}>Subir Imagen</Text>
  </TouchableOpacity>
)} */}

      <TouchableOpacity style={styles.boton} onPress={manejarGuardar}>
        <Text style={styles.textoBoton}>{vehiculoid ? 'Actualizar' : 'Guardar'}</Text>
      </TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    contenedor: {
      flex: 1,
      padding: 20,
      backgroundColor: '#1A1F33',
     
    },
    titulo: {
      fontSize: 26,
      fontWeight: 'bold',
      marginTop: 30,
      marginBottom: 25,
      color: '#64A6D9',
    },
    input: {
      backgroundColor: '#2C3E50',
      padding: 12,
      marginBottom: 18,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: '#D1D8E0',
      color: '#F4F4F9',
    },
    boton: {
      backgroundColor: '#4A90E2',
      padding: 18,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 15,
    },
    textoBoton: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    previewContenedor: {
      marginTop: 20,
      alignItems: 'center',
      marginBottom: 15,
    },
    previewImagen: {
      width: 150,
      height: 150,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#D1D8E0',
    },
    radioGroup: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 15,
    },

    radioButton: {
      padding: 10,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#ddd',
      backgroundColor: '#fff',
    },
    radioSelected: {
      backgroundColor: '#339ef0',
    },
    radioText: {
      color: '#333',
    },
    
  });
  
  export default InsertarEditarVehiculo;
  