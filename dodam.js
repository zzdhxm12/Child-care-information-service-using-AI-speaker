const uuid = require('uuid').v4
const _ = require('lodash')
const { DOMAIN } = require('../config')
const connect = require('connect')
const mysql = require('sync-mysql')
var async= require('async')
const client = require('cheerio-httpcli');
const qs = require('querystring');

var pool = new mysql({
    host :'localhost',
    port : 3306,
    user : 'root',
    password : 'root',
    database:'nugu',
})
function askfood(foodi) {
  let menu=''
  let food=''
  console.log(`food : ${foodi}`)
  var result = new Array()
  var k = 0
  food = `${foodi}`
  let res = pool.query("select mname from menu where ingredient = '"+food+"'")
  console.log(res)
  console.log(res.mname)
  Object.keys(res).forEach(function(key){
    result[k]=res[key];
    console.log(result[k].mname);
    k++
  })
  console.log(menu)
  menu = result[0].mname
  return {food, menu}
}
function answercook(menus){
  let menu=''
  let cook=''
  pool.connect()
  menu = `${menus}`
  cook = 'hhh'
  pool.query('select mingredient from cook where mname = ?', menu, function(err, rows){
    if(!err){
        var result = new Array()
        var k = 0
        Object.keys(rows).forEach(function(key){
          result[k]=rows[key];
          console.log(result[k].mingredient);
          k++
         })
        console.log("The solution is : ",rows)
        console.log(result[0].mingredient)
    }
    else
      console.log("Error while performing Query.", err)
    return result[0].mingredient
  })
  console.log(cook)
  pool.end()
  return {menu,cook}
}
function askgrowth(ages, tags){
  let age=''
  let tag=''
  let feature=''
  pool.connect()
  age = `${ages}`
  tag = `${tags}`
  feature = ''
  if(tag!=''){
    feature = pool.query('select feature from growth where age = ? and tag = ?', age, tag, function(err, rows){
    if(!err){
        var result = new Array()
        var k = 0
        Object.keys(rows).forEach(function(key){
          result[k]=rows[key];
          console.log(result[k].feature);
          k++
         })
        console.log("The solution is : ",rows)
        console.log(result[0].feature)
    }
    else
      console.log("Error while performing Query.", err)
    return result[0].feature
  })
  console.log(feature)
  pool.end()
  return {age, tag, feature}
  }
  else{
    feature = pool.query('select feature from growth where age = ?', age, function(err, rows){
    if(!err){
        var result = new Array()
        var k = 0
        Object.keys(rows).forEach(function(key){
          result[k]=rows[key];
          console.log(result[k].feature);
          k++
         })
        console.log("The solution is : ",rows)
        console.log(result[0].feature)
    }
    else
      console.log("Error while performing Query.", err)
    return result[0].feature
  })
  console.log(feature)
  pool.end()
  return {age, feature}
  }
}
// ask.remedy 응급상황(약)
function askremedy(sickk) {
  let illness = ''
  let remedy = ''
  let sick = `${sickk}`
  var result = new Array()
  var k = 0
  console.log(sick)
  let res = pool.query("select answer,remedy from remedy where entity = '"+sick+"'")
  console.log(res)
  Object.keys(res).forEach(function(key){
    result[k]=res[key];
    k++
  })
  illness = result[0].answer
  remedy = result[0].remedy
  console.log(illness + remedy)
  return {illness, remedy}
}
//ask.recommend
function askrecommend(sick) {
  let recommend = ''
  let rsick = `${sick}`
  let res = pool.query("select rr.brand from r_remedy as rr join remedy as r on rr.remedy = r.remedy where r.entity = '"+rsick+"' order by rand() limit 1")
  console.log(res)
  Object.keys(res).forEach(function(key){
    result[k]=res[key];
    k++
  })
  recommend = result[0].brand
  return {recommend}
}
//나이-응급상황(약)
function askmultisick (m_age) {
  let multi_illness = ''
  let multi_remedy = ''
  let multi_age = `${m_age}`
  let slt = new Array()
  var result = new Array()
  var k = 0
  slt = multi_age.split(' ')
  console.log(slt[0])
  console.log(slt[1])
  if (slt[1] == '개월') {
    if(2<=slt[0]&&slt[0]<5) { multi_age = '2개월 이상' }
    else if(slt[0]>=5) { multi_age = '5개월 이상' }
  }
  else if(slt[1] == '살') { multi_age = '5개월 이상' }
  let res = pool.query("select answer,age,remedy from multiremedy where age = '"+multi_age+"'")
  console.log(res)
  Object.keys(res).forEach(function(key){
    result[k]=res[key];
    console.log(result[k].answer)
    console.log(result[k].remedy)
    k++
  })
  if(k>0) {
    multi_illness = result[0].answer
    multi_remedy = result[0].remedy
  }
  else {
    multi_illness = 'nothing'
    multi_remedy = 'nothing'
  }
  return {multi_illness, multi_remedy}
}
//예방접종
function askvaccination(v_age) {
  let vaccination = ''
  let vvage = `${v_age}`
  var result = new Array()
  var k = 0
  var vac = new Array()
  vac = vvage.split(' ')
  console.log(vac[0])
  console.log(vac[1])
  vvage = vac[0] + vac[1]
  console.log(vvage)
  let res = pool.query("select vaccination from vaccination where age  = '"+vvage+"'")
  console.log(res)
  Object.keys(res).forEach(function(key){
    result[k]=res[key];
    vaccination += ",  " + result[k].vaccination
    k++
  })
  console.log(k)
  if(k<=0) {vaccination = 'nothing'}
  console.log(vaccination)
  return {vvage, vaccination}
}
//행사
var ci
var ni = 0
let cc = new Array()
//askevent
function askevent (locat, day, type) {
  ci = 0
  ni = 0
  let location = `${locat}`
  let dayy = `${day}`
  let typee = `${type}`
  let answer = ''
  let babyfair = ''
  let userquery = ''
  if(dayy=='') {userquery = location + " " + typee}
  else {userquery = dayy + "월 " + location + " " + typee}
  console.log(userquery)
  let encodeurl = qs.escape(userquery)
  let url = 'https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query='+encodeurl
  fres = client.fetchSync(url)
  if(fres.error) {console.log(fres.error)}
  else {
    var ffres = new Array()
    var $ = fres.$
    if(typee == '베이비페어'){
      $(".tit_box").each(function (){
        var slt = new Array();
          craw[ci]=$(this).text();
          slt = craw[i].split('  ');
          craw[ci] = '';
          craw[ci] = {title:slt[0], location:slt[1], date:slt[2]};
          ci++;
      })
    }
    else if(typee == '어린이 공연'){
      $(".tit").each(function (){
        var slt = new Array();
          craw[ci]=$(this).text();
          slt = craw[i].split('-');
          craw[ci].title = slt[0];
          ci++;
      })
      $(".period").each(function (){
        var slt = new Array();
          craw[ci].date=$(this).text();
          ci++;
      })
      $(".list_cate").each(function (){
        var slt = new Array();
          craw[ci].location=$(this).text();
          ci++;
      })
    }
  }
  if(ci>0) {
    answer = craw[0].date + " " + craw[0].location
  }
  else {
    answer = 'nothing'
    babyfair = 'nothing'
  }
  for(var ll=0;ll<craw.length;ll++){
    console.log(craw[ll].title)
    cc[ll] = {title:craw[ll].title, location:craw[ll].location, date:craw[ll].date}
  }
  return {answer, babyfair}
}
//ask.next
function asknext() {
 ni++
 let nextanswer = ''
 let nextbabyfair = ''
 if(ni<ci) {
   nextanswer = cc[ni].date + " " + cc[ni].location
   nextbabyfair = cc[ni].title
 }
 else {
   nextanswer = 'nothing'
   nextbabyfair = 'nothing'
 }
 console.log(nextanswer)
 console.log(nextbabyfair)
 return {nextanswer, nextbabyfair}
}
//ask.eventnext
function asknextevent() {
 ni++
 let nanswer = ''
 let nbabyfair = ''
 if(ni<ci) {
   nanswer = cc[ni].date + " " + cc[ni].location
   nbabyfair = cc[ni].title
 }
 else {
   nanswer = 'nothing'
   nbabyfair = 'nothing'
 }
  return {nanswer, nbabyfair}
}
//ask.askvaccination
function askaskvaccination(vacci_name) {
  var result = new Array()
  let vacci_nam = `${vacci_name}`
  var k = 0
  let vacci_age = ''
  let res = pool.query("select age from vaccination where vaccination like '%"+vacci_nam+"%'")
  console.log(res)
  Object.keys(res).forEach(function(key){
    result[k]=res[key];
    vacci_age += ", " + result[k].age
    k++
  })
  if(k<=0) {vacci_age = 'nothing'}
  return {vacci_age}
}

