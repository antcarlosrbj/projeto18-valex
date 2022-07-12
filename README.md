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

## Sample data for testing

1. Download the zip:

> [![download](https://user-images.githubusercontent.com/98707235/178484005-ceb58787-c6c3-4509-91d2-2d2bd845bd21.svg) database.zip](https://github.com/antcarlosrbj/projeto18-valex/raw/main/sample-data-for-testing/database.zip)

2. Extract the contents and open a terminal in the extracted folder

3. Run the following command to configure the database:

```bash
$ bash ./create-database
```

4. Use this data in **.env**:

> [example.env](https://github.com/antcarlosrbj/projeto18-valex/blob/main/sample-data-for-testing/example.env)

## API:

[![thunderclient](https://img.shields.io/badge/thunder_client-000?style=for-the-badge)](https://github.com/antcarlosrbj/projeto18-valex/blob/main/sample-data-for-testing/tests-by-thunder-client.json)

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


- POST /payment/insert
    - Route to make payments
    - headers: {}
    - body: {
      "cardId": "7",
      "businessId": "3",
      "password": "5265",
      "amount": "10000"
    }
```
