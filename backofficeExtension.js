"use strict"

const operations = new Map();
let loadTime = 0;
let firstMenuButtonCheck = false;
let MenuButtonRechecker = false;
//---------------------------------------------------------------------------------------

function find_value(find_string) {
  let result = [];
  let divList = document.getElementsByTagName("div");

  for (let element of divList) {
    let element_value = element.innerHTML;

    if (element_value === find_string) {
      result.push(element.nextSibling.innerText);
    }
  }
  return result;
}

//--------------------Найти блок с провайдером------------------------
function find_operations_providers_objects(operation_div) {
  let re = /\/providers\/\d+/;
  let ahrefs = operation_div.getElementsByTagName('a');

  for (let element of ahrefs) {
    let elem_link = element.href;

    if (elem_link.match(re)) {
      return element.parentNode;
    }
  }
}

//-----------------------Кнопка провайдера-----------------------
function ButtonForPersonalAccount(OperID, providerBlock, result) {
  let ProviderID = Number(result.get("ProviderID"));
  let providerMap = providers.get(ProviderID);

  if (providerMap !== undefined) {
    let linkPerAcc = providerMap.get("linkPersonalAccount");
    let personalAccount = providerMap.get("personalAccount");

    if (linkPerAcc !== "") {
      let text = document.createTextNode("Личный кабинет");
      let form = document.createElement("form");
      let button = document.createElement("button");
      button.className = "buttonPersonalAccount";
      button.id = `buttonPersonalAccount_${OperID}`;
      form.appendChild(button);
      button.appendChild(text);
      providerBlock.appendChild(form);
      button.onclick = function() {
        window.open(linkPerAcc);
        window.focus();
        return false;
      }
    } 
  }
}

//-----------Функция формирования кнопок--------------------------
function createAMenuButtonInTheOperationBlock(OperID, result, operationMap) {
  let operationBlock = document.getElementById(OperID);
  let blockForMenuParent = operationBlock.firstElementChild.lastElementChild.firstElementChild.firstElementChild.nextElementSibling.firstElementChild;
  let textMenu = document.createTextNode("Шаблоны");
  let formMenu = document.createElement("form");
  let menuButton = document.createElement("button");
  menuButton.id = `menuHeaderID_${OperID}`;
  menuButton.className = `menuHeaderClass`;
  menuButton.onclick = function() {
    formTempMainBlock.style.opacity = formTempMainBlock.style.visibility === 'hidden' ? 1 : 0
    formTempMainBlock.style.visibility = formTempMainBlock.style.visibility === 'hidden' ? 'visible' : 'hidden'

    for (let element of templatesClass) {
      element.style.opacity = element.style.visibility === 'hidden' ? 1 : 0
      element.style.visibility = element.style.visibility === 'hidden' ? 'visible' : 'hidden'
    }
    return false;
  }
  formMenu.appendChild(menuButton);
  menuButton.appendChild(textMenu);
  blockForMenuParent.appendChild(formMenu);
  //---------------Кнопка копировать---------------------------------
  let copyButton = document.createElement("button");
  copyButton.id = `copyOperID_${OperID}`;
  copyButton.className = `copyOperClass`;
  copyButton.onclick = function() {
    toastr.success('Скопировано в буфер обмена');
    navigator.clipboard.writeText(operationInfoBlock(result));
    return false;
  }
  menuButton.after(copyButton);
  //---------------Список шаблонов---------------------------------------
  let tempMap = new Map();
  tempMap.set("finalStatusTemplate", "Фин.статус")
    .set("arnRrnTemplate", "ARN/RRN")
    .set("declineReasonTemplate", "Прич.отказа")
    .set("manualRefundTemplate", "Руч.возврат")
    .set("finRefundTemplate", "Фин.(Возврат)")
    .set("partiallyPayoutP2PFinTemplate", "P2P Част.возврат")
    .set("rcsWithoutAML", "RCS не AML")
    .set("rcsWhiteList", "RCS white list")
    .set("rcsBlackList", "RCS black list");
  //----------------Блок под список шаблонов---------------------------
  let formTempMainBlock = document.createElement("form");
  formTempMainBlock.id = `formTempMainBlockClass_${OperID}`;
  formTempMainBlock.className = `formTempMainBlockClass`;
  formTempMainBlock.style.opacity = 0;
  formTempMainBlock.style.visibility = 'hidden';
  blockForMenuParent.appendChild(formTempMainBlock);
  //------------------Формируем кнопки самих шаблонов--------------
  for (let [key, value] of tempMap) {
    let button = document.createElement("button");
    let nameClass = `templateClass_${OperID} templateClass`;

    if ( 
      key === "finalStatusTemplate" || 
      key === "arnRrnTemplate" || 
      key === "declineReasonTemplate" || 
      key === "manualRefundTemplate" 
    ){
      nameClass += " templateClassProvider";
    }

    if ( 
      key === "finRefundTemplate" || 
      key === "partiallyPayoutP2PFinTemplate" 
    ){
      nameClass += " templateClassFIN";
    }

    if ( 
      key === "rcsWithoutAML" || 
      key === "rcsWhiteList" || 
      key === "rcsBlackList" 
    ){
      nameClass += " templateClassRCS";
    }
    
    button.id = `${key}_${OperID}`;
    button.className = nameClass;
    button.style.opacity = 0;
    button.style.visibility = 'hidden';
    button.onclick = function() { // Присвоить onclick
      formTempMainBlock.style.opacity = formTempMainBlock.style.visibility === 'hidden' ? 1 : 0
      formTempMainBlock.style.visibility = formTempMainBlock.style.visibility === 'hidden' ? 'visible' : 'hidden'

      for (let element of templatesClass) {
        element.style.opacity = element.style.visibility === 'hidden' ? 1 : 0
        element.style.visibility = element.style.visibility === 'hidden' ? 'visible' : 'hidden'
      }
      toastr.success('Скопировано в буфер обмена');
      let clipboardInfo = result.get(key) ?? `Провайдер «${result.get("Provider:")}» отсутствует в справочнике providerMaps.js`;
      navigator.clipboard.writeText(clipboardInfo);
      return false;
    }
    button.innerText = value;
    formTempMainBlock.appendChild(button);
  }
  let templatesClass = document.getElementsByClassName(`templateClass_${OperID}`);
}

