/**
 *  Tweet splitter class.
 *
 * Take message on creation and validate that message
 * and return messages.
 *
 * Algorithm(splitMessage).
 *
 * 1. Calculate prefix conunt with no of messages.
 * 2. Create all messages with prefix.
 * 3. If prefix and messages are same
 *   3.1 retrun Messages
 * 4. Assign prefix as Messages count
 * 5. Goto step 2 repeat process.
 */
class TweeterMessage {
  constructor(message) {
    this.tweetLength = 50;
    this.messageMaxLength = 500;
    this.message = message;
    this.isValid = this.isValid.bind(this);
    this.splitMessage = this.splitMessage.bind(this);
  }

  /**
   * Take a guess of prefix length using message length.
   * this length may not be accurate but optimal in solution
   * @param  {number} length length of the message
   * @return {number}        optimal prefix length
   */
  _getPrefixLength(length) {
    if (length < 450) {
      return 4
    } else if (length < 900) {
      return 6
    }
  }

  /**
   * Split Messages to tweet format and prefix if needed.
   *
   * For message less than 50 character message itself is return in an array.
   *
   * if message is larger than message is split to untill its match conditions
   *
   * conditions
   * {index}/{noOfMessages} Message
   *
   * @return {Array(String)} Returns array of string.
   */
  splitMessage() {
    if (this.message.length < 50) {
      return [this.message]
    }
    let words = this.message.split(' ').filter(elem => elem.length)
    let preFixLength = this._getPrefixLength(this.message.length)
    let noOfParts = Math.ceil(this.message.length / (50 - preFixLength))
    return this._splitMessages(words, noOfParts)
  }

  /**
   * Recursive algorithm is optimal spliting of the message.
   *
   * function tries to split message into noOfParts
   * if its not possible it retrys again.
   * @param  {[Array(String)]} words    Array of word from the message
   * @param  {[number]} noOfParts  Optimal length of messages
   * @return {[Array(String)]}    Return tweet in format {index}/{noOfParts} Message
   */
  _splitMessages(words, noOfParts) {
    let messages = []
    let counter = 0
    let string, tmp, i;
    //looping through the words and creating the message.
    for( i =0 ; counter < words.length ; i++) {
      string = `${i+1}/${noOfParts}`
      while( counter < words.length) {
        tmp = string + " " + words[counter]
        if (tmp.length < 50 ) {
          string = tmp
          counter++
        } else {
          break;
        }
      }
      messages.push(string)
    }
    // if no of messages is not equal to noOfParts (Our assumption.)
    if (i !== noOfParts) {
      let newNoOfParts = i;
      // checking that prefix length is same or not
      if (i.toString().length === noOfParts.toString().length) {
        // prefix length is same then search and replace with newNoOfParts
        return messages.map((message, i) => {
          return message.replace(`${i+1}/${noOfParts} `, `${i+1}/${newNoOfParts} `)
        })
      } else {
        // if prefix do not match Recursive do with newNoOfParts
        return this._splitMessages(words, newNoOfParts)
      }
    }
    return messages
  }
  /**
   * Check message passed is valid or not. if not reason is given as well
   *
   * conditions checked.
   * 1. message less than 50 character
   * 2. message less than 500 character
   * 3. if message greater than 50 character then all words must be under that limit.
   *
   * @return {Boolean} Validatity of the message to be spliting
   * @return {String} Reason for not be valid message
   */
  isValid() {
    let message = this.message;
    // checking message is less 50 characters
    if (message.length < this.tweetLength) {
      return [true, ""];
    } else if (message.length >= this.messageMaxLength) { // Upper characters limit
      return [false, `Message is larger than ${this.messageMaxLength} characters`];
    }

    let preFixLength = this._getPrefixLength(this.message.length)

    let isWordLarge = this.message.split(' ').filter(elem => elem.length >= (this.tweetLength-preFixLength))
    // checking all words are under character limit.
    if (isWordLarge.length) {
      return [false, "Words are too large to split"]
    }
    return [true, ""]
  }
}

export default TweeterMessage;
