<p align="center">
  <a href="https://github.com/antcarlosrbj/projeto18-valex">
    <img src="https://notion-emojis.s3-us-west-2.amazonaws.com/prod/svg-twitter/1f355.svg" alt="valex-logo" width="100" height="100">
  </a>

  <h3 align="center">
    Valex
  </h3>
</p>

## Usage

```bash
$ git clone https://github.com/antcarlosrbj/projeto18-valex

$ cd projeto18-valex

$ npm install

$ npm run dev
```

API:

[![thunderclient](https://img.shields.io/badge/thunder_client-000?style=for-the-badge)](https://github.com/antcarlosrbj/projeto18-valex/blob/main/tests-by-thunder-client.json)

```
- POST /cards/create
    - Route to create cards for your employees
    - headers: {
      "x-api-key": "skdjfnskdjfns"
    }
    - body: {
      "employeeId": 5,
      "cardType": "groceries"
    }


- POST /cards/activate
    - Route to activate card
    - headers: {}
    - body: {
      "cardNumber": "1778995658715575",
      "cardholderName": "CICLANA M MADEIRA",
      "expirationDate": "07/27",
      "securityCode": "180",
      "password": "8564"
    }


- POST /cards/extract
    - Route to view card balance and transactions
    - headers: {}
    - body: {
      "cardId": "7"
    }


- POST /cards/block
    - Route to block card
    - headers: {}
    - body: {
      "cardId": "7",
      "password": "5265"
    }


- POST /cards/unblock
    - Route to unblock card
    - headers: {}
    - body: {
      "cardId": "7",
      "password": "5265"
    }


- POST /recharge/insert
    - Route to recharge card
    - headers: {
      "x-api-key": "zadKLNx.DzvOVjQH01TumGl2urPjPQSxUbf67vs0"
    }
    - body: {
      "cardId": "7",
      "amount": "10000"
    }
```