//------Поиск всех необходимых параметров и запись шаблонов в коллекцию каждой операции------------
function find_parameters(object_for_find) {
  let result = new Map();
  let divList = object_for_find.getElementsByTagName("div");

  for (let element of divList) {
    let element_value = element.innerHTML;

    if (parameters.includes(element_value)) {

      if (exceptions.includes(element_value) && element.nextSibling.innerHTML !== "") {
        result.set(element_value, element.nextSibling.firstChild.innerHTML);

      } else {
        result.set(element_value, element.nextSibling.innerHTML);
      }
    }

    if (textLinkIDlist.includes(element_value) && element.nextSibling.innerHTML !== "") {
      let hrefText = element.nextSibling.firstChild.getAttribute("href");
      let idNumber = hrefText.replace(/\D+/g, "");
      result.set(element_value.replace(/:/g, "ID"), idNumber);
    }
  }
  let ProviderID = Number(result.get("ProviderID"));
  let operationType = result.get("Operation Type:");
  let providerMap = providers.get(ProviderID);

  if (merchantMapFind(result) !== undefined) {
    merchantMapFind(result);
  }

  if (providerMap === undefined) {
    let nullOrNotNullProviderID = ProviderID === 0 && operationType === "manual change" ? "Статус транзакции изменен" : `Провайдера с ID ${ProviderID}, нет в коллекции providerMaps.js`;
    console.log(nullOrNotNullProviderID)

  } else {
    let providerName = providerMap.get("name") ?? "___________";
    addTemplatesInMapCollection(ProviderID, providerMap, providerName, result)
  }

  return result;
}

//------------------------------------ Функция поиска мерчанта по проекту из структуры merchantMaps.js ---------------------------
function merchantMapFind(result) {
  let projectID = Number(result.get("ProjectID"));
  let merchantMap;
  let merchantID;


  for (merchantID = 0; merchantID < 20000; merchantID++) {

    if (merchants.get(merchantID) !== undefined) {
      merchantMap = merchants.get(merchantID);

      for (let element of merchantMap.get("merchantProjects")) {

        if (projectID === element) {
          result.set("Merchant ID:", merchantID);

          for (let element of merchantMapParams) {

            if (merchantMap.get(element) !== undefined) {
              result.set(element, merchantMap.get(element));
            }
          }
          return
        }
      }
    }
  }
  console.log(`Проект ${projectID} не записан в коллекцию мерчанта, либо мерчант отсуствует в структуре merchantMaps.js`)
}



//------------------------- Функция формирования шаблонов с записью в коллекцию операции ----------
function addTemplatesInMapCollection(ProviderID, providerMap, providerName, result) {
  result.set("finalStatusTemplate", finalStatusTemplate(ProviderID, providerMap, result));
  result.set("arnRrnTemplate", ArnRrnTemplate(ProviderID, providerMap, result));
  result.set("declineReasonTemplate", declineReasonTemplate(ProviderID, providerMap, result));
  result.set("manualRefundTemplate", manualRefundTemplate(ProviderID, providerMap, result));
  result.set("finRefundTemplate", finRefundTemplate(ProviderID, providerMap, providerName, result));
  result.set("partiallyPayoutP2PFinTemplate", partiallyPayoutP2PFinTemplate(ProviderID, providerMap, providerName, result));
  result.set("rcsWithoutAML", rcsWithoutAML(result));
  result.set("rcsWhiteList", rcsBlackWhiteList(result, "white"));
  result.set("rcsBlackList", rcsBlackWhiteList(result, "black"));
}

