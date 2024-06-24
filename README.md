# 나의 뮤직 챠트

이 웹사이트는 Python을 사용하여 지정된 음악 데이터를 가져오고, YouTube API를 통해 관련 음악 영상을 표시하는 간단한 웹 애플리케이션입니다. 다양한 음악 플랫폼에서 인기 챠트 100개씩 매일 업데이트 되어 각 사이트의 랭킹 top 100위 음악을 쉽게 비교하고 들을 수 있습니다. 원하는 곡을 클릭할경우 아래 이미지처럼 해당곡의 유튜브 검색 결과를 볼 수 있습니다. 또한, 밝은 테마 외에도 다크테마 기능역시 제공합니다.

<img src="https://github.com/sunhew/youtubmusic/assets/161446039/735db862-754e-4120-903e-eb6ae0fd0e01" alt="헤더" width="90%"/>
<img src="https://github.com/sunhew/youtubmusic/assets/161446039/3f0bb40a-049c-4339-93fd-b2c93c29f11d" alt="헤더" width="90%"/>

# 설치한 요소

```
npm i react-router-dom
npm i sass
npm i react-icons
npm i react-player
npm i react-spinners /로딩
npm i react-datepicker /달력
npm i axios
npm i react-toastify
npm i react-modal
```

# API와 JSON을 이용한 뮤직 플레이 사이트 "마이 뮤직"

**[마이뮤직](https://youtubmusic.vercel.app/)는`REACT` 와 `API`를 사용하여 만든 뮤직 플레이 사이트입니다.** 이 사이트는 TOP 100 랭킹 음악과 자신만의 플레이 리스트 생성 및 관리등의 기능을 제공하여 조금 더 나은 경험을 드릴 수 있도록 신경 썼습니다. **메인 페이지에서는 12개의 추천 플레이 리스트가 있으며 전체 재생을 통해 쉽게 리스트를 추가 할 수 있습니다.** 또한, 추가한 플레이 리스트중 마음에 들지 않는 노래는 개별 삭제하거나 플레이 리스트 전체를 삭제 할 수도 있습니다.

<img src="https://github.com/sunhew/youtubmusic/assets/161446039/afbf2a7b-aa47-4e05-9a53-fff5cbee6f55" alt="헤더" width="90%"/>
<img src="https://github.com/sunhew/youtubmusic/assets/161446039/fe817a38-0942-41c5-99ad-df6db4cdb170" alt="헤더" width="90%"/>

## 헤더 영역

헤더에는 __플레이 리스트의 생성 및 추가한 곡을 관리하는등의 개인 플레이리스트를 제공하며__ 멜론, 벅스, 애플, 지니, 빌보드의 TOP100 음악 랭킹 정보를 제공합니다.

---

### 메인 화면

메인 화면의 콘텐츠를 크게 구분하자면 상단에는 __검색 기능을 제공하는 탐색바__, 그 아래에는 음악 플랫폼의 TOP100 리스트와 달력, 검색된 내용을 표시하는 기능이 포함되어있습니다. __원하는 곡을 클릭할경우 재생, 현재 플레이 리스트에 추가, 자신만의 플레이 리스트에 추가__ 할 수 있는 아이콘이 나타나게 됩니다.

<img src="https://github.com/sunhew/youtubmusic/assets/161446039/55fed87c-7821-4c72-87c9-562655bfd939" alt="최신 영화" width="90%"/> 
<img src="https://github.com/sunhew/youtubmusic/assets/161446039/4e19a28e-52a5-466f-b33d-1881cde66f7d" alt="예고편" width="90%"/>

---

### 오른쪽 사이드

오른쪽의 사이드 영역은 플레이 리스트의 기능을 제공합니다. 위에서부터 __뮤직 비디오 재생__ 과 바로 그 아래에는 __재생 시간 표시 및 해당 시간 이동__, __랜덤 재생, 이전곡 재생, 일시정지와 플레이, 다음곡 재생, 반복(현재 곡, 전체 플레이 리스트) 재생, 불륨 조절__ 이 상호작용 가능한 버튼및 바가 있습니다. 그 아래에는 현재 재생중인 __Play list__ 가 있으며 이 영역에서는 원하는 곡의 재생과 삭제, 플레이 리스트 삭제의 기능을 제공하고있습니다.  

<img src="https://github.com/sunhew/youtubmusic/assets/161446039/336f277c-78f9-4d3f-8e09-b1bc773f9a7f" alt="인기영화" width="90%"/> 

---

## 겪었던 문제점

1. **메세지 알람의 중복**: __플레이 리스트를 추가하거나 재생할경우 누를때마다 알람이 중복되는 경우__ 가 발생되었는데 검사를 하거나 원인을 찾아보던 중 __`addTrackToList` 와 `addTrackToEnd`의 메세지가 중복되어있던걸 발견해 수정__ 하자 메세지 알람이 한번씩 나오게 되었습니다. 해당 부분을 수정하는 과정에서 __'이미 곡이 추가되어있는 경우에는 다른 메세지가 나오면서 중복된 곡은 추가되지 못하도록 막으면 어떨까?' 라는 생각이 들어 `addToUserPlaylist` 함수를 추가해 곡을 추가할떄마다 조건을 검사하게 만들어 원하던 기능을 구현하는데 성공__ 했습니다.
<br />

2. **key의 인식 문제**: 로컬 서버에서는 문제없이 작동하지만 서버에 올릴경우 key를 인식하지 못해 서버에서 검색기능등이 제대로 작동하지 않는다는 단점이 있었습니다. 이 문제를 일주일정도 고민하며 수정을 하려 백엔드 설정을 하는등의 방법을 시도해봤지만 실패해 결국  GIT에 커밋을 할떄 ENV 파일을 같이 올리는 방법으로 해결했습니다. 해당 부분은 추후 ENV 파일을 숨긴채 커밋을 하는 방법을 다시 찾아볼 예정입니다.
<br />

3. **플레이 리스트의 서버 저장**: 3번 역시 2번과 같이 백앤드와 서버 설정을 따로 할 경우 사이트를 나갔다 다시 들어와도 플레이 리스트가 유지된다는것을 알게 되었지만 아쉽게도 아직 구현을 성공하지 못해 사이트를 나갈경우 생성한 리스트가 저장되지 않는다는 문제점이 있습니다.
