var expect = require('chai').expect;
import TweeterMessage from './lib/TweeterMessage';

describe('TweeterMessage create object for spliting messages', () => {
  describe('isValid', () => {
    it('return true if message length is less than 50 characters', () => {
      let oTweeterMessage = new TweeterMessage("hello world")
      let [isValid, reason] = oTweeterMessage.isValid()
      expect(isValid).to.equal(true)
      expect(reason).to.equal("")
    })
    it('return false when length is larger than 500 characters', () => {
      let message =  'a';
      for(let i=0; i<9; i++) {
        message += message;
      }
      let oTweeterMessage = new TweeterMessage(message)
      let [isValid, reason] = oTweeterMessage.isValid()
      expect(isValid).to.equal(false)
      expect(reason).to.equal(`Message is larger than 500 characters`)
    })
    it('return false when length of word is larger than limit', () => {
      let message = 'a';
      for(let i=0; i<7; i++) {
        message += message;
      }
      let oTweeterMessage = new TweeterMessage(message)
      let [isValid, reason] = oTweeterMessage.isValid()
      expect(isValid).to.equal(false)
      expect(reason).to.equal("Words are too large to split")
    })
    it('return true if conditions satifys', () => {
      let message = "hello world";
      for (let i=0; i < 4; i++) {
        message += " " + message
      }
      let oTweeterMessage = new TweeterMessage(message)
      let [isValid, reason] = oTweeterMessage.isValid()
      expect(isValid).to.equal(true)
      expect(reason).to.equal("")
    })
  })
  describe("splitMessage convert message into messages", () => {
    it("messages less than 50 characters", () => {
        let message = "hello world"
        let oTweeterMessage = new TweeterMessage(message)
        const messages = oTweeterMessage.splitMessage()
        expect(messages).to.have.lengthOf(1)
        expect(messages[0]).to.equal(message)
    })
    it("message above 50 characters", () => {
      const message ="I can't believe Tweeter now supports chunking my messages, so I don't have to do it myself."
      const oTweeterMessage = new TweeterMessage(message)
      const messages = oTweeterMessage.splitMessage()
      expect(messages).to.have.lengthOf(2)
      const noOfLargeMessages = messages.filter(message => message.length >= 50).length
      expect(noOfLargeMessages).to.equal(0)
    })

    it("message above 50 characters edge case", () => {
      const message ="I can't believe Tweeter now supports chunking my messages, so I don't have to do it myself. Sam"
      const oTweeterMessage = new TweeterMessage(message)
      const messages = oTweeterMessage.splitMessage()
      expect(messages).to.have.lengthOf(3)
      const noOfLargeMessages = messages.filter(message => message.length >= 50).length
      expect(noOfLargeMessages).to.equal(0)
    })

    it("message with large set of characters(400)", () => {
      const message = "sam sam sam sam sa m s sa m sa ma a ms s yiioo Sam I can't believe Tweeter now supports chunking my messages, so I don't have to do it myself. I can't believe Tweeter now supports chunking my messages, so I don't have to do it myself. I can't believe Tweeter now supports chunking my messages, so I don't have to do it myself. I can't believe Tweeter now supports chunking my messages, so I don't have to do it myself."
      const oTweeterMessage = new TweeterMessage(message)
      const messages = oTweeterMessage.splitMessage()
      expect(messages).to.have.lengthOf(11)
      const noOfLargeMessages = messages.filter(message => message.length >= 50).length
      expect(noOfLargeMessages).to.equal(0)
      // last message should have prefix 11
      expect(messages[10].slice(0,2)).to.equal("11")
    })
  })

  describe("_splitMessages", () => {
    it("inital noOfParts matches messages", () => {
      const message ="I can't believe Tweeter now supports chunking my messages, so I don't have to do it myself."
      const oTweeterMessage = new TweeterMessage(message)
      let preFixLength = oTweeterMessage._getPrefixLength(oTweeterMessage.message.length)
      let noOfParts = Math.ceil(oTweeterMessage.message.length / (50 - preFixLength))
      const words = oTweeterMessage.message.split(' ').filter(elem => elem.length)
      const messages = oTweeterMessage._splitMessages(words, noOfParts)
      expect(messages).to.have.lengthOf(noOfParts)
      const noOfLargeMessages = messages.filter(message => message.length >= 50).length
      expect(noOfLargeMessages).to.equal(0)
    })
    it("inital noOfParts does not match no of messages 10 to 11 parts", () => {
      const message =  "sam sam sam sam sa m s sa m sa ma a ms s yiioo Sam I can't believe Tweeter now supports chunking my messages, so I don't have to do it myself. I can't believe Tweeter now supports chunking my messages, so I don't have to do it myself. I can't believe Tweeter now supports chunking my messages, so I don't have to do it myself. I can't believe Tweeter now supports chunking my messages, so I don't have to do it myself."
      const oTweeterMessage = new TweeterMessage(message)
      let preFixLength = oTweeterMessage._getPrefixLength(oTweeterMessage.message.length)
      let noOfParts = Math.ceil(oTweeterMessage.message.length / (50 - preFixLength))
      const words = oTweeterMessage.message.split(' ').filter(elem => elem.length)
      const messages = oTweeterMessage._splitMessages(words, noOfParts)
      expect(messages.length).to.not.equal(noOfParts)
      expect(messages).to.have.lengthOf(11)
      const noOfLargeMessages = messages.filter(message => message.length >= 50).length
      expect(noOfLargeMessages).to.equal(0)
    })
  })

  it("inital noOfParts does not match no of messages 10 to 8", () => {
    const message =  "sam sam                                                                       now supports chunking my messages, so I don't have to do it myself. I can't believe Tweeter now supports chunking my messages, so I don't have to do it myself. I can't believe Tweeter now supports chunking my messages, so I don't have to do it myself. I can't believe Tweeter now supports chunking my messages, so I don't have to do it myself."
    const oTweeterMessage = new TweeterMessage(message)
    let preFixLength = oTweeterMessage._getPrefixLength(oTweeterMessage.message.length)
    let noOfParts = Math.ceil(oTweeterMessage.message.length / (50 - preFixLength))
    const words = oTweeterMessage.message.split(' ').filter(elem => elem.length)
    const messages = oTweeterMessage._splitMessages(words, noOfParts)
    expect(messages).to.have.lengthOf(8)
    const noOfLargeMessages = messages.filter(message => message.length >= 50).length
    expect(noOfLargeMessages).to.equal(0)
  })
})