//==================================== Шаблоны =========================
//------------Блок с инфо о коммуникации с провайдером------------------
function communicationBlock(providerMap) {
  let messenger = providerMap.get(`messenger`)
  let contactName = providerMap.get(`contactName`)

  switch (providerMap.get(`communicationMethod`)) {
    case `email`:
      return contactName === "" ? "" : `${contactName}`
    case `chat`:
      return contactName === "" ? "" : `${messenger}\n${contactName}`
    case `onlyPA`:
      return "";
    default:
      console.log(`В коллекции провайдера, в providerMaps.js, не указан параметр communicationMethod`);
      return "";
  }
}

//------------Блок с информацией об операции для провайдера----------------
function operationInfoBlock(operationMap) {
  let infoBlock = `\n`;

  for (let [key, value] of operationMap) {

    if (operationParameters.includes(key) && value !== ``) {
      infoBlock += `\n${key} ${value}`;
    }
  }
  return infoBlock;
}

//------------Блок с информацией об операции для финансистов----------------
function operationInfoFinBlock(operationMap) {
  let infoBlock = `\n`;

  for (let [key, value] of operationMap) {

    if (parametersFin.includes(key) && value !== ``) {
      infoBlock += `\n${key} ${value}`;
    }
  }
  return infoBlock;
}

//--------------Блок с дополнительным текстом для почты
function emailBlockRUS(providerMap) {
  let communicationMethod = "";

  if (providerMap.get("communicationMethod") === "email") {
    communicationMethod = "\n\nУбедительная просьба при ответе не менять тему письма и оставить цитирование.";
  }
  return communicationMethod;
}

function emailBlockENG(providerMap) {
  let communicationMethod = "";

  if (providerMap.get("communicationMethod") === "email") {
    communicationMethod = "\n\nShould you have any additional questions, please do not hesitate to contact us.\nWhen replying, please keep the subject of the email and the message history unchanged.";
  }
  return communicationMethod;
}

//----------Финальный статус язык сообщения-------------
function finalStatusTemplate(ProviderID, providerMap, operationMap) {
  switch (providerMap.get("lang")) {
    case "RUS":
      return templateClarifyFinalStatusRUS(providerMap, operationMap);
    case "ENG":
      return templateClarifyFinalStatusENG(providerMap, operationMap);
    default:
      console.log("Язык не указан");
      return "";
  }
}

//----------------------------Фин. статус RUS----------------------
function templateClarifyFinalStatusRUS(providerMap, operationMap) {
  let result = `${providerMap.get(`otherInfo`)} \n\n`;
  result += communicationBlock(providerMap);
  result += finalStatusBlockRUS(providerMap);
  result += operationInfoBlock(operationMap);
  result += saleOrPayoutBlockRUS(operationMap);
  result += emailBlockRUS(providerMap);
  return result;
}

function finalStatusBlockRUS(providerMap) {

  switch (providerMap.get("communicationMethod")) {
    case "email":
      return "\n\nДобрый день, коллеги!\nУточните, пожалуйста, финальный статус операции:";
    case "chat":
      return "\n\nКоллеги,\nУточните, пожалуйста, финальный статус операции:";
    case "onlyPA":
      return "У провайдера только личный кабинет";
    default:
      console.log("В коллекции провайдера, в providerMaps.js, не указан параметр communicationMethod");
      return "";
  }
}

function saleOrPayoutBlockRUS(operationMap) {
  let operType = operationMap.get("Operation Type:")
  let operStatus = operationMap.get("Operation Status:")
  let saleOrPayout = "";

  if (
    operStatus === "decline" &&
    operType === "sale"
  ) {
    saleOrPayout = "\n\nКлиент утверждает, что средства были списаны.\nПодтверждение во вложении.";

  } else if (
    operStatus === "success" &&
    operType === "payout"
  ) {
    saleOrPayout = "\n\nКлиент утверждает, что выплата не поступила.\nПодтверждение во вложении.";
  }
  return saleOrPayout;
}

//----------------------------Фин. статус ENG----------------------
function templateClarifyFinalStatusENG(providerMap, operationMap) {
  let result = `${providerMap.get(`otherInfo`)} \n\n`;
  result += communicationBlock(providerMap);
  result += finalStatusBlockENG(providerMap);
  result += operationInfoBlock(operationMap);
  result += saleOrPayoutBlockENG(operationMap);
  result += emailBlockENG(providerMap);
  return result;
}

function finalStatusBlockENG(providerMap) {

  switch (providerMap.get("communicationMethod")) {
    case "email":
      return "\n\nDear Partner,\nCan you please provide us with the final status of the following operation:";
    case "chat":
      return "\n\nDear Partner,\nCan you please provide us with the final status of the following operation:";
    case "onlyPA":
      return "У провайдера только личный кабинет";
    default:
      console.log("В коллекции провайдера, в providerMaps.js, не указан параметр communicationMethod");
      return "";
  }
}

function saleOrPayoutBlockENG(operationMap) {
  let operType = operationMap.get("Operation Type:")
  let operStatus = operationMap.get("Operation Status:")
  let saleOrPayout = "";

  if (
    operStatus === "decline" &&
    operType === "sale"
  ) {
    saleOrPayout = "\n\nThe client claims that the funds were debited.\nConfirmation in the attachment.";

  } else if (
    operStatus === "success" &&
    operType === "payout"
  ) {
    saleOrPayout = "\n\nThe client claims that the funds were not received.\nThe proof is in the attachment.";
  }
  return saleOrPayout;
}

