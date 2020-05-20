const mysql = require('mysql')

var cn=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root@',
    database:'sms'
})
var get = async function(table,fields,whereFilter){
    var result = await new Promise(resolve=>{
        var sql=`select ${fields} from ${table + whereFilter}`
        console.log(sql)
        cn.query(sql,(err,rows)=>{
            if(err){
                resolve(err)
            }else{
                resolve(rows)
            }
        })
    })
    return result
}

module.exports={get:get}