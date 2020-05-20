<template>
  <v-app>
    <v-navigation-drawer clipped app>
      <v-list>
        <v-list-tile v-for="(item,i) in menu" :key="i" :to="item.text==='Salir'?'':item.text.replace(/ /g,'_').toLowerCase()" @click="item.text==='Salir'?usuario.id=0:null">
          <v-list-tile-action><v-icon v-text="item.icon"></v-icon></v-list-tile-action>
          <v-list-tile-title v-text="item.text"></v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app clipped-left>
      <v-icon large>mdi-bars</v-icon>
      <v-toolbar-title class="headline text-uppercase">
        <span>SMS</span>
        <span class="font-weight-light blue--text">COOP</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <v-container>
        <router-view></router-view>
      </v-container>
      
    </v-content>
    <v-dialog v-model="conectando" width="400" persistent>
      <v-card>
        <v-card-text>
          <v-flex><h1>CONECTANDO...</h1></v-flex>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import socket from 'socket.io-client'
import {api} from './router'
export default {
  name: 'App',
  data () {
    return {
      conectando:true,
      usuario:{id:0,nombre:'',contraseña:''},
      menu:[
        {icon:'',text:'Mensajes simples'},
        {icon:'',text:'Mensajes múltiples'},
        {icon:'',text:'Mensajes con plantillas'},
        {icon:'close',text:'Salir'}
      ],
      prefijos:[]
    }
  },
  methods:{
    getPrefijos:function(){
      var mv=this
      var data=JSON.stringify(
        {
          table:'prefijos',
          fields:'*',
          whereFilter:''
        }
      )
      fetch(api+'/get',{method:'POST',headers: {"Content-type":"application/json;charset=utf-8"},body:data}).then(res=>{
        return res.json()
      }).then(r=>{
        if(!r.errno){
          mv.prefijos=r
        }else{
          console.log(r)
        }
      })
    },
    getOperador:function(numero){
      
    }
  },
    mounted:function(){
    var mv=this
    var io=socket.connect(api,{secure:true})
    io.on('confirm',()=>{mv.conectando=false})
    io.on('disconnect',()=>{mv.conectando=true})
    mv.getPrefijos()
  }
}




</script>