//------------ARN RRN язык сообщения---------------
function ArnRrnTemplate(ProviderID, providerMap, operationMap) {

  switch (providerMap.get("lang")) {
    case "RUS":
      return templateClarifyArnRrnRUS(providerMap, operationMap, ProviderID);
    case "ENG":
      return templateClarifyArnRrnENG(providerMap, operationMap);
    default:
      console.log("Язык не указан");
      return "";
  }
}

//----------------------------ARN\RRN RUS----------------------
function templateClarifyArnRrnRUS(providerMap, operationMap, ProviderID) {
  let result = `${providerMap.get(`otherInfo`)} \n\n`;
  result += communicationBlock(providerMap);
  result += ArnRrnBlockRUS(providerMap, ProviderID);
  result += operationInfoBlock(operationMap);
  result += emailBlockRUS(providerMap);
  return result;
}

function ArnRrnBlockRUS(providerMap, ProviderID) {
  let confirmation = "ARN/RRN, либо подтверждающий документ для ";

  if ([4781, 4561, 5811].includes(ProviderID)) {
    confirmation = "чек для ";
  }

  switch (providerMap.get("communicationMethod")) {
    case "email":
      return `\n\nДобрый день, коллеги!\nПредоставьте, пожалуйста, ${confirmation}транзакции:`;
    case "chat":
      return `\n\nКоллеги,\nПредоставьте, пожалуйста, ${confirmation}транзакции:`;
    case "onlyPA":
      return "У провайдера только личный кабинет";
    default:
      console.log("В коллекции провайдера, в providerMaps.js, не указан параметр communicationMethod");
      return "";
  }
}

//----------------------------ARN\RRN ENG----------------------
function templateClarifyArnRrnENG(providerMap, operationMap) {
  let result = `${providerMap.get(`otherInfo`)} \n\n`;
  result += communicationBlock(providerMap);
  result += ArnRrnBlockENG(providerMap);
  result += operationInfoBlock(operationMap);
  result += emailBlockENG(providerMap);
  return result;
}

function ArnRrnBlockENG(providerMap) {

  switch (providerMap.get("communicationMethod")) {
    case "email":
      return "\n\nDear Partner,\nCan you please provide us with ARN/RRN or any other confirmation for the following operation:";
    case "chat":
      return "\n\nDear Partner,\nCan you please provide us with ARN/RRN or any other confirmation for the following operation:";
    case "onlyPA":
      return "У провайдера только личный кабинет";
    default:
      console.log("В коллекции провайдера, в providerMaps.js, не указан параметр communicationMethod");
      return "";
  }
}

//----------Причина отказа язык сообщения-------------
function declineReasonTemplate(ProviderID, providerMap, operationMap) {

  switch (providerMap.get("lang")) {
    case "RUS":
      return templateDeclineReasonRUS(providerMap, operationMap);
    case "ENG":
      return templateDeclineReasonENG(providerMap, operationMap);
    default:
      console.log("Язык не указан");
      return "";
  }
}

//----------------------------Причина отказа RUS----------------------
function templateDeclineReasonRUS(providerMap, operationMap) {
  let result = `${providerMap.get(`otherInfo`)} \n\n`;
  result += communicationBlock(providerMap);
  result += DeclineReasonBlockRUS(providerMap);
  result += operationInfoBlock(operationMap);
  result += "\n\nКод отказа: " + operationMap.get("Provider Code:")
  result += emailBlockRUS(providerMap);
  return result;
}

function DeclineReasonBlockRUS(providerMap) {

  switch (providerMap.get("communicationMethod")) {
    case "email":
      return "\n\nДобрый день, коллеги!\nУточните, пожалуйста, причину отклонения операции:";
    case "chat":
      return "\n\nКоллеги,\nУточните, пожалуйста, причину отклонения операции:";
    case "onlyPA":
      return "У провайдера только личный кабинет";
    default:
      console.log("В коллекции провайдера, в providerMaps.js, не указан параметр communicationMethod");
      return "";
  }
}

//----------------------------Причина отказа ENG----------------------
function templateDeclineReasonENG(providerMap, operationMap) {
  let result = `${providerMap.get(`otherInfo`)} \n\n`;
  result += communicationBlock(providerMap);
  result += DeclineReasonBlockENG(providerMap);
  result += operationInfoBlock(operationMap);
  result += "\n\nRejection code: " + operationMap.get("Provider Code:")
  result += emailBlockENG(providerMap);
  return result;
}

function DeclineReasonBlockENG(providerMap) {

  switch (providerMap.get("communicationMethod")) {
    case "email":
      return "\n\nDear Partner,\nPlease confirm the operation decline reason for the following transaction:";
    case "chat":
      return "\n\nDear Partner,\nPlease confirm the operation decline reason for the following transaction:";
    case "onlyPA":
      return "У провайдера только личный кабинет";
    default:
      console.log("В коллекции провайдера, в providerMaps.js, не указан параметр communicationMethod");
      return "";
  }
}

