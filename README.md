## Techtaurant Frontend

### 환경 변수

아래 환경 변수가 필요합니다.

```bash
ORVAL_OPENAPI_URL = <OpenAPI_JSON_전체_URL>
NEXT_PUBLIC_API_BASE_URL = <실제_API_요청_주소>
NEXT_PUBLIC_ENV = local | development | production
```

`ORVAL_OPENAPI_URL`은 API 클라이언트 생성에만 사용하는 OpenAPI JSON 전체 주소입니다. `/v3/api-docs`까지 포함하며,
상용에서도 개발 서버의 스펙을 사용합니다. 실제 API 요청 주소는 `NEXT_PUBLIC_API_BASE_URL`로 별도 설정합니다.

`ORVAL_OPENAPI_URL`은 로컬 `.env`, GitHub Actions의 `development`·`production` 환경 변수, Cloudflare의 상용·Preview 빌드
환경 변수에 등록해주세요. CI는 GitHub 환경에 등록된 값을 읽습니다. Cloudflare 런타임 변수가 아닌 빌드 변수로 등록해야
합니다.

### 개발 환경 시작

로컬 HTTPS 개발 환경 기준

로컬 접속 주소:

- `https://local.techtaurant.com:3010`

사전 준비:

- `mkcert`가 설치되어 있어야 합니다.

실행 순서:

```bash
pnpm install # 패키지 설치
pnpm api:generate # API codegen
pnpm setup:https # mkcert로 local.techtaurant.com 인증서 등록
pnpm dev:https # https://local.techtaurant.com:3010 개발 서버 실행
```

### 아키텍쳐

코드베이스의 **응집도는 높이고** **결합도는 낮춰** 디버깅에 용이한 구조를 만들고, **확장성**을 챙기기 위해
[FSD](https://feature-sliced.design/docs/get-started/overview) (Feature Sliced Design)을 재해석해 사용합니다.

> 1. pages router와의 충돌을 방지하기 위해 pages layer는 views로 네이밍을 변경해서 사용합니다.
> 2. app layer는 FSD 규칙과 달리, Next.js 라우터로 사용합니다.

Layer > Slice > Segment 순으로 구성되며, 더 깊은 디렉토리는 권장하지 않습니다.

1. 상위 Layer의 코드를 하위 Layer에서 import할 수 없습니다.
   - `entities/posts/ui`에서 `features/posts/lib`를 import할 수 없습니다.
   - 이런 경우, 두 레이어의 코드가 적절한 위치에 배치되었는지 고민해야 합니다.

2. 같은 Layer의 Slice 간에는 import 할 수 없습니다.
   - `entities/posts/api`에서 `entities/users/api`를 import 할 수 없습니다.
   - 매우 특수한 경우가 아니라면, 상위 Layer에서 조합하거나 하위 Layer로 이동시켜 해결할 수 있습니다.

각 Layer별로 위치해야 할 코드:

- **app**: 레이아웃, 컴포넌트 등을 조합해 라우팅 엔트리를 담당
  - import 가능: 모든 하위 layer
  - SSR을 위해 데이터 fetch 역할 수행 가능
- **views**: 하나의 URL에 대한 모든 기능을 묶은 컨테이너 레벨 관리
  - import 가능: widgets, features, entities, shared layer
  - ex: 게시물 리스트 페이지...
- **widgets**: 하나의 독립적이고, 완전한 기능을 갖춘 덩어리
  - import 가능: features, entities, shared layer
  - ex: 헤더, 푸터...
- **features**: 비즈니스 로직, 사용자 액션과 관련된 재사용 가능한 훅, 컴포넌트, 유틸 관리
  - import 가능: entities, shared layer
  - ex: 게시글 임시 저장 hook, 비즈니스 로직이 포함된 게시글 컴포넌트...
- **entities**: DTO 타입, API 요청, 순수 컴포넌트, 파싱 로직 등 관리
  - import 가능: shared layer
  - ex: 게시글 조회 함수, 게시글 DTO, 게시글 컴포넌트, slug 파싱 유틸...
- **shared**: 도메인/비즈니스 로직과 관련 없는 공용 유틸, 훅, 컴포넌트, 상수 등 관리
  - shared layer에는 slice 없이 segment부터 시작합니다.
  - ex: useInterval 훅, 공통 버튼 컴포넌트...

Segment는 각 Slice별로 필요한 것만 사용합니다.

- **ui**: 컴포넌트, 스타일 등
- **api**: API 요청 함수, 캐시 키 등
- **model**: DTO 타입, 데이터 구조 변환 함수, 커스텀 훅 등
- **lib**: 유틸 함수 등
- **config**: 설정 파일, 상수, 객체 등
