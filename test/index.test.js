const handler = require('../index').handler;
const context = require('aws-lambda-mock-context');
const expect = require('chai').expect;

describe("Testing a session with the HelpIntent", function () {
    const ctx = context({ timeout: 10 });

    const mock_event = require('../__mockData__/help.json');
    var speechResponse = null
    var speechError = null

    before(function (done) {
        handler(mock_event, ctx)

        ctx.Promise
            .then(resp => { speechResponse = resp; done(); })
            .catch(err => { speechError = err; done(); })
    })

    describe("The response is structurally correct for Alexa Speech Services", function () {
        it('should not have errored', function () {
            expect(speechError).to.be.null
        })

        it('should have a version', function () {
            expect(speechResponse.version).not.to.be.null
        })

        it('should have a speechlet response', function () {
            expect(speechResponse.response).not.to.be.null
        })

        it("should have a spoken response", () => {
            expect(speechResponse.response.outputSpeech).not.to.be.null
        })

        it("should end the alexa session", function () {
            //expect(speechResponse.response.shouldEndSession).not.to.be.null
            expect(speechResponse.response.shouldEndSession).to.be.false
        })
    })
})



describe("Testing a session with the SetName Intent", function () {
    const ctx = context({ timeout: 10 });
    const mock_event = require('../__mockData__/setName.json');
    var speechResponse = null
    var speechError = null

    before(function (done) {
        this.timeout(10000)
        handler(mock_event, ctx)

        ctx.Promise
            .then(resp => { speechResponse = resp; done(); })
            .catch(err => { speechError = err; done(); })
    })

    describe("The response is structurally correct for Alexa Speech Services", function () {
        it('should not have errored', function () {
            expect(speechError).to.be.null
        })

        it('should have a version', function () {
            expect(speechResponse.version).not.to.be.null
        })

        it('should have a speechlet response', function () {
            expect(speechResponse.response).not.to.be.null
        })

        it("should have a spoken response", () => {
            expect(speechResponse.response.outputSpeech).not.to.be.null
        })

        it("should end the alexa session", function () {
            expect(speechResponse.response.shouldEndSession).not.to.be.null
            expect(speechResponse.response.shouldEndSession).to.be.true
        })
    })
})

describe("Testing a session with the AskQuestion Intent", function () {

    const ctx = context({ timeout: 10 });
    const mock_event = require('../__mockData__/askQuestion.json');
    var speechResponse = null
    var speechError = null

    before(function (done) {
        this.timeout(10000)
        handler(mock_event, ctx)

        ctx.Promise
            .then(resp => { speechResponse = resp; done(); })
            .catch(err => { speechError = err; done(); })
    })

    describe("The response is structurally correct for Alexa Speech Services", function () {
        it('should not have errored', function () {
            expect(speechError).to.be.null
        })

        it('should have a version', function () {
            expect(speechResponse.version).not.to.be.null
        })

        it('should have a speechlet response', function () {
            expect(speechResponse.response).not.to.be.null
        })

        it("should have a spoken response", () => {
            expect(speechResponse.response.outputSpeech).not.to.be.null
        })

        it("should end the alexa session", function () {
            expect(speechResponse.response.shouldEndSession).not.to.be.null
            expect(speechResponse.response.shouldEndSession).to.be.true
        })
    })
})



