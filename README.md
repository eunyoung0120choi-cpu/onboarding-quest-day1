# Onboarding Quest · DAY 1

신입사원의 첫 출근을 가상 오피스에서 체험하는 인터랙티브 온보딩 데모입니다.

## 주요 기능

- 로비에서 시작하는 공간 탐색 및 캐릭터 대화
- DAY 1 8단계 퀘스트와 진행률, 기록, 배지
- 가상 업무환경 설정과 회사 가이드 탐색
- AI Learning Studio: Report Lab(보고서 초안 검증), Meeting Lab(회의록 분류)
- 업무 우선순위 분류 게임
- 화면 크기에 따른 반응형 레이아웃

## 실행하기

`index.html`을 브라우저에서 열거나 GitHub Pages에서 정적 사이트로 배포할 수 있습니다. 이미지와 CSS, JavaScript는 HTML 파일 내부에 포함돼 있어 별도 빌드 도구가 필요하지 않습니다.

### GitHub Pages

1. 이 저장소의 루트에 `index.html`, `README.md`, `.nojekyll`을 업로드합니다.
2. 저장소의 **Settings → Pages → Build and deployment**로 이동합니다.
3. Source를 **Deploy from a branch**, Branch를 **main**, Folder를 **/(root)**로 지정하고 저장합니다.
4. 배포가 완료되면 Pages 화면의 **Visit site**에서 접속합니다.

## 데모 안내

- NOVA LAB은 가상 회사입니다. 회사 업무, 교육 수치, 일정, 매뉴얼 등은 모두 시연용입니다.
- 가이드의 실제 문서·다운로드 링크는 아직 제공되지 않으며, 버튼 선택 시 '준비 중' 안내가 표시됩니다.
- AI 실무 게임은 실제 API 호출이 아닌 시뮬레이션입니다.
- 진행 상태는 사용자의 브라우저 `localStorage`에 저장됩니다.
- 테스트를 위해 입력하는 내용에는 실제 사내 기밀이나 개인정보를 사용하지 마세요.

## 배포 전 점검

브라우저에서 시작 버튼, 퀘스트 완료, 공간 이동, 가이드의 준비 중 안내, AI 게임 진행, 모바일 레이아웃을 확인하세요.