class NPKRequest {
  constructor (httpReq) {
    this.context = httpReq.body.context
    this.action = httpReq.body.action
    console.log(`NPKRequest: ${JSON.stringify(this.context)}, ${JSON.stringify(this.action)}`)
  }
  do(npkResponse) {
    this.actionRequest(npkResponse)
  }
  actionRequest(npkResponse) {
    console.log('actionRequest')
    console.dir(this.action)

    const actionName = this.action.actionName
    const parameters = this.action.parameters

    switch (actionName) {
      case 'answerfood':
        let foodi = ''
        const foodSlot = parameters.food
        if (parameters.length != 0 && foodSlot) {
          foodi = foodSlot.value
        }
        const foodResult = askfood(foodi)
        npkResponse.setOutputfoodParameters(foodResult)
        break
      case 'answer.cook':
        let menus = ''
        const menuSlot = parameters.menu
        if (parameters.length != 0 && menuSlot) {
          menus = menuSlot.value
        }
        const cookResult = cook(menus)
        npkResponse.setOutputcookParameters(cookResult)
        break
      case 'answer.growth':
        let ages = ''
        let tags = ''
        const ageSlot = parameters.age
        const tagSlot = parameters.tag
        if (parameters.length != 0 && ageSlot) {
          ages = ageSlot.value
          if(tags)
            tags = tagSlot.value
        }
        const growResult = askgrowth(ages, tages)
        npkResponse.setOutputgrowParameters(growResult)
        break
      case 'answer.remedy':
        let sickk = ''
        const sickSlot = parameters.sick
        if (parameters.length != 0 && sickSlot) {
          sickk = sickSlot.value
          console.log(sickk) // 상처  잘 나옴
        }
        const sickResult = askremedy(sickk)
        console.log(sickResult.illness)
        npkResponse.setOutputremedyParameters(sickResult)
        break
      case 'answer.vaccination':
        let v_age = ''
        const vageSlot = parameters.v_age
        if (parameters.length != 0 && vageSlot) {
          v_age = vageSlot.value
        }
        const ageResult = askvaccination(v_age)
        npkResponse.setOutputvaccinationParameters(ageResult)
        break
      case 'answer.event':
        let locat = ''
        let day = ''
        let type = ''
        const locatSlot = parameters.location
        const daySlot = parameters.day
        const typeSlot = paarameters.type
        if (parameters.length != 0 && locatSlot) {
          locat = locatSlot.value
        }
        if (parameters.length != 0 && daySlot) {
          day = daySlot.value
        }
        if (parameters.length != 0 && typeSlot) {
          type = typeSlot.value
        }
        const eventResult = askevent(locat, day, type)
        npkResponse.setOutputeventParameters(eventResult)
        break
      case 'answer.recommend':
        let rsick = ''
        const rsickSlot = parameters.sick
        if (parameters.length != 0 && rsickSlot) {
          rsick = rsickSlot.value
        }
        const recommendResult = askrecommend(rsick)
        npkResponse.setOutputrecommendParameters(recommendResult)
        break
      case 'answer.multisick':
        let msick = ''
        const msickSlot = parameters.multi_age
        console.log("1:"+msickSlot)
        if (parameters.length != 0 && msickSlot) {
          msick = msickSlot.value
          console.log("2:"+msick)
        }
        const multisickResult = askmultisick(msick)
        npkResponse.setOutputmultisickParameters(multisickResult)
        break
      case 'answer.next':
        const nextResult = asknext()
        npkResponse.setOutputnextParameters(nextResult)
        break
      case 'answer.nextevent':
        const nexteventResult = asknextevent()
        npkResponse.setOutputnexteventParameters(nexteventResult)
        break
      case 'answer.askvaccination':
        let vacci = ''
        const vacciSlot = parameters.vacci_name
        if (parameters.length != 0 && vacciSlot) {
          vacci = vacciSlot.value
        }
        const vacciResult = askaskvaccination(vacci)
        npkResponse.setOutputvacciParameters(vacciResult)
        break
    }
  }
}

