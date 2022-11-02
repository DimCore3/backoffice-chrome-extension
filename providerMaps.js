"use strict"
/*

                                Шаблон
providers.set( ________ ,
new Map().set("name","________") 
.set("lang","_______") 
.set("personalAccount", ___________ ) 
.set("otherInfo","__________")
.set("communicationMethod","___________")
.set("messenger","__________")
.set("contactName","_________________")
.set("linkPersonalAccount","_________")
);

*/  

var providers = new Map();

providers.set( 22 ,
new Map().set("name","test-name") 
.set("lang","RUS") 
.set("personalAccount", true ) 
.set("otherInfo",`указать в теле письма (помимо стандартных данных) следующую инфу:
а. ошибка при вводе или выводе средств
б. логи взаимодействия с ПС (наш запрос - их ответ)`)
.set("communicationMethod","email")
.set("contactName","test@gmail.com")
.set("linkPersonalAccount","https://www.test.com/login")
);

providers.set( 3631 ,
new Map().set("name","test-name2") 
.set("lang","ENG") 
.set("personalAccount", false ) 
.set("otherInfo","")
.set("communicationMethod","chat")
.set("messenger","skype")
.set("contactName","Test integration")
.set("linkPersonalAccount","")
);
