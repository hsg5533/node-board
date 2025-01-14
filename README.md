# Node.js Express MySQL REST API

이 레포지토리는 Node.js, Express, MySQL을 사용하여 구축된 REST API 예제입니다. 데이터베이스와의 상호작용을 통해 CRUD 작업을 수행하는 방법을 제공합니다.

## 주요 기능

- **Create**: 게시글 추가
- **Read**: 게시글 조회
- **Update**: 게시글 수정
- **Delete**: 게시글 삭제

## 사전 요구 사항

이 프로젝트를 실행하기 전에 다음이 설치되어 있어야 합니다:

- [Node.js](https://nodejs.org/) (v14 이상)
- [MySQL](https://www.mysql.com/)
- [npm](https://www.npmjs.com/) (Node.js에 포함됨)

## 설치 방법

1. 레포지토리 클론:
   ```bash
   git clone <repository_url>
   cd <repository_name>
   ```

2. 의존성 설치:
   ```bash
   npm install
   ```

3. 데이터베이스 설정:
   - MySQL 데이터베이스를 생성합니다(예: `nodeboard`).
   - 제공된 SQL 파일(`schema.sql`)을 가져와 필요한 테이블을 생성합니다.

4. 데이터베이스 연결 구성:
   - 프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가합니다:
     ```env
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=
     DB_NAME=nodeboard
     PORT=3000
     ```

## 애플리케이션 실행

1. 서버 시작:
   ```bash
   npm start
   ```

2. API는 `http://localhost:3000`에서 사용할 수 있습니다.

## 엔드포인트

### 기본 URL
`http://localhost:3000`

### 엔드포인트

- **GET /view**
  - 모든 게시글 조회
- **GET /read/:bnum**
  - 게시글 번호로 특정 게시글 조회
- **POST /insert**
  - 게시글 추가
  - 요청 본문(JSON):
    ```json
    {
      "id": "작성자 아이디",
      "title": "게시글 제목",
      "content": "게시글 내용"
    }
    ```
  - 이미지 파일 업로드를 지원합니다.
- **PUT /update/:bnum**
  - 게시글 번호로 특정 게시글 수정
  - 요청 본문(JSON):
    ```json
    {
      "id": "작성자 아이디",
      "title": "수정된 제목",
      "content": "수정된 내용"
    }
    ```
- **DELETE /delete/:bnum**
  - 게시글 번호로 특정 게시글 삭제
- **GET /img/:bnum**
  - 게시글 번호로 첨부된 이미지 조회
