# NOVA LAB · Onboarding Quest + Claude AI Skill Lab (편집 쉬운 버전)

기존 v8을 **기능을 변경하지 않고** GitHub에서 편하게 수정할 수 있도록 분리한 버전입니다.
HTML 안의 이미지 13개를 `/assets`로, CSS를 `/css/style.css`로, JavaScript를 `/js/game.js`로 옮겼습니다.

## 파일별 수정 위치

- `index.html`: 전체 HTML 뼈대 및 화면의 텍스트
- `css/style.css`: 색상, 크기, 배치 등 디자인
- `js/game.js`: 퀘스트, 캐릭터 대화, AI Skill Lab 등 동작
- `assets/`: 가상 오피스, 캐릭터 이미지 13개
- `api/ai.mjs`: Vercel 서버에서 실행되는 Claude API 중계 코드
- `package.json`: 서버 의존성 정의

## GitHub Pages에 올리기

1. GitHub 저장소 `eunyoung0120choi-cpu/onboarding-quest-day1`에 접속합니다.
2. `Add file` → `Upload files`를 누릅니다.
3. 이 압축을 풀고, **`index.html`, `css` 폴더, `js` 폴더, `assets` 폴더를 함께** 업로드합니다. (기존 index.html을 덮어씁니다.)
4. Claude API도 쓰려면 `api` 폴더와 `package.json`도 같은 저장소에 추가합니다. `.env.example`은 예시일 뿐 실제 키를 적지 않습니다.
5. 화면 아래에서 변경 사항을 커밋합니다.
6. 약간 뒤에 `https://eunyoung0120choi-cpu.github.io/onboarding-quest-day1/`를 열고 `Ctrl+Shift+R`로 새로고침합니다.

**주의:** 파일을 분리했으므로 `index.html`만 단독으로 업로드하면 그림과 게임이 표시되지 않습니다. `assets`, `js`, `css` 폴더도 함께 있어야 합니다.

## 수정 방법

이후 GitHub에서 큰 HTML 대신 `js/game.js` 또는 `css/style.css`를 열어 연필 버튼으로 수정할 수 있습니다.
`index.html` 역시 기존 수 MB가 아닌 작은 파일입니다.

## Claude 연결

GitHub Pages에서는 `api/ai.mjs`가 실행되지 않습니다. Claude API는 **Vercel에 별도 배포**한 서버를 통해 호출하세요.
Vercel의 환경변수에 `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`, `DEMO_ACCESS_CODE`를 넣습니다.
**실제 API 키는 GitHub에 업로드하지 않습니다.** 이전 v8 README의 설정 설명도 참고하세요.

## 테스트 범위

기존 v8과 동등하도록 단일 HTML의 이미지 data URI를 그대로 해독해 파일로 추출했고, style과 script를 파일로 이동했습니다.
실제 Claude API 호출은 별도 Vercel 배포와 유효한 인증키가 있어야 가능합니다.
