# Child-care-information-service-using-AI-speaker

기존의 육아 정보 탐색 방법들은 분야마다 분산되어 있는 정보들로 인해 검색에 오랜 시간이 필요하고 비전문가들을 통해 전달되는 정보로 신뢰성 있는 정보들을 제공하지 못했다. 따라서 이 연구에서는 인공지능 서비스 NUGU를 통해 신속하고 신뢰성 있는 육아 정보를 보다 편리하게 제공할 수 있도록 한다.

## Introduction

응급처치(약), 예방접종 시기, 유아식 종류 및 재료, 어린이 행사(베이비페어, 어린이 공연)일정, 나이별 성장 발달 등의 정보를 제공하여 
아이를 키우는 사용자에게 편의를 제공해주는 Play

### 기능

* 응급처치(약)

* 예방 접종 시기

* 유아식 종류 및 필요 재료

* 어린이 행사(베이비페어, 어린이 공연) 일정

* 나이 별 성장 발달 상황

### 특징

* AI 스피커 NUGU를 통해 사용자가 직접 컴퓨터나 핸드폰을 통해 검색하지 않고 NUGU와의 대화를 통해 정보를 얻을 수 있음

* NUGU를 통해 얻은 육아 정보를 통해 엄마, 아빠 모두 육아에 조금 더 쉽게 접근 가능

* 전문 서적, 육아 커뮤니티, 육아 정보 사이트에서 크롤링/분석된 정보를 가공하여 Database 구축

* Backend에서 DB에 저장된 약품 종류, 예방 접종 종류, 유아식 종류, 나이 별 발달 상황 등을 불러와 사용자에게 정적 정보 제공

* Backend에서 현재 개최되고 있는 어린이 행사를 크롤링하여 사용자에게 실시간 정보 제공

## NUGU Play

발화 모델 생성을 위하여 NUGU Play 서비스를 이용한다. Play는 NUGU 플랫폼의 엔진들과 통신해 서비스를 제공하는 단위로서, 사용자와 상호 작용하여 의도를 이해하고 그에 맞는 적절한 답변을 주거나 명령을 수행한다. 사용자와 Play가 음성 대화를 통해 상호 작용할 수 있도록 하는 언어모델을 User Utterance Model이라고 하며, Play는 이러한 모델을 통해 사용자의 발화를 이해하고 그 속에 담긴 요청/명령을 수행한다.

User Utterance Model은 Play의 기능을 동작시키기 위해 표현하는 사용자 의도를 의미하는 Intent와 사용자의 요청을 정확히 처리하기 위해 Intent 외에 추가로 알아야 하는 개체인 Entity로 구성된다. Play에서는 하나의 Intent를 처리하기 위해 최소 등록 단위인 Action을 사용한다. Action이란 사용자가 목적 달성을 위해 Play에 발화한 것에 대한 응답을 미리 지정해 두는 것으로,  일반적으로 하나의 Intent에 대해 하나의 Action을 등록한다. 

![image](https://user-images.githubusercontent.com/53864655/72128857-96304900-33b7-11ea-9031-9794f420db65.png)

위의 그림에서 time과 location이 Entity이며, “날씨 알려줘”와 같은 발화들이 Intent이다. Play에서는 하나의 Intent를 처리하기 위해 최소 등록 단위인 Action을 사용한다. Action이란 사용자가 목적 달성을 위해 Play에 발화한 것에 대한 응답을 미리 지정해 두는 것으로,  일반적으로 하나의 Intent에 대해 하나의 Action을 등록한다. 위 그림에서 "날씨는 ~~~ 합니다." 와 같은 응답을 Action이라고 칭한다. 

## Architecture

### 시스템 구조도

![image](https://user-images.githubusercontent.com/53864655/72048298-d16f4100-32ff-11ea-8c9a-1164a1648d1e.png)

Play는 요청된 정보의 종류에 따라 데이터베이스 또는 외부 서비스와 연동되어 수행 된다. 응급처치(약), 예방 접종, 유아식 종류 및 재료, 나이 별 발달 사항과 같은 정적 콘텐츠일 경우, 데이터베이스에 저장된 정보를 제공한다. 이때, 데이터베이스에는 의사가 보장한 전문 사이트와 전문 서적을 통해 얻은 정보가 가공되어 저장되어 있다. 어린이 행사 일정과 같은 실시간 정보의 경우, cheerio-httpcli모듈을 사용하여 외부 서버에서 정보를 크롤링하여 제공한다. 

### Play 구조도

![image](https://user-images.githubusercontent.com/53864655/72129570-0b9d1900-33ba-11ea-8aaf-7ae451651c2f.png)

### Entity Types

![image](https://user-images.githubusercontent.com/53864655/72129574-0f30a000-33ba-11ea-8ff4-77d491cbed8c.png)


## Usecase

#### 응급처치 – 의약품 : 아이의 증상에 따라 적절한 의약품 추천

* 주의가 필요한 의약품

![image](https://user-images.githubusercontent.com/53864655/72047498-ffec1c80-32fd-11ea-962b-a586da31025c.png)

* 일반적인 의약품

![image](https://user-images.githubusercontent.com/53864655/72047759-99b3c980-32fe-11ea-89d3-d0b838d79e2b.png)

#### 유아식 종류 및 재료 : 음식 재료를 바탕으로 적절한 유아식 메뉴 정보 제공

![image](https://user-images.githubusercontent.com/53864655/72047629-59544b80-32fe-11ea-87b6-1dfbda82d513.png)

#### 나이 별 발달 사항 : 아이의 나이에 따라 발달 사항 정보 제공

* 필수 파라미터가 없는 경우

![image](https://user-images.githubusercontent.com/53864655/72047857-cf58b280-32fe-11ea-92bc-7e2ad4e8f94a.png)

* 필수 파라미터가 모두 있는 경우

![image](https://user-images.githubusercontent.com/53864655/72047903-eb5c5400-32fe-11ea-9580-13e8be10e6cc.png)

#### 예방 접종 시기 : 예방 접종 시기 정보 제공

* Parameter:나이 | Result:접종 종류

![image](https://user-images.githubusercontent.com/53864655/72047963-13e44e00-32ff-11ea-9e5a-f0eba9408529.png)

* Parameter:접종 종류 | Result:나이

![image](https://user-images.githubusercontent.com/53864655/72047993-1f377980-32ff-11ea-923a-434cbc494252.png)

나이 Parameter : 1개월, 2개월, ..., 12세

접종 종류 Parameter : 홍역, 수두, 디프테리아, 일본 뇌염, 파상풍, 폐렴구균, B형 간염, ..., 풍진 

#### 행사 : 날짜와 지역에 따라 어린이 행사 일정 제공

* 지역 : 필수 Parameter 포함 안된 경우

![image](https://user-images.githubusercontent.com/53864655/72048086-5ad24380-32ff-11ea-8700-e1310d6ba48a.png)

* 날짜 : 필수 Parameter 포함 안된 경우

![image](https://user-images.githubusercontent.com/53864655/72048139-78071200-32ff-11ea-8dd8-b46fd1df376b.png)

* 필수 파라미터가 모두 있는 경우

![image](https://user-images.githubusercontent.com/53864655/72048206-9bca5800-32ff-11ea-8c12-4bcabeb8522e.png)

