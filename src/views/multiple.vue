<template>
    <v-app>
        <v-card width="500">
            <v-card-text>
                <v-textarea v-model="mensaje" label="Mensaje"></v-textarea>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-btn dark color="success" @click="$refs.inputFile.click()">Importar lista&nbsp;<v-icon>list</v-icon></v-btn>
                <v-btn dark color="primary" v-if="data.length>0 && Object.keys(data[0]).length===3 && mensaje.length>0" @click="enviar()">Enviar&nbsp;<v-icon>send</v-icon></v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
        <input type="file" style="display:none" ref="inputFile" @change="obtenerDatos()" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"/>
        &nbsp;
        <v-card width="500" height="300">
            <v-card-title class="grey lighten-4">
                <h3>Lista</h3>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <div style="height:220px;overflow:auto">
                    <table>
                        <tr>
                            <th v-for="(col,coli) in data[0]" :key="coli" v-html="coli"></th>
                            <th v-if="data[0] && data[0].Error">Ayuda</th>
                        </tr>
                        <tr v-for="(row,rowi) in data" :key="rowi">
                            <td v-for="(item,i) in row" :key="rowi+i">
                                <span v-if="i==='Enviado'" :class="row.Enviado===1?'green--text':row.Enviado===2?'red--text':''">
                                    {{row.Enviado===1?'Enviado':row.Enviado===2?'Error en número':''}}
                                </span>
                                <span v-if="i!='Enviado'">{{row[i]}}</span>
                            </td>
                            <td v-if="row.Error"><v-btn icon dark color="info" style="font-size:22px" @click="dlgHelp=true">?</v-btn></td>
                        </tr>
                    </table>
                </div>
            </v-card-text>
        </v-card>
        
        <v-dialog v-model="dlgHelp" width="400">
            <v-card>
                <v-card-title><h3>Formato de lista</h3></v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <ol>
                        <li>Debe contener los encabezados Nombre y Número</li>
                        <li>Tiene que comenzar en la fila 1 y en la columna A</li>
                        <li>No debe haber filas vacías</li>
                    </ol>
                    &nbsp;
                    <v-img :src="helpImg" width="275">
                    </v-img>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="dlgHelp=false">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-app>
</template>

<script>
import xlsx from 'xlsx';
import axios from 'axios';
export default {
    props:{api:String},
    data(){
        return{
            mensaje:'',
            data:[],
            destinatarios:'',
            dlgHelp:false,
            helpImg:'data:image/png;base64,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'
        }
    },
    methods:{
        obtenerDatos:function(){
            var mv=this
            var input=this.$refs.inputFile
            if(input.files && input.files[0]){
                var file = input.files[0]
                var reader = new FileReader();
                reader.onload=function(e){
                    var data = new Uint8Array(e.target.result);
                    var libro = xlsx.read(data,{type:'array'})
                    var NombreHojas = libro.SheetNames
                    var hoja = libro.Sheets[NombreHojas[0]]
                    if(hoja['A1']===undefined || hoja['B1']===undefined ){mv.data=[{Error:'La columna Nombre o Número no se encontró'}];return;}
                    if(hoja['A1'].v!='Nombre' && hoja['B1'].v!='Número'){mv.data=[{Error:'La columna Nombre o Número no se encontró'}];return;}
                    var colA=[],colB=[]
                    Object.keys(hoja).forEach(k=>{
                        if(k[0]!='!' && k!='A1' & k!='B1'){
                            if(k[0]==='A'){colA.push(hoja[k].v)}else if(k[0]==='B'){colB.push(hoja[k].v)}
                        }
                    })
                    mv.destinatarios=colB.join(",");
                    data =[]
                    for(var i=0;i<colA.length;i++){
                        var num=colB[i]
                        var estado=0
                        if(num.toString().replace(/ /g,'').length!=8){estado=2}
                        data.push({Nombre:colA[i],Número:num,Enviado:estado})
                    }
                    mv.data=data
                    input.value = ""
                }
                reader.readAsArrayBuffer(file)
            }
        },
        enviar:function(){
            var mv=this
            var params={tipo:'multiple-sms',msg:mv.mensaje,dests:mv.destinatarios}
            axios.post(mv.api,params).then(r=>{
                mv.data.forEach(item=>{item.estado=1})
            })
        }
    },    
}
</script>
<style scoped>
    table{border-collapse: collapse;width:100%;}
    th{text-align: left;background-color: #eee}
    th,td{padding: 4px;border:1px solid #ddd}
    li{margin:4px}

</style>

