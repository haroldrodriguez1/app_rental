import React, { useState,useEffect  } from 'react';
import { View, Text, TextInput,StyleSheet, TouchableOpacity, Alert, Modal, FlatList, Platform,ActivityIndicator,ScrollView  } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
const ip = require('../ip/ip');

const InsertarEditarRenta = () => {
    const route = useRoute();
    const { Rentaid } = route.params || {}; 
  const navigation = useNavigation();
  const [vehiculoid, setVehiculoId] = useState(null);
  const [precioPorDia, setPrecioPorDia] = useState(0); 
  const [clienteId, setClienteId] = useState(null);
  const [seguroId, setSeguroId] = useState(null);
  const [servicioAdicionalId, setServicioAdicionalId] = useState(null);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [precioTotal, setPrecioTotal] = useState(0);
  const [precioSeguro, setPrecioSeguro] = useState(0); 
  const [precioServicioAdicional, setPrecioServicioAdicional] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [listaDatos, setListaDatos] = useState([]);
  const [tipoSeleccion, setTipoSeleccion] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateType, setDateType] = useState('inicio');
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (Rentaid) {
      const obtenerRenta = async () => {
        try {
          const token = await AsyncStorage.getItem('authToken');
          const respuesta = await axios.get(`http://${ip}:3001/api/renta/buscarrentaid?Rentaid=${Rentaid}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const renta = respuesta.data[0];
          setVehiculoId(renta.vehiculoid);
          setClienteId(renta.clienteId);
          setSeguroId(renta.seguroId);
          setServicioAdicionalId(renta.servicioAdicionalId);
          setFechaInicio(renta.fechaInicio);
          setFechaFin(renta.fechaFin);
          setPrecioTotal(renta.precioTotal);
         const data = await axios.get(`http://${ip}:3001/api/vehiculo/buscarvehiculoid?vehiculoid=${renta.vehiculoid}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const vehiculo = data.data[0];
          setPrecioPorDia(vehiculo.precioPorDia);
           const seguroData = await axios.get(`http://${ip}:3001/api/seguro/buscarseguro?id=${renta.seguroId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setPrecioSeguro(seguroData.data[0]?.precio || 0);

          const servicioData = await axios.get(`http://${ip}:3001/api/servicio/buscarservicio?id=${renta.servicioAdicionalId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setPrecioServicioAdicional(servicioData.data[0]?.precio || 0);
        } catch (error) {
          console.error('Error al cargar los datos de la Renta', error);
          Alert.alert('Error', 'No se pudieron cargar los datos de la Renta.');
        }
      };
      obtenerRenta();
    }
  }, [Rentaid]);

  const abrirModal = async (tipo) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      let url = '';
      if (tipo === 'vehiculo') url = `http://${ip}:3001/api/vehiculo/listar`;
      if (tipo === 'cliente') url = `http://${ip}:3001/api/cliente/listar`;
      if (tipo === 'seguro') url = `http://${ip}:3001/api/seguro/listar`;
      if (tipo === 'servicioAdicional') url = `http://${ip}:3001/api/servicio/listar`;

      const respuesta = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListaDatos(respuesta.data);
      setTipoSeleccion(tipo);
      setModalVisible(true);
    } catch (error) {
      console.error(`Error al listar ${tipo}`, error);
      Alert.alert('Error', `No se pudieron obtener los datos de ${tipo}`);
    }
  };

  const seleccionarItem = (item) => {
    if (tipoSeleccion === 'vehiculo') {
        setVehiculoId(item.vehiculoid);
        setPrecioPorDia(item.precioPorDia); 
      }
    if (tipoSeleccion === 'seguro') {
        setSeguroId(item.id);
        setPrecioSeguro(item.precio);
    }
    if (tipoSeleccion === 'cliente') setClienteId(item.clienteId);
    if (tipoSeleccion === 'servicioAdicional') {
        setServicioAdicionalId(item.id);
        setPrecioServicioAdicional(item.precio);
    }
    setModalVisible(false);
  };

  useEffect(() => {
    if (fechaInicio && fechaFin && precioPorDia > 0) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      const diferenciaDias = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
  
      if (diferenciaDias > 0) {
        const totalVehiculo = diferenciaDias * parseFloat(precioPorDia); 
        const totalSeguro = parseFloat(precioSeguro) * diferenciaDias || 0; 
        const totalServicioAdicional = parseFloat(precioServicioAdicional) *diferenciaDias || 0; 
        const total = totalVehiculo + totalSeguro + totalServicioAdicional;
  
        setPrecioTotal(total.toFixed(2)); 
      } else {
        Alert.alert('Error', 'La fecha de fin debe ser posterior a la fecha de inicio.');
      }
    }
  }, [fechaInicio, fechaFin, precioPorDia, precioSeguro, precioServicioAdicional]); 
  
  

  const manejarGuardar = async () => {
    setIsLoading(true);
 
  
    if (!vehiculoid || !clienteId || !seguroId || !servicioAdicionalId || !fechaInicio || !fechaFin || !precioTotal) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      setIsLoading(false);
      return;
    }
  
    const renta = {
      vehiculoid,
      clienteId, 
      seguroId,
      servicioAdicionalId,
      fechaInicio,
      fechaFin,
      precioTotal: parseFloat(precioTotal),
    };
  
    try {

        const token = await AsyncStorage.getItem('authToken');
        if(Rentaid)
        {
            const respuesta = await axios.put(`http://${ip}:3001/api/renta/editar?id=${Rentaid}`, renta, {
                headers: { Authorization: `Bearer ${token}` },
              });
        }else{
            const respuesta = await axios.post(`http://${ip}:3001/api/renta/guardar`, renta, {
                headers: { Authorization: `Bearer ${token}` },
              });
        }
      
      
      
  
      Alert.alert('Éxito', 'Renta guardada exitosamente.');
      navigation.goBack();
    } catch (error) {
      console.error('Error al guardar la renta', error);
      Alert.alert('Error', 'No se pudo guardar la renta. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const showDatePickerModal = (type) => {
    setDateType(type);
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      if (dateType === 'inicio') {
        setFechaInicio(formattedDate);
      } else {
        setFechaFin(formattedDate);
      }

      
      setTimeout(calcularPrecioTotal, 100);
    }
  };

  return (

    <ScrollView style={styles.contenedor}>
      <Text style={styles.titulo}>{Rentaid ? 'Editar Renta' : 'Insertar Renta'}</Text>

      {/* Selección de Vehículo */}
      <TouchableOpacity style={styles.selector} onPress={() => abrirModal('vehiculo')}>
        <Text style={styles.selectorTexto}>{vehiculoid ? `Vehículo ID: ${vehiculoid}` : 'Seleccionar Vehículo'}</Text>
      </TouchableOpacity>

      {/* Selección de Cliente */}
      <TouchableOpacity style={styles.selector} onPress={() => abrirModal('cliente')}>
        <Text style={styles.selectorTexto}>{clienteId ? `Cliente ID: ${clienteId}` : 'Seleccionar Cliente'}</Text>
      </TouchableOpacity>

      {/* Selección de Seguro */}
      <TouchableOpacity style={styles.selector} onPress={() => abrirModal('seguro')}>
        <Text style={styles.selectorTexto}>{seguroId ? `Seguro ID: ${seguroId}` : 'Seleccionar Seguro'}</Text>
      </TouchableOpacity>

      {/* Selección de Servicio Adicional */}
      <TouchableOpacity style={styles.selector} onPress={() => abrirModal('servicioAdicional')}>
        <Text style={styles.selectorTexto}>{servicioAdicionalId ? `Servicio Adicional ID: ${servicioAdicionalId}` : 'Seleccionar Servicio Adicional'}</Text>
      </TouchableOpacity>

      {/* Fecha de Inicio */}
      <TouchableOpacity style={styles.selector} onPress={() => showDatePickerModal('inicio')}>
        <Text style={styles.selectorTexto}>
          {fechaInicio ? `Fecha Inicio: ${fechaInicio}` : 'Seleccionar Fecha de Inicio'}
        </Text>
      </TouchableOpacity>

      {/* Fecha de Fin */}
      <TouchableOpacity style={styles.selector} onPress={() => showDatePickerModal('fin')}>
        <Text style={styles.selectorTexto}>
          {fechaFin ? `Fecha Fin: ${fechaFin}` : 'Seleccionar Fecha de Fin'}
        </Text>
      </TouchableOpacity>

      {/* Precio Total */}
      <TextInput
        style={styles.input}
        placeholder="Precio Total"
        value={precioTotal}
        keyboardType="numeric"
        onChangeText={setPrecioTotal}
        color="#fff"
      />

<TouchableOpacity 
  style={styles.boton} 
  onPress={manejarGuardar} 
  disabled={isLoading} 
>
  {isLoading ? (
    <ActivityIndicator size="small" color="#fff" />
  ) : (
    <Text style={styles.textoBoton}>{Rentaid ? 'Actualizar Renta' : 'Insertar Renta'}</Text>
  )}
</TouchableOpacity>

<View style={styles.facturaContenedor}>
  <Text style={styles.facturaTitulo}>Factura de Renta</Text>
  <Text style={styles.facturaItem}>Vehículo: {vehiculoid ? `ID: ${vehiculoid}` : 'No seleccionado'}</Text>
  <Text style={styles.facturaItem}>Cliente: {clienteId ? `ID: ${clienteId}` : 'No seleccionado'}</Text>
  <Text style={styles.facturaItem}>Seguro: {seguroId ? `ID: ${seguroId} - Precio: ${precioSeguro}` : 'No seleccionado'}</Text>
  <Text style={styles.facturaItem}>Servicio Adicional: {servicioAdicionalId ? `ID: ${servicioAdicionalId} - Precio: ${precioServicioAdicional}` : 'No seleccionado'}</Text>
  <Text style={styles.facturaItem}>Fecha de Inicio: {fechaInicio || 'No seleccionada'}</Text>
  <Text style={styles.facturaItem}>Fecha de Fin: {fechaFin || 'No seleccionada'}</Text>
  <Text style={styles.facturaTotal}>Precio Total: {precioTotal ? `$${precioTotal}` : 'Calculando...'}</Text>
</View>


           {/* Modal para seleccionar items */}
           <Modal visible={modalVisible} animationType="slide">
  <View style={styles.modal}>
    <Text style={styles.tituloModal}>Seleccionar {tipoSeleccion}</Text>
    <FlatList
      data={listaDatos}
      keyExtractor={(item) => {
        switch (tipoSeleccion) {
          case 'vehiculo':
            return item.vehiculoid.toString(); 
      
          case 'cliente':
            return item.primernombre.toString(); 
      
          default:
            return item.id.toString(); 
        }
      }}
      
      renderItem={({ item }) => (
        <TouchableOpacity 
          style={styles.item} 
          onPress={() => seleccionarItem(item)}
        >
          <Text style={styles.itemTexto}>
      {tipoSeleccion === 'cliente' ? (
        `${item.primernombre} ${item.segundonombre ? item.segundonombre : ''} ${item.primerapellido} ${item.segundoapellido ? item.segundoapellido : ''}`
      ) : tipoSeleccion === 'vehiculo' ? (
        `Vehículo ID: ${item.vehiculoid}`
      ) : (
        `ID: ${item.id}`
      )}
    </Text>
      
          <View style={styles.infoContainer}>
            {tipoSeleccion === 'cliente' && (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Estado:</Text>
                  <Text style={styles.infoValue}>{item.estado}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Usuario ID:</Text>
                  <Text style={styles.infoValue}>{item.usuarioId}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email:</Text>
                  <Text style={styles.infoValue}>{item.usuario.correo}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Tipo:</Text>
                  <Text style={styles.infoValue}>{item.usuario.tipoUsuario}</Text>
                </View>
              </>
            )}

{tipoSeleccion === 'seguro' && (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Nombre:</Text>
                  <Text style={styles.infoValue}>{item.nombre}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Tipo:</Text>
                  <Text style={styles.infoValue}>{item.tipo}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Descripcion:</Text>
                  <Text style={styles.infoValue}>{item.descripcion}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Cobertura:</Text>
                  <Text style={styles.infoValue}>{item.cobertura}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Precio:</Text>
                  <Text style={styles.infoValue}>{item.precio}</Text>
                </View>
                
              </>
            )}
      {tipoSeleccion === 'servicioAdicional' && (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Nombre:</Text>
                  <Text style={styles.infoValue}>{item.nombre}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Descripcion:</Text>
                  <Text style={styles.infoValue}>{item.descripcion}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Precio:</Text>
                  <Text style={styles.infoValue}>{item.precio}</Text>
                </View>
                
              </>
            )}
            {tipoSeleccion === 'vehiculo' && (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Marca:</Text>
                  <Text style={styles.infoValue}>{item.marca}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Modelo:</Text>
                  <Text style={styles.infoValue}>{item.modelo}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Año:</Text>
                  <Text style={styles.infoValue}>{item.año}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Placa:</Text>
                  <Text style={styles.infoValue}>{item.placa}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Precio por Dia:</Text>
                  <Text style={styles.infoValue}>{item.precioPorDia}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Estado:</Text>
                  <Text style={styles.infoValue}>{item.estado}</Text>
                </View>
              </>
            )}
          </View>
        </TouchableOpacity>
      )}
      
      
    />
    <TouchableOpacity style={styles.botonCerrar} onPress={() => setModalVisible(false)}>
      <Text style={styles.textoBoton}>Cerrar</Text>
    </TouchableOpacity>
  </View>
</Modal>

      {/* DateTime Picker */}
      {showDatePicker && (
  <DateTimePicker
    value={dateType === 'inicio' ? new Date(fechaInicio) : new Date(fechaFin)} 
    mode="date"
    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
    onChange={onDateChange}
  />
)}


            
      
    </ScrollView>
  );
};