//----------Ручной возврат язык сообщения-------------
function manualRefundTemplate(ProviderID, providerMap, operationMap) {

  switch (providerMap.get("lang")) {
    case "RUS":
      return templateManualRefundRUS(providerMap, operationMap);
    case "ENG":
      return templateManualRefundENG(providerMap, operationMap);
    default:
      console.log("Язык не указан");
      return "";
  }
}

//----------------------------Ручной возврат RUS----------------------
function templateManualRefundRUS(providerMap, operationMap) {
  let result = `${providerMap.get(`otherInfo`)} \n\n`;
  result += communicationBlock(providerMap);
  result += manualRefundBlockRUS(providerMap);
  result += operationInfoBlock(operationMap);
  result += emailBlockRUS(providerMap);
  return result;
}

function manualRefundBlockRUS(providerMap) {

  switch (providerMap.get("communicationMethod")) {
    case "email":
      return "\n\nДобрый день, коллеги!\nПросьба осуществить ручной возврат средств в размере ____________ по операции:";
    case "chat":
      return "\n\nКоллеги,\nПросьба осуществить ручной возврат средств в размере ____________ по операции:";
    case "onlyPA":
      return "У провайдера только личный кабинет";
    default:
      console.log("В коллекции провайдера, в providerMaps.js, не указан параметр communicationMethod");
      return "";
  }
}

//----------------------------Ручной возврат ENG----------------------
function templateManualRefundENG(providerMap, operationMap) {
  let result = `${providerMap.get(`otherInfo`)} \n\n`;
  result += communicationBlock(providerMap);
  result += manualRefundBlockENG(providerMap);
  result += operationInfoBlock(operationMap);
  result += emailBlockENG(providerMap);
  return result;
}

function manualRefundBlockENG(providerMap) {

  switch (providerMap.get("communicationMethod")) {
    case "email":
      return "\n\nDear Partner,\nPlease perform a manual refund of _____________ with regards to the following operation:";
    case "chat":
      return "\n\nDear Partner,\nPlease perform a manual refund of _____________ with regards to the following operation:";
    case "onlyPA":
      return "У провайдера только личный кабинет";
    default:
      console.log("В коллекции провайдера, в providerMaps.js, не указан параметр communicationMethod");
      return "";
  }
}

//-----------------------Финансистам (возврат\отмена возврата)----------------------
function finRefundTemplate(ProviderID, providerMap, providerName, operationMap) {
  let merchant = operationMap.get("Merchant ID:") !== undefined ?
    `[${operationMap.get("Merchant ID:")}] ${operationMap.get("merchantName")}` :
    "________";
  return `
Если возврат был сделан успешно по кнопке, то оповещать фиников не надо, им итак упадёт уведомление.

ACP/MTX
finance@local.com
\n${providerName ?? "___________"} [Возврат средств]
\n\nКоллеги, добрый день!
По просьбе мерчанта ${merchant} был осуществлен возврат в размере _________ .
Пожалуйста, учтите данную информацию.
\nИнформация по транзакции: ${operationInfoFinBlock(operationMap)}
Merchant: ${merchant}`;
}

//-----------------------Финансистам (возврат\отмена возврата)----------------------
function partiallyPayoutP2PFinTemplate(ProviderID, providerMap, providerName, operationMap) {
  let merchant = operationMap.get("Merchant ID:") !== undefined ?
    `[${operationMap.get("Merchant ID:")}] ${operationMap.get("merchantName")}` :
    "________";
  return `
ACP/MTX
finance@local.com

\n${providerName ?? "___________"} [Частичная выплата]
\nКоллеги, добрый день!
При сверке с провайдером ${providerName} было обнаружено расхождение в сумме операции.
Со своей стороны, мы скорректировали статус транзакции ${operationMap.get(`Transaction ID:`)} в success.
По Operation ID ${operationMap.get(`Operation ID:`)}, до блокировки карты, пользователю выплачено _________ 
от общей суммы ${operationMap.get(`Incoming Amount:`)}. Выплатить оставшиеся ____________ нет возможности.
\nИнформация по транзакции: ${operationInfoFinBlock(operationMap)}
Merchant: ${merchant}`;
}


//-----------------------RCS уточнение причины отказа----------------------
function rcsWithoutAML(operationMap) {
  let merchant = operationMap.get("Merchant ID:") !== undefined ?
    `[${operationMap.get("Merchant ID:")}] ${operationMap.get("merchantName")}` :
    "________";
  return `Для всех RCS отказов (в которых нет слов про AML)
\nMNTX/ACP 
Monitoring@local.com
\n\n${merchant} | Уточните причину отклонения
\n\nДобрый день, коллеги
У мерчанта ${merchant} была отклонена транзакция ${window.location.href}
с кодом отказа ${operationMap.get("Provider Code:")}.
Уточните, пожалуйста, в чем причина отказа?`;
}

