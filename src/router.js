import Vue from 'vue'
import Router from 'vue-router'
import Simple from './views/simple.vue'
import Multiple from './views/multiple.vue'

Vue.use(Router)
export var api='http://localhost:3355';
export var operador=function(numero,prefijos){
  var result=""
  if(prefijos.length>0){
    prefijos.forEach(nums=>{
      var intervalos=nums[0].split('-')
      if(numero>=parseInt(intervalos[0]) && numero<=parseInt(intervalos[1])){
        result=nums[1]
      }
    })
  }
  return result
}
export var router= new Router({
  mode:'history',
  routes: [
    {
      path: '/mensajes_simples',
      name: 'mensajes_simples',
      component: Simple,
      props:{api:api}
    },
    {
      path: '/mensajes_múltiples',
      name: 'mensajes_múltiples',
      component: Multiple,
      props:{api:api}
    },
  ]
})
