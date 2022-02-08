# nextjs 프로젝트에 Google Analytics와 Optimize 설정하기

> 최종 코드: [github](https://github.com/youha-info/nextjs-with-ga-go)
> 
> 작성자: [전현준](https://github.com/hyunjunian)

Google Analycis(GA)와 Google Optimize(GO)는 많은 웹 서비스들에 기본적으로 설정하는 것들이다.

그런데 nextjs처럼 SSR과 CSR 둘 다 하는 프로젝트에 설정하는 것은 일반적인 사이트에 설정하는 것보다 어렵다.

본 글에서는 nextjs에 GA와 GO를 설정하는 가장 적절한 방법을 알려준다.

(참고로 본 글에서 사용하는 nextjs의 버전은 `12.0.10`이고 GA는 `UA`다.)

## nextjs에 GA와 GO를 설정하기 어려운 이유

아래의 문제들 때문에 설정이 어렵다.

1. GA, GO 스크립트를 동기로 불러오는 것이 불가능하다.
2. 하이퍼링크를 통해 페이지 이동 시에 GA의 `page_view` 이벤트가 트리거되지 않는다.
3. 하이퍼링크를 통해 페이지 이동 시에 GO의 대안이 적용이 되지 않는다.
4. nextjs의 hydration과 GO의 대안 적용이 충돌한다.
5. css module을 사용할 경우, react element의 이름 혹은 css module의 파일명 등이 변경되었을 때 GO의 대안이 적용되지 않는다.

## 해결 방법

각각의 문제는 아래처럼 해결하면 된다.

> 문제 1. GA, GO 스크립트를 동기로 불러오는 것이 불가능하다.

nextjs에서 동기로 스크립트를 불러오려고하면 [No Sync Scripts](https://nextjs.org/docs/messages/no-sync-scripts)가 발생한다. 따라서 GA와 GO 스크립트를 동기로 불러올 수 없다.

이는 GA와 GO 스크립트를 비동기로 불러오도록하면 해결된다. nextjs에서 지원하는 [Script 태그](https://nextjs.org/docs/basic-features/script)를 사용하여 스크립트를 불러오면 해결된다.

> 문제 2. 하이퍼링크를 통해 페이지 이동 시에 GA의 `page_view` 이벤트가 트리거되지 않는다.

nextjs의 Link 태그를 사용하여 구현된 하이퍼링크를 클릭하면 페이지 전체가 새로 불러와지는 것이 아니라, js 파일만 받아와 페이지의 요소를 변경해준다. 따라서 페이지가 이동되더라도 GA의 page_view 이벤트가 트리거되지 않는다.

이는 페이지 주소가 변경될 때마다 직접 GA의 page_view 이벤트를 트리거해주면 해결된다. nextjs에서 지원하는 useRouter 훅을 사용하여 `routeChangeComplete` 이벤트에 GA의 `page_view` 이벤트를 트리거하는 콜백을 설정해주면 된다.

> 문제 3. 하이퍼링크를 통해 페이지 이동 시에 GO의 대안이 적용이 되지 않는다.

문제 2와 같은 이유로 GO의 대안이 적용되지 않는다.

이는 GO 콘솔에서 환경을 만들 때, 활성화 이벤트를 `계속`으로 설정해주면 해결된다.

> 문제 4. nextjs의 hydration과 GO의 대안 적용이 충돌한다.

만약 GO의 스크립트가 hydration 스크립트보다 먼저 동작하게 될 경우, nextjs에서 [React Hydration Error](https://nextjs.org/docs/messages/react-hydration-error)가 발생하며, GO의 대안이 적용되지 않는다.

이는 GO의 스크립트가 nextjs의 hydration이 완료된 직후에 동작하도록 타이밍을 맞춰주면 해결된다. nextjs의 [Script 태그](https://nextjs.org/docs/basic-features/script#afterinteractive)를 사용하면 기본적으로 hydration이 된 직후에 스크립트를 불러와 실행시킨다.

하지만 이렇게 hydration이 끝난 뒤에 스크립트를 불러오게 하면 추가로 아래의 문제가 발생한다.

>> 문제 4-a. flicker 현상이 발생한다.

페이지에 처음 들어갔을 때는 원본이 화면에 렌더링되고, 잠시 후 GO 스크립트가 실행된 이후에 대안이 적용된다. 따라서 사용자는 잠깐 원본이 뜬 다음 대안이 보이게 된다.

이는 [anti-flicker snippet](https://support.google.com/optimize/answer/7100284)을 설정해주면 해결된다.

하지만 이렇게 anti-flicker snippet을 설정할 경우 GO 스크립트가 실행되기 전까지는 화면이 공백으로 뜨는 단점이 있다. 만약 flicker 현상을 막는 것보다 화면 렌더링을 빠르게 하는 것이 더 중요하다면 anti-flicker snippet을 설정하지 않아도 된다.

> 문제 5. css module을 사용할 경우, react element의 이름 혹은 css module의 파일명 등이 변경되었을 때 GO의 대안이 적용되지 않는다.

css module을 사용하면, 태그에 클래스 속성이 지정된다. 이 상태에서 GO 콘솔에서 대안을 만들게 되면 selector에 자동으로 클래스 속성이 드러가게 된다. 하지만 react element 이름 등을 변경하면 태그에 지정된 클래스 속성이 바뀌어 GO의 selector가 해당 태그를 찾지 못하게 된다. 이로 인해 GO의 대안이 적용되지 않는다.

이는 GO 콘솔에서 대안을 만들 때 selector에 클래스가 들어갔을 경우, 직접 seletor를 수정하여 클래스 대신 tag 이름 혹은 id 등으로 변경하면 해결된다.

## 결과

이제 위 방법대로 구현한 [코드](https://github.com/youha-info/nextjs-with-ga-go)를 실행시키면 GA와 GO 모두 정상적으로 동작한다.