//----------------------- RCS добавить черный\белый список ---------------------
function rcsBlackWhiteList(operationMap, blackWhite) {
  let merchant = operationMap.get("Merchant ID:") !== undefined ?
    `[${operationMap.get("Merchant ID:")}] ${operationMap.get("merchantName")}` :
    "________";
  let purse = operationMap.get("Purse:") !== "" ? `, с реквизитами ${operationMap.get("Purse:")},` : "" ;

  if (blackWhite === "white"){
    return `Необходимо прикрепить документы клиента к письму.
\nMNTX/ACP 
Monitoring@local.com
\n\n${merchant} | Добавление в white list
\n\nДобрый день, коллеги!
Просьба добавить клиента ${operationMap.get("CustomerID")}${purse} в white list.
Пример транзакции:
${window.location.href}
\nЗаранее спасибо!`;
  } else if(blackWhite === "black") {
    return `Необходимо указать причину добавления в черный список.
\nMNTX/ACP 
Monitoring@local.com
\n\n${merchant} | Добавление в black list
\n\nДобрый день, коллеги!
Просьба добавить клиента ${operationMap.get("CustomerID")}${purse} в black list.
Причина ______________
Пример транзакции:
${window.location.href}
\nЗаранее спасибо!`;
  } else {
    return "Функция rcsBlackWhiteList не нашла нужное значение аргумента blackWhite"
  }
}

//---------------------Найти все операции и собрать по ним инфу в структуры. Также развесить кнопки.---------
function operationMaps() {
  let operationsID = find_value("Operation ID:");

  if (
    operationsID.length !== 0 &&
    window.location.href.includes("tab=Operations") &&
    firstMenuButtonCheck === false
  ) {
    console.log(`Операция загружена за ${loadTime} сек.`);

    for (let element of operationsID) {
      buttonsCreator(element);
      partiallyPaidOutIndicationAndInfo(element);
    }
    firstMenuButtonCheck = true;
    MenuButtonRechecker = true;
    rechecker();
  } else {
    loadTime++;
    setTimeout(() => {
      operationMaps()
    }, 1000);
  }
}

//--------- Основная функция прикрутки индикатора и инфоблока для Partially Paid Out -------------------
function partiallyPaidOutIndicationAndInfo(element){
  let ppoBlock;
  let indBlock;
  let operation_div = document.getElementById(element);
  let result = find_parameters(operation_div);  
  console.log(result);

  if(
    result.has("Merchant ID:") &&
    result.has("merchantPartiallyPaidOut") &&
    result.has("merchantProjects") &&
    result.get("Operation Type:") == "payout" &&
    result.get("Operation Status:") != "success"
  ){
    ppoBlock = partiallyPaidOutInputSearch(operation_div);
    indBlock = indBlockFunc(result);
    indBlock.append(ppoBlock.firstElementChild);
    ppoBlock.append(indBlock);
    borderPPOColor(result, indBlock);
    indBlock.setAttribute("title", result.get("partiallyPaidOutInfo"));
        console.log(ppoBlock);
  }
}

//------------------ Устанавливаем цвет границы PPO ----------------
function borderPPOColor(result, indBlock) {
  let bordColor = result.get("merchantPartiallyPaidOut") ? "rgba(5, 255, 5, .2)" : "rgba(255, 5, 5, .2)";
  indBlock.style.borderColor = bordColor;
  console.log(bordColor);
}

//----------- создаём пустой макет для индикатора PPO в который будем заливать бэкграунд по условию.
function indBlockFunc(result){ 
  let indDiv = document.createElement("div");
  indDiv.className = "indDiv";
  indDiv.id = 'indDiv_' + result.get("Operation ID:");
  return indDiv;
}

//-------------------- Функция поиска блока input PPO --------------------------------------
function partiallyPaidOutInputSearch(operation_div){
  let elemInput = operation_div.getElementsByTagName("input")

  for(let element of elemInput){

    if(
      element.getAttribute("type") == "text" &&
      element.getAttribute("placeholder") == "Actual amount (in minor units)" &&
      element.hasAttribute("NAME")
    ){
      return element.parentNode.parentNode;
    }
  }
}


//---------Проверка наличия кнопок и установок их в случае если они отсутсвуют---------------------
function rechecker() {
  console.log("Речекер" + MenuButtonRechecker);
  
  if (
    firstMenuButtonCheck === true &&
    MenuButtonRechecker === true
  ) {
    setTimeout(() => {
      rechecker()
    }, 200);

    if (window.location.href.includes("tab=Operations")) {
      MenuButtonRechecker = true;

    } else {
      MenuButtonRechecker = false;
    }

  } else {
    if (window.location.href.includes("tab=Operations")) {
      let operationsID = find_value("Operation ID:");

      if (
        operationsID.length !== 0 &&
        window.location.href.includes("tab=Operations")
      ) {
        for (let element of operationsID) {
          buttonsCreator(element);
          partiallyPaidOutIndicationAndInfo(element);
        }
      }
      MenuButtonRechecker = true;

    } else {
      MenuButtonRechecker = false;
    }
    setTimeout(() => {
      rechecker()
    }, 200);
  }
}