const styles = StyleSheet.create({
    contenedor: {
      flex: 1,
      padding: 20,
      backgroundColor: '#1A1A2E',
    },
    titulo: {
      fontSize: 24,
      fontWeight: 'bold',
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
    selector: {
      backgroundColor: '#2F2F3E',
      padding: 15,
      marginBottom: 15,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#fff',
    },
    selectorTexto: {
      color: '#fff',
      fontSize: 16,
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
    modal: {
      flex: 1,
      padding: 20,
      backgroundColor: '#1A1A2E',
    },
    tituloModal: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#fff',
    },
    item: {
      padding: 15,
      backgroundColor: 'white',
      marginBottom: 10,
      borderRadius: 5,
    },
    itemTexto: {
      color: 'black',
    },
    botonCerrar: {
      backgroundColor: '#E94560',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 20,
    },
    infoContainer: {
        backgroundColor :'white',
        marginTop: 10, 
      },
      infoRow: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 5, 
      },
      infoLabel: {
        fontWeight: 'bold', 
        width: '40%', 
      },
      infoValue: {
        width: '60%', 
        flexWrap: 'wrap',
      },
      facturaContenedor: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        marginBottom:20,
      },
      facturaTitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
      },
      facturaItem: {
        fontSize: 16,
        color: '#555',
        marginVertical: 2,
      },
      facturaTotal: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#333',
      }
  });

export default InsertarEditarRenta;
