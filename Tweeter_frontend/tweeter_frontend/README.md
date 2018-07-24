# Tweeter Frontend

ReactJS frontend for the Tweeter App.

## Tweet Splitting

Class TweeterMessage is used to split tweets.

### methods

* `isValid`: Check tweet can be splitted into multiple parts or not.
* `splitMessage`: Split message into multiple parts.

### Logic

1. Optimal Calculate no of parts `noOfParts` plitted messages contain.
2. Split the message into parts with `noOfParts`.
3. Check `noOfParts` is equal to no of splitted message.
3.1. if they are equal return splitted message.
3.2. else new `noOfParts` is no of splitted message and goto `step 2`.


## Test.

```
npm test
```

Test runs Tweet Splitting run possible scenario.
