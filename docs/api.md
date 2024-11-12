# API 명세서

Base URL: `https://port-0-test2back-m3ecwpb257a84dfd.sel4.cloudtype.app`

---

## 1. 유저 기록 저장 API

사용자가 파리를 잡는 데 걸린 시간을 서버에 저장합니다.

- **Endpoint**

  ```
  POST /scores
  ```

- **HTTP 메서드**: POST

### 요청(Request)

- **Headers**

  ```
  Content-Type: application/json
  ```

- **Body Parameters**

  | 필드 이름  | 타입     | 필수 여부 | 설명                         |
  | ---------- | -------- | --------- | ---------------------------- |
  | username   | string   | 필수      | 사용자 이름                  |
  | difficulty | string   | 필수      | 난이도 (easy, medium, hard)  |
  | time       | float    | 필수      | 파리 잡는데 걸린 시간 (초 단위) |

- **예시 요청**

  ```json
  {
    "username": "홍길동",
    "difficulty": "medium",
    "time": 12.34
  }
  ```

### 응답(Response)

- **성공 시**

  - **HTTP 상태 코드**: 201 Created

  - **Body**

    ```json
    {
      "message": "기록이 성공적으로 저장되었습니다.",
      "data": {
        "username": "홍길동",
        "difficulty": "medium",
        "time": 12.34
      }
    }
    ```

- **실패 시**

  - **HTTP 상태 코드**: 400 Bad Request

  - **Body**

    ```json
    {
      "message": "요청 데이터가 유효하지 않습니다."
    }
    ```

---

## 2. 난이도별 랭킹 조회 API

선택한 난이도의 상위 1위부터 5위까지의 랭킹을 조회합니다.

- **Endpoint**

  ```
  GET /rankings/{difficulty}
  ```

- **HTTP 메서드**: GET

- **URL 경로 변수**

  | 필드 이름  | 타입   | 필수 여부 | 설명                        |
  | ---------- | ------ | --------- | --------------------------- |
  | difficulty | string | 필수      | 난이도 (easy, medium, hard) |

### 요청(Request)

- **Headers**

  ```
  Accept: application/json
  ```

- **예시 URL**

  ```
  GET /rankings/medium
  ```

### 응답(Response)

- **성공 시**

  - **HTTP 상태 코드**: 200 OK

  - **Body**

    ```json
    {
      "difficulty": "medium",
      "rankings": [
        {
          "rank": 1,
          "username": "김철수",
          "time": 10.23
        },
        {
          "rank": 2,
          "username": "이영희",
          "time": 11.45
        },
        {
          "rank": 3,
          "username": "박민수",
          "time": 12.34
        },
        {
          "rank": 4,
          "username": "최수정",
          "time": 13.78
        },
        {
          "rank": 5,
          "username": "홍길동",
          "time": 14.56
        }
      ]
    }
    ```

- **실패 시**

  - **HTTP 상태 코드**: 400 Bad Request

    - **Body**

      ```json
      {
        "message": "유효하지 않은 난이도입니다. (easy, medium, hard 중 선택)"
      }
      ```

  - **HTTP 상태 코드**: 404 Not Found

    - **Body**

      ```json
      {
        "message": "해당 난이도의 랭킹 정보가 없습니다."
      }
      ```

---

## 에러 코드

| HTTP 상태 코드 | 설명                                   |
| -------------- | -------------------------------------- |
| 200 OK         | 요청이 성공적으로 처리되었음            |
| 201 Created    | 새로운 리소스가 성공적으로 생성되었음   |
| 400 Bad Request| 잘못된 요청. 요청 데이터가 유효하지 않음 |
| 404 Not Found  | 요청한 리소스를 찾을 수 없음            |

---

## 참고 사항

- 모든 시간(`time`) 값은 초 단위의 `float` 타입으로 처리됩니다.
- `difficulty` 필드는 대소문자를 구분하지 않을 수 있지만, 서버 구현에 따라 정확한 값을 사용하는 것이 좋습니다.
- 서버는 MVP 단계에서 메모리에 데이터를 저장하므로, 서버 재시작 시 데이터가 초기화될 수 있습니다.
- 클라이언트는 요청 시 올바른 헤더와 데이터를 포함해야 합니다.

---

## 업데이트 로그

- **v1.0**

  - 초기 API 명세서 작성
  - 유저 기록 저장 API 및 난이도별 랭킹 조회 API 추가

---

이상으로 필요한 두 가지 API에 대한 명세서를 작성하였습니다. 이 명세서를 바탕으로 클라이언트와 서버 간의 통신을 구현하시기 바랍니다.