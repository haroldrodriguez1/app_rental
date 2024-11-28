import { View, Text, StyleSheet, TextInput,  Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';
import axios from 'axios';

const ip = require('../ip/ip');
const InsertMantenimiento = ( ) => {
const [descripcion, setDescripcion] = useState('');
const [costo, setCosto] = useState('');
const [fechaM, setFechaM] = useState('');
const [vehiculo, setVehiculo] = useState('');
const [errores, setErrores] = useState({})

const validarCampos = () => {
    const errores = {};
    const fechaActual = new Date();
    const añoActual = fechaActual.getFullYear()
    if (!descripcion || descripcion.length < 10 || descripcion.length > 120) {
        errores.descripcion = 'La descripción debe tener entre 10 y 120 caracteres.'
    }
    if (!costo || isNaN(costo) || parseFloat(costo) <= 0 || costo.length > 12) {
        errores.costo = 'El costo debe ser un número positivo (máximo 12 caracteres).'
    }
    if (!fechaM || !/^\d{4}-\d{2}-\d{2}$/.test(fechaM)) {
        errores.fechaM = 'La fecha debe estar en formato YYYY-MM-DD.';
    } else {
        const añoFecha = parseInt(fechaM.split('-')[0]);
        if (añoFecha > añoActual) {
            errores.fechaM = `La fecha no puede ser posterior al año ${añoActual}.`;
        }
    }
    if (!vehiculo || isNaN(vehiculo)) {
        errores.vehiculo = 'El ID del vehículo debe ser un número entero.'
    }
    setErrores(errores); 
    return Object.keys(errores).length === 0; 
};

    const insertarMantenimiento = async () =>{
        if (!validarCampos()) {
            return; 
        }
        try {
            const token = await AsyncStorage.getItem('authToken');
            await axios.post('http://'+ip+':3001/api/mantenimiento/guardar', {
                descripcion,
                costo: costo,
                fecha_mantenimiento: fechaM,
                vehiculoId: vehiculo

            },{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            Alert.alert("Éxito", "El mantenimiento fue ingresado exitosamente");
            setDescripcion('')
            setCosto('')
            setFechaM('')
            setVehiculo('')
            if (typeof actualizarLista === 'function') {
                actualizarLista(); 
            }             
        } catch (error) {
            Alert.alert("Error", "No se pudo ingresar el mantenimiento, intenta de nuevo.");
        }
    };
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Ingresar mantenimiento</Text>
            <TextInput
                style={styles.input}
                placeholder="Descripción"
                 color= '#ffffff'
                value={descripcion}
                onChangeText={setDescripcion}
            />
             {errores.descripcion && <Text style={styles.error}>{errores.descripcion}</Text>}
            <TextInput
                style={styles.input}
                placeholder="Costo"
                 color= '#ffffff'
                keyboardType="numeric"
                value={costo}
                onChangeText={setCosto}
            />
             {errores.costo && <Text style={styles.error}>{errores.costo}</Text>}
            <TextInput
                style={styles.input}
                placeholder="Fecha (YYYY-MM-DD)"
                value={fechaM}
                onChangeText={setFechaM}
                 color= '#ffffff'
            />
             {errores.fechaM && <Text style={styles.error}>{errores.fechaM}</Text>}
             <TextInput
                style={styles.input}
                placeholder="Id del vehiculo"
                 color= '#ffffff'
                value={vehiculo}
                onChangeText={setVehiculo}
            />
             {errores.vehiculo && <Text style={styles.error}>{errores.vehiculo}</Text>}
            <TouchableOpacity style={styles.button} onPress={insertarMantenimiento}>
                <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#1A1A2E',
    },
    title: {
        marginTop:25,
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#FFF'
    },
    input: {
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 15,
        backgroundColor: '#2F2F3E',
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
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
export default InsertMantenimiento;
