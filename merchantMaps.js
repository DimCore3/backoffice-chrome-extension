"use strict"    
/*
                                Шаблон
merchants.set( ________ ,
new Map().set("merchantName","________") 
.set("merchantLang","_______") 
.set("merchantOtherInfo","__________")
.set("merchantProjects",[___________])
.set("merchantPartiallyPaidOut",_________)
.set("partiallyPaidOutInfo","___________")
.set("merchantLegalEntity",[___________])
.set("firstMerchantKamAddress","___________")
.set("secondMerchantKamAddress","___________")
);

*/  

var merchants = new Map();

merchants.set( 278 ,
new Map().set("merchantName","test-up") 
.set("merchantLang","RUS") 
.set("merchantOtherInfo","При смене статуса депозита с неуспешного на успешный сразу отправляем коллбек.")
.set("merchantProjects",[22431, 983, 26751, 23631, 982])
.set("merchantPartiallyPaidOut",true)
.set("partiallyPaidOutInfo","Мерчант умеет работать с частичными выплатами, мы на своей стороне присваиваем выплате статус Partially paid out и НЕ отправляем коллбек.")
.set("merchantLegalEntity",[286])
.set("firstMerchantKamAddress","test-up@test-up.pro")
.set("secondMerchantKamAddress","")
);

merchants.set( 116 ,
new Map().set("merchantName","test-merch") 
.set("merchantLang","RUS") 
.set("merchantOtherInfo","")
.set("merchantProjects",[1467, 29981, 22421, 387, 331])
.set("merchantPartiallyPaidOut",false)
.set("partiallyPaidOutInfo","")
.set("merchantLegalEntity",[474, 431])
.set("firstMerchantKamAddress","oleg@test-merch.pro")
.set("secondMerchantKamAddress","")
);