//------Функция развешивает кнопки (для первичной обработки и последующего речека)-----------------
function buttonsCreator(element) {
  let operation_div = document.getElementById(element);
  let result = find_parameters(operation_div);
  operations.set(element, result);
  createAMenuButtonInTheOperationBlock(element, result);
  let providerBlock = find_operations_providers_objects(operation_div);
  ButtonForPersonalAccount(element, providerBlock, result);
}

//---------------------------------------------------------------------------------------
const merchantMapParams = [ // Массив наименований из структуры мап мерчанта
  "merchantName",
  "merchantLang",
  "merchantOtherInfo",
  "merchantProjects",
  "merchantPartiallyPaidOut",
  "partiallyPaidOutInfo",
  "merchantLegalEntity",
  "firstMerchantKamAddress",
  "secondMerchantKamAddress"
];

const parameters = [ // Массив наименований параметров операции
  "Transaction ID:",
  "Operation ID:",
  "Provider Payment ID:",
  "Payment ID:",
  "Operation Type:",
  "Operation Status:",
  "ARN:",
  "RRN:",
  "Incoming Amount:",
  "Converted Amount:",
  "Created At:",
  "Updated At:",
  "Purse:",
  "Payment Method:",
  "Payment Type:",
  "Avs Result:",
  "Provider Code:",
  "Mapped Processor Code Id:",
  "Unified Response Code:",
  "Customer:",
  "Project:",
  "Merchant Account:",
  "Provider:"
];

const exceptions = [ // Массив наименований параметров исключений
  "Operation Status:",
  "Payment Type:",
  "Customer:",
  "Project:",
  "Merchant Account:",
  "Provider:"
];

const textLinkIDlist = [ // Массив наименований в содержаний строки которых ID
  "Customer:",
  "Project:",
  "Merchant Account:",
  "Provider:"
];

const parametersFin = [ // Массив наименований инфы для запросов финикам
  "Transaction ID:",
  "Operation ID:",
  "Provider Payment ID:",
  "Payment ID:",
  "Operation Type:",
  "Operation Status:",
  "Incoming Amount:",
  "Converted Amount:",
  "Created At:",
  "Updated At:",
  "Purse:",
  "Project:",
  "Provider:"
];

  const operationParameters = [ // Массив инфы по операции для шаблонов провайдеру
    "Operation ID:",
    "Provider Payment ID:",
    "Operation Type:",
    "Incoming Amount:",
    "Created At:",
    "Purse:"
  ];

  const otrsResponseID = [ // Массив номеров ResponseID Английских шаблонов из url адреса
    64, 121, 157, 151, 81, 168,
    153, 170, 178, 4, 166, 163,
    98, 176, 136, 159, 161, 147,
    155, 135, 77, 127, 144, 106,
    149, 142, 181, 130, 123, 84,
    172, 193, 174, 20
  ];



//------------------------- OTRS 
//---------------------another-company Wallet 
let labels;
if(window.location.href.includes("support.another-company.pro/otrs/index.pl")) {
  labels = document.getElementsByTagName('label');
}


//--------------- Функция возвращает true, если очередь тикета "another-companywallet" (На странице самого тикета) ------------
function walletTicketChecker(){

  for (let element of labels){

    if (element.innerHTML == 'Очередь:'){
      return element.nextElementSibling.innerHTML == "another-companywallet" ? true : false;
    }
  }
}
//-------------- Функция возвращает true, если очередь тикета "another-companywallet" (В окне сообщения) --------------
function walletTicketAnswerWindowChecker() {

  for(let element of labels){

    if(element.innerHTML == "Отправитель:"){
      return element.nextElementSibling.innerText == `"help@another-companywallet.com" <help@another-companywallet.com>` ? true : false; 
    }
  }
}


//----------- Находим и располагаем по DOM элемент div для выпадающего списка шаблонов -----------
function addTemplatesBlock(){

  let childForTemplatesPlace;
  let parentForTemplatesPlace;

  for ( let element of labels){

    if(element.getAttribute("for") == "Subject"){
        childForTemplatesPlace = element.nextSibling.nextSibling.nextSibling.nextSibling;
        parentForTemplatesPlace = childForTemplatesPlace.parentNode;
        parentForTemplatesPlace.insertBefore(labelForTemplateList(), childForTemplatesPlace);
        parentForTemplatesPlace.insertBefore(templateList(), childForTemplatesPlace);
    }
  }
}

function labelForTemplateList() {
  let labelForTemp = document.createElement("label");
  labelForTemp.innerText = "Шаблоны:";
  return labelForTemp;
}

//----------- Создаём выпадающий список с шаблонами ------------
function templateList(){
  let divForTemplates = document.createElement("div");
  divForTemplates.className = "Field";

  let selectForTemplates = document.createElement("select");
  selectForTemplates.className = "js-select2 select_wrp";
  selectForTemplates.id = "selectForTemplates"
  selectForTemplates.setAttribute("name", "template");
  selectForTemplates.setAttribute("size",3);  
  divForTemplates.append(selectForTemplates);

  for (let [idx, element] of templatesMW.entries()){
    let optionForTemplatesTest = document.createElement("option");
    optionForTemplatesTest.setAttribute("value",idx);
    optionForTemplatesTest.innerHTML = element.subject;
    selectForTemplates.append(optionForTemplatesTest);
  }

  return divForTemplates
}

