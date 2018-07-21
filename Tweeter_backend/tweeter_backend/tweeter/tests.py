# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json

from django.test import TestCase
from django.test.client import RequestFactory

from tweeter.models.tweeter_thread import (
    TweeterThread, ValiationError, TweeterMessage
    )
from tweeter.views import ChainMessages, Threads
# Create your tests here.


class TestTweeterThread(TestCase):

    def test_validate_with_no_messages(self):
        """Test Thread validation with no messages."""
        messages = []
        short_message = "I am a wolf"
        is_valid, errors = TweeterThread.objects._validate(
            short_message,
            messages)
        self.assertEqual(errors, ["There are no messages"])
        self.assertFalse(is_valid)

    def test_validate_with_short_message_is_empty(self):
        """Test Thread validation with empty short message."""
        messages = ["I am a wolf"]
        short_message = ""
        is_valid, errors = TweeterThread.objects._validate(
            short_message,
            messages)
        self.assertEqual(errors, ["Snippet is empty"])
        self.assertFalse(is_valid)

    def test_validate_with_short_message_is_large(self):
        """Test Thread validation with large short message."""
        messages = ["I am a wolf"]
        short_message = "I am a wolf" * 10
        is_valid, errors = TweeterThread.objects._validate(
            short_message,
            messages)
        self.assertEqual(errors, ["Snippet is above 20 charaters"])
        self.assertFalse(is_valid)

    def test_validate_with_both_fails(self):
        """Test Thread validation with no messages and large short message."""
        messages = []
        short_message = "I am a wolf" * 10
        is_valid, errors = TweeterThread.objects._validate(
            short_message,
            messages)
        self.assertEqual(errors, [
            "Snippet is above 20 charaters",
            "There are no messages"
            ])
        self.assertFalse(is_valid)

    def test_validate_with_both_success(self):
        messages = [" I am wolf"]
        short_message = "I am a wolf"
        is_valid, errors = TweeterThread.objects._validate(
            short_message,
            messages)
        self.assertEqual(len(errors), 0)
        self.assertTrue(is_valid)

    def test_create_when_short_message_is_large(self):
        """ Test thread creation when short message is large."""
        messages = ["I am a wolf"]
        short_message = "1" * 500
        self.assertRaises(
            ValiationError,
            lambda: TweeterThread.objects.create_thread(short_message, messages))

    def test_create_when_no_messages(self):
        """ Test thread creation when no messages."""
        messages = []
        short_message = "1"
        self.assertRaises(
            ValiationError,
            lambda: TweeterThread.objects.create_thread(short_message, messages))

    def test_create_when_no_messages(self):
        """ Test thread creation when no messages."""
        messages = []
        short_message = "1" * 500
        self.assertRaises(
            ValiationError,
            lambda: TweeterThread.objects.create_thread(short_message, messages))

    def test_create_success(self):
        """ Test thread creation when validation passes."""
        messages = ["I am a wolf"]
        short_message = "I am a wolf"
        othread = TweeterThread.objects.create_thread(short_message, messages)
        count = TweeterMessage.objects.filter(thread=othread).count()
        self.assertEqual(othread.short_message, short_message)
        self.assertEqual(count, 1)
        messages = ["I am a wolf" for i in range(2)]
        short_message = "I am a wolf"
        othread = TweeterThread.objects.create_thread(short_message, messages)
        count = TweeterMessage.objects.filter(thread=othread).count()
        self.assertEqual(count, 2)
        self.assertEqual(othread.short_message, short_message)

    def test_get_all_messages_with_invaild_thread_id(self):
        """Test giving invalid thread id."""
        self.assertRaises(
            Exception,
            lambda: TweeterThread.objects.get_all_messages("123"))
        try:
            TweeterThread.objects.get_all_messages("123")
        except Exception as e:
            self.assertEqual(str(e), "Invalid thread Id")

    def test_get_all_messages_with_vaild_thread_id(self):
        """Test get_all messages with valid thread."""
        messages = ["I am a wolf"]
        short_message = "I am a wolf"
        othread = TweeterThread.objects.create_thread(short_message, messages)
        messages = TweeterThread.objects.get_all_messages(othread.pk)
        self.assertEqual(1, len(messages))
        self.assertEqual("I am a wolf", messages[0]["message"])
        messages = ["I am a wolf{0}".format(i) for i in range(5)]
        short_message = "I am a wolf"
        othread = TweeterThread.objects.create_thread(short_message, messages)
        messages = TweeterThread.objects.get_all_messages(othread.pk)
        self.assertEqual(5, len(messages))