class NPKResponse {
  constructor () {
    console.log('NPKResponse constructor')

    this.version = '2.0'
    this.resultCode = 'OK'
    this.output = {}
    this.directives = []
  }
  setOutputcookParameters(cookResult) {
    this.output = {
      cooki: cookResult.menu,
    }
  }
  setOutputnextParameters(nextResult) {
    this.output = {
      nextanswer: nextResult.nextanswer,
      nextbabyfair: nextResult.nextbabyfair,
    }
  }
  setOutputnexteventParameters(nexteventResult) {
    this.output = {
      nanswer: nexteventResult.nanswer,
      nbabyfair: nexteventResult.nbabyfair,
    }
  }
  setOutputvacciParameters(vacciResult) {
    this.output = {
      vacci_age: vacciResult.vacci_age,
    }
  }
  setOutputgrowParameters(growResult) {
    this.output = {
      age: growResult.age,
      tag: growResult.tag,
      feature: growResult.feature,
    }
  }
  setOutputfoodParameters(foodResult) {
    this.output = {
      menu: foodResult.menu,
      food: foodResult.food,
    }
  }
  setOutputremedyParameters(sickResult) {
    this.output = {
      illness: sickResult.illness,
      remedy: sickResult.remedy,
    }
  }
  setOutputvaccinationParameters(ageResult) {
    this.output = {
      v_age: ageResult.vvage,
      vaccination: ageResult.vaccination,
    }
  }
  setOutputeventParameters(eventResult) {
    this.output = {
      answer: eventResult.answer,
      event: eventResult.babyfair,
    }
  }
  setOutputrecommendParameters(recommandResult) {
    this.output = {
      recommend: recommendResult.recommend
    }
  }
  setOutputmultisickParameters(multisickResult) {
    this.output = {
      multi_illness: multisickRe:sult.multi_illness,
      multi_remedy: multisickResult.multi_remedy,
    }
  }
}

const nuguReq = function (httpReq, httpRes, next) {
  npkResponse = new NPKResponse()
  npkRequest = new NPKRequest(httpReq)
  npkRequest.do(npkResponse)
  console.log(`NPKResponse: ${JSON.stringify(npkResponse)}`)
  return httpRes.send(npkResponse)
};

module.exports = nuguReq
