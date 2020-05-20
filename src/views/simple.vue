<template>
    <v-app>
        <v-card width="500">
            <v-card-title class="grey lighten-4">
                <v-text-field v-model="destinatario" type="number" label="Destinatario:"></v-text-field>
                <v-spacer></v-spacer>
                <div><strong>{{nombreOperador}}</strong></div>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-textarea v-model="mensaje" label="Mensaje:"></v-textarea>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn dark color="primary" @click="send()">Enviar&nbsp;<v-icon>send</v-icon></v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
    </v-app>
</template>

<script>
import axios from 'axios'
import {operador} from '../router'
export default {
    props:{api:String},
    data(){
        return{
            destinatario:'',
            mensaje:''
        }
    },
    methods:{
        send: function(){
            var mv = this;
            var dest = mv.destinatario;
            var msg = mv.mensaje;
            // eslint-disable-next-line
            axios.post(mv.api, {tipo:'simple-sms',dest:dest,msg:msg}).then( res => { console.log( res.data ) });
        }
    },
    computed:{
        nombreOperador:function(){
            var mv=this
            if(mv.destinatario.length>=4){
                return operador(mv.destinatario)
            }else{return 'DESCONOCIDO'}
        }
    }
}
</script>

<style>

</style>