// ----------------- Подпись для сообщения ------------------
function signatureMW(){
  let signatureSpanFontSize = document.createElement("span");
  signatureSpanFontSize.setAttribute("style","font-size:16px");

  let signatureSpanFontColor = document.createElement("span");
  signatureSpanFontColor.setAttribute("style","color:#f39c12");

  let signatureSpanFontFamily = document.createElement("span");
  signatureSpanFontFamily.setAttribute("style","font-family:Lucida Sans Unicode,Lucida Grande,sans-serif");

  signatureSpanFontSize.append(signatureSpanFontColor);
  signatureSpanFontColor.append(signatureSpanFontFamily);
  signatureSpanFontFamily.innerText = "\n\n\nanother-company Wallet\nSupport Team\n";

  return signatureSpanFontSize;
}

//------------ Сносит прежнее окно шаблонов MW ----------------------

function removeTemplateBlock(){

  for ( let element of labels){

    if (element.innerText == "Текстовый шаблон:"){
      element.nextSibling.nextSibling.remove();
      element.nextSibling.remove();
      element.remove();
    }
  }
}

//----------- Добавляет последние сообщения при генерации шаблона MW -------------------
function previousMessages(iframeMessageWindow){
  let messages
  let previousMessagesWithDate
  if (iframeMessageWindow.lastElementChild.tagName == "DIV"){
    messages = iframeMessageWindow.lastElementChild;
    iframeMessageWindow.lastElementChild.remove();
    previousMessagesWithDate = iframeMessageWindow.lastChild;
  } else {
    messages = document.createElement("br");
    previousMessagesWithDate = document.createElement("br");
  }
    return [previousMessagesWithDate, messages];
}

function otrsRemoveRusHello(){

  for (let id of otrsResponseID){

    if(
      window.location.href.includes("https://support.another-company.pro/otrs/index.pl?ChallengeToken") &&
      window.location.href.includes("&ReplyAll=") &&
      window.location.href.includes("ResponseID="+id)
    ){
      findIframe();
      break;
    }
  }  
}



//----------- Ищем iframe
function findIframe(){
  let frame = document.getElementById("cke_1_contents");

  if(frame == null){
    setTimeout(() => {findIframe();},100)
    
  } else {

    if(frame.lastElementChild.contentDocument.body == null){
      setTimeout(() => {findIframe();},100)

    }else{
      otrsFindHello(frame);
    }
  }
}

//---------- Функция которая находит блок сообщения в фрейме и удаляет слово.
function otrsFindHello(frame){
    let iframeMessageWindow = frame.lastElementChild.contentDocument.body;
    console.log(iframeMessageWindow);
    
    if(iframeMessageWindow.firstChild.textContent == "Здравствуйте,"){
      iframeMessageWindow.firstChild.remove()
    }
}

//---------------------------------
//---------------------------------

function main() {

//----------- Запускается в Бэкоффис ------------------------
  if(window.location.href.includes("backoffice.company.com") || window.location.href.includes("backoffice.one-company.com")){
    operationMaps();
  }

//------------ Запускается в самом тикете ОТРС another-company Wallet ------------------
  if(window.location.href.includes("AgentTicketZoom")){
    console.log("Это тикет Монетикс Воллет - " ,walletTicketChecker());
  }

// ------------- Запускается в окне сообщения OTRS another-company Wallet ---------------
  if (window.location.href.includes("AgentTicketEmailOutbound") || window.location.href.includes("https://support.another-company.pro/otrs/index.pl?ChallengeToken=")){

    if (walletTicketAnswerWindowChecker()){
      removeTemplateBlock();
      addTemplatesBlock();
    }
  };


//--------- Удаляет Русское "Здравствуйте" из Английских шаблонов
  otrsRemoveRusHello();

//---------- Select2 для шаблонов MW ---------------------
  $(document)
  .ready(function() {
    $('.js-select2').select2({
      placeholder: "Выберите шаблон",
      language: "ru"
      });
  })
  .on("select2:open", () => {
    document.querySelector('.select2-search__field').focus();
  });

//------------ Onclick по строке в шаблонах MW ---------------------
  $('#selectForTemplates').on("select2:select", function(e) {

    let frame = document.getElementById("cke_1_contents");
    let iframeMessageWindow = frame.lastElementChild.contentDocument.body;
    let textContent = templatesMW[e.params.data.id].content;
    let [dateMessage, prevMessages] = previousMessages(iframeMessageWindow);

    iframeMessageWindow.innerHTML = textContent;
    iframeMessageWindow.appendChild(signatureMW());

    if(dateMessage != undefined && prevMessages != undefined){

      if(prevMessages.tagName == "DIV"){
        let br = document.createElement("br");
        iframeMessageWindow.appendChild(br);
      }
      iframeMessageWindow.appendChild(dateMessage);
      iframeMessageWindow.appendChild(prevMessages);
    }
  });
}

window.onload = main;