class TestChainMessagesAPI(TestCase):
    """
        Test tweeter API
    """

    def test_get_all_messages_with_invaild_thread_id(self):
        """Test giving invalid thread id."""
        self.factory = RequestFactory()
        request = self.factory.get('/tweeter/v1/thread/2/')
        chain_messages_api = ChainMessages()
        response = chain_messages_api.get(request, 2)
        json_data = json.loads(response.content)
        self.assertEqual({"error": "Invalid thread Id"}, json_data)

    def test_get_all_messages_with_vaild_thread_id(self):
        """Test get all messages with valid thread API."""
        messages = ["I am a wolf"]
        short_message = "I am a wolf"
        othread = TweeterThread.objects.create_thread(short_message, messages)
        self.factory = RequestFactory()
        request = self.factory.get('/tweeter/v1/thread/2/')
        chain_messages_api = ChainMessages()
        response = chain_messages_api.get(request, othread.pk)
        json_data = json.loads(response.content)
        self.assertEqual(1, len(json_data["items"]))
        self.assertEqual("I am a wolf", json_data["items"][0]["message"])
        messages = ["I am a wolf{0}".format(i) for i in range(5)]
        short_message = "I am a wolf"
        othread = TweeterThread.objects.create_thread(short_message, messages)
        request = self.factory.get('/tweeter/v1/thread/2/')
        chain_messages_api = ChainMessages()
        response = chain_messages_api.get(request, othread.pk)
        json_data = json.loads(response.content)
        self.assertEqual(5, len(json_data["items"]))

class TestThreadsAPI(TestCase):
    """
        Test Threads View.

        this tests both get and post request.
    """
    def test_create_thread_with_no_short_message(self):
        """
        trying to create thread and message with no short message
        """
        self.factory = RequestFactory()
        short_message = ""
        messages = ["1","2"]
        json_data = {"short_message": short_message, "messages": messages}
        request = self.factory.post("/tweeter/v1/messages/",
            data=json.dumps(json_data),
            content_type="application/json"
            )
        thread_api_post = Threads()
        response = thread_api_post.post(request)
        json_data = json.loads(response.content)
        self.assertEqual(["Snippet is empty"], json_data["errors"])

    def test_create_thread_with_no_messages(self):
        """
            try to create with no messages
        """
        self.factory = RequestFactory()
        short_message = "I am a wolf"
        messages = []
        json_data = {"short_message": short_message, "messages": messages}
        request = self.factory.post("/tweeter/v1/messages/",
            data=json.dumps(json_data),
            content_type="application/json"
            )
        thread_api_post = Threads()
        response = thread_api_post.post(request)
        json_data = json.loads(response.content)
        self.assertEqual(["There are no messages"], json_data["errors"])

    def test_create_thread_with_large_short_message(self):
        """
            try to create with large short message
        """
        self.factory = RequestFactory()
        short_message = "I" * 100
        messages = ["as"]
        json_data = {"short_message": short_message, "messages": messages}
        request = self.factory.post("/tweeter/v1/messages/",
            data=json.dumps(json_data),
            content_type="application/json"
            )
        thread_api_post = Threads()
        response = thread_api_post.post(request)
        json_data = json.loads(response.content)
        self.assertEqual(["Snippet is above 20 charaters"], json_data["errors"])

    def test_create_thread_with_multiple_errors(self):
        """
            try to create with multiple errors
        """
        self.factory = RequestFactory()
        short_message = "I" * 100
        messages = []
        json_data = {"short_message": short_message, "messages": messages}
        request = self.factory.post("/tweeter/v1/messages/",
            data=json.dumps(json_data),
            content_type="application/json"
            )
        thread_api_post = Threads()
        response = thread_api_post.post(request)
        json_data = json.loads(response.content)
        self.assertEqual(
            ["Snippet is above 20 charaters", "There are no messages"],
            json_data["errors"])

    def test_create_with_valid_data(self):
        """
        Trying to create thread with valid data.
        """
        self.factory = RequestFactory()
        messages = ["I am a wolf"]
        short_message = "I am a wolf"
        json_data = {"short_message": short_message, "messages": messages}
        request = self.factory.post("/tweeter/v1/messages/",
            data=json.dumps(json_data),
            content_type="application/json"
            )
        thread_api_post = Threads()
        response = thread_api_post.post(request)
        self.assertEqual(response.status_code, 200)
        json_data = json.loads(response.content)
        messages = ["I am a wolf" for i in range(2)]
        short_message = "I am a wolf"
        json_data = {"short_message": short_message, "messages": messages}
        request = self.factory.post("/tweeter/v1/messages/",
            data=json.dumps(json_data),
            content_type="application/json"
            )
        thread_api_post = Threads()
        response = thread_api_post.post(request)
        self.assertEqual(response.status_code, 200)

    def test_get_all_thread(self):
        """Trying to get all thread"""
        self.factory = RequestFactory()
        request = self.factory.get("/tweeter/v1/messages/")
        thread_api_get = Threads()
        response = thread_api_get.get(request)
        self.assertEqual(response.status_code, 200)
        json_data = json.loads(response.content)
        self.assertEqual(0, len(json_data["items"]))
        messages = ["I am a wolf"]
        short_message = "I am a wolf"
        othread = TweeterThread.objects.create_thread(short_message, messages)
        response = thread_api_get.get(request)
        self.assertEqual(response.status_code, 200)
        json_data = json.loads(response.content)
        self.assertEqual(1, len(json_data["items"]))
