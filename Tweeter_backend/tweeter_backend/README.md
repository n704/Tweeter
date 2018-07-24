# Tweeter Backend

API required for tweeter.

## Models

1. `TweeterMessage`: Each message in Tweeter.
2. `TweeterThread`: thread were all message are stored under.

## Test

``` python ./manage.py test ```


## Running

``` python ./manage.py runserver 0:8000 ```

## API

### `POST /tweeter/v1/messages/`

#### INPUT
```javascript
{
      "short_message": "hello",
      "messages": [
          "hello world"
      ]
  }
```
#### OUTPUT

```javascript
{
  "data": "Successfully created"
}
```

create a new thread with `hello` as `short_message` and convert `messages` into
`TweeterMessage`

### `GET /tweeter/v1/messages/`

#### OUTPUT

```javascript
{
    "items": [
        {
            "pk": 1,
            "short_message": "hello world"
        }
    ]
}
```

Returns all the thread stored in DB.


### `GET /tweeter/v1/thread/<thread_id>`

#### OUTPUT

```javascript
{
    "items" : [
        {
            "pk": 1,
            "message": "hello world"
        }
    ]
}
```
Returns all the messages for thread Id `thread_id`.
